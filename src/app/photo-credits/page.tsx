import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Photo Credits",
  description: "Attribution for photography used on the ProfitIQS website.",
  alternates: { canonical: "/photo-credits" },
};

const UTM = "utm_source=profitiqs&utm_medium=referral";

const CREDITS = [
  { subject: "HVAC", photographer: "Alex Gruber", profile: "https://unsplash.com/@alex_gruber" },
  { subject: "Electrical Contractor", photographer: "colsan ltda", profile: "https://unsplash.com/@plataformacolsan" },
  { subject: "Auto Repair Shop", photographer: "Compagnons", profile: "https://unsplash.com/@sigmund" },
  { subject: "Plumbing Contractor", photographer: "Omar Abozeid", profile: "https://unsplash.com/@omar_abozeid" },
  { subject: "Restaurant", photographer: "Kris Tian", profile: "https://unsplash.com/@kris_tian" },
  { subject: "Trucking Owner-Operator", photographer: "Negley Stockman", profile: "https://unsplash.com/@negley" },
  { subject: "Landscaping", photographer: "Lara John", profile: "https://unsplash.com/@lara_j" },
  { subject: "Construction", photographer: "Ricardio de Penning", profile: "https://unsplash.com/@ricardio" },
  { subject: "Cleaning Service", photographer: "Shawn Rain", profile: "https://unsplash.com/@shawn_rain" },
  { subject: "Ecommerce", photographer: "Steward Masweneng", profile: "https://unsplash.com/@stewardesign" },
];

export default function PhotoCreditsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 lg:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">Photo Credits</h1>
        <p className="mt-4 text-sm text-fg-soft">
          The industry photography on the ProfitIQS homepage comes from{" "}
          <a
            href={`https://unsplash.com/?${UTM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent"
          >
            Unsplash
          </a>
          , used under the Unsplash License. Credit to each photographer below.
        </p>
        <ul className="mt-8 divide-y divide-border">
          {CREDITS.map((c) => (
            <li key={c.subject} className="flex items-center justify-between gap-4 py-3.5 text-sm">
              <span className="text-fg">{c.subject}</span>
              <a
                href={`${c.profile}?${UTM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent"
              >
                {c.photographer}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
