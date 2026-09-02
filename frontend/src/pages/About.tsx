import { motion } from "framer-motion";
import AboutIntro from "../sections/about/AboutIntro";
import AchievementSection from "../sections/home/AchievementSection";
import AttorneysSection from "../sections/home/AttorneysSection";
import "../styles/about.css";
export default function About() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AboutIntro />
      <AchievementSection />
      <AttorneysSection />
    </motion.main>
  );
}
