import { useEffect, useState, useRef, useCallback } from 'react';
import '../../styles/custom-scrollbar.css';

export default function CustomScrollbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPC, setIsPC] = useState(true);

  const hideTimeoutRef = useRef<number | null>(null);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);

  // Check if PC view
  useEffect(() => {
    const checkPC = () => {
      setIsPC(window.innerWidth > 900);
    };
    checkPC();
    window.addEventListener('resize', checkPC);
    return () => window.removeEventListener('resize', checkPC);
  }, []);

  const calculateThumbHeight = useCallback(() => {
    if (!isPC) return;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (documentHeight <= windowHeight) {
       setThumbHeight(0);
       return;
    }
    const height = Math.max((windowHeight / documentHeight) * (windowHeight - 8), 50);
    setThumbHeight(height);
  }, [isPC]);

  const handleScroll = useCallback(() => {
    if (!isPC) return;
    
    if (!isDragging) {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(maxScroll > 0 ? currentScroll / maxScroll : 0);
    }

    setIsVisible(true);
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      if (!isDragging) {
         setIsVisible(false);
      }
    }, 1200);
  }, [isPC, isDragging]);

  useEffect(() => {
    if (!isPC) return;
    
    calculateThumbHeight();
    // Using a ResizeObserver on body is safer to catch content changes
    const resizeObserver = new ResizeObserver(() => {
        calculateThumbHeight();
    });
    resizeObserver.observe(document.body);

    window.addEventListener('resize', calculateThumbHeight);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateThumbHeight);
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    };
  }, [isPC, calculateThumbHeight, handleScroll]);

  // Dragging logic
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isPC) return;
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startScrollTopRef.current = window.scrollY;
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isPC) return;
    
    if (!isDragging) {
      document.body.style.userSelect = '';
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => {
         setIsVisible(false);
      }, 1200);
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      const deltaY = e.clientY - startYRef.current;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollableHeight = documentHeight - windowHeight;
      const trackScrollableHeight = (windowHeight - 8) - thumbHeight;
      
      if (trackScrollableHeight <= 0) return;

      const scrollDelta = (deltaY / trackScrollableHeight) * scrollableHeight;
      window.scrollTo({
        top: startScrollTopRef.current + scrollDelta,
        behavior: 'instant'
      });
      
      const currentScroll = startScrollTopRef.current + scrollDelta;
      const clampedScroll = Math.max(0, Math.min(scrollableHeight, currentScroll));
      setScrollProgress(scrollableHeight > 0 ? clampedScroll / scrollableHeight : 0);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isPC, isDragging, thumbHeight]);

  useEffect(() => {
    if (isPC) {
      document.documentElement.classList.add('custom-scrollbar-enabled');
    } else {
      document.documentElement.classList.remove('custom-scrollbar-enabled');
    }
    return () => document.documentElement.classList.remove('custom-scrollbar-enabled');
  }, [isPC]);

  if (!isPC || thumbHeight === 0) return null;

  const trackHeight = window.innerHeight - 8;
  const top = 4 + (scrollProgress * (trackHeight - thumbHeight));

  return (
    <div className={`custom-scrollbar-track ${isVisible || isDragging ? 'visible' : ''}`}>
      <div 
        className="custom-scrollbar-thumb"
        style={{ height: thumbHeight, transform: `translateY(${top}px)` }}
        onPointerDown={handlePointerDown}
      />
    </div>
  );
}
