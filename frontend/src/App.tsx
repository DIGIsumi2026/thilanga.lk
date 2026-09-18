import { AnimatePresence } from 'framer-motion';

import {Route,Routes,useLocation} from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
{/*
import FloatingContact from './components/common/FloatingContact';
*/}
import ScrollToTop from './components/common/ScrollToTop';
import RouteScrollRestoration from './components/common/RouteScrollRestoration';
import SmoothScroll from './components/common/SmoothScroll';
import CustomScrollbar from './components/common/CustomScrollbar';
import { PageLoadProvider } from './components/common/page-loader/PageLoadContext';
import { PageReloadTransition } from './components/common/page-loader/PageReloadTransition';

import Home from './pages/Home';
import About from './pages/About';
import Corporate from './pages/corporate';
import Political from './pages/Political';
import Journal from './pages/PublicRelations';
import Contact from './pages/Contact';

export default function App() {
  const location = useLocation();

  return (
    <PageLoadProvider>
      <PageReloadTransition>
        <SmoothScroll>
          <ScrollToTop />
          <RouteScrollRestoration />
          <CustomScrollbar />

          <Navbar />

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname} >

              {/* navigation routes */}

              <Route path="/" element={<Home />} />
              <Route path="/about-me" element={<About />}/>
              <Route path="/corporate" element={<Corporate/>} />
              <Route path="/political" element={<Political/>} />

              <Route path="/public-relations" element={<Journal />}/>

              <Route path="/contact" element={<Contact />}/>

              {/* temporary legacy routes */}

              <Route path="/about" element={<About />}/>
              <Route path="/corporate" element={<Corporate/>} />
              <Route path="/political" element={<Political/>} />
              <Route path="/journal" element={<Journal />}/>

            </Routes>
          </AnimatePresence>

          <Footer />

          {/*<FloatingContact /> */}
        </SmoothScroll>
      </PageReloadTransition>
    </PageLoadProvider>
  );
}