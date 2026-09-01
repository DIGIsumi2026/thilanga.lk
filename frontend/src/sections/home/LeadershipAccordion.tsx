import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { animate, stagger } from "animejs";
import { imageAssets } from "../../assets/imageAssets";

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
      "A public-service journey spanning provincial and parliamentary leadership, including service as a Member of Parliament, Deputy Minister, Deputy Speaker of Parliament and State Minister of Technology & Innovation.",
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

export default function LeadershipAccordion() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Task 2: Active the first accordian when the section renders
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Initialize GSAP states immediately on mount
  useEffect(() => {
    animatePanels(0);
  }, []);

  // Initial Section Entrance (Anime.js)
  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const heading = section.querySelector(".leadership-heading");
    const panels = section.querySelectorAll(".leadership-panel");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (heading) {
          animate(heading, {
            opacity: [0, 1],
            y: [30, 0],
            duration: 800,
            ease: "outExpo",
          });
        }

        if (panels.length) {
          animate(panels, {
            opacity: [0, 1],
            y: [45, 0],
            delay: stagger(120),
            duration: 900,
            ease: "outExpo",
          });
        }

        observer.disconnect();
      },
      {
        threshold: 0.18,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Task 4: Mobile Scroll Observer to expand panels on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (window.innerWidth > 900) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!isNaN(index)) {
              setActiveIndex(index);
              animatePanels(index);
            }
          }
        });
      },
      {
        rootMargin: "-35% 0px -40% 0px",
        threshold: 0,
      },
    );

    panelsRef.current.forEach((panel) => {
      if (panel) observer.observe(panel);
    });

    return () => observer.disconnect();
  }, []);

  // Handle Resize Cleanup
  useEffect(() => {
    let isMobile = window.innerWidth <= 900;

    const handleResize = () => {
      const currentIsMobile = window.innerWidth <= 900;
      if (currentIsMobile !== isMobile) {
        isMobile = currentIsMobile;

        if (currentIsMobile) {
          // Entering mobile mode: clean up desktop flex styles
          gsap.killTweensOf(panelsRef.current);
          gsap.set(panelsRef.current, { clearProps: "flexGrow,flexBasis" });
          animatePanels(activeIndex);
        } else {
          // Entering desktop mode: re-apply desktop styles
          animatePanels(activeIndex);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  const animatePanels = (index: number | null) => {
    const isDesktop = window.innerWidth > 900;

    panelsRef.current.forEach((panel, panelIndex) => {
      if (!panel) return;

      const image = panel.querySelector(".leadership-panel-image");
      const description = panel.querySelector(".leadership-description");
      const cta = panel.querySelector(".leadership-cta");

      const isActive = panelIndex === index;
      const hasActive = index !== null;

      if (isDesktop) {
        gsap.to(panel, {
          flexGrow: hasActive ? (isActive ? 2.4 : 0.75) : 1,
          duration: 0.8,
          ease: "power4.out",
          overwrite: "auto",
        });
      }

      if (image) {
        gsap.to(image, {
          scale: isActive ? 1.055 : 1,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (description) {
        gsap.to(description, {
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 18,
          duration: 0.45,
          delay: isActive ? 0.18 : 0,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (cta) {
        gsap.to(cta, {
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 14,
          duration: 0.45,
          delay: isActive ? 0.24 : 0,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  };

  const handleEnter = (index: number) => {
    if (window.innerWidth <= 900) return;

    setActiveIndex(index);
    animatePanels(index);
  };

  const handleLeave = () => {
    if (window.innerWidth <= 900) return;

    setActiveIndex(null);
    animatePanels(null);
  };

  const handleMobileToggle = (index: number) => {
    if (window.innerWidth > 900) return;

    const nextIndex = activeIndex === index ? null : index;

    setActiveIndex(nextIndex);
    animatePanels(nextIndex);
  };

  return (
    <section ref={sectionRef} className="leadership-section">
      <div className="leadership-heading">
        <span className="leadership-kicker">Leadership across spheres</span>

        <h2>
          A journey shaped by enterprise,
          <br />
          public service and social impact
        </h2>
      </div>

      <div className="leadership-accordion" onMouseLeave={handleLeave}>
        {accordionItems.map((item, index) => (
          <div
            key={item.id}
            data-index={index}
            ref={(element) => {
              panelsRef.current[index] = element;
            }}
            className={`leadership-panel ${
              activeIndex === index ? "is-active" : ""
            }`}
            style={
              {
                "--panel-accent": item.accent,
                "--panel-glow": item.glow,
              } as React.CSSProperties
            }
            onMouseEnter={() => handleEnter(index)}
            onClick={() => handleMobileToggle(index)}
          >
            <div className="leadership-panel-glow" />

            <div className="leadership-image-wrap">
              <img
                src={item.image}
                alt={`${item.title} - Thilanga Sumathipala`}
                className="leadership-panel-image"
              />

              <div className="leadership-image-overlay" />
            </div>

            <div className="leadership-panel-content">
              <div className="leadership-panel-top">
                <span className="leadership-role">{item.role}</span>
              </div>

              <div className="leadership-panel-bottom">
                <h3>{item.title}</h3>

                <p className="leadership-description">{item.description}</p>

                <Link
                  to={item.path}
                  className="leadership-cta"
                  onClick={(event) => event.stopPropagation()}
                >
                  Explore {item.title}
                  <span>
                    <ArrowUpRight size={15} strokeWidth={1.7} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
