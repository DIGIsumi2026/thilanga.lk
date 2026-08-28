import { Facebook, Instagram, Linkedin } from "lucide-react";
import { attorneys } from "../../data/site";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
export default function AttorneysSection() {
  const ref = useAnimeReveal<HTMLElement>();
  return (
    <section className="section attorneys-home" ref={ref} data-reveal-group>
      <div className="center-heading">
        <span className="mini-kicker gold" data-reveal>
          Qualified our experts
        </span>
        <h2 data-reveal>
          Meet our <em>attorneys</em>
        </h2>
      </div>
      <div className="attorney-grid" data-reveal>
        {attorneys.map((a) => (
          <article key={a.name}>
            <img className="attorney-photo" src={a.image} alt={a.name} />
            <h3>{a.name}</h3>
            <p>
              I'm {a.name.split(" ")[0]}, Expert in{" "}
              <em>{a.role.toLowerCase()}</em>.
            </p>
            <div>
              <Facebook size={13} />
              <Instagram size={13} />
              <Linkedin size={13} />
            </div>
          </article>
        ))}
      </div>
      <p className="experience-note" data-reveal>
        💡 We have <u>10 years</u> of experience and achieved{" "}
        <em>some awards.</em>
      </p>
    </section>
  );
}
