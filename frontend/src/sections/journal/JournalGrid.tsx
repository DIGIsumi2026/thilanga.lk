import { posts } from "../../data/site";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
export default function JournalGrid() {
  const ref = useAnimeReveal<HTMLElement>();
  const all = [...posts, ...posts];
  return (
    <section className="section journal-section" ref={ref} data-reveal-group>
      <div className="center-heading" data-reveal>
        <span className="mini-kicker gold">Latest insight</span>
        <h2>
          Legal news & <em>journal</em>
        </h2>
      </div>
      <div className="journal-grid">
        {all.map((p, i) => (
          <article data-reveal key={`${p.title}-${i}`}>
            <img src={p.image} />
            <div>
              <span>Lawyer</span>
              <h3>{p.title}</h3>
              <small>
                {p.date} · 0{i + 2} min read
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
