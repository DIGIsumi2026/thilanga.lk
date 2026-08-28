import { posts } from "../../data/site";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
export default function BlogSection() {
  const ref = useAnimeReveal<HTMLElement>();
  return (
    <section className="section blog-home" ref={ref} data-reveal-group>
      <div className="center-heading">
        <span className="mini-kicker gold" data-reveal>
          Our news and blog
        </span>
        <h2 data-reveal>
          Updated <em>latest news</em>
        </h2>
      </div>
      <div className="blog-grid" data-reveal>
        {posts.map((p) => (
          <article key={p.title}>
            <div className="blog-image">
              <img src={p.image} alt="" />
              <span>Lawyer</span>
            </div>
            <div className="blog-body">
              <h3>{p.title}</h3>
              <small>{p.date}</small>
              <p>
                By Hugh Macleod <span>♡ 25</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
