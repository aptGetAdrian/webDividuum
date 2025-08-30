import Hero from './Hero';
import Hosts from './Hosts';
import FeaturedGuests from './FeaturedGuests';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Home = () => {
  useDocumentTitle('Individuum Podcast');
  
  return (
    <main>
      <Hero />
      {/* <Hosts /> */}
      <FeaturedGuests />
    </main>
  );
};

export default Home; 