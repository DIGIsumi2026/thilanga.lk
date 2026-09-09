import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {ArrowUpRight,Plus} from 'lucide-react';
import {animate,stagger} from 'animejs';
import {gsap} from 'gsap';
import {
  corporateCompanies,
  type CorporateCompany,
} from '../../data/corporateCompanies';

const DESKTOP_BREAKPOINT = 900;
const DESKTOP_COLUMNS = 5;

type PreviewGeometry = {
  left:number;
  top:number;
  width:number;
  height:number;
  originX:number;
  originY:number;
};

const clamp = (value:number,min:number,max:number) =>
  Math.max(min,Math.min(value,max));

export default function CorporateCompanies() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewRef = useRef<HTMLElement | null>(null);
  const previewTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const previousGeometryRef = useRef<PreviewGeometry | null>(null);
  const previewVisibleRef = useRef(false);
  const activeIndexRef = useRef<number | null>(null);
  const animatedRef = useRef(false);

  const [activeCompany,setActiveCompany] =
    useState<CorporateCompany | null>(null);
  const [activeIndex,setActiveIndex] =
    useState<number | null>(null);
  const [previewGeometry,setPreviewGeometry] =
    useState<PreviewGeometry | null>(null);
  const [previewRevision,setPreviewRevision] = useState(0);
  const [isDesktop,setIsDesktop] = useState(
    () => typeof window !== 'undefined' &&
      window.innerWidth > DESKTOP_BREAKPOINT,
  );

  const clearPreview = useCallback(() => {
    activeIndexRef.current = null;
    previewVisibleRef.current = false;
    previousGeometryRef.current = null;
    previewRef.current = null;
    setActiveCompany(null);
    setActiveIndex(null);
    setPreviewGeometry(null);
  },[]);

  const measurePreview = useCallback((index:number) => {
    const grid = gridRef.current;
    const tile = tileRefs.current[index];

    if (!grid || !tile) return null;

    const gridRect = grid.getBoundingClientRect();
    const tileRect = tile.getBoundingClientRect();
    const cellWidth = gridRect.width / DESKTOP_COLUMNS;
    const previewWidth = cellWidth * 2;
    const column = index % DESKTOP_COLUMNS;
    const preferredColumn = column <= 2
      ? column + 1
      : column - 2;
    const startColumn = clamp(
      preferredColumn,
      0,
      DESKTOP_COLUMNS - 2,
    );
    const left = clamp(
      startColumn * cellWidth,
      0,
      gridRect.width - previewWidth,
    );
    const plusX = tileRect.right - gridRect.left - 10;
    const plusY = tileRect.top - gridRect.top + 10;

    return {
      left,
      top:0,
      width:previewWidth,
      height:gridRect.height,
      originX:clamp(plusX - left,0,previewWidth),
      originY:clamp(plusY,0,gridRect.height),
    };
  },[]);

  const openPreview = useCallback((
    company:CorporateCompany,
    index:number,
  ) => {
    if (!isDesktop || !company.preview) return;

    const geometry = measurePreview(index);

    if (!geometry) return;

    previewTimelineRef.current?.kill();
    activeIndexRef.current = index;
    setActiveIndex(index);
    setActiveCompany(company);
    setPreviewGeometry(geometry);
    setPreviewRevision((revision) => revision + 1);
  },[isDesktop,measurePreview]);

  const closeDesktopPreview = useCallback(() => {
    if (!isDesktop || !activeCompany) return;

    const preview = previewRef.current;
    const geometry = previousGeometryRef.current ?? previewGeometry;

    if (!preview || !geometry) {
      clearPreview();
      return;
    }

    previewTimelineRef.current?.kill();
    gsap.killTweensOf(preview);

    const content = preview.querySelectorAll<HTMLElement>(
      '.corporate-company-preview-item',
    );

    previewTimelineRef.current = gsap.timeline({
      defaults:{overwrite:'auto'},
      onComplete:clearPreview,
    })
      .to(content,{
        opacity:0,
        y:6,
        duration:0.18,
        stagger:0.02,
      },0)
      .to(preview,{
        opacity:0,
        scale:0.985,
        clipPath:`circle(0px at ${geometry.originX}px ${geometry.originY}px)`,
        borderRadius:'48% 52% 45% 55% / 52% 44% 56% 48%',
        duration:0.44,
        ease:'power3.inOut',
      },0);
  },[activeCompany,clearPreview,isDesktop,previewGeometry]);

  const toggleMobilePreview = (
    company:CorporateCompany,
    index:number,
  ) => {
    if (isDesktop || !company.preview) return;

    if (activeIndex === index) {
      clearPreview();
      return;
    }

    activeIndexRef.current = index;
    setActiveCompany(company);
    setActiveIndex(index);
  };

  useEffect(() => {
    const updateViewport = () => {
      const desktop = window.innerWidth > DESKTOP_BREAKPOINT;

      setIsDesktop(desktop);

      if (!desktop) {
        previewTimelineRef.current?.kill();
        clearPreview();
        return;
      }

      const index = activeIndexRef.current;

      if (index !== null) {
        const geometry = measurePreview(index);
        if (geometry) setPreviewGeometry(geometry);
      }
    };

    updateViewport();
    window.addEventListener('resize',updateViewport);

    return () => {
      window.removeEventListener('resize',updateViewport);
    };
  },[clearPreview,measurePreview]);

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
          delay:stagger(55,{start:160}),
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

  useLayoutEffect(() => {
    if (
      !isDesktop ||
      !activeCompany?.preview ||
      !previewGeometry ||
      !previewRef.current
    ) return;

    const preview = previewRef.current;
    const content = preview.querySelectorAll<HTMLElement>(
      '.corporate-company-preview-item',
    );
    const previous = previousGeometryRef.current;
    const revealRadius = Math.hypot(
      previewGeometry.width,
      previewGeometry.height,
    );

    previewTimelineRef.current?.kill();
    gsap.killTweensOf([preview,...content]);

    if (!previewVisibleRef.current || !previous) {
      gsap.set(preview,{
        left:previewGeometry.left,
        top:previewGeometry.top,
        width:previewGeometry.width,
        height:previewGeometry.height,
      });

      previewTimelineRef.current = gsap.timeline({
        defaults:{overwrite:'auto'},
      })
        .fromTo(preview,{
          opacity:0,
          scale:0.965,
          clipPath:`circle(0px at ${previewGeometry.originX}px ${previewGeometry.originY}px)`,
          borderRadius:'55% 45% 58% 42% / 45% 58% 42% 55%',
        },{
          opacity:1,
          scale:1,
          clipPath:`circle(${revealRadius}px at ${previewGeometry.originX}px ${previewGeometry.originY}px)`,
          borderRadius:'0px',
          duration:0.72,
          ease:'power4.out',
        })
        .fromTo(content,{
          opacity:0,
          y:14,
        },{
          opacity:1,
          y:0,
          duration:0.45,
          stagger:0.05,
          ease:'power3.out',
        },'-=0.42');

      previewVisibleRef.current = true;
    } else {
      const previousRadius = Math.hypot(
        previous.width,
        previous.height,
      );

      previewTimelineRef.current = gsap.timeline({
        defaults:{overwrite:'auto'},
      })
        .fromTo(preview,{
          left:previous.left,
          top:previous.top,
          width:previous.width,
          height:previous.height,
          clipPath:`circle(${previousRadius}px at ${previous.originX}px ${previous.originY}px)`,
        },{
          left:previewGeometry.left,
          top:previewGeometry.top,
          width:previewGeometry.width,
          height:previewGeometry.height,
          opacity:1,
          scale:1,
          clipPath:`circle(${revealRadius}px at ${previewGeometry.originX}px ${previewGeometry.originY}px)`,
          borderRadius:'0px',
          duration:0.48,
          ease:'power3.inOut',
        })
        .fromTo(content,{
          opacity:0,
          y:9,
        },{
          opacity:1,
          y:0,
          duration:0.38,
          stagger:0.045,
          ease:'power3.out',
        },0.1);
    }

    previousGeometryRef.current = previewGeometry;
  },[activeCompany,isDesktop,previewGeometry,previewRevision]);

  useEffect(() => () => {
    previewTimelineRef.current?.kill();
  },[]);

  const handleGridKeyDown = (
    event:React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== 'Escape') return;

    if (isDesktop) {
      closeDesktopPreview();
    } else {
      clearPreview();
    }
  };

  const renderCompanyMark = (company:CorporateCompany) =>
    company.logo ? (
      <img
        src={company.logo}
        alt={company.name}
        className="corporate-company-logo"
      />
    ) : (
      <span className="corporate-company-logo-placeholder">
        {company.logoText ?? company.name}
      </span>
    );

  const renderPreviewContent = (company:CorporateCompany) => {
    const preview = company.preview;

    if (!preview) return null;

    return (
      <>
        {preview.image ? (
          <img
            className="corporate-company-preview-image"
            src={preview.image}
            alt=""
          />
        ) : (
          <div className="corporate-company-preview-fallback" />
        )}

        <div className="corporate-company-preview-overlay" />

        <div className="corporate-company-preview-content">
          {preview.metric && (
            <strong className="corporate-company-preview-item">
              {preview.metric}
            </strong>
          )}

          <span className="corporate-company-preview-item">
            {preview.title}
          </span>

          {preview.subtitle && (
            <small className="corporate-company-preview-item">
              {preview.subtitle}
            </small>
          )}

          {preview.description && (
            <p className="corporate-company-preview-item">
              {preview.description}
            </p>
          )}
        </div>

        {company.href && (
          <span className="corporate-company-preview-arrow corporate-company-preview-item">
            <ArrowUpRight size={20} strokeWidth={1.5} />
          </span>
        )}
      </>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="corporate-companies"
    >
      <div className="corporate-companies-container">
        <header className="corporate-companies-heading">

          <h2>Companies</h2>

          <p>
            A portfolio shaped by entrepreneurship,
            strategic investment and long-term leadership.
          </p>
        </header>

        <div
          ref={gridRef}
          className="corporate-company-grid"
          onMouseLeave={closeDesktopPreview}
          onKeyDown={handleGridKeyDown}
        >
          {corporateCompanies.map((company,index) => {
            const hasPreview = Boolean(company.preview);
            const hasLink = Boolean(company.href);
            const mark = renderCompanyMark(company);

            return (
              <div
                key={company.id}
                ref={(element) => {
                  tileRefs.current[index] = element;
                }}
                className={`corporate-company-tile ${
                  activeIndex === index ? 'is-active' : ''
                }`}
                onPointerEnter={(event) => {
                  if (hasPreview && event.pointerType !== 'touch') {
                    openPreview(company,index);
                  }
                }}
              >
                {hasPreview ? (
                  <button
                    type="button"
                    className="corporate-company-tile-action"
                    aria-expanded={activeIndex === index}
                    aria-label={`Preview ${company.name}`}
                    onFocus={() => openPreview(company,index)}
                    onClick={() => toggleMobilePreview(company,index)}
                  >
                    {mark}
                    <span
                      className="corporate-company-plus"
                      aria-hidden="true"
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </span>
                  </button>
                ) : hasLink ? (
                  <a
                    href={company.href ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="corporate-company-tile-action"
                    aria-label={`Visit ${company.name}`}
                  >
                    {mark}
                  </a>
                ) : (
                  <div className="corporate-company-tile-action">
                    {mark}
                  </div>
                )}
              </div>
            );
          })}

          {isDesktop && activeCompany?.preview && previewGeometry && (
            activeCompany.href ? (
              <a
                ref={(element) => {
                  previewRef.current = element;
                }}
                href={activeCompany.href}
                target="_blank"
                rel="noopener noreferrer"
                className="corporate-company-preview"
                style={{
                  left:previewGeometry.left,
                  top:previewGeometry.top,
                  width:previewGeometry.width,
                  height:previewGeometry.height,
                  transformOrigin:`${previewGeometry.originX}px ${previewGeometry.originY}px`,
                }}
                aria-label={`Visit ${activeCompany.name}`}
              >
                {renderPreviewContent(activeCompany)}
              </a>
            ) : (
              <div
                ref={(element) => {
                  previewRef.current = element;
                }}
                className="corporate-company-preview"
                style={{
                  left:previewGeometry.left,
                  top:previewGeometry.top,
                  width:previewGeometry.width,
                  height:previewGeometry.height,
                  transformOrigin:`${previewGeometry.originX}px ${previewGeometry.originY}px`,
                }}
                role="region"
                aria-label={`${activeCompany.name} preview`}
              >
                {renderPreviewContent(activeCompany)}
              </div>
            )
          )}
        </div>

        {!isDesktop && activeCompany?.preview && (
          <div className="corporate-company-mobile-preview">
            <div>
              {activeCompany.preview.metric && (
                <strong>{activeCompany.preview.metric}</strong>
              )}

              <span>{activeCompany.preview.title}</span>

              {activeCompany.preview.description && (
                <p>{activeCompany.preview.description}</p>
              )}
            </div>

            {activeCompany.href && (
              <a
                href={activeCompany.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${activeCompany.name}`}
              >
                <ArrowUpRight size={21} strokeWidth={1.5} />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
