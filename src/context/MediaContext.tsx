"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { mediaSlots as initialMediaSlots, MediaSlot } from "@/lib/mediaSlots";
import { supabase } from "@/lib/supabase";

interface MediaContextType {
    slots: MediaSlot[];
    updateSlot: (id: string, updates: Partial<MediaSlot>) => void;
    resetSlot: (id: string) => Promise<void>;
    getSlot: (id: string) => MediaSlot | undefined;
    uploadFile: (id: string, file: File) => Promise<void>;
    deleteFile: (id: string) => Promise<void>;
    allMedia: { id: string; url: string; name: string; section: string; type: string }[];
    isLoading: boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [slots, setSlots] = useState<MediaSlot[]>(initialMediaSlots);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch slots from Supabase on mount
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const { data, error } = await supabase
                    .from('media_slots')
                    .select('*');

                if (error) {
                    // If table doesn't exist yet, we'll use initialMediaSlots
                    console.warn("Supabase table 'media_slots' not found. Using local initial data.", error);
                    setIsLoading(false);
                    return;
                }

                if (data && data.length > 0) {
                    // Map Supabase data back to MediaSlot type
                    const mappedSlots = initialMediaSlots.map(initial => {
                        const dbSlot = data.find(d => d.id === initial.id);
                        if (dbSlot) {
                            return {
                                ...initial,
                                useOnSite: dbSlot.use_on_site,
                                uploadedFile: dbSlot.uploaded_file_url ? {
                                    name: dbSlot.uploaded_file_name,
                                    url: dbSlot.uploaded_file_url,
                                    size: dbSlot.uploaded_file_size,
                                    uploadedAt: dbSlot.uploaded_at
                                } : undefined
                            };
                        }
                        return initial;
                    });
                    setSlots(mappedSlots);
                }
            } catch (err) {
                console.error("Error fetching media slots:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlots();
    }, []);

    const updateSlot = useCallback(async (id: string, updates: Partial<MediaSlot>) => {
        // Update local state
        setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

        // Update Supabase
        const dbUpdates: any = {};
        if (updates.useOnSite !== undefined) dbUpdates.use_on_site = updates.useOnSite;

        if (Object.keys(dbUpdates).length > 0) {
            const { error } = await supabase
                .from('media_slots')
                .upsert({ id, ...dbUpdates });

            if (error) console.error("Error updating slot in Supabase:", error);
        }
    }, []);

    const resetSlot = useCallback(async (id: string) => {
        const initial = initialMediaSlots.find(s => s.id === id);
        if (!initial) return;

        setSlots((prev) =>
            prev.map((s) =>
                s.id === id
                    ? { ...s, uploadedFile: undefined, useOnSite: false, currentSrc: s.fallbackSrc }
                    : s
            )
        );

        // Reset in Database (Suppresing Cloudinary deletion for reset for now to keep it simple, 
        // as Cloudinary delete requires public_id which we aren't explicitly tracking yet in a dedicated field,
        // but it's in the URL)
        await supabase.from('media_slots').upsert({
            id,
            use_on_site: false,
            uploaded_file_name: null,
            uploaded_file_url: null,
            uploaded_file_size: null,
            uploaded_at: null
        });
    }, []);

    const getSlot = useCallback((id: string) => {
        return slots.find((s) => s.id === id);
    }, [slots]);

    const uploadFile = async (id: string, file: File) => {
        // 1. Upload to Cloudinary via our API route
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Upload failed");
        }

        const cloudinaryData = await response.json();
        const publicUrl = cloudinaryData.secure_url;

        const uploadedFile = {
            name: file.name,
            url: publicUrl,
            size: file.size,
            uploadedAt: new Date().toISOString(),
        };

        // 2. Update Supabase Database with Cloudinary URL
        const initial = initialMediaSlots.find(s => s.id === id);
        const { error: dbError } = await supabase
            .from('media_slots')
            .upsert({
                id,
                section: initial?.section || 'Unknown',
                frame: initial?.frame || 'Unknown',
                type: initial?.type || 'image',
                uploaded_file_name: uploadedFile.name,
                uploaded_file_url: uploadedFile.url,
                uploaded_file_size: uploadedFile.size,
                uploaded_at: uploadedFile.uploadedAt,
                use_on_site: true // Auto-enable on upload
            });

        if (dbError) {
            console.error("❌ SUPABASE DB ERROR:", dbError.message, dbError);
            if (dbError.code === '42P01') {
                alert("Database Table 'media_slots' missing! Please run the SQL script in setup-supabase.sql in your Supabase Dashboard.");
            }
        }

        // 4. Update Local State
        setSlots((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        uploadedFile,
                        useOnSite: true,
                    }
                    : s
            )
        );
    };

    const deleteFile = async (id: string) => {
        // We focus on clearing the DB record. Cloudinary deletion is manual or via API if needed,
        // but keeping it simple for now to avoid complexity with public_ids.
        await supabase.from('media_slots').upsert({
            id,
            uploaded_file_name: null,
            uploaded_file_url: null,
            uploaded_file_size: null,
            uploaded_at: null,
            use_on_site: false
        });

        setSlots((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        uploadedFile: undefined,
                        useOnSite: false,
                    }
                    : s
            )
        );
    };

    const allMedia = slots
        .filter((s) => s.uploadedFile)
        .map((s) => ({
            id: s.id,
            url: s.uploadedFile!.url,
            name: s.uploadedFile!.name,
            section: s.section,
            type: s.type,
        }));

    return (
        <MediaContext.Provider
            value={{ slots, updateSlot, resetSlot, getSlot, uploadFile, deleteFile, allMedia, isLoading }}
        >
            {children}
        </MediaContext.Provider>
    );
};

export const useMediaContext = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error("useMediaContext must be used within a MediaProvider");
    }
    return context;
};
