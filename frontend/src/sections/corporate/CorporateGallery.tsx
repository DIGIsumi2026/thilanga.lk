import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {ChevronLeft,ChevronRight,X} from 'lucide-react';
import {AnimatePresence,motion} from 'framer-motion';
import {animate} from 'animejs';
import {gsap} from 'gsap';
import {imageAssets} from '../../assets/imageAssets';

type GalleryImage = {
  id:string;
  src:string;
  alt:string;
};

const galleryImages:GalleryImage[] = [
  {
    id:'gallery-01',
    src:imageAssets.corporate.gallery.image01,
    alt:'Thilanga Sumathipala corporate gallery image 1',
  },
  {
    id:'gallery-02',
    src:imageAssets.corporate.gallery.image02,
    alt:'Thilanga Sumathipala corporate gallery image 2',
  },
  {
    id:'gallery-03',
    src:imageAssets.corporate.gallery.image03,
    alt:'Thilanga Sumathipala corporate gallery image 3',
  },
  {
    id:'gallery-04',
    src:imageAssets.corporate.gallery.image04,
    alt:'Thilanga Sumathipala corporate gallery image 4',
  },
  {
    id:'gallery-05',
    src:imageAssets.corporate.gallery.image05,
    alt:'Thilanga Sumathipala corporate gallery image 5',
  },
  {
    id:'gallery-06',
    src:imageAssets.corporate.gallery.image06,
    alt:'Thilanga Sumathipala corporate gallery image 6',
  },
  {
    id:'gallery-07',
    src:imageAssets.corporate.gallery.image07,
    alt:'Thilanga Sumathipala corporate gallery image 7',
  },
  {
    id:'gallery-08',
    src:imageAssets.corporate.gallery.image08,
    alt:'Thilanga Sumathipala corporate gallery image 8',
  },
  {
    id:'gallery-09',
    src:imageAssets.corporate.gallery.image09,
    alt:'Thilanga Sumathipala corporate gallery image 9',
  },
  {
    id:'gallery-10',
    src:imageAssets.corporate.gallery.image10,
    alt:'Thilanga Sumathipala corporate gallery image 10',
  },
  {
    id:'gallery-11',
    src:imageAssets.corporate.gallery.image11,
    alt:'Thilanga Sumathipala corporate gallery image 11',
  },
  {
    id:'gallery-12',
    src:imageAssets.corporate.gallery.image12,
    alt:'Thilanga Sumathipala corporate gallery image 12',
  },
];

const topRow = galleryImages.filter((_,index) => index % 2 === 0);
const bottomRow = galleryImages.filter((_,index) => index % 2 !== 0);

export default function CorporateGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const topTrackRef = useRef<HTMLDivElement | null>(null);
  const topSequenceRef = useRef<HTMLDivElement | null>(null);

  const bottomTrackRef = useRef<HTMLDivElement | null>(null);
  const bottomSequenceRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex,setActiveIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const topTrack = topTrackRef.current;
    const topSequence = topSequenceRef.current;
    const bottomTrack = bottomTrackRef.current;
    const bottomSequence = bottomSequenceRef.current;

    if (
      !topTrack ||
      !topSequence ||
      !bottomTrack ||
      !bottomSequence
    ) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) return;

    let topTween:gsap.core.Tween | null = null;
    let bottomTween:gsap.core.Tween | null = null;

    const startMarquee = () => {
      topTween?.kill();
      bottomTween?.kill();

      const topGap = parseFloat(
        getComputedStyle(topTrack).gap || '0',
      );

      const bottomGap = parseFloat(
        getComputedStyle(bottomTrack).gap || '0',
      );

      const topDistance =
        topSequence.offsetWidth + topGap;

      const bottomDistance =
        bottomSequence.offsetWidth + bottomGap;

      const speed = 30;

      gsap.set(topTrack,{
        x:0,
      });

      topTween = gsap.to(topTrack,{
        x:-topDistance,
        duration:topDistance / speed,
        repeat:-1,
        ease:'none',
      });

      gsap.set(bottomTrack,{
        x:-bottomDistance,
      });

      bottomTween = gsap.to(bottomTrack,{
        x:0,
        duration:bottomDistance / speed,
        repeat:-1,
        ease:'none',
      });
    };

    startMarquee();

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(startMarquee);
    });

    resizeObserver.observe(topSequence);
    resizeObserver.observe(bottomSequence);

    return () => {
      resizeObserver.disconnect();
      topTween?.kill();
      bottomTween?.kill();
    };
  },[]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const heading = section.querySelector<HTMLElement>(
      '.corporate-gallery-heading',
    );

    const rows = section.querySelectorAll<HTMLElement>(
      '.corporate-gallery-row',
    );

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      if (heading) heading.style.opacity = '1';

      rows.forEach((row) => {
        row.style.opacity = '1';
      });

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (heading) {
          animate(heading,{
            opacity:[0,1],
            translateY:[26,0],
            duration:850,
            ease:'outExpo',
          });
        }

        if (rows[0]) {
          animate(rows[0],{
            opacity:[0,1],
            translateY:[20,0],
            duration:900,
            delay:180,
            ease:'outExpo',
          });
        }

        if (rows[1]) {
          animate(rows[1],{
            opacity:[0,1],
            translateY:[20,0],
            duration:900,
            delay:260,
            ease:'outExpo',
          });
        }

        observer.disconnect();
      },
      {
        threshold:0.14,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  },[]);

  useEffect(() => {
    if (activeIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => {
          if (current === null) return null;

          return (
            current - 1 + galleryImages.length
          ) % galleryImages.length;
        });
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => {
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
  },[activeIndex]);

  const showPrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return null;

      return (
        current - 1 + galleryImages.length
      ) % galleryImages.length;
    });
  };

  const showNext = () => {
    setActiveIndex((current) => {
      if (current === null) return null;

      return (
        current + 1
      ) % galleryImages.length;
    });
  };

  const openImage = (id:string) => {
    const index = galleryImages.findIndex(
      (image) => image.id === id,
    );

    if (index !== -1) {
      setActiveIndex(index);
    }
  };

  const renderSequence = (
    images:GalleryImage[],
    duplicate = false,
  ) => (
    <>
      {images.map((image) => (
        <button
          key={`${image.id}-${duplicate ? 'duplicate' : 'original'}`}
          type="button"
          className="corporate-gallery-item"
          onClick={() => openImage(image.id)}
          tabIndex={duplicate ? -1 : 0}
          aria-hidden={duplicate || undefined}
        >
          <img
            src={image.src}
            alt={duplicate ? '' : image.alt}
            loading="lazy"
            decoding="async"
          />

          <span className="corporate-gallery-item-overlay" />
        </button>
      ))}
    </>
  );

  const activeImage =
    activeIndex !== null
      ? galleryImages[activeIndex]
      : null;

  return (
    <>
      <section
        ref={sectionRef}
        className="corporate-gallery"
      >
        <div className="corporate-gallery-heading">

          <h2>
            Moments & Milestones
          </h2>

          <p>
            A visual journey through leadership,
            enterprise, professional engagements and
            significant moments.
          </p>
        </div>

        <div className="corporate-gallery-marquee">
          <div className="corporate-gallery-row">
            <div
              ref={topTrackRef}
              className="corporate-gallery-track"
            >
              <div
                ref={topSequenceRef}
                className="corporate-gallery-sequence"
              >
                {renderSequence(topRow)}
              </div>

              <div
                className="corporate-gallery-sequence"
                aria-hidden="true"
              >
                {renderSequence(topRow,true)}
              </div>
            </div>
          </div>

          <div className="corporate-gallery-row">
            <div
              ref={bottomTrackRef}
              className="corporate-gallery-track"
            >
              <div
                ref={bottomSequenceRef}
                className="corporate-gallery-sequence"
              >
                {renderSequence(bottomRow)}
              </div>

              <div
                className="corporate-gallery-sequence"
                aria-hidden="true"
              >
                {renderSequence(bottomRow,true)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage && activeIndex !== null && (
          <motion.div
            className="corporate-gallery-lightbox"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.28}}
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              className="corporate-gallery-lightbox-close"
              onClick={() => setActiveIndex(null)}
              aria-label="Close gallery"
            >
              <X size={22} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              className="corporate-gallery-lightbox-nav is-prev"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} strokeWidth={1.5} />
            </button>

            <motion.div
              key={activeImage.id}
              className="corporate-gallery-lightbox-stage"
              initial={{
                opacity:0,
                scale:0.96,
                y:16,
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
                src={activeImage.src}
                alt={activeImage.alt}
              />

              <span className="corporate-gallery-lightbox-counter">
                {String(activeIndex + 1).padStart(2,'0')}
                <i />
                {String(galleryImages.length).padStart(2,'0')}
              </span>
            </motion.div>

            <button
              type="button"
              className="corporate-gallery-lightbox-nav is-next"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={26} strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}