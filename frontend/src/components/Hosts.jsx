import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Hosts.css';
import ProfileCard from '/src/blocks/Components/ProfileCard/ProfileCard';

const Hosts = () => {
  useDocumentTitle('O podkastu');

  const [particlesLoaded2, setParticlesLoaded] = useState(false);

  const particlesLoaded = (container) => {
    setParticlesLoaded(true);
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  // identical particle configuration to Contact.jsx
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
      number: {
        density: { enable: true, area: 800 },
        value: 150,
      },
      opacity: {
        value: { min: 0.1, max: 0.3 },
        animation: { enable: true, speed: 0.3, minimumValue: 0.1, sync: false }
      },
      shape: { type: "circle" },
      size: { value: { min: 0.5, max: 2 } },
    },
    detectRetina: true,
  };

  const particlesMemo = useMemo(() => (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded2}
      options={particlesOptions}
    />
  ), []);

  return (
    <section className="hosts section">
      {/* Particle Background */}
      <div className="particles-container">
        {particlesMemo}
      </div>

      <div className="container">
        <motion.div
          className="podcast-description"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="podcast-title">O PODCASTU</h2>
          <p className="podcast-text">
            <b>Individuum Podcast</b> je prostor, kjer se resnici ne prisega, temveč se ji pogumno približuje skozi zgodbe drugih. Vodita ga Lan in Patrik, dva radovedna študenta, ki se ne bojita sesti za mizo z ljudmi, ki mislijo drugače, živijo drugače ali so preprosto doživeli nekaj, česar sama še nista.
          </p>
          <br />
          <p className="podcast-text">
            To ni podkast z navodili za življenje. To je podkast, kjer sogovorniki s svojimi zgodbami razrahljajo gotovosti, odprejo nova vprašanja in pokažejo, da svet ni enobarven. Včasih boste ob poslušanju našli odgovore, drugič le še več dvomov – a prav v tem je čar.
          </p>
          <br />
          <p className="podcast-text">
            Individuum ni oddaja o tem, kako biti enak. Je povabilo, da prisluhnete različnosti in morda v njej prepoznate del sebe.
          </p>
        </motion.div>

        {/* Hosts */}
        <motion.div
          className="host-section"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a href="https://www.instagram.com/lan_kokol/" target="_blank" rel="noopener noreferrer">
            <ProfileCard
              name="Lan Kokol"
              title="Voditelj"
              handle="lan_kokol"
              avatarUrl="/assets/lan2-min.png"
              enableTilt={true}
              iconUrl="/assets/titleImage.png"
              miniAvatarUrl="/assets/lanTtitle.jpg"
            />
          </a>
          <div className="host-content">
            <h2>Lan Kokol</h2>
            <h3>Soustanovitelj in voditelj</h3>
            <br />
            <p>
              Vztrajen in odločen. Privlačijo ga konkretne stvari, preverjena dejstva in izzivi, ki premikajo meje. Če ga ni za mikrofonom, ga najbrž najdeš visoko v hribih, na kolesu ali sredi nove ideje. V podcast ekipi poskrbi, da pogovor ostane znotraj realnih okvirov – a vedno odprt za nova vprašanja.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="host-section reverse"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="https://www.instagram.com/patrikmajhen/" target="_blank" rel="noopener noreferrer">
            <ProfileCard
              name="Patrik Majhen"
              title="Voditelj"
              handle="patrikmajhen"
              avatarUrl="/assets/patrik2-min.png"
              enableTilt={true}
              iconUrl="/assets/titleImage.png"
              miniAvatarUrl="/assets/patrikTitle.jpg"
            />
          </a>
          <div className="host-content">
            <h2>Patrik Majhen</h2>
            <h3>Soustanovitelj in voditelj</h3>
            <br />
            <p>
              Na prvi vtis miren in premišljen, a ob pravih trenutkih hitro razkrije svojo energičnost in zagnanost. Ceni ravnovesje med delom in prostim časom ter se posveča stvarem, ki ga z energijo polnijo, ne pa izčrpavajo. Ko ni za mikrofonom, ga najdeš med gradbenimi načrti, z družino, prijatelji ali zunaj – povsod tam, kjer je prisoten šport.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="host-section"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a href="https://www.instagram.com/aljazbalazic/" target="_blank" rel="noopener noreferrer">
            <ProfileCard
              name="Aljaž Balažic"
              title="Urednik"
              handle="aljazbalazic"
              avatarUrl="/assets/aljaz1-min.png"
              enableTilt={true}
              iconUrl="/assets/titleImage.png"
              miniAvatarUrl="/assets/aljazTitle.jpg"
            />
          </a>
          <div className="host-content">
            <h2>Aljaž Balažic</h2>
            <h3>Urednik videov</h3>
            <br />
            <p>
              Član ekipe, ki skrbi, da pogovori ne ostanejo le v zvoku – ampak zaživijo tudi na zaslonih. Glavni kreator in urednik videov.
            </p>
          </div>
        </motion.div>

        {/*
        <motion.div
          className="host-section reverse"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="https://www.instagram.com/adri____an/" target="_blank" rel="noopener noreferrer">
            <ProfileCard
              name="Adrian Cvetko"
              title="Programer"
              handle="adri____an"
              status=""
              contactText=""
              avatarUrl="/assets/adrian1-min.png"
              enableTilt={true}
              iconUrl="/assets/titleImage.png"
              miniAvatarUrl="/assets/adrianTtitle.jpg"
            />
          </a>
          <div className="host-content">
            <h2>Adrian Cvetko</h2>
            <h3>Tehnična podpora</h3>
            <br></br>
            <p>
              Mojster v ozadju – skrbi za programerski del, tehniko in digitalne rešitve. Da vse teče gladko, je njegova zasluga.
            </p>
          </div>
        </motion.div>

         */}
      </div>

    </section>
  );
};

export default Hosts;