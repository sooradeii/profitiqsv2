/** Continuous-scroll ecosystem ticker -- a premium information strip
 * (business-category / system / tier counts), not a price list. Repeated
 * enough times to loop seamlessly even with a short item set (see
 * .marquee-track in globals.css). Pauses on hover. */
export function Ticker({ items }: { items: string[] }) {
  const track = [...items, ...items, ...items, ...items];
  return (
    <div className="ticker-surface overflow-hidden border-y border-white/10 py-2.5">
      <div className="marquee-track gap-3">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-3 whitespace-nowrap px-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{item}</span>
            <span className="text-accent/50" aria-hidden>&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
