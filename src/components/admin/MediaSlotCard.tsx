"use client";

import React, { useState } from "react";
import { MediaSlot } from "@/lib/mediaSlots";
import { useMediaContext } from "@/context/MediaContext";
import UploadZone from "./UploadZone";

interface MediaSlotCardProps {
    slot: MediaSlot;
}

export default function MediaSlotCard({ slot }: MediaSlotCardProps) {
    const { uploadFile, deleteFile, updateSlot } = useMediaContext();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        try {
            await uploadFile(slot.id, file);
        } catch (e) {
            console.error(e);
            alert("Failed to upload file.");
        } finally {
            setIsUploading(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    return (
        <div className="bg-[#161616] border border-white/[0.05] rounded-2xl p-4 space-y-4 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                        {slot.frame}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-white/90">
                            {slot.id}
                        </span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm ${slot.type === "video" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"} uppercase`}>
                            {slot.type}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">LIVE</span>
                        <div
                            className={`relative w-8 h-4 rounded-full transition-colors ${slot.useOnSite ? "bg-white" : "bg-white/10"}`}
                            onClick={() => updateSlot(slot.id, { useOnSite: !slot.useOnSite })}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-black transition-transform ${slot.useOnSite ? "translate-x-4" : ""}`} />
                        </div>
                    </label>
                </div>
            </div>

            <div className="flex gap-4">
                {/* Preview */}
                <div className="w-24 h-18 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-white/5 relative group">
                    {slot.type === "video" ? (
                        <video
                            src={slot.uploadedFile?.url || slot.fallbackSrc}
                            className="w-full h-full object-cover"
                            muted
                            onMouseOver={(e) => e.currentTarget.play()}
                            onMouseOut={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                            }}
                        />
                    ) : (
                        <img
                            src={slot.uploadedFile?.url || slot.fallbackSrc}
                            alt={slot.id}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {!slot.uploadedFile && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-bold text-white/60">DEFAULT</span>
                        </div>
                    )}
                </div>

                {/* Action / Meta */}
                <div className="flex-1 min-w-0">
                    {!slot.uploadedFile ? (
                        <UploadZone
                            accept={slot.type === "image" ? "image/*" : "video/*"}
                            onUpload={handleUpload}
                            isProcessing={isUploading}
                        />
                    ) : (
                        <div className="h-full flex flex-col justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] text-white/80 font-medium truncate">
                                    {slot.uploadedFile.name}
                                </p>
                                <p className="text-[9px] text-white/30">
                                    {formatSize(slot.uploadedFile.size)} • {new Date(slot.uploadedFile.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => deleteFile(slot.id)}
                                    className="px-3 py-1.5 border border-white/10 rounded-md text-[9px] uppercase tracking-widest font-bold hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2"
                                >
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {slot.categoryLabel !== undefined && (
                <div className="pt-2 border-t border-white/[0.03]">
                    <label className="block text-[8px] uppercase tracking-widest text-white/30 mb-1">Category Label</label>
                    <input
                        type="text"
                        value={slot.categoryLabel}
                        onChange={(e) => updateSlot(slot.id, { categoryLabel: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-[10px] text-white/80 focus:outline-none focus:border-white/30"
                    />
                </div>
            )}
        </div>
    );
}
