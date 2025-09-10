import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Contact.css';

const Contact = () => {
  useDocumentTitle('Individuum kontakt');

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    type: '',
    message: ''
  });

  const [rateLimitInfo, setRateLimitInfo] = useState({
    remaining: 2,
    resetTime: null,
    isBlocked: false
  });

  // Rate limiting configuration
  const RATE_LIMIT = 2; // messages per minute
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
  const STORAGE_KEY = 'contact_form_submissions';

  // Check rate limit on component mount and set up cleanup
  useEffect(() => {
    checkRateLimit();
    const interval = setInterval(checkRateLimit, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  const checkRateLimit = () => {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Filter out submissions older than rate limit window
    const recentSubmissions = submissions.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );
    
    // Update localStorage with filtered submissions
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSubmissions));
    
    const remaining = Math.max(0, RATE_LIMIT - recentSubmissions.length);
    const isBlocked = remaining === 0;
    
    let resetTime = null;
    if (isBlocked && recentSubmissions.length > 0) {
      resetTime = recentSubmissions[0] + RATE_LIMIT_WINDOW;
    }
    
    setRateLimitInfo({
      remaining,
      resetTime,
      isBlocked
    });
  };

  const addSubmissionTimestamp = () => {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    submissions.push(now);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  };

  const getTimeUntilReset = () => {
    if (!rateLimitInfo.resetTime) return 0;
    return Math.max(0, Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check rate limit before submitting
    if (rateLimitInfo.isBlocked) {
      const timeLeft = getTimeUntilReset();
      setStatus({
        type: 'error',
        message: `Preveč zahtev. Poskusite ponovno čez ${timeLeft} sekund.`
      });
      return;
    }

    setStatus({ type: 'loading', message: 'Pošiljanje...' });

    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Add timestamp after successful submission
      addSubmissionTimestamp();
      checkRateLimit(); // Update rate limit info immediately

      setStatus({
        type: 'success',
        message: 'Sporočilo uspešno poslano! Hvala za vaše sporočilo.'
      });

      setFormData({
        name: '',
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
          <h1>PODPORA PROJEKTA</h1>
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
              className={`submit-button ${status.type === 'loading' ? 'loading' : ''} ${rateLimitInfo.isBlocked ? 'disabled' : ''}`}
              disabled={status.type === 'loading' || rateLimitInfo.isBlocked}
            >
              {rateLimitInfo.isBlocked 
                ? `Počakajte ${getTimeUntilReset()}s` 
                : 'Pošlji sporočilo'
              }
            </button>

            {/* Rate limit info */}
            {rateLimitInfo.remaining < 2 && !rateLimitInfo.isBlocked && (
              <div className="rate-limit-warning">
                Še {rateLimitInfo.remaining} sporočil{rateLimitInfo.remaining === 1 ? 'o' : 'i'} to minuto
              </div>
            )}

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