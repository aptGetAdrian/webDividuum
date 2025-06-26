import { motion } from 'framer-motion';
import './FeaturedGuests.css';

const FeaturedGuests = () => {
  const guests = [
    { id: 1, name: 'Dr. Viktor Markelj', image: '/assets/guests/viktorMarkelj.png', link: 'https://www.youtube.com/watch?v=NpdTZQ3u2_Q' },
    { id: 2, name: 'Matej Skoliber', image: '/assets/guests/matejSkoliber.png', link: 'https://www.youtube.com/watch?v=ub_pnkapdxo' },
    { id: 3, name: 'Damijan Janžekovič', image: '/assets/guests/damijanJanzekovic.png', link: 'https://www.youtube.com/watch?v=AkM8cE0vj7c' },
    { id: 4, name: 'Grega Ivančič', image: '/assets/guests/gregaIvancic.png', link: 'https://www.youtube.com/watch?v=XJ8QTTpcj5E' },
    { id: 5, name: 'Dr. Ivan Rihtarič', image: '/assets/guests/ivanRihtarič.png', link: 'https://www.youtube.com/watch?v=ptYK6YBr1hc' },
    { id: 6, name: 'Dr. Martin Bele', image: '/assets/guests/martinBele.png', link: 'https://www.youtube.com/watch?v=KpYAdUFFUhY' },
  ];

  return (
    <section className="featured-guests section">
      
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Pogovori z gosti kot so:
        </motion.h2>
        
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
      
    </section>
  );
};

export default FeaturedGuests; 