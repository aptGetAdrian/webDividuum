import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { useGlitch } from 'react-powerglitch'
import Particles from '/src/blocks/Backgrounds/Particles/Particles.jsx';

const Hero = () => {
  const [latestVideoId, setLatestVideoId] = useState('YOUR_VIDEO_ID'); // fallback
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSecondImage, setShowSecondImage] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [apiError, setApiError] = useState(null);
  
  // New state for video loading
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const glitch = useGlitch({
    playMode: 'manual',
    timing: { duration: 550, iterations: 1 },
    glitchTimeSpan: { start: 0, end: 1 },
    shake: { velocity: 12, amplitudeX: 0.2, amplitudeY: 0.19 },
    slice: { count: 6, velocity: 15, minHeight: 0.02, maxHeight: 0.15, hueRotate: true },
    pulse: { scale: 1 }
  });

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle video loading
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 200);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoaded(true); // Show content even if video fails
    setTimeout(() => {
      setShowContent(true);
    }, 200);
  };

  // Custom hook to detect scroll
  const useScrollDetection = () => {
    useEffect(() => {
      if (!isMobile) return;

      const handleScroll = () => {
        const currentTime = Date.now();
        const timeSinceLastScroll = currentTime - lastScrollTime;

        if (timeSinceLastScroll > 50) {
          setLastScrollTime(currentTime);
          triggerGlitchAnimation();
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, lastScrollTime]);
  };

  // Function to trigger the glitch animation
  const triggerGlitchAnimation = () => {
    glitch.startGlitch();

    let switchCount = 0;
    const switchInterval = setInterval(() => {
      setShowSecondImage(prev => !prev);
      switchCount++;

      if (switchCount >= 8) {
        clearInterval(switchInterval);
        setShowSecondImage(false);
      }
    }, 70);

    setTimeout(() => {
      glitch.stopGlitch();
      clearInterval(switchInterval);
      setShowSecondImage(false);
    }, 200);
  };

  useScrollDetection();

  useEffect(() => {
    const fetchLatestMainVideo = async () => {
      try {
        setLoading(true);
        setApiError(null);

        const response = await fetch('http://localhost:5000/api/latest-video');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.videoId && data.videoData) {
          setLatestVideoId(data.videoId);
          setVideoData(data.videoData);
        } else {
          console.warn('No latest video found, using fallback');
        }
      } catch (error) {
        console.error('Error fetching latest main video:', error);
        setApiError('Failed to load latest video. Using fallback.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMainVideo();
  }, []);

  const handlePlayClick = () => {
    setShowVideo(true);
  };

  // Desktop hover handlers
  const handleMouseEnter = () => {
    if (!isMobile) {
      glitch.startGlitch();

      let switchCount = 0;
      const switchInterval = setInterval(() => {
        setShowSecondImage(prev => !prev);
        switchCount++;

        if (switchCount >= 8) {
          clearInterval(switchInterval);
          setShowSecondImage(true);
        }
      }, 70);

      setTimeout(() => {
        clearInterval(switchInterval);
        setShowSecondImage(true);
      }, 550);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      glitch.stopGlitch();
      setShowSecondImage(false);
    }
  };

  return (
    <>
      <style jsx>{`
      .hero-banner-image {
        transition: opacity 0.1s ease;
      }
      
      .swap-banner-image {
        opacity: 1;
      }
      
      .swap-banner-image.hidden {
        opacity: 0;
      }
      
      .hover-banner {
        opacity: 0;
      }
      
      .hover-banner.visible {
        opacity: 1;
      }

      /* Loading screen styles */
      .video-loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
      }

      .video-loading-screen.hidden {
        opacity: 0;
        visibility: hidden;
      }

      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top: 3px solid #ffffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
      }

      .loading-text {
        color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        opacity: 0.8;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Hero content animation */
      .hero-content-wrapper {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      }

      .hero-content-wrapper.visible {
        opacity: 1;
        transform: translateY(0);
      }

      @media (max-width: 768px) {
        .banner-image-wrapper:hover .hero-banner-image {
          /* Override any hover effects on mobile */
        }
      }
    `}</style>

      {/* Video Loading Screen */}
      <div className={`video-loading-screen ${showContent ? 'hidden' : ''}`}>
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>

      <section className="hero" ref={heroRef}>
        {/* Background Video or Fallback Image */}
        <div className="hero-background-video">
          {!videoError ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              webkit-playsinline="true"
              preload="auto"
              className="background-video"
              onLoadedData={handleVideoLoaded}
              onCanPlayThrough={handleVideoLoaded}
              onError={handleVideoError}
              key={isMobile ? 'mobile' : 'desktop'}
            >
              {isMobile ? (
                // Mobile video sources
                <>
                  <source
                    src="/assets/mobile-video.mp4"
                    type="video/mp4"
                  />
                  <source
                    src="/assets/videoplayback_1_mobile.webm"
                    type="video/webm"
                  />
                </>
              ) : (
                // Desktop video sources
                <>
                  <source
                    src="/assets/desktop-video.mp4"
                    type="video/mp4"
                  />
                  <source
                    src="/assets/videoplayback_1.webm"
                    type="video/webm"
                  />
                </>
              )}
            </video>
          ) : (
            <img
              src="/assets/videoplayback.00_15_09_07.Still001.png"
              alt="Background"
              className="background-video"
              onLoad={handleVideoLoaded}
              onError={handleVideoError}
            />
          )}
        </div>

        {/* Film Grain Overlay */}
        <div className="film-grain"></div>

        {/* Dark Overlay */}
        <div className="hero-overlay"></div>

        <div className={`container hero-content hero-content-wrapper ${showContent ? 'visible' : ''}`}>
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: showContent ? 0.3 : 0 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '150%', minHeight: '350px', paddingTop: '40px' }}
          >
            <div className="banner-image-wrapper" style={{ width: '150%', maxWidth: '1800px', margin: '0 auto', display: 'block', position: 'relative' }}>
              <a
                href="https://www.youtube.com/@IndividuumPodcast"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', width: '100%', height: '100%' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src="/assets/bannerText01-150.png"
                  alt="Individuum Podcast Banner"
                  className={`hero-banner-image swap-banner-image ${showSecondImage ? 'hidden' : ''}`}
                  style={{ width: '100%', height: 'auto', display: 'block', margin: 0, position: 'relative', zIndex: 2 }}
                  ref={glitch.ref}
                />
                <img
                  src="/assets/bannerText02-150.png"
                  alt="Individuum Podcast Banner Hover"
                  className={`hero-banner-image hover-banner ${showSecondImage ? 'visible' : ''}`}
                  style={{ width: '100%', height: 'auto', display: 'block', margin: 0, position: 'absolute', left: 0, top: 0, zIndex: 3 }}
                  ref={glitch.ref}
                />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={`hero-second hero-content-wrapper ${showContent ? 'visible' : ''}`}>
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
            whileInView={showContent ? {
              opacity: 1,
              y: 0,
              scale: 1
            } : {
              opacity: 0,
              y: 30,
              scale: 0.95
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            viewport={{ once: true }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: showContent ? 0.2 : 0 }}
              viewport={{ once: true }}
            >
              INDIVIDUUM PODKAST
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: showContent ? 0.3 : 0 }}
              viewport={{ once: true }}
            >
              Raziskujemo zgodbe, delimo znanje in povezujemo ljudi
            </motion.p>
            <motion.a
              href="https://linktr.ee/individuumpodcast"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: showContent ? 0.4 : 0 }}
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
            whileInView={showContent ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 30
            }}
            transition={{
              duration: 0.6,
              delay: showContent ? 0.3 : 0,
              ease: "easeOut"
            }}
            viewport={{ once: true }}
          >
            <div className="video-container-second">
              {loading ? (
                <div className="loading-placeholder-second">
                  {apiError ? (
                    <div style={{ color: '#ff6b6b', textAlign: 'center' }}>
                      <p>{apiError}</p>
                      <button
                        onClick={() => window.location.reload()}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(255, 107, 107, 0.2)',
                          color: '#ff6b6b',
                          border: '1px solid rgba(255, 107, 107, 0.3)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginTop: '0.5rem'
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    'Loading latest video...'
                  )}
                </div>
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
                    src={videoData?.thumbnail || `https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`}
                    alt={videoData?.title || "Latest video thumbnail"}
                    className="thumbnail-image-second"
                  />
                  <div className="play-button-overlay-second">
                    <svg className="play-icon-second" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  {videoData && (
                    <div className="video-info-overlay-second mobile-video-info">
                      <h3 className="video-title-second">{videoData.title}</h3>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            alphaParticles={true}
            disableRotation={false}
            particleHoverFactor={0.2}
          />
        </div>
      </section>
    </>
  );
};

export default Hero;