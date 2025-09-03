import { motion } from 'framer-motion';
import './FeaturedGuests.css';
import CircularGallery from '/src/blocks/Components/CircularGallery/CircularGallery.jsx'

const FeaturedGuests = () => {
  const guests = [
    {
      image: '/assets/guests/viktorMarkelj.png',
      link: 'https://www.youtube.com/watch?v=NpdTZQ3u2_Q',
      description: '/assets/guests/viktorMarkelj_opis.png'
    },
    {
      image: '/assets/guests/matejSkoliber.png',
      link: 'https://www.youtube.com/watch?v=ub_pnkapdxo',
      description: '/assets/guests/matejSkoliber_opis.png'
    },
    {
      image: '/assets/guests/damijanJanzekovic.png',
      link: 'https://www.youtube.com/watch?v=AkM8cE0vj7c',
      description: '/assets/guests/damijanJanzekovic_opis.png'
    },
    {
      image: '/assets/guests/gregaIvancic.png',
      link: 'https://www.youtube.com/watch?v=XJ8QTTpcj5E',
      description: '/assets/guests/gregaIvancic_opis.png'
    },
    {
      image: '/assets/guests/ivanRihtaric.png',
      link: 'https://www.youtube.com/watch?v=ptYK6YBr1hc',
      description: '/assets/guests/ivanRihtaric_opis.png'
    },
    {
      image: '/assets/guests/alesMaver.png',
      link: 'https://www.youtube.com/watch?v=4W448Sls-yg',
      description: '/assets/guests/alesMaver_opis.png'
    },
    {
      image: '/assets/guests/andrejStremfelj.png',
      link: 'https://www.youtube.com/watch?v=Mm1Nveb-c44',
      description: '/assets/guests/andrejStremfelj_opis.png'
    },
    {
      image: '/assets/guests/goranSrok.png',
      link: 'https://www.youtube.com/watch?v=jZTkqyXzgpI',
      description: '/assets/guests/goranSrok_opis.png'
    },
    {
      image: '/assets/guests/igorPlohl.png',
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
          Pogovori z gosti kot so:
        </motion.h2>

      <div style={{ height: '600px', position: 'relative' }}>
        <CircularGallery 
        scrollSpeed={1.5} 
        bend={0.4} 
        textColor="#12353e" 
        borderRadius={0.05} 
        scrollEase={0.02} 
        items={guests}
        font="bold 24px 'Comic Sans MS', cursive, sans-serif"
        />
      </div>

      {/* 

      <div className="container">
        
        
        <div className="guests-grid">
          {guests.map((guest) => (
            <a key={guest.id} href={guest.link} target="_blank" rel="noopener noreferrer">
            <motion.div
              key={guest.id}
              className="guest-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="guest-image">
                <img src={guest.image} alt={guest.name} />
              </div>
              <h3>{guest.name}</h3>
            </motion.div>
            </a>
          ))}
        </div>
      </div>

      */}



    </section>
  );
};

export default FeaturedGuests; 