"use client";

import type { FormEvent } from "react";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { subscribeToHistoryRestore } from "@/lib/historyRestore";

const MOIN_SWEEP_MS = 800;
const MOIN_HOLD_MS = 500;
const LINE_SWEEP_MS = 900;
const LINE_STAGGER_MS = 350;
const NEXT_SECTION_ID = "google-sichtbarkeit";
const SECTION_NAVIGATION_EVENT = "site:section-navigation";

type Phase = "moin" | "hold" | "headline" | "done";

function HeroScrollIndicator({ reduceMotion }: { reduceMotion: boolean | null }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const target = document.getElementById(NEXT_SECTION_ID);

    if (!target) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(SECTION_NAVIGATION_EVENT, {
        detail: { targetId: NEXT_SECTION_ID },
      }),
    );

    const hash = `#${NEXT_SECTION_ID}`;

    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const nextTarget = document.getElementById(NEXT_SECTION_ID);

        if (!nextTarget) {
          return;
        }

        window.scrollTo({
          top: nextTarget.offsetTop,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      });
    });
  };

  return (
    <a
      className="agency-hero-scroll-indicator"
      href={`#${NEXT_SECTION_ID}`}
      aria-label="Zur nächsten Sektion scrollen"
      onClick={handleClick}
    >
      <span>Mehr entdecken</span>
      <span className="agency-hero-scroll-indicator__chevron" aria-hidden="true" />
    </a>
  );
}

export function AgencyHero() {
  const reduceMotion = useReducedMotion();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [domain, setDomain] = useState("");
  const [domainError, setDomainError] = useState("");
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "done" : "moin");

  // Keep the idle motion restrained on smaller screens without changing layout.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    return subscribeToHistoryRestore(() => {
      setPhase("done");
    });
  }, []);

  // Drives the MOIN -> headline reveal timeline on mount.
  useEffect(() => {
    if (reduceMotion) return;

    if (phase === "moin") {
      const id = window.setTimeout(() => setPhase("hold"), MOIN_SWEEP_MS);
      return () => window.clearTimeout(id);
    }
    if (phase === "hold") {
      const id = window.setTimeout(() => setPhase("headline"), MOIN_HOLD_MS);
      return () => window.clearTimeout(id);
    }
    if (phase === "headline") {
      const id = window.setTimeout(
        () => setPhase("done"),
        LINE_STAGGER_MS + LINE_SWEEP_MS
      );
      return () => window.clearTimeout(id);
    }
  }, [phase, reduceMotion]);

  // Keep the logo moving in a calm orbit-like loop instead of a single up/down motion.
  const logoIdleAnimation = reduceMotion
    ? undefined
    : {
        x: isMobileViewport ? [0, 4, -2, 0] : [0, 10, -6, 0],
        y: isMobileViewport ? [0, -8, -4, 0] : [0, -20, -8, 0],
        rotate: isMobileViewport ? [0, 0.85, -0.65, 0] : [0, 1.8, -1.2, 0],
        scale: isMobileViewport ? [1, 1.024, 1.01, 1] : [1, 1.04, 1.018, 1],
        filter: isMobileViewport
          ? [
              "drop-shadow(0 20px 28px rgba(78, 34, 174, 0.1)) drop-shadow(0 0 16px rgba(112, 72, 255, 0.1))",
              "drop-shadow(0 30px 48px rgba(78, 34, 174, 0.22)) drop-shadow(0 0 34px rgba(112, 72, 255, 0.22))",
              "drop-shadow(0 26px 40px rgba(57, 118, 255, 0.16)) drop-shadow(0 0 24px rgba(71, 191, 255, 0.18))",
              "drop-shadow(0 20px 28px rgba(78, 34, 174, 0.1)) drop-shadow(0 0 16px rgba(112, 72, 255, 0.1))",
            ]
          : [
              "drop-shadow(0 26px 40px rgba(78, 34, 174, 0.12)) drop-shadow(0 0 20px rgba(112, 72, 255, 0.12))",
              "drop-shadow(0 44px 72px rgba(78, 34, 174, 0.28)) drop-shadow(0 0 46px rgba(112, 72, 255, 0.28))",
              "drop-shadow(0 36px 58px rgba(57, 118, 255, 0.2)) drop-shadow(0 0 34px rgba(71, 191, 255, 0.24))",
              "drop-shadow(0 26px 40px rgba(78, 34, 174, 0.12)) drop-shadow(0 0 20px rgba(112, 72, 255, 0.12))",
            ],
      };

  const logoGlowAnimation = reduceMotion
    ? undefined
    : {
        opacity: isMobileViewport ? [0.3, 0.52, 0.38, 0.3] : [0.36, 0.64, 0.46, 0.36],
        scale: isMobileViewport ? [0.95, 1.08, 1.01, 0.95] : [0.92, 1.14, 1.03, 0.92],
        x: isMobileViewport ? [0, 2, -1, 0] : [0, 6, -4, 0],
        y: isMobileViewport ? [0, -4, -2, 0] : [0, -10, -4, 0],
      };

  const showMoin = phase === "moin" || phase === "hold";
  const headlineRevealed = phase === "headline" || phase === "done";
  const revealRest = phase === "done";

  const handleDomainSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedDomain = domain.trim();

    if (!trimmedDomain) {
      setDomainError("Bitte geben Sie Ihre Website ein.");
      return;
    }

    setDomainError("");
    console.log(trimmedDomain);
  };

  return (
    <section
      className="agency-hero relative isolate flex min-h-screen overflow-hidden bg-[#f2f0f3] text-[#06070c]"
      aria-labelledby="agency-hero-title"
    >
      <div
        id="top"
        className="mx-auto grid w-full max-w-[1860px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:pb-24 lg:pt-12"
      >
        <div className="relative z-10 max-w-[61rem] lg:pl-10">
          <div className="relative">
            <h1
              id="agency-hero-title"
              className="max-w-[55.75rem] text-[clamp(3.35rem,3.75vw,4.55rem)] font-semibold leading-[1.1] tracking-normal text-[#02030a] max-sm:text-[clamp(2.35rem,10.5vw,2.9rem)]"
            >
              <motion.span
                className="block whitespace-nowrap max-sm:whitespace-normal"
                initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
                animate={
                  reduceMotion || headlineRevealed
                    ? { clipPath: "inset(0 0% 0 0)" }
                    : { clipPath: "inset(0 100% 0 0)" }
                }
                transition={{
                  duration: LINE_SWEEP_MS / 1000,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Wir machen sichtbar,
              </motion.span>
              <motion.span
                className="block whitespace-nowrap max-sm:whitespace-normal"
                initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
                animate={
                  reduceMotion || headlineRevealed
                    ? { clipPath: "inset(0 0% 0 0)" }
                    : { clipPath: "inset(0 100% 0 0)" }
                }
                transition={{
                  duration: LINE_SWEEP_MS / 1000,
                  delay: LINE_STAGGER_MS / 1000,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                was ihr Unternehmen kann.
              </motion.span>
            </h1>

            <AnimatePresence>
              {showMoin && (
                <motion.img
                  key="moin"
                  src="/hero-assets/MOIN (1).png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 w-auto object-contain object-left"
                  style={{
                    height: `calc(100% * 1080 / 565)`,
                    top: `calc(-100% * 175 / 565)`,
                  }}
                  initial={{ clipPath: "inset(0 100% 0 0)", opacity: 1 }}
                  animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    clipPath: {
                      duration: MOIN_SWEEP_MS / 1000,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: { duration: 0.25, ease: "easeOut" },
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          <motion.p
            className="mt-9 max-w-[50rem] text-[clamp(1.12rem,1.18vw,1.26rem)] font-medium leading-[1.54] tracking-normal text-[#474a55] max-sm:mt-8 max-sm:max-w-[20.6rem] max-sm:text-[1.03rem] max-sm:leading-[1.5]"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reduceMotion || revealRest
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block lg:whitespace-nowrap">
              Viele Unternehmen in Norddeutschland leben von guter Arbeit und
              Empfehlungen.
            </span>
            <span className="block lg:whitespace-nowrap">
              Doch online entscheidet oft der erste Eindruck, ob daraus eine
              Anfrage wird.
            </span>
            <span className="block lg:whitespace-nowrap">
              Wir sorgen dafür, dass Kunden sofort verstehen, warum sie bei
              Ihnen richtig sind.
            </span>
          </motion.p>

          <motion.form
            className="mt-11 max-w-[45rem] max-sm:mt-8 lg:-ml-px lg:w-[58rem] lg:max-w-none"
            onSubmit={handleDomainSubmit}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={
              reduceMotion || revealRest
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 14 }
            }
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={`group overflow-hidden rounded-[1.85rem] border bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(251,249,255,0.72)_48%,rgba(244,250,255,0.62))] p-[0.32rem] shadow-[0_18px_42px_rgba(42,34,76,0.1),0_1px_10px_rgba(255,255,255,0.66)_inset,0_0_34px_rgba(126,20,255,0.055)] backdrop-blur-lg transition duration-300 focus-within:bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(251,249,255,0.8)_48%,rgba(244,250,255,0.68))] focus-within:shadow-[0_20px_48px_rgba(42,34,76,0.12),0_1px_10px_rgba(255,255,255,0.68)_inset,0_0_22px_rgba(126,20,255,0.08)] lg:rounded-l-[0.42rem] lg:rounded-r-[1.85rem] ${
                domainError ? "border-[#b94a6a]/70" : "border-[#d8d1ec]"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-stretch">
                <div className="lg:-my-[0.32rem] lg:-ml-[0.32rem] lg:flex lg:w-[26.5rem] lg:shrink-0 lg:items-center lg:rounded-l-[0.42rem] lg:rounded-r-[1.85rem] lg:bg-[rgba(160,68,255,0.94)] lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_-1px_0_0_rgba(237,230,255,0.34),inset_0_-14px_24px_rgba(73,31,170,0.1),12px_0_30px_rgba(126,20,255,0.13)] lg:backdrop-blur-sm">
                  <div className="px-5 pb-4 pt-4 lg:flex lg:w-full lg:items-center lg:justify-between lg:gap-4 lg:px-7 lg:pb-0 lg:pt-0">
                    <p className="w-max text-left text-[clamp(1rem,0.84vw,1.08rem)] font-semibold leading-[1.34] tracking-normal text-[#12131c] lg:text-[1.08rem] lg:font-bold lg:leading-[1.3] lg:text-[#f2f0f3]">
                      <span className="block whitespace-nowrap">
                        Wie würden sich 30 % mehr qualifizierte
                      </span>
                      <span className="block w-full whitespace-nowrap lg:tracking-[0.034em]">
                        Anfragen auf Ihren Umsatz auswirken
                      </span>
                    </p>
                    <span
                      className="hidden shrink-0 select-none font-bold leading-none tracking-normal text-[#f2f0f3]/90 lg:block lg:translate-x-0 lg:-translate-y-[0.04rem] lg:text-[2.35rem]"
                      aria-hidden="true"
                    >
                      ?
                    </span>
                  </div>
                </div>

                <div
                  className="mx-5 h-px bg-[linear-gradient(90deg,rgba(216,209,236,0),rgba(216,209,236,0.95),rgba(216,209,236,0))] lg:hidden"
                  aria-hidden="true"
                />

                <div className="flex min-w-0 flex-col gap-2 px-2 pb-2 pt-1 lg:flex-1 lg:flex-row lg:items-stretch lg:gap-0 lg:px-0 lg:py-0">
                  <div className="group/input flex min-h-[3.2rem] min-w-0 flex-1 cursor-text items-center gap-3 rounded-full border border-[rgba(216,207,234,0.62)] bg-[linear-gradient(135deg,rgba(255,255,255,0.76),rgba(250,248,255,0.55))] px-[1.125rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_10px_22px_rgba(42,34,76,0.052)] transition duration-300 focus-within:border-[rgba(168,117,255,0.64)] focus-within:bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(250,248,255,0.68))] focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_26px_rgba(126,20,255,0.08),0_0_0_1px_rgba(126,20,255,0.08)] max-sm:gap-2.5 max-sm:px-4 lg:my-[0.42rem] lg:ml-3 lg:px-5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[rgba(211,193,248,0.72)] bg-[#f4f0ff]/72 text-[#6b32d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] transition duration-300 group-focus-within/input:border-[rgba(168,117,255,0.72)] group-focus-within/input:bg-[#f3edff] group-focus-within/input:text-[#5f23cf]">
                      <GlobeIcon className="block h-4 w-4 translate-x-px" />
                    </span>
                    <label className="sr-only" htmlFor="hero-domain-input">
                      Website für die Sichtbarkeitsprüfung
                    </label>
                    <input
                      id="hero-domain-input"
                      className="h-full min-w-0 flex-1 -translate-y-[0.1rem] bg-transparent text-[0.98rem] font-semibold leading-none text-[#10111a] caret-[#7e14ff] outline-none placeholder:text-[#6d6779] max-sm:text-[0.93rem]"
                      name="domain"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="Ihre Domain eingeben"
                      value={domain}
                      aria-invalid={domainError ? "true" : "false"}
                      aria-describedby={domainError ? "hero-domain-error" : undefined}
                      onChange={(event) => {
                        setDomain(event.target.value);
                        if (domainError) setDomainError("");
                      }}
                    />
                  </div>

                  <button
                    aria-label="Finden wir es heraus"
                    className="group/cta relative inline-flex min-h-[3.2rem] shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(24,26,37,0.97)_0%,rgba(16,18,26,0.94)_100%)] px-5 text-center text-[#f2f0f3] shadow-[0_8px_18px_rgba(17,19,29,0.12),0_0_14px_rgba(126,20,255,0.08),inset_0_1px_0_rgba(255,255,255,0.21)] backdrop-blur-sm transition duration-300 hover:-translate-y-px hover:bg-[linear-gradient(180deg,rgba(32,35,50,0.98)_0%,rgba(18,21,33,0.95)_100%)] hover:shadow-[0_12px_24px_rgba(17,19,29,0.17),0_0_22px_rgba(126,20,255,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] focus:outline-none focus:ring-4 focus:ring-[#7048ff]/22 max-sm:w-full lg:-my-[0.32rem] lg:-mr-[0.32rem] lg:ml-[0.72rem] lg:min-h-0 lg:w-[11.5rem] lg:rounded-l-[0.42rem] lg:rounded-r-[1.85rem] lg:px-4"
                    type="submit"
                  >
                    <span className="relative z-10 inline-flex items-center justify-center gap-2 subpixel-antialiased [font-synthesis-weight:none] [text-rendering:geometricPrecision] [text-shadow:none]">
                      <span className="flex flex-col items-center justify-center leading-[1.02]">
                        <span className="text-[0.95rem] font-semibold tracking-normal">
                          Finden wir es
                        </span>
                        <span className="text-[1.16rem] font-bold tracking-normal">
                          heraus
                        </span>
                      </span>
                      <span
                        className="grid h-5 w-5 shrink-0 place-items-center transition duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                        aria-hidden="true"
                      >
                        <ArrowRightIcon className="h-[1.125rem] w-[1.125rem] -rotate-45" />
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {domainError ? (
              <p
                className="mt-3 text-[0.82rem] font-medium text-[#8f3150]"
                id="hero-domain-error"
              >
                {domainError}
              </p>
            ) : null}
          </motion.form>
        </div>

        <motion.div
          className="agency-hero-visual relative z-0 mx-auto h-[44vh] min-h-[360px] w-full max-w-[720px] lg:ml-[1.375rem] lg:mr-[-1.375rem] lg:mt-4 lg:h-[66vh] lg:min-h-[460px] lg:max-h-[520px]"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 28 }}
          animate={
            reduceMotion || revealRest
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.96, y: 28 }
          }
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <motion.div
            className="relative mx-auto flex h-full w-full items-center justify-center"
            animate={logoIdleAnimation}
            transition={{
              duration: isMobileViewport ? 6.4 : 6.8,
              ease: "easeInOut",
              repeat: reduceMotion ? 0 : Infinity,
            }}
            style={{
              willChange: reduceMotion ? "auto" : "transform, filter",
            }}
          >
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              animate={logoGlowAnimation}
              transition={{
                duration: isMobileViewport ? 6.2 : 6.6,
                ease: "easeInOut",
                repeat: reduceMotion ? 0 : Infinity,
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(134,59,255,0.3) 0%, rgba(126,20,255,0.18) 38%, rgba(71,191,255,0.14) 62%, rgba(71,191,255,0) 100%)",
                filter: reduceMotion ? "blur(38px)" : "blur(46px)",
                willChange: reduceMotion ? "auto" : "transform, opacity",
              }}
            />
            <img
              className="relative z-10 mx-auto h-full w-full object-contain"
              src="/favicon.svg"
              alt=""
            />
          </motion.div>
        </motion.div>
      </div>

      <HeroScrollIndicator reduceMotion={reduceMotion} />
    </section>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8" />
      <path d="M3.6 15h16.8" />
      <path d="M12 3a13.4 13.4 0 0 1 0 18" />
      <path d="M12 3a13.4 13.4 0 0 0 0 18" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.1"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
