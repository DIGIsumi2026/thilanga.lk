import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Rewind,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {AnimatePresence,motion} from 'framer-motion';
import {animate,stagger} from 'animejs';
import {gsap} from 'gsap';
import {imageAssets} from '../../assets/imageAssets';
import {videoAssets} from '../../assets/videoAssets';

type StadiumGalleryImage = {
  id:string;
  src:string;
  alt:string;
};

const stadiumGallery:StadiumGalleryImage[] = [
  {
    id:'dambulla-01',
    src:imageAssets.corporate.dambulla.image01,
    alt:'Rangiri Dambulla International Cricket Stadium construction',
  },
  {
    id:'dambulla-02',
    src:imageAssets.corporate.dambulla.image02,
    alt:'Early construction work at Rangiri Dambulla International Cricket Stadium',
  },
  {
    id:'dambulla-03',
    src:imageAssets.corporate.dambulla.image03,
    alt:'Structural construction of Rangiri Dambulla International Cricket Stadium',
  },
  {
    id:'dambulla-04',
    src:imageAssets.corporate.dambulla.image04,
    alt:'Completed Rangiri Dambulla International Cricket Stadium',
  },
  {
    id:'dambulla-05',
    src:imageAssets.corporate.dambulla.image05,
    alt:'Aerial view of Rangiri Dambulla International Cricket Stadium',
  },
  {
    id:'dambulla-06',
    src:imageAssets.corporate.dambulla.image06,
    alt:'Rangiri Dambulla International Cricket Stadium aerial view',
  },
];

const firstParagraph =
  'As President of the Board of Control for Cricket in Sri Lanka, Thilanga Sumathipala played a central role in championing the development of the Rangiri Dambulla International Cricket Stadium. Conceived as a strategically located dry-zone venue capable of hosting international cricket with reduced disruption from monsoon weather, the project also represented an important step in expanding major cricket infrastructure beyond the traditional centres in Colombo.';

const expandedParagraphs = [
  'Under his leadership, the stadium was taken from concept to completion within an exceptionally short construction period. The project is widely associated with a reported completion time of approximately 167 days, reflecting an ambitious combination of planning, coordination and execution. The venue subsequently emerged as one of Sri Lanka’s distinctive international cricket grounds.',
  'Beyond the speed of construction, the significance of Dambulla lay in its long-term strategic value. The venue strengthened Sri Lanka’s ability to stage international cricket in the country’s dry zone and demonstrated how infrastructure development could respond directly to climatic and operational challenges. The project remains closely associated with Sumathipala’s period of leadership in Sri Lankan cricket and his emphasis on development, regional expansion and institutional progress.',
];

export default function DambullaLegacy() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const expandableRef = useRef<HTMLDivElement | null>(null);
  const expandableInnerRef = useRef<HTMLDivElement | null>(null);

  const videoPlayerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimerRef = useRef<number | null>(null);

  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const galleryTrackRef = useRef<HTMLDivElement | null>(null);
  const gallerySequenceRef = useRef<HTMLDivElement | null>(null);
  const galleryWasDraggedRef = useRef(false);

  const [expanded,setExpanded] = useState(false);
  const [activeImage,setActiveImage] = useState<number | null>(null);
  const [isPlaying,setIsPlaying] = useState(false);
  const [isMuted,setIsMuted] = useState(true);
  const [isBuffering,setIsBuffering] = useState(false);
  const [controlsVisible,setControlsVisible] = useState(true);
  const [currentTime,setCurrentTime] = useState(0);
  const [duration,setDuration] = useState(0);
  const [isFullscreen,setIsFullscreen] = useState(false);
  const [isPseudoFullscreen,setIsPseudoFullscreen] = useState(false);

  const clearControlsTimer = useCallback(() => {
    if (controlsTimerRef.current !== null) {
      window.clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
  },[]);

  const scheduleControlsHide = useCallback(() => {
    clearControlsTimer();
    controlsTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
      controlsTimerRef.current = null;
    },2500);
  },[clearControlsTimer]);

  const revealControls = useCallback(() => {
    setControlsVisible(true);

    if (videoRef.current && !videoRef.current.paused) {
      scheduleControlsHide();
    }
  },[scheduleControlsHide]);

  const togglePlayback = useCallback(async () => {
    const video = videoRef.current;

    if (!video) return;

    revealControls();

    if (video.paused || video.ended) {
      setIsBuffering(true);

      try {
        await video.play();
      } catch {
        setIsBuffering(false);
        setIsPlaying(false);
      }

      return;
    }

    video.pause();
  },[revealControls]);

  const skipVideo = useCallback((seconds:number) => {
    const video = videoRef.current;

    if (!video) return;

    const videoDuration = Number.isFinite(video.duration)
      ? video.duration
      : 0;

    video.currentTime = seconds < 0
      ? Math.max(0,video.currentTime + seconds)
      : Math.min(videoDuration,video.currentTime + seconds);
    setCurrentTime(video.currentTime);
    revealControls();
  },[revealControls]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
    revealControls();
  },[revealControls]);

  const toggleFullscreen = useCallback(async () => {
    const player = videoPlayerRef.current;

    if (!player) return;

    revealControls();

    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (window.matchMedia('(max-width: 600px)').matches) {
      setIsPseudoFullscreen(true);
      return;
    }

    if (player.requestFullscreen) {
      try {
        await player.requestFullscreen();
        return;
      } catch {
        setIsPseudoFullscreen(true);
        return;
      }
    }

    setIsPseudoFullscreen(true);
  },[isPseudoFullscreen,revealControls]);

  const playerFullscreen = isFullscreen || isPseudoFullscreen;
  const videoProgress = duration > 0
    ? Math.min(100,(currentTime / duration) * 100)
    : 0;

  const handleVideoKeyDown = (
    event:React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.closest('button')
    ) return;

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      void togglePlayback();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      skipVideo(-5);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      skipVideo(5);
    }

    if (event.key.toLowerCase() === 'm') {
      event.preventDefault();
      toggleMute();
    }

    if (event.key === 'Escape' && isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const heading = section.querySelector<HTMLElement>(
      '.dambulla-legacy-heading',
    );

    const video = section.querySelector<HTMLElement>(
      '.dambulla-legacy-video-wrap',
    );

    const intro = section.querySelector<HTMLElement>(
      '.dambulla-legacy-intro',
    );

    const gallery = section.querySelector<HTMLElement>(
      '.dambulla-gallery',
    );

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      [heading,video,intro,gallery].forEach((element) => {
        if (element) element.style.opacity = '1';
      });

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const elements = [
          heading,
          video,
          intro,
          gallery,
        ].filter(Boolean) as HTMLElement[];

        animate(elements,{
          opacity:[0,1],
          translateY:[32,0],
          delay:stagger(130),
          duration:900,
          ease:'outExpo',
        });

        observer.disconnect();
      },
      {
        threshold:0.1,
        rootMargin:'0px 0px -8% 0px',
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  },[]);

  useEffect(() => {
    const container = expandableRef.current;
    const inner = expandableInnerRef.current;

    if (!container || !inner) return;

    gsap.killTweensOf(container);

    if (expanded) {
      gsap.set(container,{
        display:'block',
      });

      gsap.fromTo(container,{
        height:0,
        opacity:0,
      },{
        height:inner.scrollHeight,
        opacity:1,
        duration:0.85,
        ease:'power4.out',
        onComplete:() => {
          gsap.set(container,{
            height:'auto',
          });
        },
      });

      gsap.fromTo(
        inner.querySelectorAll('p'),
        {
          opacity:0,
          y:18,
        },
        {
          opacity:1,
          y:0,
          duration:0.6,
          stagger:0.1,
          delay:0.15,
          ease:'power3.out',
        },
      );

      return;
    }

    if (container.offsetHeight === 0) return;

    gsap.to(container,{
      height:0,
      opacity:0,
      duration:0.65,
      ease:'power3.inOut',
      onComplete:() => {
        gsap.set(container,{
          display:'none',
        });
      },
    });
  },[expanded]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === videoPlayerRef.current,
      );
    };

    document.addEventListener('fullscreenchange',handleFullscreenChange);

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange,
      );
    };
  },[]);

  useEffect(() => {
    if (!isPseudoFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  },[isPseudoFullscreen]);

  useEffect(() => () => {
    clearControlsTimer();
  },[clearControlsTimer]);

  useLayoutEffect(() => {
    const viewport = galleryViewportRef.current;
    const track = galleryTrackRef.current;
    const sequence = gallerySequenceRef.current;

    if (!viewport || !track || !sequence) return;

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const finePointerQuery = window.matchMedia(
      '(hover:hover) and (pointer:fine)',
    );

    let reducedMotion = reducedMotionQuery.matches;
    let galleryVisible = false;
    let documentVisible = !document.hidden;
    let isInteracting = false;
    let isDragging = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let scrollStart = 0;
    let sequenceWidth = 0;
    let frameId:number | null = null;
    let resumeTimer:number | null = null;
    let lastFrameTime = 0;

    const measure = () => {
      const gap = parseFloat(
        getComputedStyle(track).gap || '0',
      );

      sequenceWidth = sequence.offsetWidth + gap;
    };

    const stopAutoScroll = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const canAutoScroll = () => (
      galleryVisible &&
      documentVisible &&
      !isInteracting &&
      activeImage === null &&
      !reducedMotion &&
      sequenceWidth > 0
    );

    const autoScroll = (time:number) => {
      if (!canAutoScroll()) {
        frameId = null;
        return;
      }

      const elapsed = Math.min(time - lastFrameTime,64);
      const speed = window.innerWidth <= 600 ? 18 : 26;
      const nextPosition = viewport.scrollLeft +
        (speed * elapsed) / 1000;

      viewport.scrollLeft = nextPosition >= sequenceWidth
        ? nextPosition - sequenceWidth
        : nextPosition;
      lastFrameTime = time;
      frameId = requestAnimationFrame(autoScroll);
    };

    const startAutoScroll = () => {
      if (frameId !== null || !canAutoScroll()) return;

      lastFrameTime = performance.now();
      frameId = requestAnimationFrame(autoScroll);
    };

    const refreshGalleryVisibility = () => {
      const bounds = viewport.getBoundingClientRect();
      galleryVisible = bounds.bottom > 0 &&
        bounds.top < window.innerHeight;

      if (galleryVisible) startAutoScroll();
      else stopAutoScroll();
    };

    const clearResumeTimer = () => {
      if (resumeTimer !== null) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    };

    const pauseForInteraction = () => {
      clearResumeTimer();
      isInteracting = true;
      stopAutoScroll();
    };

    const scheduleResume = () => {
      clearResumeTimer();
      resumeTimer = window.setTimeout(() => {
        const bounds = viewport.getBoundingClientRect();
        galleryVisible = bounds.bottom > 0 &&
          bounds.top < window.innerHeight;

        if (sequenceWidth > 0 && viewport.scrollLeft >= sequenceWidth) {
          viewport.scrollLeft %= sequenceWidth;
        }

        isInteracting = false;
        resumeTimer = null;
        startAutoScroll();
      },1000);
    };

    const handlePointerDown = (event:PointerEvent) => {
      if (event.button !== 0) return;

      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      scrollStart = viewport.scrollLeft;
      galleryWasDraggedRef.current = false;
      galleryVisible = true;
      pauseForInteraction();

      if (finePointerQuery.matches && event.pointerType !== 'touch') {
        isDragging = true;
        viewport.classList.add('is-dragging');
        viewport.setPointerCapture(event.pointerId);
      }
    };

    const handlePointerMove = (event:PointerEvent) => {
      const distanceX = event.clientX - pointerStartX;
      const distanceY = event.clientY - pointerStartY;

      if (
        Math.abs(distanceX) > 7 &&
        Math.abs(distanceX) > Math.abs(distanceY)
      ) {
        galleryWasDraggedRef.current = true;
      }

      if (!isDragging) return;

      viewport.scrollLeft = scrollStart - distanceX;
    };

    const finishPointerInteraction = (event:PointerEvent) => {
      if (
        viewport.hasPointerCapture(event.pointerId)
      ) {
        viewport.releasePointerCapture(event.pointerId);
      }

      isDragging = false;
      viewport.classList.remove('is-dragging');
      scheduleResume();
    };

    const handleWheel = (event:WheelEvent) => {
      const horizontal = Math.abs(event.deltaX) >
        Math.abs(event.deltaY);

      if (!horizontal && !event.shiftKey) return;

      pauseForInteraction();

      if (event.shiftKey && !horizontal) {
        event.preventDefault();
        viewport.scrollLeft += event.deltaY;
      }

      scheduleResume();
    };

    const handleVisibilityChange = () => {
      documentVisible = !document.hidden;

      if (documentVisible) startAutoScroll();
      else stopAutoScroll();
    };

    const handleReducedMotionChange = () => {
      reducedMotion = reducedMotionQuery.matches;

      if (reducedMotion) stopAutoScroll();
      else startAutoScroll();
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();

      if (sequenceWidth > 0 && viewport.scrollLeft >= sequenceWidth) {
        viewport.scrollLeft %= sequenceWidth;
      }
    });

    resizeObserver.observe(sequence);

    const intersectionObserver = new IntersectionObserver(
      () => refreshGalleryVisibility(),
      {threshold:0.02},
    );

    intersectionObserver.observe(viewport);
    viewport.addEventListener('pointerdown',handlePointerDown);
    viewport.addEventListener('pointermove',handlePointerMove);
    window.addEventListener('pointerup',finishPointerInteraction);
    window.addEventListener('pointercancel',finishPointerInteraction);
    viewport.addEventListener('wheel',handleWheel,{passive:false});
    window.addEventListener('scroll',refreshGalleryVisibility,{passive:true});
    document.addEventListener('visibilitychange',handleVisibilityChange);
    reducedMotionQuery.addEventListener(
      'change',
      handleReducedMotionChange,
    );

    if (activeImage === null) {
      resumeTimer = window.setTimeout(startAutoScroll,400);
    }

    refreshGalleryVisibility();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      stopAutoScroll();
      clearResumeTimer();
      viewport.classList.remove('is-dragging');
      viewport.removeEventListener('pointerdown',handlePointerDown);
      viewport.removeEventListener('pointermove',handlePointerMove);
      window.removeEventListener('pointerup',finishPointerInteraction);
      window.removeEventListener('pointercancel',finishPointerInteraction);
      viewport.removeEventListener('wheel',handleWheel);
      window.removeEventListener('scroll',refreshGalleryVisibility);
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
      reducedMotionQuery.removeEventListener(
        'change',
        handleReducedMotionChange,
      );
    };
  },[activeImage]);

  const isLightboxOpen = activeImage !== null;

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null);
      }

      if (event.key === 'ArrowLeft') {
        setActiveImage((current) => {
          if (current === null) return null;

          return (
            current - 1 + stadiumGallery.length
          ) % stadiumGallery.length;
        });
      }

      if (event.key === 'ArrowRight') {
        setActiveImage((current) => {
          if (current === null) return null;

          return (
            current + 1
          ) % stadiumGallery.length;
        });
      }
    };

    window.addEventListener('keydown',handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown',handleKeyDown);
    };
  },[isLightboxOpen]);

  const previousImage = () => {
    setActiveImage((current) => {
      if (current === null) return null;

      return (
        current - 1 + stadiumGallery.length
      ) % stadiumGallery.length;
    });
  };

  const nextImage = () => {
    setActiveImage((current) => {
      if (current === null) return null;

      return (
        current + 1
      ) % stadiumGallery.length;
    });
  };

  const renderGalleryImages = (duplicate = false) =>
    stadiumGallery.map((image,index) => (
      <button
        key={`${image.id}-${duplicate ? 'duplicate' : 'original'}`}
        type="button"
        className="corporate-gallery-item"
        aria-hidden={duplicate || undefined}
        tabIndex={duplicate ? -1 : 0}
        aria-label={duplicate ? undefined : `Open ${image.alt}`}
        onClick={() => setActiveImage(index)}
      >
        <img
          src={image.src}
          alt={duplicate ? '' : image.alt}
          loading="lazy"
          decoding="async"
          draggable="false"
        />

        <span className="corporate-gallery-item-overlay" />
      </button>
    ));

  return (
    <>
      <section
        ref={sectionRef}
        className="dambulla-legacy"
      >
        <div className="dambulla-legacy-container">
          <header className="dambulla-legacy-heading">
            <span className="dambulla-legacy-kicker">
              From Vision to Reality
            </span>

            <h2>
              Rangiri Dambulla
              <br />
              International Cricket Stadium
            </h2>
          </header>

          <div
            ref={videoPlayerRef}
            className={`dambulla-legacy-video-wrap${
              controlsVisible || !isPlaying || isBuffering
                ? ' are-controls-visible'
                : ''
            }${isPlaying ? ' is-playing' : ''}${
              isBuffering ? ' is-buffering' : ''
            }${isPseudoFullscreen ? ' is-pseudo-fullscreen' : ''}`}
            tabIndex={0}
            role="region"
            aria-label="Rangiri Dambulla stadium construction video player"
            onKeyDown={handleVideoKeyDown}
            onMouseEnter={revealControls}
            onMouseMove={revealControls}
            onFocus={revealControls}
            onPointerDown={revealControls}
          >
            <video
              ref={videoRef}
              className="dambulla-legacy-video"
              src={videoAssets.dambulla.timelapse}
              muted
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              onClick={revealControls}
              onPlay={() => {
                setIsPlaying(true);
                setControlsVisible(true);
              }}
              onPlaying={() => {
                setIsPlaying(true);
                setIsBuffering(false);
                scheduleControlsHide();
              }}
              onPause={() => {
                setIsPlaying(false);
                setIsBuffering(false);
                clearControlsTimer();
                setControlsVisible(true);
              }}
              onEnded={() => {
                setIsPlaying(false);
                setIsBuffering(false);
                clearControlsTimer();
                setControlsVisible(true);
              }}
              onWaiting={() => {
                if (!videoRef.current?.paused) {
                  setIsBuffering(true);
                  setControlsVisible(true);
                }
              }}
              onStalled={() => {
                if (!videoRef.current?.paused) {
                  setIsBuffering(true);
                  setControlsVisible(true);
                }
              }}
              onCanPlay={() => setIsBuffering(false)}
              onSeeked={() => setIsBuffering(false)}
              onError={() => {
                setIsBuffering(false);
                setIsPlaying(false);
                clearControlsTimer();
                setControlsVisible(true);
              }}
              onSeeking={() => {
                if (!videoRef.current?.paused) setIsBuffering(true);
              }}
              onLoadedMetadata={(event) => {
                setDuration(
                  Number.isFinite(event.currentTarget.duration)
                    ? event.currentTarget.duration
                    : 0,
                );
                setCurrentTime(event.currentTarget.currentTime);
              }}
              onDurationChange={(event) => {
                setDuration(
                  Number.isFinite(event.currentTarget.duration)
                    ? event.currentTarget.duration
                    : 0,
                );
              }}
              onTimeUpdate={(event) => {
                setCurrentTime(event.currentTarget.currentTime);
              }}
              onVolumeChange={(event) => {
                setIsMuted(event.currentTarget.muted);
              }}
            />

            <span className="dambulla-video-gradient" />

            <AnimatePresence initial={false}>
              {!isPlaying && !isBuffering && (
                <motion.button
                  type="button"
                  className="dambulla-video-center-play"
                  initial={{opacity:0,scale:0.9,x:'-50%',y:'-50%'}}
                  animate={{opacity:1,scale:1,x:'-50%',y:'-50%'}}
                  exit={{opacity:0,scale:0.9,x:'-50%',y:'-50%'}}
                  transition={{duration:0.24}}
                  onClick={(event) => {
                    event.stopPropagation();
                    void togglePlayback();
                  }}
                  aria-label="Play video"
                >
                  <Play size={25} strokeWidth={1.7} fill="currentColor" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {isBuffering && (
                <motion.div
                  className="dambulla-video-buffering"
                  initial={{opacity:0}}
                  animate={{opacity:1}}
                  exit={{opacity:0}}
                  transition={{duration:0.2}}
                  role="status"
                  aria-live="polite"
                >
                  <span className="dambulla-video-buffer-spinner" />
                  <small>Buffering</small>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="dambulla-video-controls">
              <div
                className="dambulla-video-progress"
                aria-hidden="true"
              >
                <span style={{width:`${videoProgress}%`}} />
              </div>

              <div className="dambulla-video-controls-row">
                <div className="dambulla-video-control-group">
                  <button
                    type="button"
                    className="dambulla-video-control is-skip"
                    onClick={() => skipVideo(-5)}
                    aria-label="Go back 5 seconds"
                  >
                    <Rewind size={20} strokeWidth={1.7} />
                    <small>5</small>
                  </button>

                  <button
                    type="button"
                    className="dambulla-video-control is-primary"
                    onClick={() => void togglePlayback()}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    aria-pressed={isPlaying}
                  >
                    {isPlaying
                      ? <Pause size={20} strokeWidth={1.7} fill="currentColor" />
                      : <Play size={20} strokeWidth={1.7} fill="currentColor" />}
                  </button>

                  <button
                    type="button"
                    className="dambulla-video-control is-skip"
                    onClick={() => skipVideo(5)}
                    aria-label="Go forward 5 seconds"
                  >
                    <FastForward size={20} strokeWidth={1.7} />
                    <small>5</small>
                  </button>
                </div>

                <div className="dambulla-video-control-group is-secondary">
                  <button
                    type="button"
                    className="dambulla-video-control"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    aria-pressed={!isMuted}
                  >
                    {isMuted
                      ? <VolumeX size={20} strokeWidth={1.7} />
                      : <Volume2 size={20} strokeWidth={1.7} />}
                  </button>

                  <button
                    type="button"
                    className="dambulla-video-control"
                    onClick={() => void toggleFullscreen()}
                    aria-label={playerFullscreen
                      ? 'Exit full screen'
                      : 'Enter full screen'}
                    aria-pressed={playerFullscreen}
                  >
                    {playerFullscreen
                      ? <Minimize2 size={19} strokeWidth={1.7} />
                      : <Maximize2 size={19} strokeWidth={1.7} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="dambulla-legacy-story">
            <p className="dambulla-legacy-intro">
              {firstParagraph}
            </p>

            <div
              ref={expandableRef}
              className="dambulla-legacy-expandable"
            >
              <div
                ref={expandableInnerRef}
                className="dambulla-legacy-expandable-inner"
              >
                {expandedParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`dambulla-see-more ${
                expanded ? 'is-expanded' : ''
              }`}
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
            >
              <span>
                {expanded ? 'See less' : 'See more'}
              </span>

              <span className="dambulla-see-more-icon">
                <ChevronDown size={17} strokeWidth={1.6} />
              </span>
            </button>
          </div>

          <div className="dambulla-gallery">
            <div className="dambulla-gallery-meta">
              <span>01</span>
              <i />
              <small>
                From construction to international venue
              </small>
            </div>

            <div
              ref={galleryViewportRef}
              className="dambulla-gallery-row"
              onClickCapture={(event) => {
                if (!galleryWasDraggedRef.current) return;

                event.preventDefault();
                event.stopPropagation();
                galleryWasDraggedRef.current = false;
              }}
            >
              <div
                ref={galleryTrackRef}
                className="dambulla-gallery-track"
              >
                <div
                  ref={gallerySequenceRef}
                  className="dambulla-gallery-sequence"
                >
                  {renderGalleryImages()}
                </div>

                <div
                  className="dambulla-gallery-sequence"
                  aria-hidden="true"
                >
                  {renderGalleryImages(true)}
                </div>
              </div>
            </div>

            <div className="dambulla-gallery-hint" aria-hidden="true">
              <ChevronLeft size={14} strokeWidth={1.4} />
              <span className="is-desktop">Drag to explore</span>
              <span className="is-mobile">Swipe to explore</span>
              <ChevronRight size={14} strokeWidth={1.4} />
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage !== null && (
          <motion.div
            className="corporate-gallery-lightbox"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.25}}
            onClick={() => setActiveImage(null)}
          >
            <button
              type="button"
              className="corporate-gallery-lightbox-close"
              onClick={() => setActiveImage(null)}
              aria-label="Close image"
            >
              <X size={22} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              className="corporate-gallery-lightbox-nav is-prev"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} strokeWidth={1.5} />
            </button>

            <motion.div
              key={stadiumGallery[activeImage].id}
              className="corporate-gallery-lightbox-stage"
              initial={{opacity:0,scale:0.96}}
              animate={{opacity:1,scale:1}}
              transition={{
                duration:0.38,
                ease:[0.22,1,0.36,1],
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={stadiumGallery[activeImage].src}
                alt={stadiumGallery[activeImage].alt}
              />

              <span className="corporate-gallery-lightbox-counter">
                {String(activeImage + 1).padStart(2,'0')}
                <i />
                {String(stadiumGallery.length).padStart(2,'0')}
              </span>
            </motion.div>

            <button
              type="button"
              className="corporate-gallery-lightbox-nav is-next"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={26} strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
