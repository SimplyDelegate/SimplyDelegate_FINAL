"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import { registerScrollTrigger, shouldReduceMotion } from "@/lib/animations";

const stackLayers = Array.from({ length: 9 }, (_, index) => ({
  id: `ranking-layer-${index + 1}`,
  isOwn: index === 4,
}));

export function SearchRankingStackVisual() {
  const stageRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const finalCardRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ScrollTrigger = registerScrollTrigger();
    const stage = stageRef.current;
    const section = stage?.closest<HTMLElement>("#google-sichtbarkeit") ?? null;
    const pin =
      stage?.parentElement instanceof HTMLDivElement ? stage.parentElement : null;
    const visual = visualRef.current;
    const search = searchRef.current;
    const query = queryRef.current;
    const meta = metaRef.current;
    const scene = sceneRef.current;
    const deck = deckRef.current;
    const finalCard = finalCardRef.current;

    if (
      !ScrollTrigger ||
      !section ||
      !pin ||
      !stage ||
      !visual ||
      !search ||
      !query ||
      !meta ||
      !scene ||
      !deck ||
      !finalCard
    ) {
      return;
    }

    const layers = Array.from(
      visual.querySelectorAll<HTMLElement>("[data-ranking-layer]"),
    );
    const ownLayer = visual.querySelector<HTMLElement>("[data-ranking-own]");
    const anonymousLayers = layers.filter((layer) => layer !== ownLayer);

    const layerGap = 46;
    const layerState = (index: number) => ({
      x: 0,
      y: index * layerGap,
      z: 0,
      rotationX: 0,
      rotationZ: 0,
      scaleX: 1,
    });

    const ctx = gsap.context(() => {
      gsap.set([stage, visual, search, query, meta, scene, deck, finalCard], {
        force3D: true,
      });
      gsap.set(deck, {
        xPercent: -50,
        yPercent: 0,
        rotationX: 20,
        rotationY: -10,
        rotationZ: 5,
        transformOrigin: "50% 50%",
        transformPerspective: 1000,
      });
      gsap.set(layers, {
        xPercent: -50,
        yPercent: 0,
        transformOrigin: "50% 50%",
        zIndex: (index) => 120 - index,
      });
      gsap.set(finalCard, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 50%",
      });

      layers.forEach((layer, index) => {
        gsap.set(layer, {
          ...layerState(index),
          opacity: 0,
          filter: "blur(0px)",
        });
      });

      if (shouldReduceMotion()) {
        gsap.set([stage, visual, search, query, meta, scene], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        gsap.set(query, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(deck, { opacity: 0.2, y: -16, scale: 1 });
        gsap.set(anonymousLayers, {
          opacity: 0.28,
          x: 0,
          y: (index) => index * 14,
        });
        if (ownLayer) {
          gsap.set(ownLayer, { opacity: 0 });
        }
        gsap.set(finalCard, {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 24px)",
        });
        return;
      }

      gsap.set(stage, { opacity: 0.62, y: 44, scale: 0.985 });
      gsap.set(search, { opacity: 0.18, y: 24, scale: 0.985 });
      gsap.set(query, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(meta, { opacity: 0, y: 12 });
      gsap.set(scene, { opacity: 0, y: 24 });
      gsap.set(deck, { opacity: 1, y: 0, scale: 0.98 });
      gsap.set(finalCard, {
        opacity: 0,
        y: 18,
        scale: 0.985,
        clipPath: "inset(44% 42% 44% 42% round 18px)",
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.85}`,
          scrub: 0.9,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(stage, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: "power3.out",
        })
        .to(
          search,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
          },
          0,
        )
        .to(
          query,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.8,
            ease: "none",
          },
          1.0,
        )
        .to(
          meta,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          1.85,
        )
        .to(
          scene,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          2.55,
        )
        .to(
          layers,
          {
            opacity: (index) =>
              layers[index] === ownLayer ? 1 : 0.78 - index * 0.012,
            duration: 1.0,
            stagger: 0.022,
            ease: "power3.out",
          },
          2.6,
        )
        .set(ownLayer ? [ownLayer] : [], { zIndex: 240 }, 3.6)
        .to(
          ownLayer ? [ownLayer] : [],
          {
            x: 0,
            y: 0,
            z: 54,
            rotationX: 0,
            rotationZ: 0,
            scaleX: 1,
            scaleY: 1.02,
            duration: 2.45,
            ease: "power3.inOut",
          },
          3.6,
        )
        .to(
          anonymousLayers,
          {
            x: 0,
            y: (index) => index * layerGap,
            z: 0,
            opacity: (index) => 0.72 - index * 0.012,
            duration: 2.45,
            ease: "power3.inOut",
          },
          3.6,
        )
        .to(
          deck,
          {
            y: -4,
            scale: 1,
            duration: 2.45,
            ease: "power3.inOut",
          },
          3.6,
        )
        .to(
          ownLayer ? [ownLayer] : [],
          {
            y: 0,
            z: 58,
            scaleX: 1,
            scaleY: 1.02,
            duration: 1.15,
            ease: "power1.inOut",
          },
          6.05,
        )
        .to(
          deck,
          {
            y: -16,
            scale: 1,
            duration: 0.9,
            ease: "power2.inOut",
          },
          7.15,
        )
        .to(
          anonymousLayers,
          {
            x: 0,
            y: (index) => index * 14,
            opacity: 0.3,
            filter: "blur(0.35px)",
            duration: 0.9,
            ease: "power2.inOut",
          },
          7.15,
        )
        .to(
          ownLayer ? [ownLayer] : [],
          {
            opacity: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1.55,
            duration: 0.58,
            ease: "power2.inOut",
          },
          7.55,
        )
        .to(
          finalCard,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            duration: 0.78,
            ease: "power2.out",
          },
          7.7,
        )
        .to({}, { duration: 0.85 });
    }, visual);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className="serp-stage absolute left-4 right-4 top-[55vh] z-10 mx-auto w-auto max-w-[1120px] sm:left-8 sm:right-8 lg:left-auto lg:right-[7vw] lg:top-1/2 lg:mx-0 lg:h-[74svh] lg:w-[52vw] lg:max-w-[860px] lg:-translate-y-1/2"
    >
      <div
        ref={visualRef}
        className="search-ranking-visual"
        aria-label="Ranking-Aufstieg in organischen Suchergebnissen"
      >
        <div ref={searchRef} className="ranking-searchbar">
          <span className="ranking-searchmark" aria-hidden="true" />
          <span ref={queryRef} className="ranking-search-query">
            immobilienmakler bremen
          </span>
          <span className="ranking-search-location">lokale Suche</span>
        </div>

        <div ref={metaRef} className="ranking-meta">
          <span>Ungefähr 18.400 Ergebnisse</span>
          <span>Organische Ergebnisse</span>
        </div>

        <div ref={sceneRef} className="ranking-stack-scene">
          <div ref={deckRef} className="ranking-stack-deck" aria-hidden="true">
            {stackLayers.map((layer, index) => (
              <div
                key={layer.id}
                className={`ranking-stack-layer ranking-stack-layer--${index + 1}${
                  layer.isOwn ? " ranking-stack-layer--own" : ""
                }`}
                data-ranking-layer=""
                data-ranking-own={layer.isOwn ? "true" : undefined}
              >
                <span className="ranking-stack-card-kicker" />
                <span className="ranking-stack-card-main" />
                <span className="ranking-stack-card-support" />
                <span className="ranking-stack-card-meta" />
                {layer.isOwn ? (
                  <>
                    <span className="ranking-stack-own-title">Ihre Webseite</span>
                    <span className="ranking-stack-own-url">https:// ihre-webseite.de</span>
                    <span className="ranking-stack-own-marker" />
                    <span className="ranking-stack-own-ripple ranking-stack-own-ripple--left" />
                    <span className="ranking-stack-own-ripple ranking-stack-own-ripple--right" />
                  </>
                ) : null}
              </div>
            ))}
          </div>

          <article ref={finalCardRef} className="ranking-final-card">
            <div className="ranking-final-copy">
              <div className="ranking-final-topline">
                <span className="ranking-final-badge">Platz 1</span>
                <span className="ranking-final-domain">ihre-webseite.de</span>
              </div>
              <p className="ranking-final-breadcrumb">Immobilien › Bremen</p>
              <h3>
                Ihre Webseite | Exklusive Vermarktung & persönliche Beratung in
                Bremen
              </h3>
              <p className="ranking-final-description">
                Exklusive Immobilienvermarktung für Bremen und Umgebung:
                hochwertige Objektpräsentation, geprüfte Interessenten und
                fundierte Marktkenntnis.
              </p>
              <div className="ranking-final-support">
                <p className="ranking-final-rating">5,0 · 247 Bewertungen</p>
                <div className="ranking-final-pills">
                  <span>Immobilie verkaufen</span>
                  <span>Referenzen</span>
                  <span>Kostenlose Wertermittlung</span>
                </div>
              </div>
            </div>

            <div className="ranking-final-preview" aria-hidden="true">
              <div className="ranking-preview-topbar">
                <span className="ranking-preview-brand" />
                <span />
                <span />
                <span />
              </div>
              <div className="ranking-preview-hero">
                <div className="ranking-preview-architecture">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="ranking-preview-object">
                  <span />
                  <span />
                </div>
              </div>
              <div className="ranking-preview-body">
                <div className="ranking-preview-copy-lines">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="ranking-preview-cta" />
              </div>
              <div className="ranking-preview-property">
                <div />
                <span />
                <span />
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
