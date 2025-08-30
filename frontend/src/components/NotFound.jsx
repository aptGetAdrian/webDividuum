import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './NotFound.css';
import FuzzyText from '/src/blocks/TextAnimations/FuzzyText/FuzzyText.jsx';

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
          <h1>
          <FuzzyText
          baseIntensity={0.1}
          hoverIntensity={0.3}
          enableHover={true}
        >
          404
        </FuzzyText>
        </h1>
          <h2>Stran ne obstaja</h2>
          <p>Oprostite, iskane strani ni mogoče najti.</p>
          <Link to="/" className="back-home-button">
            Nazaj na domačo stran
          </Link>
        </motion.div>
      </div>
      
    </section>
  );
};

export default NotFound; 