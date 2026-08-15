import { useEffect, useState } from "react";
import useReveal from "../hooks/useReveal";
import { formatDate, formatDuration, formatCount, parseTitle } from "../lib/episodeMeta";
import "./LatestEpisode.css";

/**
 * The newest episode, presented as the most recent entry in the archive.
 *
 * Lifted out of Hero.jsx's second section: the hero itself is untouched, and all
 * of the latest-video state and the /api/latest-video fetch lived only here.
 */

const LatestEpisode = () => {
  const API_ADDRESS = import.meta.env.VITE_API_ADDRESS;

  const [videoId, setVideoId] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sectionRef, shown] = useReveal();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        setFailed(false);
        const response = await fetch(`${API_ADDRESS}/api/latest-video`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.videoId && data.videoData) {
          setVideoId(data.videoId);
          setVideoData(data.videoData);
        } else {
          console.warn("No latest video found");
          setFailed(true);
        }
      } catch (err) {
        console.error("Error fetching latest video:", err);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [API_ADDRESS]);

  const { title, episode } = parseTitle(videoData?.title);

  // Metadata the endpoint already returns and the old section threw away.
  const meta = [
    { label: "Epizoda", value: episode && `#${episode}` },
    { label: "Objavljeno", value: formatDate(videoData?.publishedAt) },
    { label: "Trajanje", value: formatDuration(videoData?.duration) },
    { label: "Ogledov", value: formatCount(videoData?.viewCount) },
  ].filter((item) => item.value);

  return (
    <section
      className={`latest${shown ? " is-in" : ""}`}
      aria-labelledby="latest-title"
      ref={sectionRef}
    >
      <div className="latest__inner">
        <p className="latest__eyebrow" data-reveal>Najnovejša epizoda</p>

        <div className="latest__body">
          <div className="latest__text">
            <h2 className="latest__title" id="latest-title" data-reveal style={{ "--reveal-i": 1 }}>
              {title ?? (failed ? "Epizode ni bilo mogoče naložiti" : " ")}
            </h2>

            {meta.length > 0 && (
              <dl className="latest__meta" data-reveal style={{ "--reveal-i": 2 }}>
                {meta.map((item) => (
                  <div className="latest__meta-item" key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {failed ? (
              <button
                type="button"
                className="latest__action"
                data-reveal
                style={{ "--reveal-i": 3 }}
                onClick={() => window.location.reload()}
              >
                Poskusi znova
              </button>
            ) : (
              <a
                className="latest__action"
                data-reveal
                style={{ "--reveal-i": 3 }}
                href="https://linktr.ee/individuumpodcast"
                target="_blank"
                rel="noopener noreferrer"
              >
                Poslušaj zdaj ↗
              </a>
            )}
          </div>

          <div className="latest__media" data-reveal style={{ "--reveal-i": 2 }}>
            {playing && videoId ? (
              <iframe
                className="latest__frame"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={videoData?.title ?? "Najnovejša epizoda"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className="latest__play"
                onClick={() => setPlaying(true)}
                disabled={!videoId}
                aria-label={
                  videoData?.title
                    ? `Predvajaj epizodo: ${videoData.title}`
                    : "Predvajaj najnovejšo epizodo"
                }
              >
                {videoData?.thumbnail || videoId ? (
                  <img
                    className="latest__thumb"
                    src={videoData?.thumbnail ?? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="latest__thumb latest__thumb--empty" aria-hidden="true" />
                )}

                <span className="latest__play-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>

                <span className="latest__play-label" aria-hidden="true">
                  {loading ? "Nalaganje…" : failed ? "Ni na voljo" : "Predvajaj"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestEpisode;
