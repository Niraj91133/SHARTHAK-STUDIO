"use client";

import dynamic from "next/dynamic";
import HeroScroll from "@/components/HeroScroll";
import GallerySection from "@/components/GallerySection";
import LatestWorkSection from "@/components/LatestWorkSection";
import { useEffect, useState } from "react";
import ExpertiseSection from "@/components/ExpertiseSection";
import VideoEditingTimelineSection from "@/components/VideoEditingTimelineSection";
import WhyChooseUsBookFlipSection from "@/components/WhyChooseUsBookFlipSection";
import InfiniteStripsCTASection from "@/components/InfiniteStripsCTASection";
import CameraCTASection from "@/components/CameraCTASection";

const CoupleShootGame = dynamic(() => import("@/components/CoupleShootGame"), {
  ssr: false,
});

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="min-h-svh bg-black" suppressHydrationWarning />;
  }

  const categories = [
    "PHOTOGRAPHY",
    "PHOTO EDITING",
    "VIDEO EDITING",
  ];

  const featureLines = [
    "Cinematic Quality",
    "Premium Editing",
    "Creative Shots",
    "Luxury Visuals",
    "HD Delivery",
    "Color Perfection",
    "Emotional Moments",
    "Natural Captures",
    "Professional Team",
    "Fast Delivery",
    "Trusted Service",
    "Detail Focused",
    "Storytelling Style",
    "Perfect Lighting",
    "Memorable Frames",
    "Smooth Reels",
  ];

  const galleryTabs = Array.from({ length: 6 }, () => "PHOTOGRAPHY");
  const galleryItems = [
    { seed: "gal-01", col: "1 / span 1", row: "1 / span 2" },
    { seed: "gal-02", col: "1 / span 1", row: "3 / span 2" },
    { seed: "gal-03", col: "2 / span 2", row: "1 / span 1" },
    { seed: "gal-04", col: "2 / span 2", row: "2 / span 2" },
    { seed: "gal-05", col: "2 / span 2", row: "4 / span 1" },
    { seed: "gal-06", col: "4 / span 1", row: "1 / span 2" },
    { seed: "gal-07", col: "4 / span 1", row: "3 / span 1" },
    { seed: "gal-08", col: "4 / span 1", row: "4 / span 1" },
    { seed: "gal-09", col: "5 / span 1", row: "1 / span 2" },
    { seed: "gal-10", col: "6 / span 1", row: "1 / span 2" },
    { seed: "gal-11", col: "5 / span 2", row: "3 / span 1" },
    { seed: "gal-12", col: "5 / span 2", row: "4 / span 1" },
    { seed: "gal-13", col: "1 / span 1", row: "5 / span 2" },
    { seed: "gal-14", col: "2 / span 2", row: "5 / span 1" },
    { seed: "gal-15", col: "2 / span 2", row: "6 / span 1" },
    { seed: "gal-16", col: "4 / span 1", row: "5 / span 2" },
    { seed: "gal-17", col: "5 / span 1", row: "5 / span 2" },
    { seed: "gal-18", col: "6 / span 1", row: "5 / span 2" },
  ] as const;

  const galleryTabsModel = galleryTabs.map((label, idx) => ({
    label,
    active: idx === 0,
  }));

  return (
    <main className="min-h-svh bg-black text-white">
      <HeroScroll
        title="SHARTHAK STUDIO"
        eyebrow="SHARTHAK STUDIO"
        slides={Array.from({ length: 10 }, (_, i) => ({
          imageUrl: `https://picsum.photos/seed/sharthak-${String(i + 1).padStart(2, "0")}/2400/1600`,
          category: categories[i % categories.length],
        }))}
      />

      <CameraCTASection />

      <section className="relative min-h-svh bg-black px-6 py-20">
        <div className="mx-auto w-full max-w-none">
          <div className="grid items-center gap-10 md:grid-cols-[560px_1px_minmax(0,1fr)] md:gap-12">
            <div className="flex flex-col md:h-[760px] md:justify-between">
              <div>
                <h2 className="whitespace-pre-line text-[54px] font-bold leading-[0.92] tracking-[-0.01em] text-white sm:text-[72px] md:text-[104px]">
                  SHARTHAK{"\n"}STUDIO
                </h2>
                <p className="mt-6 max-w-[520px] text-sm leading-6 text-white/70">
                  Cinematic visuals. Premium edits. Timeless memories.
                </p>
              </div>

              <div className="mt-10 md:mt-0">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black px-8 py-3 text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-white hover:text-black"
                >
                  Contact
                </a>
              </div>
            </div>

            <div className="hidden h-[760px] w-px bg-white/10 md:block" />

            <div
              className="overflow-hidden rounded-2xl bg-black"
              style={{ border: "1px solid rgba(255,255,255,0.17)" }}
            >
              <div className="vmarquee">
                <div
                  className="vmarquee__layer vmarquee__layer--blur"
                  aria-hidden="true"
                >
                  <div className="vmarquee__track">
                    {[...featureLines, ...featureLines].map((line, idx) => (
                      <div
                        key={`blur-${line}-${idx}`}
                        className="vmarquee__row"
                        style={{
                          borderTop:
                            idx === 0
                              ? "none"
                              : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="vmarquee__text">{line}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="vmarquee__layer vmarquee__layer--sharp">
                  <div className="vmarquee__track">
                    {[...featureLines, ...featureLines].map((line, idx) => (
                      <div
                        key={`sharp-${line}-${idx}`}
                        className="vmarquee__row"
                        style={{
                          borderTop:
                            idx === 0
                              ? "none"
                              : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="vmarquee__text">{line}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GallerySection
        tabs={galleryTabsModel}
        items={galleryItems.map((i) => ({
          seed: i.seed,
          col: i.col,
          row: i.row,
        }))}
      />

      <LatestWorkSection />

      <CoupleShootGame />

      <ExpertiseSection />

      <VideoEditingTimelineSection />

      <WhyChooseUsBookFlipSection />

      <InfiniteStripsCTASection />
    </main>
  );
}
