import {motion} from 'framer-motion';
import {imageAssets} from '../../assets/imageAssets';

const AboutIntro = () => {
  return (
    <section className="about-intro">
      <div className="about-intro-media">
        <img
          src={imageAssets.about.hero}
          alt="Thilanga Sumathipala"
          className="about-intro-image"
        />

        <div className="about-intro-overlay" />
      </div>

      <div className="about-intro-container">
        <motion.div
          className="about-intro-content"
          initial={{opacity:0,y:30}}
          animate={{opacity:1,y:0}}
          transition={{
            duration:0.9,
            ease:[0.22,1,0.36,1],
          }}
        >

          <blockquote className="about-intro-quote">
            “Shaped by enterprise Driven by public service Defined by leadership ”
          </blockquote>
        </motion.div>
      </div>

      <div
        className="about-intro-bottom-line"
        aria-hidden="true"
      />
    </section>
  );
};

export default AboutIntro;