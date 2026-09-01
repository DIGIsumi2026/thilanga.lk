import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {imageAssets} from '../../assets/imageAssets';

export default function LeadershipQuote() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const quote = section.querySelector('.leadership-quote-text');
    const author = section.querySelector('.leadership-quote-author');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const timeline = gsap.timeline();

        timeline
          .fromTo(
            quote,
            {
              opacity:0,
              y:35,
            },
            {
              opacity:1,
              y:0,
              duration:1,
              ease:'power4.out',
            },
          )
          .fromTo(
            author,
            {
              opacity:0,
              y:15,
            },
            {
              opacity:1,
              y:0,
              duration:0.7,
              ease:'power3.out',
            },
            '-=0.4',
          );

        observer.disconnect();
      },
      {
        threshold:0.3,
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
      className="leadership-quote-section"
      style={{
        backgroundImage:`url(${imageAssets.home.quote.background})`,
      }}
    >
      <div className="leadership-quote-overlay" />

      <div className="leadership-quote-container">
        <blockquote className="leadership-quote-text">
          “The task of the leader is to get his people from where they are to where they have not been.”
        </blockquote>

        <p className="leadership-quote-author">
          <span />
          Thilanga Sumathipala
        </p>
      </div>
    </section>
  );
}