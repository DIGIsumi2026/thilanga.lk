import {useEffect,useRef,useState} from 'react';
import {animate} from 'animejs';
import {imageAssets} from '../../assets/imageAssets';
import {videoAssets} from '../../assets/videoAssets';

const DESKTOP_BREAKPOINT = 900;

const CorporateHero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const thumbnailRef = useRef<HTMLImageElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);

  const [isDesktop,setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth > DESKTOP_BREAKPOINT,
  );

  const [videoEnded,setVideoEnded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > DESKTOP_BREAKPOINT;

      setIsDesktop(desktop);

      if (!desktop) {
        setVideoEnded(true);
      }
    };

    handleResize();

    window.addEventListener('resize',handleResize);

    return () => {
      window.removeEventListener('resize',handleResize);
    };
  },[]);

  useEffect(() => {
    const quote = quoteRef.current;

    if (!quote) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!isDesktop || reducedMotion) {
      quote.style.opacity = '1';
      quote.style.transform = 'translateX(0)';
      return;
    }

    quote.style.opacity = '1';

    const quoteAnimation = animate(quote,{
      translateX:['115%',0],
      duration:6000,
      ease:'linear',
    });

    return () => {
      quoteAnimation.pause();
    };
  },[isDesktop]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isDesktop) return;

    setVideoEnded(false);

    video.currentTime = 0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn('Corporate hero autoplay was prevented:',error);

        setVideoEnded(true);
      }
    };

    playVideo();

    return () => {
      video.pause();
    };
  },[isDesktop]);

  const handleVideoEnded = () => {
    const video = videoRef.current;
    const thumbnail = thumbnailRef.current;

    setVideoEnded(true);

    if (thumbnail) {
      animate(thumbnail,{
        opacity:[0,1],
        scale:[1.015,1],
        duration:1000,
        ease:'outExpo',
      });
    }

    if (video) {
      animate(video,{
        opacity:[1,0],
        duration:700,
        ease:'outQuad',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="corporate-hero"
    >
      <div className="corporate-hero-media">
        <img
          ref={thumbnailRef}
          src={imageAssets.corporate.hero.thumbnail}
          alt="Thilanga Sumathipala corporate leadership"
          className={`corporate-hero-thumbnail ${
            !isDesktop || videoEnded ? 'is-visible' : ''
          }`}
        />

        {isDesktop && (
          <video
            ref={videoRef}
            className={`corporate-hero-video ${
              videoEnded ? 'is-ended' : ''
            }`}
            src={videoAssets.corporate.hero}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
          />
        )}

        <div className="corporate-hero-overlay" />

        <div
          ref={quoteRef}
          className="corporate-hero-quote"
        >
          <span className="corporate-hero-quote-line" />

          <p>
            Strategic vision. Entrepreneurial thinking.
            Leadership that builds lasting value.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CorporateHero;