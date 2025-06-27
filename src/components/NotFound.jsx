import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './NotFound.css';

const NotFound = () => {
  useDocumentTitle('404 - Stran ne obstaja');

  return (
    <section className="not-found-section">
      <div className="container">
        <motion.div 
          className="not-found-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>404</h1>
          <h2>Stran ne obstaja</h2>
          <p>Oprostite, strani ki jo iščete ni mogoče najti.</p>
          <Link to="/" className="back-home-button">
            Nazaj na domačo stran
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound; 