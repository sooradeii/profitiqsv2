"use client";

import { useRef, useState } from "react";

/**
 * Autoplays muted on load (browser policy requires muted for autoplay). The
 * native `poster` attribute only shows before first play -- this adds a
 * click-to-resume poster overlay that reappears on every pause too, not
 * just the first frame.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)]">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="auto"
        poster={poster}
        className="aspect-video w-full"
        onPause={() => setPaused(true)}
        onPlay={() => setPaused(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      {paused && (
        <button
          type="button"
          aria-label="Resume video"
          onClick={() => videoRef.current?.play()}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
    </div>
  );
}
