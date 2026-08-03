"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * In-browser PDF viewer used to serve premium content WITHOUT exposing a raw
 * downloadable file link. The PDF is streamed (watermarked, inline) from the
 * signed download endpoint into an <iframe>.
 *
 * Deterrents (note: client-side protections are best-effort — the real
 * protection is the per-user watermark + short-lived signed URL + audit log):
 *  - right-click / context menu disabled
 *  - text selection + drag disabled
 *  - Ctrl/Cmd+P (print), Ctrl+S (save) key combos blocked
 *  - a transparent overlay sits above the iframe to discourage interactions
 */
export default function SecurePdfViewer({
    url,
    title,
    onClose,
}: {
    url: string;
    title?: string;
    onClose: () => void;
}) {
    useEffect(() => {
        const blockContextMenu = (e: MouseEvent) => e.preventDefault();

        const blockKeys = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const ctrlOrMeta = e.ctrlKey || e.metaKey;

            // Block print / save / select-all while the viewer is open.
            if (ctrlOrMeta && ["p", "s", "a"].includes(key)) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (key === "escape") {
                onClose();
            }
        };

        document.addEventListener("contextmenu", blockContextMenu);
        document.addEventListener("keydown", blockKeys, true);

        // Lock body scroll while the modal is open.
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("contextmenu", blockContextMenu);
            document.removeEventListener("keydown", blockKeys, true);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-sm">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white border-b border-white/10">
                <span className="text-sm font-bold truncate pr-4">{title || "Secure Document"}</span>
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    <X className="w-4 h-4" />
                    Close
                </button>
            </div>

            {/* Viewer surface */}
            <div
                className="relative flex-1 select-none"
                onContextMenu={(e) => e.preventDefault()}
                style={{ userSelect: "none" }}
            >
                {/*
          #toolbar=0 hides the native PDF toolbar (incl. download/print buttons)
          in most Chromium-based viewers. Not guaranteed across all browsers.
        */}
                <iframe
                    src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
                    title={title || "Secure Document"}
                    className="absolute inset-0 h-full w-full border-0 bg-white"
                />

                {/* Transparent guard overlay to discourage drag/save interactions.
            pointer-events-none lets scrolling pass through to the iframe. */}
                <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden="true"
                    style={{ userSelect: "none" }}
                />
            </div>

            <p className="px-5 py-2 text-center text-[11px] text-slate-400 bg-slate-900 border-t border-white/10">
                This document is watermarked with your account details and access is
                logged. Redistribution is prohibited.
            </p>
        </div>
    );
}
