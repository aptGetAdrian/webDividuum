import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Hero.css';
import './FeaturedGuests.css';

const YOUTUBE_API_KEY = "AIzaSyCm-rssnRQLky7FWziD2cIm9K9jcneTu44";
const CHANNEL_ID = 'UCOgRR3LGKA2VIqbgmIer9JQ';

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useDocumentTitle('Individuum epizode');

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        // Get the channel's uploads playlist ID
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${CHANNEL_ID}&part=contentDetails`
        );
        const channelData = await channelResponse.json();
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // Fetch up to 100 videos from the uploads playlist (maxResults=50 per request)
        let allItems = [];
        let nextPageToken = '';
        do {
          const playlistResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=50&pageToken=${nextPageToken}`
          );
          const playlistData = await playlistResponse.json();
          allItems = allItems.concat(playlistData.items);
          nextPageToken = playlistData.nextPageToken || '';
        } while (nextPageToken && allItems.length < 100);
        allItems = allItems.slice(0, 100);

        // Get video IDs
        const videoIds = allItems.map(item => item.snippet.resourceId.videoId);
        // Fetch video details in batches of 50
        let allVideos = [];
        for (let i = 0; i < videoIds.length; i += 50) {
          const batchIds = videoIds.slice(i, i + 50).join(',');
          const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${batchIds}&part=contentDetails,snippet`
          );
          const detailsData = await detailsResponse.json();
          allVideos = allVideos.concat(detailsData.items);
        }

        // Filter out Shorts (videos under 61 seconds)
        const mainEpisodes = allVideos.filter(video => {
          const duration = video.contentDetails.duration;
          // Parse ISO 8601 duration (PT1M30S format)
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          const hours = parseInt(match[1] || 0);
          const minutes = parseInt(match[2] || 0);
          const seconds = parseInt(match[3] || 0);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          return totalSeconds > 60;
        });

        setEpisodes(mainEpisodes);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, []);

  return (
    <motion.section 
      className="hero" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: '100vh', background: 'none', marginTop: '100px', marginBottom: '100px' }}
    >
      <div className="container hero-content" style={{ flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ color: 'var(--text-color)' }}
        >
          Seznam novejših epizod:
        </motion.h2>
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
              width: '100%'
            }}
          >
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTop: '3px solid var(--accent-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <h2 style={{
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
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Nalagam epizode...
            </h2>
          </motion.div>
        ) : (
          <div style={{ 
            width: '100%', 
            maxWidth: '1500px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '2.6rem', 
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            {episodes.map((episode, index) => (
              <motion.a
                key={episode.id}
                href={`https://www.youtube.com/watch?v=${episode.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="episode-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  scale: {
                    type: "tween",
                    duration: 0.2,
                    ease: "easeOut"
                  }
                }}
                whileHover={{ 
                  scale: 1.03
                }}
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  background: 'rgba(20, 20, 20, 0.95)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)',
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
                  <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-color, #fff)' }}>{episode.snippet.title}</h2>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary, #aaa)' }}>
                    {new Date(episode.snippet.publishedAt).toLocaleDateString('sl-SI', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Episodes; 