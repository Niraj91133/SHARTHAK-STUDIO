export type MediaSlot = {
    id: string;
    section: string;
    frame: string;
    type: "image" | "video";
    currentSrc: string;
    uploadedFile?: {
        name: string;
        url: string; // base64 or object URL (though IndexedDB will store the actual file)
        size: number;
        uploadedAt: string;
    };
    fallbackSrc: string;
    useOnSite: boolean;
    categoryLabel?: string; // For Hero Scroll
};

export const mediaSlots: MediaSlot[] = [
    // Hero Scroll
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `hero-slide-${String(i + 1).padStart(2, "0")}`,
        section: "Hero Scroll",
        frame: `Slide ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/sharthak-${String(i + 1).padStart(2, "0")}/2400/1600`,
        fallbackSrc: `https://picsum.photos/seed/sharthak-${String(i + 1).padStart(2, "0")}/2400/1600`,
        useOnSite: false,
        categoryLabel: ["PHOTOGRAPHY", "PHOTO EDITING", "VIDEO EDITING"][i % 3],
    })),

    // Camera CTA
    {
        id: "camera-cta-bg",
        section: "Camera CTA",
        frame: "Background",
        type: "image",
        currentSrc: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000",
        fallbackSrc: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000",
        useOnSite: false,
    },

    // Gallery Section
    ...Array.from({ length: 18 }, (_, i) => ({
        id: `gal-${String(i + 1).padStart(2, "0")}`,
        section: "Gallery Section",
        frame: `Tile ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/gal-${String(i + 1).padStart(2, "0")}/1200/1200`,
        fallbackSrc: `https://picsum.photos/seed/gal-${String(i + 1).padStart(2, "0")}/1200/1200`,
        useOnSite: false,
    })),

    // Latest Work
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `latest-work-${String(i + 1).padStart(2, "0")}`,
        section: "Latest Work",
        frame: `Slot ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/latest-${i + 1}/800/1000`,
        fallbackSrc: `https://picsum.photos/seed/latest-${i + 1}/800/1000`,
        useOnSite: false,
    })),

    // Expertise Section
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `expertise-${String(i + 1).padStart(2, "0")}`,
        section: "Expertise Section",
        frame: `Card ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/expertise-${i + 1}/800/1000`,
        fallbackSrc: `https://picsum.photos/seed/expertise-${i + 1}/800/1000`,
        useOnSite: false,
    })),

    // Video Editing Timeline
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `C221${i}`,
        section: "Video Editing Timeline",
        frame: `Video ${i + 1}`,
        type: "video" as const,
        currentSrc: "https://assets.mixkit.co/videos/preview/mixkit-taking-photos-from-a-camera-34644-large.mp4",
        fallbackSrc: "https://assets.mixkit.co/videos/preview/mixkit-taking-photos-from-a-camera-34644-large.mp4",
        useOnSite: false,
    })),

    // Why Choose Us (Book Flip)
    ...Array.from({ length: 20 }, (_, i) => {
        const pageNum = Math.floor(i / 4) + 1;
        const itemNum = (i % 4) + 1;
        const isHero = itemNum === 1;
        return {
            id: `why-choose-us-p${pageNum}-${isHero ? "hero" : `tile-${itemNum - 1}`}`,
            section: "Why Choose Us",
            frame: `Page ${pageNum} - ${isHero ? "Hero" : `Tile ${itemNum - 1}`}`,
            type: "image" as const,
            currentSrc: `https://picsum.photos/seed/why-${i}/1200/1600`,
            fallbackSrc: `https://picsum.photos/seed/why-${i}/1200/1600`,
            useOnSite: false,
        };
    }),

    // Infinite Strips CTA
    ...Array.from({ length: 12 }, (_, i) => {
        const isTop = i < 6;
        const side = isTop ? "top" : "bot";
        const slotNum = (i % 6) + 1;
        return {
            id: `strip-${side}-${String(slotNum).padStart(2, "0")}`,
            section: "Infinite Strips CTA",
            frame: `${isTop ? "Top" : "Bottom"} Strip - Slot ${slotNum}`,
            type: "image" as const,
            currentSrc: `https://picsum.photos/seed/strip-${i}/600/600`,
            fallbackSrc: `https://picsum.photos/seed/strip-${i}/600/600`,
            useOnSite: false,
        };
    }),
];
