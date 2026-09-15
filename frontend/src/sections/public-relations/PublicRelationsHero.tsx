import {useEffect,useRef} from 'react';
import {animate} from 'animejs';
import {imageAssets} from '../../assets/imageAssets';
import {usePageLoad} from '../../components/common/page-loader/PageLoadContext';

const DESKTOP_BREAKPOINT = 900;

export default function PublicRelationsHero() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const { isLoaderComplete } = usePageLoad();

  useEffect(() => {
    const image = imageRef.current;
    const quote = quoteRef.current;

    if (!image || !quote || !isLoaderComplete) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT;

    if (reducedMotion) {
      image.style.transform = 'scale(1)';
      quote.style.opacity = '1';
      quote.style.transform = 'translateX(0)';
      return;
    }

    const imageAnimation = animate(image,{
      scale:[1,1.035],
      duration:7000,
      ease:'linear',
    });

    if (!isDesktop) {
      quote.style.opacity = '1';
      quote.style.transform = 'translateX(0)';

      return () => {
        imageAnimation.pause();
      };
    }

    quote.style.opacity = '1';

    const quoteAnimation = animate(quote,{
      translateX:['115%',0],
      duration:6000,
      ease:'linear',
    });

    return () => {
      imageAnimation.pause();
      quoteAnimation.pause();
    };
  },[isLoaderComplete]);

  return (
    <section className="public-relations-hero">
      <div className="public-relations-hero-media">
        <img
          ref={imageRef}
          src={imageAssets.publicRelations.hero.image}
          alt="Thilanga Sumathipala public relations, social service and community engagement"
          className="public-relations-hero-image"
        />

        <div className="public-relations-hero-overlay" />

        <div
          ref={quoteRef}
          className="public-relations-hero-quote"
        >
          <span className="public-relations-hero-quote-line" />

          <p>
            Leadership finds its highest purpose in service,
            turning compassion into meaningful action for
            people and communities.
          </p>
        </div>
      </div>
    </section>
  );
}