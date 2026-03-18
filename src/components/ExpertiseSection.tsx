"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "@/hooks/useMedia";
import { motion } from "framer-motion";

function clampIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

function ExpertiseCard({
  overlaySide,
  dimmed,
  imageUrl,
  onClick,
}: {
  overlaySide: "left" | "right" | null;
  dimmed: boolean;
  imageUrl: string;
  onClick: () => void;
}) {
  const overlays =
    overlaySide === "left"
      ? [
        { left: 0, opacity: 0.7 },
        { left: 25, opacity: 0.42 },
      ]
      : overlaySide === "right"
        ? [
          { left: 75, opacity: 0.7 },
          { left: 50, opacity: 0.42 },
        ]
        : [];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden bg-black text-left outline-none"
      style={{
        width: "min(620px, 92vw)",
        height: "420px",
        border: dimmed
          ? "1.5px solid rgba(255,255,255,0.2)"
          : "1.8px solid rgba(255,255,255,0.25)",
        borderRadius: 2,
        pointerEvents: dimmed ? "none" : "auto",
      }}
      aria-label="Open expertise"
    >
      <Image
        src={imageUrl}
        alt=""
        fill
        sizes="620px"
        className={[
          "object-cover object-center transition duration-500",
          dimmed
            ? "opacity-75 group-hover:opacity-90"
            : "opacity-95 group-hover:opacity-100",
        ].join(" ")}
        priority={false}
      />

      {dimmed && (
        <div className="absolute inset-0">
          {overlays.map((o, idx) => (
            <div
              key={idx}
              className="absolute top-0 h-full w-1/4 bg-black"
              style={{
                left: `${o.left}%`,
                opacity: o.opacity,
              }}
            />
          ))}
          <div
            className="absolute top-0 h-full w-px"
            style={{
              left: "33.3333%",
              background: "rgba(255,255,255,0.13)",
            }}
          />
          <div
            className="absolute top-0 h-full w-px"
            style={{
              left: "66.6666%",
              background: "rgba(255,255,255,0.13)",
            }}
          />
        </div>
      )}
    </button>
  );
}

// Wrapper to handle dynamic media
function DynamicExpertiseImage({ slotId, fallback, ...props }: any) {
  const src = useMedia(slotId, fallback);
  return <ExpertiseCard {...props} imageUrl={src} />;
}

function DynamicLightboxImage({ slotId, fallback, className }: any) {
  const src = useMedia(slotId, fallback);
  return <img src={src} className={className} alt="" draggable={false} />;
}

export default function ExpertiseSection() {
  const slideConfigs = useMemo(
    () => [
      { id: "expertise-01", fallback: "https://picsum.photos/seed/expertise-01/1600/1000" },
      { id: "expertise-02", fallback: "https://picsum.photos/seed/expertise-02/1600/1000" },
      { id: "expertise-03", fallback: "https://picsum.photos/seed/expertise-03/1600/1000" },
      { id: "expertise-04", fallback: "https://picsum.photos/seed/expertise-04/1600/1000" },
      { id: "expertise-05", fallback: "https://picsum.photos/seed/expertise-05/1600/1000" },
      { id: "expertise-06", fallback: "https://picsum.photos/seed/expertise-06/1600/1000" },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shiftProgress, setShiftProgress] = useState<0 | 1>(0);
  const [stepPx, setStepPx] = useState(340);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const dragStartXRef = useRef<number | null>(null);
  const lastWheelAtRef = useRef(0);

  useEffect(() => {
    if (lightboxIndex !== null) return;
    const t = window.setInterval(() => {
      if (isAnimating) return;
      setIsAnimating(true);
      setShiftProgress(1);
      window.setTimeout(() => {
        setActiveIndex((v) => (v + 1) % slideConfigs.length);
        setShiftProgress(0);
        setIsAnimating(false);
      }, 540);
    }, 6200);
    return () => window.clearInterval(t);
  }, [isAnimating, lightboxIndex, slideConfigs.length]);

  useEffect(() => {
    const update = () => {
      setStepPx(
        Math.max(260, Math.min(420, Math.round(window.innerWidth * 0.32))),
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((v) =>
          v === null ? v : Math.min(slideConfigs.length - 1, v + 1),
        );
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((v) => (v === null ? v : Math.max(0, v - 1)));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex, slideConfigs.length]);

  const close = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((v) => (v === null ? v : Math.max(0, v - 1)));
  const next = () =>
    setLightboxIndex((v) =>
      v === null ? v : Math.min(slideConfigs.length - 1, v + 1),
    );

  const prevIndex = clampIndex(activeIndex - 1, slideConfigs.length);
  const nextIndex = clampIndex(activeIndex + 1, slideConfigs.length);
  const next2Index = clampIndex(activeIndex + 2, slideConfigs.length);

  return (
    <section className="w-full overflow-x-hidden bg-black px-6 py-20 text-white">
      <div className="mx-auto w-full max-w-none">
        <h2
          className="text-center text-5xl font-semibold tracking-[0.12em] sm:text-6xl"
          style={{
            fontFamily:
              'ui-serif, "Cormorant Garamond", Georgia, "Times New Roman", serif',
          }}
        >
          CHOOSE YOUR EXPERTISE
        </h2>
        <div
          className="mt-3 text-center text-2xl tracking-wide text-[#B6FF00]/90"
          style={{
            fontFamily:
              'ui-sans-serif, "Annie Use Your Telescope", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
          }}
        >
          YOUR DAY WITH OUR EXPERTS
        </div>

        <div className="mt-16 flex w-full items-center justify-center">
          <div
            className="relative mx-auto w-full max-w-[1440px] select-none overflow-hidden"
            style={{ height: 480 }}
            onWheel={(event) => {
              if (lightboxIndex !== null) return;
              const now = Date.now();
              if (now - lastWheelAtRef.current < 700) return;
              const delta =
                Math.abs(event.deltaX) > Math.abs(event.deltaY)
                  ? event.deltaX
                  : event.deltaY;
              if (delta < 18) return;
              lastWheelAtRef.current = now;
              if (isAnimating) return;
              setIsAnimating(true);
              setShiftProgress(1);
              window.setTimeout(() => {
                setActiveIndex((v) => (v + 1) % slideConfigs.length);
                setShiftProgress(0);
                setIsAnimating(false);
              }, 540);
            }}
          >
            {[
              { slot: -1, idx: prevIndex },
              { slot: 0, idx: activeIndex },
              { slot: 1, idx: nextIndex },
              { slot: 2, idx: next2Index },
            ].map(({ slot, idx }) => {
              const visualSlot = slot - shiftProgress;
              const x = visualSlot * stepPx;
              const isCenter = Math.abs(visualSlot) < 0.45;
              const dimmed = !isCenter;
              const overlaySide =
                visualSlot < -0.45 ? "left" : visualSlot > 0.45 ? "right" : null;
              const top = isCenter ? 0 : 60;
              const scale = isCenter ? 1 : 0.78;
              const opacity =
                Math.abs(visualSlot) > 1.8 ? 0 : isCenter ? 1 : 0.88;

              return (
                <div
                  key={`${slot}-${idx}`}
                  className="absolute left-1/2 top-0 will-change-transform"
                  style={{
                    zIndex: isCenter
                      ? 20
                      : 5 - Math.round(Math.abs(visualSlot) * 2),
                    opacity,
                    transition: isAnimating
                      ? "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms cubic-bezier(0.22, 1, 0.36, 1)"
                      : "none",
                    transform: `translateX(calc(-50% + ${x}px)) translateY(${isCenter ? 30 : 76}px)`,
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: "center top",
                      cursor: isCenter && !isAnimating ? "pointer" : "default"
                    }}
                  >
                    <DynamicExpertiseImage
                      slotId={slideConfigs[idx].id}
                      fallback={slideConfigs[idx].fallback}
                      overlaySide={overlaySide}
                      dimmed={dimmed}
                      onClick={() => {
                        if (isCenter && !isAnimating) {
                          setLightboxIndex(idx);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-20 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center gap-4 overflow-hidden rounded-full border border-white/20 bg-black px-10 py-5 text-xs font-black uppercase tracking-[0.4em] text-white shadow-2xl transition-all hover:border-[#B6FF00]/50"
            onClick={() => {
              const footer = document.querySelector('footer');
              footer?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative z-10 transition-colors group-hover:text-[#B6FF00]">Contact Us Now</span>
            <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 group-hover:bg-[#B6FF00]">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" className="transition-colors group-hover:invert">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.button>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close"
            onClick={close}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--left"
            aria-label="Previous"
            onClick={prev}
            disabled={lightboxIndex <= 0}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--right"
            aria-label="Next"
            onClick={next}
            disabled={lightboxIndex >= slideConfigs.length - 1}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className="lightbox__stage"
            onPointerDown={(event) => {
              dragStartXRef.current = event.clientX;
            }}
            onPointerUp={(event) => {
              const startX = dragStartXRef.current;
              dragStartXRef.current = null;
              if (startX === null) return;
              const delta = event.clientX - startX;
              if (Math.abs(delta) < 40) return;
              if (delta < 0) next();
              else prev();
            }}
          >
            <div
              className="lightbox__track"
              style={{
                transform: `translate3d(${-lightboxIndex * 100}%, 0, 0)`,
              }}
            >
              {slideConfigs.map((config) => (
                <div key={config.id} className="lightbox__slide">
                  <DynamicLightboxImage
                    slotId={config.id}
                    fallback={config.fallback}
                    className="lightbox__img"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
