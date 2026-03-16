"use client";

import { useMemo } from "react";

function buildPicsum(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/900`;
}

export default function InfiniteStripsCTASection() {
  const topImages = useMemo(
    () => [
      buildPicsum("strip-top-01"),
      buildPicsum("strip-top-02"),
      buildPicsum("strip-top-03"),
      buildPicsum("strip-top-04"),
      buildPicsum("strip-top-05"),
      buildPicsum("strip-top-06"),
    ],
    [],
  );

  const bottomImages = useMemo(
    () => [
      buildPicsum("strip-bot-01"),
      buildPicsum("strip-bot-02"),
      buildPicsum("strip-bot-03"),
      buildPicsum("strip-bot-04"),
      buildPicsum("strip-bot-05"),
      buildPicsum("strip-bot-06"),
    ],
    [],
  );

  const topLoop = [...topImages, ...topImages];
  const bottomLoop = [...bottomImages, ...bottomImages];

  return (
    <section className="w-full bg-black text-white">
      <div className="w-full overflow-hidden">
        <div className="imgmarquee">
          <div className="imgmarquee__track">
            {topLoop.map((src, idx) => (
              <div key={`${src}-${idx}`} className="imgmarquee__tile">
                {/* Use <img> (not next/image) because source.unsplash.com redirects */}
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
            {bottomLoop.map((src, idx) => (
              <div key={`${src}-${idx}`} className="imgmarquee__tile">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
