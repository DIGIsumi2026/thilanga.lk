import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { ChevronDown } from "lucide-react";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";

const stats = [
  ["86", "%", "Cases solved"],
  ["350", "", "Happy clients"],
  ["59", "+", "Award winning"],
  ["100", "%", "Success chance"],
];
export default function AchievementSection() {
  const ref = useAnimeReveal<HTMLElement>();
  const counted = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || counted.current) return;
        counted.current = true;
        el.querySelectorAll<HTMLElement>("[data-counter]").forEach((node) => {
          const end = Number(node.dataset.counter);
          const o = { v: 0 };
          animate(o, {
            v: end,
            duration: 1500,
            ease: "out(3)",
            onUpdate: () => (node.textContent = Math.round(o.v).toString()),
          });
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return (
    <section className="achievement section" ref={ref} data-reveal-group>
      <div className="stats-grid" data-reveal>
        {stats.map(([n, s, l]) => (
          <div className="stat" key={l}>
            <strong>
              <span data-counter={n}>0</span>
              {s}
            </strong>
            <small>{l}</small>
          </div>
        ))}
      </div>
      <div className="achievement-copy" data-reveal>
        <h2>
          We feel very proud for
          <br />
          <em>our achievement.</em>
        </h2>
        {[
          "You deserve time to recover",
          "Don’t settle for less than you deserve",
          "Experience you can trust",
        ].map((x, i) => (
          <details key={x} open={i === 1}>
            <summary>
              {x}
              <ChevronDown size={14} />
            </summary>
            <p>
              Lorem ipsum is simply dummy text of the printing industry
              typesetting standard.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
