import {useLayoutEffect,useRef} from 'react';
import {animate,stagger} from 'animejs';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const parliamentaryRoles = [
  'Member of the SAARC Parliamentarians’ Association',
  'Member of the Inter-Parliamentary Union (IPU)',
  'Secretary, Australia–Sri Lanka Parliament Friendship Association',
  'Secretary, England–Sri Lanka Parliamentary Friendship Association',
  'President, German–Sri Lanka Parliament Friendship Association',
  'Director, Executive Board of Parliamentarians for Global Action (PGA)',
  'Deputy Convener for the Gender, Equality and Population Programme of Parliamentarians for Global Action (PGA)',
  'General Secretary of the Parliamentarians for Global Action (PGA) Sri Lanka Chapter',
];

export default function PoliticalParliament() {
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
          '.political-parliament-heading, .political-parliament-paragraph, .political-parliament-milestone, .political-parliament-role, .political-parliament-final',
        )
        .forEach((element) => {
          element.style.opacity = '1';
          element.style.transform = 'none';
        });

      return;
    }

    const ctx = gsap.context(() => {
      const heading = section.querySelector<HTMLElement>(
        '.political-parliament-heading',
      );

      const paragraphs = section.querySelectorAll<HTMLElement>(
        '.political-parliament-paragraph',
      );

      const milestone = section.querySelector<HTMLElement>(
        '.political-parliament-milestone',
      );

      const roles = section.querySelectorAll<HTMLElement>(
        '.political-parliament-role',
      );

      const finalParagraph = section.querySelector<HTMLElement>(
        '.political-parliament-final',
      );

      if (heading) {
        gsap.set(heading,{
          autoAlpha:0,
          y:34,
        });
      }

      gsap.set(milestone,{
        autoAlpha:0,
        y:24,
        scale:0.985,
      });

      gsap.set(roles,{
        autoAlpha:0,
        y:18,
      });

      gsap.set(finalParagraph,{
        autoAlpha:0,
        y:22,
      });

      ScrollTrigger.create({
        trigger:section,
        start:'top 76%',
        once:true,
        onEnter:() => {
          if (heading) {
            gsap.to(heading,{
              autoAlpha:1,
              y:0,
              duration:0.9,
              ease:'power3.out',
            });
          }

          animate(paragraphs,{
            opacity:[0,1],
            translateY:[22,0],
            scale:[0.99,1],
            delay:stagger(140,{start:180}),
            duration:820,
            ease:'outExpo',
          });

          gsap.to(milestone,{
            autoAlpha:1,
            y:0,
            scale:1,
            duration:0.8,
            delay:0.42,
            ease:'power3.out',
          });

          gsap.to(roles,{
            autoAlpha:1,
            y:0,
            duration:0.65,
            stagger:0.075,
            delay:0.58,
            ease:'power3.out',
          });

          gsap.to(finalParagraph,{
            autoAlpha:1,
            y:0,
            duration:0.8,
            delay:0.85,
            ease:'power3.out',
          });
        },
      });
    },section);

    return () => ctx.revert();
  },[]);

  return (
    <section
      ref={sectionRef}
      className="political-parliament-section"
      style={{
        backgroundImage:`url(${imageAssets.political.parliament.background})`,
      }}
    >
      <div className="political-parliament-overlay" />

      <div className="political-parliament-container">
        <div className="political-parliament-content">
          <header className="political-parliament-heading">
            <span className="political-parliament-kicker">
              Parliamentary Service
            </span>

            <h2>
              Parliamentary Leadership
              <br />
              & Public Service
            </h2>
          </header>

          <div className="political-parliament-body">
            <p className="political-parliament-paragraph">
              Following a deep-rooted desire to serve, shaped in part by the
              values of philanthropy and public service instilled by his mother,
              Thilanga Sumathipala entered politics in 2008. In 2009, he was
              appointed Chief Organizer of the Sri Lanka Freedom Party for the
              Borella electorate, a key constituency in the capital, and was
              elected to the Western Provincial Council that same year.
            </p>

            <div className="political-parliament-milestone">
              <span className="political-parliament-year">
                2010
              </span>

              <div>
                <strong>
                  Elected to the Parliament of Sri Lanka
                </strong>

                <p>
                  Sumathipala entered Parliament in 2010 and served in the
                  government of President Mahinda Rajapaksa as Deputy Minister
                  of Skills Development & Vocational Training.
                </p>
              </div>
            </div>

            <div className="political-parliament-roles">
              <div className="political-parliament-roles-heading">
                <span>Parliamentary & International Roles</span>
                <i />
              </div>

              <ul>
                {parliamentaryRoles.map((role) => (
                  <li
                    key={role}
                    className="political-parliament-role"
                  >
                    <span className="political-parliament-role-marker" />
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="political-parliament-final">
              In 2015, Hon. Thilanga Sumathipala returned to Parliament through
              the National List during the administration of President
              Maithripala Sirisena and served as Deputy Speaker of Parliament
              from 2015 to 2018.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}