"use client";

import { useMediaContext } from "@/context/MediaContext";

/**
 * useMedia hook to get the current source for a media slot.
 * If an uploaded file exists and "use on site" is toggled on, it returns the uploaded URL.
 * Otherwise, it returns the fallback URL.
 */
export function useMedia(slotId: string, fallback: string): string {
    const { getSlot } = useMediaContext();
    const slot = getSlot(slotId);

    if (slot?.uploadedFile && slot.useOnSite) {
        return slot.uploadedFile.url;
    }

    return fallback;
}
