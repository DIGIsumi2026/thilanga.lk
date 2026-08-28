import { Quote } from "lucide-react";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
export default function TestimonialSection() {
  const ref = useAnimeReveal<HTMLElement>();
  return (
    <section className="quote-section section" ref={ref} data-reveal-group>
      <div className="quote-panel" data-reveal>
        <Quote />
        <p>
          Everyone wants to say they hate lawyers and yet I've never met a
          parent who didn't want their kid to be a lawyer.
        </p>
        <small>@Jason Statham</small>
        <span className="ghost-word">success</span>
      </div>
    </section>
  );
}
