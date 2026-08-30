/** Continuous-scroll ticker of real product data -- duplicated once for a
 * seamless loop (see .marquee-track in globals.css). Pauses on hover. */
export function Ticker({ items }: { items: { label: string; value: string }[] }) {
  const track = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-ink-soft py-3">
      <div className="marquee-track gap-10">
        {track.map((item, i) => (
          <span key={`${item.label}-${i}`} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap px-2 font-mono text-xs text-white/60">
            {item.label}
            <span className="font-semibold text-white/90">{item.value}</span>
            <span className="text-accent" aria-hidden>&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
