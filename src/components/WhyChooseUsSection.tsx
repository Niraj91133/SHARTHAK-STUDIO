"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useInView, motion, useSpring, useTransform } from "framer-motion";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const springValue = useSpring(0, {
    damping: 30,
    stiffness: 100,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, springValue, value]);

  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  return (
    <span ref={ref} className="inline-flex items-center">
      <motion.span>{displayValue}</motion.span>
      {suffix && <span className="ml-1">{suffix}</span>}
    </span>
  );
}

function InlinePhoto({
  src,
  alt,
  widthEm = 2.6,
}: {
  src: string;
  alt: string;
  widthEm?: number;
}) {
  return (
    <span
      className="relative inline-block overflow-hidden align-[0.08em] shadow-2xl"
      style={{
        height: "0.66em",
        width: `${widthEm}em`,
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.1)"
      }}
      aria-hidden={alt === ""}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="300px" />
    </span>
  );
}

function BigLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-center">
      {children}
    </div>
  );
}

const stats = [
  { label: "YEARS OF EXCELLENCE", val: 10, suffix: "+" },
  { label: "WEDDINGS CAPTURED", val: 500, suffix: "+" },
  { label: "CINEMATIC REELS", val: 2000, suffix: "+" },
  { label: "HAPPY LIVES", val: 0, suffix: "∞" }
];

export default function WhyChooseUsSection() {
  const inline1 = "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?auto=format&fit=crop&w=900&q=80";
  const inline2 = "https://images.unsplash.com/photo-1520975958225-78317a29958d?auto=format&fit=crop&w=900&q=80";

  return (
    <section className="relative w-full overflow-hidden bg-black py-32 text-white">
      {/* Background Subtle Elements */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/2 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-yellow-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <h2 className="text-[clamp(12px,1.2vw,14px)] font-black tracking-[0.6em] text-white/30 uppercase mb-6">
            The Sharthak edge
          </h2>
          <div className="text-[clamp(32px,6vw,84px)] font-black leading-[0.9] tracking-tighter">
            WHY CHOOSE US?
          </div>
        </motion.div>

        {/* Cinematic Text Blocks */}
        <div className="space-y-12">
          <div className="text-[clamp(24px,4.5vw,72px)] font-black leading-[0.95] tracking-tightest uppercase italic">
            <BigLine>
              <span className="text-white/40">BECAUSE EVERY</span>
              <InlinePhoto src={inline1} alt="" widthEm={3.2} />
              <span>MOMENT MATTERS.</span>
            </BigLine>
          </div>

          <div className="text-[clamp(24px,4.5vw,72px)] font-black leading-[0.95] tracking-tightest uppercase">
            <BigLine>
              <span>WE CAPTURE</span>
              <span className="border-b-4 border-teal-500 pb-1">REAL EMOTIONS</span>
              <span className="text-white/40">& CINEMATIC STORIES.</span>
            </BigLine>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-40 grid grid-cols-1 gap-px bg-white/5 md:grid-cols-4 border-y border-white/5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative bg-black py-16 px-8 text-center"
            >
              <div className="relative z-10">
                <div className="text-[clamp(44px,5vw,88px)] font-black tracking-tighter transition-transform duration-500 group-hover:scale-110">
                  {stat.val === 0 ? stat.suffix : <CountUp value={stat.val} suffix={stat.suffix} />}
                </div>
                <div className="mt-4 text-[11px] font-bold tracking-[0.4em] text-white/30 group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-32 text-center"
        >
          <div className="inline-flex items-center gap-6">
            <div className="h-px w-24 bg-white/10" />
            <div className="text-sm font-medium tracking-[0.2em] text-white/60">
              TURN YOUR MEMORIES INTO <span className="text-white">TIMELESS STORIES</span>
            </div>
            <div className="h-px w-24 bg-white/10" />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

