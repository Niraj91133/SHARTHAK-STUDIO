"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "@/hooks/useMedia";

type SlideConfig = {
  id: string;
  fallback: string;
  title?: string;
  subtitle?: string;
};

function DynamicLatestSlide({ config, isActive }: { config: SlideConfig; isActive: boolean }) {
  const src = useMedia(config.id, config.fallback);
  return (
    <div className="latest-work__slide">
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt=""
          fill
          sizes="440px"
          className="object-cover"
          priority={isActive}
        />

        {config.title && (
          <>
            <div className="latest-work__view">VIEW</div>
            <div className="absolute bottom-7 left-6">
              <div className="text-lg font-extrabold text-white">
                {config.title}
              </div>
              <div className="text-sm text-white/80">
                {config.subtitle}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function LatestWorkSection() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const slides: SlideConfig[] = useMemo(
    () => [
      {
        id: "latest-work-01",
        title: "Retreat & Rally",
        subtitle: "for Padel United",
        fallback: "https://picsum.photos/seed/latest-work-01/1600/1200",
      },
      {
        id: "latest-work-02",
        fallback: "https://picsum.photos/seed/latest-work-02/1600/1200",
      },
      {
        id: "latest-work-03",
        fallback: "https://picsum.photos/seed/latest-work-03/1600/1200",
      },
      {
        id: "latest-work-04",
        fallback: "https://picsum.photos/seed/latest-work-04/1600/1200",
      },
      {
        id: "latest-work-05",
        fallback: "https://picsum.photos/seed/latest-work-05/1600/1200",
      },
      {
        id: "latest-work-06",
        fallback: "https://picsum.photos/seed/latest-work-06/1600/1200",
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const canPrev = index > 0;
  const canNext = index < slides.length - 1;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let locked = false;
    let unlockTimer: number | null = null;

    const unlockSoon = () => {
      if (unlockTimer) window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        locked = false;
        unlockTimer = null;
      }, 360);
    };

    const onWheel = (event: WheelEvent) => {
      if (!el.contains(event.target as Node)) return;
      if (event.deltaY === 0) return;
      event.preventDefault();
      if (locked) return;
      locked = true;
      const direction = Math.sign(event.deltaY);
      setIndex((current) =>
        Math.min(slides.length - 1, Math.max(0, current + direction)),
      );
      unlockSoon();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (unlockTimer) window.clearTimeout(unlockTimer);
      window.removeEventListener("wheel", onWheel);
    };
  }, [slides.length]);

  return (
    <section className="latest-work w-full bg-[#F3E9DC] px-6 py-16 text-[#111111] sm:py-20">
      <div className="mx-auto w-full max-w-none">
        <div className="grid gap-10 md:grid-cols-[1fr_2px_1fr] md:items-start">
          <div className="md:pl-8">
            <h2 className="text-balance text-4xl font-extrabold leading-[0.95] tracking-[-0.02em] sm:text-6xl">
              Feed on our latest work
            </h2>
            <div className="mt-2 text-xl font-semibold">
              (see how we stop the scroll)
            </div>
          </div>

          <div className="hidden h-28 w-[2px] bg-[#8FA7A133] md:block" />

          <div className="md:pr-8">
            <div className="font-[var(--font-geist-sans)] text-sm font-semibold tracking-[0.18em]">
              <span className="latest-work__tag">
                CURATE THE BEST WORK AND SERVICES
              </span>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="rounded-full border-2 border-[#111111] px-10 py-4 text-base font-semibold transition-colors hover:bg-[#111111] hover:text-[#F3E9DC]"
              >
                Our work
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid items-end gap-8 md:grid-cols-[140px_1fr]">
          <div className="flex gap-4 md:pl-8">
            <button
              type="button"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => setIndex((v) => Math.max(0, v - 1))}
              className="latest-work__arrow"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => setIndex((v) => Math.min(slides.length - 1, v + 1))}
              className="latest-work__arrow"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="latest-work__film md:justify-self-end">
            <div className="latest-work__perfs" aria-hidden="true" />

            <div
              className="latest-work__window"
              ref={stageRef}
              onClick={(event) => {
                const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = event.clientX - rect.left;
                if (x > rect.width * 0.55) {
                  setIndex((v) => Math.min(slides.length - 1, v + 1));
                } else if (x < rect.width * 0.45) {
                  setIndex((v) => Math.max(0, v - 1));
                }
              }}
            >
              <div
                className="latest-work__track"
                style={{
                  transform: `translate3d(${-index * 440}px, 0, 0)`,
                }}
              >
                {slides.map((config, i) => (
                  <DynamicLatestSlide
                    key={config.id}
                    config={config}
                    isActive={i === index}
                  />
                ))}
              </div>
            </div>

            <div className="latest-work__perfs" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
