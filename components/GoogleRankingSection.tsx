"use client";

import { useRef } from "react";

import { SearchRankingStackVisual } from "@/components/SearchRankingStackVisual";
import { AgencyButton } from "@/components/ui/agency-button";
import { Badge } from "@/components/ui/badge";

const ctaHref = "#kontakt";

export function GoogleRankingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="google-sichtbarkeit"
      className="service-section service-section--search relative overflow-hidden"
      aria-labelledby="google-sichtbarkeit-heading"
    >
      <div ref={pinRef} className="relative z-10 min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute left-4 top-8 z-20 max-w-[30rem] sm:left-8 sm:top-10 lg:inset-y-0 lg:left-[7vw] lg:top-0 lg:flex lg:w-[30rem] lg:max-w-none lg:items-center">
          <div ref={copyRef} className="serp-copy">
            <Badge className="mb-6 border-[rgba(138,94,24,0.38)] bg-[#f5d89d] px-5 py-2 text-base font-extrabold uppercase tracking-[0.18em] text-[#2a1a05] shadow-[0_0_36px_rgba(244,198,119,0.72),0_18px_34px_rgba(138,94,24,0.2)]">
              SEO
            </Badge>
            <h2
              id="google-sichtbarkeit-heading"
              className="max-w-[12ch] text-[2.85rem] font-medium leading-[0.92] text-[#07080f] sm:text-[4rem] lg:text-[4.25rem] 2xl:text-[5.15rem]"
            >
              Wenn Kunden suchen, zählt Sichtbarkeit.
            </h2>
            <div ref={ctaRef} className="pointer-events-auto mt-8">
              <AgencyButton
                href={ctaHref}
                className="border-black/10 bg-[#11131d] text-white shadow-[0_16px_34px_rgba(17,19,29,0.16)] hover:bg-[#222431]"
              >
                Ranking-Potenzial prüfen
              </AgencyButton>
            </div>
          </div>
        </div>

        <SearchRankingStackVisual />
      </div>
    </section>
  );
}
