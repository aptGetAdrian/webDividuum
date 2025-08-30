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

  // Add your website pages here
  const sitePages = [
    { name: 'Domov', path: '/' },
    { name: 'Epizode', path: '/epizode' },
    { name: 'O podkastu', path: '/o-podkastu' },
    { name: 'Kontakt', path: '/kontakt' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        {/* Main footer content */}
        <div className="footer-main">
          {/* Platform links section */}
          <div className="footer-section">
            <h3 className="footer-heading">Poslušaj nas</h3>
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
                    transition: { duration: 0.05 }
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
          </div>

          {/* Site navigation section */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut"}}
            viewport={{ once: true }}
          >
            <h3 className="footer-heading">Navigacija</h3>
            <nav className="footer-nav">
              {sitePages.map((page) => (
                <motion.a
                  key={page.name}
                  href={page.path}
                  className="footer-nav-link"
                  whileHover={{
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  {page.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>
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