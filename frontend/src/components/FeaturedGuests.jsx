import { useEffect, useRef, useState } from "react";
import "./FeaturedGuests.css";
import { guests } from "../data/guests";
import FingerprintMark from "./FingerprintMark";

/**
 * Perimeter of the ring. The grid is 6×4 on desktop and 4×6 on tablet — both
 * have a 16-cell perimeter around an 8-cell hollow centre, so one slot map
 * serves both. A ring perimeter is always even, and there are 15 guests, so the
 * spare slot renders the fingerprint mark from the logo.
 *
 * Adding a 16th guest just fills that slot. Going past 16 needs the ring to grow
 * (6×5 → 18, 6×6 → 20) — bump RING_SLOTS and extend the :nth-child placement
 * rules in FeaturedGuests.css to match.
 */
const RING_SLOTS = 16;

/** Renders markdown *emphasis* — used for publication titles in the descriptions. */
const withEmphasis = (text) =>
  text.split("*").map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));

const FeaturedGuests = () => {
  // On touch devices there is no hover, so the first tap reveals and the second
  // opens the episode. On pointer devices CSS :hover does the work and this stays null.
  const [revealed, setRevealed] = useState(null);
  const [tapToReveal, setTapToReveal] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: none)");
    const sync = () => setTapToReveal(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (revealed === null) return undefined;
    const closeOnOutside = (event) => {
      if (!sectionRef.current?.contains(event.target)) setRevealed(null);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [revealed]);

  const handleTileClick = (index) => (event) => {
    if (!tapToReveal || revealed === index) return; // let the link through
    event.preventDefault();
    setRevealed(index);
  };

  const slots = Array.from({ length: RING_SLOTS }, (_, i) => guests[i] ?? null);

  return (
    <section className="guests" aria-labelledby="guests-title" ref={sectionRef}>
      <div className="guests__ring">
        {slots.map((guest, index) =>
          guest ? (
            <a
              key={guest.name}
              className={`guests__slot guests__tile${revealed === index ? " is-revealed" : ""}`}
              href={guest.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleTileClick(index)}
            >
              <img
                className="guests__photo"
                src={guest.image}
                alt={guest.name}
                width="500"
                height="500"
                loading="lazy"
                decoding="async"
              />
              {/* The panel sits under the role label, which never moves — on hover
                  the name and bio rise above it rather than replacing it. */}
              <span className="guests__panel">
                <span className="guests__name">{guest.name}</span>
                <span className="guests__bio">{withEmphasis(guest.description)}</span>
              </span>

              <span className="guests__role">{guest.role}</span>
              <span className="guests__cta">Oglej si ↗</span>
            </a>
          ) : (
            <div className="guests__slot guests__mark" key={`mark-${index}`} aria-hidden="true">
              <FingerprintMark />
            </div>
          ),
        )}

        <div className="guests__index">
          <h2 className="guests__title" id="guests-title">
            Pretekli gostje
          </h2>
          <p className="guests__count">
            {guests.length} posameznikov
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGuests;
