// Hero.jsx

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import './Hero.css';
import { useGlitch } from 'react-powerglitch';

// Lazy-loaded components
const LazyDesktopVideo = lazy(() => import('./LazyDesktopVideo'));
const LazyMobileVideo = lazy(() => import('./LazyMobileVideo'));

const Hero = () => {
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSecondImage, setShowSecondImage] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showInitialLoader, setShowInitialLoader] = useState(false); // 👈 New for mobile first-load
  const [isGlitchPlaying, setIsGlitchPlaying] = useState(false);

  const heroRef = useRef(null);
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

    </>
  );
};

export default Hero;
