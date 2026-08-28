import { CheckCircle2, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { imageAssets } from "../../assets/imageAssets";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";

export default function AboutSection() {
  const ref = useAnimeReveal<HTMLElement>();
  return (
    <section className="section about-section" ref={ref} data-reveal-group>
      <div className="about-media" data-reveal>
        <img
          src={imageAssets.about.overview}
          alt="Lawyer reviewing legal documents"
        />
        <div className="experience-badge">
          <b>18</b>
          <span>
            years of
            <br />
            experience
          </span>
        </div>
      </div>
      <div className="about-copy">
        <span className="mini-kicker" data-reveal>
          We are committed to your success
        </span>
        <h2 data-reveal>
          We are here to fight
          <br />
          against <em>any violence.</em>
        </h2>
        <p data-reveal>
          Lorem ipsum is simply dummy text the printing and typesetting industry
          lorem industry standard.
        </p>
        <ul data-reveal>
          <li>
            <CheckCircle2 /> Full service corporate & commercial law.
          </li>
          <li>
            <CheckCircle2 /> Effective and innovative legal solutions.
          </li>
        </ul>
        <div className="inline-actions" data-reveal>
          <Link className="pill dark" to="/about">
            Learn more <span>→</span>
          </Link>
          <a href="tel:1234567890">
            <Phone size={17} />
            123 456 7890
          </a>
        </div>
      </div>
    </section>
  );
}
