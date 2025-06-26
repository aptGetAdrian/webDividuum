import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import './index.css';
import Hosts from './components/Hosts';
import Episodes from './components/Episodes';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/o-nama" element={<Hosts />} />
          <Route path="/epizode" element={<Episodes/>} />
          <Route path="/podpora" element={
            <div className="coming-soon section">
              <div className="container">
                <h1>Podpora projekta</h1>
                <p>Coming soon...</p>
              </div>
            </div>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 