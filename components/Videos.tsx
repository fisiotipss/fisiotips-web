"use client";

import { useState } from "react";
import { videos, type VideoCaso } from "@/content/videos";
import VideoLightbox from "./VideoLightbox";
import Reveal from "./Reveal";

export default function Videos() {
  const [activo, setActivo] = useState<VideoCaso | null>(null);

  return (
    <section id="videos" className="bg-gradient-to-b from-[#6f93aa] to-[#a8c3d1] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-primary underline sm:text-3xl">
            Que te lo expliquen ellos…
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-800">
            (Casos reales seleccionados, hay +100 casos)
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, i) => (
            <Reveal key={i} delay={(i % 4) * 100}>
              <button
                onClick={() => setActivo(video)}
                className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-primary-dark text-left shadow-sm"
              >
                {video.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnail}
                    alt={video.titulo}
                    className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary to-primary-dark" />
                )}

                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-celeste shadow-md transition-transform group-hover:scale-110">
                    ▶
                  </span>
                </span>

                <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-xs font-medium text-white">
                  {video.titulo}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {activo && <VideoLightbox video={activo} onClose={() => setActivo(null)} />}
      </div>
    </section>
  );
}
