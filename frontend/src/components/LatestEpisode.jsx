import { useEffect, useState } from "react";
import "./LatestEpisode.css";

/**
 * The newest episode, presented as the most recent entry in the archive.
 *
 * Lifted out of Hero.jsx's second section: the hero itself is untouched, and all
 * of the latest-video state and the /api/latest-video fetch lived only here.
 */

/** "PT1H24M16S" → "1:24:16" (or "24:16" when under an hour). */
const formatDuration = (iso) => {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!match) return null;
  const [h, m, s] = [match[1] ?? 0, match[2] ?? 0, match[3] ?? 0].map(Number);
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.valueOf())
    ? null
    : new Intl.DateTimeFormat("sl-SI", { day: "numeric", month: "numeric", year: "numeric" }).format(date);
};

const formatCount = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? new Intl.NumberFormat("sl-SI").format(n) : null;
};

/**
 * YouTube titles carry a "| Individuum Podcast #50" tail that is pure noise on
 * Individuum's own site — but the number in it is worth keeping, so it moves
 * into the data strip where the other record numbers live.
 */
const BRANDING_TAIL = /\s*[|–-]\s*individuum\s*podcast\s*(?:#\s*(\d+))?\s*$/i;

const parseTitle = (raw) => {
  if (!raw) return { title: null, episode: null };
  const match = raw.match(BRANDING_TAIL);
  return {
    title: (match ? raw.replace(BRANDING_TAIL, "") : raw).trim(),
    episode: match?.[1] ?? null,
  };
};

const LatestEpisode = () => {
  const API_ADDRESS = import.meta.env.VITE_API_ADDRESS;

  const [videoId, setVideoId] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

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
    <section className="latest" aria-labelledby="latest-title">
      <div className="latest__inner">
        <p className="latest__eyebrow">Najnovejša epizoda</p>

        <div className="latest__body">
          <div className="latest__text">
            <h2 className="latest__title" id="latest-title">
              {title ?? (failed ? "Epizode ni bilo mogoče naložiti" : " ")}
            </h2>

            {meta.length > 0 && (
              <dl className="latest__meta">
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
                onClick={() => window.location.reload()}
              >
                Poskusi znova
              </button>
            ) : (
              <a
                className="latest__action"
                href="https://linktr.ee/individuumpodcast"
                target="_blank"
                rel="noopener noreferrer"
              >
                Poslušaj zdaj ↗
              </a>
            )}
          </div>

          <div className="latest__media">
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
