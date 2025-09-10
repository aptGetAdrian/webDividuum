import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import './Hero.css';

const Support = () => {
    // Coffee SVG Component
  const CoffeeIcon = () => (
    <svg className="coffee-icon" fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> 
            <g id="Environment / Coffee"> 
            <path id="Vector" d="M4 20H10.9433M10.9433 20H11.0567M10.9433 20C10.9622 20.0002 10.9811 20.0002 11 20.0002C11.0189 20.0002 11.0378 20.0002 11.0567 20M10.9433 20C7.1034 19.9695 4 16.8468 4 12.9998V8.92285C4 8.41305 4.41305 8 4.92285 8H17.0767C17.5865 8 18 8.41305 18 8.92285V9M11.0567 20H18M11.0567 20C14.8966 19.9695 18 16.8468 18 12.9998M18 9H19.5C20.8807 9 22 10.1193 22 11.5C22 12.8807 20.8807 14 19.5 14H18V12.9998M18 9V12.9998M15 3L14 5M12 3L11 5M9 3L8 5" stroke="#fedd45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> 
            </g> 
        </g>
    </svg>
  );


  // Small Coffee Icon for Button
  const SmallCoffeeIcon = () => (
    <svg className="btn-coffee-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.5 3h-13A1.5 1.5 0 0 0 4 4.5v15A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 18.5 3zM16 19H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1z" />
      <path d="M12 7a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V9a2 2 0 0 0-2-2z" />
    </svg>
  );

  // Heart Icon
  const HeartIcon = () => (
    <svg className="support-feature-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );

  // Microphone Icon
  const MicrophoneIcon = () => (
    <svg className="support-feature-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm-1 13.93c-3.94-.49-7-3.85-7-7.93 0-.55.45-1 1-1s1 .45 1 1c0 3.31 2.69 6 6 6s6-2.69 6-6c0-.55.45-1 1-1s1 .45 1 1c0 4.08-3.06 7.44-7 7.93V20h4c.55 0 1 .45 1 1s-.45 1-1 1H7c-.55 0-1-.45-1-1s.45-1 1-1h4v-4.07z" />
    </svg>
  );

  // Star Icon
  const StarIcon = () => (
    <svg className="support-feature-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  return (

    <>{/* New Support Section */}
      <section className="hero-support">
        <div className="hero-overlay-support"></div>

        <div className="container hero-content-support">
          <motion.div
            className="support-icon-wrapper"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <CoffeeIcon />
          </motion.div>

          <motion.div
            className="hero-text-support"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              PODPRI NAŠ PODCAST
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Vaša podpora nam pomaga ustvarjati kakovostne vsebine in prinašati nove zgodbe.
              Vsaka kava šteje in nam omogoča, da se še bolj osredotočimo na to, kar počnemo najbolje.
            </motion.p>
          </motion.div>

          <motion.a
            href="https://buymeacoffee.com/individuum.podcast"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-coffee"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <SmallCoffeeIcon />
            Kupi nam kavo
          </motion.a>

          <motion.div
            className="support-features"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.div
              className="support-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <HeartIcon />
              <h3>Podpora ustvarjalcem</h3>
              <p>Direktno podpreš naše delo in strast za pripovedovanje</p>
            </motion.div>

            <motion.div
              className="support-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <MicrophoneIcon />
              <h3>Boljša oprema</h3>
              <p>Omogočiš nam izboljšanje zvočne kakovosti in produkcije</p>
            </motion.div>

            <motion.div
              className="support-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <StarIcon />
              <h3>Več vsebin</h3>
              <p>Več časa za raziskovanje in pripravo zanimivih epizod</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );

};

export default Support;