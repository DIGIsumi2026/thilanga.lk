import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { heroSlides } from "../../data/site";

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const root = useRef<HTMLElement>(null);
  const slide = heroSlides[index];

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((v) => (v + 1) % heroSlides.length),
      5600,
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-bg",
        { scale: 1.08, opacity: 0.25 },
        { scale: 1, opacity: 1, duration: 1.2 },
      )
        .fromTo(
          ".hero-eyebrow",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.15,
        )
        .fromTo(
          ".hero-line",
          { y: "115%", rotate: 0.5 },
          { y: "0%", rotate: 0, duration: 0.9, stagger: 0.08 },
          0.22,
        )
        .fromTo(
          ".hero-actions",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          0.62,
        )
        .fromTo(
          ".hero-pagination",
          { opacity: 0 },
          { opacity: 1, duration: 0.45 },
          0.8,
        );
    }, root);
    return () => ctx.revert();
  }, [index]);

  return (
    <section className="hero" ref={root}>
      <div
        className="hero-bg"
        key={slide.image}
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="hero-eyebrow">{slide.eyebrow}</div>
        <h1 aria-label={slide.title}>
          <span className="clip-line">
            <span className="hero-line">We are here</span>
          </span>
          <span className="clip-line">
            <span className="hero-line">
              for the <em>voice</em>
            </span>
          </span>
          <span className="clip-line">
            <span className="hero-line">
              <em>of justice.</em>
            </span>
          </span>
        </h1>
        <div className="hero-actions">
          <Link className="pill" to={slide.href}>
            {slide.cta}
            <span>→</span>
          </Link>
        </div>
        <div className="hero-pagination">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
            >
              0{i + 1}
            </button>
          ))}
          <div className="hero-progress">
            <i
              style={{ width: `${((index + 1) / heroSlides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <button
        className="hero-arrow prev"
        onClick={() =>
          setIndex((v) => (v - 1 + heroSlides.length) % heroSlides.length)
        }
      >
        <ChevronLeft size={17} />
      </button>
      <button
        className="hero-arrow next"
        onClick={() => setIndex((v) => (v + 1) % heroSlides.length)}
      >
        <ChevronRight size={17} />
      </button>
    </section>
  );
}
