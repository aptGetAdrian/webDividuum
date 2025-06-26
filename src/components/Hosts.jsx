import { motion } from 'framer-motion';
import './Hosts.css';

const Hosts = () => {
  return (
    <section className="hosts section" style={{ marginTop: '8vh' }}>
      <div className="container">
        <motion.div 
          className="podcast-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="podcast-title">O podkastu</h2>
          <p className="podcast-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </motion.div>

        <motion.div 
          className="host-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="host-image"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <a href="https://www.instagram.com/lan_kokol/" target="_blank" rel="noopener noreferrer">
              <img src="/assets/lanProfilna.png" alt="Lan Kokol - Voditelj" />
            </a>
          </motion.div>
          <div className="host-content">
            <h2>Lan Kokol</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
              aliquip ex ea commodo consequat.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="host-section reverse"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div 
            className="host-image"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <a href="https://www.instagram.com/patrikmajhen/" target="_blank" rel="noopener noreferrer">
              <img src="/assets/patrikProfilna.png" alt="Patrik Majhen - Voditelj" />
            </a>
          </motion.div>
          <div className="host-content">
            <h2>Patrik Majhen</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
              aliquip ex ea commodo consequat.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hosts;