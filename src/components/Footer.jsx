import { FaSpotify, FaYoutube, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const platforms = [
    {
      name: 'Spotify',
      icon: <FaSpotify />,
      link: 'https://open.spotify.com/show/5eAqz5T6HdCSnFg9u3bhw1',
      color: '#1DB954'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube />,
      link: 'https://www.youtube.com/@IndividuumPodcast',
      color: '#FF0000'
    },
    {
      name: 'Apple Podcasts',
      icon: <FaApple />,
      link: 'https://podcasts.apple.com/us/podcast/individuum-podcast/id1771410048',
      color: '#B150E2'
    }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="platforms">
          {platforms.map((platform) => (
            <motion.a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-link"
              style={{ '--platform-color': platform.color }}
              initial={{ 
                opacity: 0, 
                y: 30,
                scale: 0.9
              }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              transition={{   
                duration: 0.8,   
              }}
              viewport={{ 
                once: true,
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.1, ease: "easeOut" }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              <span className="platform-icon">{platform.icon}</span>
              <span className="platform-name">{platform.name}</span>
            </motion.a>
          ))}
        </div>
        
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p>&copy; 2025 Individuum. Vse pravice pridržane.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;