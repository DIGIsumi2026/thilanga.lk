import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {motion} from 'framer-motion';
import {imageAssets} from '../../assets/imageAssets';

const AboutContactCTA = () => {
  return (
    <section
      className="about-contact-cta"
      style={{
        backgroundImage:`url(${imageAssets.about.contactCta})`,
      }}
    >
      <div className="about-contact-cta-overlay" />

      <div className="about-contact-cta-container">
        <motion.div
          className="about-contact-cta-content"
          initial={{opacity:0,y:28}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true,amount:0.35}}
          transition={{
            duration:0.85,
            ease:[0.22,1,0.36,1],
          }}
        >

          <h2>
            Let's connect through leadership, enterprise,
            public service and meaningful impact.
          </h2>

          <Link
            to="/contact"
            className="pill hero-more-button about-contact-cta-button"
          >
            Contact
            <span>
              <ArrowUpRight size={14} strokeWidth={1.7} />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutContactCTA;
