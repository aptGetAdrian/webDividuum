import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './FeaturedGuests.css';
import CircularGallery from '/src/blocks/Components/CircularGallery/CircularGallery.jsx'

const FeaturedGuests = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const guests = [
    {
      image: '/assets/guests/viktorMarkelj2.png',
      link: 'https://www.youtube.com/watch?v=NpdTZQ3u2_Q',
      description: '/assets/guests/viktorMarkelj_opis.png'
    },
    {
      image: '/assets/guests/matejSkoliber2.png',
      link: 'https://www.youtube.com/watch?v=ub_pnkapdxo',
      description: '/assets/guests/matejSkoliber_opis.png'
    },
    {
      image: '/assets/guests/damijanJanzekovic2.png',
      link: 'https://www.youtube.com/watch?v=AkM8cE0vj7c',
      description: '/assets/guests/damijanJanzekovic_opis.png'
    },
    {
      image: '/assets/guests/gregaIvancic.png',
      link: 'https://www.youtube.com/watch?v=XJ8QTTpcj5E',
      description: '/assets/guests/gregaIvancic_opis.png'
    },
    {
      image: '/assets/guests/ivanRihtaric2.png',
      link: 'https://www.youtube.com/watch?v=ptYK6YBr1hc',
      description: '/assets/guests/ivanRihtaric_opis.png'
    },
    {
      image: '/assets/guests/alesMaver2.png',
      link: 'https://www.youtube.com/watch?v=4W448Sls-yg',
      description: '/assets/guests/alesMaver_opis.png'
    },
    {
      image: '/assets/guests/andrejStremfelj2.png',
      link: 'https://www.youtube.com/watch?v=Mm1Nveb-c44',
      description: '/assets/guests/andrejStremfelj_opis.png'
    },
    {
      image: '/assets/guests/goranSrok2.png',
      link: 'https://www.youtube.com/watch?v=jZTkqyXzgpI',
      description: '/assets/guests/goranSrok_opis.png'
    },
    {
      image: '/assets/guests/igorPlohl2.png',
      link: 'https://www.youtube.com/watch?v=g8pRKA66VS0',
      description: '/assets/guests/igorPlohl_opis.png'
    },
    {
      image: '/assets/guests/martinBele.png',
      link: 'https://www.youtube.com/watch?v=g8pRKA66VS0',
      description: '/assets/guests/martinBele_opis.png'
    },
  ];


  return (
    <section className="featured-guests section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        PRETEKLI GOSTJE:
      </motion.h2>

      <div style={{ height: '600px', position: 'relative' }}>
        <CircularGallery
          scrollSpeed={isMobile ? 2.5 : 1.5}
          bend={0.4}
          textColor="#12353e"
          borderRadius={0.05}
          scrollEase={isMobile ? 0.05 : 0.025}
          items={guests}
          font="bold 24px 'Comic Sans MS', cursive, sans-serif"
        />
      </div>
    </section>
  );
};

export default FeaturedGuests;