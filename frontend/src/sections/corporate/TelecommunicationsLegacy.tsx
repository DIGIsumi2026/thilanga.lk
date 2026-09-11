import {useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {animate,stagger} from 'animejs';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const telecomBlocks = [
  {
    id:'telecom-01',
    title:'Transforming Sri Lanka Telecom',
    image:imageAssets.corporate.telecommunications.portrait,
    alt:'Thilanga Sumathipala during his corporate leadership period',
    paragraphs:[
      'During his tenure as Chairman of Sri Lanka Telecom, Thilanga Sumathipala was associated with a period of significant transformation in the country’s telecommunications sector. His leadership coincided with Sri Lanka Telecom strengthening its position as a major national communications provider, entering the public capital market, and expanding its strategic interests beyond fixed-line services. The 2002 Initial Public Offering of a further stake in SLT marked an important milestone in the company’s evolution, while stronger financial performance during the period reflected the organisation’s growing scale and commercial reach.',
    ],
  },
  {
    id:'telecom-02',
    title:'Expanding Mobile Connectivity & Investment',
    image:imageAssets.corporate.telecommunications.sltMobitel,
    alt:'SLT-Mobitel telecommunications services',
    paragraphs:[
      'A major development during this period was Sri Lanka Telecom’s acquisition of the remaining stake in Mobitel, making the mobile operator a wholly owned subsidiary in 2002. This helped position SLT as a more integrated telecommunications group, combining fixed-line, data and mobile services under a broader strategic vision. The period also saw Mobitel begin its transition from legacy mobile technologies toward a modern GSM platform, laying the foundation for the launch of its GSM and EDGE-enabled network in 2004.',
      'Sumathipala’s chairmanship also coincided with efforts to strengthen SLT’s access to international capital and support its long-term expansion. Preparations for a US$100 million international bond issue were initiated during this period, with the transaction later completed in 2004 and becoming an important milestone in Sri Lanka’s corporate capital-market history. Together, these developments represent a period of modernization, investment and institutional growth for both Sri Lanka Telecom and Mobitel.',
    ],
  },
];

export default function TelecommunicationsLegacy() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(
        '.telecom-legacy-row',
      );

      rows.forEach((row) => {
        const copy = row.querySelector<HTMLElement>(
          '.telecom-legacy-copy',
        );

        const media = row.querySelector<HTMLElement>(
          '.telecom-legacy-media',
        );

        const heading = row.querySelector<HTMLElement>(
          '.telecom-legacy-copy h3',
        );

        const paragraphs = row.querySelectorAll<HTMLElement>(
          '.telecom-legacy-copy-body p',
        );

        gsap.set([copy,media],{
          autoAlpha:0,
          y:45,
        });

        if (heading) {
          gsap.set(heading,{
            autoAlpha:0,
            y:18,
          });
        }

        gsap.set(paragraphs,{
          opacity:0,
          y:16,
        });

        ScrollTrigger.create({
          trigger:row,
          start:'top 82%',
          once:true,
          onEnter:() => {
            gsap.to(copy,{
              autoAlpha:1,
              y:0,
              duration:0.9,
              ease:'power3.out',
            });

            gsap.to(media,{
              autoAlpha:1,
              y:0,
              duration:0.9,
              delay:0.12,
              ease:'power3.out',
            });

            if (heading) {
              gsap.to(heading,{
                autoAlpha:1,
                y:0,
                duration:0.7,
                delay:0.18,
                ease:'power3.out',
              });
            }

            animate(paragraphs,{
              opacity:[0,1],
              translateY:[16,0],
              delay:stagger(140,{
                start:280,
              }),
              duration:780,
              ease:'outExpo',
            });
          },
        });
      });
    },sectionRef);

    return () => ctx.revert();
  },[]);

  return (
    <section
      ref={sectionRef}
      className="telecom-legacy-section"
    >
      <div className="telecom-legacy-container">
        <header className="telecom-legacy-heading">
          <span className="telecom-legacy-kicker">
            Corporate & Digital Transformation
          </span>

          <h2>
            Leadership in Telecommunications
          </h2>
        </header>

        <div className="telecom-legacy-list">
          {telecomBlocks.map((block,index) => (
            <article
              key={block.id}
              className={`telecom-legacy-row telecom-legacy-row-${index + 1}`}
            >
              {index === 0 ? (
                <>
                  <div className="telecom-legacy-copy">
                    <div>
                      <h3>{block.title}</h3>

                      <div className="telecom-legacy-copy-body">
                        {block.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="telecom-legacy-media">
                    <img
                      src={block.image}
                      alt={block.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="telecom-legacy-media">
                    <img
                      src={block.image}
                      alt={block.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="telecom-legacy-copy">
                    <div>
                      <h3>{block.title}</h3>

                      <div className="telecom-legacy-copy-body">
                        {block.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}