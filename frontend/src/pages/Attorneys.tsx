import { motion } from "framer-motion";
import PageHero from "../components/common/PageHero";
import AttorneyGrid from "../sections/attorneys/AttorneyGrid";
import "../styles/attorneys.css";
export default function Attorneys() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHero title="Attorneys" breadcrumb="Our attorneys" />
      <AttorneyGrid />
    </motion.main>
  );
}
