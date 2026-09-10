import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {AnimatePresence,motion} from 'framer-motion';
import {animate,stagger} from 'animejs';
import {gsap} from 'gsap';
import {imageAssets} from '../../assets/imageAssets';
import {videoAssets} from '../../assets/videoAssets';

type StadiumGalleryImage = {
  id:string;
  src:string;
  alt:string;
};

const stadiumGallery:StadiumGalleryImage[] = [
  {
    id:'dambulla-01',
    src:imageAssets.corporate.dambulla.image01,
    alt:'Rangiri Dambulla International Cricket Stadium construction',
  },
  {
    id:'dambulla-02',
    src:imageAssets.corporate.dambulla.image02,
    alt:'Early construction work at Rangiri Dambulla International Cricket Stadium',
  },
  {
    id:'dambulla-03',
    src:imageAssets.corporate.dambulla.image03,
    alt:'Structural construction of Rangiri Dambulla International Cricket Stadium',
  },
  {
    id:'dambulla-04',
    src:imageAssets.corporate.dambulla.image04,
    alt:'Completed Rangiri Dambulla International Cricket Stadium',
  },
  {
    id:'dambulla-05',
    src:imageAssets.corporate.dambulla.image05,
    alt:'Aerial view of Rangiri Dambulla International Cricket Stadium',
  },
  {
    id:'dambulla-06',
    src:imageAssets.corporate.dambulla.image06,
    alt:'Rangiri Dambulla International Cricket Stadium aerial view',
  },
];

const firstParagraph =
  'As President of the Board of Control for Cricket in Sri Lanka, Thilanga Sumathipala played a central role in championing the development of the Rangiri Dambulla International Cricket Stadium. Conceived as a strategically located dry-zone venue capable of hosting international cricket with reduced disruption from monsoon weather, the project also represented an important step in expanding major cricket infrastructure beyond the traditional centres in Colombo.';

const expandedParagraphs = [
  'Under his leadership, the stadium was taken from concept to completion within an exceptionally short construction period. The project is widely associated with a reported completion time of approximately 167 days, reflecting an ambitious combination of planning, coordination and execution. The venue subsequently emerged as one of Sri Lanka’s distinctive international cricket grounds.',
  'Beyond the speed of construction, the significance of Dambulla lay in its long-term strategic value. The venue strengthened Sri Lanka’s ability to stage international cricket in the country’s dry zone and demonstrated how infrastructure development could respond directly to climatic and operational challenges. The project remains closely associated with Sumathipala’s period of leadership in Sri Lankan cricket and his emphasis on development, regional expansion and institutional progress.',
];

export default function DambullaLegacy() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const expandableRef = useRef<HTMLDivElement | null>(null);
  const expandableInnerRef = useRef<HTMLDivElement | null>(null);

  const galleryTrackRef = useRef<HTMLDivElement | null>(null);
  const gallerySequenceRef = useRef<HTMLDivElement | null>(null);
  const galleryTweenRef = useRef<gsap.core.Tween | null>(null);

  const [expanded,setExpanded] = useState(false);
  const [activeImage,setActiveImage] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const heading = section.querySelector<HTMLElement>(
      '.dambulla-legacy-heading',
    );

    const video = section.querySelector<HTMLElement>(
      '.dambulla-legacy-video-wrap',
    );

    const intro = section.querySelector<HTMLElement>(
      '.dambulla-legacy-intro',
    );

    const gallery = section.querySelector<HTMLElement>(
      '.dambulla-gallery',
    );

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      [heading,video,intro,gallery].forEach((element) => {
        if (element) element.style.opacity = '1';
      });

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const elements = [
          heading,
          video,
          intro,
          gallery,
        ].filter(Boolean) as HTMLElement[];

        animate(elements,{
          opacity:[0,1],
          translateY:[32,0],
          delay:stagger(130),
          duration:900,
          ease:'outExpo',
        });

        observer.disconnect();
      },
      {
        threshold:0.1,
        rootMargin:'0px 0px -8% 0px',
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  },[]);

  useEffect(() => {
    const container = expandableRef.current;
    const inner = expandableInnerRef.current;

    if (!container || !inner) return;

    gsap.killTweensOf(container);

    if (expanded) {
      gsap.set(container,{
        display:'block',
      });

      gsap.fromTo(container,{
        height:0,
        opacity:0,
      },{
        height:inner.scrollHeight,
        opacity:1,
        duration:0.85,
        ease:'power4.out',
        onComplete:() => {
          gsap.set(container,{
            height:'auto',
          });
        },
      });

      gsap.fromTo(
        inner.querySelectorAll('p'),
        {
          opacity:0,
          y:18,
        },
        {
          opacity:1,
          y:0,
          duration:0.6,
          stagger:0.1,
          delay:0.15,
          ease:'power3.out',
        },
      );

      return;
    }

    if (container.offsetHeight === 0) return;

    gsap.to(container,{
      height:0,
      opacity:0,
      duration:0.65,
      ease:'power3.inOut',
      onComplete:() => {
        gsap.set(container,{
          display:'none',
        });
      },
    });
  },[expanded]);

  useLayoutEffect(() => {
    const track = galleryTrackRef.current;
    const sequence = gallerySequenceRef.current;

    if (!track || !sequence) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) return;

    const startMarquee = () => {
      galleryTweenRef.current?.kill();

      const gap = parseFloat(
        getComputedStyle(track).gap || '0',
      );

      const distance = sequence.offsetWidth + gap;
      const speed = window.innerWidth <= 600 ? 20 : 28;

      gsap.set(track,{
        x:0,
      });

      galleryTweenRef.current = gsap.to(track,{
        x:-distance,
        duration:distance / speed,
        repeat:-1,
        ease:'none',
      });
    };

    startMarquee();

    const resizeObserver = new ResizeObserver(startMarquee);

    resizeObserver.observe(sequence);

    return () => {
      resizeObserver.disconnect();
      galleryTweenRef.current?.kill();
    };
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
            current - 1 + stadiumGallery.length
          ) % stadiumGallery.length;
        });
      }

      if (event.key === 'ArrowRight') {
        setActiveImage((current) => {
          if (current === null) return null;

          return (
            current + 1
          ) % stadiumGallery.length;
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
        current - 1 + stadiumGallery.length
      ) % stadiumGallery.length;
    });
  };

  const nextImage = () => {
    setActiveImage((current) => {
      if (current === null) return null;

      return (
        current + 1
      ) % stadiumGallery.length;
    });
  };

  const renderGalleryImages = (duplicate = false) =>
    stadiumGallery.map((image,index) => (
      <button
        key={`${image.id}-${duplicate ? 'duplicate' : 'original'}`}
        type="button"
        className="dambulla-gallery-item"
        aria-hidden={duplicate || undefined}
        tabIndex={duplicate ? -1 : 0}
        onClick={() => {
          if (!duplicate) setActiveImage(index);
        }}
      >
        <img
          src={image.src}
          alt={duplicate ? '' : image.alt}
          loading="lazy"
          decoding="async"
        />
      </button>
    ));

  return (
    <>
      <section
        ref={sectionRef}
        className="dambulla-legacy"
      >
        <div className="dambulla-legacy-container">
          <header className="dambulla-legacy-heading">
            <span className="dambulla-legacy-kicker">
              From Vision to Reality
            </span>

            <h2>
              Rangiri Dambulla
              <br />
              International Cricket Stadium
            </h2>
          </header>

          <div className="dambulla-legacy-video-wrap">
            <video
              className="dambulla-legacy-video"
              src={videoAssets.dambulla.timelapse}
              muted
              playsInline
              controls
              preload="metadata"
            />
          </div>

          <div className="dambulla-legacy-story">
            <p className="dambulla-legacy-intro">
              {firstParagraph}
            </p>

            <div
              ref={expandableRef}
              className="dambulla-legacy-expandable"
            >
              <div
                ref={expandableInnerRef}
                className="dambulla-legacy-expandable-inner"
              >
                {expandedParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`dambulla-see-more ${
                expanded ? 'is-expanded' : ''
              }`}
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
            >
              <span>
                {expanded ? 'See less' : 'See more'}
              </span>

              <span className="dambulla-see-more-icon">
                <ChevronDown size={17} strokeWidth={1.6} />
              </span>
            </button>
          </div>

          <div className="dambulla-gallery">
            <div className="dambulla-gallery-meta">
              <span>01</span>
              <i />
              <small>
                From construction to international venue
              </small>
            </div>

            <div className="dambulla-gallery-row">
              <div
                ref={galleryTrackRef}
                className="dambulla-gallery-track"
              >
                <div
                  ref={gallerySequenceRef}
                  className="dambulla-gallery-sequence"
                >
                  {renderGalleryImages()}
                </div>

                <div
                  className="dambulla-gallery-sequence"
                  aria-hidden="true"
                >
                  {renderGalleryImages(true)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage !== null && (
          <motion.div
            className="dambulla-lightbox"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.25}}
            onClick={() => setActiveImage(null)}
          >
            <button
              type="button"
              className="dambulla-lightbox-close"
              onClick={() => setActiveImage(null)}
              aria-label="Close image"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              className="dambulla-lightbox-nav is-prev"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <motion.div
              key={stadiumGallery[activeImage].id}
              className="dambulla-lightbox-stage"
              initial={{opacity:0,scale:0.96}}
              animate={{opacity:1,scale:1}}
              transition={{
                duration:0.38,
                ease:[0.22,1,0.36,1],
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={stadiumGallery[activeImage].src}
                alt={stadiumGallery[activeImage].alt}
              />

              <span className="dambulla-lightbox-counter">
                {String(activeImage + 1).padStart(2,'0')}
                <i />
                {String(stadiumGallery.length).padStart(2,'0')}
              </span>
            </motion.div>

            <button
              type="button"
              className="dambulla-lightbox-nav is-next"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}