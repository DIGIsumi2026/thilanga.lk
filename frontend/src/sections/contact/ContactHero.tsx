import {imageAssets} from '../../assets/imageAssets';
import {motion} from 'framer-motion';

const ContactHero = () => {
  return (
    <section
      className="contact-hero"
      style={{
        backgroundImage:`url(${imageAssets.contact.hero})`,
      }}
    >
      <div className="contact-hero-overlay" />

      <motion.div 
        className="contact-hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <span className="contact-hero-kicker">
        </span>

        <h1>
         Get in Touch
        </h1>

        <p>
          For official inquiries, public relations, corporate communication,
          and general correspondence, please connect with the office of
          Thilanga Sumathipala. Our team will be happy to assist you promptly
          and professionally.
        </p>
      </motion.div>
    </section>
  );
};

export default ContactHero;