import {useEffect,useRef} from 'react';
import {animate,stagger} from 'animejs';
import {imageAssets} from '../../assets/imageAssets';

const biographyParagraphs = [
  `Thilanga Sumathipala, commenced his primary education at Nalanda College Colombo and in 1983 left to the United Kingdom for his higher studies at The London College of Printing in Photolithography, Graphic Reproduction and Printing Techniques. A printer by profession and an astute and respected entrepreneur, businessman, sports administrator and politician is an alumnae of the prestigious Harvard University (USA), where he enhanced his administrative skills by attending Harvard Business School in 2005 and John F Kennedy School of Government in 2006 and also received his Master’s in Public Administration from the University of Colombo.`,

  `Sumathipala was a member of the Parliament of Sri Lanka from 2010 to 2020, serving the Sri Lankan people as State Minister of Technology & Innovation [December 2019-March 2020] and as the Deputy Speaker of Parliament [2015-2018] as the Deputy Minister – Skills Development & Vocational Training [2015].`,

  `A dedicated family man, Sumathipala and his wife Samadara have three sons, Udhantha, Dulantha and Sajantha, all of who are following in their father’s footsteps as astute minded young professionals.`,

  `The son of late U W Sumathipala, doyen of the post-independence era business world and the world of Arts in Sri Lanka as a producer of world-class movies and Late Milina Sumathipala PhD, a pious Buddhist and philanthropist an addition to also being an astute and visionary business-woman, young and ambitious Sumathipala got his first taste of the corporate world in [1986] as a mere teen when his father’s untimely demise left the responsibilities of nurturing the families diversified business holdings on his shoulders.`,

  `Exhibiting the vision, acumen, pragmatism and dedication that have grown to be synonymous with his personal and professional personae even from that tender age, Sumathipala together with his close-knit family of five sisters and brother, nurtured and grew the diverse business holdings of construction, trade, publications, media, sport, and financial services over a period of 28 years prior to stepping down from active business to pursue his personal passions – sport and politics.`,

  `A passionate Cricketer, and globally respected Sports Administrator, Sumathipala was elected and served numerous terms as the President of Sri Lanka Cricket, the President of the Asian Cricket Council, and as a Director of the International Cricket Council.`,
];

const AboutBiography = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const title = section.querySelector<HTMLElement>('.about-biography-title');
    const titleLine = section.querySelector<HTMLElement>('.about-biography-title-line');
    const image = section.querySelector<HTMLElement>('.about-biography-image-wrap');
    const paragraphs = section.querySelectorAll<HTMLElement>('.about-biography-text p');

    const endLine = section.querySelector<HTMLElement>('.about-biography-end-line');

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      if (title) title.style.opacity = '1';
      if (titleLine) titleLine.style.opacity = '1';
      if (image) image.style.opacity = '1';
      if (endLine) endLine.style.opacity = '1';

      paragraphs.forEach((paragraph) => {
        paragraph.style.opacity = '1';
      });

      return;
    }

    const runAnimation = () => {
      if (hasAnimatedRef.current) return;

      hasAnimatedRef.current = true;

      if (title) {
        animate(title,{
          opacity:[0,1],
          translateY:[32,0],
          duration:900,
          ease:'outExpo',
        });
      }

      if (titleLine) {
        animate(titleLine,{
          opacity:[0,1],
          scaleX:[0,1],
          duration:800,
          delay:180,
          ease:'outExpo',
        });
      }

      if (image) {
        animate(image,{
          opacity:[0,1],
          translateX:[-38,0],
          scale:[0.985,1],
          duration:1100,
          delay:220,
          ease:'outExpo',
        });
      }

      if (paragraphs.length) {
        animate(paragraphs,{
          opacity:[0,1],
          translateY:[24,0],
          delay:stagger(110,{
            start:320,
          }),
          duration:800,
          ease:'outExpo',
        });
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
          
          animate(endLine, {
            opacity: [0, 1],
            scaleX: [0.015, 1],
            duration: 500,
            ease: 'linear',
          });

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
    };
  },[]);

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
          <figure className="about-biography-image-wrap">
            <img
              src={imageAssets.about.family}
              alt="Thilanga Sumathipala with his family"
              className="about-biography-image"
            />
          </figure>

          <div className="about-biography-text">
            {biographyParagraphs.map((paragraph,index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}

            <span
              className="about-biography-end-line"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBiography;