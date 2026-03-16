"use client";

import { useEffect, useRef, useState } from "react";

type Couple = {
  id: string;
  x: number;
  y: number;
  vx: number;
  size: number;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function CoupleIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M23 30c5.2 0 9.5-4.3 9.5-9.5S28.2 11 23 11s-9.5 4.3-9.5 9.5S17.8 30 23 30Zm18 2c4.2 0 7.7-3.4 7.7-7.7S45.2 16.6 41 16.6s-7.7 3.4-7.7 7.7S36.8 32 41 32Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M8 54c0-9.8 7.9-17.7 17.7-17.7S43.4 44.2 43.4 54H8Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M33.5 54c0-6.8 5.5-12.3 12.3-12.3S58.1 47.2 58.1 54H33.5Z"
        fill="currentColor"
        opacity="0.78"
      />
      <path
        d="M32 26.5c0-4.3 3.5-7.8 7.8-7.8 2.4 0 4.6 1.1 6.1 2.9 1.5-1.8 3.7-2.9 6.1-2.9 4.3 0 7.8 3.5 7.8 7.8 0 7.7-13.9 14.3-13.9 14.3S32 34.2 32 26.5Z"
        fill="#FF2D55"
        opacity="0.92"
      />
    </svg>
  );
}

export default function CoupleShootGame() {
  const [mode, setMode] = useState<"idle" | "playing" | "over">("idle");
  const [shots, setShots] = useState(0);
  const [missed, setMissed] = useState(0);
  const [, setFrameTick] = useState(0);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const stageSizeRef = useRef({ width: 0, height: 0 });
  const couplesRef = useRef<Couple[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const spawnAccMsRef = useRef(0);
  const lastRenderTsRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = null;
    startTsRef.current = null;
    spawnAccMsRef.current = 0;
    lastRenderTsRef.current = null;
  };

  const resetGame = () => {
    clearTimers();
    couplesRef.current = [];
    setShots(0);
    setMissed(0);
    setMode("idle");
  };

  const startGame = () => {
    clearTimers();
    couplesRef.current = [];
    setShots(0);
    setMissed(0);
    setMode("playing");
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mode === "playing") {
      document.documentElement.dataset.game = "playing";
    } else {
      delete document.documentElement.dataset.game;
    }
    return () => {
      delete document.documentElement.dataset.game;
    };
  }, [mode]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      stageSizeRef.current = { width: rect.width, height: rect.height };
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    stageSizeRef.current = { width: rect.width, height: rect.height };
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (mode !== "playing") return;

    const spawn = (elapsedSeconds: number) => {
      const { width, height } = stageSizeRef.current;
      if (width <= 0 || height <= 0) return;
      const maxCouples = Math.min(10, 3 + Math.floor(elapsedSeconds / 14));
      if (couplesRef.current.length >= maxCouples) return;

      const size = Math.round(randomBetween(28, 44));
      const y = clamp(
        randomBetween(80, height - size - 18),
        80,
        Math.max(80, height - size - 18),
      );

      const x = -size;
      const baseSpeed = 55 + elapsedSeconds * 3; // easy → hard (even slower)
      const vx = baseSpeed + randomBetween(-18, 22);

      couplesRef.current.push({ id: uid(), x, y, vx, size });
    };

    const tick = (ts: number) => {
      if (!startTsRef.current) startTsRef.current = ts;
      const last = lastTsRef.current ?? ts;
      const dt = Math.min(0.033, (ts - last) / 1000);
      lastTsRef.current = ts;
      const elapsedSeconds = (ts - (startTsRef.current ?? ts)) / 1000;

      // spawn rate ramps up over time
      const intervalMs = Math.max(800, 1800 - elapsedSeconds * 30);
      spawnAccMsRef.current += dt * 1000;
      while (spawnAccMsRef.current >= intervalMs) {
        spawnAccMsRef.current -= intervalMs;
        spawn(elapsedSeconds);
      }

      const { width } = stageSizeRef.current;
      const next: Couple[] = [];
      let missedThisFrame = 0;

      for (const c of couplesRef.current) {
        const x = c.x + c.vx * dt;
        const outRight = x > width + c.size + 4;
        if (outRight) {
          missedThisFrame += 1;
          continue;
        }
        next.push({ ...c, x });
      }

      couplesRef.current = next;

      if (missedThisFrame) {
        setMissed((m) => {
          const nextMissed = m + missedThisFrame;
          if (nextMissed >= 10) {
            window.setTimeout(() => {
              clearTimers();
              couplesRef.current = [];
              setMode("over");
            }, 0);
          }
          return nextMissed;
        });
      }

      const lastRender = lastRenderTsRef.current ?? 0;
      if (ts - lastRender > 33) {
        lastRenderTsRef.current = ts;
        setFrameTick((t) => (t + 1) % 1_000_000);
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };

    spawnAccMsRef.current = 9999;
    rafRef.current = window.requestAnimationFrame(tick);

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const shoot = (id: string) => {
    if (mode !== "playing") return;
    const before = couplesRef.current.length;
    couplesRef.current = couplesRef.current.filter((c) => c.id !== id);
    if (couplesRef.current.length !== before) {
      setShots((s) => s + 1);
    }
  };

  return (
    <section className="w-full bg-white text-black">
      <div
        ref={stageRef}
        className={`relative h-svh w-full overflow-hidden bg-white ${
          mode === "playing" ? "camera-cursor" : ""
        }`}
      >
        {/* HUD */}
        <div className="pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-3">
          <div className="rounded-full border border-black/10 bg-white/85 px-4 py-2 text-sm font-semibold backdrop-blur">
            Shots: <span className="tabular-nums">{shots}</span>
          </div>
          <div className="rounded-full border border-black/10 bg-white/85 px-4 py-2 text-sm font-semibold backdrop-blur">
            Missed: <span className="tabular-nums">{missed}</span>/10
          </div>
        </div>

        <button
          type="button"
          onClick={resetGame}
          className="absolute right-5 top-5 z-10 rounded-full border border-black/10 bg-white/85 p-2 backdrop-blur transition hover:bg-white"
          aria-label="Restart"
          title="Restart"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 12a8 8 0 1 1-2.34-5.66"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M20 4v6h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {mode === "idle" && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <div className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                Shoot the Couple
              </div>
              <div className="mx-auto mt-4 max-w-xl text-sm text-black/60">
                Camera cursor ko couple par le jaake click karo. 10 miss hue to
                game over.
              </div>
              <button
                type="button"
                onClick={startGame}
                className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-black px-12 text-base font-semibold tracking-wide text-white transition hover:bg-black/90"
              >
                Start
              </button>
            </div>
          </div>
        )}

        {mode === "over" && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <div className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                Game Over
              </div>
              <div className="mx-auto mt-4 max-w-xl text-sm text-black/60">
                Aapne 10 couples miss kar diye. Shots:{" "}
                <span className="font-semibold tabular-nums">{shots}</span>
              </div>
              <button
                type="button"
                onClick={startGame}
                className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-black px-12 text-base font-semibold tracking-wide text-white transition hover:bg-black/90"
              >
                Restart
              </button>
            </div>
          </div>
        )}

        {/* Couples */}
        {mode === "playing" &&
          couplesRef.current.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => shoot(c.id)}
              className="absolute z-[2] text-black/90 transition hover:scale-105"
              style={{
                left: `${c.x}px`,
                top: `${c.y}px`,
                width: `${c.size}px`,
                height: `${c.size}px`,
              }}
              aria-label="Couple"
            >
              <CoupleIcon size={c.size} />
            </button>
          ))}
      </div>
    </section>
  );
}
