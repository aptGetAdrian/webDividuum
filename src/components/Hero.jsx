import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { useGlitch } from 'react-powerglitch'


const Hero = () => {
  const [latestVideoId, setLatestVideoId] = useState('YOUR_VIDEO_ID'); // fallback
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const glitch = useGlitch({
    playMode: 'hover',
    timing: { duration: 550, iterations: 1 },
    glitchTimeSpan: { start: 0, end: 1 },
    shake: { velocity: 12, amplitudeX: 0.2, amplitudeY: 0.19 },
    slice: { count: 6, velocity: 15, minHeight: 0.02, maxHeight: 0.15, hueRotate: true },
    pulse: { scale: 1 }
  });

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
    <>


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
          <source src="/assets/videoplayback_1.webm" type="video/mp4" />
        </video>
      </div>
      
      {/* Film Grain Overlay */}
      <div className="film-grain"></div>
      
      {/* Dark Overlay */}
      <div className="hero-overlay"></div>
      
      <div className="container hero-content">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '150%', minHeight: '350px', paddingTop: '40px' }}
        >
          <div className="banner-image-wrapper" style={{ width: '150%', maxWidth: '1800px', margin: '0 auto', display: 'block', position: 'relative' }}>
            <a href="https://www.youtube.com/@IndividuumPodcast" target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
              <img 
                src="/assets/bannerText01-150.png" 
                alt="Individuum Podcast Banner" 
                className="hero-banner-image swap-banner-image"
                style={{ width: '100%', height: 'auto', display: 'block', margin: 0, position: 'relative', zIndex: 2 }}
                ref={glitch.ref}
              />
              <img
                src="/assets/bannerText02-150.png"
                alt="Individuum Podcast Banner Hover"
                className="hero-banner-image hover-banner"
                style={{ width: '100%', height: 'auto', display: 'block', margin: 0, position: 'absolute', left: 0, top: 0, zIndex: 3 }}
                ref={glitch.ref}
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="hero-second">
      <div className="hero-background-video-second">
        <img
          src="/assets/backgroundimaheM.png"
          alt="Background"
          className="background-image-second"
        />
      </div>
      
      <div className="film-grain-second"></div>
      <div className="hero-overlay-second"></div>
      
      <div className="container hero-content-second">
        <motion.div 
          className="hero-text-second"
          initial={{ 
            opacity: 0, 
            y: 30,
            scale: 0.95
          }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            scale: 1
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
          viewport={{ once: true }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            INDIVIDUUM PODKAST
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Raziskujemo zgodbe, delimo znanje in povezujemo ljudi
          </motion.p>
          <motion.a 
            href="https://linktr.ee/individuumpodcast" 
            target="_blank" 
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <button className="btn-primary-second">Poslušaj zdaj</button>
          </motion.a>
        </motion.div>
        
        <motion.div 
          className="hero-video-second"
          initial={{ 
            opacity: 0, 
            y: 30
          }}
          whileInView={{ 
            opacity: 1, 
            y: 0
          }}
          transition={{ 
            duration: 0.6,
            delay: 0.3,
            ease: "easeOut"
          }}
          viewport={{ once: true }}
        >
          <div className="video-container-second">
            {loading ? (
              <div className="loading-placeholder-second">Loading latest video...</div>
            ) : showVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${latestVideoId}?autoplay=1`}
                title="Latest Podcast Episode"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe-second"
              ></iframe>
            ) : (
              <div className="video-thumbnail-second" onClick={handlePlayClick}>
                <img 
                  src={`https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`}
                  alt={videoData?.title || "Latest video thumbnail"}
                  className="thumbnail-image-second"
                />
                <div className="play-button-overlay-second">
                  <svg className="play-icon-second" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                {videoData && (
                  <div className="video-info-overlay-second">
                    <h3 className="video-title-second">{videoData.title}</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>

    </>
  );
};

export default Hero;