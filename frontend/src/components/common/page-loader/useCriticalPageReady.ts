import { useEffect, useState, useRef } from 'react';

export function useCriticalPageReady() {
  const [isReady, setIsReady] = useState(false);
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const checkCriticalAssets = async () => {
      const promises: Promise<any>[] = [];

      // 1. Document fonts
      if (document.fonts && document.fonts.ready) {
        promises.push(document.fonts.ready);
      }

      // 2. Critical images (either marked with data-page-critical or hero classes)
      const images = Array.from(document.querySelectorAll('img')).filter(
        (img) => 
          img.hasAttribute('data-page-critical') || 
          img.closest('.corporate-hero-media') ||
          img.closest('.political-hero-media') ||
          img.closest('.public-relations-hero-media') ||
          img.closest('.about-intro-media') ||
          img.closest('.hero-image-wrapper')
      );

      images.forEach((img) => {
        if (!img.complete) {
          promises.push(
            new Promise<void>((resolve) => {
              const handleLoad = () => resolve();
              const handleError = () => resolve();
              img.addEventListener('load', handleLoad, { once: true });
              img.addEventListener('error', handleError, { once: true });
            })
          );
        } else if (img.decode) {
          promises.push(img.decode().catch(() => {}));
        }
      });

      // 3. Critical videos (Corporate/Political heroes)
      const videos = Array.from(document.querySelectorAll('video')).filter(
        (vid) => vid.closest('.corporate-hero-media') || vid.closest('.political-hero-media') || vid.hasAttribute('data-page-critical')
      );

      videos.forEach((video) => {
        if (video.readyState < 3) { // HAVE_FUTURE_DATA
          promises.push(
            new Promise<void>((resolve) => {
              const handleLoad = () => resolve();
              const handleError = () => resolve();
              video.addEventListener('canplay', handleLoad, { once: true });
              video.addEventListener('error', handleError, { once: true });
            })
          );
        }
      });

      try {
        await Promise.race([
          Promise.all(promises),
          new Promise((resolve) => setTimeout(resolve, 1800)) // Max wait 1.8s
        ]);
      } catch (e) {
        console.error(e);
      }

      setIsReady(true);
    };

    checkCriticalAssets();
  }, []);

  return isReady;
}
