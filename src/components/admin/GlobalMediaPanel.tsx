"use client";

import React, { useState } from "react";
import { useMediaContext } from "@/context/MediaContext";

interface GlobalMediaPanelProps {
    onClose: () => void;
}

export default function GlobalMediaPanel({ onClose }: GlobalMediaPanelProps) {
    const { allMedia, deleteFile } = useMediaContext();
    const [filterSection, setFilterSection] = useState("All");
    const [filterType, setFilterType] = useState("All");

    const sections = ["All", ...Array.from(new Set(allMedia.map(m => m.section)))];
    const types = ["All", "image", "video"];

    const filteredMedia = allMedia.filter(m => {
        const sectionMatch = filterSection === "All" || m.section === filterSection;
        const typeMatch = filterType === "All" || m.type === filterType;
        return sectionMatch && typeMatch;
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Media Library</h2>
                        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">
                            {allMedia.length} Total Files Uploaded
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Filters */}
                <div className="px-8 py-4 bg-white/[0.02] border-b border-white/[0.05] flex flex-wrap gap-6 items-center">
                    <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block ml-1">Section</span>
                        <div className="flex gap-2">
                            {sections.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterSection(s)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${filterSection === s ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                                >
                                    {s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block ml-1">Type</span>
                        <div className="flex gap-2">
                            {types.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${filterType === t ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                                >
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {filteredMedia.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white/60 font-medium">No media found</p>
                                <p className="text-white/20 text-xs mt-1 uppercase tracking-widest">Upload some files in the sections first</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredMedia.map((m) => (
                                <div key={m.id} className="group aspect-square relative rounded-2xl overflow-hidden border border-white/5 bg-black">
                                    {m.type === "video" ? (
                                        <video src={m.url} className="w-full h-full object-cover" muted />
                                    ) : (
                                        <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                                    )}

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-4 justify-between">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => deleteFile(m.id)}
                                                className="p-2 bg-red-500 rounded-full hover:scale-110 transition-transform"
                                            >
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-white truncate">{m.name}</p>
                                            <p className="text-[8px] text-white/60 uppercase tracking-widest mt-1">{m.section}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
