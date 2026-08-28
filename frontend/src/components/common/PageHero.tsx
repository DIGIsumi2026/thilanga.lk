import { motion } from "framer-motion";
import { imageAssets } from "../../assets/imageAssets";

export default function PageHero({
  title,
  breadcrumb,
}: {
  title: string;
  breadcrumb: string;
}) {
  return (
    <section
      className="page-hero"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(5,25,33,.96),rgba(5,25,33,.62)), url(${imageAssets.hero.slide2})`,
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.25 }}
      >
        Over the years, our commitment to excellence and passion for clients has
        been recognized.
      </motion.p>
      <div className="breadcrumb">
        Home <span>/</span> {breadcrumb}
      </div>
    </section>
  );
}
