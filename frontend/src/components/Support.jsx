import useReveal from "../hooks/useReveal";
import "./Support.css";

const CoffeeIcon = () => (
  <svg className="support__cta-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M4 20h14M4 20c0-3.85 0-7 0-7.001V8.923C4 8.413 4.413 8 4.923 8h12.154c.51 0 .923.413.923.923V9m0 0h1.5a2.5 2.5 0 0 1 0 5H18V9Zm0 4c0 3.85-3.104 6.97-7 7M15 3l-1 2M12 3l-1 2M9 3 8 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** What the money actually does — three lines of spec, not three sales pitches. */
const uses = [
  {
    label: "Podpora ustvarjalcem",
    text: "Neposredna podpora najinemu delu.",
  },
  {
    label: "Boljša oprema",
    text: "Boljši zvok in produkcija.",
  },
  {
    label: "Več vsebin",
    text: "Več časa za nove pogovore.",
  },
];

const Support = () => {
  const [sectionRef, shown] = useReveal();

  return (
    <section
      className={`support${shown ? " is-in" : ""}`}
      id="support"
      aria-labelledby="support-title"
      ref={sectionRef}
    >
      <div className="support__inner">
        <p className="support__eyebrow" data-reveal>
          Podpri
        </p>

        <div className="support__head">
          <h2 className="support__title" id="support-title" data-reveal style={{ "--reveal-i": 1 }}>
            Podpri naš podcast
          </h2>

          <div className="support__aside">
            <p className="support__lead" data-reveal style={{ "--reveal-i": 2 }}>
              Vsaka kava nama pomaga posneti boljšo epizodo.
            </p>

            <a
              className="support__cta"
              data-reveal
              style={{ "--reveal-i": 3 }}
              href="https://buymeacoffee.com/individuum.podcast"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CoffeeIcon />
              Kupi nam kavo ↗
            </a>
          </div>
        </div>

        <ul className="support__uses">
          {uses.map((use, i) => (
            <li className="support__use" key={use.label} data-reveal style={{ "--reveal-i": 4 + i }}>
              <span className="support__use-label">{use.label}</span>
              <p className="support__use-text">{use.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Support;
