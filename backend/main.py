from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging
import json
import threading
import time

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

# Single cache file path
CACHE_FILE = '/tmp/youtube_cache.json'

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


def load_cache():
    """Load cache from file"""
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"Error loading cache: {e}")
    
    return {
        'videos': [],
        'playlists': [],
        'latest_video': None
    }


def save_cache(cache_data):
    """Save cache to file"""
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cache_data, f, indent=2, ensure_ascii=False)
        logger.info("Cache saved successfully")
    except IOError as e:
        logger.error(f"Error saving cache: {e}")


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
        
        while len(all_items) < 1000:  # Limit to 200 videos
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
        
        # Filter out shorts (videos longer than 300 seconds)
        main_episodes = []
        for video in all_videos:
            duration = video.get('contentDetails', {}).get('duration', '')
            total_seconds = parse_duration(duration)
            if total_seconds > 300:
                main_episodes.append(video)

        logger.info(f"Fetched {len(main_episodes)} videos")
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
        
        logger.info(f"Fetched {len(playlists_with_videos)} playlists")
        return playlists_with_videos
        
    except requests.RequestException as e:
        logger.error(f"Error fetching playlists: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching playlists: {e}")
        return []


def fetch_latest_video():
    """Fetch the latest video"""
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
            return None
        
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
            return None
        
        # Get video IDs to check durations
        video_ids = [item['snippet']['resourceId']['videoId'] for item in playlist_data['items']]
        
        # Fetch video details including duration
        videos_url = f"https://www.googleapis.com/youtube/v3/videos"
        videos_params = {
            'key': YOUTUBE_API_KEY,
            'id': ','.join(video_ids),
            'part': 'contentDetails,snippet,statistics'
        }
        
        videos_response = requests.get(videos_url, params=videos_params)
        videos_response.raise_for_status()
        videos_data = videos_response.json()
        
        # Filter out Shorts (videos under 120 seconds) and find the latest main video
        latest_main_video = None
        for video in videos_data.get('items', []):
            duration = video.get('contentDetails', {}).get('duration', '')
            total_seconds = parse_duration(duration)
            
            if total_seconds > 120:  # Filter out Shorts
                latest_main_video = video
                break  # First one is the latest
        
        if not latest_main_video:
            logger.error("No main videos found (all are shorts)")
            return None
        
        # Prepare video data
        video_id = latest_main_video['id']
        snippet = latest_main_video['snippet']
        statistics = latest_main_video.get('statistics', {})
        
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
            'publishedAt': snippet['publishedAt'],
            'viewCount': statistics.get('viewCount', '0'),
            'likeCount': statistics.get('likeCount', '0'),
            'commentCount': statistics.get('commentCount', '0'),
            'duration': latest_main_video['contentDetails']['duration'],
        }
        
        latest_video_data = {
            'videoId': video_id,
            'videoData': video_data,
        }
        
        logger.info(f"Fetched latest video: {video_data['title']}")
        return latest_video_data
        
    except Exception as e:
        logger.error(f"Error fetching latest video: {e}")
        return None


def refresh_all_data():
    """Refresh all data and save to single cache file"""
    logger.info("Starting data refresh...")
    
    videos = fetch_all_videos()
    playlists = fetch_playlists()
    latest_video = fetch_latest_video()
    
    cache_data = {
        'videos': videos,
        'playlists': playlists,
        'latest_video': latest_video,
        'last_updated': time.time()
    }
    
    save_cache(cache_data)
    logger.info("Data refresh completed")
    return cache_data


@app.route('/api/refresh', methods=['POST', 'GET'])
def refresh_data():
    try:
        cache_data = refresh_all_data()
        return jsonify({
            "status": "ok",
            "message": "YouTube cache refreshed",
            "stats": {
                "videos": len(cache_data['videos']),
                "playlists": len(cache_data['playlists']),
                "latest_video": cache_data['latest_video']['videoId'] if cache_data['latest_video'] else None
            }
        })
    except Exception as e:
        logger.error(f"Error refreshing data: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/youtube-data', methods=['GET'])
def get_youtube_data():
    """Main endpoint to get all YouTube data"""
    try:
        logger.info("Fetching YouTube data...")
        cache_data = load_cache()
        
        episodes = cache_data.get('videos', [])
        playlists = cache_data.get('playlists', [])
        
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
    """Get the latest main video from cache"""
    try:
        cache_data = load_cache()
        latest_video = cache_data.get('latest_video')
        
        if not latest_video:
            logger.warning("Latest video not found in cache, fetching fresh data...")
            latest_video = fetch_latest_video()
            if latest_video:
                cache_data['latest_video'] = latest_video
                save_cache(cache_data)
            else:
                return jsonify({'error': 'No latest video found'}), 404
        
        logger.info(f"Returning latest video: {latest_video['videoData']['title']}")
        return jsonify(latest_video)
        
    except Exception as e:
        logger.error(f"Unexpected error in get_latest_video: {e}")
        # Try to fetch fresh data as fallback
        latest_video = fetch_latest_video()
        if latest_video:
            return jsonify(latest_video)
        return jsonify({
            'error': 'Internal server error',
            'videoId': None,
            'videoData': None
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    cache_data = load_cache()
    return jsonify({
        'status': 'healthy',
        'message': 'YouTube API server is running',
        'cache_stats': {
            'videos': len(cache_data.get('videos', [])),
            'playlists': len(cache_data.get('playlists', [])),
            'latest_video': bool(cache_data.get('latest_video')),
            'last_updated': cache_data.get('last_updated')
        }
    })


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
    
    # Start initial data fetch in background thread
    cache_data = load_cache()
    if not cache_data.get('videos') or not cache_data.get('playlists'):
        logger.info("No cached data found, fetching in background...")
        threading.Thread(target=refresh_all_data, daemon=True).start()
    else:
        logger.info("Using cached data from previous run")
        # Optionally refresh in background
        threading.Thread(target=refresh_all_data, daemon=True).start()
    
    logger.info("Starting YouTube API server...")
    logger.info(f"Using Channel ID: {CHANNEL_ID}")
    logger.info(f"Cache file: {CACHE_FILE}")
    
    # Run the app
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=os.getenv('DEBUG', 'False').lower() == 'true'
    )