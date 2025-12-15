import { useEffect, forwardRef } from 'react';

const LazyMobileVideo = forwardRef(({ onError, onLoad, className }, ref) => {
  const MOBILE_VIDEO = import.meta.env.VITE_MOBILE_VIDEO;

  useEffect(() => {
    if (!ref || !ref.current) return;
    const video = ref.current;

    const handleLoad = () => onLoad?.();
    const handleError = () => onError?.();

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
    };
  }, [ref, onLoad, onError]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      webkit-playsinline="true"
      preload="auto"
      className={className}
      onError={onError}
      poster="/assets/fallback-mobile.png"
      style={{ backgroundColor: 'black' }}
    >
      <source src={MOBILE_VIDEO} type="video/mp4" />
    </video>
  );
});

export default LazyMobileVideo;