"use client";

import Image from "next/image";

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
      className="relative inline-block overflow-hidden align-[0.08em]"
      style={{
        height: "0.66em",
        width: `${widthEm}em`,
        borderRadius: 2,
      }}
      aria-hidden={alt === ""}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="200px" />
    </span>
  );
}

function BigLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
      {children}
    </div>
  );
}

export default function WhyChooseUsSection() {
  // Keep domains on images.unsplash.com (already allowed in next.config.ts)
  const inline1 =
    "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?auto=format&fit=crop&w=900&q=80";
  const inline2 =
    "https://images.unsplash.com/photo-1520975958225-78317a29958d?auto=format&fit=crop&w=900&q=80";
  const band =
    "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=2400&q=80";

  return (
    <section className="w-full overflow-x-hidden bg-white px-4 py-20 text-black sm:px-6">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-center text-[clamp(28px,4.2vw,54px)] font-light tracking-[0.08em] text-black/85">
          WHY CHOOSE US?
        </h2>

        <div className="mt-14 space-y-4">
          <div className="text-[clamp(28px,5.2vw,64px)] font-black leading-[0.98] tracking-[-0.02em]">
            <BigLine>
              <span>BECAUSE EVERY MOMENT</span>
              <InlinePhoto src={inline1} alt="" widthEm={2.8} />
              <span>MATTERS.</span>
            </BigLine>
          </div>

          <div className="text-[clamp(28px,5.2vw,64px)] font-black leading-[0.98] tracking-[-0.02em]">
            <BigLine>
              <span>FROM WEDDINGS TO FAMILY CELEBRATIONS, WE</span>
            </BigLine>
          </div>

          <div className="relative mx-auto h-[clamp(44px,5vw,72px)] w-[min(1200px,92vw)] overflow-hidden">
            <Image src={band} alt="" fill className="object-cover" sizes="1200px" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0) 14%, rgba(255,255,255,0) 86%, rgba(255,255,255,0.85))",
              }}
            />
          </div>

          <div className="pt-2 text-[clamp(28px,5.2vw,64px)] font-black leading-[0.98] tracking-[-0.02em]">
            <BigLine>
              <span>CAPTURE REAL EMOTIONS,</span>
            </BigLine>
          </div>

          <div className="text-[clamp(28px,5.2vw,64px)] font-black leading-[0.98] tracking-[-0.02em]">
            <BigLine>
              <span>CREATE CINEMATIC VISUALS, AND TURN YOUR</span>
            </BigLine>
          </div>

          <div className="text-[clamp(28px,5.2vw,64px)] font-black leading-[0.98] tracking-[-0.02em]">
            <BigLine>
              <span>MEMORIES INTO</span>
              <InlinePhoto src={inline2} alt="" widthEm={3.1} />
              <span>TIMELESS STORIES.</span>
            </BigLine>
          </div>
        </div>
      </div>
    </section>
  );
}

