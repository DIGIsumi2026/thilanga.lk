import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import DepthCarousel from '../../components/common/DepthCarousel';
import GalleryLightbox from '../../components/common/GalleryLightbox';
import useSectionActive from '../../hooks/useSectionActive';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const milinaGallery = [
  {
    image:imageAssets.publicRelations.milinaMatha.gallery.image1,
    alt:'Milina Matha Foundation initiative',
  },
  {
    image:imageAssets.publicRelations.milinaMatha.gallery.image2,
    alt:'Milina Matha Foundation educational programme',
  }
];

export default function PublicRelationsMilinaMatha() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [lightboxOpen,setLightboxOpen] = useState(false);
  const [lightboxIndex,setLightboxIndex] = useState(0);
  const isSectionActive = useSectionActive(sectionRef,{threshold:0.3});

  const [isMobile,setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 700,
  );

  const [isTablet,setIsTablet] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.innerWidth > 700 &&
      window.innerWidth <= 1050,
  );

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
      '.public-relations-milina-header',
    );

    const description = section.querySelector<HTMLElement>(
      '.public-relations-milina-description',
    );

    const carousel = section.querySelector<HTMLElement>(
      '.public-relations-milina-carousel',
    );

    if (reducedMotion) {
      [header,description,carousel].forEach((element) => {
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
          y:24,
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

  return (
    <>
      <section
      ref={sectionRef}
      className="public-relations-milina"
      style={{
        backgroundImage:
          `url(${imageAssets.publicRelations.milinaMatha.background})`,
      }}
    >
      <div className="public-relations-milina-overlay" />

      <div className="public-relations-milina-container">
        <header className="public-relations-milina-header">
          <img
            src={imageAssets.publicRelations.milinaMatha.logo}
            alt="Milina Matha Foundation"
            className="public-relations-milina-logo"
          />

          <h2>Milina Matha Foundation</h2>
        </header>

        <div className="public-relations-milina-main">
          <div className="public-relations-milina-copy">
            <p className="public-relations-milina-description">
              Following the demise of his beloved mother in 2017,
              Sumathipala established the "Milina Matha Foundation" in
              commemoration of her exemplary and benevolent life, and it
              through this Foundation that the legacy of the late Mrs.
              Sumathipala PhD is continued by her children, through projects
              designed and implemented provide educational assistance, and
              support for the dissemination and elevation of Buddhist
              teachings across the land. Activities include acknowledging
              and promoting the quality of of Buddhist teaching in the Daham
              Schools, awarding scholarships for university candidates &
              students who have excelled at GCE O/L & A/L as well as annual
              donations of school books and educational needs of children
              of the staff of the Sumathi Universal Group of Companies.
            </p>
          </div>

          <div className="public-relations-milina-carousel">
            <DepthCarousel
              items={milinaGallery}
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
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
              className="milina-depth-carousel"
            />
          </div>
        </div>
      </div>
      </section>

      <GalleryLightbox
        items={milinaGallery}
        activeIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onChange={setLightboxIndex}
      />
    </>
  );
}
