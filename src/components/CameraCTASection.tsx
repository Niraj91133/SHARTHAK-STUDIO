"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMedia } from "@/hooks/useMedia";

export default function CameraCTASection() {
    const bgImage = useMedia("camera-cta-bg", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000");

    return (
        <section className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-black">
            {/* Background Image Container */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="absolute inset-0 w-full h-full"
            >
                <Image
                    src={bgImage}
                    alt="Photographer holding camera at a wedding"
                    fill
                    className="object-cover grayscale"
                    priority
                />
            </motion.div>

            {/* Button Content */}
            <div className="relative z-10 flex flex-col items-center justify-start h-full pt-[20vh] md:pt-[15vh]">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <a
                        href="#contact"
                        className="bg-black text-white px-12 py-3 text-xs md:text-sm font-bold tracking-[0.2em] transition-all hover:bg-white hover:text-black uppercase border border-white/20"
                        style={{ letterSpacing: "4px" }}
                    >
                        CONTACT US
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
