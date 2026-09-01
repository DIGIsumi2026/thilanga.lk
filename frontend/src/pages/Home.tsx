import { motion } from "framer-motion";
import HeroSection from "../sections/home/HeroSection";
import LeadershipAccordion from "../sections/home/LeadershipAccordion";
import LeadershipQuote from "../sections/home/LeadershipQuote";
import NewsSection from "../sections/home/NewsSection";



import AboutSection from "../sections/home/NewsSection";
import PracticeCarousel from "../sections/home/PracticeCarousel";
import AchievementSection from "../sections/home/AchievementSection";
import ExpertiseSection from "../sections/home/ExpertiseSection";
import AttorneysSection from "../sections/home/AttorneysSection";
import TestimonialSection from "../sections/home/TestimonialSection";
import BlogSection from "../sections/home/BlogSection";
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




      
      <PracticeCarousel />
      <AchievementSection />
      <ExpertiseSection />
      <AttorneysSection />
      <TestimonialSection />
      <BlogSection />
    </motion.main>
  );
}
