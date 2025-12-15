import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Hero.css';
import './FeaturedGuests.css';
import { Helmet } from 'react-helmet-async';

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('all');
  const [error, setError] = useState(null);
  const [particlesLoaded2, setParticlesLoaded] = useState(false);

  const API_ADDRESS = import.meta.env.VITE_API_ADDRESS;
  useDocumentTitle('Individuum epizode');

  // === Particles setup ===
  const particlesLoaded = () => setParticlesLoaded(true);
  const particlesInit = async (engine) => await loadSlim(engine);

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
      number: { density: { enable: true, area: 800 }, value: 150 },
      opacity: {
        value: { min: 0.1, max: 0.3 },
        animation: { enable: true, speed: 0.3, minimumValue: 0.1, sync: false },
      },
      shape: { type: "circle" },
      size: { value: { min: 0.5, max: 2 } },
    },
    detectRetina: true,
  };


  const particlesMemo = useMemo(
    () => (
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded2}
        options={particlesOptions}
      />
    ),
    []
  );

  // === Fetch YouTube data ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_ADDRESS}/api/youtube-data`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setEpisodes(data.episodes || []);
        setPlaylists(data.playlists || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load episodes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPlaylistTitle = (title) => title.split(' - ')[0].trim();

  const renderEpisodeCard = (episode, index) => (
    <motion.a
      key={episode.id}
      href={`https://www.youtube.com/watch?v=${episode.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="episode-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }}
      whileHover={{ scale: 1.03, transition: { duration: 0.1, stiffness: 300 } }}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: '350px',
        background: 'rgba(20, 20, 20, 0.95)',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 4px 23px 0 rgba(0,0,0,0.45)',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img
        src={
          episode.snippet.thumbnails.maxres?.url ||
          episode.snippet.thumbnails.high?.url ||
          episode.snippet.thumbnails.medium?.url ||
          episode.snippet.thumbnails.default?.url
        }
        alt={episode.snippet.title}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      <div style={{ padding: '1rem', width: '100%' }}>
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-color, #fff)' }}>
          {episode.snippet.title}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary, #aaa)' }}>
          {new Date(episode.snippet.publishedAt).toLocaleDateString('sl-SI', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </motion.a>
  );

  return (
    <>
      <Helmet>
        <title>Individuum Podcast | Epizode</title>
        <meta
          name="description"
          content="Oglejte si vse epizode Individuum podcasta – navdihujoče zgodbe, intervjuje in pogovore z ustvarjalnimi posamezniki."
        />
        <link rel="canonical" href="/epizode" />
      </Helmet>
      <motion.section
        className="hero episodes-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: '100vh',
          background: 'none',
          marginTop: '4.5vh',
          marginBottom: '5vh',
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
        }}
      >
        {/* Particles Background */}
        <div className="particles-container">{particlesMemo}</div>

        <div
          className="container hero-content"
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 20px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* === Toggle Buttons (same position & spacing as original) === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '3vh',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setActiveView('all')}
              style={{
                padding: '0.8rem 1.5rem',
                background:
                  activeView === 'all'
                    ? 'linear-gradient(135deg, var(--accent-color), rgba(255, 255, 255, 0.1))'
                    : 'rgba(20, 20, 20, 0.7)',
                color: 'var(--text-color)',
                border: activeView === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow:
                  activeView === 'all'
                    ? '0 4px 15px rgba(0,0,0,0.3)'
                    : '0 2px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              Seznam epizod
            </button>

            <button
              onClick={() => setActiveView('categories')}
              style={{
                padding: '0.8rem 1.5rem',
                background:
                  activeView === 'categories'
                    ? 'linear-gradient(135deg, var(--accent-color), rgba(255, 255, 255, 0.1))'
                    : 'rgba(20, 20, 20, 0.7)',
                color: 'var(--text-color)',
                border: activeView === 'categories' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow:
                  activeView === 'categories'
                    ? '0 4px 15px rgba(0,0,0,0.3)'
                    : '0 2px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              Kategorije
            </button>
          </motion.div>

          {/* === Main content === */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '2rem',
                background: 'rgba(139, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px 0 rgba(139,0,0,0.3)',
                maxWidth: '400px',
                width: '100%',
                border: '1px solid rgba(139, 0, 0, 0.3)',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#ff6b6b',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                {error}
              </h2>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 107, 107, 0.2)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </motion.div>
          )}

          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '2rem',
                background: 'rgba(10, 31, 38, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
                maxWidth: '400px',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  border: '3px solid rgba(255, 255, 255, 0.1)',
                  borderTop: '3px solid var(--accent-color)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--text-color)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textAlign: 'center',
                  margin: 0,
                  background: 'linear-gradient(to right, var(--text-color), var(--accent-color))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Nalagam {activeView === 'all' ? 'epizode' : 'kategorije'}...
              </h2>
            </motion.div>
          ) : (
            <>
              {activeView === 'all' && (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '3.3rem',
                    justifyContent: 'center',
                    margin: '0 auto',
                    paddingBottom: '2.5vh',
                  }}
                >
                  {episodes.map((episode, index) => renderEpisodeCard(episode, index))}
                </div>
              )}

              {activeView === 'categories' && (
                <div style={{ width: '100%', paddingBottom: '2.5vh' }}>
                  {playlists
                    .filter((p) => p.snippet.title !== 'Individuum podcast')
                    .map((playlist, playlistIndex) => (
                      <motion.div
                        key={playlist.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: playlistIndex * 0.2 }}
                        style={{ marginBottom: '4rem' }}
                      >
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: playlistIndex * 0.2 + 0.1 }}
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: '600',
                            color: 'var(--text-color)',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            background: 'linear-gradient(to right, var(--text-color), var(--accent-color))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'Anton, sans-serif',
                            letterSpacing: '0.37rem',
                          }}
                        >
                          {formatPlaylistTitle(playlist.snippet.title)}
                        </motion.h3>

                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '3.3rem',
                            justifyContent: 'center',
                          }}
                        >
                          {playlist.videos.map((episode, index) =>
                            renderEpisodeCard(episode, playlistIndex * 3 + index)
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.section>
    </>
  );
};

export default Episodes;
