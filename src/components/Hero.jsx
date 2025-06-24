import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [latestVideoId, setLatestVideoId] = useState('YOUR_VIDEO_ID'); // fallback
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  // Replace with your actual values
  const YOUTUBE_API_KEY = "AIzaSyCm-rssnRQLky7FWziD2cIm9K9jcneTu44";
  const CHANNEL_ID = 'UCOgRR3LGKA2VIqbgmIer9JQ'; 

  useEffect(() => {
    const fetchLatestMainVideo = async () => {
      try {
        // First, get the channel's uploads playlist ID
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${CHANNEL_ID}&part=contentDetails`
        );
        const channelData = await channelResponse.json();
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        
        // Get recent videos from uploads playlist
        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=10`
        );
        const playlistData = await playlistResponse.json();
        
        if (playlistData.items && playlistData.items.length > 0) {
          // Get video IDs to check durations
          const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');
          
          // Fetch video details including duration
          const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,snippet`
          );
          
          const detailsData = await detailsResponse.json();
          
          // Filter out Shorts (videos under 61 seconds)
          const mainVideos = detailsData.items.filter(video => {
            const duration = video.contentDetails.duration;
            // Parse ISO 8601 duration (PT1M30S format)
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            const hours = parseInt(match[1] || 0);
            const minutes = parseInt(match[2] || 0);
            const seconds = parseInt(match[3] || 0);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            
            return totalSeconds > 60; // Filter out Shorts
          });
          
          if (mainVideos.length > 0) {
            const latestMainVideo = mainVideos[0]; // Already sorted by upload date
            const videoId = latestMainVideo.id;
            const snippet = latestMainVideo.snippet;
            
            setLatestVideoId(videoId);
            setVideoData({
              id: videoId,
              title: snippet.title,
              description: snippet.description,
              thumbnail: snippet.thumbnails.maxres?.url || 
                        snippet.thumbnails.high?.url || 
                        snippet.thumbnails.medium?.url ||
                        snippet.thumbnails.default?.url,
              publishedAt: snippet.publishedAt
            });
          }
        }
      } catch (error) {
        console.error('Error fetching latest main video:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (YOUTUBE_API_KEY && CHANNEL_ID) {
      fetchLatestMainVideo();
    } else {
      setLoading(false);
    }
  }, [YOUTUBE_API_KEY, CHANNEL_ID]);
  

  const handlePlayClick = () => {
    setShowVideo(true);
  };

  return (
    <section className="hero">
      {/* Background Video */}
      <div className="hero-background-video">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="background-video"
        >
          <source src="/assets/2xjgrOESzPPE6fTBRWcUtOQX5d2.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Film Grain Overlay */}
      <div className="film-grain"></div>
      
      {/* Dark Overlay */}
      <div className="hero-overlay"></div>
      
      <div className="container hero-content">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>INDIVIDUUM
            PODCAST</h1>
          <p>Raziskujemo zgodbe, delimo znanje in povezujemo ljudi</p>
          <button className="btn btn-primary">Poslušaj Zdaj</button>
        </motion.div>
        
        <motion.div 
          className="hero-video"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="video-container">
            {loading ? (
              <div className="loading-placeholder">Loading latest video...</div>
            ) : showVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${latestVideoId}?autoplay=1`}
                title="Latest Podcast Episode"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="video-thumbnail" onClick={handlePlayClick}>
                <img 
                  src={`https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`}
                  alt={videoData?.title || "Latest video thumbnail"}
                  className="thumbnail-image"
                />
                <div className="play-button-overlay">
                  <svg 
                    className="play-icon" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                {videoData && (
                  <div className="video-info-overlay">
                    <h3 className="video-title">{videoData.title}</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;