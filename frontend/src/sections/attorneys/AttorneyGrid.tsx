import { Facebook, Linkedin, Mail } from "lucide-react";
import { attorneys } from "../../data/site";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
export default function AttorneyGrid() {
  const ref = useAnimeReveal<HTMLElement>();
  const all = [
    ...attorneys,
    ...attorneys
      .slice(0, 2)
      .map((a, i) => ({
        ...a,
        name: i === 0 ? "Rosald Smith" : "Michelle Moore",
        role: i === 0 ? "Corporate lawyer" : "Sales manager",
      })),
  ];
  return (
    <section
      className="section attorney-page-section"
      ref={ref}
      data-reveal-group
    >
      <div className="center-heading" data-reveal>
        <span className="mini-kicker gold">Qualified our experts</span>
        <h2>
          Meet our <em>attorneys</em>
        </h2>
      </div>
      <div className="attorney-page-grid">
        {all.map((a) => (
          <article data-reveal key={a.name}>
            <img className="attorney-photo large" src={a.image} alt={a.name} />
            <div className="attorney-page-body">
              <h3>{a.name}</h3>
              <p>{a.role}</p>
              <div>
                <Facebook size={14} />
                <Linkedin size={14} />
                <Mail size={14} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
