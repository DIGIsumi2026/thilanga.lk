import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import DepthCarousel from '../../components/common/DepthCarousel';
import GalleryLightbox from '../../components/common/GalleryLightbox';
import useSectionActive from '../../hooks/useSectionActive';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const sumathiAwardsGallery = [
  {
    image:imageAssets.publicRelations.sumathiAwards.gallery.image1,
    alt:'Sumathi Awards event moment',
  },
  {
    image:imageAssets.publicRelations.sumathiAwards.gallery.image2,
    alt:'Sumathi Awards ceremony',
  },
  {
    image:imageAssets.publicRelations.sumathiAwards.gallery.image3,
    alt:'Sumathi Awards celebration',
  },
  {
    image:imageAssets.publicRelations.sumathiAwards.gallery.image4,
    alt:'Sumathi Awards recognition of television excellence',
  },
  {
    image:imageAssets.publicRelations.sumathiAwards.gallery.image5,
    alt:'Sumathi Awards arts and television celebration',
  },
  {
    image:imageAssets.publicRelations.sumathiAwards.gallery.image6,
    alt:'Sumathi Awards arts and television celebration',
  },
  {
    image:imageAssets.publicRelations.sumathiAwards.gallery.image7,
    alt:'Sumathi Awards arts and television celebration',
  },
  {
    image:imageAssets.publicRelations.sumathiAwards.gallery.image8,
    alt:'Sumathi Awards arts and television celebration',
  },
];

export default function PublicRelationsSumathiAwards() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [isMobile,setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 700,
  );

  const [isTablet,setIsTablet] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.innerWidth > 700 &&
      window.innerWidth <= 1050,
  );

  const [lightboxOpen,setLightboxOpen] = useState(false);
  const [lightboxIndex,setLightboxIndex] = useState(0);

  const isSectionActive = useSectionActive(sectionRef,{
    threshold:0.3,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setIsMobile(width <= 700);
      setIsTablet(width > 700 && width <= 1050);
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

    const header = section.querySelector<HTMLElement>(
      '.public-relations-sumathi-awards-header',
    );

    const description = section.querySelector<HTMLElement>(
      '.public-relations-sumathi-awards-description',
    );

    const button = section.querySelector<HTMLElement>(
      '.public-relations-sumathi-awards-more',
    );

    const carousel = section.querySelector<HTMLElement>(
      '.public-relations-sumathi-awards-carousel',
    );

    if (reducedMotion) {
      [header,description,button,carousel].forEach((element) => {
        if (!element) return;
        element.style.opacity = '1';
        element.style.transform = 'none';
      });

      return;
    }

    const ctx = gsap.context(() => {
      if (header) {
        gsap.set(header,{
          autoAlpha:0,
          y:24,
        });
      }

      if (description) {
        gsap.set(description,{
          autoAlpha:0,
          y:22,
        });
      }

      if (button) {
        gsap.set(button,{
          autoAlpha:0,
          y:15,
        });
      }

      if (carousel) {
        gsap.set(carousel,{
          autoAlpha:0,
          x:34,
          scale:0.98,
        });
      }

      ScrollTrigger.create({
        trigger:section,
        start:'top 78%',
        once:true,
        onEnter:() => {
          if (header) {
            gsap.to(header,{
              autoAlpha:1,
              y:0,
              duration:0.85,
              ease:'power3.out',
            });
          }

          if (description) {
            gsap.to(description,{
              autoAlpha:1,
              y:0,
              duration:0.82,
              delay:0.12,
              ease:'power3.out',
            });
          }

          if (button) {
            gsap.to(button,{
              autoAlpha:1,
              y:0,
              duration:0.65,
              delay:0.26,
              ease:'power3.out',
            });
          }

          if (carousel) {
            gsap.to(carousel,{
              autoAlpha:1,
              x:0,
              scale:1,
              duration:0.95,
              delay:0.18,
              ease:'power4.out',
            });
          }
        },
      });
    },section);

    return () => ctx.revert();
  },[]);

  const carouselConfig = isMobile
    ? {
        depth:80,
        spread:48,
        tilt:7,
        visibleCards:2,
        blur:2,
        cardWidth:270,
        cardHeight:190,
        radius:14,
        autoplayDelay:3600,
      }
    : isTablet
      ? {
          depth:105,
          spread:62,
          tilt:9,
          visibleCards:3,
          blur:3,
          cardWidth:310,
          cardHeight:210,
          radius:15,
          autoplayDelay:3400,
        }
      : {
          depth:120,
          spread:70,
          tilt:10,
          visibleCards:3,
          blur:4,
          cardWidth:340,
          cardHeight:225,
          radius:16,
          autoplayDelay:3200,
        };

  const openLightbox = (index:number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="public-relations-sumathi-awards"
        style={{
          backgroundImage:
            `url(${imageAssets.publicRelations.sumathiAwards.background})`,
        }}
      >
        <div className="public-relations-sumathi-awards-overlay" />

        <div className="public-relations-sumathi-awards-container">
          <header className="public-relations-sumathi-awards-header">
            <img
              src={imageAssets.publicRelations.sumathiAwards.logo}
              alt="Sumathi Awards"
              className="public-relations-sumathi-awards-logo"
            />

            <h2>Sumathi Awards</h2>
          </header>

          <div className="public-relations-sumathi-awards-main">
            <div className="public-relations-sumathi-awards-copy">
              <p className="public-relations-sumathi-awards-description">
                Celebrating its 31<sup>th</sup> year in 2026, the prestigious
                "Sumathi Awards", conducted annually by the Sumathi Group
                to encourage, reward, honor & celebrate invaluable
                contribution to the Arts, were conceptualized and
                spearheaded by Thilanga Sumathipala in 1995 as a tribute
                to his late father, U W Sumathipala. In its history of a
                quarter century, the Sumathi Awards have become synonymous
                with excellence in the Sri Lankan Television industry,
                and are an anticipated, and coveted award for its
                recognition of creativity, innovation and craft.
              </p>

              <a
                href="https://sumathiawards.lk/"
                target="_blank"
                rel="noopener noreferrer"
                className="public-relations-sumathi-awards-more"
                aria-label="Visit the Sumathi Awards website"
              >
                <span>See More</span>
                <ArrowUpRight size={17} strokeWidth={1.8} />
              </a>
            </div>

            <div className="public-relations-sumathi-awards-carousel">
              <DepthCarousel
                items={sumathiAwardsGallery}
                depth={carouselConfig.depth}
                spread={carouselConfig.spread}
                tilt={carouselConfig.tilt}
                tiltDirection="right"
                perspective={1400}
                visibleCards={carouselConfig.visibleCards}
                falloff={0.18}
                blur={carouselConfig.blur}
                autoplay={isSectionActive && !lightboxOpen}
                loop
                cardWidth={carouselConfig.cardWidth}
                cardHeight={carouselConfig.cardHeight}
                radius={carouselConfig.radius}
                tint="#ffffff"
                duration={850}
                ease="power3.out"
                autoplayDelay={carouselConfig.autoplayDelay}
                showControls
                showIndicators
                onItemClick={(index) => {
                  openLightbox(index);
                }}
                className="sumathi-awards-depth-carousel"
              />
            </div>
          </div>
        </div>
      </section>

      <GalleryLightbox
        items={sumathiAwardsGallery}
        open={lightboxOpen}
        activeIndex={lightboxIndex}
        onClose={() => {
          setLightboxOpen(false);
        }}
        onChange={setLightboxIndex}
      />
    </>
  );
}