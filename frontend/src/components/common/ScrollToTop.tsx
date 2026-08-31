import {useEffect,useState} from 'react';
import {ArrowUp} from 'lucide-react';
import {AnimatePresence,motion} from 'framer-motion';

export default function ScrollToTop() {
  const [visible,setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector<HTMLElement>('.hero-section');

      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        setVisible(heroBottom <= 0);
        return;
      }

      setVisible(window.scrollY > window.innerHeight);
    };

    handleScroll();

    window.addEventListener('scroll',handleScroll,{passive:true});
    window.addEventListener('resize',handleScroll);

    return () => {
      window.removeEventListener('scroll',handleScroll);
      window.removeEventListener('resize',handleScroll);
    };
  },[]);

  const scrollToTop = () => {
    window.scrollTo({
      top:0,
      behavior:'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="scroll-top-btn"
          aria-label="Scroll to top"
          title="Back to top"
          onClick={scrollToTop}
          initial={{opacity:0,y:18,scale:0.88}}
          animate={{opacity:1,y:0,scale:1}}
          exit={{opacity:0,y:18,scale:0.88}}
          transition={{
            duration:0.35,
            ease:[0.22,1,0.36,1],
          }}
          whileTap={{scale:0.94}}
        >
          <span className="scroll-top-glow" />

          <ArrowUp
            size={24}
            strokeWidth={1.8}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}