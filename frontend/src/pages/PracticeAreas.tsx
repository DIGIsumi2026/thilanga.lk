import { motion } from "framer-motion";
import PageHero from "../components/common/PageHero";
import PracticeGrid from "../sections/practice/PracticeGrid";
import "../styles/practice.css";
export default function PracticeAreas() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHero title="Practice areas" breadcrumb="Legal practice areas" />
      <PracticeGrid />
    </motion.main>
  );
}
