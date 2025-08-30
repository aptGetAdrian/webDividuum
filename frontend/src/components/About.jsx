import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section className="about section">
      <div className="container">
        <motion.h1 
          className="about-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          O nama
        </motion.h1>
        
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p>
            Dobrodošli na našo stran! Smo ekipa navdušenih ustvarjalcev, ki želimo
            deliti zanimive zgodbe in vpoglede s svetom. Naš podcast je prostor,
            kjer se srečujejo različne ideje, izkušnje in perspektive.
          </p>
          
          <div className="about-mission">
            <h2>Naše poslanstvo</h2>
            <p>
              Naše poslanstvo je ustvarjati kakovosten in zanimiv vsebino, ki navdihuje,
              izobražuje in zabava. Verjamemo v moč pristnih pogovorov in deljenja
              zgodb, ki lahko spremenijo življenja.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 