import { useState } from 'react';
import { motion } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Contact.css';

const Contact = () => {
  useDocumentTitle('Individuum kontakt');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    type: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Pošiljanje...' });

    // Here you would typically send the data to your backend
    // For now, we'll simulate a successful submission
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        type: 'success',
        message: 'Sporočilo uspešno poslano! Hvala za vaše sporočilo.'
      });
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Prišlo je do napake. Prosimo, poskusite ponovno.'
      });
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <motion.div 
          className="contact-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Podpora projekta</h1>
          <p className="contact-description">
            Imate vprašanje, predlog ali želite deliti svojo zgodbo? Pišite nam!
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Ime in priimek</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Vnesite vaše ime in priimek"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email naslov</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Vnesite vaš email naslov"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Zadeva</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Vnesite zadevo sporočila"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Sporočilo</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Napišite vaše sporočilo"
                rows="6"
              />
            </div>

            <button 
              type="submit" 
              className={`submit-button ${status.type === 'loading' ? 'loading' : ''}`}
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? 'Pošiljanje...' : 'Pošlji sporočilo'}
            </button>

            {status.message && (
              <motion.div 
                className={`status-message ${status.type}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {status.message}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact; 