import { motion } from "framer-motion";
import HeroSection from "../sections/home/HeroSection";
import LeadershipAccordion from "../sections/home/LeadershipAccordion";
import LeadershipQuote from "../sections/home/LeadershipQuote";
import NewsSection from "../sections/home/NewsSection";

import "../styles/home.css";
export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <HeroSection />
      <LeadershipAccordion />
      <LeadershipQuote/>
      <NewsSection />
      
    </motion.main>
  );
}
