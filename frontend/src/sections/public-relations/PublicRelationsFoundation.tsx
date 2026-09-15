import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import DepthCarousel from '../../components/common/DepthCarousel';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const foundationGallery = [
  {
    image:imageAssets.publicRelations.foundation.gallery.image1,
    alt:'Thilanga Sumathipala Foundation community initiative',
  },
  {
    image:imageAssets.publicRelations.foundation.gallery.image2,
    alt:'Thilanga Sumathipala Foundation social service programme',
  },
  {
    image:imageAssets.publicRelations.foundation.gallery.image3,
    alt:'Thilanga Sumathipala Foundation education initiative',
  },
  {
    image:imageAssets.publicRelations.foundation.gallery.image4,
    alt:'Thilanga Sumathipala Foundation humanitarian programme',
  },
  {
    image:imageAssets.publicRelations.foundation.gallery.image5,
    alt:'Thilanga Sumathipala Foundation community service',
  },
];

export default function PublicRelationsFoundation() {
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

    const heading = section.querySelector<HTMLElement>(
      '.public-relations-foundation-heading',
    );

    const paragraph = section.querySelector<HTMLElement>(
      '.public-relations-foundation-description',
    );

    const carousel = section.querySelector<HTMLElement>(
      '.public-relations-foundation-carousel',
    );

    if (reducedMotion) {
      [heading,paragraph,carousel].forEach((element) => {
        if (!element) return;

        element.style.opacity = '1';
        element.style.transform = 'none';
      });

      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(heading,{
        autoAlpha:0,
        y:30,
      });

      gsap.set(paragraph,{
        autoAlpha:0,
        y:24,
      });

      gsap.set(carousel,{
        autoAlpha:0,
        x:40,
        scale:0.98,
      });

      ScrollTrigger.create({
        trigger:section,
        start:'top 75%',
        once:true,
        onEnter:() => {
          gsap.to(heading,{
            autoAlpha:1,
            y:0,
            duration:0.9,
            ease:'power3.out',
          });

          gsap.to(paragraph,{
            autoAlpha:1,
            y:0,
            duration:0.85,
            delay:0.14,
            ease:'power3.out',
          });

          gsap.to(carousel,{
            autoAlpha:1,
            x:0,
            scale:1,
            duration:1,
            delay:0.22,
            ease:'power4.out',
          });
        },
      });
    },section);

    return () => ctx.revert();
  },[]);

  const carouselConfig = isMobile
    ? {
        depth:90,
        spread:54,
        tilt:8,
        visibleCards:2,
        blur:2,
        cardWidth:290,
        cardHeight:215,
        radius:14,
        autoplayDelay:3600,
      }
    : isTablet
      ? {
          depth:120,
          spread:70,
          tilt:10,
          visibleCards:3,
          blur:4,
          cardWidth:360,
          cardHeight:260,
          radius:16,
          autoplayDelay:3400,
        }
      : {
          depth:150,
          spread:88,
          tilt:13,
          visibleCards:3,
          blur:5,
          cardWidth:420,
          cardHeight:300,
          radius:18,
          autoplayDelay:3200,
        };

  return (
    <section
      ref={sectionRef}
      className="public-relations-foundation"
      style={{
        backgroundImage:
          `url(${imageAssets.publicRelations.foundation.background})`,
      }}
    >
      <div className="public-relations-foundation-overlay" />

      <div className="public-relations-foundation-container">
        <div className="public-relations-foundation-copy">
          <header className="public-relations-foundation-heading">
            <span>
              Service for Human Needs
            </span>

            <h2>
              Thilanga Sumathipala
              <br />
              Foundation
            </h2>
          </header>

          <p className="public-relations-foundation-description">
            In 2006, he established the "Thilanga Sumathipala Foundation"
            with the primary mission of "Service for Human Needs" through
            which he initiates and extends projects across a sphere of
            societal needs such as humanitarian and medical assistance,
            poverty alleviation, disaster assistance, urban and
            environmental development, rehabilitation and more. Currently,
            and over the next several years, the Foundation will focus its
            attention on initiatives designed to benefit vulnerable
            sections of society such as Women, Children and the Elderly.
            The Foundation, rooted in Buddhist principles, also conduct
            regular religious, meditational and meritorious activities.
          </p>
        </div>

        <div className="public-relations-foundation-carousel">
          <DepthCarousel
            items={foundationGallery}
            depth={carouselConfig.depth}
            spread={carouselConfig.spread}
            tilt={carouselConfig.tilt}
            tiltDirection="right"
            perspective={1400}
            visibleCards={carouselConfig.visibleCards}
            falloff={0.18}
            blur={carouselConfig.blur}
            autoplay
            loop
            cardWidth={carouselConfig.cardWidth}
            cardHeight={carouselConfig.cardHeight}
            radius={carouselConfig.radius}
            tint="#ffffff"
            duration={900}
            ease="power3.out"
            autoplayDelay={carouselConfig.autoplayDelay}
            showControls
            showIndicators
            className="foundation-depth-carousel"
          />
        </div>
      </div>
    </section>
  );
}