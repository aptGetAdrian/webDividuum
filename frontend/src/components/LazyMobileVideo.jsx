// LazyMobileVideo.jsx
import { useEffect, useRef } from 'react';

const LazyMobileVideo = ({ onError, onLoad, className }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoad = () => onLoad?.();
      const handleError = () => onError?.();
      
      video.addEventListener('loadeddata', handleLoad);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('error', handleError);
      };
    }
  }, [onLoad, onError]);

  // Add onError directly to the video element as well
  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      webkit-playsinline="true"
      preload="auto"
      className={className}
      onError={onError} // Add this line
    >
      <source
        src="/assets/mobile-video.mp4"
        type="video/mp4"
      />
    </video>
  );
};

export default LazyMobileVideo;