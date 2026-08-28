import { motion } from "framer-motion";
import PageHero from "../components/common/PageHero";
import ContactForm from "../sections/contact/ContactForm";
import "../styles/contact.css";
export default function Contact() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHero title="Contact us" breadcrumb="Contact us" />
      <ContactForm />
    </motion.main>
  );
}
