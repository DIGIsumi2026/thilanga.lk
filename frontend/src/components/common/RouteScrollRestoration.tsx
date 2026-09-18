import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_PREFIX = 'thilanga-scroll:';

export default function RouteScrollRestoration() {
  const location = useLocation();
  const isRestoringRef = useRef(false);
  const currentRouteKey = useRef(`${location.pathname}${location.search}`);
  const hasVisitedCurrentSession = useRef<Set<string>>(new Set());

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const routeKey = `${location.pathname}${location.search}`;
    const storageKey = `${STORAGE_PREFIX}${routeKey}`;

    // Read saved position
    const savedValue = sessionStorage.getItem(storageKey);
    const isFirstVisit = savedValue === null;

    let rafId: number;
    let observer: ResizeObserver | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    isRestoringRef.current = true;

    if (isFirstVisit) {
      // First visit -> Hero/Top
      const attemptRestoration = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (window.scrollY <= 5) {
          isRestoringRef.current = false;
        } else {
          rafId = requestAnimationFrame(attemptRestoration);
        }
      };
      attemptRestoration();

      timeoutId = setTimeout(() => {
        isRestoringRef.current = false;
        cancelAnimationFrame(rafId);
      }, 1500);
    } else {
      // Returning visit -> restore
      const targetY = Number(savedValue);

      const attemptRestoration = () => {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const safeTarget = Math.min(targetY, maxScroll);
        
        window.scrollTo({ top: safeTarget, left: 0, behavior: 'auto' });

        if (Math.abs(window.scrollY - targetY) <= 5 || window.scrollY >= maxScroll - 5) {
          isRestoringRef.current = false;
        } else {
          rafId = requestAnimationFrame(attemptRestoration);
        }
      };
      
      attemptRestoration();

      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => {
          if (isRestoringRef.current) {
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const safeTarget = Math.min(targetY, maxScroll);
            window.scrollTo({ top: safeTarget, left: 0, behavior: 'auto' });
            if (Math.abs(window.scrollY - targetY) <= 5 || window.scrollY >= maxScroll - 5) {
              isRestoringRef.current = false;
            }
          }
        });
        observer.observe(document.documentElement);
      }

      timeoutId = setTimeout(() => {
        isRestoringRef.current = false;
        if (observer) observer.disconnect();
        cancelAnimationFrame(rafId);
      }, 2500);
    }

    currentRouteKey.current = routeKey;

    return () => {
      // Cleanup runs when location changes.
      // Save route A's exact position before we restore route B.
      if (!isRestoringRef.current) {
        sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)));
      }
      
      if (observer) observer.disconnect();
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!isRestoringRef.current) {
            const storageKey = `${STORAGE_PREFIX}${currentRouteKey.current}`;
            sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handlePageHide = () => {
      if (!isRestoringRef.current) {
        const storageKey = `${STORAGE_PREFIX}${currentRouteKey.current}`;
        sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  return null;
}
