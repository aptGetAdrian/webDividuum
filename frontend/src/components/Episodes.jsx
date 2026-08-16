import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useReveal from "../hooks/useReveal";
import { durationSeconds, formatDate, formatDuration, parseTitle, pickThumbnail } from "../lib/episodeMeta";
import "./Episodes.css";

const CHANNEL_VIDEOS = "https://www.youtube.com/@IndividuumPodcast/videos";

const VIEWS = [
  { id: "all", label: "Vse epizode" },
  { id: "categories", label: "Kategorije" },
];

/**
 * Playlist titles carry the same "| Individuum Podcast" tail as video titles, and
 * some are additionally authored as "Ime - opis". Strip both; show only the name.
 */
const formatPlaylistTitle = (title) => parseTitle(title).title.split(" - ")[0].trim();

const EpisodeCard = ({ video }) => {
  const { title, episode } = parseTitle(video.snippet.title);
  const duration = formatDuration(video.contentDetails?.duration);
  const published = formatDate(video.snippet.publishedAt);
  const thumbnail = pickThumbnail(video.snippet.thumbnails);

  return (
    <a
      className="ep-card"
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="ep-card__media">
        {thumbnail && (
          <img className="ep-card__thumb" src={thumbnail} alt="" loading="lazy" decoding="async" />
        )}
        {duration && <span className="ep-card__duration">{duration}</span>}
      </span>

      <span className="ep-card__body">
        <span className="ep-card__meta">
          <span className="ep-card__no">{episode ? `#${episode}` : "—"}</span>
          {published && <span className="ep-card__date">{published}</span>}
        </span>
        <span className="ep-card__title">{title}</span>
      </span>
    </a>
  );
};

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState("all");
  const [headRef, headShown] = useReveal();

  const API_ADDRESS = import.meta.env.VITE_API_ADDRESS;
  useDocumentTitle("Individuum epizode");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`${API_ADDRESS}/api/youtube-data`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setEpisodes(data.episodes || []);
        setPlaylists(data.playlists || []);
      } catch (err) {
        console.error("Error fetching episodes:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_ADDRESS]);

  const categories = playlists.filter((p) => p.snippet.title !== "Individuum podcast");

  /**
   * /api/youtube-data truncates its `episodes` list to whatever survives inside the
   * 200 most recent uploads, which drops everything older than roughly May 2025 —
   * see fetch_all_videos() in backend/main.py. The playlists in the same response
   * are NOT truncated, so the missing episodes are already on the page; they just
   * aren't in the list the archive renders.
   *
   * Merging the two by id recovers the full archive without another request. Once
   * the backend filters before it caps, this becomes a no-op de-duplication.
   */
  const allEpisodes = useMemo(() => {
    const byId = new Map(episodes.map((video) => [video.id, video]));
    for (const playlist of playlists) {
      for (const video of playlist.videos ?? []) {
        // Playlists keep anything over 60s; hold these to the same bar as an episode.
        if (!byId.has(video.id) && durationSeconds(video.contentDetails?.duration) > 300) {
          byId.set(video.id, video);
        }
      }
    }
    return [...byId.values()].sort(
      (a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt),
    );
  }, [episodes, playlists]);

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

      <main className={`episodes${headShown ? " is-in" : ""}`} ref={headRef}>
        <div className="episodes__inner">
          <p className="episodes__eyebrow" data-reveal>
            Arhiv
          </p>

          <div className="episodes__head">
            <h1 className="episodes__title" data-reveal style={{ "--reveal-i": 1 }}>
              Epizode
            </h1>
            {!loading && !error && (
              <p className="episodes__count" data-reveal style={{ "--reveal-i": 2 }}>
                {allEpisodes.length} epizod · {categories.length} kategorij
              </p>
            )}
          </div>

          <div className="episodes__views" role="tablist" aria-label="Pogled" data-reveal style={{ "--reveal-i": 2 }}>
            {VIEWS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={view === option.id}
                className={`episodes__view${view === option.id ? " is-active" : ""}`}
                onClick={() => setView(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="episodes__notice">
              <p className="episodes__notice-text">Epizod ni bilo mogoče naložiti.</p>
              <button type="button" className="episodes__retry" onClick={() => window.location.reload()}>
                Poskusi znova
              </button>
            </div>
          )}

          {loading && !error && <p className="episodes__notice-text">Nalagam epizode…</p>}

          {!loading && !error && view === "all" && (
            <div className="ep-grid">
              {allEpisodes.map((video) => (
                <EpisodeCard key={video.id} video={video} />
              ))}

              <a
                className="ep-card ep-card--all"
                href={CHANNEL_VIDEOS}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="ep-card__media">
                  <span className="ep-card__all-mark" aria-hidden="true">↗</span>
                </span>
                <span className="ep-card__body">
                  <span className="ep-card__meta">
                    <span className="ep-card__no">YouTube</span>
                  </span>
                  <span className="ep-card__title">Oglej si vse epizode</span>
                </span>
              </a>
            </div>
          )}

          {!loading && !error && view === "categories" && (
            <div className="episodes__categories">
              {categories.map((playlist) => (
                <section className="episodes__category" key={playlist.id}>
                  <h2 className="episodes__category-title">
                    {formatPlaylistTitle(playlist.snippet.title)}
                    <span className="episodes__category-count">{playlist.videos.length}</span>
                  </h2>
                  <div className="ep-grid">
                    {/* A video can legitimately appear twice in one playlist, so the
                        position is part of the key — id alone collides. */}
                    {playlist.videos.map((video, i) => (
                      <EpisodeCard key={`${playlist.id}-${video.id}-${i}`} video={video} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Episodes;
