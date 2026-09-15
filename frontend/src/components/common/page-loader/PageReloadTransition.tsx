import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageLoad } from './PageLoadContext';
import { useCriticalPageReady } from './useCriticalPageReady';
import { pageLoaderTargets } from './pageLoaderTargets';
import './PageReloadTransition.css';

type SkeletonTarget = {
  selector: string;
  key: string;
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: string;
};

export function PageReloadTransition({ children }: { children: React.ReactNode }) {
  const { setPageReady, setLoaderComplete } = usePageLoad();
  const location = useLocation();
  
  // Track if we've already done the initial hard load
  const hasRunLoader = useRef(false);
  
  // Only trigger on first mount or actual hard refresh.
  // Because this component wraps the whole app, it only mounts once.
  const isInitialLoad = !hasRunLoader.current;
  
  const isCriticalReady = useCriticalPageReady();
  
  const [phase, setPhase] = useState<'measuring' | 'loading' | 'revealing' | 'complete'>(
    isInitialLoad ? 'measuring' : 'complete'
  );
  
  const [targets, setTargets] = useState<SkeletonTarget[]>([]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const startTime = useRef<number>(Date.now());
  const measurementRaf = useRef<number | null>(null);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const measureTargets = () => {
    const routeTargets = pageLoaderTargets[location.pathname] || pageLoaderTargets['/'] || [];
    const newTargets: SkeletonTarget[] = [];

    // On mobile we limit to 4-5 targets, desktop is fine
    const isMobile = window.innerWidth <= 700;
    const maxTargets = isMobile ? 5 : 10;
    let added = 0;

    routeTargets.forEach((selector, index) => {
      if (added >= maxTargets) return;
      
      const el = document.querySelector(selector);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      
      // Ignore invisible or out of bounds (far below fold)
      if (rect.width <= 0 || rect.height <= 0 || rect.top > window.innerHeight * 1.35) {
        return;
      }

      const style = window.getComputedStyle(el);

      newTargets.push({
        selector,
        key: `${selector}-${index}`,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: style.borderRadius,
      });
      added++;
    });

    // Fallback if none found
    if (newTargets.length === 0) {
      console.warn(`Page loader targets not found for route ${location.pathname}`);
    }

    setTargets(newTargets);
  };

  useEffect(() => {
    if (phase !== 'measuring' && phase !== 'loading') return;

    const requestMeasure = () => {
      if (measurementRaf.current) cancelAnimationFrame(measurementRaf.current);
      measurementRaf.current = requestAnimationFrame(measureTargets);
    };

    // Measure initially
    requestMeasure();

    if (phase === 'measuring') {
      setPhase('loading');
    }

    window.addEventListener('resize', requestMeasure);
    
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(requestMeasure);
      observer.observe(document.body);
    }

    return () => {
      window.removeEventListener('resize', requestMeasure);
      if (observer) observer.disconnect();
      if (measurementRaf.current) cancelAnimationFrame(measurementRaf.current);
    };
  }, [phase, location.pathname]);

  useEffect(() => {
    if (phase === 'loading' && isCriticalReady) {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, 450 - elapsed); // Ensure min 450ms

      const timer = setTimeout(() => {
        setPhase('revealing');
        setPageReady(true);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [phase, isCriticalReady, setPageReady]);

  useEffect(() => {
    if (phase === 'revealing') {
      // Small timeout to allow the transition to play out
      const timer = setTimeout(() => {
        setPhase('complete');
        setLoaderComplete(true);
        hasRunLoader.current = true;
        
        // Refresh GSAP ScrollTrigger if exists
        if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
          ScrollTrigger.refresh();
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [phase, setLoaderComplete]);
  
  // Body interaction block
  useEffect(() => {
    if (phase !== 'complete') {
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.pointerEvents = '';
    }
    return () => {
      document.body.style.pointerEvents = '';
    };
  }, [phase]);

  if (phase === 'complete') {
    return <>{children}</>;
  }

  return (
    <>
      <div 
        className={`page-reload-content ${phase === 'measuring' || phase === 'loading' ? 'is-loading' : 'is-ready'}`}
        aria-hidden={true}
      >
        {children}
      </div>

      <AnimatePresence>
        {(phase === 'measuring' || phase === 'loading' || phase === 'revealing') && (
          <motion.div
            className="page-reload-overlay"
            role="status"
            aria-live="polite"
            aria-label="Loading page"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, delay: isReducedMotion ? 0 : 0.2 }}
          >
            {targets.map((target, index) => (
              <motion.div
                key={target.key}
                className={`page-reload-skeleton ${phase === 'revealing' ? 'is-revealing' : ''}`}
                initial={{ opacity: 0, scale: isReducedMotion ? 1 : 0.985 }}
                animate={{ 
                  opacity: phase === 'revealing' ? 0 : 1, 
                  scale: phase === 'revealing' && !isReducedMotion ? 0.985 : 1 
                }}
                transition={{
                  duration: phase === 'revealing' ? 0.45 : 0.35,
                  delay: index * 0.035,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  top: target.top,
                  left: target.left,
                  width: target.width,
                  height: target.height,
                  borderRadius: target.borderRadius,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
