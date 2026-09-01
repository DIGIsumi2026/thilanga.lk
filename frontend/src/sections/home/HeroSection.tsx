import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { heroSlides } from "../../data/site";
import gsap from "gsap";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSection() {
  const handleSlideChange = (swiper: SwiperType) => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    if (!activeSlide) return;

    const activeLines = activeSlide.querySelectorAll(".hero-quote-line");

    gsap.set(activeLines, {
      clipPath: "inset(0 100% 0 0)",
    });

    gsap.to(activeLines, {
      clipPath: "inset(0 0% 0 0)",
      duration: 3.25,
      stagger: 0.45,
      ease: "power4.out",
      delay: 1.28,
    });
  };

  return (
    <section className="hero-section">
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        slidesPerView={1}
        loop
        effect="fade"
        speed={1100}
        allowTouchMove
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
        }}
        fadeEffect={{
          crossFade: true,
        }}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        pagination={{
          el: ".hero-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className}"><span class="progress-fill"></span></span>`;
          },
        }}
        onSlideChangeTransitionStart={handleSlideChange}
        onInit={handleSlideChange}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide">
              <div className="hero-image-wrapper">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className="hero-image"
                />
              </div>

              <div className="hero-overlay" />

              <div className="hero-content">
                <div className="hero-copy">
                  <div className="hero-role-wrap">
                    <span className="hero-slide-number">{slide.number}</span>

                    <span className="hero-role">{slide.role}</span>
                  </div>

                  <div className="hero-title-mask">
                    <h1 className={`hero-quote hero-quote-${slide.id}`}>
                      <span className="quote-desktop">
                        {slide.quoteLines.map((line, i) => (
                          <span
                            key={`desktop-${i}`}
                            className="hero-quote-line-mask"
                          >
                            <span className="hero-quote-line">{line}</span>
                          </span>
                        ))}
                      </span>
                      <span className="quote-mobile">
                        {slide.shortQuoteLines.map((line, i) => (
                          <span
                            key={`mobile-${i}`}
                            className="hero-quote-line-mask"
                          >
                            <span className="hero-quote-line">{line}</span>
                          </span>
                        ))}
                      </span>
                    </h1>
                  </div>

                  <div className="hero-button-wrap">
                    <Link to="/about-me" className="pill hero-more-button">
                      More about me
                      <span>
                        <ArrowUpRight size={14} strokeWidth={1.7} />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="hero-controls">
          <button
            type="button"
            className="hero-arrow hero-prev"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>

          <div className="hero-pagination" />

          <button
            type="button"
            className="hero-arrow hero-next"
            aria-label="Next slide"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </Swiper>
    </section>
  );
}
