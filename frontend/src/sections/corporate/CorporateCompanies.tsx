import {
  Fragment,
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {ArrowUpRight,Plus} from 'lucide-react';
import {animate,stagger,type JSAnimation} from 'animejs';
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
  const viewportModeRef = useRef(
    typeof window !== 'undefined' && window.innerWidth > DESKTOP_BREAKPOINT,
  );
  const mobilePreviewShellRef = useRef<HTMLDivElement | null>(null);
  const mobilePreviewRef = useRef<HTMLDivElement | null>(null);
  const mobileAnimationsRef = useRef<JSAnimation[]>([]);
  const pulseAnimationsRef = useRef<JSAnimation[]>([]);
  const pulseRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mobileTransitionIdRef = useRef(0);

  const [activeCompany,setActiveCompany] =
    useState<CorporateCompany | null>(null);
  const [activeIndex,setActiveIndex] =
    useState<number | null>(null);
  const [previewGeometry,setPreviewGeometry] =
    useState<PreviewGeometry | null>(null);
  const [previewRevision,setPreviewRevision] = useState(0);
  const [mobileColumnCount,setMobileColumnCount] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 600px)').matches ? 2 : 3,
  );
  const [prefersReducedMotion,setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
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

  const cancelMobileAnimations = useCallback(() => {
    mobileAnimationsRef.current.forEach((animation) => animation.cancel());
    mobileAnimationsRef.current = [];
  },[]);

  const cancelPulseAnimations = useCallback(() => {
    pulseAnimationsRef.current.forEach((animation) => animation.cancel());
    pulseAnimationsRef.current = [];
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

  const activateMobilePreview = useCallback((
    company:CorporateCompany,
    index:number,
  ) => {
    mobileTransitionIdRef.current += 1;
    activeIndexRef.current = index;
    setActiveCompany(company);
    setActiveIndex(index);
  },[]);

  const closeMobilePreview = useCallback((next?:{
    company:CorporateCompany;
    index:number;
  }) => {
    const shell = mobilePreviewShellRef.current;
    const preview = mobilePreviewRef.current;
    const transitionId = mobileTransitionIdRef.current + 1;

    mobileTransitionIdRef.current = transitionId;
    cancelMobileAnimations();

    const completeClose = () => {
      if (mobileTransitionIdRef.current !== transitionId) return;

      clearPreview();

      if (next) {
        window.requestAnimationFrame(() => {
          activateMobilePreview(next.company,next.index);
        });
      }
    };

    if (!shell || !preview || prefersReducedMotion) {
      completeClose();
      return;
    }

    shell.style.height = `${shell.offsetHeight}px`;

    const previewAnimation = animate(preview,{
      opacity:[1,0],
      scale:[1,0.975],
      translateY:[0,-6],
      duration:260,
      ease:'inCubic',
    });
    const shellAnimation = animate(shell,{
      height:[`${shell.offsetHeight}px`,'0px'],
      duration:430,
      delay:70,
      ease:'inOutCubic',
      onComplete:completeClose,
    });

    mobileAnimationsRef.current = [previewAnimation,shellAnimation];
  },[
    activateMobilePreview,
    cancelMobileAnimations,
    clearPreview,
    prefersReducedMotion,
  ]);

  const toggleMobilePreview = (
    company:CorporateCompany,
    index:number,
  ) => {
    if (isDesktop || !company.preview) return;

    if (activeIndex === index) {
      closeMobilePreview();
      return;
    }

    if (activeIndex !== null) {
      closeMobilePreview({company,index});
      return;
    }

    activateMobilePreview(company,index);
  };

  useEffect(() => {
    const updateViewport = () => {
      const desktop = window.innerWidth > DESKTOP_BREAKPOINT;
      const modeChanged = desktop !== viewportModeRef.current;

      viewportModeRef.current = desktop;
      setIsDesktop(desktop);

      if (modeChanged) {
        previewTimelineRef.current?.kill();
        mobileTransitionIdRef.current += 1;
        cancelMobileAnimations();
        clearPreview();
        return;
      }

      if (!desktop) return;

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
  },[cancelMobileAnimations,clearPreview,measurePreview]);

  useEffect(() => {
    const phoneQuery = window.matchMedia('(max-width: 600px)');
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const updateMobilePreferences = () => {
      setMobileColumnCount(phoneQuery.matches ? 2 : 3);
      setPrefersReducedMotion(reducedMotionQuery.matches);
    };

    updateMobilePreferences();
    phoneQuery.addEventListener('change',updateMobilePreferences);
    reducedMotionQuery.addEventListener('change',updateMobilePreferences);

    return () => {
      phoneQuery.removeEventListener('change',updateMobilePreferences);
      reducedMotionQuery.removeEventListener('change',updateMobilePreferences);
    };
  },[]);

  useLayoutEffect(() => {
    if (
      isDesktop ||
      activeIndex === null ||
      !activeCompany?.preview ||
      !mobilePreviewShellRef.current ||
      !mobilePreviewRef.current
    ) return;

    const shell = mobilePreviewShellRef.current;
    const preview = mobilePreviewRef.current;

    cancelMobileAnimations();

    if (prefersReducedMotion) {
      shell.style.height = 'auto';
      preview.style.opacity = '1';
      preview.style.transform = 'none';
      preview.style.clipPath = 'none';
      return;
    }

    const targetHeight = preview.offsetHeight;

    shell.style.height = '0px';

    const shellAnimation = animate(shell,{
      height:['0px',`${targetHeight}px`],
      duration:590,
      ease:'outExpo',
      onComplete:() => {
        shell.style.height = 'auto';
      },
    });
    const previewAnimation = animate(preview,{
      opacity:[0,1],
      scale:[0.96,1],
      translateY:[-8,0],
      clipPath:[
        'inset(8% 3% 8% 3% round 12px)',
        'inset(0% 0% 0% 0% round 0px)',
      ],
      duration:620,
      ease:'outExpo',
    });

    mobileAnimationsRef.current = [shellAnimation,previewAnimation];
  },[
    activeCompany,
    activeIndex,
    cancelMobileAnimations,
    isDesktop,
    mobileColumnCount,
    prefersReducedMotion,
  ]);

  useEffect(() => {
    cancelPulseAnimations();

    pulseRefs.current.forEach((pulse,index) => {
      if (!pulse) return;

      if (isDesktop || prefersReducedMotion || activeIndex === index) {
        pulse.style.opacity = '0';
        pulse.style.transform = 'scale(0.75)';
        return;
      }

      const animation = animate(pulse,{
        opacity:[0.48,0],
        scale:[0.75,1.8],
        duration:1550,
        delay:(index % mobileColumnCount) * 140 + index * 35,
        loop:true,
        ease:'outQuad',
      });

      pulseAnimationsRef.current.push(animation);
    });

    return cancelPulseAnimations;
  },[
    activeIndex,
    cancelPulseAnimations,
    isDesktop,
    mobileColumnCount,
    prefersReducedMotion,
  ]);

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
    mobileTransitionIdRef.current += 1;
    cancelMobileAnimations();
    cancelPulseAnimations();
  },[cancelMobileAnimations,cancelPulseAnimations]);

  const handleGridKeyDown = (
    event:React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== 'Escape') return;

    if (isDesktop) {
      closeDesktopPreview();
    } else {
      closeMobilePreview();
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

  const mobileRowEndIndex = !isDesktop && activeIndex !== null
    ? Math.min(
      Math.ceil((activeIndex + 1) / mobileColumnCount) *
        mobileColumnCount - 1,
      corporateCompanies.length - 1,
    )
    : null;

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
            const isActive = activeIndex === index;
            const previewId = `corporate-company-details-${company.id}`;
            const accentStyle = company.accent ? ({
              '--company-accent-from':company.accent.from,
              '--company-accent-to':company.accent.to,
            } as CSSProperties) : undefined;

            return (
              <Fragment key={company.id}>
                <div
                  ref={(element) => {
                    tileRefs.current[index] = element;
                  }}
                  className={`corporate-company-tile ${
                    isActive ? 'is-active' : ''
                  } ${hasLink ? 'is-linked' : ''}`}
                  style={accentStyle}
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
                      aria-expanded={isActive}
                      aria-controls={previewId}
                      aria-label={isActive
                        ? `Close details for ${company.name}`
                        : `View details for ${company.name}`}
                      onFocus={() => openPreview(company,index)}
                      onClick={() => toggleMobilePreview(company,index)}
                    >
                      {mark}
                      <span
                        className="corporate-company-plus"
                        aria-hidden="true"
                      >
                        <span
                          ref={(element) => {
                            pulseRefs.current[index] = element;
                          }}
                          className="corporate-company-plus-pulse"
                        />
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

                {!isDesktop &&
                  index === mobileRowEndIndex &&
                  activeCompany?.preview && (
                    <div
                      ref={mobilePreviewShellRef}
                      className="corporate-company-inline-preview-shell"
                    >
                      <div
                        ref={mobilePreviewRef}
                        id={`corporate-company-details-${activeCompany.id}`}
                        className="corporate-company-inline-preview"
                        role="region"
                        aria-label={`${activeCompany.name} company details`}
                      >
                        {activeCompany.preview.image ? (
                          <img
                            className="corporate-company-inline-preview-image"
                            src={activeCompany.preview.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="corporate-company-inline-preview-fallback" />
                        )}

                        <div className="corporate-company-inline-preview-overlay" />

                        <div className="corporate-company-inline-preview-content">
                          {activeCompany.preview.metric && (
                            <strong>{activeCompany.preview.metric}</strong>
                          )}

                          <span>{activeCompany.preview.title}</span>

                          {activeCompany.preview.subtitle && (
                            <small>{activeCompany.preview.subtitle}</small>
                          )}

                          {activeCompany.preview.description && (
                            <p>{activeCompany.preview.description}</p>
                          )}
                        </div>

                        {activeCompany.href && (
                          <a
                            className="corporate-company-inline-preview-arrow"
                            href={activeCompany.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${activeCompany.name}`}
                          >
                            <ArrowUpRight size={21} strokeWidth={1.5} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
              </Fragment>
            );
          })}

          {isDesktop && activeCompany?.preview && previewGeometry && (
            activeCompany.href ? (
              <a
                ref={(element) => {
                  previewRef.current = element;
                }}
                id={`corporate-company-details-${activeCompany.id}`}
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
                id={`corporate-company-details-${activeCompany.id}`}
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
      </div>
    </section>
  );
}
