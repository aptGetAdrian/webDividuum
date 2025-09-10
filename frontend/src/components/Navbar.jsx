import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const navbarRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const getScrollThreshold = () => {
    switch (location.pathname) {
      case '/':
        return 700;
      case '/epizode':
        return 200;
      case '/o-podcastu':
        return 50;
      case '/kontakt':
        return 500;
      default:
        return 400;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = getScrollThreshold();
      setIsScrolled(scrollPosition > scrollThreshold);

      // Mobile hide/show navbar logic
      if (window.innerWidth <= 768) {
        if (scrollPosition > lastScrollY && scrollPosition > 100) {
          // Scrolling down - hide navbar
          setShowNavbar(false);
        } else {
          // Scrolling up - show navbar
          setShowNavbar(true);
        }
        
        setLastScrollY(scrollPosition);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleCoffeeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById("support");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { replace: false });
      setTimeout(() => {
        const el = document.getElementById("support");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
    setIsOpen(false);
  };

  return (
    <nav 
      ref={navbarRef}
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${showNavbar ? 'visible' : 'hidden'}`}
    >
      <div className="container nav-container">
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <Link to="/"> <img
              src="/assets/titleImage.png"
              alt="Domov"
              style={{
                display: 'block',
                width: '2rem',
                height: 'auto',
              }}
            /></Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link to="/epizode">Epizode</Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/o-podcastu">O podcastu</Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/kontakt">Kontakt</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a className="link-coffee"
              onClick={handleCoffeeClick}
            >
              <svg className="coffee-icon2" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g id="Environment / Coffee">
                  <path id="Vector" d="M4 20H10.9433M10.9433 20H11.0567M10.9433 20C10.9622 20.0002 10.9811 20.0002 11 20.0002C11.0189 20.0002 11.0378 20.0002 11.0567 20M10.9433 20C7.1034 19.9695 4 16.8468 4 12.9998V8.92285C4 8.41305 4.41305 8 4.92285 8H17.0767C17.5865 8 18 8.41305 18 8.92285V9M11.0567 20H18M11.0567 20C14.8966 19.9695 18 16.8468 18 12.9998M18 9H19.5C20.8807 9 22 10.1193 22 11.5C22 12.8807 20.8807 14 19.5 14H18V12.9998M18 9V12.9998M15 3L14 5M12 3L11 5M9 3L8 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </svg>
            </a>
          </motion.div>
        </div>

        <div
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;