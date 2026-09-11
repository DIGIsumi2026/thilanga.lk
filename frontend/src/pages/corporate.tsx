import {motion} from 'framer-motion';
import CorporateHero from '../sections/corporate/CorporateHero';
import CorporateChairman from '../sections/corporate/CorporateChairman';
import CorporateCompanies from '../sections/corporate/CorporateCompanies';
import CorporateGallery from '../sections/corporate/CorporateGallery';
import CricketLegacy from '../sections/corporate/CricketLegacy';
import DambullaLegacy from '../sections/corporate/DambullaLegacy';
import TelecommunicationsLegacy from '../sections/corporate/TelecommunicationsLegacy';
import '../styles/corporate.css';

export default function Corporate() {
  return (
    <motion.main
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
    >
      <CorporateHero />
      <CorporateChairman/>
      <CorporateCompanies/>
      <CorporateGallery/>
      <CricketLegacy/>
      <DambullaLegacy/>
      <TelecommunicationsLegacy/>
    </motion.main>
  );
}