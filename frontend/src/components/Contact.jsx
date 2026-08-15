import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import emailjs from "emailjs-com";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useReveal from "../hooks/useReveal";
import "./Contact.css";

const RATE_LIMIT = 2;
const RATE_LIMIT_WINDOW = 60 * 1000;
const STORAGE_KEY = "contact_form_submissions";

const FIELDS = [
  { name: "name", label: "Ime in priimek", type: "text", autoComplete: "name" },
  { name: "email", label: "E-pošta", type: "email", autoComplete: "email" },
  { name: "subject", label: "Zadeva", type: "text", autoComplete: "off" },
];

/** Counts down without re-rendering the form around it. */
const RateLimitTimer = ({ resetTime }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!resetTime) return undefined;
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((resetTime - Date.now()) / 1000)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [resetTime]);

  // Never return nothing: the button label is this component, and between the
  // countdown hitting zero and the next rate-limit poll it would render empty.
  return <>{secondsLeft > 0 ? `Počakajte ${secondsLeft}s` : "Počakajte"}</>;
};

const Contact = () => {
  useDocumentTitle("Individuum kontakt");

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [rateLimit, setRateLimit] = useState({ remaining: RATE_LIMIT, resetTime: null, isBlocked: false });
  const [sectionRef, shown] = useReveal();

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const recent = submissions.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));

    const remaining = Math.max(0, RATE_LIMIT - recent.length);
    setRateLimit({
      remaining,
      isBlocked: remaining === 0,
      resetTime: remaining === 0 && recent.length > 0 ? recent[0] + RATE_LIMIT_WINDOW : null,
    });
  }, []);

  useEffect(() => {
    checkRateLimit();
    const interval = setInterval(checkRateLimit, 5000);
    return () => clearInterval(interval);
  }, [checkRateLimit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rateLimit.isBlocked) {
      setStatus({ type: "error", message: "Preveč sporočil. Poskusite čez minuto." });
      return;
    }

    setStatus({ type: "loading", message: "" });

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { ...formData },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      submissions.push(Date.now());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
      checkRateLimit();

      setStatus({ type: "success", message: "Sporočilo je poslano. Hvala — oglasiva se čim prej." });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form failed:", error);
      setStatus({ type: "error", message: "Sporočila ni bilo mogoče poslati. Poskusite znova." });
    }
  };

  const sending = status.type === "loading";

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

      <main className={`contact${shown ? " is-in" : ""}`} ref={sectionRef}>
        <div className="contact__inner">
          <p className="contact__eyebrow" data-reveal>
            Kontakt
          </p>

          <div className="contact__grid">
            <div className="contact__intro">
              <h1 className="contact__title" data-reveal style={{ "--reveal-i": 1 }}>
                Vstopite v stik z nami
              </h1>
              <p className="contact__lead" data-reveal style={{ "--reveal-i": 2 }}>
                Imate vprašanje, predlog ali želite deliti svojo zgodbo? Pišite nam!
              </p>
            </div>

            <form className="contact__form" onSubmit={handleSubmit} data-reveal style={{ "--reveal-i": 2 }}>
              {FIELDS.map((field) => (
                <div className="contact__field" key={field.name}>
                  <label className="contact__label" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    className="contact__input"
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <div className="contact__field">
                <label className="contact__label" htmlFor="message">
                  Sporočilo
                </label>
                <textarea
                  className="contact__input contact__input--area"
                  id="message"
                  name="message"
                  rows="7"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__actions">
                <button
                  type="submit"
                  className="contact__submit"
                  disabled={sending || rateLimit.isBlocked}
                >
                  {rateLimit.isBlocked ? (
                    <RateLimitTimer resetTime={rateLimit.resetTime} />
                  ) : sending ? (
                    "Pošiljam…"
                  ) : (
                    "Pošlji sporočilo"
                  )}
                </button>

                {rateLimit.remaining < RATE_LIMIT && !rateLimit.isBlocked && (
                  <p className="contact__quota">
                    Še {rateLimit.remaining} sporočil{rateLimit.remaining === 1 ? "o" : "i"} to minuto
                  </p>
                )}
              </div>

              {/* Announced to screen readers — the old version changed silently. */}
              <p
                className={`contact__status${status.message ? ` contact__status--${status.type}` : ""}`}
                role="status"
                aria-live="polite"
              >
                {status.message}
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
