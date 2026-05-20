"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import { registerScrollTrigger, shouldReduceMotion } from "@/lib/animations";

const videoSrc =
  "/videos/u1187684669_httpss.mj.runkpWjapEvck4_0f13a8aa-de59-4074-b9b2-_424d8ffd-fc68-4c61-b565-fa0cf0fa2e4d_3%20(2).mp4";

const VIDEO_REVEAL_PROGRESS = 0.18;
const VIDEO_SCRUB_START_PROGRESS = 0.32;
const VIDEO_SCRUB_END_PROGRESS = 0.9;

const trustTiles = [
  {
    value: "320+",
    label: "Projekte",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.25 7.2V5.9A1.9 1.9 0 0 1 10.15 4h3.7a1.9 1.9 0 0 1 1.9 1.9v1.3" />
        <path d="M5.4 7.2h13.2a1.7 1.7 0 0 1 1.7 1.7v8.3a1.7 1.7 0 0 1-1.7 1.7H5.4a1.7 1.7 0 0 1-1.7-1.7V8.9a1.7 1.7 0 0 1 1.7-1.7Z" />
        <path d="M9.4 12.1h5.2" />
      </svg>
    ),
  },
  {
    value: "4,9/5",
    label: "Kundenzufriedenheit",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 4.15 2.28 4.62 5.1.74-3.69 3.6.87 5.08L12 15.79l-4.56 2.4.87-5.08-3.69-3.6 5.1-.74L12 4.15Z" />
      </svg>
    ),
  },
  {
    value: "48h",
    label: "Antwort in",
    labelFirst: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.7" />
        <path d="M12 7.9v4.5l3.25 1.9" />
      </svg>
    ),
  },
];

export function WebdesignSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ScrollTrigger = registerScrollTrigger();
    const pin = pinRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const copy = copyRef.current;
    const section = stage?.closest<HTMLElement>("#webdesign");

    if (!ScrollTrigger || !pin || !stage || !video || !copy || !section) {
      return;
    }

    let videoDuration = Number.isFinite(video.duration) ? video.duration : 0;

    const updateVideoDuration = () => {
      videoDuration = Number.isFinite(video.duration) ? video.duration : 0;
      ScrollTrigger.refresh();
    };

    const setVideoProgress = (scrollProgress: number) => {
      video.pause();

      if (!videoDuration) return;

      const scrubProgress = gsap.utils.clamp(
        0,
        1,
        (scrollProgress - VIDEO_SCRUB_START_PROGRESS) /
          (VIDEO_SCRUB_END_PROGRESS - VIDEO_SCRUB_START_PROGRESS),
      );
      const nextTime = videoDuration * scrubProgress;

      if (Math.abs(video.currentTime - nextTime) > 0.025) {
        try {
          video.currentTime = nextTime;
        } catch {
          // Some browsers reject seeking before metadata is ready.
        }
      }
    };

    video.pause();
    video.addEventListener("loadedmetadata", updateVideoDuration);

    const ctx = gsap.context(() => {
      gsap.set(stage, { opacity: 0, yPercent: -50, y: 54, scale: 0.985 });
      gsap.set(copy, { opacity: 1, y: 0 });

      if (shouldReduceMotion()) {
        gsap.set(stage, { opacity: 1, yPercent: -50, y: 0, scale: 1 });
        gsap.set(copy, { opacity: 1, y: 0 });
        setVideoProgress(VIDEO_SCRUB_START_PROGRESS);
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.35}`,
          scrub: 0.9,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setVideoProgress(self.progress);
          },
        },
      });

      timeline
        .to(
          stage,
          {
            opacity: 1,
            yPercent: -50,
            y: 0,
            scale: 1,
            duration: VIDEO_REVEAL_PROGRESS,
            ease: "power3.out",
          },
          0,
        )
        .to(
          copy,
          {
            opacity: 0,
            y: -8,
            duration: 0.18,
            ease: "power2.out",
          },
          VIDEO_SCRUB_START_PROGRESS,
        )
        .to({}, { duration: 1 }, 0);
    }, stage);

    return () => {
      video.removeEventListener("loadedmetadata", updateVideoDuration);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="webdesign"
      className="service-section service-section--webdesign relative overflow-hidden"
      aria-label="Webdesign"
    >
      <div ref={pinRef} className="webdesign-pin relative z-10 min-h-screen overflow-hidden">
        <div className="webdesign-video-stage" ref={stageRef}>
          <video
            ref={videoRef}
            className="webdesign-video"
            src={videoSrc}
            muted
            playsInline
            preload="metadata"
          />
          <div className="webdesign-showcase-overlay" aria-hidden="true">
            <div className="webdesign-showcase-topbar">
              <div className="webdesign-showcase-brand">
                <span className="webdesign-showcase-monogram">
                  <svg viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M7 25.5V6.5l18 19V6.5" />
                    <path d="M11 25.5V13.25l10 10.5V6.5" />
                  </svg>
                </span>
                <span>Nordform Bremen</span>
              </div>
              <div className="webdesign-showcase-nav">
                <span>Leistungen</span>
                <span>Projekte</span>
                <span>Über uns</span>
                <span>Bewertungen</span>
                <span>Kontakt</span>
              </div>
              <div className="webdesign-showcase-phone">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.18 4.9 9.2 4.28a1.25 1.25 0 0 1 1.43.61l1.02 1.93a1.3 1.3 0 0 1-.28 1.52l-.94.91a10.2 10.2 0 0 0 4.35 4.35l.91-.94a1.3 1.3 0 0 1 1.52-.28l1.93 1.02a1.25 1.25 0 0 1 .61 1.43l-.62 2.02a1.65 1.65 0 0 1-1.72 1.16C10.84 17.55 5.48 12.2 5.02 5.63A1.65 1.65 0 0 1 6.18 3.9Z" />
                </svg>
                <span>0421 123 456 0</span>
              </div>
            </div>
            <div className="webdesign-showcase-copy" ref={copyRef}>
              <div className="webdesign-showcase-pill">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s6.5-5.35 6.5-11A6.5 6.5 0 0 0 5.5 10C5.5 15.65 12 21 12 21Z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
                <span>Für Bremen & Umgebung</span>
              </div>
              <h3>
                <span>Räume, die</span>
                <span>Eindruck machen.</span>
              </h3>
              <p>
                <span>Wir planen und realisieren hochwertige Innenausbauten</span>
                <span>und Renovierungen für Wohn- und Geschäftsräume – mit</span>
                <span>klaren Angeboten, festen Ansprechpartnern und</span>
                <span>sauberer Umsetzung.</span>
              </p>
            </div>
            <div className="webdesign-showcase-actions">
              <span className="webdesign-showcase-button webdesign-showcase-button--primary">
                Projekt anfragen
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M9 7h8v8" />
                </svg>
              </span>
              <span className="webdesign-showcase-button">
                Arbeiten ansehen
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M9 7h8v8" />
                </svg>
              </span>
            </div>
            <div className="webdesign-showcase-trust">
              {trustTiles.map((tile) => (
                <div
                  className={
                    tile.labelFirst
                      ? "webdesign-showcase-tile webdesign-showcase-tile--label-first"
                      : "webdesign-showcase-tile"
                  }
                  key={tile.label}
                >
                  <span className="webdesign-showcase-icon">{tile.icon}</span>
                  <div>
                    {tile.labelFirst ? (
                      <>
                        <span>{tile.label}</span>
                        <strong>{tile.value}</strong>
                      </>
                    ) : (
                      <>
                        <strong>{tile.value}</strong>
                        <span>{tile.label}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="webdesign-showcase-form">
              <h4>Ihr Projekt in 60 Sekunden</h4>
              <div className="webdesign-showcase-form-row">
                <span className="webdesign-showcase-form-label">Projektart</span>
                <span className="webdesign-showcase-form-field">
                  <span>Bitte ausw&auml;hlen</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7 10 5 5 5-5" />
                  </svg>
                </span>
              </div>
              <div className="webdesign-showcase-form-row">
                <span className="webdesign-showcase-form-label">Ort</span>
                <span className="webdesign-showcase-form-field">
                  <span>Bremen oder Umgebung</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21s6.5-5.35 6.5-11A6.5 6.5 0 0 0 5.5 10C5.5 15.65 12 21 12 21Z" />
                    <circle cx="12" cy="10" r="2.3" />
                  </svg>
                </span>
              </div>
              <div className="webdesign-showcase-form-row">
                <span className="webdesign-showcase-form-label">Wunschtermin</span>
                <span className="webdesign-showcase-form-field">
                  <span>z. B. Juli 2026</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7.2 4.4v3" />
                    <path d="M16.8 4.4v3" />
                    <path d="M5.2 7h13.6" />
                    <path d="M6.2 5.8h11.6a1.7 1.7 0 0 1 1.7 1.7v10.1a1.7 1.7 0 0 1-1.7 1.7H6.2a1.7 1.7 0 0 1-1.7-1.7V7.5a1.7 1.7 0 0 1 1.7-1.7Z" />
                  </svg>
                </span>
              </div>
              <span className="webdesign-showcase-form-submit">
                Unverbindlich anfragen
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M9 7h8v8" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
