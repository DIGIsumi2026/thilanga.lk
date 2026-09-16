import {motion} from 'framer-motion';
import PublicRelationsHero from '../sections/public-relations/PublicRelationsHero';
import PublicRelationsSocialService from '../sections/public-relations/PublicRelationsSocialService';
import PublicRelationsFoundation from '../sections/public-relations/PublicRelationsFoundation';
import PublicRelationsMilinaMatha from '../sections/public-relations/PublicRelationsMilinaMatha';
import PublicRelationsGautamaBuddhaMatha from '../sections/public-relations/PublicRelationsGautamaBuddhaMatha';
import PublicRelationsSumathiAwards from '../sections/public-relations/PublicRelationsSumathiAwards';
import '../styles/public-relations.css';

export default function PublicRelations() {
  return (
    <motion.main
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
    >
      <PublicRelationsHero />
      <PublicRelationsSocialService/>
      <PublicRelationsFoundation/>
      <PublicRelationsMilinaMatha/>
      <PublicRelationsGautamaBuddhaMatha/>
      <PublicRelationsSumathiAwards/>
    </motion.main>
  );
}