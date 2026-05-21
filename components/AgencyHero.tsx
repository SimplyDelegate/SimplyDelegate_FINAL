"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MOIN_SWEEP_MS = 800;
const MOIN_HOLD_MS = 500;
const LINE_SWEEP_MS = 900;
const LINE_STAGGER_MS = 350;

type Phase = "moin" | "hold" | "headline" | "done";

export function AgencyHero() {
  const reduceMotion = useReducedMotion();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "done" : "moin");

  // Keep the idle motion restrained on smaller screens without changing layout.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
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

  return (
    <section
      className="agency-hero relative isolate flex min-h-screen overflow-hidden bg-[#f2f0f3] text-[#06070c]"
      aria-labelledby="agency-hero-title"
    >
      <div
        id="top"
        className="mx-auto grid w-full max-w-[1860px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:pb-24 lg:pt-12"
      >
        <div className="relative z-10 max-w-[1220px] lg:pl-10">
          <div className="relative">
            <h1
              id="agency-hero-title"
              className="max-w-none text-[clamp(3.45rem,4.2vw,5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[#02030a]"
            >
              <motion.span
                className="block whitespace-nowrap"
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
                className="block whitespace-nowrap"
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
                  className="pointer-events-none absolute left-0 top-0 h-full w-auto object-contain object-left"
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
            className="mt-10 max-w-[45rem] text-[clamp(1.1rem,1.35vw,1.42rem)] font-medium leading-[1.42] text-[#434651] max-sm:max-w-[20.6rem] max-sm:text-[1.03rem]"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reduceMotion || revealRest
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Wir gestalten digitale Auftritte, die in Suche, KI Antworten und
            auf Ihrer Website Vertrauen aufbauen, bevor der erste Kontakt
            entsteht.
          </motion.p>
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
    </section>
  );
}
