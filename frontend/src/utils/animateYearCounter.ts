import {gsap} from 'gsap';

type AnimateYearCounterOptions = {
  element: HTMLElement;
  from: number;
  to: number;
  duration?: number;
};

export const animateYearCounter = ({
  element,
  from,
  to,
  duration = 2.3,
}: AnimateYearCounterOptions) => {
  const counter = {
    value: from,
  };

  element.textContent = String(from);

  return gsap.to(counter, {
    value: to,
    duration,
    ease: 'power4.out',
    onUpdate: () => {
      element.textContent = String(Math.round(counter.value));
    },
    onComplete: () => {
      element.textContent = String(to);
    },
  });
};
