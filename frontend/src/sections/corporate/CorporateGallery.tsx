import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {ChevronLeft,ChevronRight,X} from 'lucide-react';
import {AnimatePresence,motion} from 'framer-motion';
import {animate, type JSAnimation} from 'animejs';
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

  const topAnimationRef = useRef<JSAnimation | null>(null);
  const bottomAnimationRef = useRef<JSAnimation | null>(null);
  const touchResumeTimeoutRef = useRef<number | null>(null);
  const lightboxPointerStartXRef = useRef<number | null>(null);

  const [activeIndex,setActiveIndex] = useState<number | null>(null);
  const [navigationDirection,setNavigationDirection] = useState(0);
  const [isResponsive,setIsResponsive] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 900px)').matches,
  );
  const [prefersReducedMotion,setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [isLowPerformance,setIsLowPerformance] = useState(false);
  const [isGalleryVisible,setIsGalleryVisible] = useState(false);
  const [isDocumentVisible,setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );
  const [isTouchPaused,setIsTouchPaused] = useState(false);
  const [manualSwipeRows,setManualSwipeRows] = useState({
    top:false,
    bottom:false,
  });

  const topDragState = useRef({ x: 0, isHovered: false, isDragging: false, startX: 0, startY: 0, lastX: 0, velocity: 0 });
  const bottomDragState = useRef({ x: 0, isHovered: false, isDragging: false, startX: 0, startY: 0, lastX: 0, velocity: 0 });

  const handlePointerDown = (e: React.PointerEvent, stateRef: React.MutableRefObject<any>) => {
    stateRef.current.isDragging = true;
    stateRef.current.startX = e.clientX;
    stateRef.current.lastX = e.clientX;
    stateRef.current.velocity = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, stateRef: React.MutableRefObject<any>) => {
    if (!stateRef.current.isDragging) return;
    const dx = e.clientX - stateRef.current.lastX;
    stateRef.current.lastX = e.clientX;
    stateRef.current.velocity = dx;
  };

  const handlePointerUp = (e: React.PointerEvent, stateRef: React.MutableRefObject<any>) => {
    stateRef.current.isDragging = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleClickCapture = (e: React.MouseEvent, stateRef: React.MutableRefObject<any>) => {
    // If the user dragged more than 5 pixels, prevent click
    if (Math.abs(e.clientX - stateRef.current.startX) > 5) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const pauseResponsiveMarquee = useCallback(() => {
    if (!isResponsive || prefersReducedMotion || isLowPerformance) return;

    if (touchResumeTimeoutRef.current !== null) {
      window.clearTimeout(touchResumeTimeoutRef.current);
      touchResumeTimeoutRef.current = null;
    }

    setIsTouchPaused(true);
  },[isLowPerformance,isResponsive,prefersReducedMotion]);

  const resumeResponsiveMarquee = useCallback(() => {
    if (!isResponsive || prefersReducedMotion || isLowPerformance) return;

    if (touchResumeTimeoutRef.current !== null) {
      window.clearTimeout(touchResumeTimeoutRef.current);
    }

    touchResumeTimeoutRef.current = window.setTimeout(() => {
      setIsTouchPaused(false);
      touchResumeTimeoutRef.current = null;
    },650);
  },[isLowPerformance,isResponsive,prefersReducedMotion]);

  const prepareResponsiveSwipe = (
    event:React.PointerEvent<HTMLDivElement>,
    stateRef:React.MutableRefObject<any>,
  ) => {
    stateRef.current.startX = event.clientX;
    stateRef.current.startY = event.clientY;
    stateRef.current.lastX = event.clientX;
    pauseResponsiveMarquee();
  };

  const activateResponsiveSwipe = (
    event:React.PointerEvent<HTMLDivElement>,
    stateRef:React.MutableRefObject<any>,
    trackRef:React.RefObject<HTMLDivElement | null>,
    row:'top' | 'bottom',
  ) => {
    if (prefersReducedMotion || isLowPerformance) return;

    const distanceX = Math.abs(
      event.clientX - stateRef.current.startX,
    );
    const distanceY = Math.abs(
      event.clientY - stateRef.current.startY,
    );

    if (distanceX < 8 || distanceX <= distanceY) return;

    const track = trackRef.current;
    const rowElement = event.currentTarget;

    if (!track || rowElement.classList.contains('is-manual-swipe')) return;

    const transform = window.getComputedStyle(track).transform;
    const offsetX = transform === 'none'
      ? 0
      : new DOMMatrixReadOnly(transform).m41;

    rowElement.classList.add('is-manual-swipe');
    rowElement.scrollLeft = Math.max(
      0,
      rowElement.scrollLeft - offsetX,
    );
    setManualSwipeRows((current) => ({...current,[row]:true}));
  };

  useEffect(() => {
    const responsiveQuery = window.matchMedia('(max-width: 900px)');
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const updateDeviceMode = () => {
      const responsive = responsiveQuery.matches;
      const cores = navigator.hardwareConcurrency;
      const lowPerformance = responsive &&
        coarsePointerQuery.matches &&
        typeof cores === 'number' &&
        cores <= 4;

      setIsResponsive(responsive);
      setPrefersReducedMotion(reducedMotionQuery.matches);
      setIsLowPerformance(lowPerformance);

    if (!responsive) {
      setManualSwipeRows({top:false,bottom:false});
      sectionRef.current
        ?.querySelectorAll<HTMLElement>('.corporate-gallery-row')
        .forEach((row) => {
          row.scrollLeft = 0;
        });
    }
    };

    updateDeviceMode();
    responsiveQuery.addEventListener('change',updateDeviceMode);
    reducedMotionQuery.addEventListener('change',updateDeviceMode);
    coarsePointerQuery.addEventListener('change',updateDeviceMode);

    return () => {
      responsiveQuery.removeEventListener('change',updateDeviceMode);
      reducedMotionQuery.removeEventListener('change',updateDeviceMode);
      coarsePointerQuery.removeEventListener('change',updateDeviceMode);
    };
  },[]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsGalleryVisible(entry.isIntersecting),
      {rootMargin:'120px 0px',threshold:0.01},
    );

    observer.observe(section);

    return () => observer.disconnect();
  },[]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange',handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange',handleVisibilityChange);
    };
  },[]);

  useEffect(() => () => {
    if (touchResumeTimeoutRef.current !== null) {
      window.clearTimeout(touchResumeTimeoutRef.current);
    }
  },[]);

  useLayoutEffect(() => {
    const topTrack = topTrackRef.current;
    const topSequence = topSequenceRef.current;
    const bottomTrack = bottomTrackRef.current;
    const bottomSequence = bottomSequenceRef.current;

    if (!topTrack || !topSequence || !bottomTrack || !bottomSequence) return;

    if (isResponsive) {
      gsap.set([topTrack,bottomTrack],{clearProps:'transform'});
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let rafId: number;
    let topDistance = 0;
    let bottomDistance = 0;

    const measure = () => {
      const topGap = parseFloat(getComputedStyle(topTrack).gap || '0');
      const bottomGap = parseFloat(getComputedStyle(bottomTrack).gap || '0');
      topDistance = topSequence.offsetWidth + topGap;
      bottomDistance = bottomSequence.offsetWidth + bottomGap;
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(topSequence);
    resizeObserver.observe(bottomSequence);

    const topState = topDragState.current;
    const bottomState = bottomDragState.current;

    const speed = 0.6; // Base pixels per frame
    const friction = 0.92;

    const animateMarquee = () => {
      if (topDistance === 0 || bottomDistance === 0) {
        rafId = requestAnimationFrame(animateMarquee);
        return;
      }

      // TOP ROW LOGIC
      if (!topState.isDragging) {
        if (!topState.isHovered) {
          topState.velocity += (-speed - topState.velocity) * 0.1;
        } else {
          topState.velocity *= friction;
        }
      }
      
      topState.x += topState.velocity;
      if (topState.x <= -topDistance) topState.x += topDistance;
      if (topState.x > 0) topState.x -= topDistance;

      gsap.set(topTrack, { x: topState.x });

      // BOTTOM ROW LOGIC
      if (!bottomState.isDragging) {
        if (!bottomState.isHovered) {
          bottomState.velocity += (speed - bottomState.velocity) * 0.1;
        } else {
          bottomState.velocity *= friction;
        }
      }

      bottomState.x += bottomState.velocity;
      if (bottomState.x >= 0) bottomState.x -= bottomDistance;
      if (bottomState.x < -bottomDistance) bottomState.x += bottomDistance;

      gsap.set(bottomTrack, { x: bottomState.x });

      rafId = requestAnimationFrame(animateMarquee);
    };

    animateMarquee();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  },[isResponsive]);

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

  const isLightboxOpen = activeIndex !== null;

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        setNavigationDirection(-1);
        setActiveIndex((current) => {
          if (current === null) return null;

          return (
            current - 1 + galleryImages.length
          ) % galleryImages.length;
        });
      }

      if (event.key === 'ArrowRight') {
        setNavigationDirection(1);
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
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown',handleKeyDown);
    };
  },[isLightboxOpen]);

  const showPrevious = () => {
    setNavigationDirection(-1);
    setActiveIndex((current) => {
      if (current === null) return null;

      return (
        current - 1 + galleryImages.length
      ) % galleryImages.length;
    });
  };

  const showNext = () => {
    setNavigationDirection(1);
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
      setNavigationDirection(0);
      setActiveIndex(index);
    }
  };

  const handleLightboxPointerDown = (
    event:React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isResponsive) return;

    lightboxPointerStartXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleLightboxPointerUp = (
    event:React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isResponsive) return;

    const startX = lightboxPointerStartXRef.current;
    lightboxPointerStartXRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (startX === null) return;

    const distance = event.clientX - startX;

    if (distance <= -52) showNext();
    if (distance >= 52) showPrevious();
  };

  const handleLightboxPointerCancel = (
    event:React.PointerEvent<HTMLDivElement>,
  ) => {
    lightboxPointerStartXRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
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
          aria-label={duplicate ? undefined : `Open ${image.alt}`}
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
  const isNativeSwipe = isResponsive &&
    (prefersReducedMotion || isLowPerformance);
  const isGalleryActive = isGalleryVisible &&
    isDocumentVisible &&
    !isTouchPaused &&
    !isLightboxOpen;

  const renderLightboxContent = () => (
    <>
      <img
        src={activeImage?.src}
        alt={activeImage?.alt}
        draggable="false"
      />

      <span className="corporate-gallery-lightbox-counter">
        {String((activeIndex ?? 0) + 1).padStart(2,'0')}
        <i />
        {String(galleryImages.length).padStart(2,'0')}
      </span>
    </>
  );

  return (
    <>
      <section
        ref={sectionRef}
        className={`corporate-gallery${isGalleryVisible ? ' is-gallery-visible' : ''}${isGalleryActive ? ' is-gallery-active' : ''}${isNativeSwipe ? ' is-native-swipe' : ''}`}
      >
        <div className="corporate-gallery-heading">
          <span className="corporate-gallery-kicker">Gallery</span>

          <h2>
            Moments &amp;<br className="corporate-gallery-mobile-title-break" /> Milestones
          </h2>

          <p>
            A visual journey through leadership,
            enterprise, professional engagements and
            significant moments.
          </p>
        </div>

        <div className="corporate-gallery-marquee">
          <div className="corporate-gallery-mobile-row-block">
            <div className="corporate-gallery-mobile-row-meta" aria-hidden="true">
              <span>01</span><i /><small>Driven by purpose</small>
            </div>

            <div
              className={`corporate-gallery-row is-top-row${manualSwipeRows.top ? ' is-manual-swipe' : ''}`}
              onMouseEnter={() => {
                if (!isResponsive) topDragState.current.isHovered = true;
              }}
              onMouseLeave={() => {
                if (!isResponsive) topDragState.current.isHovered = false;
              }}
              onPointerDown={(event) => {
                if (isResponsive) {
                  prepareResponsiveSwipe(event,topDragState);
                }
                else handlePointerDown(event,topDragState);
              }}
              onPointerMove={(event) => {
                if (isResponsive) {
                  activateResponsiveSwipe(
                    event,
                    topDragState,
                    topTrackRef,
                    'top',
                  );
                }
                else handlePointerMove(event,topDragState);
              }}
              onPointerUp={(event) => {
                if (isResponsive) resumeResponsiveMarquee();
                else handlePointerUp(event,topDragState);
              }}
              onPointerCancel={(event) => {
                if (isResponsive) resumeResponsiveMarquee();
                else handlePointerUp(event,topDragState);
              }}
              onClickCapture={(event) => {
                handleClickCapture(event,topDragState);
              }}
            >
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
          </div>

          <div className="corporate-gallery-mobile-row-block">
            <div className="corporate-gallery-mobile-row-meta" aria-hidden="true">
              <span>02</span><i /><small>People. Partnerships. Progress.</small>
            </div>

            <div
              className={`corporate-gallery-row is-bottom-row${manualSwipeRows.bottom ? ' is-manual-swipe' : ''}`}
              onMouseEnter={() => {
                if (!isResponsive) bottomDragState.current.isHovered = true;
              }}
              onMouseLeave={() => {
                if (!isResponsive) bottomDragState.current.isHovered = false;
              }}
              onPointerDown={(event) => {
                if (isResponsive) {
                  prepareResponsiveSwipe(event,bottomDragState);
                }
                else handlePointerDown(event,bottomDragState);
              }}
              onPointerMove={(event) => {
                if (isResponsive) {
                  activateResponsiveSwipe(
                    event,
                    bottomDragState,
                    bottomTrackRef,
                    'bottom',
                  );
                }
                else handlePointerMove(event,bottomDragState);
              }}
              onPointerUp={(event) => {
                if (isResponsive) resumeResponsiveMarquee();
                else handlePointerUp(event,bottomDragState);
              }}
              onPointerCancel={(event) => {
                if (isResponsive) resumeResponsiveMarquee();
                else handlePointerUp(event,bottomDragState);
              }}
              onClickCapture={(event) => {
                handleClickCapture(event,bottomDragState);
              }}
            >
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

          <div className="corporate-gallery-mobile-swipe-hint" aria-hidden="true">
            <ChevronLeft size={14} strokeWidth={1.4} />
            <span>Swipe to explore</span>
            <ChevronRight size={14} strokeWidth={1.4} />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage && activeIndex !== null && (
          <motion.div
            className={`corporate-gallery-lightbox${isNativeSwipe ? ' is-low-performance' : ''}`}
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

            {isResponsive ? (
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeImage.id}
                  className="corporate-gallery-lightbox-stage"
                  initial={{
                    opacity:0,
                    x:navigationDirection * 24,
                  }}
                  animate={{opacity:1,x:0}}
                  exit={{
                    opacity:0,
                    x:navigationDirection * -16,
                  }}
                  transition={prefersReducedMotion
                    ? {duration:0}
                    : {duration:0.28,ease:[0.22,1,0.36,1]}}
                  onClick={(event) => event.stopPropagation()}
                  onPointerDown={handleLightboxPointerDown}
                  onPointerUp={handleLightboxPointerUp}
                  onPointerCancel={handleLightboxPointerCancel}
                >
                  {renderLightboxContent()}
                </motion.div>
              </AnimatePresence>
            ) : (
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
                {renderLightboxContent()}
              </motion.div>
            )}

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
