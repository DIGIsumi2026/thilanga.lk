import {useEffect,useRef} from 'react';
import {animate,stagger} from 'animejs';
import {imageAssets} from '../../assets/imageAssets';

const biographyParagraphs = [
  `Thilanga Sumathipala began his education at Nalanda College, Colombo, before travelling to the United Kingdom in 1983 to pursue further studies in Photolithography, Graphic Reproduction and Printing Techniques at the London College of Printing. A printer by profession, he later broadened his knowledge of management and public administration through programmes at Harvard Business School in 2005 and the John F. Kennedy School of Government in 2006. He also completed postgraduate studies in Public Administration at the University of Colombo.`,

  `Sumathipala served as a Member of the Parliament of Sri Lanka from 2010 to 2020. During his parliamentary career, he served as Deputy Minister of Skills Development and Vocational Training in 2015, Deputy Speaker and Chair of Committees from 2015 to 2018, and State Minister of Technology and Innovations from 2019 to 2020.`,

  `A dedicated family man, Sumathipala and his wife Samadara have three sons, Udhantha, Dulantha and Sajantha, all of whom are following in their father’s footsteps as astute minded young professionals.`,

  `Following the death of his father, U. W. Sumathipala, Thilanga Sumathipala became involved in the family businesses at a young age. Working alongside his siblings, he contributed to the development of business interests spanning construction, trade, publishing, media, sports and financial services.`,

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