"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

import { registerScrollTrigger, shouldReduceMotion } from "@/lib/animations";
import {
  runAfterHistoryRestoreLayoutSettles,
  subscribeToHistoryRestore,
} from "@/lib/historyRestore";

type ResultItem = {
  id: string;
  company: string;
  title: string;
  url: string;
  desc: string;
  rating?: string;
  reviews?: string;
  proof?: string;
  links?: string[];
  hint?: string;
  image?: string;
  featured?: boolean;
};

const SECTION_NAVIGATION_EVENT = "site:section-navigation";
const SECTION_ID = "google-sichtbarkeit";
const SECTION_NAVIGATION_ORDER = [
  "google-sichtbarkeit",
  "ki-sichtbarkeit",
  "webdesign",
  "kontakt",
];

const BASE_RESULTS: ResultItem[] = [
  {
    id: "nordblick",
    company: "Nordblick Immobilien",
    title: "Immobilienmakler Bremen | Nordblick Immobilien",
    url: "https://www.nordblick-immobilien.de",
    desc: "Moderne Immobilienvermittlung für Bremen und Umgebung mit Fokus auf Wohnimmobilien und Verkauf.",
  },
  {
    id: "hansewert",
    company: "Hansewert Maklerbüro",
    title: "Hansewert Maklerbüro | Ihr Immobilienpartner in Bremen",
    url: "https://www.hansewert-bremen.de",
    desc: "Persönliche Beratung für Kauf, Verkauf und Vermietung von Häusern, Wohnungen und Kapitalanlagen.",
  },
  {
    id: "weserheim",
    company: "Weserheim Immobilien",
    title: "Ihre Immobilienexperten für Verkauf und Vermietung in Bremen",
    url: "https://www.weserheim-immobilien.de",
    desc: "Begleitung bei Wohnimmobilien, Mehrfamilienhäusern, Neubauprojekten und regionalen Marktanalysen.",
  },
  {
    id: "stadtquartier",
    company: "Stadtquartier Immobilien",
    title: "Stadtquartier Immobilien: Immobilienmakler Bremen",
    url: "https://www.stadtquartier-bremen.de",
    desc: "Wohnimmobilien, Gewerbeflächen, Kapitalanlagen und individuelle Vermarktungskonzepte aus einer Hand.",
  },
  {
    id: "your-site",
    company: "Ihre Webseite",
    title:
      "Ihre Webseite | Exklusive Vermarktung, starke Präsentation und persönliche Beratung",
    url: "https://ihre-webseite.de",
    desc: "Exklusive Immobilienvermarktung für Bremen und Umgebung: hochwertige Objektpräsentation, geprüfte Interessenten, fundierte Marktkenntnis und persönliche Begleitung bis zum Notartermin.",
    rating: "5,0",
    reviews: "247 Google-Bewertungen",
    proof: "Top bewertet • Exklusive Objekte • Persönliche Begleitung",
    links: ["Immobilie verkaufen", "Referenzen", "Kostenlose Wertermittlung"],
    hint:
      "Webseiten, die bei Google weiter oben stehen, bekommen deutlich mehr Klicks",
    image: "/real-estate-preview.svg",
    featured: true,
  },
];

const SWAP_INTERVAL = 1200;
const PREPARE_DELAY = 700;
const HOLD_TOP_DELAY = 3600;
const RESTART_DELAY = 1300;
const REVEAL_COMPLETE_PROGRESS = 0.62;
const PIN_RELEASE_PROGRESS = 0.82;

function swapFeaturedOneStepUp(items: ResultItem[]) {
  const index = items.findIndex((item) => item.id === "your-site");
  if (index <= 0) return items;

  const next = [...items];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  return next;
}

function SearchResult({
  item,
  rank,
  topReached,
}: {
  item: ResultItem;
  rank: number;
  topReached: boolean;
}) {
  const displayUrl = item.url.replace("https://", "");
  const isFeatured = Boolean(item.featured);
  const featuredTitleRest =
    "Exklusive Vermarktung, starke Präsentation und persönliche Beratung";

  return (
    <motion.article
      layout
      transition={{
        layout: { duration: 0.78, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`result-card ${item.featured ? "featured" : ""} ${
        item.featured && topReached ? "top-reached" : ""
      }`}
    >
      <div className="result-topline">
        <div className="result-company-wrap">
          <div className={`company-dot ${item.featured ? "featured-dot" : ""}`}>
            {item.featured ? (
              <span className="company-mark" aria-hidden="true">
                IW
              </span>
            ) : (
              item.company.slice(0, 1)
            )}
          </div>

          <div className="company-meta">
            <div className="company-name">
              {isFeatured ? (
                <span className="premium-term-highlight">{item.company}</span>
              ) : (
                item.company
              )}
            </div>
            <div className="company-url">{displayUrl}</div>
          </div>
        </div>

        <div className={`rank-chip ${item.featured ? "rank-chip--featured" : ""}`}>
          Platz {rank}
        <div className="rank-chip" aria-label={`Platz ${rank}`}>
          <span className="rank-chip__label">Platz</span>
          <span className="rank-chip__number">{rank}</span>
        </div>
      </div>

      <div className={`result-body ${item.image ? "has-image" : ""}`}>
        <div className="result-text">
          {item.hint && <div className="result-intent-note">{item.hint}</div>}

          <div className="result-title-row">
            <h3 className="result-title">
              {isFeatured ? (
                <>
                  <span className="premium-term-highlight">
                    {item.company}
                  </span>
                  {" | "}
                  {featuredTitleRest}
                </>
              ) : (
                item.title
              )}
            </h3>
          </div>

          <p className="result-desc">{item.desc}</p>

          {(item.rating || item.reviews) && (
            <div className="result-rating">
              <span>{item.rating}</span>
              <span className="stars">★★★★★</span>
              <span>{item.reviews}</span>
            </div>
          )}

          {item.proof && <div className="result-proof">{item.proof}</div>}

          {item.links?.length ? (
            <div className="result-links">
              {item.links.map((link) => (
                <span key={link} className="result-link-pill">
                  {link}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {item.image && (
          <div className="result-thumb-wrap">
            <div className="result-thumb">
              <img src={item.image} alt="" />
            </div>
            {isFeatured ? (
              <span className="ranking-overtake-arrow" aria-hidden="true" />
            ) : null}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function SearchRankingStackVisual() {
  const stageRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const searchbarRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const resultsViewportRef = useRef<HTMLDivElement>(null);
  const resultsListRef = useRef<HTMLDivElement>(null);
  const revealReadyRef = useRef(false);
  const hasRevealCompletedRef = useRef(false);
  const [results, setResults] = useState(BASE_RESULTS);
  const [topReached, setTopReached] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRevealReady, setIsRevealReady] = useState(false);
  const [hasRevealCompleted, setHasRevealCompleted] = useState(false);
  const [isWindowVisible, setIsWindowVisible] = useState(false);

  useLayoutEffect(() => {
    const ScrollTrigger = registerScrollTrigger();
    const stage = stageRef.current;
    const shell = shellRef.current;
    const toolbar = toolbarRef.current;
    const searchbar = searchbarRef.current;
    const query = queryRef.current;
    const meta = metaRef.current;
    const resultsViewport = resultsViewportRef.current;
    const resultsList = resultsListRef.current;
    const section = stage?.closest<HTMLElement>("#google-sichtbarkeit");
    const pin = stage?.parentElement;

    if (
      !ScrollTrigger ||
      !stage ||
      !shell ||
      !toolbar ||
      !searchbar ||
      !query ||
      !meta ||
      !resultsViewport ||
      !resultsList ||
      !section ||
      !pin
    ) {
      return;
    }

    const setRevealReady = (ready: boolean) => {
      if (!ready && hasRevealCompletedRef.current) {
        ready = true;
      }

      if (revealReadyRef.current === ready) return;

      revealReadyRef.current = ready;
      setIsRevealReady(ready);

      if (!ready) {
        setTopReached(false);
        setResults(BASE_RESULTS);
      }
    };

    const persistentChromeDetails = Array.from(
      toolbar.querySelectorAll<HTMLElement>(
        ".browser-dots, .mockup-note",
      ),
    );
    const delayedChromeDetails = Array.from(
      toolbar.querySelectorAll<HTMLElement>(".animation-toggle"),
    );

    const setFinalRevealState = () => {
      gsap.set(stage, { opacity: 1 });
      gsap.set(shell, { y: 0, scale: 1 });
      gsap.set(searchbar, { opacity: 1, y: 0, scale: 1 });
      gsap.set(query, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(
        [
          meta,
          resultsViewport,
          resultsList,
          ...persistentChromeDetails,
          ...delayedChromeDetails,
        ],
        { opacity: 1, y: 0 },
      );
    };

    let removeSectionNavigationListener: (() => void) | null = null;
    let syncAfterHistoryRestore = () => {};

    const ctx = gsap.context(() => {
      if (shouldReduceMotion()) {
        gsap.set(
          [
            stage,
            shell,
            searchbar,
            query,
            meta,
            resultsViewport,
            resultsList,
            ...persistentChromeDetails,
            ...delayedChromeDetails,
          ],
          { opacity: 1, y: 0, scale: 1, clearProps: "transform" },
        );
        gsap.set(query, { clipPath: "inset(0% 0% 0% 0%)" });
        hasRevealCompletedRef.current = true;
        setHasRevealCompleted(true);
        setRevealReady(true);
        syncAfterHistoryRestore = () => {
          setFinalRevealState();
          setRevealReady(true);
        };
        return;
      }

      gsap.set(stage, { opacity: 0 });
      gsap.set(shell, { y: 54, scale: 0.985 });
      gsap.set(searchbar, { opacity: 1, y: 0, scale: 1 });
      gsap.set(query, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(persistentChromeDetails, { opacity: 1, y: 0 });
      gsap.set(delayedChromeDetails, { opacity: 0, y: -6 });
      gsap.set(meta, { opacity: 0, y: 10 });
      gsap.set(resultsViewport, { opacity: 1, y: 0 });
      gsap.set(resultsList, { opacity: 0, y: 18 });
      setRevealReady(false);

      let timeline: ReturnType<typeof gsap.timeline> | null = null;
      let completedScrollTrigger:
        | InstanceType<typeof ScrollTrigger>
        | null = null;
      let hasReleasedPin = false;

      const completeReveal = (
        scrollTrigger?: InstanceType<typeof ScrollTrigger>,
      ) => {
        if (!hasRevealCompletedRef.current) {
          setHasRevealCompleted(true);
        }

        hasRevealCompletedRef.current = true;
        completedScrollTrigger = scrollTrigger ?? completedScrollTrigger;
        timeline?.progress(1).pause();
        setFinalRevealState();
        setRevealReady(true);
      };

      const releaseCompletedPin = (keepSectionInView = true) => {
        if (hasReleasedPin) return;

        const trigger =
          completedScrollTrigger ??
          (
            timeline as
              | (ReturnType<typeof gsap.timeline> & {
                  scrollTrigger?: InstanceType<typeof ScrollTrigger>;
                })
              | null
          )?.scrollTrigger;

        if (!trigger) return;

        hasReleasedPin = true;
        completedScrollTrigger = null;
        trigger.kill(true, true);
        setFinalRevealState();
        setRevealReady(true);

        const keepSeoSectionInView = () => {
          if (!keepSectionInView) return;

          window.scrollTo({
            top: section.offsetTop,
            behavior: "auto",
          });
        };

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          keepSeoSectionInView();
          ScrollTrigger.update();
        });
      };

      const handleSectionNavigation = (event: Event) => {
        const { targetId } = (event as CustomEvent<{ targetId?: string }>)
          .detail ?? {};
        const ownIndex = SECTION_NAVIGATION_ORDER.indexOf(SECTION_ID);
        const targetIndex = SECTION_NAVIGATION_ORDER.indexOf(targetId ?? "");

        if (targetIndex < ownIndex) {
          return;
        }

        completeReveal();
        releaseCompletedPin(false);

        if (targetId === SECTION_ID) {
          gsap.fromTo(
            stage,
            { opacity: 0 },
            { opacity: 1, duration: 0.32, ease: "power3.out" },
          );
          gsap.fromTo(
            shell,
            { y: 18, scale: 0.985 },
            { y: 0, scale: 1, duration: 0.36, ease: "power3.out" },
          );
        }
      };

      syncAfterHistoryRestore = () => {
        completeReveal();
        releaseCompletedPin(false);

        runAfterHistoryRestoreLayoutSettles(() => {
          ScrollTrigger.refresh();
          ScrollTrigger.update();
        });
      };

      window.addEventListener(SECTION_NAVIGATION_EVENT, handleSectionNavigation);
      removeSectionNavigationListener = () => {
        window.removeEventListener(
          SECTION_NAVIGATION_EVENT,
          handleSectionNavigation,
        );
      };

      timeline = gsap.timeline({
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
            if (
              hasRevealCompletedRef.current ||
              self.progress >= REVEAL_COMPLETE_PROGRESS
            ) {
              completeReveal(self);

              if (self.progress >= PIN_RELEASE_PROGRESS) {
                releaseCompletedPin();
              }

              return;
            }

            setRevealReady(false);
          },
          onLeaveBack: (self) => {
            if (hasRevealCompletedRef.current) {
              completeReveal(self);
              return;
            }

            setRevealReady(false);
          },
        },
      });

      timeline
        .to({}, { duration: 0.2 })
        .to(
          stage,
          {
            opacity: 1,
            duration: 0.15,
            ease: "power3.out",
          },
          0.2,
        )
        .to(
          shell,
          {
            y: 0,
            scale: 1,
            duration: 0.15,
            ease: "power3.out",
          },
          0.2,
        )
        .to(
          query,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.15,
            ease: "none",
          },
          0.35,
        )
        .set(delayedChromeDetails, { opacity: 1, y: 0 }, 0.62)
        .set(meta, { opacity: 1, y: 0 }, 0.62)
        .set(resultsList, { opacity: 1, y: 0 }, 0.62)
        .to({}, { duration: 0.2 }, 0.8);
    }, stage);

    const removeHistoryRestoreListener = subscribeToHistoryRestore(() => {
      syncAfterHistoryRestore();
    });

    return () => {
      removeHistoryRestoreListener();
      removeSectionNavigationListener?.();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) return;

    let frameId = 0;

    const updateVisibility = () => {
      const rect = shell.getBoundingClientRect();
      const isVisible =
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth;

      setIsWindowVisible(isVisible);
    };

    const scheduleUpdate = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateVisibility();
      });
    };

    const observer = new IntersectionObserver(scheduleUpdate, {
      threshold: 0,
    });

    observer.observe(shell);
    updateVisibility();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRevealReady || !isWindowVisible || isPaused) return;

    const currentIndex = results.findIndex((item) => item.id === "your-site");
    if (currentIndex < 0) return;

    const delay =
      currentIndex === 0
        ? HOLD_TOP_DELAY + RESTART_DELAY
        : currentIndex === BASE_RESULTS.length - 1
          ? PREPARE_DELAY
          : SWAP_INTERVAL;

    const timeoutId = setTimeout(() => {
      if (currentIndex === 0) {
        setTopReached(false);
        setResults(BASE_RESULTS);
        return;
      }

      setResults((prev) => {
        const next = swapFeaturedOneStepUp(prev);
        const newIndex = next.findIndex((item) => item.id === "your-site");

        if (newIndex === 0) {
          setTopReached(true);
        }

        return next;
      });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isRevealReady, isWindowVisible, isPaused, results]);

  return (
    <div
      ref={stageRef}
      className={`serp-demo-stage absolute left-4 right-4 top-[55vh] z-10 mx-auto w-auto max-w-[1120px] sm:left-8 sm:right-8 lg:left-auto lg:right-[7vw] lg:top-1/2 lg:mx-0 lg:w-[52vw] lg:max-w-[860px] lg:-translate-y-1/2 ${
        hasRevealCompleted ? "is-reveal-complete" : ""
      }`}
    >
      <div
        ref={shellRef}
        className={`demo-shell ${isPaused ? "is-paused" : ""}`}
      >
        <div className="browser-chrome">
          <div ref={toolbarRef} className="browser-toolbar">
            <div className="browser-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="mockup-note">Beispielhafte Darstellung</span>
            <button
              className="animation-toggle"
              type="button"
              aria-pressed={isPaused}
              onClick={() => setIsPaused((paused) => !paused)}
            >
              {isPaused ? "Animation fortsetzen" : "Animation pausieren"}
            </button>
          </div>
          <div ref={searchbarRef} className="searchbar">
            <span ref={queryRef} className="search-query">
              immobilienmakler bremen
            </span>
          </div>
          <div ref={metaRef} className="results-meta">
            Ungefähr 24.800.000 Ergebnisse (0,41 Sekunden)
          </div>
        </div>

        <div ref={resultsViewportRef} className="results-viewport">
          <div className="fade-top" />
          <div className="fade-bottom" />

          <motion.div ref={resultsListRef} layout className="results-list">
            {results.map((item, index) => (
              <SearchResult
                key={item.id}
                item={item}
                rank={index + 1}
                topReached={topReached}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
