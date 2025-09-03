from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get environment variables - YouTube
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
CHANNEL_ID = os.getenv('YOUTUBE_CHANNEL_ID', 'UCOgRR3LGKA2VIqbgmIer9JQ')

# Get environment variables - SMTP Email
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
TO_EMAIL = os.getenv('TO_EMAIL', 'individuumpodcast@gmail.com')

if not YOUTUBE_API_KEY:
    logger.error("YOUTUBE_API_KEY not found in environment variables")
    raise ValueError("YOUTUBE_API_KEY must be set in environment variables")

def parse_duration(duration_string):
    """Parse YouTube duration string (PT1H2M3S) and return total seconds"""
    import re
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_string)
    if not match:
        return 0
    
    hours = int(match.group(1) or '0')
    minutes = int(match.group(2) or '0')
    seconds = int(match.group(3) or '0')
    
    return hours * 3600 + minutes * 60 + seconds

def fetch_all_videos():
    """Fetch all videos from the channel"""
    try:
        # Get channel's uploads playlist
        channel_url = f"https://www.googleapis.com/youtube/v3/channels"
        channel_params = {
            'key': YOUTUBE_API_KEY,
            'id': CHANNEL_ID,
            'part': 'contentDetails'
        }
        
        channel_response = requests.get(channel_url, params=channel_params)
        channel_response.raise_for_status()
        channel_data = channel_response.json()
        
        if not channel_data.get('items'):
            logger.error("No channel data found")
            return []
        
        uploads_playlist_id = channel_data['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        
        # Fetch all playlist items
        all_items = []
        next_page_token = None
        
        while len(all_items) < 200:  # Limit to 200 videos
            playlist_url = f"https://www.googleapis.com/youtube/v3/playlistItems"
            playlist_params = {
                'key': YOUTUBE_API_KEY,
                'playlistId': uploads_playlist_id,
                'part': 'snippet',
                'maxResults': 50
            }
            
            if next_page_token:
                playlist_params['pageToken'] = next_page_token
            
            playlist_response = requests.get(playlist_url, params=playlist_params)
            playlist_response.raise_for_status()
            playlist_data = playlist_response.json()
            
            all_items.extend(playlist_data.get('items', []))
            next_page_token = playlist_data.get('nextPageToken')
            
            if not next_page_token:
                break
        
        # Limit to 200 videos
        all_items = all_items[:200]
        
        # Get video IDs
        video_ids = [item['snippet']['resourceId']['videoId'] for item in all_items]
        
        # Fetch video details in batches
        all_videos = []
        for i in range(0, len(video_ids), 50):
            batch_ids = video_ids[i:i+50]
            video_url = f"https://www.googleapis.com/youtube/v3/videos"
            video_params = {
                'key': YOUTUBE_API_KEY,
                'id': ','.join(batch_ids),
                'part': 'contentDetails,snippet'
            }
            
            video_response = requests.get(video_url, params=video_params)
            video_response.raise_for_status()
            video_data = video_response.json()
            
            all_videos.extend(video_data.get('items', []))
        
        # Filter out shorts (videos longer than 60 seconds)
        main_episodes = []
        for video in all_videos:
            duration = video.get('contentDetails', {}).get('duration', '')
            total_seconds = parse_duration(duration)
            if total_seconds > 60:
                main_episodes.append(video)
        
        return main_episodes
        
    except requests.RequestException as e:
        logger.error(f"Error fetching videos: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching videos: {e}")
        return []

def fetch_playlists():
    """Fetch all custom playlists and their videos"""
    try:
        # Fetch playlists
        playlists_url = f"https://www.googleapis.com/youtube/v3/playlists"
        playlists_params = {
            'key': YOUTUBE_API_KEY,
            'channelId': CHANNEL_ID,
            'part': 'snippet,contentDetails',
            'maxResults': 50
        }
        
        playlists_response = requests.get(playlists_url, params=playlists_params)
        playlists_response.raise_for_status()
        playlists_data = playlists_response.json()
        
        # Filter out auto-generated playlists
        custom_playlists = [
            playlist for playlist in playlists_data.get('items', [])
            if (playlist['snippet']['title'] != 'Uploads' and 
                playlist['contentDetails']['itemCount'] > 0)
        ]
        
        playlists_with_videos = []
        
        for playlist in custom_playlists:
            try:
                # Fetch playlist items
                playlist_items = []
                next_page_token = None
                
                while True:
                    playlist_items_url = f"https://www.googleapis.com/youtube/v3/playlistItems"
                    playlist_items_params = {
                        'key': YOUTUBE_API_KEY,
                        'playlistId': playlist['id'],
                        'part': 'snippet',
                        'maxResults': 50
                    }
                    
                    if next_page_token:
                        playlist_items_params['pageToken'] = next_page_token
                    
                    playlist_items_response = requests.get(playlist_items_url, params=playlist_items_params)
                    playlist_items_response.raise_for_status()
                    playlist_items_data = playlist_items_response.json()
                    
                    playlist_items.extend(playlist_items_data.get('items', []))
                    next_page_token = playlist_items_data.get('nextPageToken')
                    
                    if not next_page_token:
                        break
                
                if playlist_items:
                    # Get video details
                    video_ids = [item['snippet']['resourceId']['videoId'] for item in playlist_items]
                    playlist_videos = []
                    
                    for i in range(0, len(video_ids), 50):
                        batch_ids = video_ids[i:i+50]
                        video_url = f"https://www.googleapis.com/youtube/v3/videos"
                        video_params = {
                            'key': YOUTUBE_API_KEY,
                            'id': ','.join(batch_ids),
                            'part': 'contentDetails,snippet'
                        }
                        
                        video_response = requests.get(video_url, params=video_params)
                        video_response.raise_for_status()
                        video_data = video_response.json()
                        
                        playlist_videos.extend(video_data.get('items', []))
                    
                    # Filter out shorts
                    filtered_videos = []
                    for video in playlist_videos:
                        duration = video.get('contentDetails', {}).get('duration', '')
                        total_seconds = parse_duration(duration)
                        if total_seconds > 60:
                            filtered_videos.append(video)
                    
                    if filtered_videos:
                        playlist_with_videos = playlist.copy()
                        playlist_with_videos['videos'] = filtered_videos
                        playlists_with_videos.append(playlist_with_videos)
                        
            except requests.RequestException as e:
                logger.error(f"Error fetching playlist {playlist['id']}: {e}")
                continue
            except Exception as e:
                logger.error(f"Unexpected error fetching playlist {playlist['id']}: {e}")
                continue
        
        return playlists_with_videos
        
    except requests.RequestException as e:
        logger.error(f"Error fetching playlists: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching playlists: {e}")
        return []

@app.route('/api/youtube-data', methods=['GET'])
def get_youtube_data():
    """Main endpoint to get all YouTube data"""
    try:
        logger.info("Fetching YouTube data...")
        
        # Fetch episodes and playlists
        episodes = fetch_all_videos()
        playlists = fetch_playlists()
        
        response_data = {
            'episodes': episodes,
            'playlists': playlists
        }
        
        logger.info(f"Successfully fetched {len(episodes)} episodes and {len(playlists)} playlists")
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error in get_youtube_data: {e}")
        return jsonify({
            'error': 'Failed to fetch YouTube data',
            'episodes': [],
            'playlists': []
        }), 500

@app.route('/api/latest-video', methods=['GET'])
def get_latest_video():
    """Get the latest main video (not a short) from the channel"""
    try:
        logger.info("Fetching latest video...")
        
        # Get channel's uploads playlist
        channel_url = f"https://www.googleapis.com/youtube/v3/channels"
        channel_params = {
            'key': YOUTUBE_API_KEY,
            'id': CHANNEL_ID,
            'part': 'contentDetails'
        }
        
        channel_response = requests.get(channel_url, params=channel_params)
        channel_response.raise_for_status()
        channel_data = channel_response.json()
        
        if not channel_data.get('items'):
            logger.error("No channel data found")
            return jsonify({'error': 'Channel not found'}), 404
        
        uploads_playlist_id = channel_data['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        
        # Get recent videos from uploads playlist
        playlist_url = f"https://www.googleapis.com/youtube/v3/playlistItems"
        playlist_params = {
            'key': YOUTUBE_API_KEY,
            'playlistId': uploads_playlist_id,
            'part': 'snippet',
            'maxResults': 30
        }
        
        playlist_response = requests.get(playlist_url, params=playlist_params)
        playlist_response.raise_for_status()
        playlist_data = playlist_response.json()
        
        if not playlist_data.get('items'):
            logger.error("No videos found in playlist")
            return jsonify({'error': 'No videos found'}), 404
        
        # Get video IDs to check durations
        video_ids = [item['snippet']['resourceId']['videoId'] for item in playlist_data['items']]
        
        # Fetch video details including duration
        videos_url = f"https://www.googleapis.com/youtube/v3/videos"
        videos_params = {
            'key': YOUTUBE_API_KEY,
            'id': ','.join(video_ids),
            'part': 'contentDetails,snippet'
        }
        
        videos_response = requests.get(videos_url, params=videos_params)
        videos_response.raise_for_status()
        videos_data = videos_response.json()
        
        # Filter out Shorts (videos under 61 seconds)
        main_videos = []
        for video in videos_data.get('items', []):
            duration = video.get('contentDetails', {}).get('duration', '')
            total_seconds = parse_duration(duration)
            
            # Debug logging
            logger.info(f"Video: {video['snippet']['title'][:50]}... Duration: {duration} -> {total_seconds}s")
            
            if total_seconds > 120:  # Filter out Shorts
                main_videos.append(video)
                break
        
        logger.info(f"Found {len(main_videos)} main videos out of {len(videos_data.get('items', []))} total videos")
        
        if not main_videos:
            logger.error("No main videos found (all are shorts)")
            return jsonify({'error': 'No main videos found'}), 404
        
        # Get the latest main video (first in the filtered list)
        latest_video = main_videos[0]
        video_id = latest_video['id']
        snippet = latest_video['snippet']
        
        video_data = {
            'id': video_id,
            'title': snippet['title'],
            'description': snippet['description'],
            'thumbnail': (
                snippet['thumbnails'].get('maxres', {}).get('url') or
                snippet['thumbnails'].get('high', {}).get('url') or
                snippet['thumbnails'].get('medium', {}).get('url') or
                snippet['thumbnails'].get('default', {}).get('url')
            ),
            'publishedAt': snippet['publishedAt']
        }
        
        response_data = {
            'videoId': video_id,
            'videoData': video_data
        }
        
        logger.info(f"Successfully fetched latest video: {video_data['title']}")
        return jsonify(response_data)
        
    except requests.RequestException as e:
        logger.error(f"Request error in get_latest_video: {e}")
        return jsonify({
            'error': 'Failed to fetch video data from YouTube',
            'videoId': None,
            'videoData': None
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_latest_video: {e}")
        return jsonify({
            'error': 'Internal server error',
            'videoId': None,
            'videoData': None
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'YouTube API server is running'})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Check if required environment variables are set
    if not YOUTUBE_API_KEY:
        logger.error("YOUTUBE_API_KEY is required")
        exit(1)
    
    logger.info("Starting YouTube API server...")
    logger.info(f"Using Channel ID: {CHANNEL_ID}")
    
    # Run the app
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=os.getenv('DEBUG', 'False').lower() == 'true'
    )