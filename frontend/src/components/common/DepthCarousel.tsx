import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {gsap} from 'gsap';
import './DepthCarousel.css';

export type DepthCarouselItem =
  | string
  | {
      image:string;
      alt?:string;
    };

type TiltDirection = 'left' | 'right';

export interface DepthCarouselProps {
  items?:DepthCarouselItem[];
  cardWidth?:number;
  cardHeight?:number;
  radius?:number;
  tint?:string;
  depth?:number;
  spread?:number;
  tilt?:number;
  tiltDirection?:TiltDirection;
  perspective?:number;
  visibleCards?:number;
  falloff?:number;
  blur?:number;
  duration?:number;
  ease?:string;
  autoplay?:boolean;
  autoplayDelay?:number;
  loop?:boolean;
  showControls?:boolean;
  showIndicators?:boolean;
  onChange?:(index:number,item:{image:string;alt?:string}) => void;
  onItemClick?:(index:number,item:{image:string;alt?:string}) => void;
  className?:string;
}

interface CarouselConfig {
  count:number;
  depth:number;
  spread:number;
  tilt:number;
  tiltDirection:TiltDirection;
  visibleCards:number;
  falloff:number;
  blur:number;
  duration:number;
  ease:string;
  loop:boolean;
  cardWidth:number;
  autoplayDelay:number;
}

interface DragState {
  x:number;
  startPos:number;
  lastX:number;
  lastT:number;
  v:number;
  moved:boolean;
  id:number;
}

const DEFAULT_ITEMS:DepthCarouselItem[] = [
  {image:'https://picsum.photos/seed/depth1/800/1000',alt:'Slide 1'},
  {image:'https://picsum.photos/seed/depth2/800/1000',alt:'Slide 2'},
  {image:'https://picsum.photos/seed/depth3/800/1000',alt:'Slide 3'},
  {image:'https://picsum.photos/seed/depth4/800/1000',alt:'Slide 4'},
  {image:'https://picsum.photos/seed/depth5/800/1000',alt:'Slide 5'},
];

const clamp = (value:number,min:number,max:number) =>
  Math.min(Math.max(value,min),max);

const normalizeItem = (item:DepthCarouselItem):{image:string;alt?:string} => {
  if (typeof item === 'string') {
    return {image:item,alt:''};
  }

  return item;
};

const DepthCarousel = ({
  items = DEFAULT_ITEMS,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = '#05060a',
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  duration = 700,
  ease = 'power3.out',
  autoplay = false,
  autoplayDelay = 3200,
  loop = true,
  showControls = true,
  showIndicators = true,
  onChange,
  onItemClick,
  className = '',
}:DepthCarouselProps) => {
  const data = useMemo(
    () => (Array.isArray(items) ? items.map(normalizeItem) : []),
    [items],
  );

  const count = data.length;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);

  const cfgRef = useRef<CarouselConfig>({
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    autoplayDelay,
  });

  const onChangeRef = useRef(onChange);
  const onItemClickRef = useRef(onItemClick);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const isInteractingRef = useRef(false);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedRef = useRef(false);

  const [active,setActive] = useState(0);

  onChangeRef.current = onChange;
  onItemClickRef.current = onItemClick;

  cfgRef.current = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    autoplayDelay,
  };

  const layout = useCallback((position:number) => {
    const config = cfgRef.current;
    const total = config.count;

    if (!total) return;

    const direction = config.tiltDirection === 'left' ? -1 : 1;
    const scale = scaleRef.current;

    for (let index = 0; index < total; index += 1) {
      const element = cardRefs.current[index];
      if (!element) continue;

      let distance = index - position;

      if (config.loop && total > 1) {
        distance = ((distance % total) + total) % total;
        if (distance > total / 2) distance -= total;
      }

      const back = Math.max(0,distance);
      const absoluteDistance = Math.abs(distance);
      const shown = absoluteDistance <= config.visibleCards + 0.5;
      const translateZ = -config.depth * distance;
      const translateX = direction * config.spread * distance;
      const rotateY = direction * config.tilt * clamp(distance,0,1);

      let opacity = distance < 0 ? Math.max(0,1 + distance) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.15,1 - back * config.falloff);
      const blurAmount = config.blur > 0
        ? Math.min(
            config.blur,
            (back / Math.max(1,config.visibleCards)) * config.blur,
          )
        : 0;
      const zIndex = Math.round(2000 - distance * 20);

      element.style.transform = `
        translate(-50%, -50%)
        scale(${scale})
        translateX(${translateX.toFixed(2)}px)
        translateZ(${translateZ.toFixed(2)}px)
        rotateY(${rotateY.toFixed(3)}deg)
      `;
      element.style.opacity = opacity.toFixed(3);
      element.style.filter = `
        brightness(${brightness.toFixed(3)})
        blur(${blurAmount.toFixed(2)}px)
      `;
      element.style.zIndex = String(zIndex);
      element.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

      const overlay = overlayRefs.current[index];
      if (overlay) {
        overlay.style.opacity = clamp(
          back * config.falloff * 1.25,
          0,
          0.86,
        ).toFixed(3);
      }
    }
  },[]);

  const notify = useCallback((index:number) => {
    const item = data[index];
    if (!item) return;

    setActive(index);
    onChangeRef.current?.(index,item);
  },[data]);

  const tweenTo = useCallback((target:number,shouldAnimate:boolean) => {
    tweenRef.current?.kill();

    const config = cfgRef.current;
    const proxy = {position:posRef.current};
    const tweenDuration = shouldAnimate && !reducedRef.current
      ? config.duration / 1000
      : 0;

    tweenRef.current = gsap.to(proxy,{
      position:target,
      duration:tweenDuration,
      ease:config.ease,
      onUpdate:() => {
        posRef.current = proxy.position;
        layout(proxy.position);
      },
      onComplete:() => {
        const total = config.count;
        if (total > 0) {
          posRef.current = ((posRef.current % total) + total) % total;
        }
        layout(posRef.current);
      },
    });
  },[layout]);

  const setFocus = useCallback((rawIndex:number,shouldAnimate = true) => {
    const config = cfgRef.current;
    const total = config.count;
    if (!total) return;

    const index = config.loop
      ? ((rawIndex % total) + total) % total
      : clamp(rawIndex,0,total - 1);

    let delta = index - posRef.current;
    if (config.loop && total > 1) {
      delta = ((delta % total) + total) % total;
      if (delta > total / 2) delta -= total;
    }

    tweenTo(posRef.current + delta,shouldAnimate);

    if (index !== focusRef.current) {
      focusRef.current = index;
      notify(index);
    }
  },[notify,tweenTo]);

  const navigateBy = useCallback((step:number) => {
    setFocus(focusRef.current + step,true);
  },[setFocus]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const width = entry.contentRect.width;
      const config = cfgRef.current;
      const requiredWidth = config.cardWidth + Math.abs(config.spread) * 2 + 120;

      scaleRef.current = clamp(width / requiredWidth,0.4,1);
      layout(posRef.current);
    });

    observer.observe(root);
    return () => observer.disconnect();
  },[layout]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const handleWheel = (event:WheelEvent) => {
      const config = cfgRef.current;
      if (config.count < 2) return;

      event.preventDefault();
      tweenRef.current?.kill();

      const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
      const delta = event.deltaMode === 1 ? raw * 24 : raw;
      const step = clamp(delta / (config.cardWidth * 0.9),-0.6,0.6);

      posRef.current += step;
      layout(posRef.current);

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        setFocus(Math.round(posRef.current),true);
      },130);
    };

    element.addEventListener('wheel',handleWheel,{passive:false});
    return () => {
      element.removeEventListener('wheel',handleWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  },[layout,setFocus]);

  const onPointerDown = useCallback((event:ReactPointerEvent<HTMLDivElement>) => {
    const config = cfgRef.current;
    if (config.count < 2) return;

    tweenRef.current?.kill();
    suppressClickRef.current = false;
    isInteractingRef.current = true;
    dragRef.current = {
      x:event.clientX,
      startPos:posRef.current,
      lastX:event.clientX,
      lastT:performance.now(),
      v:0,
      moved:false,
      id:event.pointerId,
    };
  },[]);

  const onPointerMove = useCallback((event:ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const config = cfgRef.current;
    const stepPx = Math.max(config.cardWidth * 0.55 * scaleRef.current,40);
    const deltaX = event.clientX - drag.x;

    if (!drag.moved && Math.abs(deltaX) > 4) {
      drag.moved = true;
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (!drag.moved) return;

    const now = performance.now();
    const deltaTime = Math.max(now - drag.lastT,1);
    drag.v = (event.clientX - drag.lastX) / deltaTime;
    drag.lastX = event.clientX;
    drag.lastT = now;
    posRef.current = drag.startPos - deltaX / stepPx;
    layout(posRef.current);
  },[layout]);

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    isInteractingRef.current = false;
    if (!drag) return;

    dragRef.current = null;
    suppressClickRef.current = drag.moved;
    if (!drag.moved) return;

    const config = cfgRef.current;
    const stepPx = Math.max(config.cardWidth * 0.55 * scaleRef.current,40);
    const projected = posRef.current - (drag.v * 180) / stepPx;
    setFocus(Math.round(projected),true);
  },[setFocus]);

  const onKeyDown = useCallback((event:ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateBy(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateBy(1);
    }
  },[navigateBy]);

  const onCardClick = useCallback((index:number) => {
    if (suppressClickRef.current || dragRef.current?.moved) {
      suppressClickRef.current = false;
      return;
    }

    setFocus(index,true);

    const item = data[index];
    if (item) onItemClickRef.current?.(index,item);
  },[data,setFocus]);

  useEffect(() => {
    reducedRef.current = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!autoplay || reducedRef.current || count < 2) {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
      return;
    }

    const root = rootRef.current;
    let hovered = false;
    let focused = false;

    const stop = () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    };

    const start = () => {
      stop();
      autoTimerRef.current = setInterval(() => {
        if (!hovered && !focused && !isInteractingRef.current) navigateBy(1);
      },Math.max(cfgRef.current.autoplayDelay,600));
    };

    const handleMouseEnter = () => {hovered = true;};
    const handleMouseLeave = () => {hovered = false;};
    const handleFocusIn = () => {focused = true;};
    const handleFocusOut = () => {focused = false;};

    root?.addEventListener('mouseenter',handleMouseEnter);
    root?.addEventListener('mouseleave',handleMouseLeave);
    root?.addEventListener('focusin',handleFocusIn);
    root?.addEventListener('focusout',handleFocusOut);
    start();

    return () => {
      stop();
      root?.removeEventListener('mouseenter',handleMouseEnter);
      root?.removeEventListener('mouseleave',handleMouseLeave);
      root?.removeEventListener('focusin',handleFocusIn);
      root?.removeEventListener('focusout',handleFocusOut);
    };
  },[autoplay,autoplayDelay,count,navigateBy]);

  useEffect(() => {
    layout(posRef.current);
  },[
    layout,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    cardWidth,
    cardHeight,
    radius,
    count,
  ]);

  useEffect(() => () => {
    tweenRef.current?.kill();
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
  },[]);

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{'--dc-perspective':`${perspective}px`} as CSSProperties}
      role="group"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage">
        {data.map((item,index) => (
          <div
            key={`${item.image}-${index}`}
            className="depth-carousel__card"
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            style={{width:cardWidth,height:cardHeight,borderRadius:radius}}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            aria-hidden={active !== index}
            onClick={() => onCardClick(index)}
          >
            <img
              className="depth-carousel__img"
              src={item.image}
              alt={item.alt || ''}
              draggable={false}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />

            <span
              className="depth-carousel__tint"
              ref={(element) => {
                overlayRefs.current[index] = element;
              }}
              style={{background:tint}}
            />
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--prev"
            aria-label="Previous slide"
            onClick={() => navigateBy(-1)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--next"
            aria-label="Next slide"
            onClick={() => navigateBy(1)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots" role="tablist" aria-label="Slides">
          {data.map((item,index) => (
            <button
              key={`${item.image}-dot-${index}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={`Go to slide ${index + 1}`}
              className={`depth-carousel__dot${active === index ? ' is-active' : ''}`}
              onClick={() => setFocus(index,true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepthCarousel;
