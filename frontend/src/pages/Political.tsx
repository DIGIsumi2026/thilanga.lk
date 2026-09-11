import {motion} from 'framer-motion';
import PoliticalHero from '../sections/political/PoliticalHero';
import PoliticalParliament from '../sections/political/PoliticalParliament';
import '../styles/political.css';

export default function Political() {
  return (
    <motion.main
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
    >
      <PoliticalHero />
      <PoliticalParliament/>
    </motion.main>
  );
}
