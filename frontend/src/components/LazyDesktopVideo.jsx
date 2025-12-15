// LazyDesktopVideo.jsx
import { useEffect, useRef } from 'react';

const LazyDesktopVideo = ({ onError, onLoad, className }) => {
  const videoRef = useRef(null);
  const DESKTOP_VIDEO = import.meta.env.VITE_DESKTOP_VIDEO
  
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
      preload="metadata"
      className={className}
      onError={onError} // Add this line
      poster="/public/fallback.png"
    >
      <source
        src={DESKTOP_VIDEO}
        type="video/mp4"
      />
    </video>
  );
};

export default LazyDesktopVideo;