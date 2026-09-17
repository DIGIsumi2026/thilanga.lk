import { motion } from "framer-motion";
import ContactHero from "../sections/contact/ContactHero";
import ContactFormSection from "../sections/contact/ContactFormSection";
import "../styles/contact.css";
export default function Contact() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ContactHero/>
      <ContactFormSection/>
    </motion.main>
  );
}
