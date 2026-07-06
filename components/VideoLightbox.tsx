"use client";

import { useEffect } from "react";
import type { VideoCaso } from "@/content/videos";

export default function VideoLightbox({
  video,
  onClose,
}: {
  video: VideoCaso;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.titulo}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-2xl text-white hover:text-primary"
          aria-label="Cerrar video"
        >
          ✕
        </button>

        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            src={`${video.embedUrl}${video.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
            title={video.titulo}
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-center text-sm text-white/90">{video.titulo}</p>
      </div>
    </div>
  );
}
