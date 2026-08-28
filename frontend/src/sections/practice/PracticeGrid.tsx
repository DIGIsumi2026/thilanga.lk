import {
  Scale,
  Landmark,
  BriefcaseBusiness,
  GraduationCap,
  Building2,
  ShieldCheck,
  Gavel,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";
const items: Array<[string, LucideIcon]> = [
  ["Human rights law", Scale],
  ["Motor vehicles law", Landmark],
  ["Criminal law", Gavel],
  ["Employment law", BriefcaseBusiness],
  ["Property law", Building2],
  ["Securities law", ShieldCheck],
  ["Education law", GraduationCap],
  ["Corporate law", FileText],
];
export default function PracticeGrid() {
  const ref = useAnimeReveal<HTMLElement>();
  return (
    <section
      className="section practice-page-section"
      ref={ref}
      data-reveal-group
    >
      <div className="center-heading" data-reveal>
        <span className="mini-kicker gold">Corporate service</span>
        <h2>
          Legal <em>practice areas</em>
        </h2>
      </div>
      <div className="practice-page-grid">
        {items.map(([name, Icon]) => (
          <article data-reveal key={name}>
            <Icon size={34} />
            <h3>{name}</h3>
            <p>Quis autem velo eum iure suam nihil molestiae consequatur.</p>
            <a href="#">Learn more →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
