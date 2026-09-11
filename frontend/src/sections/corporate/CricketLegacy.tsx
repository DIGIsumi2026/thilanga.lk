import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {animate,stagger} from 'animejs';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

type LegacyArchiveImage = {
  id:string;
  src:string;
  alt:string;
};

type CricketLegacyBlock = {
  id:string;
  image:string;
  alt:string;
  title:string;
  paragraphs:string[];
  archive?:LegacyArchiveImage[];
};

const cricketArchiveImages:LegacyArchiveImage[] = [
  {
    id:'cricket-rationale',
    src:imageAssets.corporate.cricketLegacy.rationale,
    alt:'Sri Lanka Cricket identity rationale document',
  },
  {
    id:'cricket-launch-article',
    src:imageAssets.corporate.cricketLegacy.launchArticle,
    alt:'Newspaper article about the launch of Sri Lanka Cricket',
  },
];

const cricketLegacyBlocks:CricketLegacyBlock[] = [
  {
    id:'cricket-legacy-01',
    image:imageAssets.corporate.cricketLegacy.leadership,
    alt:'Thilanga Sumathipala in cricket administration',
    title:'Leadership, governance and execution',
    paragraphs:[
      'His eye for innovation has also led him to serve in the capacity of President, Director, and Member of many esteemed institutes and organizations such as the International Cricket Council (ICC), the Asian Cricket Council (ACC), and the Board of Control for Cricket in Sri Lanka.',
      'As President of Sri Lanka Cricket, his leadership led to the completion of the Rangiri Dambulla International Cricket Stadium in just 167 days, reflecting a rare combination of vision, execution, and administrative strength.',
    ],
  },
  {
    id:'cricket-legacy-02',
    image:imageAssets.corporate.cricketLegacy.playing,
    alt:'Thilanga Sumathipala playing cricket',
    title:'Identity, reform and wider institutional impact',
    paragraphs:[
      'He later re-structured and headed the re-launch of the BCCSL’s new logo and the name change to “Sri Lanka Cricket” in 2004, helping define a stronger and more contemporary identity for the institution.',
      'Beyond cricket, he has also held honourable positions at the International Advertising Association (IAA), the Newspaper Society of Sri Lanka, INCA-FIEJ Research Association (IFRA) India, and the Asian Mass Communication Research & Information Centre (AMIC).',
    ],
    archive:cricketArchiveImages,
  },
];

export default function CricketLegacy() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeArchiveIndex,setActiveArchiveIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(
        '.cricket-legacy-row',
      );

      rows.forEach((row) => {
        const copy = row.querySelector<HTMLElement>(
          '.cricket-legacy-copy',
        );

        const media = row.querySelector<HTMLElement>(
          '.cricket-legacy-media',
        );

        const heading = row.querySelector<HTMLElement>(
          '.cricket-legacy-copy h3',
        );

        const paragraphs = row.querySelectorAll<HTMLElement>(
          '.cricket-legacy-copy-body p',
        );

        const archiveItems = row.querySelectorAll<HTMLElement>(
          '.cricket-legacy-archive-item',
        );

        gsap.set([copy,media],{
          autoAlpha:0,
          y:48,
        });

        if (heading) {
          gsap.set(heading,{
            autoAlpha:0,
            y:20,
          });
        }

        gsap.set(paragraphs,{
          opacity:0,
          y:18,
        });

        gsap.set(archiveItems,{
          opacity:0,
          y:18,
          scale:0.985,
        });

        ScrollTrigger.create({
          trigger:row,
          start:'top 82%',
          once:true,
          onEnter:() => {
            gsap.to(copy,{
              autoAlpha:1,
              y:0,
              duration:0.95,
              ease:'power3.out',
            });

            gsap.to(media,{
              autoAlpha:1,
              y:0,
              duration:0.95,
              delay:0.12,
              ease:'power3.out',
            });

            if (heading) {
              gsap.to(heading,{
                autoAlpha:1,
                y:0,
                duration:0.7,
                delay:0.18,
                ease:'power3.out',
              });
            }

            animate(paragraphs,{
              opacity:[0,1],
              translateY:[18,0],
              delay:stagger(130,{
                start:280,
              }),
              duration:750,
              ease:'outExpo',
            });

            if (archiveItems.length) {
              gsap.to(archiveItems,{
                opacity:1,
                y:0,
                scale:1,
                duration:0.75,
                stagger:0.1,
                delay:0.48,
                ease:'power3.out',
              });
            }
          },
        });
      });
    },sectionRef);

    return () => ctx.revert();
  },[]);

  useEffect(() => {
    if (activeArchiveIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveArchiveIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        setActiveArchiveIndex((current) => {
          if (current === null) return null;

          return (
            current - 1 + cricketArchiveImages.length
          ) % cricketArchiveImages.length;
        });
      }

      if (event.key === 'ArrowRight') {
        setActiveArchiveIndex((current) => {
          if (current === null) return null;

          return (
            current + 1
          ) % cricketArchiveImages.length;
        });
      }
    };

    window.addEventListener('keydown',handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown',handleKeyDown);
    };
  },[activeArchiveIndex]);

  const previousArchiveImage = () => {
    setActiveArchiveIndex((current) => {
      if (current === null) return null;

      return (
        current - 1 + cricketArchiveImages.length
      ) % cricketArchiveImages.length;
    });
  };

  const nextArchiveImage = () => {
    setActiveArchiveIndex((current) => {
      if (current === null) return null;

      return (
        current + 1
      ) % cricketArchiveImages.length;
    });
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="cricket-legacy-section"
      >
        <div className="cricket-legacy-container">
          <header className="cricket-legacy-heading">
            <span className="cricket-legacy-kicker">
              Sports Leadership
            </span>

            <h2>
              A Legacy in Sri Lankan Cricket
            </h2>
          </header>

          <div className="cricket-legacy-list">
            {cricketLegacyBlocks.map((block,index) => (
              <article
                key={block.id}
                className={`cricket-legacy-row cricket-legacy-row-${index + 1}`}
              >
                <div className="cricket-legacy-media">
                  <img
                    src={block.image}
                    alt={block.alt}
                  />
                </div>

                <div
                  className={`cricket-legacy-copy ${
                    block.archive?.length
                      ? 'has-archive'
                      : ''
                  }`}
                >
                  <div className="cricket-legacy-copy-main">
                    <h3>{block.title}</h3>

                    <div className="cricket-legacy-copy-body">
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {block.archive?.length && (
                    <div className="cricket-legacy-archive">
                      <div className="cricket-legacy-archive-head">
                        <span>Archive</span>
                        <i />
                        <small>
                          Click to view
                        </small>
                      </div>

                      <div className="cricket-legacy-archive-grid">
                        {block.archive.map((image,archiveIndex) => (
                          <button
                            key={image.id}
                            type="button"
                            className="cricket-legacy-archive-item"
                            onClick={() => setActiveArchiveIndex(archiveIndex)}
                            aria-label={`View ${image.alt}`}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              loading="lazy"
                              decoding="async"
                            />

                            <span className="cricket-legacy-archive-overlay">
                              <ZoomIn
                                size={18}
                                strokeWidth={1.6}
                              />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeArchiveIndex !== null && (
          <motion.div
            className="cricket-archive-lightbox"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.26}}
            onClick={() => setActiveArchiveIndex(null)}
          >
            <button
              type="button"
              className="cricket-archive-lightbox-close"
              onClick={() => setActiveArchiveIndex(null)}
              aria-label="Close image"
            >
              <X size={22} strokeWidth={1.6} />
            </button>

            <button
              type="button"
              className="cricket-archive-lightbox-nav is-prev"
              onClick={(event) => {
                event.stopPropagation();
                previousArchiveImage();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft
                size={27}
                strokeWidth={1.5}
              />
            </button>

            <motion.div
              key={cricketArchiveImages[activeArchiveIndex].id}
              className="cricket-archive-lightbox-stage"
              initial={{
                opacity:0,
                scale:0.965,
                y:12,
              }}
              animate={{
                opacity:1,
                scale:1,
                y:0,
              }}
              exit={{
                opacity:0,
                scale:0.98,
              }}
              transition={{
                duration:0.4,
                ease:[0.22,1,0.36,1],
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={cricketArchiveImages[activeArchiveIndex].src}
                alt={cricketArchiveImages[activeArchiveIndex].alt}
              />

              <span className="cricket-archive-lightbox-counter">
                {String(activeArchiveIndex + 1).padStart(2,'0')}
                <i />
                {String(cricketArchiveImages.length).padStart(2,'0')}
              </span>
            </motion.div>

            <button
              type="button"
              className="cricket-archive-lightbox-nav is-next"
              onClick={(event) => {
                event.stopPropagation();
                nextArchiveImage();
              }}
              aria-label="Next image"
            >
              <ChevronRight
                size={27}
                strokeWidth={1.5}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}