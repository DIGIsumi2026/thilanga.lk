import { motion } from "framer-motion";
import AboutIntro from "../sections/about/AboutIntro";
import AboutBiography from "../sections/about/AboutBiography";
import "../styles/about.css";
export default function About() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AboutIntro />
      <AboutBiography/>
    </motion.main>
  );
}
