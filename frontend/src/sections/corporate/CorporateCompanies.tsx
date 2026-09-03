import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Plus} from 'lucide-react';
import {animate,stagger} from 'animejs';
import {
  corporateCompanies,
  type CorporateCompany,
} from '../../data/corporateCompanies';

const DESKTOP_BREAKPOINT = 900;

export default function CorporateCompanies() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLAnchorElement | null>(null);
  const animatedRef = useRef(false);

  const [activeCompany,setActiveCompany] =
    useState<CorporateCompany | null>(null);

  const [activeIndex,setActiveIndex] =
    useState<number | null>(null);

  const [isDesktop,setIsDesktop] = useState(
    () => typeof window !== 'undefined' &&
      window.innerWidth > DESKTOP_BREAKPOINT,
  );

  useEffect(() => {
    const updateViewport = () => {
      const desktop =
        window.innerWidth > DESKTOP_BREAKPOINT &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      setIsDesktop(desktop);

      if (!desktop) {
        setActiveCompany(null);
        setActiveIndex(null);
      }
    };

    updateViewport();

    window.addEventListener('resize',updateViewport);

    return () => {
      window.removeEventListener('resize',updateViewport);
    };
  },[]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const heading = section.querySelector<HTMLElement>(
      '.corporate-companies-heading',
    );

    const items = section.querySelectorAll<HTMLElement>(
      '.corporate-company-tile',
    );

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      if (heading) heading.style.opacity = '1';

      items.forEach((item) => {
        item.style.opacity = '1';
      });

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return;

        animatedRef.current = true;

        if (heading) {
          animate(heading,{
            opacity:[0,1],
            translateY:[28,0],
            duration:850,
            ease:'outExpo',
          });
        }

        animate(items,{
          opacity:[0,1],
          translateY:[18,0],
          delay:stagger(55,{
            start:160,
          }),
          duration:700,
          ease:'outExpo',
        });

        observer.disconnect();
      },
      {
        threshold:0.12,
        rootMargin:'0px 0px -8% 0px',
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  },[]);

  useEffect(() => {
    const preview = previewRef.current;

    if (!preview || !activeCompany) return;

    animate(preview,{
      opacity:[0,1],
      scale:[0.985,1],
      duration:480,
      ease:'outExpo',
    });
  },[activeCompany]);

  const openPreview = (
    company:CorporateCompany,
    index:number,
  ) => {
    if (!isDesktop || !company.hasPreview) return;

    setActiveCompany(company);
    setActiveIndex(index);
  };

  const closePreview = () => {
    if (!isDesktop) return;

    setActiveCompany(null);
    setActiveIndex(null);
  };

  const toggleMobilePreview = (
    company:CorporateCompany,
    index:number,
  ) => {
    if (isDesktop || !company.hasPreview) return;

    if (activeIndex === index) {
      setActiveCompany(null);
      setActiveIndex(null);
      return;
    }

    setActiveCompany(company);
    setActiveIndex(index);
  };

  const getPreviewPosition = () => {
    if (activeIndex === null) return {};

    const column = activeIndex % 5;

    /*
      Reference behavior:
      preview = 2 columns wide
      preview = full 3-row height

      Prefer opening immediately to the right.
      If there is not enough room, open to the left.
    */

    if (column <= 2) {
      return {
        gridColumn:`${column + 2} / span 2`,
        gridRow:'1 / span 3',
      };
    }

    return {
      gridColumn:`${Math.max(1,column - 1)} / span 2`,
      gridRow:'1 / span 3',
    };
  };

  return (
    <section
      ref={sectionRef}
      className="corporate-companies"
    >
      <div className="corporate-companies-container">
        <header className="corporate-companies-heading">
          <span className="corporate-companies-kicker">
            Corporate Portfolio
          </span>

          <h2>
            Companies & Ventures
          </h2>

          <p>
            A portfolio shaped by entrepreneurship,
            strategic investment and long-term leadership.
          </p>
        </header>

        <div
          className="corporate-company-grid"
          onMouseLeave={closePreview}
        >
          {corporateCompanies.map((company,index) => (
            <a
              key={company.id}
              href={company.href}
              target="_blank"
              rel="noreferrer"
              className={`corporate-company-tile ${
                activeIndex === index ? 'is-active' : ''
              }`}
              onMouseEnter={() => openPreview(company,index)}
              onClick={(event) => {
                if (
                  !isDesktop &&
                  company.hasPreview &&
                  activeIndex !== index
                ) {
                  event.preventDefault();
                  toggleMobilePreview(company,index);
                }
              }}
              aria-label={`Visit ${company.name}`}
            >
              <span className="corporate-company-logo-placeholder">
                {company.logoText}
              </span>

              {company.hasPreview && (
                <span
                  className="corporate-company-plus"
                  aria-hidden="true"
                >
                  <Plus size={13} strokeWidth={1.6} />
                </span>
              )}
            </a>
          ))}

          {isDesktop && activeCompany && (
            <a
              ref={previewRef}
              href={activeCompany.href}
              target="_blank"
              rel="noreferrer"
              className="corporate-company-preview"
              style={getPreviewPosition()}
              aria-label={`Visit ${activeCompany.name}`}
            >
              <div className="corporate-company-preview-bg" />

              <div className="corporate-company-preview-overlay" />

              <div className="corporate-company-preview-content">
                {activeCompany.previewMetric && (
                  <strong>
                    {activeCompany.previewMetric}
                  </strong>
                )}

                <span>
                  {activeCompany.previewTitle}
                </span>

                <p>
                  {activeCompany.previewDescription}
                </p>
              </div>

              <span className="corporate-company-preview-arrow">
                <ArrowUpRight size={20} strokeWidth={1.5} />
              </span>
            </a>
          )}
        </div>

        {!isDesktop && activeCompany && (
          <a
            ref={previewRef}
            href={activeCompany.href}
            target="_blank"
            rel="noreferrer"
            className="corporate-company-mobile-preview"
          >
            <div>
              {activeCompany.previewMetric && (
                <strong>
                  {activeCompany.previewMetric}
                </strong>
              )}

              <span>
                {activeCompany.previewTitle}
              </span>

              <p>
                {activeCompany.previewDescription}
              </p>
            </div>

            <ArrowUpRight size={21} strokeWidth={1.5} />
          </a>
        )}
      </div>
    </section>
  );
}