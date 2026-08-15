import { Link } from "react-router-dom";
import { FaSpotify, FaYoutube, FaApple, FaTiktok, FaFacebook } from "react-icons/fa";
import FingerprintMark from "./FingerprintMark";
import "./Footer.css";

/**
 * Brand colours are kept as data, not decoration: each icon is bone at rest and
 * takes its platform's colour on hover — the same rule as the episode thumbnail,
 * where colour marks the thing you're about to act on.
 */
const platforms = [
  { name: "Spotify", icon: <FaSpotify />, color: "#1DB954", link: "https://open.spotify.com/show/5eAqz5T6HdCSnFg9u3bhw1" },
  { name: "YouTube", icon: <FaYoutube />, color: "#FF0000", link: "https://www.youtube.com/@IndividuumPodcast" },
  { name: "Apple Podcasts", icon: <FaApple />, color: "#B150E2", link: "https://podcasts.apple.com/us/podcast/individuum-podcast/id1771410048" },
  { name: "TikTok", icon: <FaTiktok />, color: "#FF0050", link: "https://www.tiktok.com/@individuum.podcast" },
  { name: "Facebook", icon: <FaFacebook />, color: "#1877F2", link: "https://www.facebook.com/profile.php?id=61566305171608" },
];

const sitePages = [
  { name: "Domov", path: "/" },
  { name: "Epizode", path: "/epizode" },
  { name: "O podkastu", path: "/o-podcastu" },
  { name: "Kontakt", path: "/kontakt" },
];

const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div className="footer__grid">
        <section className="footer__col">
          <h2 className="footer__label">Poslušaj</h2>
          <ul className="footer__list">
            {platforms.map((platform) => (
              <li key={platform.name}>
                <a
                  className="footer__row"
                  style={{ "--brand": platform.color }}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="footer__icon">{platform.icon}</span>
                  <span className="footer__row-name">{platform.name}</span>
                  <span className="footer__row-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="footer__col">
          <h2 className="footer__label">Navigacija</h2>
          <ul className="footer__list">
            {sitePages.map((page) => (
              <li key={page.path}>
                <Link
                  className="footer__row footer__row--page"
                  to={page.path}
                  onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
                >
                  <span className="footer__row-name">{page.name}</span>
                  <span className="footer__row-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="footer__bottom">
        <FingerprintMark className="footer__mark" />
        <p className="footer__copy">
          © {new Date().getFullYear()} Individuum. Vse pravice pridržane.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
