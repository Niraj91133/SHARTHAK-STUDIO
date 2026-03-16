"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Clip = {
  top: number;
  left: number;
  width: number;
  color: string;
};

const clips: Clip[] = [
  { top: 14, left: 6, width: 26, color: "#7C3AED" },
  { top: 14, left: 34, width: 18, color: "#EC4899" },
  { top: 14, left: 55, width: 30, color: "#F97316" },
  { top: 66, left: 12, width: 32, color: "#22C55E" },
  { top: 66, left: 48, width: 24, color: "#60A5FA" },
  { top: 162, left: 8, width: 78, color: "#334155" },
  { top: 214, left: 16, width: 66, color: "#334155" },
];

export default function VideoEditingTimelineSection() {
  const mediaItems = useMemo(
    () =>
      [
        { q: "wedding couple cinematic", label: "C2210.MP4", sig: 1 },
        { q: "wedding rings macro", label: "C2211.MP4", sig: 2 },
        { q: "bride portrait", label: "C2212.MP4", sig: 3 },
        { q: "groom portrait", label: "C2213.MP4", sig: 4 },
        { q: "wedding candid moment", label: "C2214.MP4", sig: 5 },
        { q: "wedding decor detail", label: "C2215.MP4", sig: 6 },
        { q: "camera filming wedding", label: "C2216.MP4", sig: 7 },
        { q: "video editing timeline", label: "C2217.MP4", sig: 8 },
        { q: "wedding couple outdoors", label: "C2218.MP4", sig: 9 },
        { q: "wedding hands closeup", label: "C2219.MP4", sig: 10 },
      ].map((it) => ({
        ...it,
        src: `https://source.unsplash.com/featured/1600x900?${encodeURIComponent(
          it.q,
        )}&sig=${it.sig}`,
      })),
    [],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dragStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  const current = mediaItems[selectedIndex];

  return (
    <section className="w-full overflow-x-hidden bg-[#0B0D10] px-4 py-10 text-white sm:px-6">
      <div className="w-full max-w-none">
        <div className="h-[28px] w-full bg-[#0F1217] px-4">
          <div className="flex h-full items-center text-[11px] font-semibold tracking-[0.14em] text-[#DDE3EA]">
            VIDEO EDITING
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="relative h-[240px] w-full overflow-hidden bg-black text-left sm:h-[320px] lg:h-[360px]"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open preview fullscreen"
          >
            <Image
              src={current.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 1440px, 100vw"
              className="object-cover opacity-90"
              priority={false}
            />

            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.82), rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.82))",
                }}
              />
              <div
                className="absolute left-0 top-0 h-[120px] w-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.72), rgba(0,0,0,0))",
                }}
              />
              <div
                className="absolute bottom-0 left-0 h-[120px] w-full"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(0,0,0,0.72), rgba(0,0,0,0))",
                }}
              />
              <div
                className="absolute inset-0"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              />
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <div className="rounded bg-black/60 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/90">
                PREVIEW
              </div>
              <div className="rounded bg-black/45 px-2 py-1 text-[10px] font-medium text-white/70">
                {current.label}
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 grid w-full grid-cols-1 gap-4 lg:grid-cols-[430px_1fr]">
          <div
            className="overflow-hidden bg-[#0C0F14]"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="h-[44px] bg-[#10151D] px-4 py-3">
              <div className="text-[11px] font-semibold text-[#DCE3EC]">
                Project: SHARTHAK STUDIO
              </div>
              <div className="text-[10px] font-medium tracking-[0.06em] text-[#8D9AAF]">
                BIN • VIDEO • AUDIO
              </div>
            </div>

            {/* Mobile: horizontal scroll (right-to-left feel). Desktop: grid, no visible scrollbar. */}
            <div className="p-3">
              <div className="flex flex-row-reverse gap-3 overflow-x-auto overflow-y-hidden pr-3 no-scrollbar lg:hidden">
                {mediaItems.map((item, idx) => {
                  const selected = idx === selectedIndex;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className="group relative aspect-[2/1] w-[180px] flex-none overflow-hidden bg-[#141A22] text-left"
                      style={{
                        border: selected
                          ? "1px solid rgba(100,181,255,0.8)"
                          : "1px solid rgba(255,255,255,0.06)",
                        boxShadow: selected
                          ? "0 0 0 1px rgba(0,0,0,0.35) inset"
                          : "none",
                      }}
                      aria-label={`Open ${item.label} in preview`}
                    >
                      <Image
                        src={item.src}
                        alt=""
                        fill
                        sizes="180px"
                        className="object-cover opacity-95 transition duration-300 group-hover:opacity-100"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
                      <div className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-1 text-[10px] font-semibold text-white/85">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="hidden max-h-[260px] overflow-y-auto no-scrollbar lg:block">
                <div className="grid grid-cols-2 gap-3 pr-2">
                  {mediaItems.map((item, idx) => {
                    const selected = idx === selectedIndex;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSelectedIndex(idx)}
                        className="group relative aspect-[2/1] overflow-hidden bg-[#141A22] text-left"
                        style={{
                          border: selected
                            ? "1px solid rgba(100,181,255,0.8)"
                            : "1px solid rgba(255,255,255,0.06)",
                          boxShadow: selected
                            ? "0 0 0 1px rgba(0,0,0,0.35) inset"
                            : "none",
                        }}
                        aria-label={`Open ${item.label} in preview`}
                      >
                        <Image
                          src={item.src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 200px, 45vw"
                          className="object-cover opacity-95 transition duration-300 group-hover:opacity-100"
                          priority={false}
                        />
                        <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
                        <div className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-1 text-[10px] font-semibold text-white/85">
                          {item.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div
            className="overflow-hidden bg-[#0B0D12]"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="h-[44px] bg-[#10151D] px-4 py-3">
              <div className="text-[12px] font-bold text-[#64B5FF]">
                00:00:05:17
              </div>
            </div>

            <div className="h-[28px] bg-[#0C1016] px-4">
              <div className="flex h-full items-center justify-between text-[10px] font-medium tracking-[0.06em] text-[#8D9AAF]">
                <span>0:00</span>
                <span>0:05</span>
                <span>0:10</span>
                <span>0:15</span>
                <span>0:20</span>
                <span>0:25</span>
                <span>0:30</span>
              </div>
              <div className="h-[2px] w-full bg-[#F2C94C]" />
            </div>

            <div className="relative h-[270px] bg-[#0B0D12]">
              <div className="absolute left-0 top-0 h-full w-[64px] bg-[#0D1117]" />
              <div className="absolute left-[64px] top-0 h-full w-[calc(100%-64px)] bg-[#0B0D12]" />

              {[
                { label: "V1", y: 22 },
                { label: "V2", y: 74 },
                { label: "A1", y: 170 },
                { label: "A2", y: 222 },
              ].map((t) => (
                <div
                  key={t.label}
                  className="absolute left-[18px] text-[10px] font-bold text-[#C7D0DD]"
                  style={{ top: t.y }}
                >
                  {t.label}
                </div>
              ))}

              {[
                { y: 8 },
                { y: 60 },
                { y: 156 },
                { y: 208 },
              ].map((lane) => (
                <div
                  key={lane.y}
                  className="absolute left-[64px] h-[44px] w-[calc(100%-64px)] bg-[#0D1016]"
                  style={{ top: lane.y }}
                />
              ))}

              {clips.map((c, idx) => (
                <div
                  key={idx}
                  className="absolute left-[64px] h-[32px] rounded-sm"
                  style={{
                    top: c.top,
                    left: `calc(64px + ${c.left}%)`,
                    width: `${c.width}%`,
                    background: c.color,
                    opacity: 0.95,
                  }}
                />
              ))}

              <div
                className="absolute top-0 h-full w-[2px] bg-[#2DD4BF]"
                style={{ left: "calc(64px + 42%)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
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
            onClick={() =>
              setSelectedIndex((v) => Math.max(0, v - 1))
            }
            disabled={selectedIndex <= 0}
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
            onClick={() =>
              setSelectedIndex((v) => Math.min(mediaItems.length - 1, v + 1))
            }
            disabled={selectedIndex >= mediaItems.length - 1}
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
              if (delta < 0) {
                setSelectedIndex((v) =>
                  Math.min(mediaItems.length - 1, v + 1),
                );
              } else {
                setSelectedIndex((v) => Math.max(0, v - 1));
              }
            }}
          >
            <div
              className="lightbox__track"
              style={{
                transform: `translate3d(${-selectedIndex * 100}%, 0, 0)`,
              }}
            >
              {mediaItems.map((item) => (
                <div key={item.label} className="lightbox__slide">
                  <img
                    className="lightbox__img"
                    src={item.src}
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
