import Hero from './Hero';
import Support from './Support';
import useDocumentTitle from '../hooks/useDocumentTitle';
import FeaturedGuests from './FeaturedGuests';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  useDocumentTitle('Individuum Podcast');

  return (
    <>
      <Helmet>
        <title>Individuum Podcast | Daj vsaki zgodbi priložnost</title>
        <meta
          name="description"
          content="Individuum podcast raziskuje navdihujoče življenjske zgodbe, edinstvene poglede in izkušnje posameznikov, ki izstopajo po svojem znanju, idejah ter podjetniški miselnosti."
        />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="Individuum Podcast | Daj vsaki zgodbi priložnost" />
        <meta
          property="og:description"
          content="Individuum podcast raziskuje navdihujoče življenjske zgodbe, edinstvene poglede in izkušnje posameznikov, ki izstopajo po svojem znanju, idejah ter podjetniški miselnosti."
        />
        <meta property="og:url" content="https://individuum-podcast.si/" />
      </Helmet>
      <main>
        <Hero />
        <FeaturedGuests />
        <Support id="support" />
      </main>
    </>
  );
};

export default Home; 