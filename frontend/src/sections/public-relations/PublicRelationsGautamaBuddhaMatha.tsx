import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import DepthCarousel from '../../components/common/DepthCarousel';
import GalleryLightbox from '../../components/common/GalleryLightbox';
import useSectionActive from '../../hooks/useSectionActive';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const galleryItems = [
  {
    image:imageAssets.publicRelations.gautamaBuddhaMatha.gallery.image1,
    alt:'ගෞතම බුද්ධ මාතා සිනමා නිර්මාණය',
  },
  {
    image:imageAssets.publicRelations.gautamaBuddhaMatha.gallery.image2,
    alt:'ගෞතම බුද්ධ මාතා රූපගත කිරීම්',
  },
  {
    image:imageAssets.publicRelations.gautamaBuddhaMatha.gallery.image3,
    alt:'ගෞතම බුද්ධ මාතා සිනමා කටයුතු',
  },
  {
    image:imageAssets.publicRelations.gautamaBuddhaMatha.gallery.image4,
    alt:'ගෞතම බුද්ධ මාතා නිෂ්පාදන කටයුතු',
  },
  {
    image:imageAssets.publicRelations.gautamaBuddhaMatha.gallery.image5,
    alt:'ගෞතම බුද්ධ මාතා',
  },
];

export default function PublicRelationsGautamaBuddhaMatha() {
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
      '.public-relations-buddha-matha-header',
    );

    const paragraphs = section.querySelectorAll<HTMLElement>(
      '.public-relations-buddha-matha-description p',
    );

    const carousel = section.querySelector<HTMLElement>(
      '.public-relations-buddha-matha-carousel',
    );

    if (reducedMotion) {
      [header,carousel,...Array.from(paragraphs)].forEach((element) => {
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

      gsap.set(paragraphs,{
        autoAlpha:0,
        y:22,
      });

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

          gsap.to(paragraphs,{
            autoAlpha:1,
            y:0,
            duration:0.78,
            stagger:0.11,
            delay:0.12,
            ease:'power3.out',
          });

          if (carousel) {
            gsap.to(carousel,{
              autoAlpha:1,
              x:0,
              scale:1,
              duration:0.95,
              delay:0.2,
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
      className="public-relations-buddha-matha"
      style={{
        backgroundImage:
          `url(${imageAssets.publicRelations.gautamaBuddhaMatha.background})`,
      }}
    >
      <div className="public-relations-buddha-matha-overlay" />

      <div className="public-relations-buddha-matha-container">
        <header className="public-relations-buddha-matha-header">
          <img
            src={imageAssets.publicRelations.gautamaBuddhaMatha.logo}
            alt="ගෞතම බුද්ධ මාතා"
            className="public-relations-buddha-matha-logo"
          />

          <h2>ගෞතම බුද්ධ මාතා</h2>
        </header>

        <div className="public-relations-buddha-matha-main">
          <div className="public-relations-buddha-matha-copy">
            <div className="public-relations-buddha-matha-description">
              <p>
                විශ්වයේ සුවහසක් මව්රුන්ගේ නාමයට "ගෞතම බුද්ධ මාතා”
                රූපගත කිරීම ඇරඹෙයි. රාජ මාතාව, රාජ මෙහෙසිය, රාජ කුමරිය
                යන නාමයන් ස්ත්‍රියන් හට දුලබ නොවෙති. නමුත් යම් ස්ත්‍රියක්
                හට “බුද්ධ මාතා” යන නමක් වේ නම් එය ලෝකයේ පරම දුර්ලභය.
                ආත්ම කල්ප ගණනක් පෙරුම් පුරාගෙන විත් බුදුවන සිදුහත්
                කුමරුන්ට සිය මව් කුසය දුන් මහාමායා දේවිය හැරුණු කොට ඒ
                දුර්ලභ වාසනාව උදාවූයේ කල්ප ගණනකින් උපදින වාසනාවන්ත
                ස්ත්‍රී රත්නයකට පමණක්මය.
              </p>

              <p>
                ගෞතම බුදුන් නිසාම ඒ මහා වාසනාව ලද්දී මහා ප්‍රජාපතී
                ගෝතමී දේවියයි. සුවහසක් කාන්තාවන්ගේ විමුක්තිය වෙනුවෙන්
                මෙහෙණි සස්න ආරම්භ කීරීමටද පුරෝගාමී වූ ඈ, සිදුහත් කුමරා
                කුසින් නොවැදුවද එදා මෙදා තුර අප ගෞරවයෙන් වන්දනා කරන
                ගෞතම බුදු සසුනේ බුද්ධ මාතාවයි. සම්මානිත මහාචාර්ය
                සුනිල් ආරියරත්නයන් අධ්‍යක්ෂණයෙන් සහ මාගේ නිෂ්පාදනයෙන්
                නිර්මාණය වන නවතම සිනමාපටය දිග හැරෙන්නේ මේ උතුම්,
                වන්දනීය කාන්තා රත්නය වටාය.
              </p>

              <p>
                "ගෞතම බුද්ධ මාතා” ලෙසින් නම්කර ඇති මෙම සිනමා පටයේ
                රූපගත කිරීම් 2024 ජුනි 14 වැනි සිකුරාදා දිනට යෙදී
                තිබුණු සුබ මොහොතින් ආරම්භ කෙරිණ. බෞද්ධ සාහිත්‍යයේ අපට
                හමුවන පරම පූජනීය උතුම් කාන්තා රත්නයක්වන මහා ප්‍රජාපතී
                ගෝතමියගේ ජීවන පුවත ඇසුරෙන්, මාගේ සංකල්පයකට අනුව ඉතා
                දීර්ඝ ගවේෂණයකින් පසු මෙහි තිර රචනය සහ දෙබස්ද ලියා
                ඇත්තේ මහාචාර්ය සුනිල් ආරියරත්නයන් විසිනි.
              </p>

              <p>
                "මාගේ ආදරණීය මව වන දිවංගත මිලිනා සුමතිපාල මහත්මිය
                සිංහල සිනමාවට සම්මානනීය චිත්‍රපට ගොන්නක් තිළිණ කළා.
                ගඟ අද්දර, දුවට මවක මිස, උප්පලවණ්ණා සහ පත්තිනි ඒ
                අතරින් ප්‍රධානයි. බුදුන් වහන්සේගේ සුළු මව වූ මහා
                ප්‍රජාපතී ගෝතමිය නම්වූ ශ්‍රේෂ්ඨ කාන්තා චරිතය ඇසුරෙන්ද
                චිත්‍රපටයක් නිර්මාණය කිරීමේ නොනිමි ආශාවක් සහ
                බලාපොරොත්තුවක් මගේ මව තුළ තිබුණා. ඇගේ එම
                බලාපොරොත්තුව ඉටුකිරීමේ අරමුණද ඇතිවයි මා එම බුද්ධ
                මාතාවගේ කතා පුවත සිනමාවට නගන්නට තීරණය කළේ. මේ වසරේ
                අවසානය වන විට 'ගෞතම බුද්ධ මාතා' චිත්‍රපටය ඔබ හමුවට
                ගෙන ඒමට අපි බලාපොරොත්තු වෙනවා." සිදුහත් කුමරුගේ මව
                ‘කුමරුන්‘ ඉපිද දින හතකින් මෙලොව හැරයෑමෙන් පසු, සුළු
                මව ලෙස සිදුහත් කුමරු රැකබලා ගැනීම පිණිස මහා ප්‍රජාපතී
                ගෝතමිය කළ අසීමිත කැපකිරීම පිළිබද නොඇසූ කතා පුවතක්
                "ගෞතම බුද්ධ මාතා” සිනමාපටය හරහා ඔබටත් දැකබලා ගැනීමට
                ලැබෙනු ඇති.
              </p>
            </div>
          </div>

          <div className="public-relations-buddha-matha-carousel">
            <DepthCarousel
              items={galleryItems}
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
              className="buddha-matha-depth-carousel"
            />
          </div>
        </div>
      </div>
      </section>

      <GalleryLightbox
        items={galleryItems}
        activeIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onChange={setLightboxIndex}
      />
    </>
  );
}
