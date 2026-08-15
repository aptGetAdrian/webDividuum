import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useReveal from "../hooks/useReveal";
import "./Hosts.css";

/**
 * The ProfileCard-based version of this page is preserved verbatim in
 * HostsLegacy.jsx, and the block itself is untouched in
 * src/blocks/Components/ProfileCard — the avatar fields below are kept for it.
 */
const members = [
  {
    name: "Lan Kokol",
    role: "Soustanovitelj in voditelj",
    handle: "lan_kokol",
    link: "https://www.instagram.com/lan_kokol/",
    photo: "/assets/lan2-min.png",
    miniAvatar: "/assets/lanTtitle.jpg",
    bio: "Vztrajen in odločen. Privlačijo ga konkretne stvari, preverjena dejstva in izzivi, ki premikajo meje. Če ga ni za mikrofonom, ga najbrž najdeš visoko v hribih, na kolesu ali sredi nove ideje. V podcast ekipi poskrbi, da pogovor ostane znotraj realnih okvirov – a vedno odprt za nova vprašanja.",
  },
  {
    name: "Patrik Majhen",
    role: "Soustanovitelj in voditelj",
    handle: "patrikmajhen",
    link: "https://www.instagram.com/patrikmajhen/",
    photo: "/assets/patrik3-min.png",
    miniAvatar: "/assets/patrikTitle.jpg",
    bio: "Na prvi vtis miren in premišljen, a ob pravih trenutkih hitro razkrije svojo energičnost in zagnanost. Ceni ravnovesje med delom in prostim časom ter se posveča stvarem, ki ga z energijo polnijo, ne pa izčrpavajo. Ko ni za mikrofonom, ga najdeš med gradbenimi načrti, z družino, prijatelji ali zunaj – povsod tam, kjer je prisoten šport.",
  },
  {
    name: "Vid Buzeti",
    role: "Voditelj",
    handle: "vid.buzeti",
    link: "https://www.instagram.com/vid.buzeti/",
    photo: "/assets/vid2-min.png",
    miniAvatar: "/assets/vidTitle.jpg",
    bio: "Študent medicine, ki ga ne zanimajo samo diagnoze, ampak tudi širša slika sveta. Rad postavlja specifična, zahtevna vprašanja in razmišlja izven klasičnih okvirjev. Skozi perspektivo medicine si rad razlaga širše družbene pojme in povezave.",
  },
  {
    name: "Aljaž Balažic",
    role: "Urednik videov",
    handle: "aljazbalazic",
    link: "https://www.instagram.com/aljazbalazic/",
    photo: "/assets/aljaz1-min.png",
    miniAvatar: "/assets/aljazTitle.jpg",
    bio: "Član ekipe, ki skrbi, da pogovori ne ostanejo le v zvoku – ampak zaživijo tudi na zaslonih. Glavni kreator in urednik videov.",
  },
  // Was commented out in the previous version; left here so it is one line to restore.
  // {
  //   name: "Adrian Cvetko",
  //   role: "Tehnična podpora",
  //   handle: "adri____an",
  //   link: "https://www.instagram.com/adri____an/",
  //   photo: "/assets/adrian1-min.png",
  //   miniAvatar: "/assets/adrianTtitle.jpg",
  //   bio: "Mojster v ozadju – skrbi za programerski del, tehniko in digitalne rešitve. Da vse teče gladko, je njegova zasluga.",
  // },
];

const Hosts = () => {
  useDocumentTitle("O podkastu");

  // Touch devices have no hover: first tap reveals the bio, second opens Instagram.
  const [revealed, setRevealed] = useState(null);
  const [tapToReveal, setTapToReveal] = useState(false);
  const [introRef, introShown] = useReveal();
  const teamRef = useRef(null);

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
      if (!teamRef.current?.contains(event.target)) setRevealed(null);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [revealed]);

  const handleCardClick = (index) => (event) => {
    if (!tapToReveal || revealed === index) return; // let the link through
    event.preventDefault();
    setRevealed(index);
  };

  return (
    <>
      <Helmet>
        <title>Individuum Podcast | O podkastu</title>
        <meta
          name="description"
          content="Vodita ga Lan in Patrik, raziskujeta edinstvene zgodbe, poglede in izkušnje posameznikov. Spoznajte gostitelja in ekipo."
        />
        <link rel="canonical" href="/o-podcastu" />
      </Helmet>

      <main className={`about${introShown ? " is-in" : ""}`} ref={introRef}>
        <div className="about__inner">
          <p className="about__eyebrow" data-reveal>
            O podkastu
          </p>

          <div className="about__intro">
            <h1 className="about__title" data-reveal style={{ "--reveal-i": 1 }}>
              O podcastu
            </h1>

            <div className="about__text" data-reveal style={{ "--reveal-i": 2 }}>
              <p>
                <b>Individuum Podcast</b> je prostor, kjer se resnici ne prisega, temveč se ji
                pogumno približuje skozi zgodbe drugih. Vodita ga Lan in Patrik, dva radovedna
                študenta, ki se ne bojita sesti za mizo z ljudmi, ki mislijo drugače, živijo drugače
                ali so preprosto doživeli nekaj, česar sama še nista.
              </p>
              <p>
                To ni podkast z navodili za življenje. To je podkast, kjer sogovorniki s svojimi
                zgodbami razrahljajo gotovosti, odprejo nova vprašanja in pokažejo, da svet ni
                enobarven. Včasih boste ob poslušanju našli odgovore, drugič le še več dvomov – a
                prav v tem je čar.
              </p>
              <p>
                Individuum ni oddaja o tem, kako biti enak. Je povabilo, da prisluhnete različnosti
                in morda v njej prepoznate del sebe.
              </p>
            </div>
          </div>
        </div>

        <p className="about__eyebrow about__eyebrow--team">Ekipa</p>

        <div className="team" ref={teamRef}>
          {members.map((member, index) => (
            <a
              key={member.handle}
              className={`member${revealed === index ? " is-revealed" : ""}`}
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCardClick(index)}
            >
              <span className="member__stage">
                <img
                  className="member__photo"
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                />
                <span className="member__panel">
                  <span className="member__bio">{member.bio}</span>
                  <span className="member__handle">@{member.handle} ↗</span>
                </span>
              </span>

              <span className="member__caption">
                <span className="member__name">{member.name}</span>
                <span className="member__role">{member.role}</span>
              </span>
            </a>
          ))}
        </div>
      </main>
    </>
  );
};

export default Hosts;
