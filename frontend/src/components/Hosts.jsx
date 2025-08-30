import { motion } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Hosts.css';
import ProfileCard from '/src/blocks/Components/ProfileCard/ProfileCard'
import TiltedCard from '/src/blocks/Components/TiltedCard/TiltedCard';

const Hosts = () => {
  useDocumentTitle('O podkastu');

  return (
    <section className="hosts section" style={{ marginTop: '8vh' }}>
      


      <div className="container">
        <motion.div
          className="podcast-description"
          initial={{ opacity: 0, y: 40 }}
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a href="https://www.instagram.com/lan_kokol/" target="_blank" rel="noopener noreferrer">
            <ProfileCard
                name="Lan Kokol"
                title="Voditelj"
                handle="lan_kokol"
                status=""
                contactText=""
                avatarUrl="/assets/lan_card.png"
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
                iconUrl="/assets/titleImage.png"
              />
          </a>
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="https://www.instagram.com/patrikmajhen/" target="_blank" rel="noopener noreferrer">
            <ProfileCard
                name="Patrik Majhen"
                title="Voditelj"
                handle="patrikmajhen"
                status=""
                contactText=""
                avatarUrl="/assets/pato.png"
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
                iconUrl="/assets/titleImage.png"
              />
          </a>
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

        <motion.div
          className="host-section"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a href="https://www.instagram.com/lan_kokol/" target="_blank" rel="noopener noreferrer">
            <ProfileCard
                name="Lan Kokol"
                title="Voditelj"
                handle="lan_kokol"
                status=""
                contactText=""
                avatarUrl="/assets/lan_card.png"
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
                iconUrl="/assets/titleImage.png"
              />
          </a>
          <div className="host-content">
            <h2>Aljaž Balažic</h2>
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="https://www.instagram.com/patrikmajhen/" target="_blank" rel="noopener noreferrer">
            <ProfileCard
                name="Patrik Majhen"
                title="Voditelj"
                handle="patrikmajhen"
                status=""
                contactText=""
                avatarUrl="/assets/pato.png"
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
                iconUrl="/assets/titleImage.png"
              />
          </a>
          <div className="host-content">
            <h2>Adrian Cvetko</h2>
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