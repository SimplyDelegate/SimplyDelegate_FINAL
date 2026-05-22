"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

import {
  consumePendingHistoryTraversal,
  runAfterHistoryRestoreLayoutSettles,
  takeRememberedHomeScrollPosition,
} from "@/lib/historyRestore";

const navLinks = [
  { label: "Start", href: "#top" },
  { label: "Suchmaschinen-Sichtbarkeit", href: "#google-sichtbarkeit" },
  { label: "KI-Sichtbarkeit", href: "#ki-sichtbarkeit" },
  { label: "Webdesign", href: "#webdesign" },
];

const SECTION_NAVIGATION_EVENT = "site:section-navigation";
const PENDING_HOME_SECTION_KEY = "site:pending-home-section";
const HASH_SCROLL_SETTLE_TOLERANCE = 2;
const HASH_SCROLL_STABLE_FRAME_COUNT = 2;
const HASH_SCROLL_MAX_SETTLE_MS = 260;
const HASH_SCROLL_USER_TAKEOVER_THRESHOLD = 14;
const USER_SCROLL_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  "Space",
  "Spacebar",
]);

const getTargetIdFromHash = (hash: string) =>
  hash.startsWith("#") ? hash.slice(1) : hash;

const getHomeHref = (hash: string, isHomePage: boolean) =>
  isHomePage ? hash : `/${hash}`;

const getMaxScrollTop = () => {
  const scrollRoot = document.scrollingElement ?? document.documentElement;

  return Math.max(0, scrollRoot.scrollHeight - window.innerHeight);
};

const clampScrollTop = (top: number) =>
  Math.min(Math.max(0, top), getMaxScrollTop());

const rememberPendingHomeSection = (hash: string) => {
  try {
    window.sessionStorage.setItem(PENDING_HOME_SECTION_KEY, hash);
  } catch {
    // Navigation still works without the handoff flag; the homepage keeps its
    // reload-to-top behavior as the fallback.
  }
};

const takePendingHomeSection = () => {
  try {
    const pendingHash = window.sessionStorage.getItem(PENDING_HOME_SECTION_KEY);

    if (pendingHash) {
      window.sessionStorage.removeItem(PENDING_HOME_SECTION_KEY);
    }

    return pendingHash;
  } catch {
    return null;
  }
};

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
let removeScrollIntentListeners: (() => void) | null = null;
let lastAutoScrollTop: number | null = null;

const clearPendingHashScroll = () => {
  activeScrollToken += 1;

  if (pendingScrollFrame) {
    window.cancelAnimationFrame(pendingScrollFrame);
    pendingScrollFrame = 0;
  }

  pendingScrollTimers.forEach((timerId) => window.clearTimeout(timerId));
  pendingScrollTimers = [];
  removeScrollIntentListeners?.();
  removeScrollIntentListeners = null;
  lastAutoScrollTop = null;
};

const setScrollTop = (top: number) => {
  const nextTop = clampScrollTop(top);
  const scrollRoot = document.scrollingElement ?? document.documentElement;

  window.scrollTo({ top: nextTop, behavior: "auto" });
  scrollRoot.scrollTop = nextTop;
  document.documentElement.scrollTop = nextTop;
  document.body.scrollTop = nextTop;
  lastAutoScrollTop = nextTop;
};

const getHashScrollTarget = (hash: string) => {
  const targetId = getTargetIdFromHash(hash);
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target) {
    return null;
  }

  if (targetId !== "top") {
    if (targetId === "kontakt") {
      const contactInner = target.querySelector<HTMLElement>(
        ".contact-section__inner",
      );
      const contactFooter = target.querySelector<HTMLElement>(".contact-footer");
      const nav = document.querySelector<HTMLElement>(".site-nav");
      const navOffset = Math.ceil((nav?.getBoundingClientRect().height ?? 0) + 8);
      const viewportBottomGap = 0;
      const scrollTop = window.scrollY;
      const anchorElement = contactInner ?? target;
      const anchorRect = anchorElement.getBoundingClientRect();
      const footerRect = contactFooter?.getBoundingClientRect();
      const blockTop = anchorRect.top + scrollTop;
      const blockBottom = (footerRect ?? anchorRect).bottom + scrollTop;
      const blockHeight = blockBottom - blockTop;
      const availableHeight = Math.max(
        0,
        window.innerHeight - navOffset - viewportBottomGap,
      );
      const targetTop =
        blockHeight <= availableHeight
          ? blockTop - navOffset - (availableHeight - blockHeight) / 2
          : blockTop - navOffset;

      return {
        targetId,
        targetTop: clampScrollTop(targetTop),
      };
    }

    return {
      targetId,
      targetTop: target.classList.contains("service-section")
        ? target.offsetTop
        : target.offsetTop + target.offsetHeight / 2 - window.innerHeight / 2,
    };
  }

  return { targetId, targetTop: 0 };
};

const scrollToHash = (hash: string, updateHistory = true) => {
  const target = getHashScrollTarget(hash);

  if (!target) {
    return null;
  }

  setScrollTop(target.targetTop);

  if (updateHistory && window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }

  return target;
};

const registerScrollIntentListeners = (scrollToken: number) => {
  removeScrollIntentListeners?.();

  const cancelIfActive = () => {
    if (scrollToken === activeScrollToken) {
      clearPendingHashScroll();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (USER_SCROLL_KEYS.has(event.key)) {
      cancelIfActive();
    }
  };

  window.addEventListener("wheel", cancelIfActive, { passive: true });
  window.addEventListener("touchmove", cancelIfActive, { passive: true });
  window.addEventListener("pointerdown", cancelIfActive, { passive: true });
  window.addEventListener("keydown", handleKeyDown);

  removeScrollIntentListeners = () => {
    window.removeEventListener("wheel", cancelIfActive);
    window.removeEventListener("touchmove", cancelIfActive);
    window.removeEventListener("pointerdown", cancelIfActive);
    window.removeEventListener("keydown", handleKeyDown);
  };
};

const scheduleHashScroll = (
  hash: string,
  updateHistory = true,
  startDelay = 80,
  maxSettleMs = HASH_SCROLL_MAX_SETTLE_MS,
) => {
  clearPendingHashScroll();
  const scrollToken = activeScrollToken;
  registerScrollIntentListeners(scrollToken);

  pendingScrollFrame = window.requestAnimationFrame(() => {
    pendingScrollFrame = 0;
    const startTimer = window.setTimeout(() => {
      pendingScrollTimers = pendingScrollTimers.filter(
        (currentTimerId) => currentTimerId !== startTimer,
      );

      const startedAt = window.performance.now();
      let stableFrameCount = 0;
      let previousTargetTop: number | null = null;

      const keepTargetInView = () => {
        if (scrollToken !== activeScrollToken) return;

        if (
          lastAutoScrollTop !== null &&
          Math.abs(window.scrollY - lastAutoScrollTop) >
            HASH_SCROLL_USER_TAKEOVER_THRESHOLD
        ) {
          clearPendingHashScroll();
          return;
        }

        const target = scrollToHash(hash, updateHistory);

        if (!target) {
          clearPendingHashScroll();
          return;
        }

        const viewportAligned =
          Math.abs(window.scrollY - target.targetTop) <=
          HASH_SCROLL_SETTLE_TOLERANCE;
        const targetStable =
          previousTargetTop !== null &&
          Math.abs(target.targetTop - previousTargetTop) <=
            HASH_SCROLL_SETTLE_TOLERANCE;

        stableFrameCount =
          viewportAligned && targetStable ? stableFrameCount + 1 : 0;
        previousTargetTop = target.targetTop;

        if (
          stableFrameCount >= HASH_SCROLL_STABLE_FRAME_COUNT ||
          window.performance.now() - startedAt >= maxSettleMs
        ) {
          clearPendingHashScroll();
          return;
        }

        if (scrollToken === activeScrollToken) {
          pendingScrollFrame = window.requestAnimationFrame(keepTargetInView);
        }
      };

      keepTargetInView();
    }, startDelay);

    pendingScrollTimers = [startTimer];
  });
};

export function StickyNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const isHomePage = pathname === "/";

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
    if (!isHomePage) {
      clearPendingHashScroll();
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    // On refresh / initial load always start at the very top of the hero,
    // regardless of any hash that might still be in the URL.
    const pendingHomeSection = takePendingHomeSection();
    const shouldPreserveScrollFromHistory = consumePendingHistoryTraversal();
    const rememberedHomeScrollTop = shouldPreserveScrollFromHistory
      ? takeRememberedHomeScrollPosition()
      : null;
    const shouldUseInitialHash =
      pendingHomeSection && pendingHomeSection === window.location.hash;

    if (shouldUseInitialHash) {
      const targetId = getTargetIdFromHash(window.location.hash);

      if (targetId) {
        dispatchSectionNavigation(targetId);
      }

      scheduleHashScroll(window.location.hash, false, 180, 320);
    } else if (shouldPreserveScrollFromHistory) {
      clearPendingHashScroll();
      if (rememberedHomeScrollTop !== null) {
        runAfterHistoryRestoreLayoutSettles(() => {
          window.scrollTo({
            top: rememberedHomeScrollTop,
            behavior: "auto",
          });
        });
      }
    } else if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    const scrollToCurrentHash = () => {
      if (window.location.hash) {
        const targetId = getTargetIdFromHash(window.location.hash);

        if (targetId) {
          dispatchSectionNavigation(targetId);
        }

        scheduleHashScroll(window.location.hash, false, 650, 320);
      }
    };

    window.addEventListener("hashchange", scrollToCurrentHash);
    window.addEventListener("popstate", scrollToCurrentHash);

    return () => {
      clearPendingHashScroll();
      window.removeEventListener("hashchange", scrollToCurrentHash);
      window.removeEventListener("popstate", scrollToCurrentHash);
    };
  }, [isHomePage]);

  const closeMenu = () => setIsMenuOpen(false);
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHomePage) {
      rememberPendingHomeSection(href);

      if (event.type === "click") {
        closeMenu();
      }

      return;
    }

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
          href={getHomeHref("#top", isHomePage)}
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
              href={getHomeHref(link.href, isHomePage)}
              key={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            className="site-nav__cta"
            href={getHomeHref("#kontakt", isHomePage)}
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
            href={getHomeHref(link.href, isHomePage)}
            key={link.href}
            onClick={(event) => handleNavClick(event, link.href)}
            tabIndex={isMenuOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}
        <a
          className="site-nav__mobile-cta"
          href={getHomeHref("#kontakt", isHomePage)}
          onClick={(event) => handleNavClick(event, "#kontakt")}
          tabIndex={isMenuOpen ? 0 : -1}
        >
          Kontakt
        </a>
      </div>
    </header>
  );
}
