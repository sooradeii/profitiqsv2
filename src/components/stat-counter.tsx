"use client";

import { useEffect, useRef, useState } from "react";

export function StatCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1100,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  // Starts at the real final value, not 0 -- this is real pricing/stat
  // content (e.g. "$97"), and must never render as "$0" or "0" for a
  // crawler, a pre-hydration paint, a no-JS visitor, or a viewer who
  // scrolls past before the animation would trigger. The count-up is a
  // bonus effect for whoever actually watches it happen, applied by
  // resetting to 0 right as the animation starts -- never as the default.
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveDuration = reduceMotion ? 0 : duration;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setDisplay(0);
          const start = performance.now();
          const tick = (now: number) => {
            const progress = effectiveDuration === 0 ? 1 : Math.min((now - start) / effectiveDuration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
