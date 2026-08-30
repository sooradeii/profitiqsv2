/** Continuous-scroll ticker of real product data -- duplicated once for a
 * seamless loop (see .marquee-track in globals.css). Pauses on hover. */
export function Ticker({ items }: { items: { label: string; value: string }[] }) {
  const track = [...items, ...items];
  return (
    <div className="ticker-surface overflow-hidden border-y border-white/10 py-2.5">
      <div className="marquee-track gap-8">
        {track.map((item, i) => (
          <span key={`${item.label}-${i}`} className="flex shrink-0 items-center gap-2 whitespace-nowrap px-2 font-mono text-[11px] text-white/40">
            {item.label}
            <span className="font-semibold text-white/70">{item.value}</span>
            <span className="text-white/20" aria-hidden>&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
