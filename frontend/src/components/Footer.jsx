import { FaSpotify, FaYoutube, FaApple, FaTiktok, FaFacebook } from 'react-icons/fa';
import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const primaryPlatforms = [
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

  const socialPlatforms = [
    {
      name: 'TikTok',
      icon: <FaTiktok />,
      link: 'https://www.tiktok.com/@individuum.podcast',
      color: '#ff0050'
    },
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      link: 'https://www.facebook.com/profile.php?id=61566305171608',
      color: '#1877F2'
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
            <div className="platforms-container">
              {/* Primary platforms row */}
              <div className="platforms platforms-primary">
                {primaryPlatforms.map((platform) => (
                  <motion.a
                    key={platform.name}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform-link"
                    style={{ '--platform-color': platform.color }}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                    ease: "easeOut"
                    }}
                    viewport={{
                      once: true,
                    }}
                    whileHover={{
                      scale: 1.03,
                    transition: { duration: 0.1 }
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    <span className="platform-icon">{platform.icon}</span>
                    <span className="platform-name">{platform.name}</span>
                  </motion.a>
                ))}
              </div>

              {/* Social platforms row */}
              <div className="platforms platforms-social">
                {socialPlatforms.map((platform, index) => (
                  <motion.a
                    key={platform.name}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform-link-social"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05 * (index + 1),
                      ease: "easeOut"
                    }}
                    viewport={{
                      once: true,
                    }}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.1 }
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    style={{
                      '--platform-color': platform.color,
                    }}
                  >
                    {React.cloneElement(platform.icon, {
                      className: 'platform-icon-social'
                    })}
                    <span className="platform-name">{platform.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Site navigation section */}
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h3 className="footer-heading">Navigacija</h3>
            <nav className="footer-nav">
              {sitePages.map((page) => (
                <a
                  key={page.name}
                  href={page.path}
                  className="footer-nav-link"
                >
                  {page.name}
                </a>
              ))}
            </nav>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2025 Individuum. Vse pravice pridržane.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;