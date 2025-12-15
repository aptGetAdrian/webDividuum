import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import Hosts from './components/Hosts';
import Episodes from './components/Episodes';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Helmet>
          <html lang="sl" />
          <title>Individuum Podcast | Daj vsaki zgodbi priložnost</title>

          <meta
            name="description"
            content="Individuum podcast raziskuje navdihujoče življenjske zgodbe, edinstvene poglede in izkušnje posameznikov, ki izstopajo po svojem znanju, idejah ter podjetniški miselnosti. Pogovarjamo se o podjetništvu, filozofiji, zgodovini in mladostništvu..."
          />

          <meta
            name="keywords"
            content="Individuum Podcast, podcasts, podkast, individum podkast, individum, individuum, individuum podkast, lan kokol, patrik majhen, patrik, lan, slovenija, slovenski podcast, slovenski podkast, intervju, kreativnost, podjetništvo, inovacija, pogovori, zgodbe, življenska zgodba, interviews, creativity, innovation, thoughtful conversations, stories, inspiration"
          />

          <link rel="canonical" href="https://individuum-podcast.si/" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://individuum-podcast.si/" />
          <meta
            property="og:see_also"
            content="https://www.facebook.com/p/Individuum-Podcast-61566305171608/"
          />
          <meta property="og:title" content="Individuum Podcast" />
          <meta
            property="og:description"
            content="Individuum podcast raziskuje navdihujoče življenjske zgodbe, edinstvene poglede in izkušnje posameznikov, ki izstopajo po svojem znanju, idejah ter podjetniški miselnosti. Pogovarjamo se o podjetništvu, filozofiji, športu, zgodovini, duhovnosti in mladostništvu..."
          />
          <meta
            property="og:image"
            content="https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/539904778_122172892022543505_414152127496174383_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=iP0Cgr3c7zwQ7kNvwFykEDE&_nc_oc=AdmmtUctCy05U15VsmZAeIeefBQ5j1--EP18h6HfXgC_t7JZABs7gxoKgJREBC5dxPA&_nc_zt=23&_nc_ht=scontent-vie1-1.xx&_nc_gid=6t1LXZXM9yGkgEkcKa6dLA&oh=00_AfemkSa043UV7Og7AASFYGKXh-TS-D9ji2AnqyioZaRdNQ&oe=68F2A54A"
          />

          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'PodcastSeries',
              name: 'Individuum Podcast | Daj vsaki zgodbi priložnost',
              url: 'https://individuum-podcast.si/',
              description:
                'Individuum podcast raziskuje navdihujoče življenjske zgodbe, edinstvene poglede in izkušnje posameznikov, ki izstopajo po svojem znanju, idejah ter podjetniški miselnosti. Pogovarjamo se o podjetništvu, filozofiji, športu, zgodovini, duhovnosti in mladostništvu...',
              publisher: {
                '@type': 'Organization',
                name: 'Individuum Media',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/539904778_122172892022543505_414152127496174383_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=iP0Cgr3c7zwQ7kNvwFykEDE&_nc_oc=AdmmtUctCy05U15VsmZAeIeefBQ5j1--EP18h6HfXgC_t7JZABs7gxoKgJREBC5dxPA&_nc_zt=23&_nc_ht=scontent-vie1-1.xx&_nc_gid=6t1LXZXM9yGkgEkcKa6dLA&oh=00_AfemkSa043UV7Og7AASFYGKXh-TS-D9ji2AnqyioZaRdNQ&oe=68F2A54A',
                },
              },
              inLanguage: 'sl',
            })}
          </script>
        </Helmet>

        {/* Your app layout */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/o-podcastu" element={<Hosts />} />
          <Route path="/epizode" element={<Episodes />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
