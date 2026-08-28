import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function useAnimeReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const group =
            (entry.target as HTMLElement).closest("[data-reveal-group]") ??
            root;
          const nodes = Array.from(
            group.querySelectorAll("[data-reveal]:not([data-revealed])"),
          ) as HTMLElement[];
          nodes.forEach((node) => (node.dataset.revealed = "true"));
          animate(nodes, {
            translateY: [42, 0],
            opacity: [0, 1],
            duration: 820,
            delay: stagger(95),
            ease: "out(3)",
          });
          nodes.forEach((node) => obs.unobserve(node));
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
