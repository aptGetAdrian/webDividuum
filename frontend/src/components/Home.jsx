import Hero from './Hero';
import Support from './Support';
import useDocumentTitle from '../hooks/useDocumentTitle';
import FeaturedGuests from './FeaturedGuests';

const Home = () => {
  useDocumentTitle('Individuum Podcast');
  
  return (
    <main>
      <Hero />
      <FeaturedGuests />
      <Support />
    </main>
  );
};

export default Home; 