import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {createPortal} from 'react-dom';
import {AnimatePresence,motion} from 'framer-motion';
import {ChevronLeft,ChevronRight,X} from 'lucide-react';
import './GalleryLightbox.css';

export type GalleryLightboxItem = {
  image:string;
  alt?:string;
};

type GalleryLightboxProps = {
  items:GalleryLightboxItem[];
  activeIndex:number;
  open:boolean;
  onClose:() => void;
  onChange:(index:number) => void;
};

export default function GalleryLightbox({
  items,
  activeIndex,
  open,
  onClose,
  onChange,
}:GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const pointerStartRef = useRef<{x:number;y:number} | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const onChangeRef = useRef(onChange);
  const onCloseRef = useRef(onClose);
  const [prefersReducedMotion,setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const itemCount = items.length;
  const currentItem = itemCount > 0 ? items[activeIndex] : undefined;

  activeIndexRef.current = activeIndex;
  onChangeRef.current = onChange;
  onCloseRef.current = onClose;

  const showPrevious = useCallback(() => {
    if (!itemCount) return;
    onChangeRef.current(
      (activeIndexRef.current - 1 + itemCount) % itemCount,
    );
  },[itemCount]);

  const showNext = useCallback(() => {
    if (!itemCount) return;
    onChangeRef.current((activeIndexRef.current + 1) % itemCount);
  },[itemCount]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(query.matches);

    updatePreference();
    query.addEventListener('change',updatePreference);

    return () => query.removeEventListener('change',updatePreference);
  },[]);

  useEffect(() => {
    if (!open || !itemCount) return;

    const previousOverflow = document.body.style.overflow;
    const activeElement = document.activeElement;
    openerRef.current = activeElement instanceof HTMLElement
      ? activeElement
      : null;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({preventScroll:true});
    });

    const handleKeyDown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
      else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPrevious();
      }
      else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNext();
      }
    };

    window.addEventListener('keydown',handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown',handleKeyDown);

      if (openerRef.current?.isConnected) {
        openerRef.current.focus({preventScroll:true});
      }
    };
  },[itemCount,open,showNext,showPrevious]);

  useEffect(() => {
    if (!open || itemCount < 2) return;

    const neighbourIndexes = [
      (activeIndex - 1 + itemCount) % itemCount,
      (activeIndex + 1) % itemCount,
    ];

    neighbourIndexes.forEach((index) => {
      const image = new Image();
      image.src = items[index].image;
    });
  },[activeIndex,itemCount,items,open]);

  const handlePointerDown = (
    event:ReactPointerEvent<HTMLDivElement>,
  ) => {
    pointerStartRef.current = {x:event.clientX,y:event.clientY};
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (
    event:ReactPointerEvent<HTMLDivElement>,
  ) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!start) return;

    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;

    if (Math.abs(distanceX) < 52 || Math.abs(distanceX) <= Math.abs(distanceY)) {
      return;
    }

    if (distanceX < 0) showNext();
    else showPrevious();
  };

  const handlePointerCancel = (
    event:ReactPointerEvent<HTMLDivElement>,
  ) => {
    pointerStartRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && currentItem && (
        <motion.div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          initial={{opacity:0}}
          animate={{opacity:1}}
          exit={{opacity:0}}
          transition={{duration:prefersReducedMotion ? 0.12 : 0.28}}
          onClick={onClose}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="gallery-lightbox__close"
            aria-label="Close image preview"
            onClick={onClose}
          >
            <X size={22} strokeWidth={1.7} />
          </button>

          {itemCount > 1 && (
            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--prev"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
            >
              <ChevronLeft size={26} strokeWidth={1.5} />
            </button>
          )}

          <div
            className="gallery-lightbox__stage"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentItem.image}
                src={currentItem.image}
                alt={currentItem.alt || ''}
                draggable={false}
                initial={{opacity:0,scale:prefersReducedMotion ? 1 : 0.985}}
                animate={{opacity:1,scale:1}}
                exit={{opacity:0,scale:prefersReducedMotion ? 1 : 0.985}}
                transition={{
                  duration:prefersReducedMotion ? 0.12 : 0.3,
                  ease:[0.22,1,0.36,1],
                }}
              />
            </AnimatePresence>

            <span className="gallery-lightbox__counter" aria-live="polite">
              {String(activeIndex + 1).padStart(2,'0')}
              <i />
              {String(itemCount).padStart(2,'0')}
            </span>
          </div>

          {itemCount > 1 && (
            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--next"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
            >
              <ChevronRight size={26} strokeWidth={1.5} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
