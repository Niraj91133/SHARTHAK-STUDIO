"use client";

import React, {
  useReducer,
  useRef,
  useEffect,
  useMemo,
  useLayoutEffect,
  useState,
} from "react";
import { useMediaContext } from "@/context/MediaContext";

// --- Constants ---

const FPS = 24;
const BASE_PX_PER_FRAME = 4;
const DEFAULT_CLIP_DURATION = 120; // 5 seconds
const TOTAL_TIMELINE_FRAMES = 12000; // 500 seconds
const BLACK_FRAME = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
const TRACKLIST_WIDTH = 64; // px (w-16)

// --- Types ---

type Track = "V2" | "V1" | "A1" | "A2";

interface Clip {
  id: string;
  track: Track;
  startFrame: number;
  durationFrames: number;
  color: string;
  label: string;
  slotId: string;
}

interface TimelineState {
  playheadFrame: number;
  scrollOffsetPx: number;
  zoomLevel: number;
  isPlaying: boolean;
  selectedClipId: string | null;
  clips: Clip[];
  draggingClipId: string | null;
  draggingMediaId: string | null;
  viewWidth: number;
}

type TimelineAction =
  | { type: "SET_PLAYHEAD"; frame: number }
  | { type: "SET_SCROLL"; offset: number }
  | { type: "SET_ZOOM"; level: number }
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_PLAYING"; isPlaying: boolean }
  | { type: "RESTART" }
  | { type: "SELECT_CLIP"; id: string | null }
  | { type: "UPDATE_CLIP"; id: string; updates: Partial<Clip> }
  | { type: "ADD_CLIP"; clip: Clip }
  | { type: "REMOVE_CLIP"; id: string }
  | { type: "START_DRAG_CLIP"; id: string }
  | { type: "END_DRAG_CLIP" }
  | { type: "START_DRAG_MEDIA"; id: string }
  | { type: "END_DRAG_MEDIA" }
  | { type: "SET_VIEW_WIDTH"; width: number };

// --- Utils ---

function formatTimecode(frames: number) {
  const f = frames % FPS;
  const s = Math.floor(frames / FPS) % 60;
  const m = Math.floor(frames / (FPS * 60)) % 60;
  const h = Math.floor(frames / (FPS * 60 * 60));
  return [h, m, s, f]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

function formatRulerTimecode(frames: number) {
  const s = Math.floor(frames / FPS) % 60;
  const m = Math.floor(frames / (FPS * 60));
  return `${m}:${String(s).padStart(2, "0")}`;
}

function checkCollision(clips: Clip[], currentId: string, track: string, newStart: number, newDur: number): boolean {
  const end = newStart + newDur;
  return clips.some(c => {
    if (c.id === currentId || c.track !== track) return false;
    const cEnd = c.startFrame + c.durationFrames;
    return (newStart < cEnd && end > c.startFrame);
  });
}

// --- Reducer ---

function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case "SET_PLAYHEAD":
      return { ...state, playheadFrame: Math.max(0, Math.min(TOTAL_TIMELINE_FRAMES, action.frame)) };
    case "SET_SCROLL":
      return { ...state, scrollOffsetPx: Math.max(0, action.offset) };
    case "SET_ZOOM": {
      const nextZoom = Math.max(0.25, Math.min(12, action.level));
      return { ...state, zoomLevel: nextZoom };
    }
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "SET_PLAYING":
      return { ...state, isPlaying: action.isPlaying };
    case "RESTART":
      return { ...state, playheadFrame: 0, isPlaying: false };
    case "SELECT_CLIP":
      return { ...state, selectedClipId: action.id };
    case "UPDATE_CLIP":
      return {
        ...state,
        clips: state.clips.map(c =>
          c.id === action.id ? { ...c, ...action.updates } : c
        )
      };
    case "ADD_CLIP":
      if (state.clips.some(c => c.id === action.clip.id)) return state;
      return { ...state, clips: [...state.clips, action.clip] };
    case "REMOVE_CLIP":
      return {
        ...state,
        clips: state.clips.filter(c => c.id !== action.id),
        selectedClipId: state.selectedClipId === action.id ? null : state.selectedClipId
      };
    case "START_DRAG_CLIP":
      return { ...state, draggingClipId: action.id, selectedClipId: action.id };
    case "END_DRAG_CLIP":
      return { ...state, draggingClipId: null };
    case "START_DRAG_MEDIA":
      return { ...state, draggingMediaId: action.id };
    case "END_DRAG_MEDIA":
      return { ...state, draggingMediaId: null };
    case "SET_VIEW_WIDTH":
      return { ...state, viewWidth: action.width };
    default:
      return state;
  }
}

// --- Main Component ---

export default function VideoEditingTimelineSection() {
  const { getSlot } = useMediaContext();

  // Ref Inventory
  const playheadFrameRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const pixelsPerFrameRef = useRef(BASE_PX_PER_FRAME);
  const isDraggingPlayheadRef = useRef(false);
  const playheadElRef = useRef<HTMLDivElement>(null);
  const playheadRulerMarkerRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const timecodeElRef = useRef<HTMLDivElement>(null);
  const preloadMapRef = useRef<Map<string, string>>(new Map());
  const timelineTrackAreaRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const lastVideoSrcRef = useRef<string>("");
  const lastClipIdRef = useRef<string | null>(null);
  const [selectedMediaLabel, setSelectedMediaLabel] = useState<string | null>(null);

  const mediaItems = useMemo(() => {
    return [
      { label: "C2210.MP4", id: "C2210", slotId: "C2210", color: "#7C3AED" },
      { label: "C2211.MP4", id: "C2211", slotId: "C2211", color: "#EC4899" },
      { label: "C2212.MP4", id: "C2212", slotId: "C2212", color: "#F97316" },
      { label: "C2213.MP4", id: "C2213", slotId: "C2213", color: "#22C55E" },
      { label: "C2214.MP4", id: "C2214", slotId: "C2214", color: "#60A5FA" },
      { label: "C2215.MP4", id: "C2215", slotId: "C2215", color: "#A855F7" },
      { label: "C2216.MP4", id: "C2216", slotId: "C2216", color: "#14B8A6" },
      { label: "C2217.MP4", id: "C2217", slotId: "C2217", color: "#F43F5E" },
      { label: "C2218.MP4", id: "C2218", slotId: "C2218", color: "#8B5CF6" },
      { label: "C2219.MP4", id: "C2219", slotId: "C2219", color: "#FB923C" },
    ].map(it => {
      const slot = getSlot(it.slotId);
      const src = (slot?.uploadedFile && slot.useOnSite)
        ? slot.uploadedFile.url
        : (slot?.type === 'video' ? slot.fallbackSrc || `https://assets.mixkit.co/videos/preview/mixkit-taking-photos-from-a-camera-34644-large.mp4` : `https://picsum.photos/seed/${it.id}/800/450`);
      return { ...it, src, type: slot?.type || (it.label.endsWith('.MP4') ? 'video' : 'image') };
    });
  }, [getSlot]);

  // Fix 1: Clips start at frame 0 and back-to-back
  const defaultClips: Clip[] = useMemo(() => [
    // V1 Track
    { id: 'v1-1', track: 'V1', startFrame: 0, durationFrames: 120, color: '#7C3AED', label: 'C2210.MP4', slotId: 'C2210' },
    { id: 'v1-2', track: 'V1', startFrame: 120, durationFrames: 96, color: '#F97316', label: 'C2212.MP4', slotId: 'C2212' },
    { id: 'v1-3', track: 'V1', startFrame: 216, durationFrames: 144, color: '#60A5FA', label: 'C2214.MP4', slotId: 'C2214' },

    // V2 Track
    { id: 'v2-1', track: 'V2', startFrame: 0, durationFrames: 80, color: '#EC4899', label: 'C2211.MP4', slotId: 'C2211' },
    { id: 'v2-2', track: 'V2', startFrame: 80, durationFrames: 120, color: '#22C55E', label: 'C2213.MP4', slotId: 'C2213' },

    // A1 Track
    { id: 'a1-1', track: 'A1', startFrame: 0, durationFrames: 240, color: '#334155', label: 'MUSIC_MIX_01.WAV', slotId: '' },

    // A2 Track
    { id: 'a2-1', track: 'A2', startFrame: 0, durationFrames: 180, color: '#1E293B', label: 'VOICEOVER.WAV', slotId: '' },
  ], []);

  const initialState: TimelineState = {
    playheadFrame: 0,
    scrollOffsetPx: 0,
    zoomLevel: 1.5,
    isPlaying: false,
    selectedClipId: null,
    clips: defaultClips,
    draggingClipId: null,
    draggingMediaId: null,
    viewWidth: 0,
  };

  const [state, dispatch] = useReducer(timelineReducer, initialState);

  const pxPerFrame = BASE_PX_PER_FRAME * state.zoomLevel;

  // Sync refs with state changes
  useEffect(() => {
    playheadFrameRef.current = state.playheadFrame;
    scrollOffsetRef.current = state.scrollOffsetPx;
    pixelsPerFrameRef.current = BASE_PX_PER_FRAME * state.zoomLevel;

    if (playheadElRef.current) {
      const px = playheadFrameRef.current * pixelsPerFrameRef.current;
      playheadElRef.current.style.transform = `translateX(${px}px)`;
    }
    if (playheadRulerMarkerRef.current) {
      const px = playheadFrameRef.current * pixelsPerFrameRef.current;
      playheadRulerMarkerRef.current.style.transform = `translateX(${px}px)`;
    }
  }, [state.playheadFrame, state.scrollOffsetPx, state.zoomLevel]);

  // Bug Fix: Preload images (and store video URLs)
  useEffect(() => {
    const map = new Map<string, string>();
    mediaItems.forEach(item => {
      if (item.type === 'image') {
        const img = new Image();
        img.src = item.src;
        img.onload = () => map.set(item.label, img.src);
      }
      map.set(item.label, item.src);
    });
    preloadMapRef.current = map;

    // Initialize preview
    if (previewImgRef.current) {
      const firstClip = defaultClips.find(c => c.track === 'V2' || c.track === 'V1');
      const item = mediaItems.find(it => it.label === firstClip?.label);
      if (item?.type === 'video' && previewVideoRef.current) {
        previewVideoRef.current.src = item.src;
        previewVideoRef.current.style.display = 'block';
        previewImgRef.current.style.display = 'none';
      } else {
        previewImgRef.current.src = firstClip ? (map.get(firstClip.label) || firstClip.label.includes('C22') ? `https://picsum.photos/seed/${firstClip.slotId}/800/450` : BLACK_FRAME) : BLACK_FRAME;
        previewImgRef.current.style.display = 'block';
        if (previewVideoRef.current) previewVideoRef.current.style.display = 'none';
      }
    }
  }, [mediaItems, defaultClips]);

  // Fix 1: scroll to 0 on mount
  useLayoutEffect(() => {
    dispatch({ type: "SET_SCROLL", offset: 0 });
    if (playheadElRef.current) playheadElRef.current.style.transform = 'translateX(0px)';
    if (playheadRulerMarkerRef.current) playheadRulerMarkerRef.current.style.transform = 'translateX(0px)';
  }, []);

  const getClipAtFrame = (frame: number) => {
    const active = state.clips
      .filter(c => frame >= c.startFrame && frame < c.startFrame + c.durationFrames)
      .sort((a, b) => {
        const p: Record<string, number> = { V2: 10, V1: 9, A1: 1, A2: 1 };
        return p[b.track] - p[a.track];
      })[0];
    return active || null;
  };

  const syncDOMUpdates = (newFrame: number, manual = false) => {
    const px = newFrame * pixelsPerFrameRef.current;
    if (playheadElRef.current) {
      playheadElRef.current.style.transform = `translateX(${px}px)`;
    }
    if (playheadRulerMarkerRef.current) {
      playheadRulerMarkerRef.current.style.transform = `translateX(${px}px)`;
    }
    if (timecodeElRef.current) {
      timecodeElRef.current.textContent = formatTimecode(newFrame);
    }

    const clip = getClipAtFrame(newFrame);
    const img = previewImgRef.current;
    const video = previewVideoRef.current;

    if (!clip) {
      if (img) {
        img.src = BLACK_FRAME;
        img.style.display = 'block';
      }
      if (video) {
        video.pause();
        video.style.display = 'none';
      }
      lastClipIdRef.current = null;
      return;
    }

    const item = mediaItems.find(it => it.label === clip.label);
    const isVideo = item?.type === 'video';
    const clipChanged = lastClipIdRef.current !== clip.id;
    lastClipIdRef.current = clip.id;

    if (isVideo && video) {
      if (img) img.style.display = 'none';
      if (video.style.display !== 'block') video.style.display = 'block';

      const targetTime = Math.max(0, (newFrame - clip.startFrame) / FPS);

      // CRITICAL: Only call .load() if the source REALLY changed
      const normalizedSrc = item.src || "";
      if (lastVideoSrcRef.current !== normalizedSrc) {
        lastVideoSrcRef.current = normalizedSrc;
        video.src = normalizedSrc;
        video.load();
        video.currentTime = targetTime;
      } else if (clipChanged) {
        // If it's the same source but a NEW clip on the timeline, reset time
        video.currentTime = targetTime;
      }

      if (state.isPlaying) {
        if (video.paused && video.readyState >= 2) {
          video.play().catch(() => { });
        }

        // Sync drift check: Only seek if we are more than 150ms off
        const drift = Math.abs(video.currentTime - targetTime);
        if (drift > 0.15) {
          video.currentTime = targetTime;
        }
      } else {
        if (!video.paused) video.pause();
        // Precise seeking when paused or scrubbing
        if (manual || Math.abs(video.currentTime - targetTime) > 0.04) {
          video.currentTime = targetTime;
        }
      }
    } else if (img) {
      if (video) {
        video.pause();
        video.style.display = 'none';
        lastVideoSrcRef.current = ""; // Reset tracking so it re-loads when switching back to video
      }
      if (img.style.display !== 'block') img.style.display = 'block';
      const finalSrc = preloadMapRef.current.get(clip.label) ?? item?.src ?? BLACK_FRAME;
      if (img.src !== finalSrc) {
        img.src = finalSrc;
      }
    }
  };

  const calculateFrame = (clientX: number) => {
    if (!timelineTrackAreaRef.current) return 0;
    const rect = timelineTrackAreaRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left + scrollOffsetRef.current;
    return Math.max(0, Math.min(TOTAL_TIMELINE_FRAMES, Math.round(relativeX / pixelsPerFrameRef.current)));
  };

  useEffect(() => {
    if (!state.isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
      return;
    }

    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = time - lastTimeRef.current;
      const frameDuration = 1000 / FPS;

      if (delta >= frameDuration) {
        const framesToAdvance = Math.floor(delta / frameDuration);
        const newFrame = playheadFrameRef.current + framesToAdvance;

        const projectEnd = state.clips.length > 0
          ? Math.max(...state.clips.map(c => c.startFrame + c.durationFrames))
          : 0;

        if (newFrame >= projectEnd && projectEnd > 0) {
          playheadFrameRef.current = projectEnd;
          syncDOMUpdates(projectEnd);
          dispatch({ type: "SET_PLAYING", isPlaying: false });
          dispatch({ type: "SET_PLAYHEAD", frame: projectEnd });
          return;
        }

        playheadFrameRef.current = newFrame;
        syncDOMUpdates(newFrame);
        lastTimeRef.current = time - (delta % frameDuration);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state.isPlaying, state.clips]);

  const onTimelinePointerDown = (e: React.PointerEvent) => {
    isDraggingPlayheadRef.current = true;
    const newFrame = calculateFrame(e.clientX);
    playheadFrameRef.current = newFrame;
    syncDOMUpdates(newFrame, true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingPlayheadRef.current) return;
      const moveFrame = calculateFrame(moveEvent.clientX);
      playheadFrameRef.current = moveFrame;
      syncDOMUpdates(moveFrame, true);
    };

    const onPointerUp = () => {
      isDraggingPlayheadRef.current = false;
      dispatch({ type: "SET_PLAYHEAD", frame: playheadFrameRef.current });
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <section className="w-full bg-[#08090b] text-white">
      {/* Invisible Scrollbar CSS for Fix 2 */}
      <style>{`
        .media-bin-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* 1. BIG SCREEN PREVIEW WINDOW */}
      <div className="relative h-[320px] w-full overflow-hidden bg-[#050608] sm:h-[420px] lg:h-[580px] border-b border-white/5 group/preview">
        {/* Background Ambient Glow */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none" />

        <div className="relative h-full w-full flex items-center justify-center">
          <img
            ref={previewImgRef}
            src={BLACK_FRAME}
            alt="Preview"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="sync"
            draggable={false}
          />
          <video
            ref={previewVideoRef}
            className="h-full w-full object-cover hidden"
            muted
            playsInline
            loop={false}
          />
        </div>

        {/* Overlay Controls */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <span className={`h-2.5 w-2.5 rounded-full ${state.isPlaying ? 'bg-red-500 animate-pulse' : 'bg-teal-500'} shadow-[0_0_10px_currentColor]`} />
              <div
                ref={timecodeElRef}
                className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-white drop-shadow-2xl leading-none"
              >
                {formatTimecode(state.playheadFrame)}
              </div>
            </div>
            <div className="hidden sm:block text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">
              Preview Mode • 4K Native
            </div>
          </div>

          <div className="flex justify-center items-center gap-8 pointer-events-auto">
            <button
              onClick={() => {
                dispatch({ type: "RESTART" });
                syncDOMUpdates(0, true);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md border border-white/5"
            >
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" /></svg>
            </button>

            <button
              onClick={() => dispatch({ type: "TOGGLE_PLAY" })}
              className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl ${state.isPlaying ? 'bg-white text-black' : 'bg-teal-500 text-black'
                }`}
            >
              {state.isPlaying ? (
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              ) : (
                <svg width="36" height="36" className="translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>

            <div className="w-12" /> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="flex h-[380px] w-full flex-col lg:flex-row">
        {/* Fix 2: MEDIA BIN with Invisible Scrollbar */}
        <div
          className="w-full lg:w-[260px] bg-[#0C0F14] border-r border-white/5 flex flex-col h-full"
          onPointerDown={e => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-white/5">
            <div className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">Master Assets</div>
          </div>
          <div
            className="media-bin-scroll flex-1 p-4 space-y-3"
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
              pointerEvents: 'auto'
            }}
          >
            {mediaItems.map((item) => {
              let downX = 0;
              let downY = 0;
              const isSelected = selectedMediaLabel === item.label;

              const handleAssetClick = () => {
                setSelectedMediaLabel(item.label);
                if (item.type === 'video' && previewVideoRef.current) {
                  if (previewImgRef.current) previewImgRef.current.style.display = 'none';
                  previewVideoRef.current.style.display = 'block';
                  previewVideoRef.current.src = item.src;
                  previewVideoRef.current.currentTime = 0;
                } else if (previewImgRef.current) {
                  if (previewVideoRef.current) previewVideoRef.current.style.display = 'none';
                  previewImgRef.current.style.display = 'block';
                  previewImgRef.current.src = preloadMapRef.current.get(item.label) ?? item.src ?? BLACK_FRAME;
                }
                playheadFrameRef.current = 0;
                syncDOMUpdates(0, true);
                dispatch({ type: "SET_PLAYHEAD", frame: 0 });
              };

              return (
                <div
                  key={item.id}
                  draggable
                  onPointerDown={(e) => { downX = e.clientX; downY = e.clientY; }}
                  onPointerUp={(e) => {
                    if (Math.abs(e.clientX - downX) < 6 && Math.abs(e.clientY - downY) < 6) {
                      handleAssetClick();
                    }
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("mediaId", item.id);
                    dispatch({ type: "START_DRAG_MEDIA", id: item.id });
                  }}
                  onDragEnd={() => dispatch({ type: "END_DRAG_MEDIA" })}
                  className={`group relative h-20 w-full cursor-grab overflow-hidden rounded-lg border transition-all ${isSelected ? "border-teal-500/90 bg-teal-500/10 shadow-[0_0_15px_rgba(45,212,191,0.2)]" : "border-white/5 bg-[#14181f] hover:border-teal-500/50"
                    }`}
                >
                  {item.type === 'video' ? (
                    <video src={item.src} className="h-full w-full object-cover opacity-30 group-hover:opacity-60 transition-opacity" muted />
                  ) : (
                    <img src={item.src} className="h-full w-full object-cover opacity-30 group-hover:opacity-60 transition-opacity" alt="" />
                  )}

                  <div className="absolute top-2 right-2">
                    {item.type === 'video' && <div className="p-1 bg-black/40 backdrop-blur-md rounded-md"><svg width="10" height="10" viewBox="0 0 24 24" fill="white" opacity="0.6"><path d="M8 5v14l11-7z" /></svg></div>}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-1 z-10">
                    <div className="truncate text-[9px] font-bold text-white/40">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIMELINE AREA */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#0a0c10]">
          <div className="flex h-14 items-center justify-between px-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <button onClick={() => dispatch({ type: "SET_ZOOM", level: state.zoomLevel / 1.5 })} className="text-white/20 hover:text-white transition-all"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg></button>
              <div className="font-mono text-[10px] font-black text-white/10 uppercase">Scale {Math.round(state.zoomLevel * 100)}%</div>
              <button onClick={() => dispatch({ type: "SET_ZOOM", level: state.zoomLevel * 1.5 })} className="text-white/20 hover:text-white transition-all"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg></button>
            </div>
            <div className="text-[10px] font-black italic text-white/5 tracking-[0.5em] uppercase">Timeline Engine v3.2</div>
          </div>

          <div className="relative flex-1">
            {/* Fix 3: Ruler Design */}
            <div
              className="relative border-t border-white/[0.06] border-b border-white/[0.12] bg-[#0C0E12] cursor-pointer"
              style={{ height: '28px' }}
              onPointerDown={onTimelinePointerDown}
            >
              <div className="absolute left-1 top-2.5 z-20 font-mono text-[9px] font-black text-[#445566]">TC</div>
              <div className="absolute inset-0 overflow-hidden" style={{ transform: `translateX(${-state.scrollOffsetPx}px)` }}>
                <div className="relative h-full w-full">
                  {Array.from({ length: 200 }).map((_, i) => {
                    const frame = i * 5;
                    const isMajor = frame % FPS === 0;
                    const isMinor = frame % 10 === 0 && !isMajor;
                    const isSub = !isMajor && !isMinor;

                    const x = frame * pxPerFrame;

                    // Adjust density by zoom
                    if (state.zoomLevel < 0.75 && !isMajor) return null;
                    if (state.zoomLevel >= 0.75 && state.zoomLevel <= 2 && isSub) return null;

                    return (
                      <div key={frame} className="absolute bottom-0 h-full" style={{ left: x }}>
                        {isMajor && (
                          <>
                            <div className="absolute bottom-0 h-[12px] w-px bg-white/50" />
                            <div className="absolute bottom-[14px] -translate-x-1/2 font-mono text-[9px] tracking-widest text-[#7A8FA6]">
                              {formatRulerTimecode(frame)}
                            </div>
                          </>
                        )}
                        {isMinor && <div className="absolute bottom-0 h-[7px] w-px bg-white/20" />}
                        {isSub && <div className="absolute bottom-0 h-[4px] w-px bg-white/10" />}
                      </div>
                    );
                  })}

                  {/* Playhead Marker Marker (Triangle) */}
                  <div
                    ref={playheadRulerMarkerRef}
                    className="absolute bottom-0 z-50 pointer-events-none"
                    style={{ transform: `translateX(${state.playheadFrame * pxPerFrame}px)` }}
                  >
                    <div className="absolute -left-[4px] bottom-0 h-0 w-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#2DD4BF]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-[calc(100%-28px)]">
              {/* TRACK LABELS */}
              <div className="z-40 w-16 bg-[#0D1117] border-r border-white/5 flex-none shadow-[20px_0_30px_rgba(0,0,0,0.5)]">
                {["V2", "V1", "A1", "A2"].map((t) => <div key={t} className="h-[44px] flex items-center px-5 font-mono text-[10px] font-black text-white/10">{t}</div>)}
              </div>

              {/* TRACK CANVAS */}
              <div
                ref={timelineTrackAreaRef}
                className="relative flex-1 overflow-hidden"
                onPointerDown={onTimelinePointerDown}
                onWheel={(e) => {
                  if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    dispatch({ type: "SET_SCROLL", offset: state.scrollOffsetPx + e.deltaX + (e.shiftKey ? e.deltaY : 0) });
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const mediaId = e.dataTransfer.getData("mediaId");
                  const item = mediaItems.find(m => m.id === mediaId);
                  if (item) {
                    const frame = calculateFrame(e.clientX);
                    const track = (["V2", "V1", "A1", "A2"] as const)[Math.min(3, Math.floor((e.clientY - timelineTrackAreaRef.current!.getBoundingClientRect().top) / 44))];
                    if (!checkCollision(state.clips, "", track, frame, DEFAULT_CLIP_DURATION)) {
                      dispatch({ type: "ADD_CLIP", clip: { id: `clip-${Date.now()}`, track, startFrame: frame, durationFrames: DEFAULT_CLIP_DURATION, color: item.color, label: item.label, slotId: item.slotId } });
                    }
                  }
                }}
              >
                <div className="absolute inset-0" style={{ transform: `translateX(${-state.scrollOffsetPx}px)` }}>
                  <div className="absolute inset-0 pointer-events-none">
                    {["V2", "V1", "A1", "A2"].map((_, i) => <div key={i} className="h-[44px] w-full border-b border-white/[0.02]" />)}
                  </div>

                  {state.clips.map((clip) => (
                    <div
                      key={clip.id}
                      style={{ position: 'absolute', top: ["V2", "V1", "A1", "A2"].indexOf(clip.track) * 44, left: clip.startFrame * pxPerFrame, width: clip.durationFrames * pxPerFrame, height: 44, padding: "5px 0" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "SELECT_CLIP", id: clip.id });
                      }}
                    >
                      <div className={`h-[34px] rounded-md border flex items-center px-3 transition-all cursor-pointer ${state.selectedClipId === clip.id ? "border-white ring-4 ring-white/10 shadow-2xl" : "border-white/5 active:scale-[0.98]"}`} style={{ backgroundColor: clip.color }}>
                        <span className="truncate text-[10px] font-black text-white/90 uppercase tracking-tighter">{clip.label}</span>
                      </div>
                    </div>
                  ))}

                  {/* MAIN PLAYHEAD LINE */}
                  <div
                    ref={playheadElRef}
                    className="absolute top-0 z-50 h-full w-px bg-teal-400 pointer-events-none"
                    style={{ transform: `translateX(${state.playheadFrame * pxPerFrame}px)` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-full w-[3px] -left-px bg-teal-400/20 blur-[2px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
