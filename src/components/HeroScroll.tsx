"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function useWheelSnapPaging(
  sectionRef: RefObject<HTMLElement | null>,
  maxIndex: number,
  enabled: boolean,
) {
  const lockedRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const clearUnlockTimer = () => {
      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
    };

    const unlockSoon = () => {
      clearUnlockTimer();
      unlockTimerRef.current = window.setTimeout(() => {
        lockedRef.current = false;
        unlockTimerRef.current = null;
      }, 650);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented) return;
      if (event.deltaY === 0) return;
      if (lockedRef.current) {
        event.preventDefault();
        return;
      }

      const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
      const viewport = window.innerHeight || 1;
      const y = window.scrollY;
      const withinSection =
        y >= sectionTop - 2 && y <= sectionTop + maxIndex * viewport + 2;
      if (!withinSection) return;

      const rawIndex = (y - sectionTop) / viewport;
      const currentIndex = Math.min(
        maxIndex,
        Math.max(0, Math.round(rawIndex)),
      );
      const direction = Math.sign(event.deltaY);

      if (direction > 0 && currentIndex >= maxIndex) return;
      if (direction < 0 && currentIndex <= 0) return;

      event.preventDefault();
      lockedRef.current = true;

      const nextIndex = Math.min(
        maxIndex,
        Math.max(0, currentIndex + direction),
      );
      const targetTop = Math.round(sectionTop + nextIndex * viewport);

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      unlockSoon();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      clearUnlockTimer();
      window.removeEventListener("wheel", onWheel);
    };
  }, [enabled, maxIndex, sectionRef]);
}

function useSectionScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = sectionEl.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = clamp01(-rect.top / total);
      setProgress(scrolled);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [sectionRef]);

  return progress;
}

function useWheelCarouselPaging(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  count: number,
  getIndex: () => number,
  setIndex: (next: number) => void,
) {
  const lockedRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (count <= 1) return;

    const clearUnlockTimer = () => {
      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
    };

    const unlockSoon = () => {
      clearUnlockTimer();
      unlockTimerRef.current = window.setTimeout(() => {
        lockedRef.current = false;
        unlockTimerRef.current = null;
      }, 420);
    };

    const onWheel = (event: WheelEvent) => {
      const containerEl = containerRef.current;
      if (!containerEl) return;
      if (!containerEl.contains(event.target as Node)) return;

      if (event.defaultPrevented) return;
      if (event.deltaY === 0) return;

      event.preventDefault();
      if (lockedRef.current) return;
      lockedRef.current = true;

      const direction = Math.sign(event.deltaY);
      const current = getIndex();
      const next = Math.min(count - 1, Math.max(0, current + direction));
      setIndex(next);

      unlockSoon();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      clearUnlockTimer();
      window.removeEventListener("wheel", onWheel);
    };
  }, [containerRef, count, enabled, getIndex, setIndex]);
}

type HeroScrollProps = {
  title?: string;
  eyebrow?: string;
  tickerText?: string;
  imageUrl?: string;
  slides?: { imageUrl: string; category?: string }[];
  headerLogoSrc?: string;
  headerLogoAlt?: string;
};

export default function HeroScroll({
  title = "SHARTHAK STUDIO",
  eyebrow = "SHARTHAK STUDIO",
  tickerText = "Professional Wedding Photography & Cinematography Team • High Quality Cameras & Cinematic Equipment • 100% Focus on Capturing Real Emotions & Moments • Creative Editing for Photos, Videos & Reels • Experience in Weddings, Maternity, Baby & Event Shoots • On-Time Delivery of Photos & Videos • Friendly & Professional Team That Makes You Comfortable • Affordable Packages with Premium Quality • Trusted by Many Happy Clients • We Turn Your Special Moments Into Beautiful Memories",
  imageUrl,
  slides,
  headerLogoSrc = "/logo.svg",
  headerLogoAlt = "Logo",
}: HeroScrollProps) {
  const fallbackImageUrl =
    "https://picsum.photos/seed/sharthak-fallback/2400/1600";
  const resolvedSlides =
    slides && slides.length > 0
      ? slides
      : [{ imageUrl: imageUrl ?? fallbackImageUrl, category: "" }];

  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const rawProgress = useSectionScrollProgress(sectionRef);
  const progress = prefersReducedMotion ? 0 : rawProgress;
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const headerVisible = rawProgress >= 0.999 && hasScrolled;

  const slideCount = resolvedSlides.length;
  const totalSegments = slideCount; // 1 segment for intro + (slideCount - 1) slide transitions
  useWheelSnapPaging(sectionRef, totalSegments, !prefersReducedMotion);
  const tSeg = progress * totalSegments; // 0..totalSegments
  const intro = clamp01(tSeg); // 0..1
  const slideT = Math.max(0, tSeg - 1); // 0..(slideCount - 1)

  const activeSlide = Math.min(
    slideCount - 1,
    Math.max(0, Math.floor(slideT + 1e-6)),
  );
  const titleSlideIndex = Math.min(
    slideCount - 1,
    Math.max(0, intro < 1 ? 0 : 1 + Math.floor(slideT + 1e-6)),
  );
  const category = resolvedSlides[activeSlide]?.category || "";
  const heroTitle =
    intro < 1 ? title : (resolvedSlides[titleSlideIndex]?.category || title);

  const overlaySlides = Array.from({ length: 10 }, (_, i) => {
    const base =
      resolvedSlides[i] ?? resolvedSlides[i % Math.max(1, resolvedSlides.length)];
    const fallbackCategory = resolvedSlides[i % Math.max(1, resolvedSlides.length)]
      ?.category;
    return {
      imageUrl:
        base?.imageUrl ??
        `https://picsum.photos/seed/sharthak-overlay-${String(i + 1).padStart(2, "0")}/2400/1600`,
      category: base?.category || fallbackCategory || category || title,
    };
  });

  const detailRef = useRef<HTMLDivElement | null>(null);
  const [detail, setDetail] = useState<null | { startIndex: number }>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const detailIndexRef = useRef(0);

  useEffect(() => {
    detailIndexRef.current = detailIndex;
  }, [detailIndex]);

  useEffect(() => {
    if (!detail) return;
    setDetailIndex(detail.startIndex);
    const t = window.setTimeout(() => setDetailVisible(true), 16);
    return () => window.clearTimeout(t);
  }, [detail]);

  const openDetail = () => {
    if (prefersReducedMotion) return;
    if (intro < 1) return;
    if (detail) return;
    const startIndex = Math.min(activeSlide, overlaySlides.length - 1);
    setDetailIndex(startIndex);
    setDetail({ startIndex });
  };

  const closeDetail = () => {
    setDetailVisible(false);
    window.setTimeout(() => setDetail(null), 240);
  };

  const jumpToNextSection = () => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    if (detail) {
      closeDetail();
      window.setTimeout(() => {
        const top = sectionEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.round(top + sectionEl.offsetHeight + 1),
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }, 260);
      return;
    }

    const top = sectionEl.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.round(top + sectionEl.offsetHeight + 1),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useWheelCarouselPaging(
    detailRef,
    !!detail && !prefersReducedMotion,
    overlaySlides.length,
    () => detailIndexRef.current,
    setDetailIndex,
  );

  const imageHeight = lerp(52, 100, intro); // svh
  const splitTop = 100 - imageHeight; // svh; where image starts at the top

  const titleTranslateY = lerp(0, 44, intro); // svh
  const titleScale = lerp(1, 0.78, intro);

  const tickerOpacity = lerp(1, 0, clamp01(intro * 1.4));
  const eyebrowOpacity = lerp(1, 0, clamp01(intro * 1.8));

  const categoryOpacity = lerp(0.75, 1, clamp01(intro * 1.2));
  const categoryTranslateY = lerp(10, 0, clamp01(intro * 1.2)); // px

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white"
      style={{ height: `${(totalSegments + 1) * 100}svh` }}
    >
      <header
        className="hero-scroll__header fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300"
        style={{
          opacity: headerVisible ? 1 : 0,
          pointerEvents: headerVisible ? "auto" : "none",
        }}
      >
        <Image src={headerLogoSrc} alt={headerLogoAlt} width={40} height={40} />
      </header>

      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <button
          type="button"
          onClick={jumpToNextSection}
          aria-label="Scroll to next section"
          className="absolute bottom-8 left-1/2 z-30 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-md"
          style={{ border: "1px solid rgba(255,255,255,0.14)" }}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Click overlay (no new page) */}
        {detail && (
          <div
            className="absolute inset-0 z-40 bg-black"
            style={{
              opacity: detailVisible ? 1 : 0,
              transition: "opacity 200ms ease-out",
            }}
          >
            {/*
              Keep the back button and vertical label aligned on the same
              left gutter, like the reference.
            */}
            <button
              type="button"
              aria-label="Back"
              onClick={closeDetail}
              className="absolute z-50 rounded-full bg-black/50 p-3 text-white/90 backdrop-blur-md"
              style={{
                left: 40,
                top: 40,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="absolute inset-0 flex items-center justify-center px-10">
              <div
                className="relative w-[min(78vw,1120px)] overflow-hidden"
                ref={detailRef}
                style={{
                  aspectRatio: "16 / 9",
                  boxShadow: "0 24px 70px rgba(0,0,0,0.65)",
                }}
              >
                <div
                  className="absolute inset-0 flex"
                  style={{
                    transform: `translate3d(${-detailIndex * 100}%, 0, 0)`,
                    transition: prefersReducedMotion
                      ? "none"
                      : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {overlaySlides.map((slide, idx) => (
                    <div
                      key={`${slide.imageUrl}-${idx}`}
                      className="relative h-full w-full flex-[0_0_100%]"
                    >
                      <Image
                        src={slide.imageUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1200px) 1120px, 78vw"
                        className="object-cover"
                        priority={idx === detailIndex}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="absolute origin-left"
              style={{
                left: 40,
                top: "50%",
                transform: `translate3d(${detailVisible ? 0 : -160}px, -50%, 0) rotate(-90deg)`,
                transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {!!overlaySlides[detailIndex]?.category && (
                <div
                  className="text-[46px] font-extrabold tracking-[0.12em]"
                  style={{ color: "#B6FF00" }}
                >
                  {overlaySlides[detailIndex]?.category}
                </div>
              )}
            </div>

            <div
              className="absolute right-8 top-1/2 h-12 w-1 -translate-y-1/2"
              style={{ backgroundColor: "#B6FF00" }}
            />
          </div>
        )}

        {/* Image that expands upward to full screen on scroll */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{ height: `${imageHeight}svh` }}
        >
          <div
            className="relative h-full w-full"
            onClick={openDetail}
            style={{ cursor: intro < 1 || detail ? "default" : "pointer" }}
          >
            {resolvedSlides.map((slide, index) => {
              if (index === 0) {
                return (
                  <div key={slide.imageUrl} className="absolute inset-0">
                    <Image
                      src={slide.imageUrl}
                      alt=""
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                );
	              }
	
	              const local = clamp01(slideT - (index - 1)); // 0..1 over its segment
	              const translateX = (1 - local) * 100; // %
	              return (
	                <div
	                  key={`${slide.imageUrl}-${index}`}
	                  className="absolute inset-0 will-change-transform"
	                  style={{
	                    transform: `translate3d(${translateX}%, 0, 0)`,
	                    zIndex: index + 1,
	                  }}
	                >
	                  <Image
	                    src={slide.imageUrl}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
            {!!category && (
              <div
                className="text-center text-sm tracking-[0.35em] text-white/95 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] sm:text-base"
                style={{
                  opacity: categoryOpacity,
                  transform: `translate3d(0, ${categoryTranslateY}px, 0)`,
                }}
              >
                {category}
              </div>
            )}
          </div>
        </div>

        {/* Text layer */}
          <div className="relative z-10 h-full">
          <div
            className="absolute inset-x-0 top-14 text-center text-xs tracking-[0.45em] text-white/80"
            style={{ opacity: eyebrowOpacity }}
          >
            {eyebrow}
          </div>

          <div
            className="absolute inset-x-0 top-[18svh] px-6 text-center"
            style={{
              transform: `translate3d(0, ${titleTranslateY}svh, 0) scale(${titleScale})`,
              transformOrigin: "center top",
            }}
          >
            <div className="mx-auto max-w-6xl select-none">
              <button
                type="button"
                onClick={openDetail}
                className="relative inline-block bg-transparent p-0 text-inherit"
                style={{
                  cursor: intro < 1 || detail ? "default" : "pointer",
                  border: "none",
                }}
              >
                <div className="text-[11vw] font-semibold tracking-[0.18em] text-white/95 sm:text-[96px]">
                  {heroTitle}
                </div>
                <div className="pointer-events-none absolute inset-0 translate-x-1 translate-y-1 text-[11vw] font-semibold tracking-[0.18em] text-yellow-400/70 blur-[0.3px] sm:text-[96px]">
                  {heroTitle}
                </div>
              </button>
            </div>
          </div>

	          <div
	            className="absolute inset-x-0"
	            style={{
	              top: `${splitTop}svh`,
	              opacity: tickerOpacity,
	            }}
	          >
	            <div className="film-ticker">
	              <div className="film-ticker__perfs" aria-hidden="true" />
	              <div className="film-ticker__window">
	                <div className="marquee h-full">
	                  <div className="marquee__track">
	                    <span className="marquee__content">{tickerText}</span>
	                    <span className="marquee__gap" aria-hidden="true">
	                      {" "}
	                      •{" "}
	                    </span>
	                    <span className="marquee__content" aria-hidden="true">
	                      {tickerText}
	                    </span>
	                  </div>
	                </div>
	              </div>
	              <div className="film-ticker__perfs" aria-hidden="true" />
	            </div>
	          </div>
	        </div>
	      </div>
	    </section>
  );
}
