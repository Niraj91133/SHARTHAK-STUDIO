"use client";

import { useMemo } from "react";
import { useMedia } from "@/hooks/useMedia";

function DynamicStripTile({ slotId, fallback, idx }: { slotId: string; fallback: string; idx: number }) {
  const src = useMedia(slotId, fallback);
  return (
    <div className="imgmarquee__tile">
      <img
        src={src}
        alt=""
        loading={idx < 3 ? "eager" : "lazy"}
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

export default function InfiniteStripsCTASection() {
  const topConfigs = useMemo(
    () => [
      { id: "strip-top-01", fallback: "https://picsum.photos/seed/strip-0/600/600" },
      { id: "strip-top-02", fallback: "https://picsum.photos/seed/strip-1/600/600" },
      { id: "strip-top-03", fallback: "https://picsum.photos/seed/strip-2/600/600" },
      { id: "strip-top-04", fallback: "https://picsum.photos/seed/strip-3/600/600" },
      { id: "strip-top-05", fallback: "https://picsum.photos/seed/strip-4/600/600" },
      { id: "strip-top-06", fallback: "https://picsum.photos/seed/strip-5/600/600" },
    ],
    [],
  );

  const botConfigs = useMemo(
    () => [
      { id: "strip-bot-01", fallback: "https://picsum.photos/seed/strip-6/600/600" },
      { id: "strip-bot-02", fallback: "https://picsum.photos/seed/strip-7/600/600" },
      { id: "strip-bot-03", fallback: "https://picsum.photos/seed/strip-8/600/600" },
      { id: "strip-bot-04", fallback: "https://picsum.photos/seed/strip-9/600/600" },
      { id: "strip-bot-05", fallback: "https://picsum.photos/seed/strip-10/600/600" },
      { id: "strip-bot-06", fallback: "https://picsum.photos/seed/strip-11/600/600" },
    ],
    [],
  );

  const topLoop = [...topConfigs, ...topConfigs];
  const bottomLoop = [...botConfigs, ...botConfigs];

  return (
    <section className="w-full bg-black text-white">
      <div className="w-full overflow-hidden">
        <div className="imgmarquee">
          <div className="imgmarquee__track">
            {topLoop.map((config, idx) => (
              <DynamicStripTile
                key={`${config.id}-${idx}`}
                slotId={config.id}
                fallback={config.fallback}
                idx={idx}
              />
            ))}
          </div>
        </div>

        <div className="flex min-h-[380px] w-full items-center justify-center px-6 py-20">
          <div className="text-center">
            <div className="text-[clamp(28px,4.8vw,64px)] font-light tracking-[0.22em] text-white/95">
              GET YOUR MOMENT CAPTURE
            </div>
            <a
              href="#contact"
              className="mt-8 inline-flex h-14 w-[320px] items-center justify-center border border-white/65 text-[14px] font-medium tracking-[0.16em] text-white/80 transition-colors duration-200 hover:bg-white hover:text-black"
            >
              CONTACT US
            </a>
          </div>
        </div>

        <div className="imgmarquee imgmarquee--reverse">
          <div className="imgmarquee__track">
            {bottomLoop.map((config, idx) => (
              <DynamicStripTile
                key={`${config.id}-${idx}`}
                slotId={config.id}
                fallback={config.fallback}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
