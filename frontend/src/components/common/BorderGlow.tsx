import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import './BorderGlow.css';

type BorderGlowProps = {
  children:ReactNode;
  className?:string;
  edgeSensitivity?:number;
  glowColor?:string;
  borderRadius?:number | string;
  glowRadius?:number;
  glowIntensity?:number;
  coneSpread?:number;
  animated?:boolean;
  colors?:string[];
  fillOpacity?:number;
  lightSurface?:boolean;
  borderOnly?:boolean;
};

type GlowStyles = CSSProperties & {
  '--border-glow-radius':string;
  '--cone-spread':string;
  '--cone-spread-mid':string;
  '--cone-spread-end':string;
  '--cone-spread-fade':string;
  '--cursor-angle':string;
  '--edge-proximity':number;
  '--fill-opacity':number;
  '--glow-color':string;
  '--glow-color-1':string;
  '--glow-color-2':string;
  '--glow-color-3':string;
  '--glow-intensity':number;
  '--glow-radius':string;
  '--pointer-x':string;
  '--pointer-y':string;
};

const clamp = (value:number,min:number,max:number) =>
  Math.min(Math.max(value,min),max);

const getCenterOfElement = (element:HTMLElement) => {
  const rect = element.getBoundingClientRect();

  return {
    x:rect.left + rect.width / 2,
    y:rect.top + rect.height / 2,
  };
};

const getEdgeProximity = (
  x:number,
  y:number,
  width:number,
  height:number,
  sensitivity:number,
) => {
  const edgeDistance = Math.min(x,width - x,y,height - y);
  return clamp(1 - edgeDistance / Math.max(sensitivity,1),0,1);
};

const getCursorAngle = (
  x:number,
  y:number,
  center:{x:number;y:number},
) => Math.atan2(y - center.y,x - center.x) * (180 / Math.PI) + 90;

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 28,
  glowColor = '201 155 59',
  borderRadius = 18,
  glowRadius = 18,
  glowIntensity = 0.75,
  coneSpread = 20,
  animated = false,
  colors = ['#c99b3b','#f0cf83','#7ab6b0'],
  fillOpacity = 0.08,
  lightSurface = false,
  borderOnly = false,
}:BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const pointerInsideRef = useRef(false);

  const setPointerVariables = (
    element:HTMLDivElement,
    clientX:number,
    clientY:number,
  ) => {
    const rect = element.getBoundingClientRect();
    const localX = clamp(clientX - rect.left,0,rect.width);
    const localY = clamp(clientY - rect.top,0,rect.height);
    const center = getCenterOfElement(element);
    const proximity = getEdgeProximity(
      localX,
      localY,
      rect.width,
      rect.height,
      edgeSensitivity,
    );
    const angle = getCursorAngle(clientX,clientY,center);

    element.style.setProperty('--pointer-x',`${localX}px`);
    element.style.setProperty('--pointer-y',`${localY}px`);
    element.style.setProperty('--cursor-angle',`${angle}deg`);
    element.style.setProperty('--edge-proximity',String(proximity));
  };

  const handlePointerMove = (event:ReactPointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    pointerInsideRef.current = true;
    setPointerVariables(event.currentTarget,event.clientX,event.clientY);
  };

  const clearPointerGlow = (event:ReactPointerEvent<HTMLDivElement>) => {
    pointerInsideRef.current = false;
    event.currentTarget.style.setProperty('--edge-proximity','0');
  };

  useEffect(() => {
    if (!animated) return;

    let animationFrame = 0;
    const startedAt = performance.now();

    const animateGlow = (time:number) => {
      const element = cardRef.current;

      if (element && !pointerInsideRef.current) {
        const rect = element.getBoundingClientRect();
        const angle = ((time - startedAt) / 32) % 360;
        const radians = (angle - 90) * (Math.PI / 180);
        const x = rect.left + rect.width / 2 + Math.cos(radians) * rect.width / 2;
        const y = rect.top + rect.height / 2 + Math.sin(radians) * rect.height / 2;

        setPointerVariables(element,x,y);
      }

      animationFrame = window.requestAnimationFrame(animateGlow);
    };

    animationFrame = window.requestAnimationFrame(animateGlow);

    return () => window.cancelAnimationFrame(animationFrame);
  },[animated,edgeSensitivity]);

  const color1 = colors[0] || '#c99b3b';
  const color2 = colors[1] || color1;
  const color3 = colors[2] || color2;
  const radius = typeof borderRadius === 'number'
    ? `${borderRadius}px`
    : borderRadius;

  const styles:GlowStyles = {
    '--border-glow-radius':radius,
    '--cone-spread':`${coneSpread}deg`,
    '--cone-spread-mid':`${coneSpread * 1.55}deg`,
    '--cone-spread-end':`${coneSpread * 2}deg`,
    '--cone-spread-fade':`${coneSpread * 3}deg`,
    '--cursor-angle':'0deg',
    '--edge-proximity':0,
    '--fill-opacity':fillOpacity,
    '--glow-color':glowColor,
    '--glow-color-1':color1,
    '--glow-color-2':color2,
    '--glow-color-3':color3,
    '--glow-intensity':glowIntensity,
    '--glow-radius':`${glowRadius}px`,
    '--pointer-x':'50%',
    '--pointer-y':'50%',
  };

  return (
    <div
      ref={cardRef}
      className={`border-glow-card${lightSurface ? ' border-glow-card--light' : ''}${borderOnly ? ' border-glow-card--border-only' : ''}${className ? ` ${className}` : ''}`}
      style={styles}
      onPointerEnter={handlePointerMove}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearPointerGlow}
      onPointerCancel={clearPointerGlow}
    >
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
