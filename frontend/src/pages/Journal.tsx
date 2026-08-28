import { motion } from "framer-motion";
import PageHero from "../components/common/PageHero";
import JournalGrid from "../sections/journal/JournalGrid";
import "../styles/journal.css";
export default function Journal() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHero title="Latest journal" breadcrumb="Journal" />
      <JournalGrid />
    </motion.main>
  );
}
