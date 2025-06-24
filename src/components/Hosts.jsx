import { motion } from 'framer-motion';
import './Hosts.css';

const Hosts = () => {
  return (
    <section className="hosts section">
      <div className="container">
        {/* Podcast Description Section */}
        <motion.div 
          className="podcast-description"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="podcast-title">About Our Podcast</h2>
          <p className="podcast-text">
            Welcome to our podcast where we dive deep into fascinating conversations, 
            explore thought-provoking topics, and share stories that matter. Join us 
            every week as we bring you engaging discussions with interesting guests 
            and insights that will make you think, laugh, and maybe even change 
            your perspective on the world around us.
          </p>
        </motion.div>

        {/* Host Sections */}
        <motion.div 
          className="host-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="host-image">
            <img src="/assets/imagecopy.png" alt="Voditelj 1" />
          </div>
          <div className="host-content">
            <h2>Lan</h2>
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
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="host-image">
            <img src="/assets/image.png" alt="Voditelj 2" />
          </div>
          <div className="host-content">
            <h2>Patrik</h2>
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