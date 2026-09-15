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

    const header = section.querySelector<HTMLElement>(
      '.public-relations-foundation-header',
    );

    const description = section.querySelector<HTMLElement>(
      '.public-relations-foundation-description',
    );

    const carousel = section.querySelector<HTMLElement>(
      '.public-relations-foundation-carousel',
    );

    const sinhalaDescription = section.querySelector<HTMLElement>(
      '.public-relations-foundation-sinhala',
    );

    if (reducedMotion) {
      [
        header,
        description,
        carousel,
        sinhalaDescription,
      ].forEach((element) => {
        if (!element) return;

        element.style.opacity = '1';
        element.style.transform = 'none';
      });

      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(header,{
        autoAlpha:0,
        y:24,
      });

      gsap.set(description,{
        autoAlpha:0,
        y:24,
      });

      gsap.set(carousel,{
        autoAlpha:0,
        x:34,
        scale:0.98,
      });

      gsap.set(sinhalaDescription,{
        autoAlpha:0,
        y:26,
      });

      ScrollTrigger.create({
        trigger:section,
        start:'top 78%',
        once:true,
        onEnter:() => {
          gsap.to(header,{
            autoAlpha:1,
            y:0,
            duration:0.85,
            ease:'power3.out',
          });

          gsap.to(description,{
            autoAlpha:1,
            y:0,
            duration:0.8,
            delay:0.12,
            ease:'power3.out',
          });

          gsap.to(carousel,{
            autoAlpha:1,
            x:0,
            scale:1,
            duration:0.95,
            delay:0.18,
            ease:'power4.out',
          });

          gsap.to(sinhalaDescription,{
            autoAlpha:1,
            y:0,
            duration:0.85,
            delay:0.4,
            ease:'power3.out',
          });
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
        cardHeight:195,
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
          cardHeight:215,
          radius:15,
          autoplayDelay:3400,
        }
      : {
          depth:125,
          spread:74,
          tilt:11,
          visibleCards:3,
          blur:4,
          cardWidth:350,
          cardHeight:235,
          radius:16,
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
        <header className="public-relations-foundation-header">
          <img
            src={imageAssets.publicRelations.foundation.logo}
            alt="Thilanga Sumathipala Foundation"
            className="public-relations-foundation-logo"
          />

          <h2>
            Thilanga Sumathipala Foundation
          </h2>
        </header>

        <div className="public-relations-foundation-main">
          <div className="public-relations-foundation-copy">
            <p className="public-relations-foundation-description">
              In 2006, he established the "Thilanga Sumathipala Foundation"
              with the primary mission of "Service for Human Needs" through
              which he initiates and extends projects across a sphere of
              societal needs such as humanitarian and medical assistance,
              poverty alleviation, disaster assistance, urban and environmental
              development, rehabilitation and more. Currently, and over the
              next several years, the Foundation will focus its attention on
              initiatives designed to benefit vulnerable sections of society
              such as Women, Children and the Elderly. The Foundation, rooted
              in Buddhist principles, also conduct regular religious,
              meditational and meritorious activities.
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
              duration={850}
              ease="power3.out"
              autoplayDelay={carouselConfig.autoplayDelay}
              showControls
              showIndicators
              className="foundation-depth-carousel"
            />
          </div>
        </div>

        <div className="public-relations-foundation-sinhala">
          <p>
            හෝමාගම, හොරගල දිරිය කාන්තාවන්ගේ දරුවන්ට තිලංග සුමතිපාල
            පදනමෙන් පාසල් උපකරණ තිලංග සුමතිපාල පදනම විසින් ක්‍රියාත්මක
            කරනු ලබන "කාන්තා දිරිය" වැඩසටහන යටතේ පාසල් උපකරණ බෙදාදීමේ
            තවත් වැඩසටහනක් පසුගියදා (2024-06-24) හෝමාගම මැතිවරණ
            ප්‍රදේශයේ, හොරගල කොට්ඨාසයේ ශ්‍රී සුධර්මාරාම විහාරස්ථානයේදී
            සාර්ථක ලෙස ක්‍රියාවට නැංවුණි. "කාන්තා දිරිය" වැඩසටහන යටතේ
            එහි සාමාජික කාන්තාවන්ගේ පවුල්වල දූ දරුවන්ට ඔවුන්ගේ අධ්‍යාපන
            කටයුතු සාර්ථකව කරගෙන යාම සඳහා පොත්පත් ඇතුළු පාසල් උපකරණ
            ලබාදීම සිදු කරනු ලබයි. හොරගල සුධර්මාරාම විහාරාධිපති පූජ්‍ය
            විදාගම පඤ්ඤාසෝම ස්වාමීන් වහන්සේ, තිලංග සුමතිපාල පදනමේ
            කාන්තා දිරිය වැඩසටහනේ හෝමාගම මැතිවරණ ප්‍රදේශ සම්බන්ධීකාරක
            මහේෂි කසුන්දිකා, කාන්තා දිරිය වැඩසටහනේ හොරගල කොට්ඨාස
            සම්බන්ධීකාරක චමිලා ශාමලී මහත්මීන්ද මේ අවස්ථාව සඳහා එක්වූහ.
          </p>
        </div>
      </div>
    </section>
  );
}