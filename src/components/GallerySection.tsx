"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "@/hooks/useMedia";

type GalleryTab = {
  label: string;
};

type GalleryItem = {
  seed: string;
  col: string;
  row: string;
  category: string;
};

type GallerySectionProps = {
  tabs: GalleryTab[];
  items: GalleryItem[];
};

function GalleryImage({ seed, className, isLightbox = false }: { seed: string; className?: string, isLightbox?: boolean }) {
  const fallback = isLightbox
    ? `https://picsum.photos/seed/${seed}/2400/1600`
    : `https://picsum.photos/seed/${seed}/1600/1200`;
  const src = useMedia(seed, fallback);
  return <img className={className} src={src} alt="" loading="lazy" draggable={!isLightbox} />;
}

export default function GallerySection({ tabs, items }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const filteredTiles = useMemo(() => {
    return items.filter(item => item.category === activeTab);
  }, [items, activeTab]);

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
          return Math.min(filteredTiles.length - 1, current + 1);
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
  }, [filteredTiles.length, lightboxIndex]);

  const revealClass = revealed ? "is-revealed" : "";

  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () =>
    setLightboxIndex((current) =>
      current === null ? current : Math.max(0, current - 1),
    );
  const goNext = () =>
    setLightboxIndex((current) =>
      current === null ? current : Math.min(filteredTiles.length - 1, current + 1),
    );

  return (
    <section
      ref={sectionRef}
      className={`gallery-section w-full bg-white px-3 py-16 text-black sm:px-6 sm:py-20 ${revealClass}`}
    >
      <div className="mx-auto w-full max-w-none">
        <div className="gallery-stagger flex items-center gap-3 sm:gap-8 overflow-x-auto no-scrollbar pb-4 sm:pb-0 sm:justify-center">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={`tab-${idx}`}
                type="button"
                onClick={() => {
                  setActiveTab(tab.label);
                  setLightboxIndex(null);
                }}
                className={`
                  h-10 sm:h-14 px-5 sm:w-[220px] whitespace-nowrap text-[10px] sm:text-sm font-bold tracking-[0.18em] transition-all duration-300
                  ${isActive ? "bg-black text-white" : "bg-white text-black border-2 border-black hover:bg-black/5"}
                `}
                style={{
                  border: isActive ? "2px solid #000000" : "2px solid #000000",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          className="gallery-stagger mt-8 sm:mt-10 grid w-full gap-2 sm:gap-4"
          style={{
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, minmax(0, 1fr))",
            gridAutoRows: isMobile ? "200px" : "160px",
          }}
        >
          {filteredTiles.map((item, idx) => {
            const mobileGridStyle = {
              gridColumn: idx % 3 === 0 ? "span 1" : (idx % 3 === 1 ? "span 1" : "span 2"),
              gridRow: idx % 4 === 0 ? "span 2" : "span 1",
            };

            const desktopGridStyle = {
              gridColumn: item.col,
              gridRow: item.row,
            };

            return (
              <div
                key={item.seed}
                className="gallery-tile gallery-tile--reveal"
                style={{
                  ...(isMobile ? mobileGridStyle : desktopGridStyle),
                  transitionDelay: `${Math.min(12, idx) * 40}ms`,
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
                  <GalleryImage
                    seed={item.seed}
                    className="gallery-img h-full w-full object-cover"
                  />
                </div>
              </div>
            );
          })}
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
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--left"
            aria-label="Previous"
            onClick={goPrev}
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
            onClick={goNext}
            disabled={lightboxIndex >= filteredTiles.length - 1}
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
              {filteredTiles.map((item) => (
                <div key={`lb-${item.seed}`} className="lightbox__slide">
                  <GalleryImage
                    seed={item.seed}
                    className="lightbox__img"
                    isLightbox={true}
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
