"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type GalleryTab = {
  label: string;
  active?: boolean;
};

type GalleryItem = {
  seed: string;
  col: string;
  row: string;
};

type GallerySectionProps = {
  tabs: GalleryTab[];
  items: GalleryItem[];
};

export default function GallerySection({ tabs, items }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dragStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setRevealed(true);
      },
      { threshold: 0.14 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
        return;
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => {
          if (current === null) return current;
          return Math.min(items.length - 1, current + 1);
        });
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => {
          if (current === null) return current;
          return Math.max(0, current - 1);
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [items.length, lightboxIndex]);

  const revealClass = revealed ? "is-revealed" : "";
  const tiles = useMemo(() => items, [items]);

  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () =>
    setLightboxIndex((current) =>
      current === null ? current : Math.max(0, current - 1),
    );
  const goNext = () =>
    setLightboxIndex((current) =>
      current === null ? current : Math.min(items.length - 1, current + 1),
    );

  return (
    <section
      ref={sectionRef}
      className={`gallery-section w-full bg-white px-3 py-16 text-black sm:px-6 sm:py-20 ${revealClass}`}
    >
      <div className="mx-auto w-full max-w-none">
        <div className="gallery-stagger flex flex-wrap items-center justify-center gap-8">
          {tabs.map((tab, idx) => (
            <button
              key={`tab-${idx}`}
              type="button"
              className="h-14 w-[220px] text-sm font-semibold tracking-[0.18em] transition-colors"
              style={{
                backgroundColor: tab.active ? "#000000" : "#FFFFFF",
                color: tab.active ? "#FFFFFF" : "#000000",
                border: "2px solid #000000",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="gallery-stagger mt-10 grid w-full gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gridAutoRows: "160px",
          }}
        >
          {tiles.map((item, idx) => (
            <div
              key={item.seed}
              className="gallery-tile gallery-tile--reveal"
              style={{
                gridColumn: item.col,
                gridRow: item.row,
                transitionDelay: `${Math.min(18, idx) * 55}ms`,
              }}
              role="button"
              tabIndex={0}
              aria-label="Open image"
              onClick={() => setLightboxIndex(idx)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setLightboxIndex(idx);
                }
              }}
            >
              <div className="gallery-tile__inner">
                {/* Default is B&W via CSS; hover shows original color */}
                <img
                  className="gallery-img"
                  src={`https://picsum.photos/seed/${item.seed}/1600/1200`}
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close"
            onClick={closeLightbox}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--left"
            aria-label="Previous"
            onClick={goPrev}
            disabled={lightboxIndex <= 0}
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

          <button
            type="button"
            className="lightbox__nav lightbox__nav--right"
            aria-label="Next"
            onClick={goNext}
            disabled={lightboxIndex >= items.length - 1}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
              if (delta < 0) goNext();
              else goPrev();
            }}
          >
            <div
              className="lightbox__track"
              style={{
                transform: `translate3d(${-lightboxIndex * 100}%, 0, 0)`,
              }}
            >
              {tiles.map((item) => (
                <div key={`lb-${item.seed}`} className="lightbox__slide">
                  <img
                    className="lightbox__img"
                    src={`https://picsum.photos/seed/${item.seed}/2400/1600`}
                    alt=""
                    draggable={false}
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
