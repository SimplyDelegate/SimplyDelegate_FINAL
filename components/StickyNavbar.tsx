"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Start", href: "#top" },
  { label: "Suchmaschinen-Sichtbarkeit", href: "#google-sichtbarkeit" },
  { label: "KI-Sichtbarkeit", href: "#ki-sichtbarkeit" },
  { label: "Webdesign", href: "#webdesign" },
];

export function StickyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`site-nav ${hasScrolled ? "site-nav--scrolled" : ""}`}>
      <nav className="site-nav__inner" aria-label="Hauptnavigation">
        <a className="site-nav__brand" href="#top" onClick={closeMenu}>
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
            <a className="site-nav__link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          <a className="site-nav__cta" href="#kontakt">
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
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}
        <a
          className="site-nav__mobile-cta"
          href="#kontakt"
          onClick={closeMenu}
          tabIndex={isMenuOpen ? 0 : -1}
        >
          Kontakt
        </a>
      </div>
    </header>
  );
}
