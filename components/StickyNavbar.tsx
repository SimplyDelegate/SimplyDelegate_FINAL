"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Start", href: "#top" },
  { label: "Suchmaschinen-Sichtbarkeit", href: "#google-sichtbarkeit" },
  { label: "KI-Sichtbarkeit", href: "#ki-sichtbarkeit" },
  { label: "Webdesign", href: "#webdesign" },
];

const SECTION_NAVIGATION_EVENT = "site:section-navigation";

const getTargetIdFromHash = (hash: string) =>
  hash.startsWith("#") ? hash.slice(1) : hash;

const dispatchSectionNavigation = (targetId: string) => {
  window.dispatchEvent(
    new CustomEvent(SECTION_NAVIGATION_EVENT, {
      detail: { targetId },
    }),
  );
};

let pendingScrollFrame = 0;
let pendingScrollTimers: number[] = [];
let activeScrollToken = 0;

const clearPendingHashScroll = () => {
  activeScrollToken += 1;

  if (pendingScrollFrame) {
    window.cancelAnimationFrame(pendingScrollFrame);
    pendingScrollFrame = 0;
  }

  pendingScrollTimers.forEach((timerId) => window.clearTimeout(timerId));
  pendingScrollTimers = [];
};

const scrollToHash = (hash: string, updateHistory = true) => {
  const targetId = getTargetIdFromHash(hash);
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target) {
    return null;
  }

  const setScrollTop = (top: number) => {
    const nextTop = Math.max(0, top);
    const scrollRoot = document.scrollingElement ?? document.documentElement;

    window.scrollTo({ top: nextTop, behavior: "auto" });
    scrollRoot.scrollTop = nextTop;
    document.documentElement.scrollTop = nextTop;
    document.body.scrollTop = nextTop;
  };

  if (targetId !== "top") {
    const targetTop = target.classList.contains("service-section")
      ? target.offsetTop
      : target.offsetTop + target.offsetHeight / 2 - window.innerHeight / 2;

    setScrollTop(targetTop);

    if (updateHistory && window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }

    return targetId;
  }

  setScrollTop(0);

  if (updateHistory && window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }

  return targetId;
};

const scheduleHashScroll = (
  hash: string,
  updateHistory = true,
  startDelay = 80,
  duration = 1400,
) => {
  clearPendingHashScroll();
  const scrollToken = activeScrollToken;

  pendingScrollFrame = window.requestAnimationFrame(() => {
    pendingScrollFrame = 0;
    const startTimer = window.setTimeout(() => {
      pendingScrollTimers = pendingScrollTimers.filter(
        (currentTimerId) => currentTimerId !== startTimer,
      );

      const startedAt = window.performance.now();

      const keepTargetInView = () => {
        if (scrollToken !== activeScrollToken) return;

        scrollToHash(hash, updateHistory);

        if (window.performance.now() - startedAt < duration) {
          pendingScrollFrame = window.requestAnimationFrame(keepTargetInView);
        }
      };

      keepTargetInView();
    }, startDelay);

    pendingScrollTimers = [startTimer];
  });
};

export function StickyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 8);
    };

    // Adds a softer elevated state only after the page starts scrolling.
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    // On refresh / initial load always start at the very top of the hero,
    // regardless of any hash that might still be in the URL.
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
    window.scrollTo({ top: 0, behavior: "auto" });

    const scrollToCurrentHash = () => {
      if (window.location.hash) {
        const targetId = getTargetIdFromHash(window.location.hash);

        if (targetId) {
          dispatchSectionNavigation(targetId);
        }

        scheduleHashScroll(window.location.hash, false, 650, 1600);
      }
    };

    window.addEventListener("hashchange", scrollToCurrentHash);
    window.addEventListener("popstate", scrollToCurrentHash);

    return () => {
      window.removeEventListener("hashchange", scrollToCurrentHash);
      window.removeEventListener("popstate", scrollToCurrentHash);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    closeMenu();
    const targetId = getTargetIdFromHash(href);

    if (targetId) {
      dispatchSectionNavigation(targetId);
    }

    scheduleHashScroll(href);
  };

  return (
    <header className={`site-nav ${hasScrolled ? "site-nav--scrolled" : ""}`}>
      <nav className="site-nav__inner" aria-label="Hauptnavigation">
        <a
          className="site-nav__brand"
          href="#top"
          onMouseDown={(event) => handleNavClick(event, "#top")}
          onClick={(event) => handleNavClick(event, "#top")}
        >
          <span className="brand-mark" aria-hidden="true">
            <Image src="/favicon.svg" alt="" width={34} height={34} priority />
          </span>
          <span>SimplyDelegate</span>
          <span className="site-nav__brand-divider" aria-hidden="true" />
          <span className="site-nav__brand-qualifier">
            Fachexpertise aus Norddeutschland
          </span>
        </a>

        <div className="site-nav__links" aria-label="Seitennavigation">
          {navLinks.map((link) => (
            <a
              className="site-nav__link"
              href={link.href}
              key={link.href}
              onMouseDown={(event) => handleNavClick(event, link.href)}
              onClick={(event) => handleNavClick(event, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            className="site-nav__cta"
            href="#kontakt"
            onMouseDown={(event) => handleNavClick(event, "#kontakt")}
            onClick={(event) => handleNavClick(event, "#kontakt")}
          >
            Kontakt
          </a>
        </div>

        <button
          className="site-nav__toggle"
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Navigation schliessen" : "Navigation oeffnen"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* The mobile panel stays outside the row so the navbar height remains fixed. */}
      <div
        id="mobile-navigation"
        className={`site-nav__mobile ${isMenuOpen ? "site-nav__mobile--open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        {navLinks.map((link) => (
          <a
            className="site-nav__mobile-link"
            href={link.href}
            key={link.href}
            onMouseDown={(event) => handleNavClick(event, link.href)}
            onClick={(event) => handleNavClick(event, link.href)}
            tabIndex={isMenuOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}
        <a
          className="site-nav__mobile-cta"
          href="#kontakt"
          onMouseDown={(event) => handleNavClick(event, "#kontakt")}
          onClick={(event) => handleNavClick(event, "#kontakt")}
          tabIndex={isMenuOpen ? 0 : -1}
        >
          Kontakt
        </a>
      </div>
    </header>
  );
}
