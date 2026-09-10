import {useLayoutEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {animate,stagger} from 'animejs';
import {imageAssets} from '../../assets/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const cricketLegacyBlocks = [
  {
    id:'cricket-legacy-01',
    image:imageAssets.corporate.cricketLegacy.leadership,
    alt:'Thilanga Sumathipala at a Sri Lanka Cricket press event',
    paragraphs:[
      'His eye for innovation has also led him to serve in the capacity of President, Director, and Member of many esteemed institutes and organizations such as the International Cricket Council (ICC), the Asian Cricket Council (ACC), and the Board of Control for Cricket in Sri Lanka.',
      'As President of Sri Lanka Cricket, his leadership led to the completion of the Rangiri Dambulla International Cricket Stadium in just 167 days, reflecting a rare combination of vision, execution, and administrative strength.',
    ],
  },
  {
    id:'cricket-legacy-02',
    image:imageAssets.corporate.cricketLegacy.playing,
    alt:'Thilanga Sumathipala playing cricket',
    paragraphs:[
      'He later re-structured and headed the re-launch of the BCCSL’s new logo and the name change to “Sri Lanka Cricket” in 2004, helping define a stronger and more contemporary identity for the institution.',
      'Beyond cricket, he has also held honourable positions at the International Advertising Association (IAA), the Newspaper Society of Sri Lanka, INCA-FIEJ Research Association (IFRA) India, and the Asian Mass Communication Research & Information Centre (AMIC).',
    ],
  },
];

export default function CricketLegacy() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.cricket-legacy-row');

      rows.forEach((row) => {
        const copy = row.querySelector<HTMLElement>('.cricket-legacy-copy');
        const media = row.querySelector<HTMLElement>('.cricket-legacy-media');
        const heading = row.querySelector<HTMLElement>('.cricket-legacy-copy h3');
        const paragraphs = row.querySelectorAll<HTMLElement>('.cricket-legacy-copy-body p');

        gsap.set([copy,media], {autoAlpha:0,y:48});
        gsap.set(heading, {autoAlpha:0,y:20});
        gsap.set(paragraphs, {opacity:0,transform:'translateY(18px)'});

        ScrollTrigger.create({
          trigger: row,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(copy, {
              autoAlpha: 1,
              y: 0,
              duration: 0.95,
              ease: 'power3.out',
            });

            gsap.to(media, {
              autoAlpha: 1,
              y: 0,
              duration: 0.95,
              delay: 0.14,
              ease: 'power3.out',
            });

            gsap.to(heading, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              delay: 0.2,
              ease: 'power3.out',
            });

            animate(paragraphs, {
              opacity: [0,1],
              translateY: [18,0],
              delay: stagger(140,{start:320}),
              duration: 800,
              ease: 'out(3)',
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cricket-legacy-section"
    >
      <div className="cricket-legacy-container">
        <div className="cricket-legacy-heading">
          <span className="cricket-legacy-kicker">SPORTS LEADERSHIP</span>
          <h2>A Legacy in Sri Lankan Cricket</h2>
        </div>

        <div className="cricket-legacy-list">
          {cricketLegacyBlocks.map((block,index) => (
            <article
              key={block.id}
              className="cricket-legacy-row"
            >
              <div className="cricket-legacy-copy">
                <span className="cricket-legacy-step">
                  {String(index + 1).padStart(2,'0')}
                </span>

                <h3>
                  {index === 0
                    ? 'Leadership, governance and execution'
                    : 'Identity, reform and wider institutional impact'}
                </h3>

                <div className="cricket-legacy-copy-body">
                  {block.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="cricket-legacy-media">
                <img
                  src={block.image}
                  alt={block.alt}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}