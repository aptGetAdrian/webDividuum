import { motion } from 'framer-motion';
import './FeaturedGuests.css';

const FeaturedGuests = () => {
  const guests = [
    { id: 1, name: 'Ime Gosta 1', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
    { id: 2, name: 'Ime Gosta 2', image: 'https://www.wikihow.com/images/9/90/What_type_of_person_are_you_quiz_pic.png' },
    { id: 3, name: 'Ime Gosta 3', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
    { id: 4, name: 'Ime Gosta 4', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face' },
    { id: 5, name: 'Ime Gosta 5', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face' },
    { id: 6, name: 'Ime Gosta 6', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face' },
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
          Najnovejši gostje
        </motion.h2>
        
        <div className="guests-grid">
          {guests.map((guest, index) => (
            <motion.div
              key={guest.id}
              className="guest-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="guest-image">
                <img src={guest.image} alt={guest.name} />
              </div>
              <h3>{guest.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGuests; 