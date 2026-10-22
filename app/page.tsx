"use client";

import { type CSSProperties, useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  AGENDA,
  AI_AGENT_PROJECTS,
  APPLY_URL,
  ATTENDEE_ROWS,
  EVENT_STATS,
  LABORATORIES,
  SESSION_FORMATS,
  SPEAKERS,
  TOMIRIS_PROJECTS,
  type Project,
  type Session,
  type Speaker,
} from "./data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function ApplyLink({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <a className={className} href={APPLY_URL} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function DotPattern({
  glyph = "+",
  rows,
  cols,
  className = "",
}: {
  glyph?: string;
  rows: number;
  cols: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`dot-grid ${className}`}
      style={{ "--dot-cols": cols } as CSSProperties}
    >
      {Array.from({ length: rows * cols }, (_, index) => (
        <span key={index}>{glyph}</span>
      ))}
    </span>
  );
}

const ROBOFLOW_MARKS = [
  ["/figma/vector-8.svg", 0, 37.28, 8.21, 60.8],
  ["/figma/vector-4.svg", 9.01, 36.15, 13.24, 63.86],
  ["/figma/vector-2.svg", 23.37, 1.03, 12.78, 98.97],
  ["/figma/vector-6.svg", 37.24, 36.14, 13.2, 63.87],
  ["/figma/vector-7.svg", 51.19, 0, 7.99, 98.07],
  ["/figma/vector-1.svg", 60.59, 1.11, 3.93, 97.01],
  ["/figma/vector-5.svg", 65.68, 36.14, 13.21, 63.87],
  ["/figma/vector-3.svg", 78.09, 37.95, 21.91, 60.15],
] as const;

function RoboflowWordmark({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span role="img" aria-label="Roboflow" className={`relative inline-block aspect-[290.84/53.22] ${className}`}>
      {ROBOFLOW_MARKS.map(([src, left, top, width, height]) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute ${dark ? "asset-dark" : ""}`}
          style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
        />
      ))}
    </span>
  );
}

function useReveals() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reduced) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isAlreadyVisible = rect.bottom > 0 && rect.top < window.innerHeight * 0.92;

      if (isAlreadyVisible) {
        element.classList.add("is-visible");
      } else {
        observer.observe(element);
      }
    });
    return () => observer.disconnect();
  }, []);
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const frame = frameRef.current;

    if (!dot || !frame) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    let targetX = -100;
    let targetY = -100;

    let dotX = -100;
    let dotY = -100;

    let frameX = -100;
    let frameY = -100;

    let animationFrame = 0;

    const move = (event: globalThis.MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      dot.style.opacity = "1";
      frame.style.opacity = "1";

      const element = event.target;

      const isInteractive =
        element instanceof Element &&
        element.closest(
          'a, button, input, [data-cursor="hover"]'
        );

      frame.dataset.hover = isInteractive
        ? "true"
        : "false";
    };

    const leave = () => {
      dot.style.opacity = "0";
      frame.style.opacity = "0";
    };

    const animate = () => {
      // Точка двигается быстрее
      dotX += (targetX - dotX) * 0.35;
      dotY += (targetY - dotY) * 0.35;

      // Рамка двигается медленнее
      frameX += (targetX - frameX) * 0.14;
      frameY += (targetY - frameY) * 0.14;

      dot.style.transform =
        `translate3d(${dotX}px, ${dotY}px, 0)`;

      frame.style.transform =
        `translate3d(${frameX}px, ${frameY}px, 0)`;

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener(
      "mouseleave",
      leave
    );

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener(
        "mouseleave",
        leave
      );

      cancelAnimationFrame(animationFrame);

      document.documentElement.classList.remove(
        "has-custom-cursor"
      );
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="summit-cursor-dot"
      />

      <div
        ref={frameRef}
        aria-hidden="true"
        className="summit-cursor-frame"
      >
        <div className="summit-cursor-frame-inner">
          <span className="summit-cursor-corner summit-cursor-tl" />
          <span className="summit-cursor-corner summit-cursor-tr" />
          <span className="summit-cursor-corner summit-cursor-bl" />
          <span className="summit-cursor-corner summit-cursor-br" />
        </div>
      </div>
    </>
  );
}

function StickyHeader() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > Math.min(window.innerHeight * 0.8, 760));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <header className="sticky-enter fixed inset-x-0 top-0 z-50 border-b border-cream/10 bg-ink/85 text-cream backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <a href="#top" aria-label="Digital Lady Technopark" className="font-bold tracking-[-0.04em] text-lavender">
          DLT
        </a>
        <p className="hidden font-mono text-[10px] tracking-widest text-cream/50 uppercase sm:block">
          OCT 22 2026 · SAN FRANCISCO
        </p>
        <ApplyLink className="border border-lavender bg-lavender px-4 py-2 font-mono text-[10px] tracking-widest text-ink uppercase transition-colors hover:bg-transparent hover:text-lavender">
          Apply to attend
        </ApplyLink>
      </div>
    </header>
  );
}

const HERO_DETECTIONS = [
  { label: "DIGITAL", confidence: "0.98" },
  { label: "LADY", confidence: "0.99" },
  { label: "TECHNOPARK", confidence: "0.97" },
];

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const visLayerRef = useRef<HTMLDivElement>(null);
  const visRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const markWrapRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const presentedRef = useRef<HTMLDivElement>(null);

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const detectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const visLayer = visLayerRef.current;
    const vis = visRef.current;
    const title = titleRef.current;
    const markWrap = markWrapRef.current;
    const mark = markRef.current;
    const presented = presentedRef.current;

    if (
      !section ||
      !visLayer ||
      !vis ||
      !title ||
      !markWrap ||
      !mark ||
      !presented
    ) {
      return;
    }

    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const detections = detectionRefs.current.filter(Boolean) as HTMLDivElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLSpanElement[];
    const titleWords = Array.from(
      title.querySelectorAll<HTMLElement>(".word-inner"),
    );

    let resizeFrame = 0;
    let active = true;
    let media: gsap.MatchMedia | undefined;

    const measureDetections = () => {
      const canvas = document.createElement("canvas");
      const canvasContext = canvas.getContext("2d");

      if (!canvasContext) return;

      const visRect = vis.getBoundingClientRect();
      const visStyles = getComputedStyle(vis);

      canvasContext.font = `${visStyles.fontWeight} ${visStyles.fontSize} ${visStyles.fontFamily}`;

      letters.forEach((letter, index) => {
        const detection = detectionRefs.current[index];

        if (!detection) return;

        const letterRect = letter.getBoundingClientRect();
        const metrics = canvasContext.measureText(
          letter.textContent ?? "",
        );

        const ascent = metrics.actualBoundingBoxAscent;
        const descent = metrics.actualBoundingBoxDescent;
        const fontAscent =
          metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent;

        const letterWidth =
          metrics.actualBoundingBoxLeft +
          metrics.actualBoundingBoxRight;

        const letterHeight = ascent + descent;
        const padding = Math.max(6, letterHeight * 0.03);

        detection.style.left = `${
          letterRect.left -
          visRect.left -
          metrics.actualBoundingBoxLeft -
          padding
        }px`;

        detection.style.top = `${
          letterRect.top -
          visRect.top +
          fontAscent -
          ascent -
          padding
        }px`;

        detection.style.width = `${letterWidth + padding * 2}px`;
        detection.style.height = `${letterHeight + padding * 2}px`;
      });
    };

    const context = gsap.context(() => {
      measureDetections();

      document.fonts?.ready.then(() => {
        if (!active) return;

        measureDetections();
        ScrollTrigger.refresh();
      });

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(vis, {
          opacity: 1,
          letterSpacing: "-0.06em",
        });

        gsap.set(titleWords, { yPercent: 0 });
        gsap.set(markWrap, { scale: 1 });
        gsap.set(presented, { opacity: 1, y: 0 });
        gsap.set(detections, { opacity: 0 });

        return;
      }

      gsap.set(vis, {
        opacity: 0,
        letterSpacing: "0.09em",
      });

      gsap.set(titleWords, {
        yPercent: 115,
      });

      gsap.set(detections, {
        opacity: 0,
        scale: 0.9,
        transformOrigin: "top left",
      });

      gsap.set(labels, {
        yPercent: 110,
      });

      gsap.set(markWrap, {
        scale: 0,
        transformOrigin: "center",
      });

      gsap.set(presented, {
        opacity: 0,
        y: 20,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      timeline.to(vis, {
        opacity: 1,
        duration: 0.7,
        ease: "power2.inOut",
      });

      detections.forEach((detection, index) => {
        const startTime = 0.9 + index * 0.75;

        timeline.to(
          detection,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
          },
          startTime,
        );

        if (labels[index]) {
          timeline.to(
            labels[index],
            {
              yPercent: 0,
              duration: 0.45,
              ease: "power3.out",
            },
            startTime + 0.12,
          );
        }
      });

      timeline.to(
        detections,
        {
          opacity: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.inOut",
        },
        3.6,
      );

      timeline.to(
        vis,
        {
          letterSpacing: "-0.06em",
          duration: 1.1,
          ease: "power3.inOut",
        },
        3.75,
      );

      timeline.to(
        titleWords,
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: "power4.out",
        },
        4.15,
      );

      timeline.to(
        markWrap,
        {
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.6)",
        },
        4.55,
      );

      timeline.to(
        presented,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        4.8,
      );

      gsap.fromTo(
        mark,
        { rotation: 0 },
        {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );

      media = gsap.matchMedia();

      media.add(
        {
          mobile: "(max-width: 767px)",
          desktop: "(min-width: 768px)",
        },
        (matchContext) => {
          const conditions = matchContext.conditions as {
            mobile?: boolean;
          };

          const mobile = Boolean(conditions.mobile);

          gsap.fromTo(
            visLayer,
            { yPercent: 0 },
            {
              yPercent: mobile ? -26 : -14,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );

          gsap.fromTo(
            title,
            { yPercent: 0 },
            {
              yPercent: mobile ? 14 : 7,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          );
        },
      );
    }, section);

    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);

      resizeFrame = requestAnimationFrame(() => {
        measureDetections();
        ScrollTrigger.refresh();
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      active = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(resizeFrame);
      media?.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden bg-ink pb-[26vh] text-cream md:pb-[24vh]"
    >
      <header
        data-hero-bar
        className="relative z-20 flex items-center justify-between px-4 pt-5 md:px-8 md:pt-6"
      >
        <p className="font-mono text-xs text-cream/60">
          OCT 22 2026 · SAN FRANCISCO
        </p>

        <ApplyLink className="inline-flex items-center border border-cream/30 px-4 py-2 font-mono text-xs tracking-widest text-cream transition-colors duration-300 hover:border-lavender hover:bg-lavender hover:text-ink">
          APPLY TO ATTEND
        </ApplyLink>
      </header>

      <div
        aria-hidden="true"
        className="hero-loading relative z-20 mx-4 mt-5 h-px bg-cream/10 md:mx-8"
      >
        <span className="hero-loading-beam absolute inset-y-0 left-0 w-1/3 bg-lavender" />
      </div>

      <div className="relative mt-[18vh] px-4 [--hero-f:13.5vw] md:mt-[13vh] md:px-12 md:[--hero-f:12vw]">
        <div className="relative">
          <div
            ref={visLayerRef}
            aria-hidden="true"
            className="absolute left-0 select-none will-change-transform"
            style={{
              top: "calc(var(--hero-f) * 0.1906)",
            }}
          >
            <span
              ref={visRef}
              className="hero-vis relative inline-block font-bold leading-[0.72] text-lavender will-change-transform"
              style={{
                fontSize: "calc(var(--hero-f) * 3.83)",
              }}
            >
              {["D", "L", "T"].map((letter, index) => (
                <span
                  key={letter}
                  ref={(element) => {
                    letterRefs.current[index] = element;
                  }}
                >
                  {letter}
                </span>
              ))}

              {HERO_DETECTIONS.map((detection, index) => (
                <div
                  key={detection.label}
                  ref={(element) => {
                    detectionRefs.current[index] = element;
                  }}
                  className="pointer-events-none absolute border-2 border-cream opacity-0"
                >
                  <span
                    className={`absolute bottom-full block overflow-hidden ${
                      index === 2
                        ? "max-md:-right-0.5 md:-left-0.5"
                        : "-left-0.5"
                    }`}
                  >
                    <span
                      ref={(element) => {
                        labelRefs.current[index] = element;
                      }}
                      className="flex items-baseline gap-1 whitespace-nowrap bg-cream px-1 py-0.5 font-mono text-[8px] font-bold tracking-wide text-ink md:gap-2 md:px-2.5 md:py-1 md:text-xs md:tracking-widest"
                    >
                      {detection.label}

                      <span className="font-normal text-ink/60">
                        {detection.confidence}
                      </span>
                    </span>
                  </span>
                </div>
              ))}

              <span
                ref={markWrapRef}
                className="absolute inline-block w-[0.115em] will-change-transform"
                style={{
                  right: "-0.155em",
                  top: 0,
                }}
              >
                <span
                  ref={markRef}
                  className="block aspect-square w-full bg-lavender will-change-transform"
                  style={{
                    maskImage: "url(/figma/vector-9.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: "url(/figma/vector-9.svg)",
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                  }}
                />
              </span>
            </span>
          </div>

          <h1
            ref={titleRef}
            className="hero-title relative z-10 will-change-transform"
          >
            <span className="block text-[length:var(--hero-f)] font-medium leading-[1.04] tracking-[-0.035em] text-cream">
              {["Digital", "Lady", "Technopark"].map((word) => (
                <span className="block" key={word}>
                  <span className="word-mask">
                    <span className="word-inner">{word}</span>
                  </span>
                </span>
              ))}
            </span>
          </h1>
        </div>

        <div
          ref={presentedRef}
          className="relative z-10 mt-6 flex items-center gap-3 md:mt-8"
        >
          <span className="font-mono text-sm tracking-[0.08em] text-cream/80 md:text-base">
            presented by
          </span>

          <a
            href="https://roboflow.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Roboflow"
          >
            <RoboflowWordmark className="w-28 translate-y-0.5 md:w-36" />
          </a>
        </div>
      </div>

      <div className="absolute bottom-[8vh] right-6 z-0 flex flex-col items-end gap-6 md:right-16 md:gap-8">
        <DotPattern
          rows={5}
          cols={10}
          className="text-lavender/70"
        />

        <DotPattern
          rows={4}
          cols={7}
          className="mr-14 text-cream/25 md:mr-24"
        />
      </div>

      <DotPattern
        rows={3}
        cols={5}
        className="absolute bottom-[30vh] right-[38vw] z-0 text-cream/15 max-md:hidden"
      />
    </section>
  );

}

function Narrative() {
  return (
    <section className="relative overflow-hidden bg-ink text-lavender" aria-label="The conference bringing AI into the physical world">
      <div className="absolute inset-0" aria-hidden="true">
        <video src="/videos/cv-reel.mp4" poster="/videos/cv-reel-poster.webp" autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 40% 45%, transparent 30%, rgba(18,17,16,0.55) 100%)" }} />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-4 pb-24 pt-24 md:px-12 md:pb-32 md:pt-28">
        <div className="reveal relative z-10 md:inline-block">
          <h2 className="text-[13vw] font-normal leading-none tracking-[-0.03em] md:text-[6.8vw]">The conference</h2>
        </div>
        <div className="reveal relative z-10 mt-10 md:ml-[34%] md:mt-[3vw] md:inline-block">
          <h2 className="text-[13vw] font-normal leading-none tracking-[-0.03em] md:text-[6.8vw]">bringing AI</h2>
        </div>
        <div className="reveal relative z-10 mt-14 block md:ml-[12%] md:mt-[6vw]">
          <h2 className="text-[12vw] font-normal leading-none tracking-[-0.03em] md:text-[6.8vw]">into the physical world</h2>
        </div>
      </div>
    </section>
  );
}

function VideoReel({ compact = false }: { compact?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const togglePlayback = () => {
    if (!video.current) return;
    if (video.current.paused) video.current.play().catch(() => undefined);
    else video.current.pause();
  };
  const toggleMute = () => {
    if (!video.current) return;
    video.current.muted = !video.current.muted;
    setMuted(video.current.muted);
  };
  const fullscreen = () => video.current?.requestFullscreen?.().catch(() => undefined);
  return (
    <div className={`relative ${compact ? "mx-auto w-full max-w-[36rem]" : "w-full"}`}>
      <div className="group relative aspect-video w-full overflow-hidden border border-lavender/40">
        <video
          ref={video}
          src="/videos/conference-reel.mp4"
          poster="/videos/conference-reel-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 size-full object-cover"
        />
        <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 size-6 border-l-2 border-t-2 border-lavender" />
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 size-6 border-r-2 border-t-2 border-lavender" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 size-6 border-b-2 border-l-2 border-lavender" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 size-6 border-b-2 border-r-2 border-lavender" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 md:bottom-6 md:left-6">
          <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause the reel" : "Play the reel"} className="flex size-11 items-center justify-center border border-cream/40 bg-ink/70 text-cream backdrop-blur-sm hover:border-cream">
            {playing ? "Ⅱ" : "▶"}
          </button>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute the reel" : "Mute the reel"} className="flex h-11 items-center border border-cream/40 bg-ink/70 px-4 font-mono text-[10px] tracking-widest text-cream uppercase backdrop-blur-sm hover:border-cream">
            {muted ? "Sound off" : "Sound on"}
          </button>
          <button type="button" onClick={fullscreen} aria-label="Watch fullscreen" className="flex size-11 items-center justify-center border border-cream/40 bg-ink/70 text-cream backdrop-blur-sm hover:border-cream">↗</button>
        </div>
      </div>
    </div>
  );
}

const attendeeFit: Record<string, string> = {
  wordmark: "h-[34px] w-[142px] brightness-0 invert",
  compact: "h-[38px] w-16 brightness-0 invert",
  symbol: "size-7 brightness-0 invert",
  raster: "h-[52px] w-[124px] mix-blend-screen [filter:invert(1)_grayscale(1)_brightness(1.9)]",
};

function Attendees() {
  return (
    <section aria-labelledby="attendees-heading" className="mt-16 md:mt-20">
      <h2 id="attendees-heading" className="mb-5 text-xl font-medium tracking-tight md:text-2xl">Attendees from</h2>
      <div aria-hidden="true" className="attendee-window">
        {ATTENDEE_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={`attendee-track ${rowIndex % 2 ? "attendee-track--reverse" : ""}`}>
            {[0, 1].map((copy) => (
              <div key={copy} data-copy={copy} className="attendee-group flex shrink-0">
                {row.map(([name, src, fit]) => (
                  <div key={name} className={`attendee-logo flex h-20 w-[210px] shrink-0 items-center justify-center gap-2 px-6 py-4 opacity-75 ${fit === "raster" ? "bg-ink" : ""}`}>
                    <img src={src} alt="" className={`object-contain ${attendeeFit[fit]}`} />
                    {fit === "symbol" && <span className="text-lg font-medium tracking-tight">{name}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function EventOverview() {
  return (
    <section id="event-overview" aria-label="The summit at a glance" className="bg-ink text-cream">
      <div className="mx-auto max-w-[1500px] px-4 py-16 md:px-12 md:py-24">
        <div className="flex flex-col gap-16 md:flex-row md:items-start md:gap-12 lg:gap-20">
          {SESSION_FORMATS.map((format, index) => (
            <article key={format.name} className={`reveal min-w-0 ${index === 0 ? "md:w-[56%]" : "md:w-[44%] md:pt-40"}`}>
              <div className={index === 0 ? "pl-6 md:pl-12" : "pr-6 md:pr-0"}>
                <img src={format.image} alt={format.alt} loading="lazy" className={`w-full object-cover grayscale ${index === 0 ? "aspect-[5/4] object-[43%_center]" : "aspect-[4/3] object-[40%_center]"}`} />
              </div>
              <h2 className="relative -mt-6 text-[clamp(2.75rem,12vw,5rem)] font-medium leading-none tracking-[-0.065em] text-lavender uppercase md:-mt-9 md:text-[clamp(3rem,7vw,6.5rem)]">{format.name}</h2>
              <div className="pt-6 md:pl-12 md:pt-8">
                <div className="flex max-w-sm flex-col gap-3">
                  <p className="font-mono text-sm tracking-wider text-lavender">{format.kicker}</p>
                  <p className="text-base leading-relaxed text-cream/75">{format.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="reveal pt-16 md:pt-24">
          <p className="flex flex-col text-3xl font-medium leading-[1.3] tracking-tight md:flex-row md:items-baseline md:justify-between md:gap-6 md:text-[clamp(2rem,4.3vw,3.75rem)]">
            {EVENT_STATS.map((stat) => <span className="whitespace-nowrap" key={stat.label}><span className="text-lavender">{stat.figure}</span> {stat.label}</span>)}
          </p>
        </div>
        <Attendees />
      </div>
    </section>
  );
}

const agendaGrid = "md:grid-cols-[6.5rem_repeat(2,minmax(0,1fr))] lg:grid-cols-[8rem_repeat(2,minmax(0,1fr))]";

function SpeakerPile({ speakers, stage }: { speakers: Speaker[]; stage: number }) {
  return (
    <span aria-hidden="true" className="flex shrink-0 flex-col -space-y-3">
      {speakers.map((speaker) => speaker.image ? (
        <img key={speaker.name} src={speaker.image} alt="" loading="lazy" className={`size-12 shrink-0 rounded-full bg-ink object-cover object-[50%_18%] grayscale ring-2 ${stage === 0 ? "ring-lavender-soft" : "ring-stone"}`} />
      ) : (
        <span key={speaker.name} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-cream/80">{speaker.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</span>
      ))}
    </span>
  );
}

function SessionCard({ session, stage }: { session: Session; stage: number }) {
  const speakers = session.speakers ?? [];
  return (
    <article className={`flex flex-1 items-start gap-5 p-5 text-ink md:min-h-52 md:gap-6 md:p-6 ${stage === 0 ? "bg-lavender-soft" : "bg-stone"}`}>
      {speakers.length > 0 && <SpeakerPile speakers={speakers} stage={stage} />}
      <div className="flex min-w-0 flex-col gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/55"><span className="md:sr-only">{stage === 0 ? "Main stage" : "Build stage"} · </span>{session.kind}</p>
        <h3 className="text-pretty text-xl font-medium leading-tight tracking-tight md:text-2xl">{session.title}</h3>
        {speakers.length > 0 && (
          <ul className="flex flex-col gap-1 font-mono text-[0.8125rem] leading-snug text-ink/70">
            {speakers.map((speaker) => <li key={speaker.name}>{speaker.name}{speaker.org ? <><span aria-hidden="true" className="px-1.5 text-ink/35">@</span>{speaker.org}</> : <><span aria-hidden="true" className="px-1.5 text-ink/35">·</span><span className="text-ink/45">{speaker.role}</span></>}</li>)}
          </ul>
        )}
      </div>
    </article>
  );
}

function Agenda() {
  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-24 pt-6 md:px-12 md:pb-32 md:pt-10">
      <section id="agenda" aria-labelledby="agenda-heading" className="scroll-mt-24">
        <header className="flex flex-col justify-between gap-5 py-10 md:flex-row md:items-end md:py-14">
          <h2 id="agenda-heading" className="text-balance text-4xl font-medium tracking-tight md:text-6xl">The agenda</h2>
          <p className="font-mono text-sm leading-relaxed text-ink/70">OCT 22, 2026 / ALL TIMES PACIFIC</p>
        </header>
        <hr className="mb-10 border-ink/10 md:mb-14" />
        <div className={`mb-10 flex flex-col gap-6 md:mb-14 md:grid md:gap-x-3 md:gap-y-0 ${agendaGrid}`}>
          <h3 className="font-mono text-sm text-ink/60 md:pt-1">WHAT TO EXPECT</h3>
          {SESSION_FORMATS.map((format) => <div key={format.name} className="flex flex-col gap-3 md:px-6"><p className="text-pretty text-lg font-medium leading-snug tracking-tight lg:text-xl">{format.name} sessions</p><p className="max-w-md text-base leading-relaxed text-ink/65">{format.body}</p></div>)}
        </div>
        <div aria-hidden="true" className={`hidden pb-4 font-mono text-xs uppercase tracking-[0.08em] text-ink/55 md:grid md:gap-x-3 ${agendaGrid}`}>
          <span>Time / PT</span><span className="px-6">Main stage</span><span className="px-6">Build stage</span>
        </div>
        <ol className="flex flex-col gap-3">
          {AGENDA.map((row) => {
            const times = <p className="flex items-baseline gap-2 font-mono md:flex-col md:gap-0.5"><time dateTime={row.dateTime}>{row.time}</time>{row.endTime && <span>– <time dateTime={row.endDateTime}>{row.endTime}</time></span>}</p>;
            if (row.plenary && !row.card) return (
              <li key={row.dateTime} className={`reveal flex items-baseline gap-4 border-y border-ink/15 py-3.5 text-sm text-ink/55 md:grid md:gap-x-3 ${agendaGrid}`}>
                {times}<p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm md:col-span-2 md:px-6"><span className="uppercase tracking-[0.08em] text-ink/80">{row.plenary.title}</span>{row.plenary.note && <span className="text-ink/45">{row.plenary.note}</span>}</p>
              </li>
            );
            return (
              <li key={row.dateTime} className={`reveal flex flex-col gap-3 md:grid md:gap-x-3 ${agendaGrid}`}>
                <div className="text-base text-ink md:pt-6">{times}</div>
                {row.plenary ? (
                  <article className="flex flex-col gap-3 bg-ink p-5 text-cream md:col-span-2 md:p-6">{row.plenary.kind && <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-cream/60">{row.plenary.kind}</p>}<h3 className="text-pretty text-xl font-medium leading-tight tracking-tight md:text-2xl">{row.plenary.title}</h3>{row.plenary.note && <p className="font-mono text-[0.8125rem] leading-snug text-cream/70">{row.plenary.note}</p>}</article>
                ) : row.stages?.map((stageSessions, stageIndex) => <div key={stageIndex} className={`flex min-w-0 flex-col gap-3 ${stageSessions.length === 0 ? "max-md:hidden" : ""}`}>{stageSessions.map((session) => <SessionCard key={session.title} session={session} stage={stageIndex} />)}</div>)}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Intro() {
  return (
    <section className="relative overflow-hidden bg-cream text-ink">
      <div className="absolute left-4 top-10 flex flex-col gap-5 md:left-10 md:top-16">
        <DotPattern glyph="x" rows={5} cols={8} className="text-lavender/80" />
        <DotPattern rows={6} cols={9} className="text-ink/15" />
      </div>
      <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center gap-10 px-6 py-32 md:min-h-[85svh] md:py-40">
        <h2 className="reveal block text-center text-2xl font-semibold leading-[1.35] tracking-[-0.01em] text-balance md:text-4xl md:leading-[1.3]">Join the world&apos;s most innovative business leaders, founders, and developers pushing AI beyond the screen.</h2>
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-widest md:text-xs"><span className="bg-ink px-2.5 py-1 text-cream">OCT 22 2026</span><span className="bg-lavender px-2.5 py-1 text-ink">SAN FRANCISCO</span></p>
        <VideoReel compact />
      </div>
      <EventOverview />
      <div aria-label="Digital Lady Technopark 2026" className="relative overflow-hidden border-t border-ink/15 py-5 md:py-7">
        <div aria-hidden="true" className="loop-marquee">
          {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 items-center">{Array.from({ length: 3 }, (_, index) => <span key={index} className="flex items-center gap-6 whitespace-nowrap pr-6 text-3xl font-bold tracking-[-0.02em] md:gap-10 md:pr-10 md:text-5xl">Digital Lady Technopark<span className="font-mono font-normal tracking-tight">2026</span><img src="/figma/vector.svg" alt="" className="asset-dark size-6 md:size-9" /></span>)}</div>)}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <p className="font-mono text-xs tracking-widest text-lavender uppercase">DIGITAL LADY TECHNOPARK</p>
        <h2 className="reveal mt-6 block max-w-4xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.02em] md:text-6xl">Наша команда помогает студентам превращать идеи в реальные технологические проекты</h2>
        <ul className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4">
          {SPEAKERS.map((speaker, index) => (
            <li key={speaker.name} className="speaker-card reveal group relative -ml-px -mt-px border border-lavender/30 transition-colors duration-500 hover:border-lavender/60">
              <span className="absolute -left-px -top-px z-10 bg-lavender px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative flex aspect-[4/5] items-end justify-end overflow-hidden p-4 md:p-5">
                <div aria-hidden="true" className="speaker-scan pointer-events-none absolute inset-0">
                  <img
                    src={speaker.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover grayscale"
                    style={{ objectPosition: speaker.imagePosition ?? "50% 18%" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/90 to-transparent" />
                </div>
                <div className="relative text-right"><h3 className="text-2xl font-medium tracking-[-0.01em] md:text-3xl">{speaker.name}</h3><p className="mt-1 text-sm text-lavender">{speaker.role}</p>{speaker.org && <p className="mt-0.5 font-mono text-xs leading-[1.35] tracking-widest text-lavender/70 uppercase">{speaker.org}</p>}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TimePlace() {
  return (
    <section className="relative overflow-hidden bg-cream text-ink">
      <DotPattern rows={4} cols={8} className="pointer-events-none absolute right-8 top-16 text-ink/20 md:right-24" />
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <p className="font-mono text-xs tracking-widest text-ink/60 uppercase">Time &amp; place</p>
        <div className="mt-10 flex flex-col gap-2 md:gap-4"><p className="reveal block text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-7xl">Thursday, October 22, 2026</p><p className="reveal block text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-ink md:text-8xl">San Francisco</p><p className="reveal mt-2 block text-2xl font-medium leading-[1.05] tracking-[-0.01em] text-ink/60 md:text-4xl">The Midway</p></div>
        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-3 font-mono text-xs tracking-widest text-ink/60 uppercase"><span>900 Marin St</span><span aria-hidden="true" className="h-px w-16 bg-ink/30" /><span>37.7460° N, 122.3838° W</span><span aria-hidden="true" className="h-px w-16 bg-ink/30" /><span>Doors 9:00 AM, ends 7:00 PM PT</span><span aria-hidden="true" className="h-px w-16 bg-ink/30" /><span>One day, one room</span></div>
        <div className="mt-14"><ApplyLink className="inline-flex h-14 items-center border-2 border-ink bg-ink px-10 font-mono text-xs tracking-widest text-cream uppercase transition-colors duration-300 hover:bg-transparent hover:text-ink">Apply to attend</ApplyLink></div>
      </div>
    </section>
  );
}

function TicketFace({ side }: { side: "front" | "back" }) {
  const front = side === "front";
  return (
    <div className={`vis-ticket__face vis-ticket__face--${side}`}>
      <div className="vis-ticket__giant" aria-hidden="true">DLT</div><div className="vis-ticket__shine" aria-hidden="true" />
      <div className="vis-ticket__band"><span>{front ? "DLT" : "SFO"}</span><span>{front ? "DLT" : "SFO"}</span></div>
      <div className="vis-ticket__panel"><div className="vis-ticket__frame"><div className="vis-ticket__stamp">{front ? "Admit one · Oct 22 2026" : "See reverse side"}</div><div className="vis-ticket__title">Digital<br />Lady<br />Technopark</div>
        {front ? <><TicketRow label="Attendee" value="ADMIT ONE" first /><TicketRow label="№" value="DLT-2026" mono /><TicketRow label="Venue" value="The Midway · 900 Marin St" small /><div className="vis-ticket__row vis-ticket__row--last"><div className="vis-ticket__fine">Good for one admission on date shown · not redeemable · retain this ticket · one day, one room</div></div></> : <><TicketRow label="Date" value="Oct 22 2026" first /><TicketRow label="Doors" value="9:00 AM PT" /><TicketRow label="Coordinates" value="37.7460° N · 122.3838° W" mono /><div className="vis-ticket__row vis-ticket__row--last"><div className="vis-ticket__fine">Business leaders, founders &amp; developers pushing AI beyond the screen · talks · build sessions · roundtables</div></div></>}
      </div></div>
      <div className="vis-ticket__barcode-wrap"><div className="vis-ticket__barcode" aria-hidden="true" /><div className="vis-ticket__barcode-no">DLT-2026</div></div><div className="vis-ticket__perf" aria-hidden="true"><span /></div><div className="vis-ticket__tagline">Where AI meets the physical world</div><div className="vis-ticket__legal">Unauthorized use, purchase or sale voids this ticket · summit.roboflow.com</div>
    </div>
  );
}

function TicketRow({ label, value, first, mono, small }: { label: string; value: string; first?: boolean; mono?: boolean; small?: boolean }) {
  return <div className={`vis-ticket__row ${first ? "vis-ticket__row--first" : ""}`}><div className="vis-ticket__label">{label}</div><div className={`vis-ticket__value ${mono ? "vis-ticket__value--mono" : ""} ${small ? "vis-ticket__value--small" : ""}`}>{value}</div></div>;
}
function useRotatableTicket() {
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticket = ticketRef.current;
    const card =
      ticket?.querySelector<HTMLDivElement>(
        ".vis-ticket__card"
      );

    if (!ticket || !card) return;

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    let inside = false;
    let dragging = false;
    let animationFrame = 0;

    let baseRotationY = 0;

    let currentRotationX = 0;
    let targetRotationX = 0;

    let currentRotationY = 0;
    let targetRotationY = 0;

    let dragStartX = 0;
    let dragStartRotation = 0;

    const readCurrentRotation = () => {
      try {
        const transform =
          getComputedStyle(card).transform;

        const matrix =
          new DOMMatrixReadOnly(transform);

        const rotationX =
          Math.atan2(matrix.m23, matrix.m22) *
          (180 / Math.PI);

        const rotationY =
          Math.atan2(matrix.m31, matrix.m11) *
          (180 / Math.PI);

        return {
          rotationX,
          rotationY,
        };
      } catch {
        return {
          rotationX: 0,
          rotationY: 0,
        };
      }
    };

    const render = () => {
      currentRotationX +=
        (targetRotationX - currentRotationX) *
        0.14;

      currentRotationY +=
        (targetRotationY - currentRotationY) *
        0.14;

      card.style.transform = `
        rotateX(${currentRotationX}deg)
        rotateY(${baseRotationY + currentRotationY}deg)
      `;

      animationFrame =
        requestAnimationFrame(render);
    };

    const startRendering = () => {
      if (animationFrame) return;

      animationFrame =
        requestAnimationFrame(render);
    };

    const resumeAutomaticRotation = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;

      const angle =
        ((baseRotationY + currentRotationY) %
          360 +
          360) %
        360;

      card.style.transform = "";
      card.style.animation = "";

      // Продолжаем автоматическое вращение
      // примерно с текущего положения
      card.style.animationDelay = `${
        -14 * (angle / 360)
      }s`;
    };

    const handlePointerEnter = () => {
      inside = true;

      const rotation = readCurrentRotation();

      baseRotationY = rotation.rotationY;

      currentRotationX = rotation.rotationX;
      targetRotationX = rotation.rotationX;

      currentRotationY = 0;
      targetRotationY = 0;

      // Останавливаем автоматическое вращение
      card.style.animation = "none";

      ticket.dataset.visPointer = "1";

      startRendering();
    };

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      const bounds =
        ticket.getBoundingClientRect();

      const x =
        (event.clientX - bounds.left) /
        bounds.width;

      const y =
        (event.clientY - bounds.top) /
        bounds.height;

      // Управляет световым эффектом билета
      ticket.style.setProperty(
        "--vis-px",
        `${x * 100}%`
      );

      ticket.style.setProperty(
        "--vis-py",
        `${y * 100}%`
      );

      ticket.style.setProperty(
        "--vis-pxn",
        String(x)
      );

      ticket.style.setProperty(
        "--vis-pyn",
        String(y)
      );

      if (dragging) {
        // Вращение при зажатой кнопке мыши
        targetRotationY =
          dragStartRotation +
          (event.clientX - dragStartX) * 0.6;
      } else {
        // Наклон вслед за курсором
        targetRotationY = (x - 0.5) * 26;
        targetRotationX = -(y - 0.5) * 18;
      }
    };

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      dragging = true;
      dragStartX = event.clientX;
      dragStartRotation = targetRotationY;

      ticket.setPointerCapture(event.pointerId);
      ticket.style.cursor = "grabbing";

      startRendering();
    };

    const handlePointerUp = (
      event: PointerEvent
    ) => {
      dragging = false;

      if (
        ticket.hasPointerCapture(event.pointerId)
      ) {
        ticket.releasePointerCapture(
          event.pointerId
        );
      }

      ticket.style.cursor = "grab";

      const bounds =
        ticket.getBoundingClientRect();

      inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!inside) {
        delete ticket.dataset.visPointer;
        resumeAutomaticRotation();
      }
    };

    const handlePointerLeave = () => {
      inside = false;
      delete ticket.dataset.visPointer;

      if (!dragging) {
        resumeAutomaticRotation();
      }
    };

    ticket.style.cursor = "grab";

    ticket.addEventListener(
      "pointerenter",
      handlePointerEnter
    );

    ticket.addEventListener(
      "pointermove",
      handlePointerMove
    );

    ticket.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    ticket.addEventListener(
      "pointerup",
      handlePointerUp
    );

    ticket.addEventListener(
      "pointercancel",
      handlePointerUp
    );

    ticket.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      cancelAnimationFrame(animationFrame);

      ticket.removeEventListener(
        "pointerenter",
        handlePointerEnter
      );

      ticket.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      ticket.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      ticket.removeEventListener(
        "pointerup",
        handlePointerUp
      );

      ticket.removeEventListener(
        "pointercancel",
        handlePointerUp
      );

      ticket.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  return ticketRef;
}

function Ticket() {
  const ticketRef = useRotatableTicket();

  return (
    <div
      ref={ticketRef}
      className="vis-ticket"
      style={
        {
          "--vis-scale":
            "clamp(0.82, 0.82 + 0.28 * ((100vw - 375px) / 393), 1.1)",
        } as CSSProperties
      }
    >
      <div className="vis-ticket__scale">
        <div className="vis-ticket__scene">
          <div className="vis-ticket__float">
            <div className="vis-ticket__card">
              <div
                className="vis-ticket__glow vis-ticket__glow--front"
                aria-hidden="true"
              >
                {Array.from(
                  { length: 9 },
                  (_, index) => <i key={index} />
                )}
              </div>

              <div
                className="vis-ticket__glow vis-ticket__glow--back"
                aria-hidden="true"
              >
                {Array.from(
                  { length: 9 },
                  (_, index) => <i key={index} />
                )}
              </div>

              <TicketFace side="front" />
              <TicketFace side="back" />
            </div>
          </div>

          <div
            className="vis-ticket__shadow"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

function Tickets() {
  return (
    <section id="tickets" className="relative overflow-hidden bg-ink text-cream"><div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36"><div className="flex flex-col items-center gap-16 md:flex-row md:items-center md:gap-16 lg:gap-24"><div className="flex justify-center md:w-1/2 md:shrink-0"><Ticket /></div><div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left"><h2 className="reveal block whitespace-pre-line text-7xl font-bold leading-[0.9] tracking-[-0.04em] md:text-8xl">Apply to{"\n"}attend</h2><p className="mt-10 flex w-full max-w-md items-center justify-center gap-3 border-y border-cream/15 py-4 font-mono text-xs tracking-widest text-lavender uppercase md:mt-12 md:justify-start"><span aria-hidden="true" className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-lavender opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-lavender" /></span>Limited tickets remaining</p><ApplyLink className="mt-9 inline-flex h-14 items-center justify-center gap-2 border-2 border-lavender bg-lavender px-8 font-mono text-xs tracking-widest text-ink uppercase transition-colors duration-300 hover:bg-transparent hover:text-lavender">Apply to attend <span aria-hidden="true">→</span></ApplyLink></div></div></div></section>
  );
}

function Laboratories() {
  return (
    <section id="laboratories" className="relative overflow-hidden bg-ink text-cream">
      <DotPattern rows={6} cols={9} className="pointer-events-none absolute right-8 top-16 text-lavender/30 md:right-24" />
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <p className="font-mono text-xs tracking-widest text-lavender uppercase">DLT LABS</p>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="reveal block max-w-4xl text-5xl font-bold leading-[0.92] tracking-[-0.04em] md:text-8xl">
            Наши лаборатории
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-cream/60">
            Учебные пространства, где студенты осваивают современные технологии и превращают знания в практические проекты.
          </p>
        </div>

        <ul className="mt-20 grid sm:grid-cols-2">
          {LABORATORIES.map((laboratory, index) => (
            <li
              key={laboratory.name}
              className="lab-card reveal group relative -ml-px -mt-px overflow-hidden border border-lavender/30 bg-ink transition-colors duration-500 hover:border-lavender"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-lavender/30">
                <img
                  src={laboratory.image}
                  alt={laboratory.alt}
                  loading="lazy"
                  className="lab-card-image absolute inset-0 size-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                <span className="absolute left-4 top-4 bg-lavender px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="p-5 md:p-8">
                <h3 className="text-3xl font-medium tracking-[-0.02em] md:text-4xl">
                  {laboratory.name}
                </h3>
                <p className="mt-5 max-w-2xl leading-relaxed text-cream/60">
                  {laboratory.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {laboratory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-lavender/40 px-3 py-1.5 font-mono text-[10px] tracking-widest text-lavender"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <li className="project-card reveal group relative -ml-px -mt-px overflow-hidden border border-ink/15 bg-cream">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-ink/15 bg-ink">
        <img
          src={project.image}
          alt={project.alt}
          loading="lazy"
          className="project-card-image absolute inset-0 size-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
        <span className="absolute left-4 top-4 bg-lavender px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-ink">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute bottom-4 left-4 border border-cream/30 bg-ink/85 px-3 py-1.5 font-mono text-[10px] tracking-widest text-cream uppercase">
          {project.status}
        </span>
      </div>

      <div className="p-5 md:p-6">
        <h3 className="text-3xl font-medium tracking-[-0.02em]">{project.name}</h3>
        <p className="mt-5 leading-relaxed text-ink/60">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <span
              key={technology}
              className="border border-ink/15 px-2.5 py-1 font-mono text-[10px] tracking-widest text-ink/70"
            >
              {technology}
            </span>
          ))}
        </div>

        <details className="project-details mt-8 border-t border-ink/15 pt-5">
          <summary className="flex items-center justify-between font-mono text-xs tracking-widest text-ink uppercase">
            Подробнее
            <span aria-hidden="true" className="project-details-icon text-lg text-lavender">+</span>
          </summary>
          <div className="mt-5 flex flex-col gap-4 text-sm text-ink/60">
            {project.eventDate && (
              <p>
                <span className="font-mono text-[10px] tracking-widest text-ink/40 uppercase">Участие</span><br />
                STARTUP-TOMIRIS · {project.eventDate}
              </p>
            )}
            {project.achievement && (
              <p>
                <span className="font-mono text-[10px] tracking-widest text-ink/40 uppercase">Результат</span><br />
                {project.achievement}
              </p>
            )}
            {project.mentor && (
              <p>
                <span className="font-mono text-[10px] tracking-widest text-ink/40 uppercase">Руководитель проекта</span><br />
                {project.mentor}
              </p>
            )}
            <div>
              <p className="font-mono text-[10px] tracking-widest text-ink/40 uppercase">{project.teamName}</p>
              <ul className="mt-2 flex flex-col gap-1">
                {project.participants.map((participant) => <li key={participant}>— {participant}</li>)}
              </ul>
            </div>
          </div>
        </details>
      </div>
    </li>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden bg-cream text-ink">
      <DotPattern glyph="x" rows={5} cols={8} className="pointer-events-none absolute right-8 top-16 text-lavender/60 md:right-24" />
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <p className="font-mono text-xs tracking-widest text-ink/60 uppercase">DLT PROJECTS</p>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="reveal block max-w-4xl text-5xl font-bold leading-[0.92] tracking-[-0.04em] md:text-8xl">Проекты</h2>
          <p className="max-w-md text-lg leading-relaxed text-ink/60">
            Студенческие и исследовательские разработки, которые проходят путь от идеи до работающего прототипа.
          </p>
        </div>

        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-ink/15 pb-5">
            <h3 className="text-3xl font-medium tracking-[-0.02em] md:text-4xl">AI-агенты</h3>
            <p className="font-mono text-xs tracking-widest text-ink/50 uppercase">03 проекта</p>
          </div>
          <ul
            className="project-grid mt-10"
            style={{ "--project-columns": 3 } as CSSProperties}
          >
            {AI_AGENT_PROJECTS.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}
          </ul>
        </div>

        <div className="mt-24">
          <div className="flex flex-col gap-5 border-b border-ink/15 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs tracking-widest text-lavender uppercase">8 октября 2026 · сертификаты участников</p>
              <h3 className="mt-3 text-3xl font-medium tracking-[-0.02em] md:text-4xl">STARTUP-TOMIRIS</h3>
            </div>
            <p className="max-w-md leading-relaxed text-ink/60">
              Четыре студенческие команды Digital Lady Technopark представили свои разработки на конкурсе инновационных проектов.
            </p>
          </div>
          <ul
            className="project-grid mt-10"
            style={{ "--project-columns": 4 } as CSSProperties}
          >
            {TOMIRIS_PROJECTS.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const text = "Digital Lady Technopark · 2026 · QyzPU ·  ";
  return (
    <footer className="border-t border-cream/10 bg-ink text-cream"><div className="overflow-hidden border-b border-cream/10 py-6 text-4xl font-bold tracking-[-0.02em] text-lavender md:text-6xl"><div className="loop-marquee">{[0, 1].map((copy) => <span key={copy} className="shrink-0 whitespace-nowrap">{text}{text}</span>)}</div></div><div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-10 px-4 py-14 md:px-8"><div><div className="flex items-center"><span className="text-2xl font-bold tracking-[-0.03em] text-lavender">DLT</span></div><div className="mt-6 flex items-center gap-3"><span className="font-mono text-xs tracking-widest text-cream/50">PRESENTED BY</span><a href="https://roboflow.com" target="_blank" rel="noopener noreferrer" aria-label="Roboflow"><RoboflowWordmark className="w-28" /></a></div></div><nav aria-label="Footer" className="flex flex-col gap-2 font-mono text-xs tracking-widest text-cream/60 uppercase"><a href="#laboratories" className="hover:text-lavender">Лаборатории</a><a href="#projects" className="hover:text-lavender">Проекты</a><a href="#team" className="hover:text-lavender">Команда</a></nav><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="border border-cream/30 px-5 py-3 font-mono text-xs tracking-widest uppercase transition-colors duration-300 hover:border-lavender hover:bg-lavender hover:text-ink">Наверх ↑</button></div><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-cream/10 px-4 py-5 font-mono text-[10px] tracking-widest text-cream/40 uppercase md:px-8"><p>© 2026 Digital Lady Technopark</p><p>QyzPU · Институт ФМЦТ</p></div></footer>
  );
}

export default function Home() {
  useReveals();
  return (
    <>
      <CustomCursor />
      <StickyHeader />
      <main>
        <Hero />
        <Narrative />
        <Intro />
        <Projects />
        <Team />
        <TimePlace />
        <Laboratories />
        <Tickets />
      </main>
      <Footer />
    </>
  );
}
