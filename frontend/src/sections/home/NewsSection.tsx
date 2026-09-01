import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import {
  getYouTubeFallbackThumbnail,
  getYouTubeThumbnail,
  getYouTubeVideoId,
  getYouTubeEmbedUrl,
} from "../../utils/youtube";

import "swiper/css";
import "swiper/css/navigation";

type NewsVideoItem = {
  id: string;
  videoUrl: string;
  category: string;
  title: string;
  description: string;
  date: string;
};

type VideoCardItem = NewsVideoItem & {
  videoId: string;
  thumbnail: string;
  fallbackThumbnail: string;
};

export default function NewsSection() {
  const [videos, setVideos] = useState<VideoCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoCardItem | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [canPreviewOnHover, setCanPreviewOnHover] = useState(false);

  useEffect(() => {
    fetch("/data/newsVideos.json")
      .then((res) => res.json())
      .then((data: NewsVideoItem[]) => {
        const enhancedVideos = data.map((video) => {
          const videoId = getYouTubeVideoId(video.videoUrl) || "";
          return {
            ...video,
            videoId,
            thumbnail: getYouTubeThumbnail(video.videoUrl),
            fallbackThumbnail: getYouTubeFallbackThumbnail(video.videoUrl),
          };
        });

        setVideos(enhancedVideos);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load videos:", err);
        setLoading(false);
      });
  }, []);

  // Close modal on Escape
  useEffect(() => {
    if (!activeVideo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  useEffect(() => {
    const checkHoverCapability = () => {
      const isDesktop = window.innerWidth > 900;
      const hasHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      setCanPreviewOnHover(isDesktop && hasHover);
    };

    checkHoverCapability();

    window.addEventListener("resize", checkHoverCapability);
    return () => window.removeEventListener("resize", checkHoverCapability);
  }, []);

  // Avoid horizontal scroll issues by only rendering necessary slides
  const visibleVideos = useMemo(() => {
    return videos;
  }, [videos]);

  if (loading) {
    return (
      <section className="news-section">
        <div className="news-shell">
          <div className="news-heading">
            <h2>Latest Insights</h2>
            <p>Loading videos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="news-section">
        <div className="news-shell">
          <div className="news-topbar">
            <div className="news-heading">
              <span className="news-kicker">News & Insights</span>
              <h2>Latest Insights</h2>
              <p>
                Conversations, stories and reflections on leadership, cricket
                and the journey of impact.
              </p>
            </div>

            <div className="news-nav">
              <button
                type="button"
                className="news-nav-btn news-prev"
                aria-label="Previous videos"
              >
                <ChevronLeft size={18} strokeWidth={1.7} />
              </button>

              <button
                type="button"
                className="news-nav-btn news-next"
                aria-label="Next videos"
              >
                <ChevronRight size={18} strokeWidth={1.7} />
              </button>
            </div>
          </div>

          <Swiper
            className="news-swiper"
            modules={[Navigation, A11y]}
            navigation={{
              prevEl: ".news-prev",
              nextEl: ".news-next",
            }}
            spaceBetween={24}
            speed={850}
            grabCursor
            watchOverflow
            breakpoints={{
              0: {
                slidesPerView: 1.1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 1.35,
                spaceBetween: 18,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1100: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {visibleVideos.map((video) => {
              const isPreviewing =
                canPreviewOnHover && hoveredVideoId === video.id;
              const previewUrl = getYouTubeEmbedUrl(video.videoUrl, {
                autoplay: true,
                muted: true,
                controls: false,
                loop: true,
              });

              return (
                <SwiperSlide key={video.id}>
                  <article
                    className={`news-card ${isPreviewing ? "is-previewing" : ""}`}
                    onMouseEnter={() => {
                      if (!canPreviewOnHover) return;
                      setHoveredVideoId(video.id);
                    }}
                    onMouseLeave={() => {
                      if (!canPreviewOnHover) return;
                      setHoveredVideoId((current) =>
                        current === video.id ? null : current,
                      );
                    }}
                  >
                    <button
                      type="button"
                      className="news-media"
                      onClick={() => setActiveVideo(video)}
                      aria-label={`Play ${video.title}`}
                    >
                      {!isPreviewing && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="news-thumbnail"
                          onError={(event) => {
                            const target = event.currentTarget;
                            if (target.src !== video.fallbackThumbnail) {
                              target.src = video.fallbackThumbnail;
                            }
                          }}
                        />
                      )}

                      {isPreviewing && previewUrl && (
                        <div className="news-preview-player">
                          <iframe
                            src={previewUrl}
                            title={`${video.title} preview`}
                            allow="autoplay; encrypted-media; picture-in-picture"
                            tabIndex={-1}
                          />
                        </div>
                      )}

                      <span className="news-media-overlay" />
                      <span className="news-play-btn">
                        <Play size={22} fill="currentColor" strokeWidth={1.7} />
                      </span>
                    </button>

                    <div className="news-card-body">
                      <span className="news-card-category">
                        {video.category}
                      </span>

                      <h3 className="news-card-title">{video.title}</h3>

                      <p className="news-card-description">
                        {video.description}
                      </p>

                      <div className="news-card-date">
                        <Calendar size={15} strokeWidth={1.7} />

                        <span>{video.date}</span>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="news-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="news-modal-dialog"
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="news-modal-close"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
              >
                <X size={20} strokeWidth={1.8} />
              </button>

              <div className="news-modal-player-wrap">
                {getYouTubeEmbedUrl(activeVideo.videoUrl, {
                  autoplay: true,
                  controls: true,
                }) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeVideo.videoUrl, {
                      autoplay: true,
                      controls: true,
                    })}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    Invalid video URL.
                  </div>
                )}
              </div>

              <div className="news-modal-meta">
                <span className="news-card-category">
                  {activeVideo.category}
                </span>

                <h3 className="news-modal-title">{activeVideo.title}</h3>

                <p className="news-modal-description">
                  {activeVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
