import { motion } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Hosts.css';
import ProfileCard from '/src/blocks/Components/ProfileCard/ProfileCard'
import TiltedCard from '/src/blocks/Components/TiltedCard/TiltedCard';

const Hosts = () => {
  useDocumentTitle('O podkastu');

  return (
    <section className="hosts section" style={{ marginTop: '8vh' }}>



      <div className="container">
        <motion.div
          className="podcast-description"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="podcast-title">O podkastu</h2>
          <p className="podcast-text">
            <b>Individuum Podcast</b> je prostor, kjer se resnici ne prisega, temveč se ji pogumno približuje skozi zgodbe drugih. Vodita ga Lan in Patrik, dva radovedna študenta, ki se ne bojita sesti za mizo z ljudmi, ki mislijo drugače, živijo drugače ali so preprosto doživeli nekaj, česar sama še nista.
          </p>
          <br></br>
          <p className="podcast-text">
            To ni podkast z navodili za življenje. To je podkast, kjer sogovorniki s svojimi zgodbami razrahljajo gotovosti, odprejo nova vprašanja in pokažejo, da svet ni enobarven. Včasih boste ob poslušanju našli odgovore, drugič le še več dvomov – a prav v tem je čar.
          </p>

          <br></br>
          <p className="podcast-text">
            Individuum ni oddaja o tem, kako biti enak. Je povabilo, da prisluhnete različnosti in morda v njej prepoznate del sebe.
          </p>



        </motion.div>

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
              status=""
              contactText=""
              avatarUrl="/assets/lan_card.png"
              enableTilt={true}
              iconUrl="/assets/titleImage.png"
            />
          </a>
          <div className="host-content">
            <h2>Lan Kokol</h2>
            <h3>Soustanovitelj in voditelj</h3>
            <br></br>
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
              status=""
              contactText=""
              avatarUrl="/assets/pato.png"
              enableTilt={true}
              iconUrl="/assets/titleImage.png"
            />
          </a>
          <div className="host-content">
            <h2>Patrik Majhen</h2>
            <h3>Soustanovitelj in voditelj</h3>
            <br></br>
            <p>
              Na prvi vtis miren in premišljen, a ob pravih trenutkih hitro razkrije svojo energičnost in zagnanost. Ceni ravnovesje med delom in prostim časom ter se posveča stvarem, ki ga z energijo polnijo, ne pa izčrpavajo. Ko ni za mikrofonom, ga najdeš med gradbenimi načrti, z družino, prijatelji ali zunaj – povsod tam, kjer je prisoten šport.
            </p>
          </div>
        </motion.div>

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
              status=""
              contactText=""
              avatarUrl="/assets/lan_card.png"
              enableTilt={true}
              iconUrl="/assets/titleImage.png"
            />
          </a>
          <div className="host-content">
            <h2>Aljaž Balažic</h2>
            <h3>Urednik videov</h3>
            <br></br>
            <p>
              Član ekipe, ki skrbi, da pogovori ne ostanejo le v zvoku – ampak zaživijo tudi na zaslonih. Glavni kreator in urednik videjev.
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
              status=""
              contactText=""
              avatarUrl="/assets/pato.png"
              enableTilt={true}
              iconUrl="/assets/titleImage.png"
            />
          </a>
          <div className="host-content">
            <h2>Adrian Cvetko</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hosts;