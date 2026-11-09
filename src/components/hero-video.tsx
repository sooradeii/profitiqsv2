"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

/**
 * No autoplay -- every browser blocks autoplay-with-sound outright (not just
 * discourages it), so autoplay would mean either no sound or no playback at
 * all. Starts on the poster, plays with full sound from the first click
 * (a real click is a user gesture, so the browser allows audio).
 *
 * Controls are custom, not native: VSL players deliberately drop the
 * draggable seek bar (so viewers can't skip ahead to the offer without
 * watching the pitch) in favor of a non-interactive progress fill, which is
 * what the big VSL hosting tools (Vidalytics, Vturb) converge on.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-card)] bg-ink">
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        poster={poster}
        className="aspect-video w-full"
        onPause={() => setPaused(true)}
        onPlay={() => setPaused(false)}
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src={src} type="video/mp4" />
      </video>

      {paused && (
        <button
          type="button"
          aria-label="Play video"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        >
          <span className="absolute inset-0 bg-ink/20 transition-colors duration-200 group-hover:bg-ink/35" />
          <span className="relative flex size-20 items-center justify-center rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:scale-110 sm:size-24">
            <Play className="ml-1.5 size-9 fill-accent text-accent sm:size-10" />
          </span>
        </button>
      )}

      {!paused && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-ink/85 to-transparent px-4 py-3">
          <button
            type="button"
            aria-label="Pause"
            onClick={togglePlay}
            className="shrink-0 text-white/90 transition-colors hover:text-white"
          >
            <Pause className="size-5 fill-white" />
          </button>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="shrink-0 text-white/90 transition-colors hover:text-white"
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
        </div>
      )}
    </div>
  );
}
