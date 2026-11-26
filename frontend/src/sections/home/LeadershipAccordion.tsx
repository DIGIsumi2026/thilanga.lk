import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { gsap } from "gsap";
import { animate, stagger, type JSAnimation } from "animejs";
import { imageAssets } from "../../assets/imageAssets";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

type AccordionItem = {
  id: string;
  number: string;
  title: string;
  role: string;
  description: string;
  image: string;
  path: string;
  accent: string;
  glow: string;
};

const accordionItems: AccordionItem[] = [
  {
    id: "corporate",
    number: "01",
    title: "Corporate",
    role: "Entrepreneurship & Business Leadership",
    description:
      "A business leader and entrepreneur with decades of experience across printing, hospitality, commerce, energy, technology, entertainment and investment, with a strong focus on strategic growth and institutional leadership.",
    image: imageAssets.home.accordion.corporate,
    path: "/corporate",
    accent: "#c99b3b",
    glow: "rgba(201,155,59,0.34)",
  },
  {
    id: "political",
    number: "02",
    title: "Political",
    role: "Public Service & National Leadership",
    description:
      "Public-service experience spanning provincial and parliamentary roles, including service as a Member of Parliament, Deputy Minister, Deputy Speaker of Parliament and State Minister of Technology & Innovation.",
    image: imageAssets.home.accordion.political,
    path: "/political",
    accent: "#5aa8ff",
    glow: "rgba(62,134,255,0.34)",
  },
  {
    id: "public-relations",
    number: "03",
    title: "Public Relations",
    role: "Philanthropy, Community & Cultural Impact",
    description:
      "A longstanding commitment to social service, humanitarian assistance, education, community development and cultural initiatives that support people and celebrate Sri Lankan achievement.",
    image: imageAssets.home.accordion.publicRelations,
    path: "/public-relations",
    accent: "#7bc49b",
    glow: "rgba(71,178,126,0.3)",
  },
];

const hoverQuery = "(min-width: 901px) and (hover: hover) and (pointer: fine)";

function LeadershipMobileAccordion() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const detailsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailsInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previousActiveRef = useRef<number | null | undefined>(undefined);
  const [canHover, setCanHover] = useState(() => window.matchMedia(hoverQuery).matches);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(() =>
    window.matchMedia(hoverQuery).matches ? 0 : null,
  );

  useEffect(() => {
    const hover = window.matchMedia(hoverQuery);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateHover = () => {
      setCanHover(hover.matches);
      setActiveIndex(hover.matches ? 0 : null);
    };
    const updateMotion = () => setReducedMotion(motion.matches);
    hover.addEventListener("change", updateHover);
    motion.addEventListener("change", updateMotion);
    return () => {
      hover.removeEventListener("change", updateHover);
      motion.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 900px)");
    const panels = sectionRef.current?.querySelectorAll<HTMLElement>(".leadership-panel");
    let frame: number | null = null;

    const updateActivePanel = () => {
      frame = null;
      if (!mobile.matches || !panels) return;

      const readingLine = window.innerHeight * 0.5;
      const index = Array.from(panels).findIndex((panel) => {
        const rect = panel.getBoundingClientRect();
        return rect.top <= readingLine && rect.bottom >= readingLine;
      });

      if (index !== -1) setActiveIndex(index);
    };
    const scheduleUpdate = () => {
      if (mobile.matches && frame === null) {
        frame = window.requestAnimationFrame(updateActivePanel);
      }
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, {passive: true});
    mobile.addEventListener("change", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      mobile.removeEventListener("change", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const heading = section.querySelector(".leadership-heading");
    const panels = section.querySelectorAll(".leadership-panel");
    const targets = heading ? [heading, ...panels] : [...panels];
    const animations: JSAnimation[] = [];
    if (reducedMotion) {
      targets.forEach((element) => {
        (element as HTMLElement).style.opacity = "1";
        (element as HTMLElement).style.transform = "none";
      });
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (heading) animations.push(animate(heading, {
        opacity: [0, 1], translateY: [30, 0], duration: 800, ease: "outExpo",
      }));
      animations.push(animate(panels, {
        opacity: [0, 1], translateY: [45, 0], delay: stagger(120),
        duration: 900, ease: "outExpo",
      }));
      observer.disconnect();
    }, {threshold: 0.08});
    observer.observe(section);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const previous = previousActiveRef.current;
    detailsRefs.current.forEach((details, index) => {
      const inner = detailsInnerRefs.current[index];
      if (!details || !inner) return;
      const content = inner.querySelectorAll(".leadership-description, .leadership-cta");
      const isActive = activeIndex === index;
      if (reducedMotion || previous === undefined) {
        gsap.killTweensOf([details, ...content]);
        gsap.set(details, {height: isActive ? "auto" : 0});
        gsap.set(content, {opacity: isActive ? 1 : 0, y: 0});
        return;
      }
      if (index !== previous && !isActive) return;
      gsap.killTweensOf([details, ...content]);
      gsap.to(details, {
        height: isActive ? inner.offsetHeight : 0,
        duration: isActive ? 0.55 : 0.4,
        ease: "power3.out", overwrite: "auto",
        onComplete: () => {
          if (isActive) gsap.set(details, {height: "auto"});
        },
      });
      content.forEach((element, contentIndex) => {
        gsap.to(element, {
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : contentIndex === 0 ? 12 : 10,
          duration: isActive ? 0.35 : 0.25,
          delay: isActive ? 0.1 + contentIndex * 0.06 : 0,
          ease: "power3.out", overwrite: "auto",
        });
      });
    });
    previousActiveRef.current = activeIndex;
  }, [activeIndex, reducedMotion]);

  useEffect(() => () => {
    detailsRefs.current.forEach((details) => {
      if (!details) return;
      gsap.killTweensOf([details, ...details.querySelectorAll(".leadership-description, .leadership-cta")]);
    });
  }, []);

  return (
    <section ref={sectionRef} className="leadership-section">
      <div className="leadership-heading">
        <span className="leadership-kicker">Leadership Across Sectors</span>
        <h2>
          A journey shaped by enterprise,
          <br />
          public service and social impact
        </h2>
      </div>
      <div className="leadership-accordion">
        {accordionItems.map((item, index) => {
          const isActive = activeIndex === index;
          const detailsId = `leadership-details-${item.id}`;
          return (
            <article
              key={item.id}
              className={`leadership-panel ${isActive ? "is-active" : ""}`}
              style={{"--panel-accent": item.accent, "--panel-glow": item.glow} as React.CSSProperties}
              onPointerEnter={(event) => {
                if (canHover && event.pointerType === "mouse") setActiveIndex(index);
              }}
              onPointerLeave={(event) => {
                if (canHover && event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) {
                  setActiveIndex((current) => current === index ? null : current);
                }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setActiveIndex((current) => current === index ? null : current);
                }
              }}
            >
              <h3 className="leadership-card-heading">
                <button
                  type="button"
                  className="leadership-trigger"
                  aria-expanded={isActive}
                  aria-controls={detailsId}
                  onClick={() => setActiveIndex((current) => current === index ? null : index)}
                >
                  <span className="leadership-image-wrap">
                    <img src={item.image} alt={`${item.title} - Thilanga Sumathipala`} className="leadership-panel-image" />
                    <span className="leadership-image-overlay" aria-hidden="true" />
                  </span>
                  <span className="leadership-panel-content">
                    <span className="leadership-role">{item.role}</span>
                    <span className="leadership-title">{item.title}</span>
                    <Plus className="leadership-toggle-icon" size={19} aria-hidden="true" />
                  </span>
                </button>
              </h3>
              <div
                ref={(element) => {detailsRefs.current[index] = element;}}
                id={detailsId}
                className="leadership-details"
                inert={!isActive}
                aria-hidden={!isActive}
              >
                <div ref={(element) => {detailsInnerRefs.current[index] = element;}} className="leadership-details-inner">
                  <p className="leadership-description">{item.description}</p>
                  <Link to={item.path} className="leadership-cta">
                    Explore {item.title}
                    <span><ArrowUpRight size={15} strokeWidth={1.7} /></span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function LeadershipAccordion() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 901px)").matches);
  const desktopIndexRef = useRef(0);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 901px)");
    const update = () => setIsDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isDesktop ? (
    <LeadershipDesktopCarousel
      initialIndex={desktopIndexRef.current}
      onIndexChange={(index) => {desktopIndexRef.current = index;}}
    />
  ) : <LeadershipMobileAccordion />;
}

function LeadershipDesktopCarousel({initialIndex, onIndexChange}: {
  initialIndex: number;
  onIndexChange: (index: number) => void;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const previousRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const visibleRef = useRef(false);
  const hoveringRef = useRef(false);
  const focusedRef = useRef(false);
  const revealRef = useRef<gsap.core.Tween | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const syncAutoplay = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    const shouldPlay = visibleRef.current && !document.hidden && !reducedMotion &&
      !hoveringRef.current && !focusedRef.current;
    if (shouldPlay && !swiper.autoplay.running) swiper.autoplay.start();
    if (!shouldPlay && swiper.autoplay.running) swiper.autoplay.stop();
  }, [reducedMotion]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting && entry.intersectionRect.height >=
        Math.min(entry.boundingClientRect.height * 0.4, window.innerHeight * 0.4);
      syncAutoplay();
    }, {threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 1]});
    observer.observe(stage);
    document.addEventListener("visibilitychange", syncAutoplay);
    syncAutoplay();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncAutoplay);
      swiperRef.current?.autoplay?.stop();
    };
  }, [syncAutoplay]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const heading = section.querySelector<HTMLElement>(".leadership-heading");
    const stage = stageRef.current;
    const targets = [heading, stage].filter((element): element is HTMLElement => element !== null);
    const animations: JSAnimation[] = [];
    if (reducedMotion) {
      targets.forEach((element) => {element.style.opacity = "1"; element.style.transform = "none";});
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animations.push(animate(targets, {
        opacity: [0, 1], translateY: [30, 0], duration: 800,
        delay: stagger(120), ease: "outExpo",
      }));
      observer.disconnect();
    }, {threshold: 0.08});
    observer.observe(section);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const swiper = swiperRef.current;
    const content = swiper?.slides[swiper.activeIndex]?.querySelectorAll(".leadership-desktop__item");
    revealRef.current?.kill();
    if (!content) return;
    if (reducedMotion) gsap.set(content, {opacity: 1, y: 0});
    else revealRef.current = gsap.fromTo(content, {opacity: 0, y: 14}, {
      opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out", overwrite: "auto",
    });
    return () => {revealRef.current?.kill();};
  }, [activeIndex, reducedMotion]);

  return (
    <section ref={sectionRef} className="leadership-section leadership-desktop">
      <div className="leadership-heading">
        <span className="leadership-kicker">Leadership Across Sectors</span>
        <h2>A journey shaped by enterprise,<br />public service and social impact</h2>
      </div>
      <div
        ref={stageRef}
        className="leadership-desktop__stage"
        onMouseEnter={() => {hoveringRef.current = true; syncAutoplay();}}
        onMouseLeave={() => {hoveringRef.current = false; syncAutoplay();}}
        onFocus={() => {focusedRef.current = true; syncAutoplay();}}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            focusedRef.current = false;
            syncAutoplay();
          }
        }}
      >
        <button ref={previousRef} className="leadership-desktop__nav leadership-desktop__nav--previous" type="button" aria-label="Previous leadership slide"><ChevronLeft size={23} /></button>
        <button ref={nextRef} className="leadership-desktop__nav leadership-desktop__nav--next" type="button" aria-label="Next leadership slide"><ChevronRight size={23} /></button>
        <div ref={paginationRef} className="leadership-desktop__pagination" />
        <Swiper
          className="leadership-desktop__swiper"
          modules={[Autoplay, Navigation, Pagination, A11y]}
          initialSlide={initialIndex}
          slidesPerView={1}
          spaceBetween={0}
          loop
          speed={reducedMotion ? 0 : 850}
          grabCursor
          allowTouchMove
          simulateTouch
          autoplay={{delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true}}
          navigation={{prevEl: previousRef.current, nextEl: nextRef.current}}
          pagination={{
            el: paginationRef.current, clickable: true,
            renderBullet: (index, className) => `<button type="button" class="${className}" aria-label="Show ${accordionItems[index].title}"></button>`,
          }}
          onBeforeInit={(swiper) => {
            if (typeof swiper.params.navigation === "object") {
              swiper.params.navigation.prevEl = previousRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
            if (typeof swiper.params.pagination === "object") swiper.params.pagination.el = paginationRef.current;
          }}
          onSwiper={(swiper) => {swiperRef.current = swiper; syncAutoplay();}}
          onSlideChange={(swiper) => {setActiveIndex(swiper.realIndex); onIndexChange(swiper.realIndex);}}
          a11y={{
            containerMessage: "Leadership across sectors",
            slideLabelMessage: "{{index}} of {{slidesLength}}",
            prevSlideMessage: "Previous leadership slide",
            nextSlideMessage: "Next leadership slide",
          }}
        >
          {accordionItems.map((item, index) => (
            <SwiperSlide key={item.id} inert={activeIndex !== index} aria-hidden={activeIndex !== index}>
              <article className="leadership-desktop__slide" style={{"--panel-accent": item.accent} as React.CSSProperties}>
                <div className="leadership-desktop__media">
                  <img src={item.image} alt={`${item.title} - Thilanga Sumathipala`} className="leadership-desktop__image" />
                </div>
                <div className="leadership-desktop__content">
                  <span className="leadership-desktop__role leadership-desktop__item">{item.role}</span>
                  <h3 className="leadership-desktop__item">{item.title}</h3>
                  <span className="leadership-desktop__divider leadership-desktop__item" aria-hidden="true" />
                  <p className="leadership-desktop__item">{item.description}</p>
                  <Link to={item.path} className="leadership-desktop__cta leadership-desktop__item">Explore {item.title}<ArrowUpRight size={17} strokeWidth={1.7} /></Link>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
