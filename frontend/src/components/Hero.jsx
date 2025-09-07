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
  const heroRef = useRef(null);

  const API_ADDRESS = import.meta.env.VITE_API_ADDRESS;

  const glitch = useGlitch({
    playMode: 'manual', // Changed from 'hover' to 'manual' for mobile control
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

  // Custom hook to detect scroll
  const useScrollDetection = () => {
    useEffect(() => {
      if (!isMobile) return;

      const handleScroll = () => {
        const currentTime = Date.now();
        const timeSinceLastScroll = currentTime - lastScrollTime;

        // Only trigger if enough time has passed since last scroll trigger (throttling)
        if (timeSinceLastScroll > 50) { // 50ms throttle
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
    // Start the glitch effect
    glitch.startGlitch();

    // Create the back-and-forth switching effect
    let switchCount = 0;
    const switchInterval = setInterval(() => {
      setShowSecondImage(prev => !prev);
      switchCount++;

      if (switchCount >= 8) {
        clearInterval(switchInterval);
        // Reset to first image
        setShowSecondImage(false);
      }
    }, 70); // Switch every 70ms for fast back-and-forth effect

    setTimeout(() => {
      glitch.stopGlitch();
      clearInterval(switchInterval);
      setShowSecondImage(false); // Ensure we end on the first image
    }, 200); // Match the duration from glitch config
  };

  // Use the scroll detection hook
  useScrollDetection();

  useEffect(() => {
    const fetchLatestMainVideo = async () => {
      try {
        setLoading(true);
        setApiError(null);

        // Make request to backend API
        const response = await fetch(`${API_ADDRESS}/api/latest-video`);

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
          // Use fallback if no video found
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

  const handleVideoError = () => {
    setVideoError(true);
  };

  // Desktop hover handlers
  const handleMouseEnter = () => {
    if (!isMobile) {
      glitch.startGlitch();

      // Create back-and-forth effect for desktop hover too
      let switchCount = 0;
      const switchInterval = setInterval(() => {
        setShowSecondImage(prev => !prev);
        switchCount++;

        if (switchCount >= 8) {
          clearInterval(switchInterval);
          setShowSecondImage(true); // End on second image for hover
        }
      }, 70);

      setTimeout(() => {
        clearInterval(switchInterval);
        setShowSecondImage(true); // Show second image on hover
      }, 550);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      glitch.stopGlitch();
      setShowSecondImage(false); // Return to first image when not hovering
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

      /* Mobile-specific styling to disable hover effects */
      @media (max-width: 768px) {
        .banner-image-wrapper:hover .hero-banner-image {
          /* Override any hover effects on mobile */
        }
      }
    `}</style>

      <section className="hero" ref={heroRef}>
        {/* Background Video or Fallback Image */}
        <div className="hero-background-video">
          {!videoError ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              webkit-playsinline="true"
              preload="auto"
              className="background-video"
              onError={handleVideoError}
              key={isMobile ? 'mobile' : 'desktop'} // Force re-render when switching
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
            />
          )}
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
                    <h3 style={{ color: '#bbbabaff', textAlign: 'center', marginTop: '55%'}}>Loading latest video... </h3>
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
                  {/* Added mobile-video-info class for desktop only */}
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