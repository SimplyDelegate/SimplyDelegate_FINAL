"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import { AgencyButton } from "@/components/ui/agency-button";
import { registerScrollTrigger, shouldReduceMotion } from "@/lib/animations";

const ctaHref = "/kontakt";

export function AiVisibilitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ScrollTrigger = registerScrollTrigger();
    const section = sectionRef.current;
    const pin = pinRef.current;
    const copy = copyRef.current;
    const stage = stageRef.current;
    const shell = shellRef.current;
    const cta = ctaRef.current;

    if (!ScrollTrigger || !section || !pin || !copy || !stage || !shell || !cta) {
      return;
    }

    const ctx = gsap.context(() => {
      if (shouldReduceMotion()) {
        gsap.set([copy, stage, shell, cta], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      gsap.set(stage, { opacity: 0 });
      gsap.set(shell, { y: 54, scale: 0.985 });
      gsap.set(cta, { opacity: 1, y: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.25}`,
          scrub: 0.9,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(stage, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        })
        .to(
          shell,
          {
            y: 0,
            scale: 1,
            duration: 0.15,
            ease: "power3.out",
          },
          0.2,
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ki-sichtbarkeit"
      className="service-section service-section--ai relative overflow-hidden"
      aria-labelledby="ki-sichtbarkeit-heading"
    >
      <div ref={pinRef} className="relative z-10 min-h-screen overflow-hidden">
        <div
          ref={copyRef}
          className="ai-copy absolute left-4 top-8 z-20 max-w-[30rem] sm:left-8 sm:top-10 lg:left-[7vw] lg:top-1/2"
        >
          <h2
            id="ki-sichtbarkeit-heading"
            className="max-w-[12ch] text-[2.85rem] font-medium leading-[0.92] text-[#07080f] sm:text-[4rem] lg:text-[4.25rem] 2xl:text-[5.15rem]"
          >
            Sichtbarkeit endet nicht mehr bei Google.
          </h2>
          <div ref={ctaRef} className="mt-8">
            <AgencyButton
              href={ctaHref}
              className="border-black/10 bg-[#11131d] text-white shadow-[0_16px_34px_rgba(17,19,29,0.16)] hover:bg-[#222431]"
            >
              KI-Sichtbarkeit analysieren
            </AgencyButton>
          </div>
        </div>

        <div
          ref={stageRef}
          className="ai-stage absolute left-4 right-4 top-[55vh] z-10 mx-auto w-auto max-w-[1120px] sm:left-8 sm:right-8 lg:left-auto lg:right-[7vw] lg:top-1/2 lg:mx-0 lg:w-[52vw] lg:max-w-[860px] lg:-translate-y-1/2"
        >
          <div ref={shellRef} className="demo-shell ai-demo-shell">
            <div className="browser-chrome ai-demo-chrome">
              <div className="browser-toolbar ai-demo-toolbar">
                <div className="browser-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="mockup-note">BEISPIELHAFTE DARSTELLUNG</span>
              </div>
            </div>
            <div className="ai-demo-body" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
