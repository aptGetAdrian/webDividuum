import { useEffect, useRef } from 'react';

const LazyDesktopVideo = ({ onError, onLoad, className }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', onLoad);
      video.addEventListener('error', onError);
      
      return () => {
        video.removeEventListener('loadeddata', onLoad);
        video.removeEventListener('error', onError);
      };
    }
  }, [onLoad, onError]);

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
    >
      <source
        src="/assets/desktop-video.mp4"
        type="video/mp4"
      />
    </video>
  );
};

export default LazyDesktopVideo;