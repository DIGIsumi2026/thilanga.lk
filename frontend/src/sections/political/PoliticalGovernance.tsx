import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  X,
} from 'lucide-react';
import {AnimatePresence,motion} from 'framer-motion';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const parliamentaryRoles = [
  'Chairman, Select Committee of Parliament on the United Nations 2030 Agenda for Sustainable Development (SDG)',
  'Member, Steering Committee of the Commonwealth Parliamentary Association (CPA)',
  'Chairman, Parliamentarians for Global Action (PGA), Sri Lanka Chapter',
  'In 2019, under the new Government of His Excellency Gotabaya Rajapaksa, he served as the State Minister of Technology & Innovation',
  'Thilanga Sumathipala continues to serve the people as the Vice President of the Sri Lanka Freedom Party (SLFP), District Leader for Colombo District, Chief Organizer for the Moratuwa Electorate, and Central Committee Member of the Party.',
];

const continuingRoles = [
  'Vice President, Sri Lanka Freedom Party (SLFP)',
  'District Leader, Colombo District',
  'Chief Organizer, Moratuwa Electorate',
  'Central Committee Member, SLFP',
];

const galleryImages = [
  {
    id:'political-governance-01',
    src:imageAssets.political.governance.gallery.image1,
    alt:'Thilanga Sumathipala parliamentary leadership',
  },
  {
    id:'political-governance-02',
    src:imageAssets.political.governance.gallery.image2,
    alt:'Thilanga Sumathipala parliamentary service',
  },
  {
    id:'political-governance-03',
    src:imageAssets.political.governance.gallery.image3,
    alt:'Thilanga Sumathipala public service',
  },
  {
    id:'political-governance-04',
    src:imageAssets.political.governance.gallery.image4,
    alt:'Thilanga Sumathipala political leadership',
  },
  {
    id:'political-governance-05',
    src:imageAssets.political.governance.gallery.image5,
    alt:'Thilanga Sumathipala parliamentary engagement',
  },
];

export default function PoliticalGovernance() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const galleryRowRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const [activeImage,setActiveImage] = useState<number | null>(null);
  const [isNativeSwipe,setIsNativeSwipe] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 900,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsNativeSwipe(window.innerWidth <= 900);
    };

    handleResize();
    window.addEventListener('resize',handleResize);

    return () => {
      window.removeEventListener('resize',handleResize);
    };
  },[]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const heading = section.querySelector<HTMLElement>(
      '.political-governance-heading',
    );

    const intro = section.querySelector<HTMLElement>(
      '.political-governance-intro',
    );

    const roleCards = section.querySelectorAll<HTMLElement>(
      '.political-governance-role',
    );

    const stateMinister = section.querySelector<HTMLElement>(
      '.political-governance-state',
    );

    const continuing = section.querySelectorAll<HTMLElement>(
      '.political-governance-continuing-role',
    );

    const galleryRow = section.querySelector<HTMLElement>(
      '.political-governance-gallery-row',
    );

    if (reducedMotion) {
      [
        heading,
        intro,
        stateMinister,
        galleryRow,
      ].forEach((element) => {
        if (!element) return;

        element.style.opacity = '1';
        element.style.transform = 'none';
      });

      [...roleCards,...continuing].forEach((element) => {
        element.style.opacity = '1';
        element.style.transform = 'none';
      });

      return;
    }

    const ctx = gsap.context(() => {
      if (heading) {
        gsap.set(heading,{
          autoAlpha:0,
          y:34,
        });
      }

      if (intro) {
        gsap.set(intro,{
          autoAlpha:0,
          y:24,
        });
      }

      if (stateMinister) {
        gsap.set(stateMinister,{
          autoAlpha:0,
          y:28,
          scale:0.985,
        });
      }

      if (galleryRow) {
        gsap.set(galleryRow,{
          autoAlpha:0,
          y:34,
        });
      }

      gsap.set(roleCards,{
        autoAlpha:0,
        y:20,
      });

      gsap.set(continuing,{
        autoAlpha:0,
        y:18,
      });

      ScrollTrigger.create({
        trigger:section,
        start:'top 78%',
        once:true,
        onEnter:() => {
          if (heading) {
            gsap.to(heading,{
              autoAlpha:1,
              y:0,
              duration:0.9,
              ease:'power3.out',
            });
          }

          if (intro) {
            gsap.to(intro,{
              autoAlpha:1,
              y:0,
              duration:0.8,
              delay:0.15,
              ease:'power3.out',
            });
          }

          gsap.to(roleCards,{
            autoAlpha:1,
            y:0,
            duration:0.76,
            stagger:0.09,
            delay:0.32,
            ease:'power3.out',
          });

          if (stateMinister) {
            gsap.to(stateMinister,{
              autoAlpha:1,
              y:0,
              scale:1,
              duration:0.82,
              delay:0.5,
              ease:'power3.out',
            });
          }

          gsap.to(continuing,{
            autoAlpha:1,
            y:0,
            duration:0.7,
            stagger:0.075,
            delay:0.65,
            ease:'power3.out',
          });

          if (galleryRow) {
            gsap.to(galleryRow,{
              autoAlpha:1,
              y:0,
              duration:0.9,
              delay:0.78,
              ease:'power3.out',
            });
          }
        },
      });
    },section);

    return () => ctx.revert();
  },[]);

  useEffect(() => {
    if (activeImage === null) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null);
      }

      if (event.key === 'ArrowLeft') {
        setActiveImage((current) => {
          if (current === null) return null;

          return (
            current - 1 + galleryImages.length
          ) % galleryImages.length;
        });
      }

      if (event.key === 'ArrowRight') {
        setActiveImage((current) => {
          if (current === null) return null;

          return (
            current + 1
          ) % galleryImages.length;
        });
      }
    };

    window.addEventListener('keydown',handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown',handleKeyDown);
    };
  },[activeImage]);

  const previousImage = () => {
    setActiveImage((current) => {
      if (current === null) return null;

      return (
        current - 1 + galleryImages.length
      ) % galleryImages.length;
    });
  };

  const nextImage = () => {
    setActiveImage((current) => {
      if (current === null) return null;

      return (
        current + 1
      ) % galleryImages.length;
    });
  };

  const handleTouchStart = (
    event:React.TouchEvent<HTMLDivElement>,
  ) => {
    touchStartXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (
    event:React.TouchEvent<HTMLDivElement>,
  ) => {
    if (touchStartXRef.current === null) return;

    const endX = event.changedTouches[0].clientX;
    const distance = endX - touchStartXRef.current;

    touchStartXRef.current = null;

    if (Math.abs(distance) < 55) return;

    if (distance > 0) {
      previousImage();
    } else {
      nextImage();
    }
  };

  const gallerySequence = (
    ariaHidden = false,
  ) => (
    <div
      className="political-governance-gallery-sequence"
      aria-hidden={ariaHidden}
    >
      {galleryImages.map((image,index) => (
        <button
          key={`${ariaHidden ? 'duplicate' : 'primary'}-${image.id}`}
          type="button"
          className="political-governance-gallery-item"
          onClick={() => {
            if (ariaHidden) return;

            setActiveImage(index);
          }}
          tabIndex={ariaHidden ? -1 : 0}
          aria-label={
            ariaHidden
              ? undefined
              : `Open image ${index + 1} of ${galleryImages.length}`
          }
        >
          <img
            src={image.src}
            alt={ariaHidden ? '' : image.alt}
            loading="lazy"
            decoding="async"
          />

          <span className="political-governance-gallery-item-overlay" />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <section
        ref={sectionRef}
        className={`political-governance ${
          isNativeSwipe ? 'is-native-swipe' : ''
        }`}
        style={{
          backgroundImage:`url(${imageAssets.political.governance.background})`,
        }}
      >
        <div className="political-governance-overlay" />

        <div className="political-governance-container">
          <header className="political-governance-heading">
            <span className="political-governance-kicker">
              Governance & Innovation
            </span>

            <h2>
              Parliamentary Leadership,
              <br />
              Governance & Innovation
            </h2>
          </header>

          <p className="political-governance-intro">
            During his tenure as Deputy Speaker of Parliament, Hon. Thilanga
            Sumathipala played an integral role in upholding democracy and the
            rule of law. His parliamentary work also included leadership across
            committees and initiatives connected with sustainable development,
            parliamentary cooperation and institutional progress.
          </p>

          <div className="political-governance-block">
            <div className="political-governance-block-heading">
              <i />
              <span>Key Parliamentary Roles</span>
              <i />
            </div>

            <div className="political-governance-role-grid">
              {parliamentaryRoles.map((role,index) => (
                <article
                  key={role}
                  className="political-governance-role"
                >
                  <span className="political-governance-role-number">
                    {String(index + 1).padStart(2,'0')}
                  </span>

                  <p>{role}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="political-governance-state">
            <span className="political-governance-state-year">
              2019
            </span>

            <div>
              <span className="political-governance-state-label">
                National Leadership
              </span>

              <h3>
                State Minister of Technology & Innovation
              </h3>

              <p>
                In 2019, under the government of President Gotabaya Rajapaksa,
                he served as State Minister of Technology & Innovation.
              </p>
            </div>
          </div>

          <div className="political-governance-continuing">
            <div className="political-governance-continuing-heading">
              <span>Continuing Public Service</span>
            </div>

            <div className="political-governance-continuing-grid">
              {continuingRoles.map((role) => (
                <div
                  key={role}
                  className="political-governance-continuing-role"
                >
                  <span />
                  <p>{role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="political-governance-gallery">
          <div className="political-governance-gallery-meta">
            <span>Moments & Milestones</span>
            <i />
          </div>

          <div
            ref={galleryRowRef}
            className="political-governance-gallery-row"
          >
            <div className="political-governance-gallery-track">
              {gallerySequence(false)}

              {!isNativeSwipe && gallerySequence(true)}
            </div>
          </div>

          <div className="political-governance-gallery-swipe-hint">
            <MoveHorizontal size={14} strokeWidth={1.5} />
            <span>Swipe to explore</span>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage !== null && (
          <motion.div
            className="political-governance-gallery-lightbox"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.24}}
            onClick={() => setActiveImage(null)}
          >
            <button
              type="button"
              className="political-governance-gallery-lightbox-close"
              onClick={() => setActiveImage(null)}
              aria-label="Close gallery"
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              className="political-governance-gallery-lightbox-nav is-prev"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>

            <motion.div
              key={galleryImages[activeImage].id}
              className="political-governance-gallery-lightbox-stage"
              initial={{
                opacity:0,
                scale:0.965,
                y:10,
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
                duration:0.38,
                ease:[0.22,1,0.36,1],
              }}
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={galleryImages[activeImage].src}
                alt={galleryImages[activeImage].alt}
              />

              <span className="political-governance-gallery-lightbox-counter">
                {String(activeImage + 1).padStart(2,'0')}
                <i />
                {String(galleryImages.length).padStart(2,'0')}
              </span>
            </motion.div>

            <button
              type="button"
              className="political-governance-gallery-lightbox-nav is-next"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
