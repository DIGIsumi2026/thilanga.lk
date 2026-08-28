import { imageAssets } from "../../assets/imageAssets";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
export default function ExpertiseSection() {
  const ref = useAnimeReveal<HTMLElement>();
  return (
    <section className="expertise" ref={ref} data-reveal-group>
      <div className="expertise-copy">
        <span className="mini-kicker gold" data-reveal>
          What we are expert
        </span>
        <h2 data-reveal>
          We here for provide
          <br />
          high quality{" "}
          <em>
            legal
            <br />
            consultancy.
          </em>
        </h2>
        <p data-reveal>
          Lorem ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
        <div className="rings" data-reveal>
          <div>
            <b>96%</b>
            <span>Successfully handle cases</span>
          </div>
          <div>
            <b>94%</b>
            <span>Experienced business lawyers</span>
          </div>
        </div>
      </div>
      <div className="expertise-media" data-reveal>
        <img src={imageAssets.consultancy} alt="Legal consultant" />
        <div className="review-card">
          <p>
            Making sure that our clients are fully protected in every step of
            process.
          </p>
          <strong>Matthew Taylor</strong>
          <span>★★★★★</span>
        </div>
      </div>
    </section>
  );
}
