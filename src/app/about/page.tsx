import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Why ProfitIQS builds financial intelligence systems for business owners.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">About ProfitIQS</h1>
        <div className="mt-8 space-y-5 text-fg-soft">
          <p>
            ProfitIQS exists to turn messy business numbers into practical
            operating visibility. Most business owners can see revenue.
            Fewer can quickly see what&apos;s actually profitable, where
            costs are growing, and what deserves attention.
          </p>
          <p>
            Instead of one generic spreadsheet template, ProfitIQS builds a
            structured system for each of 21 business categories — because
            what a repair order tracks isn&apos;t what a rental unit
            tracks, isn&apos;t what a billable hour tracks. Each system is
            built around how that specific business actually operates,
            with real dashboards, KPI tracking, and a Business Health Score
            where the tier supports it.
          </p>
          <p>
            Every system is a real Excel workbook — no login, no monthly
            bill, no dashboard that logs you out. You own the file outright
            for as long as your business runs.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
