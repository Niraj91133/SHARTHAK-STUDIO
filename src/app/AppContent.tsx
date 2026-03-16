"use client";

import { useMemo, useEffect, useRef } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import HeroScroll from "@/components/HeroScroll";
import GallerySection from "@/components/GallerySection";
import LatestWorkSection from "@/components/LatestWorkSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import VideoEditingTimelineSection from "@/components/VideoEditingTimelineSection";
import WhyChooseUsBookFlipSection from "@/components/WhyChooseUsBookFlipSection";
import InfiniteStripsCTASection from "@/components/InfiniteStripsCTASection";
import CameraCTASection from "@/components/CameraCTASection";

const CoupleShootGame = dynamic(() => import("@/components/CoupleShootGame"), {
    ssr: false,
});

export default function AppContent() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    const categories = useMemo(() => ["PHOTOGRAPHY", "PHOTO EDITING", "VIDEO EDITING"], []);

    const featureLines = useMemo(() => [
        "Cinematic Quality", "Premium Editing", "Creative Shots", "Luxury Visuals",
        "HD Delivery", "Color Perfection", "Emotional Moments", "Natural Captures",
        "Professional Team", "Fast Delivery", "Trusted Service", "Detail Focused",
        "Storytelling Style", "Perfect Lighting", "Memorable Frames", "Smooth Reels",
    ], []);

    const galleryTabs = useMemo(() => {
        const tabs = Array.from({ length: 6 }, () => ({
            label: "PHOTOGRAPHY",
            active: false,
        }));
        tabs[0].active = true;
        return tabs;
    }, []);

    const galleryItems = useMemo(() => [
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
    ], []);

    return (
        <main className="min-h-screen bg-black text-white relative">
            <HeroScroll
                title="SHARTHAK STUDIO"
                eyebrow="SHARTHAK STUDIO"
                slides={Array.from({ length: 10 }, (_, i) => ({
                    imageUrl: `https://picsum.photos/seed/sharthak-${String(i + 1).padStart(2, "0")}/2400/1600`,
                    category: categories[i % categories.length],
                }))}
            />

            <CameraCTASection />

            {/* Intro Stats Section */}
            <section className="relative min-h-[50vh] bg-black px-6 py-20 flex items-center justify-center overflow-hidden">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-6xl md:text-8xl font-black leading-none tracking-tighter">
                            SHARTHAK<br />STUDIO
                        </h2>
                        <p className="text-xl text-white/60 max-w-md">
                            We don&apos;t just take photos. We capture the soul of the moment,
                            refined through cinematic lenses and expert hands.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm hover:invert transition-all">
                                View Portfolio
                            </button>
                            <button className="px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all">
                                The Team
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "YEARS", val: "10+" },
                            { label: "WEDDINGS", val: "500+" },
                            { label: "REELS", val: "2k+" },
                            { label: "HAPPY LIVES", val: "∞" }
                        ].map((stat) => (
                            <div key={stat.label} className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-yellow-400 transition-all duration-500">
                                <div className="text-4xl font-black group-hover:text-black transition-colors">{stat.val}</div>
                                <div className="text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-black/60 transition-colors mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Slider */}
            <section className="py-20 bg-white text-black overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...featureLines, ...featureLines].map((line, i) => (
                        <span key={i} className="text-8xl font-black px-12 tracking-tighter opacity-10 hover:opacity-100 transition-opacity cursor-default">
                            {line.toUpperCase()}
                        </span>
                    ))}
                </div>
            </section>

            <GallerySection tabs={galleryTabs} items={galleryItems} />

            <LatestWorkSection />

            <CoupleShootGame />

            <ExpertiseSection />

            <VideoEditingTimelineSection />

            <WhyChooseUsBookFlipSection />

            <InfiniteStripsCTASection />

            {/* Footer */}
            <footer className="bg-black py-20 px-6 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter">LET&apos;S CRAFT YOUR STORY</h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="space-y-2">
                            <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Email Us</div>
                            <div className="text-xl font-bold">hello@sharthak.studio</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Call Us</div>
                            <div className="text-xl font-bold">+91 98765 43210</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Instagram</div>
                            <div className="text-xl font-bold">@sharthak_studio</div>
                        </div>
                    </div>
                    <div className="pt-20 text-[10px] tracking-[0.5em] text-white/20 uppercase">
                        © 2026 SHARTHAK STUDIO. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </main>
    );
}
