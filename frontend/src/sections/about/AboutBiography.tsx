import {useEffect,useRef,useState} from 'react';
import {animate,stagger} from 'animejs';
import {Swiper,SwiperSlide} from 'swiper/react';
import {Autoplay,EffectFade} from 'swiper/modules';
import type {Swiper as SwiperType} from 'swiper';
import {imageAssets} from '../../assets/imageAssets';

import 'swiper/css';
import 'swiper/css/effect-fade';

const biographySlides = [
  {image:imageAssets.about.biographySlides.image1,alt:'Portrait of Thilanga Sumathipala in a blue suit'},
  {image:imageAssets.about.biographySlides.image2,alt:'Thilanga Sumathipala seated in academic regalia'},
  {image:imageAssets.about.biographySlides.image3,alt:'Thilanga Sumathipala speaking at a Sri Lanka Cricket press conference'},
  {image:imageAssets.about.biographySlides.image4,alt:'Thilanga Sumathipala seated in the parliamentary chamber'},
  {image:imageAssets.about.biographySlides.image5,alt:'Thilanga Sumathipala speaking during an interview'},
];

const biographyParagraphs = [
  `Thilanga Sumathipala began his education at Nalanda College, Colombo, before travelling to the United Kingdom in 1983 to pursue further studies in Photolithography, Graphic Reproduction and Printing Techniques at the London College of Printing. A printer by profession, he later broadened his knowledge of management and public administration through programmes at Harvard Business School in 2005 and the John F. Kennedy School of Government in 2006. He also completed postgraduate studies in Public Administration at the University of Colombo.`,

  `Sumathipala served as a Member of the Parliament of Sri Lanka from 2010 to 2020. During his parliamentary career, he served as Deputy Minister of Skills Development and Vocational Training in 2015, Deputy Speaker and Chair of Committees from 2015 to 2018, and State Minister of Technology and Innovations from 2019 to 2020.`,

  `A dedicated family man, Sumathipala and his wife Samadara have three sons, Udhantha, Dulantha and Sajantha, all of whom are following in their father’s footsteps as astute minded young professionals.`,

  `Following the death of his father, U. W. Sumathipala, Thilanga Sumathipala became involved in the family businesses at a young age. Working alongside his siblings, he contributed to the development of business interests spanning construction, trade, publishing, media, sports and financial services.`,

  `Exhibiting the vision, acumen, pragmatism and dedication that have grown to be synonymous with his personal and professional personae even from that tender age, Sumathipala together with his close-knit family of five sisters and brother, nurtured and grew the diverse business holdings of construction, trade, publications, media, sport, and financial services over a period of 28 years prior to stepping down from active business to pursue his personal passions – sport and politics.`,

  `A passionate Cricketer, and globally respected Sports Administrator, Sumathipala was elected and served numerous terms as the President of Sri Lanka Cricket, the President of the Asian Cricket Council, and as a Director of the International Cricket Council.`,
];

const firstParagraphs = biographyParagraphs.slice(0,2);
const remainingParagraphs = biographyParagraphs.slice(2);

const AboutBiography = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [swiper,setSwiper] = useState<SwiperType | null>(null);
  const [activeSlide,setActiveSlide] = useState(0);
  const [reducedMotion,setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(preference.matches);
    handleChange();
    preference.addEventListener('change',handleChange);
    return () => preference.removeEventListener('change',handleChange);
  },[]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !swiper || swiper.destroyed) return;

    if (reducedMotion) {
      swiper.autoplay.stop();
      swiper.slideToLoop(0,0);
      return;
    }

    let inView = false;
    const syncAutoplay = () => {
      if (swiper.destroyed) return;
      if (inView && !document.hidden) {
        if (!swiper.autoplay.running) swiper.autoplay.start();
      } else if (swiper.autoplay.running) {
        swiper.autoplay.stop();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      syncAutoplay();
    },{
      threshold:0.25,
      rootMargin:'-96px 0px 0px 0px',
    });
    observer.observe(swiper.el);
    document.addEventListener('visibilitychange',syncAutoplay);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange',syncAutoplay);
      if (!swiper.destroyed) swiper.autoplay.stop();
    };
  },[swiper,reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const title = section.querySelector<HTMLElement>('.about-biography-title');
    const titleLine = section.querySelector<HTMLElement>('.about-biography-title-line');
    const image = section.querySelector<HTMLElement>('.about-biography-carousel');
    const family = section.querySelector<HTMLElement>('.about-biography-family');
    const paragraphs = section.querySelectorAll<HTMLElement>('.about-biography-text p');

    const endLine = section.querySelector<HTMLElement>('.about-biography-end-line');

    if (reducedMotion) {
      if (title) title.style.opacity = '1';
      if (titleLine) titleLine.style.opacity = '1';
      if (image) image.style.opacity = '1';
      if (family) family.style.opacity = '1';
      if (endLine) endLine.style.opacity = '1';

      paragraphs.forEach((paragraph) => {
        paragraph.style.opacity = '1';
      });

      return () => {
        [title,titleLine,image,family,endLine,...paragraphs].forEach((element) => {
          element?.style.removeProperty('opacity');
        });
      };
    }

    let hasAnimated = false;
    const animations:ReturnType<typeof animate>[] = [];
    const runAnimation = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      if (title) {
        animations.push(animate(title,{
          opacity:[0,1],
          translateY:[32,0],
          duration:900,
          ease:'outExpo',
        }));
      }

      if (titleLine) {
        animations.push(animate(titleLine,{
          opacity:[0,1],
          scaleX:[0,1],
          duration:800,
          delay:180,
          ease:'outExpo',
        }));
      }

      if (image) {
        animations.push(animate(image,{
          opacity:[0,1],
          translateX:[-38,0],
          scale:[0.985,1],
          duration:1100,
          delay:220,
          ease:'outExpo',
        }));
      }

      if (family) {
        animations.push(animate(family,{
          opacity:[0,1],
          translateY:[24,0],
          duration:1000,
          delay:320,
          ease:'outExpo',
        }));
      }

      if (paragraphs.length) {
        animations.push(animate(paragraphs,{
          opacity:[0,1],
          translateY:[24,0],
          delay:stagger(110,{
            start:320,
          }),
          duration:800,
          ease:'outExpo',
        }));
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        runAnimation();
        observer.disconnect();
      },
      {
        threshold:0.12,
        rootMargin:'0px 0px -8% 0px',
      },
    );

    observer.observe(section);

    let endLineObserver: IntersectionObserver | null = null;
    if (endLine) {
      endLineObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          
          animations.push(animate(endLine, {
            opacity: [0, 1],
            scaleX: [0.015, 1],
            duration: 500,
            ease: 'linear',
          }));

          endLineObserver!.disconnect();
        },
        {
          threshold: 1.0,
          rootMargin: '0px 0px -10px 0px',
        }
      );
      endLineObserver.observe(endLine);
    }

    return () => {
      observer.disconnect();
      if (endLineObserver) {
        endLineObserver.disconnect();
      }
      animations.forEach((animation) => animation.revert());
    };
  },[reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="about-biography-section"
    >
      <div className="about-biography-container">
        <header className="about-biography-header">
          <h2 className="about-biography-title">
            Thilanga Sumathipala
          </h2>

          <span
            className="about-biography-title-line"
            aria-hidden="true"
          />
        </header>

        <div className="about-biography-content">
          <div className="about-biography-top">
            <figure
              className="about-biography-image-wrap about-biography-carousel"
              aria-label="Photographs of Thilanga Sumathipala"
            >
              <Swiper
                className="about-biography-swiper"
                modules={[Autoplay,EffectFade]}
                effect="fade"
                loop
                speed={reducedMotion ? 0 : 800}
                fadeEffect={{crossFade:true}}
                autoplay={reducedMotion ? false : {delay:4500,disableOnInteraction:false}}
                allowTouchMove={!reducedMotion}
                onSwiper={(instance) => {
                  instance.autoplay.stop();
                  setSwiper(instance);
                }}
                onSlideChange={(instance) => setActiveSlide(instance.realIndex)}
                aria-live="off"
              >
                {biographySlides.map((slide) => (
                  <SwiperSlide key={slide.image}>
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="about-biography-image"
                      width={1920}
                      height={900}
                      decoding="async"
                      draggable={false}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="about-biography-dots" aria-hidden="true">
                {biographySlides.map((slide,index) => (
                  <span key={slide.image} className={index === activeSlide ? 'is-active' : ''} />
                ))}
              </div>
            </figure>

            <div className="about-biography-text">
              {firstParagraphs.map((paragraph,index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="about-biography-bottom">
            <div className="about-biography-text">
              {remainingParagraphs.map((paragraph,index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <figure className="about-biography-image-wrap about-biography-family">
              <img
                src={imageAssets.about.family}
                alt="Thilanga Sumathipala with his wife Samadara and their three sons"
                className="about-biography-image"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>

          <span className="about-biography-end-line" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default AboutBiography;
