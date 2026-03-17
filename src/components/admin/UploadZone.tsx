"use client";

import React, { useState, useRef } from "react";

interface UploadZoneProps {
    onUpload: (file: File) => void;
    accept: string;
    isProcessing?: boolean;
}

export default function UploadZone({ onUpload, accept, isProcessing }: UploadZoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) validateAndUpload(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) validateAndUpload(file);
    };

    const validateAndUpload = (file: File) => {
        // Basic validation
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (accept.includes("video") && !isVideo) {
            alert("Please upload a video file.");
            return;
        }
        if (accept.includes("image") && !isImage) {
            alert("Please upload an image file.");
            return;
        }
        const maxSize = isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024; // 100MB for video, 20MB for images
        if (file.size > maxSize) {
            alert(`File is too large. Max size: ${isVideo ? "100MB" : "20MB"}`);
            return;
        }

        onUpload(file);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
        relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer text-center
        ${isDragActive ? "border-white bg-white/5" : "border-white/10 hover:border-white/30 hover:bg-white/[0.02]"}
        ${isProcessing ? "opacity-50 pointer-events-none" : ""}
      `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept={accept}
                className="hidden"
            />

            <div className="space-y-2">
                <div className="flex justify-center">
                    <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <p className="text-xs font-medium text-white/60">
                    {isDragActive ? "Drop here" : "Click or drag & drop"}
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                    MAX 100MB (VIDEO) / 20MB (IMAGE)
                </p>
            </div>

            {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
