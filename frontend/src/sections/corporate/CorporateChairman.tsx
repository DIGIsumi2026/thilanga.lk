import {useEffect,useRef} from 'react';
import {animate,stagger} from 'animejs';
import {imageAssets} from '../../assets/imageAssets';

const chairmanParagraphs = [
  `Thilanga Sumathipala is the Chairman of Sumathi Universal Management and Investment (Pvt) Ltd, Sumathi Ventures (Pvt) Ltd and Asia Capital PLC. A business professional known for his strategic vision and unwavering passion, he began his career as an active member of the Sumathipala family business, being a Co-Founder of the Sumathi Group of Companies. Renowned for his entrepreneurial thinking, he currently leads a variety of companies ranging from Printing, Hospitality, Commerce, Energy, and Technology & Entertainment to Leisure. Mr. Sumathipala has also been instrumental in making "Sumathi Awards" a monumental landmark in the calendar of the country, by conceptualizing and spearheading the National Awards ceremony since its' inception in 1995.`,

  `Mr. Sumathipala is a professional printer qualified in Photolithography and Graphic Reproduction from the London College of Printing, UK. After completing his higher education, he attended the Yokohama University (The Association for Overseas Technical Scholarship of Japan) to improve his entrepreneurial skills in 1996. With this exposure, he drafted the blueprint for the partnership between the media, advertising agencies and advertisers in Sri Lanka by acting as the President of the International Advertising Association (IAA). He is also a Founder Director of the Ingrin Institute of Printing & Graphics-a centre of excellence in the printing and graphics industry of Sri Lanka that has helped innumerable students to obtain professional Diplomas to pursue a career in Printing.`,
];

export default function CorporateChairman() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const kicker = section.querySelector<HTMLElement>('.corporate-chairman-kicker');
    const title = section.querySelector<HTMLElement>('.corporate-chairman-title');
    const line = section.querySelector<HTMLElement>('.corporate-chairman-line');
    const paragraphs = section.querySelectorAll<HTMLElement>('.corporate-chairman-text p');

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const makeVisible = () => {
      if (kicker) kicker.style.opacity = '1';
      if (title) title.style.opacity = '1';
      if (line) line.style.opacity = '1';

      paragraphs.forEach((paragraph) => {
        paragraph.style.opacity = '1';
      });
    };

    if (reducedMotion) {
      makeVisible();
      return;
    }

    const runAnimation = () => {
      if (animatedRef.current) return;

      animatedRef.current = true;

      if (kicker) {
        animate(kicker,{
          opacity:[0,1],
          translateY:[18,0],
          duration:650,
          ease:'outExpo',
        });
      }

      if (title) {
        animate(title,{
          opacity:[0,1],
          translateY:[34,0],
          duration:900,
          delay:100,
          ease:'outExpo',
        });
      }

      if (line) {
        animate(line,{
          opacity:[0,1],
          scaleX:[0,1],
          duration:750,
          delay:220,
          ease:'outExpo',
        });
      }

      if (paragraphs.length) {
        animate(paragraphs,{
          opacity:[0,1],
          translateY:[30,0],
          delay:stagger(220,{
            start:320,
          }),
          duration:950,
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
        threshold:0.15,
        rootMargin:'0px 0px -8% 0px',
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  },[]);

  return (
    <section
      ref={sectionRef}
      className="corporate-chairman"
      style={{
        backgroundImage:`url(${imageAssets.corporate.chairman.background})`,
      }}
    >
      <div className="corporate-chairman-overlay" />

      <div className="corporate-chairman-container">
        <div className="corporate-chairman-content">
          <span className="corporate-chairman-kicker">
            Corporate Leadership
          </span>

          <h2 className="corporate-chairman-title">
            Thilanga Sumathipala
            <span>The Chairman</span>
          </h2>

          <span
            className="corporate-chairman-line"
            aria-hidden="true"
          />

          <div className="corporate-chairman-text">
            {chairmanParagraphs.map((paragraph,index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}