import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { practices } from "../../data/site";
import { useAnimeReveal } from "../../hooks/useAnimeReveal";

export default function PracticeCarousel() {
  const ref = useAnimeReveal<HTMLElement>();
  return (
    <section className="practice-band" ref={ref} data-reveal-group>
      <div className="practice-intro" data-reveal>
        <span className="mini-kicker gold">Areas of practice</span>
        <h2>
          Different case,
          <br />
          need{" "}
          <em>
            different
            <br />
            services.
          </em>
        </h2>
        <div className="slider-buttons">
          <button className="practice-prev">
            <ArrowLeft size={15} />
          </button>
          <button className="practice-next">
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
      <div className="practice-slider" data-reveal>
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: ".practice-prev", nextEl: ".practice-next" }}
          slidesPerView={1.25}
          spaceBetween={18}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            900: { slidesPerView: 3.15 },
          }}
        >
          {practices.concat(practices).map((p, i) => (
            <SwiperSlide key={i}>
              <article className="practice-card">
                <img src={p.image} alt="" />
                <div className="practice-overlay" />
                <span className="practice-icon">⚖</span>
                <h3>{p.title}</h3>
                <button>→</button>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
