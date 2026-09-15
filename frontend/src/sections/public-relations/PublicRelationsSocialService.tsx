import {useLayoutEffect,useRef} from 'react';
import {animate,stagger} from 'animejs';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {imageAssets} from '../../assets/imageAssets';
import {animateYearCounter} from '../../utils/animateYearCounter';

gsap.registerPlugin(ScrollTrigger);

export default function PublicRelationsSocialService() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const kicker = section.querySelector<HTMLElement>(
      '.public-relations-social-kicker',
    );

    const heading = section.querySelector<HTMLElement>(
      '.public-relations-social-heading',
    );

    const paragraphs = section.querySelectorAll<HTMLElement>(
      '.public-relations-social-paragraph',
    );

    const milestone = section.querySelector<HTMLElement>(
      '.public-relations-social-milestone',
    );

    const yearElement = section.querySelector<HTMLElement>(
      '.public-relations-social-year',
    );

    if (reducedMotion) {
      [
        kicker,
        heading,
        milestone,
        ...Array.from(paragraphs),
      ].forEach((element) => {
        if (!element) return;

        element.style.opacity = '1';
        element.style.transform = 'none';
      });

      if (yearElement) {
        yearElement.textContent = '2004';
      }

      return;
    }

    const ctx = gsap.context(() => {
      if (kicker) {
        gsap.set(kicker,{
          autoAlpha:0,
          y:16,
        });
      }

      if (heading) {
        gsap.set(heading,{
          autoAlpha:0,
          y:34,
        });
      }

      if (milestone) {
        gsap.set(milestone,{
          autoAlpha:0,
          y:28,
          scale:0.975,
        });
      }

      ScrollTrigger.create({
        trigger:section,
        start:'top 76%',
        once:true,

        onEnter:() => {
          if (kicker) {
            gsap.to(kicker,{
              autoAlpha:1,
              y:0,
              duration:0.65,
              ease:'power3.out',
            });
          }

          if (heading) {
            gsap.to(heading,{
              autoAlpha:1,
              y:0,
              duration:0.95,
              delay:0.08,
              ease:'power3.out',
            });
          }

          animate(paragraphs,{
            opacity:[0,1],
            translateY:[28,0],
            scale:[0.985,1],
            delay:stagger(190,{start:240}),
            duration:900,
            ease:'outExpo',
          });

          if (milestone) {
            gsap.to(milestone,{
              autoAlpha:1,
              y:0,
              scale:1,
              duration:0.9,
              delay:0.62,
              ease:'power4.out',
              onStart: () => {
                if (yearElement) {
                  animateYearCounter({
                    element: yearElement,
                    from: 1980,
                    to: 2004,
                    duration: 2.3,
                  });
                }
              }
            });
          }
        },
      });
    },section);

    return () => {
      ctx.revert();
    };
  },[]);

  return (
    <section
      ref={sectionRef}
      className="public-relations-social"
      style={{
        backgroundImage:
          `url(${imageAssets.publicRelations.socialService.background})`,
      }}
    >
      <div className="public-relations-social-overlay" />

      <div className="public-relations-social-container">
        <div className="public-relations-social-content">
          <span className="public-relations-social-kicker">
            Compassion in Action
          </span>

          <h2 className="public-relations-social-heading">
            Social Service & Philanthropy
          </h2>

          <div className="public-relations-social-copy">
            <p className="public-relations-social-paragraph">
              Hailing from a family where the Buddhist precepts of
              brahmavihara loving kindness or benevolence
              (මෛත්‍රී/මෙත්තා), compassion (කරුණා), empathetic joy
              (මුදිතා) and equanimity (උපේක්ෂා/උපේක්ඛා) were and
              remain a way of life, Thilanga Sumathipala and his six
              siblings ideated, organized and supported the numerous
              philanthropic and social service efforts of the family,
              led by their mother. These included relief at both
              national and local scale, humanitarian assistance to
              those affected by the devastating 2004 Tsunami,
              donations in cash and kind to hospitals, donations of
              spectacles and wheelchairs to the elderly, building
              homes, providing scholarships and economically
              empowering women in impoverished families across the
              island.
            </p>

            <div className="public-relations-social-milestone">
              <span className="public-relations-social-year">
                2004
              </span>

              <div className="public-relations-social-milestone-copy">
                <h3>
                  Rebuilding lives after the Indian Ocean Tsunami
                </h3>

                <p className="public-relations-social-paragraph">
                  During his tenure as President of Sri Lanka Cricket,
                  Sumathipala spearheaded the formulation of Cricket Aid
                  to assist victims of the Indian Ocean Tsunami. Through
                  efforts conceptualized and led by him, the initiative
                  contributed towards relief for affected citizens by
                  building four villages equipped with homes, WaSH
                  facilities, schools and playgrounds, together with a
                  scholarship programme for students orphaned by the
                  disaster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}