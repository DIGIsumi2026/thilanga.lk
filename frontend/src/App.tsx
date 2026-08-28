import { AnimatePresence } from 'framer-motion';

import {Route,Routes,useLocation} from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingContact from './components/common/FloatingContact';
import ScrollToTop from './components/common/ScrollToTop';
import SmoothScroll from './components/common/SmoothScroll';

import Home from './pages/Home';
import About from './pages/About';
import PracticeAreas from './pages/PracticeAreas';
import Attorneys from './pages/Attorneys';
import Journal from './pages/Journal';
import Contact from './pages/Contact';

export default function App() {
  const location = useLocation();

  return (
    <SmoothScroll>
      <ScrollToTop />

      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname} >

          {/* navigation routes */}

          <Route path="/" element={<Home />} />
          <Route path="/about-me" element={<About />}/>
          <Route path="/corporate" element={<PracticeAreas />} />
          <Route path="/political" element={<Attorneys />}/>

          <Route path="/public-relations" element={<Journal />}/>

          <Route path="/contact" element={<Contact />}/>

          {/* temporary legacy routes */}

          <Route path="/about" element={<About />}/>
          <Route path="/practice-areas"element={<PracticeAreas />}/>
          <Route path="/attorneys" element={<Attorneys />}/>
          <Route path="/journal" element={<Journal />}/>

        </Routes>
      </AnimatePresence>

      <Footer />

      <FloatingContact />
    </SmoothScroll>
  );
}