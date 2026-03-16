"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

function InlinePhoto({
  src,
  widthEm = 2.8,
}: {
  src: string;
  widthEm?: number;
}) {
  return (
    <span
      className="relative inline-block overflow-hidden align-[0.06em]"
      style={{
        height: "0.66em",
        width: `${widthEm}em`,
        borderRadius: 6,
      }}
    >
      <Image src={src} alt="" fill className="object-cover" sizes="220px" />
    </span>
  );
}

type AlbumPage = {
  pageNo: number;
  title: ReactNode;
  body: string;
  heroQuery: string;
  tiles: string[];
};

function Page({
  data,
  rounded,
}: {
  data: AlbumPage;
  rounded: "left" | "right" | "none";
}) {
  return (
    <div
      className="h-full w-full bg-white"
      style={{
        padding: 34,
        borderTopLeftRadius: rounded === "left" ? 16 : 0,
        borderBottomLeftRadius: rounded === "left" ? 16 : 0,
        borderTopRightRadius: rounded === "right" ? 16 : 0,
        borderBottomRightRadius: rounded === "right" ? 16 : 0,
      }}
    >
      <div className="text-[12px] font-bold tracking-[0.22em] text-black/45">
        PAGE {data.pageNo}
      </div>

      <div className="mt-4 text-[clamp(26px,3.5vw,44px)] font-black leading-[0.98] tracking-[-0.02em] text-black">
        {data.title}
      </div>

      <div className="mt-6 text-[18px] font-semibold leading-[1.45] text-black/88">
        {data.body}
      </div>

      <div className="mt-8 overflow-hidden rounded-[14px]">
        <div className="relative h-[220px] w-full overflow-hidden rounded-[14px]">
          <Image
            src={`https://source.unsplash.com/featured/2400x1400?${encodeURIComponent(
              data.heroQuery,
            )}&sig=${data.pageNo * 10 + 3}`}
            alt=""
            fill
            className="object-cover"
            sizes="520px"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {data.tiles.map((q, idx) => (
          <div
            key={idx}
            className="relative aspect-[4/3] overflow-hidden rounded-[12px]"
          >
            <Image
              src={`https://source.unsplash.com/featured/1200x900?${encodeURIComponent(
                q,
              )}&sig=${data.pageNo * 10 + idx}`}
              alt=""
              fill
              className="object-cover"
              sizes="180px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhyChooseUsBookFlipSection() {
  const pages: AlbumPage[] = useMemo(
    () => [
      {
        pageNo: 1,
        title: (
          <>
            BECAUSE EVERY MOMENT{" "}
            <InlinePhoto src="https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?auto=format&fit=crop&w=1200&q=80" widthEm={3} />{" "}
            MATTERS.
          </>
        ),
        body: "From weddings to family celebrations, we capture real emotions and moments — not poses.",
        heroQuery: "wedding candid moment",
        tiles: ["wedding candid smile", "wedding couple hug", "wedding hands rings"],
      },
      {
        pageNo: 2,
        title: (
          <>
            WE CREATE{" "}
            <InlinePhoto src="https://images.unsplash.com/photo-1520975958225-78317a29958d?auto=format&fit=crop&w=1200&q=80" widthEm={3.2} />{" "}
            STORIES.
          </>
        ),
        body: "Premium editing, creative shots, perfect lighting, and luxury visuals — delivered in HD with detail‑focused storytelling.",
        heroQuery: "cinematic wedding couple wide shot",
        tiles: ["wedding cinematic lighting", "wedding details macro", "wedding couple wide"],
      },
      {
        pageNo: 3,
        title: <>CAPTURE REAL EMOTIONS.</>,
        body: "We focus on real smiles, candid moments, and the energy of your day — so it feels alive forever.",
        heroQuery: "wedding candid couple",
        tiles: ["wedding laughter", "wedding candid", "wedding family celebration"],
      },
      {
        pageNo: 4,
        title: <>CINEMATIC VISUALS.</>,
        body: "Smooth reels, color‑perfect frames, and a film‑like look — crafted to match your style.",
        heroQuery: "wedding film look",
        tiles: ["wedding sunset couple", "wedding slow motion", "wedding detail bokeh"],
      },
      {
        pageNo: 5,
        title: <>TIMELESS MEMORIES.</>,
        body: "On‑time delivery, friendly team, and a comfortable shoot experience — so you can enjoy your day fully.",
        heroQuery: "wedding couple portrait outdoors",
        tiles: ["wedding portrait", "wedding bride", "wedding groom"],
      },
    ],
    [],
  );

  const [leftIndex, setLeftIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const rightIndex = (leftIndex + 1) % pages.length;
  const nextIndex = (leftIndex + 2) % pages.length;

  const flipNext = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    window.setTimeout(() => {
      setLeftIndex(rightIndex);
      setIsFlipping(false);
    }, 720);
  };

  return (
    <section className="w-full overflow-x-hidden bg-white px-4 py-20 text-black sm:px-6">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-center text-[clamp(26px,4vw,46px)] font-light tracking-[0.08em] text-black/85">
          WHY CHOOSE US?
        </h2>

        <div className="mx-auto mt-12 w-full max-w-none">
          <div
            className="relative mx-auto w-full"
            style={{ perspective: "1800px" }}
          >
            {/* Stacked pages behind (album thickness) */}
            <div className="absolute inset-0 hidden md:block" aria-hidden="true">
              <div
                className="absolute left-0 top-0 h-full w-full"
                style={{
                  transform: "translate(10px, 10px)",
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.06)",
                }}
              />
              <div
                className="absolute left-0 top-0 h-full w-full"
                style={{
                  transform: "translate(6px, 6px)",
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.07)",
                }}
              />
            </div>

            <div
              className="relative mx-auto w-full overflow-hidden bg-white"
              style={{
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 40px 90px rgba(0,0,0,0.10)",
              }}
            >
              {/* Mobile: single page flip */}
              <div className="relative min-h-[640px] md:hidden">
                <div className="absolute inset-0">
                  <Page data={pages[rightIndex]} rounded="none" />
                </div>
                <button
                  type="button"
                  onClick={flipNext}
                  className="absolute inset-0 text-left"
                  aria-label="Turn page"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "left center",
                    transition: "transform 720ms cubic-bezier(0.22, 1, 0.36, 1)",
                    transform: isFlipping ? "rotateY(-180deg)" : "rotateY(0deg)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <Page data={pages[leftIndex]} rounded="none" />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <Page data={pages[rightIndex]} rounded="none" />
                  </div>
                </button>
              </div>

              {/* Desktop: album spread + right page turn */}
              <div className="relative hidden min-h-[640px] grid-cols-2 md:grid">
                <div className="relative">
                  <Page data={pages[leftIndex]} rounded="left" />
                  <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-[18px]"
                    style={{
                      background:
                        "linear-gradient(270deg, rgba(0,0,0,0.10), rgba(0,0,0,0))",
                      opacity: 0.25,
                    }}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0">
                    <Page data={pages[nextIndex]} rounded="right" />
                  </div>

                  <button
                    type="button"
                    onClick={flipNext}
                    className="absolute inset-0 text-left"
                    aria-label="Turn page"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "left center",
                      transition: "transform 720ms cubic-bezier(0.22, 1, 0.36, 1)",
                      transform: isFlipping ? "rotateY(-180deg)" : "rotateY(0deg)",
                      borderTopRightRadius: 16,
                      borderBottomRightRadius: 16,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <Page data={pages[rightIndex]} rounded="right" />
                    </div>

                    <div
                      className="absolute inset-0"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <Page data={pages[nextIndex]} rounded="right" />
                    </div>
                  </button>

                  <div
                    className="pointer-events-none absolute left-0 top-0 hidden h-full w-[1px] md:block"
                    style={{ background: "rgba(0,0,0,0.08)" }}
                  />
                  <div
                    className="pointer-events-none absolute left-0 top-0 hidden h-full w-[18px] md:block"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,0.10), rgba(0,0,0,0))",
                      opacity: 0.22,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {pages.map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{
                    background:
                      i === leftIndex ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.18)",
                  }}
                />
              ))}
            </div>

            <div className="mt-2 text-center text-[13px] font-semibold tracking-[0.04em] text-black/45">
              Click the page to turn →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
