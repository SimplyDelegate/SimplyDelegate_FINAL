"use client";

import { motion, useReducedMotion } from "framer-motion";


const navItems = ["Arbeiten", "Leistungen", "Branchen", "Über uns", "Journal"];

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function AgencyHero() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? "visible" : "hidden";

  return (
    <section
      className="agency-hero relative isolate flex min-h-screen overflow-hidden bg-[#f2f0f3] text-[#06070c]"
      aria-labelledby="agency-hero-title"
    >
      <header className="absolute left-0 right-0 top-0 z-20 px-5 pt-5 sm:px-8 lg:px-12">
        <nav
          className="mx-auto flex max-w-[1860px] items-center justify-between"
          aria-label="Hauptnavigation"
        >
          <a
            href="#top"
            className="group inline-flex items-center gap-3 text-[1.08rem] font-medium text-[#090a10]"
            aria-label="Zur Startansicht"
          >
            <span className="brand-mark">
              <img src="/favicon.svg" alt="" />
            </span>
            <span>sichtbar</span>
          </a>

          <div className="hidden items-center gap-9 text-[0.96rem] font-medium text-[#111219] lg:flex">
            {navItems.map((item) => (
              <a
                className="agency-hero-nav-link"
                href={item === "Leistungen" ? "#google-sichtbarkeit" : "#top"}
                key={item}
              >
                {item}
              </a>
            ))}
            <motion.a
              className="rounded-full bg-[#11131d] px-6 py-3 text-white shadow-[0_14px_30px_rgba(17,19,29,0.18)]"
              href="#ki-sichtbarkeit"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              Kontakt
            </motion.a>
          </div>
        </nav>
      </header>

      <div
        id="top"
        className="mx-auto grid w-full max-w-[1860px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:pb-24 lg:pt-20"
      >
        <motion.div
          className="relative z-10 max-w-[1220px] lg:pl-10"
          initial={initial}
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-7 max-w-[36rem] text-[0.82rem] font-medium uppercase text-[#5b5d67]">
            SEO. KI-Sichtbarkeit. Webdesign.
          </p>
          <h1
            id="agency-hero-title"
            className="max-w-none text-[clamp(3.45rem,4.2vw,5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[#02030a]"
          >
            <span className="block whitespace-nowrap">
              Wir machen sichtbar,
            </span>
            <span className="block whitespace-nowrap">
              was ihr Unternehmen kann.
            </span>
          </h1>
          <p className="mt-10 max-w-[45rem] text-[clamp(1.1rem,1.35vw,1.42rem)] font-medium leading-[1.42] text-[#434651] max-sm:max-w-[20.6rem] max-sm:text-[1.03rem]">
            Wir gestalten digitale Auftritte, die in Suche, KI Antworten und
            auf Ihrer Website Vertrauen aufbauen, bevor der erste Kontakt
            entsteht.
          </p>
        </motion.div>

        <motion.div
          className="agency-hero-visual relative z-0 mx-auto h-[44vh] min-h-[360px] w-full max-w-[720px] lg:ml-[1.375rem] lg:mr-[-1.375rem] lg:mt-4 lg:h-[66vh] lg:min-h-[460px] lg:max-h-[520px]"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 28 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          aria-hidden="true"
        >
          <img
            className="mx-auto h-full w-full object-contain"
            src="/favicon.svg"
            alt=""
          />
        </motion.div>
      </div>
    </section>
  );
}
