// Hero.jsx

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import './Hero.css';
import { useGlitch } from 'react-powerglitch';
import Particles from '/src/blocks/Backgrounds/Particles/Particles.jsx';

// Lazy-loaded components
const LazyDesktopVideo = lazy(() => import('./LazyDesktopVideo'));
const LazyMobileVideo = lazy(() => import('./LazyMobileVideo'));

const Hero = () => {
  const [latestVideoId, setLatestVideoId] = useState('YOUR_VIDEO_ID');
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSecondImage, setShowSecondImage] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showInitialLoader, setShowInitialLoader] = useState(false); // 👈 New for mobile first-load
  const [isGlitchPlaying, setIsGlitchPlaying] = useState(false);

  const heroRef = useRef(null);
  const API_ADDRESS = import.meta.env.VITE_API_ADDRESS;
  const videoRef = useRef(null);

  const glitch = useGlitch({
    playMode: 'manual',
    timing: { duration: 550, iterations: 1 },
    glitchTimeSpan: { start: 0, end: 1 },
    shake: { velocity: 12, amplitudeX: 0.2, amplitudeY: 0.19 },
    slice: { count: 6, velocity: 15, minHeight: 0.02, maxHeight: 0.15, hueRotate: true },
    pulse: { scale: 1 },
  });

  // ✅ Detect mobile devices
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Check if video has loaded once before (session-based)
  useEffect(() => {
    const hasLoadedVideoBefore = sessionStorage.getItem('mobileVideoLoaded');
    if (isMobile && !hasLoadedVideoBefore) {
      setShowInitialLoader(true);
    }
  }, [isMobile]);

  // ✅ Handle video load & store session flag
  const handleVideoLoad = () => {
    setVideoLoaded(true);

    // ✅ Try to autoplay after load
    if (isMobile && videoRef.current) {
      const video = videoRef.current;

      const tryPlay = async () => {
        try {
          await video.play();
          console.log('Mobile video autoplayed successfully');
        } catch (err) {
          console.warn('Autoplay blocked, showing play icon instead:', err);
        }
      };

      tryPlay();

      // Mark session loaded and hide loader
      sessionStorage.setItem('mobileVideoLoaded', 'true');
      setTimeout(() => setShowInitialLoader(false), 500);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setShowInitialLoader(false);
  };

  // ✅ Fetch latest podcast video from backend
  useEffect(() => {
    const fetchLatestMainVideo = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const response = await fetch(`${API_ADDRESS}/api/latest-video`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.videoId && data.videoData) {
          setLatestVideoId(data.videoId);
          setVideoData(data.videoData);
        } else {
          console.warn('No latest video found, using fallback');
        }
      } catch (err) {
        console.error('Error fetching latest main video:', err);
        setApiError('Failed to load latest video. Using fallback.');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestMainVideo();
  }, []);

  // ✅ Preload mobile video (helps caching between navigations)
  useEffect(() => {
    if (!isMobile) return;
    const MOBILE_VIDEO = import.meta.env.VITE_MOBILE_VIDEO;
    fetch(MOBILE_VIDEO, { cache: 'force-cache' }).catch(() => {});
  }, [isMobile]);

  // ✅ Glitch animation logic
  const triggerGlitchAnimation = () => {
    if (isGlitchPlaying) return;
    setIsGlitchPlaying(true);
    glitch.startGlitch();
    let switchCount = 0;
    const switchInterval = setInterval(() => {
      setShowSecondImage((prev) => !prev);
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
      setTimeout(() => setIsGlitchPlaying(false), 200);
    }, 550);
  };

  // ✅ Scroll detection (mobile)
  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const currentTime = Date.now();
      const timeSinceLastScroll = currentTime - lastScrollTime;
      if (timeSinceLastScroll > 300 && !isGlitchPlaying) {
        setLastScrollTime(currentTime);
        triggerGlitchAnimation();
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, lastScrollTime, isGlitchPlaying]);

  // ✅ Hover glitch (desktop)
  const handleMouseEnter = () => {
    if (!isMobile && !isGlitchPlaying) {
      setIsGlitchPlaying(true);
      glitch.startGlitch();
      let switchCount = 0;
      const switchInterval = setInterval(() => {
        setShowSecondImage((prev) => !prev);
        switchCount++;
        if (switchCount >= 8) {
          clearInterval(switchInterval);
          setShowSecondImage(true);
        }
      }, 70);
      setTimeout(() => {
        clearInterval(switchInterval);
        setShowSecondImage(true);
        setIsGlitchPlaying(false);
      }, 550);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      glitch.stopGlitch();
      setShowSecondImage(false);
      setIsGlitchPlaying(false);
    }
  };

  const handlePlayClick = () => setShowVideo(true);

  return (
    <>
      {/* ✅ Mobile first-time loader overlay */}
      {showInitialLoader && (
        <div className="mobile-loader-screen">
          <div className="loader-content">
            <p>Loading...</p>
            <div className="loader-spinner"></div> {/* 👈 Add this */}
          </div>
        </div>
      )}

      <section className={`hero ${showInitialLoader ? 'hidden' : ''}`} ref={heroRef}>
        {/* Background Video */}
        <div className="hero-background-video">
          {videoError ? (
            <img
              src={isMobile ? '/assets/fallback-mobile.png' : '/assets/fallback.png'}
              alt="Background"
              className="background-video"
            />
          ) : (
            <Suspense
              fallback={
                <div className="video-loading-placeholder">
                  <img
                    src="/assets/fallback.png"
                    alt="Background"
                    className="background-video"
                  />
                </div>
              }
            >
              {isMobile ? (
                <LazyMobileVideo
                  ref={videoRef}
                  onError={handleVideoError}
                  onLoad={handleVideoLoad}
                  className={`background-video ${videoLoaded ? 'video-loaded' : 'video-loading'}`}
                />
              ) : (
                <LazyDesktopVideo
                  onError={handleVideoError}
                  onLoad={() => setVideoLoaded(true)}
                  className={`background-video ${videoLoaded ? 'video-loaded' : 'video-loading'}`}
                />
              )}
            </Suspense>
          )}
        </div>

        {/* Film Grain + Overlays */}
        <div className="film-grain"></div>
        <div className="hero-overlay"></div>

        {/* Banner Text */}
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '150%',
              minHeight: '350px',
              paddingTop: '40px',
            }}
          >
            <div
              className="banner-image-wrapper"
              style={{
                width: '150%',
                maxWidth: '1800px',
                margin: '0 auto',
                display: 'block',
                position: 'relative',
              }}
            >
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
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: 0,
                    position: 'relative',
                    zIndex: 2,
                  }}
                  ref={glitch.ref}
                />
                <img
                  src="/assets/bannerText02-150.png"
                  alt="Individuum Podcast Banner Hover"
                  className={`hero-banner-image hover-banner ${showSecondImage ? 'visible' : ''}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: 0,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 3,
                  }}
                  ref={glitch.ref}
                />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Second Section */}
      <section className="hero-second">
        <div className="container hero-content-second">
          <motion.div
            className="hero-text-second"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              INDIVIDUUM PODCAST
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Daj vsaki zgodbi priložnost...
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
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
                          marginTop: '0.5rem',
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <h3 style={{ color: '#bbbabaff', textAlign: 'center', marginTop: '55%' }}>
                      Loading latest video...
                    </h3>
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
                    src={
                      videoData?.thumbnail ||
                      `https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`
                    }
                    alt={videoData?.title || 'Latest video thumbnail'}
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
