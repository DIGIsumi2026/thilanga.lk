import { CheckCircle2 } from "lucide-react";
import { imageAssets } from "../../assets/imageAssets";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
export default function AboutIntro() {
  const ref = useAnimeReveal<HTMLElement>();
  return (
    <section className="section about-inner" ref={ref} data-reveal-group>
      <div data-reveal>
        <span className="mini-kicker gold">Facts of lawyer agency</span>
        <h2>
          We are committed to helping
          <br />
          <em>our clients succeed.</em>
        </h2>
        <p>
          We are a full-service business law firm providing clients with focused
          legal advice. We solve complex business issues with a practical,
          client-first approach.
        </p>
        <ul>
          <li>
            <CheckCircle2 />
            Full service corporate and commercial law.
          </li>
          <li>
            <CheckCircle2 />
            Effective and innovative legal solutions.
          </li>
        </ul>
      </div>
      <img data-reveal src={imageAssets.about.overview} alt="Lawyer working" />
    </section>
  );
}
