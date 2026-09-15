import {useLayoutEffect,useRef} from 'react';
import {animate,stagger} from 'animejs';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

export default function PublicRelationsSocialService() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      section
        .querySelectorAll<HTMLElement>(
          '.public-relations-social-kicker, .public-relations-social-heading, .public-relations-social-paragraph, .public-relations-social-milestone',
        )
        .forEach((element) => {
          element.style.opacity = '1';
          element.style.transform = 'none';
        });
      return;
    }

    const ctx = gsap.context(() => {
      const kicker = section.querySelector<HTMLElement>('.public-relations-social-kicker');
      const heading = section.querySelector<HTMLElement>('.public-relations-social-heading');
      const paragraphs = section.querySelectorAll<HTMLElement>('.public-relations-social-paragraph');
      const milestone = section.querySelector<HTMLElement>('.public-relations-social-milestone');

      if (kicker) gsap.set(kicker, {autoAlpha: 0, y: 16});
      if (heading) gsap.set(heading, {autoAlpha: 0, y: 34});
      if (milestone) gsap.set(milestone, {autoAlpha: 0, y: 24, scale: 0.985});

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          if (kicker) {
            gsap.to(kicker, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
            });
          }

          if (heading) {
            gsap.to(heading, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              delay: 0.1,
              ease: 'power3.out',
            });
          }

          if (paragraphs.length) {
            animate(paragraphs,{
              opacity:[0,1],
              translateY:[28,0],
              scale:[0.985,1],
              delay:stagger(190,{start:240}),
              duration:900,
              ease:'outExpo',
            });
          }

          if (milestone) {
            gsap.to(milestone, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: 0.42,
              ease: 'power3.out',
            });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="public-relations-social"
      style={{
        backgroundImage: `url(${imageAssets.publicRelations.socialService.background})`,
      }}
    >
      <div className="public-relations-social-overlay" />

      <div className="public-relations-social-container">
        <div className="public-relations-social-content">
          <span className="public-relations-social-kicker">
            Social Service & Philanthropy
          </span>

          <h2 className="public-relations-social-heading">
            A Legacy of Giving
          </h2>

          <div className="public-relations-social-copy">
            <p className="public-relations-social-paragraph">
              Hailing from a family where the Buddhist precepts of brahmavihara — loving-kindness or benevolence (මෛත්‍රී/මෙත්තා), compassion (කරුණා), empathetic joy (මුදිතා) and equanimity (උපේක්ෂා/උපේක්ඛා) — were and are a way of life, Thilanga Sumathipala and his six siblings ideated, organized and supported the numerous philanthropic and social service efforts of the family led by their mother. These included relief at both national and local scale such as humanitarian assistance to those affected by the devastating 2004 Tsunami, donations in cash and kind to hospitals, donations of spectacles and wheelchairs to the elderly, building homes, providing scholarships and economically empowering women in impoverished families across the island.
            </p>

            <div className="public-relations-social-milestone">
              <span className="public-relations-social-year">2004</span>
              <div className="public-relations-social-milestone-copy">
                <span className="public-relations-social-milestone-label">Cricket Aid</span>
                <h3>Humanitarian Relief & Community Rebuilding</h3>
                <p className="public-relations-social-paragraph">
                  In 2004, during his tenure as President of Sri Lanka Cricket, Sumathipala spearheaded the formulation of Cricket Aid to assist victims of the Indian Ocean Tsunami. Through efforts conceptualized and led by him, the initiative was able to contribute towards the relief of tsunami-affected citizens of Sri Lanka through building four villages — fully equipped with homes, WaSH facilities, schools and playgrounds — as well as through a scholarship programme for students orphaned by the disaster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
