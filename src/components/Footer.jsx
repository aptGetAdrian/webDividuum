import { FaSpotify, FaYoutube, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const platforms = [
    {
      name: 'Spotify',
      icon: <FaSpotify />,
      link: 'https://spotify.com/your-podcast',
      color: '#1DB954'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube />,
      link: 'https://youtube.com/your-channel',
      color: '#FF0000'
    },
    {
      name: 'Apple Podcasts',
      icon: <FaApple />,
      link: 'https://podcasts.apple.com/your-podcast',
      color: '#B150E2'
    }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="platforms">
          {platforms.map((platform, index) => (
            <motion.a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-link"
              style={{ '--platform-color': platform.color }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="platform-icon">{platform.icon}</span>
              <span className="platform-name">{platform.name}</span>
            </motion.a>
          ))}
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Individuum. Vse pravice pridržane.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 