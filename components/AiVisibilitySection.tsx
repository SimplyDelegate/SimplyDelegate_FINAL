import { AgencyButton } from "@/components/ui/agency-button";
import { AiVisibilityEmptyWindow } from "@/components/AiVisibilityEmptyWindow";
import { Badge } from "@/components/ui/badge";

const ctaHref = "#kontakt";

export function AiVisibilitySection() {
  return (
    <section
      id="ki-sichtbarkeit"
      className="service-section service-section--ai relative overflow-hidden"
      aria-labelledby="ki-sichtbarkeit-heading"
    >
      <div className="relative z-10 min-h-screen overflow-hidden">
        <div
          className="ai-copy absolute left-4 top-8 z-20 max-w-[30rem] sm:left-8 sm:top-10 lg:left-[7vw] lg:top-1/2"
        >
          <Badge className="brand-service-badge mb-6 px-5 py-2 text-base font-extrabold uppercase tracking-[0.18em]">
            Sichtbar in KI-Antworten
          </Badge>
          <h2
            id="ki-sichtbarkeit-heading"
            className="max-w-[12ch] text-[2.85rem] font-medium leading-[0.92] text-[#07080f] sm:text-[4rem] lg:text-[4.25rem] 2xl:text-[5.15rem]"
          >
            Sichtbarkeit endet nicht mehr bei Google.
          </h2>
          <div className="mt-8">
            <AgencyButton
              href={ctaHref}
              variant="animatedDark"
            >
              Prüfen, ob KI dich empfiehlt
            </AgencyButton>
          </div>
        </div>

        <AiVisibilityEmptyWindow />
      </div>
    </section>
  );
}
