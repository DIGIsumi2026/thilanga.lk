import {motion} from 'framer-motion';
import CorporateHero from '../sections/corporate/CorporateHero';
import '../styles/corporate.css';

export default function Corporate() {
  return (
    <motion.main
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
    >
      <CorporateHero />
    </motion.main>
  );
}