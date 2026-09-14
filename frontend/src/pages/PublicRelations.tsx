import {motion} from 'framer-motion';
import PublicRelationsHero from '../sections/public-relations/PublicRelationsHero';
import '../styles/public-relations.css';

export default function PublicRelations() {
  return (
    <motion.main
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
    >
      <PublicRelationsHero />
    </motion.main>
  );
}