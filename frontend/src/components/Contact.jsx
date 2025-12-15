import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Contact.css';
import { Helmet } from 'react-helmet-async';

// Timer component to show seconds left without re-rendering the entire form
const RateLimitTimer = ({ resetTime }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!resetTime) return;

    const update = () => {
      setSecondsLeft(Math.max(0, Math.ceil((resetTime - Date.now()) / 1000)));
    };

    update(); // initial run
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [resetTime]);

  if (secondsLeft <= 0) return null;
  return <>{`Počakajte ${secondsLeft}s`}</>;
};

const Contact = () => {
  useDocumentTitle('Individuum kontakt');

  const [particlesLoaded2, setParticlesLoaded] = useState(false);

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
  const RATE_LIMIT = 2;
  const RATE_LIMIT_WINDOW = 60 * 1000;
  const STORAGE_KEY = 'contact_form_submissions';

  const particlesLoaded = (container) => {
    setParticlesLoaded(true);
  };

  // Initialize particles
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  // Particles configuration (unchanged)
  const particlesOptions = {
    background: { color: { value: "transparent" } },
    fullScreen: { enable: false, zIndex: 1 },
    fpsLimit: 60,
    particles: {
      color: { value: "#2e9cddff" },
      links: { enable: false },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "out" },
        random: true,
        speed: 0.25,
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 150,
      },
      opacity: {
        value: { min: 0.1, max: 0.7 },
        animation: { enable: true, speed: 0.3, minimumValue: 0.1, sync: false }
      },
      shape: { type: "circle" },
      size: { value: { min: 0.5, max: 2 } },
    },
    detectRetina: true,
  };

  // Memoized particles so they don’t re-render
  const particlesMemo = useMemo(() => (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded2}
      options={particlesOptions}
    />
  ), []); // empty deps — created once

  // Check rate limit on mount
  useEffect(() => {
    checkRateLimit();
    const interval = setInterval(checkRateLimit, 5000); // check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkRateLimit = () => {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const recentSubmissions = submissions.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSubmissions));

    const remaining = Math.max(0, RATE_LIMIT - recentSubmissions.length);
    const isBlocked = remaining === 0;

    let resetTime = null;
    if (isBlocked && recentSubmissions.length > 0) {
      resetTime = recentSubmissions[0] + RATE_LIMIT_WINDOW;
    }

    setRateLimitInfo({ remaining, resetTime, isBlocked });
  };

  const addSubmissionTimestamp = () => {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    submissions.push(now);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rateLimitInfo.isBlocked) {
      setStatus({
        type: 'error',
        message: 'Preveč zahtev. Prosimo, poskusite kasneje.'
      });
      return;
    }

    setStatus({ type: 'loading', message: 'Pošiljanje...' });

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      addSubmissionTimestamp();
      checkRateLimit();

      setStatus({
        type: 'success',
        message: 'Sporočilo uspešno poslano! Hvala za vaše sporočilo.'
      });

      setFormData({ name: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Prišlo je do napake. Prosimo, poskusite ponovno.'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Individuum Podcast | Kontakt</title>
        <meta
          name="description"
          content="Stopite v stik z nami! Posredujte vprašanja, predloge ali delite svojo zgodbo z Individuum podcast ekipo."
        />
        <link rel="canonical" href="/kontakt" />
      </Helmet>

      <section className="contact-section">
        {/* Particles Background */}
        <div className="particles-container">
          {particlesMemo}
        </div>

        <div className="container">
          <motion.div
            className="contact-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>VSTOPITE V STIK Z NAMI</h1>
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
                  ? <RateLimitTimer resetTime={rateLimitInfo.resetTime} />
                  : 'Pošlji sporočilo'}
              </button>

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
    </>
  );
};

export default Contact;
