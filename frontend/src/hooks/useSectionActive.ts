import {useEffect,useState,type RefObject} from 'react';

type UseSectionActiveOptions = {
  threshold?:number;
  rootMargin?:string;
};

export default function useSectionActive(
  sectionRef:RefObject<Element | null>,
  {
    threshold = 0.3,
    rootMargin = '0px',
  }:UseSectionActiveOptions = {},
) {
  const [isIntersecting,setIsIntersecting] = useState(false);
  const [isPageVisible,setIsPageVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return;

    const observerThresholds = Array.from(
      {length:21},
      (_,index) => index / 20,
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
        const meaningfulHeight = Math.min(
          entry.boundingClientRect.height,
          viewportHeight,
        ) * threshold;

        setIsIntersecting(
          entry.isIntersecting &&
          entry.intersectionRect.height >= meaningfulHeight,
        );
      },
      {rootMargin,threshold:observerThresholds},
    );

    observer.observe(section);

    return () => observer.disconnect();
  },[rootMargin,sectionRef,threshold]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange',handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange',handleVisibilityChange);
    };
  },[]);

  return isIntersecting && isPageVisible;
}
