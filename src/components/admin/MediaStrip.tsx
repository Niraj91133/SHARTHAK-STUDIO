"use client";

import React from "react";
import { useMediaContext } from "@/context/MediaContext";

interface MediaStripProps {
    section: string;
}

export default function MediaStrip({ section }: MediaStripProps) {
    const { slots, deleteFile } = useMediaContext();

    const sectionMedia = slots.filter(s => s.section === section && s.uploadedFile);

    if (sectionMedia.length === 0) return null;

    return (
        <div className="pt-6 border-t border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                    Section Files ({sectionMedia.length})
                </h5>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {sectionMedia.map((slot) => (
                    <div
                        key={slot.id}
                        className="relative group flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/10"
                    >
                        {slot.type === "video" ? (
                            <video
                                src={slot.uploadedFile?.url}
                                className="w-full h-full object-cover"
                                muted
                            />
                        ) : (
                            <img
                                src={slot.uploadedFile?.url}
                                alt={slot.id}
                                className="w-full h-full object-cover"
                            />
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFile(slot.id);
                                }}
                                className="p-1 bg-red-500 rounded-full hover:scale-110 transition-transform"
                            >
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-sm p-1">
                            <p className="text-[6px] text-white/60 truncate text-center uppercase tracking-tighter">
                                {slot.frame}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
