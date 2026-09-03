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

    const title = section.querySelector<HTMLElement>('.corporate-chairman-title');
    const chairmanSpan = title?.querySelector<HTMLElement>('span');
    const bar = section.querySelector<HTMLElement>('.corporate-chairman-bar');
    const line = section.querySelector<HTMLElement>('.corporate-chairman-line');
    const paragraphs = section.querySelectorAll<HTMLElement>('.corporate-chairman-text p');

    const updateBarWidth = () => {
      if (chairmanSpan && bar) {
        const rect = chairmanSpan.getBoundingClientRect();
        if (rect.width > 0) {
          bar.style.width = `${Math.round(rect.width)}px`;
        }
      }
    };

    updateBarWidth();
    if (document.fonts) {
      document.fonts.ready.then(updateBarWidth);
    }
    window.addEventListener('resize', updateBarWidth);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && chairmanSpan) {
      resizeObserver = new ResizeObserver(() => {
        updateBarWidth();
      });
      resizeObserver.observe(chairmanSpan);
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const makeVisible = () => {
      if (title) title.style.opacity = '1';
      if (bar) bar.style.opacity = '1';
      if (line) {
        line.style.transform = 'scaleX(1)';
      }

      paragraphs.forEach((paragraph) => {
        paragraph.style.opacity = '1';
      });
    };

    if (reducedMotion) {
      makeVisible();
      return () => {
        window.removeEventListener('resize', updateBarWidth);
        if (resizeObserver) resizeObserver.disconnect();
      };
    }

    const runAnimation = () => {
      if (animatedRef.current) return;

      animatedRef.current = true;

      if (title) {
        animate(title,{
          opacity:[0,1],
          translateY:[34,0],
          duration:900,
          delay:100,
          ease:'outExpo',
        });
      }

      if (bar) {
        animate(bar, {
          opacity: [0, 1],
          duration: 350,
          delay: 200,
          ease: 'outQuad',
        });
      }

      if (line) {
        animate(line,{
          scaleX:[0,1],
          duration:1100,
          delay:350,
          ease:'outCubic',
        });
      }

      if (paragraphs.length) {
        animate(paragraphs,{
          opacity:[0,1],
          translateY:[30,0],
          delay:stagger(220,{
            start:450,
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
        threshold:0.1,
        rootMargin:'0px 0px -40px 0px',
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBarWidth);
      if (resizeObserver) resizeObserver.disconnect();
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
          <h2 className="corporate-chairman-title">
            Thilanga Sumathipala
            <span>Chairman</span>
          </h2>

          <div
            className="corporate-chairman-bar"
            aria-hidden="true"
          >
            <span className="corporate-chairman-line" />
          </div>

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