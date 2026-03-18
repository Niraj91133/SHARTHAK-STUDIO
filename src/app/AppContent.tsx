"use client";

import { useMemo, useEffect, useRef } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Components
import HeroScroll from "@/components/HeroScroll";
import CameraCTASection from "@/components/CameraCTASection";

import WhyChooseUsSection from "@/components/WhyChooseUsSection";

// Lazy-loaded sections for performance and stability
const GallerySection = dynamic(() => import("@/components/GallerySection"), { ssr: false });
const LatestWorkSection = dynamic(() => import("@/components/LatestWorkSection"), { ssr: false });
const ExpertiseSection = dynamic(() => import("@/components/ExpertiseSection"), { ssr: false });
const VideoEditingTimelineSection = dynamic(() => import("@/components/VideoEditingTimelineSection"), { ssr: false });
const WhyChooseUsBookFlipSection = dynamic(() => import("@/components/WhyChooseUsBookFlipSection"), { ssr: false });
const InfiniteStripsCTASection = dynamic(() => import("@/components/InfiniteStripsCTASection"), { ssr: false });
const CoupleShootGame = dynamic(() => import("@/components/CoupleShootGame"), { ssr: false });

export default function AppContent() {
    const lenisRef = useRef<Lenis | null>(null);
    const router = useRouter();

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            duration: 1,
            smoothWheel: true,
            wheelMultiplier: 1.1,
            gestureOrientation: "vertical",
            touchMultiplier: 2,
            infinite: false,
        });

        // Expose lenis globally for components like HeroScroll to use
        (window as any).lenis = lenis;

        // Sync GSAP with Lenis RAF
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            (window as any).lenis = null;
        };
    }, []);

    const featureLines = useMemo(() => [
        "Cinematic Quality", "Premium Editing", "Creative Shots", "Luxury Visuals",
        "HD Delivery", "Color Perfection", "Emotional Moments", "Natural Captures",
        "Professional Team", "Fast Delivery", "Trusted Service", "Detail Focused",
        "Storytelling Style", "Perfect Lighting", "Memorable Frames", "Smooth Reels",
    ], []);

    const galleryTabs = useMemo(() => [
        { label: "WEDDING" },
        { label: "PRE-WEDDING" },
        { label: "CANDID" },
        { label: "MODEL SHOOT" },
        { label: "MATERNITY" },
        { label: "BABY SHOOT" },
    ], []);

    const galleryItems = useMemo(() => [
        // Wedding
        { seed: "gal-01", col: "1 / span 1", row: "1 / span 2", category: "WEDDING" },
        { seed: "gal-02", col: "1 / span 1", row: "3 / span 2", category: "WEDDING" },
        { seed: "gal-03", col: "2 / span 2", row: "1 / span 1", category: "WEDDING" },
        // Pre-Wedding
        { seed: "gal-04", col: "2 / span 2", row: "2 / span 2", category: "PRE-WEDDING" },
        { seed: "gal-05", col: "2 / span 2", row: "4 / span 1", category: "PRE-WEDDING" },
        { seed: "gal-06", col: "4 / span 1", row: "1 / span 2", category: "PRE-WEDDING" },
        // Candid
        { seed: "gal-07", col: "4 / span 1", row: "3 / span 1", category: "CANDID" },
        { seed: "gal-08", col: "4 / span 1", row: "4 / span 1", category: "CANDID" },
        { seed: "gal-09", col: "5 / span 1", row: "1 / span 2", category: "CANDID" },
        // Model Shoot
        { seed: "gal-10", col: "6 / span 1", row: "1 / span 2", category: "MODEL SHOOT" },
        { seed: "gal-11", col: "5 / span 2", row: "3 / span 1", category: "MODEL SHOOT" },
        { seed: "gal-12", col: "5 / span 2", row: "4 / span 1", category: "MODEL SHOOT" },
        // Maternity
        { seed: "gal-13", col: "1 / span 1", row: "5 / span 2", category: "MATERNITY" },
        { seed: "gal-14", col: "2 / span 2", row: "5 / span 1", category: "MATERNITY" },
        { seed: "gal-15", col: "2 / span 2", row: "6 / span 1", category: "MATERNITY" },
        // Baby Shoot
        { seed: "gal-16", col: "4 / span 1", row: "5 / span 2", category: "BABY SHOOT" },
        { seed: "gal-17", col: "5 / span 1", row: "5 / span 2", category: "BABY SHOOT" },
        { seed: "gal-18", col: "6 / span 1", row: "5 / span 2", category: "BABY SHOOT" },
    ], []);

    const handleAdminLogin = () => {
        const id = window.prompt("Enter Admin ID:");
        if (id === "Sonu Sharthak") {
            const pass = window.prompt("Enter Password:");
            if (pass === "0000") {
                router.push("/admin");
            } else {
                alert("Incorrect Password!");
            }
        } else if (id !== null) {
            alert("Incorrect ID!");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <HeroScroll
                title="SHARTHAK STUDIO"
                eyebrow="SHARTHAK STUDIO"
            />

            {/* Feature Slider */}
            <section className="py-24 bg-white text-black overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap will-change-transform">
                    {[...featureLines, ...featureLines].map((line, i) => (
                        <span key={i} className="text-9xl font-black px-12 tracking-tighter opacity-10 hover:opacity-100 transition-opacity cursor-default">
                            {line.toUpperCase()}
                        </span>
                    ))}
                </div>
            </section>

            <GallerySection tabs={galleryTabs} items={galleryItems} />

            <ExpertiseSection />

            <LatestWorkSection />

            <VideoEditingTimelineSection />

            <WhyChooseUsBookFlipSection />

            <CoupleShootGame />

            <CameraCTASection />

            <WhyChooseUsSection />

            <InfiniteStripsCTASection />

            {/* Footer */}
            <footer className="bg-black py-32 px-6 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto space-y-16">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-none">LET&apos;S CRAFT YOUR STORY</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                        <div className="space-y-3">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Email Us</div>
                            <div className="text-2xl font-bold">hello@sharthak.studio</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Call Us</div>
                            <div className="text-2xl font-bold">+91 98765 43210</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Instagram</div>
                            <div className="text-2xl font-bold">@sharthak_studio</div>
                        </div>
                    </div>
                    <div className="pt-24 space-y-6">
                        <button
                            onClick={handleAdminLogin}
                            className="text-[10px] tracking-[0.6em] text-white/20 uppercase font-medium hover:text-white/60 transition-colors"
                        >
                            ADMIN LOGIN
                        </button>
                        <div className="text-[10px] tracking-[0.6em] text-white/10 uppercase font-medium">
                            © 2026 SHARTHAK STUDIO. ALL RIGHTS RESERVED.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
