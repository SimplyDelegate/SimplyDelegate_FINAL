"use client";

import Link from "next/link";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";

import { rememberHomeScrollPosition } from "@/lib/historyRestore";

type ContactStep = "domain" | "choice" | "details";

type FormState = {
  name: string;
  domain: string;
  email: string;
  message: string;
};

type SubmitState = {
  tone: "idle" | "success" | "error";
  message: string;
};

const initialFormState: FormState = {
  name: "",
  domain: "",
  email: "",
  message: "",
};

const CONTACT_PREFILL_EVENT = "contact:prefill-domain";

const scrollContactSectionIntoView = () => {
  const section = document.getElementById("kontakt");

  if (!section) {
    return;
  }

  const contactInner = section.querySelector<HTMLElement>(
    ".contact-section__inner",
  );
  const contactFooter = section.querySelector<HTMLElement>(".contact-footer");
  const nav = document.querySelector<HTMLElement>(".site-nav");
  const navOffset = Math.ceil((nav?.getBoundingClientRect().height ?? 0) + 8);
  const scrollTop = window.scrollY;
  const anchorElement = contactInner ?? section;
  const anchorRect = anchorElement.getBoundingClientRect();
  const footerRect = contactFooter?.getBoundingClientRect();
  const blockTop = anchorRect.top + scrollTop;
  const blockBottom = (footerRect ?? anchorRect).bottom + scrollTop;
  const blockHeight = blockBottom - blockTop;
  const availableHeight = Math.max(0, window.innerHeight - navOffset);
  const maxScrollTop = Math.max(
    0,
    (document.scrollingElement ?? document.documentElement).scrollHeight -
      window.innerHeight,
  );
  const targetTop =
    blockHeight <= availableHeight
      ? blockTop - navOffset - (availableHeight - blockHeight) / 2
      : blockTop - navOffset;

  const nextTop = Math.min(Math.max(0, targetTop), maxScrollTop);
  const scrollRoot = document.scrollingElement ?? document.documentElement;

  window.scrollTo({ top: nextTop, behavior: "auto" });
  scrollRoot.scrollTop = nextTop;
  document.documentElement.scrollTop = nextTop;
  document.body.scrollTop = nextTop;
};

export function ContactSection() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [contactStep, setContactStep] = useState<ContactStep>("domain");
  const [showMoreInfoQuestion, setShowMoreInfoQuestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitState>({
    tone: "idle",
    message: "",
  });

  const updateField =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  useEffect(() => {
    const handlePrefillDomain = (event: Event) => {
      const { domain } = (event as CustomEvent<{ domain?: string }>).detail ?? {};
      const trimmedDomain = domain?.trim();

      if (!trimmedDomain) {
        return;
      }

      setStatus({ tone: "idle", message: "" });
      setForm((current) => ({ ...current, domain: trimmedDomain }));
      setContactStep("choice");
      setShowMoreInfoQuestion(true);

      if (window.location.hash !== "#kontakt") {
        window.location.hash = "kontakt";
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(scrollContactSectionIntoView);
      });
      window.setTimeout(scrollContactSectionIntoView, 120);
      window.setTimeout(scrollContactSectionIntoView, 360);
    };

    window.addEventListener(CONTACT_PREFILL_EVENT, handlePrefillDomain);

    return () => {
      window.removeEventListener(CONTACT_PREFILL_EVENT, handlePrefillDomain);
    };
  }, []);

  const handleDomainContinue = () => {
    setStatus({ tone: "idle", message: "" });

    if (!form.domain.trim()) {
      setStatus({
        tone: "error",
        message: "Bitte gib deine Domain ein.",
      });
      return;
    }

    setContactStep("choice");
    setShowMoreInfoQuestion(true);
  };

  const handleMoreInfoChoice = () => {
    setStatus({ tone: "idle", message: "" });
    setContactStep("details");
    setShowMoreInfoQuestion(false);
  };

  const handleNoMoreInfoChoice = () => {
    setStatus({ tone: "idle", message: "" });
    setShowMoreInfoQuestion(false);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollContactSectionIntoView);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (contactStep !== "details") {
      handleDomainContinue();
      return;
    }

    setStatus({ tone: "idle", message: "" });

    if (!form.domain.trim()) {
      setContactStep("domain");
      setStatus({
        tone: "error",
        message: "Bitte gib deine Domain ein.",
      });
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({
        tone: "error",
        message: "Bitte fülle alle Felder aus.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const message = [
        `Domain: ${form.domain.trim()}`,
        `Nachricht: ${form.message.trim()}`,
      ].join("\n");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message,
        }),
      });
      const data = (await response.json()) as SubmitState;

      setStatus({
        tone: data.tone ?? (response.ok ? "success" : "error"),
        message:
          data.message ||
          "Die Nachricht konnte gerade nicht verarbeitet werden.",
      });

      if (response.ok) {
        setForm(initialFormState);
        setContactStep("domain");
        setShowMoreInfoQuestion(false);
      }
    } catch {
      setStatus({
        tone: "error",
        message:
          "Die Verbindung konnte nicht aufgebaut werden. Bitte versuche es gleich erneut.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLegalLinkClick = () => {
    rememberHomeScrollPosition();
  };

  return (
    <section
      id="kontakt"
      className={`contact-section contact-section--${contactStep}`}
      aria-label={
        contactStep === "details"
          ? "Weitere Informationen zur Webseite-Prüfung"
          : undefined
      }
      aria-labelledby={
        contactStep === "details" ? undefined : "contact-heading"
      }
    >
      <div className="contact-section__glow contact-section__glow--violet" />
      <div className="contact-section__glow contact-section__glow--cyan" />

      <div className="contact-section__inner">
        {contactStep !== "details" ? (
          <div className="contact-section__copy">
            <p className="contact-section__eyebrow">
              Kostenlose Sichtbarkeitsprüfung
            </p>
            <h2 id="contact-heading">
              <span>Finden Kunden Ihr Unternehmen</span>
              <span>oder Ihre Konkurrenz?</span>
            </h2>
            <p>
              Wir prüfen Ihre Webseite und zeigen Ihnen, wo Sie online sichtbar
              sind, wo Vertrauen verloren geht und wo mehr Anfragen möglich
              wären.
            </p>
          </div>
        ) : null}

        <form
          className={`contact-card contact-card--${contactStep}`}
          onSubmit={handleSubmit}
        >
          {contactStep === "domain" ? (
            <div className="contact-card__header">
              <h3>Ihre Webseite prüfen</h3>
            </div>
          ) : null}

          {contactStep === "domain" ? (
            <>
              <div className="contact-field">
                <input
                  id="contact-domain"
                  name="domain"
                  type="text"
                  aria-label="Webseite Adresse"
                  autoComplete="url"
                  placeholder="ihre-website.de"
                  value={form.domain}
                  onChange={updateField("domain")}
                  required
                />
              </div>

              <button
                className="contact-submit contact-submit--visibility-check"
                type="submit"
              >
                <span>Kostenlos prüfen lassen / Kontakt aufnehmen</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M9 7h8v8" />
                </svg>
              </button>
              <p className="contact-card__note">
                Kostenlos, unverbindlich und mit persönlicher Rückmeldung
                innerhalb von 24 Stunden.
              </p>
            </>
          ) : (
            <>
              {contactStep === "choice" && !showMoreInfoQuestion ? (
                <div className="contact-phase-message contact-phase-message--confirmed">
                  <span className="contact-phase-message__check" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m6 12 4 4 8-8" />
                    </svg>
                  </span>
                  <p>
                    Alles klar, wir haben Ihre Webseite-Domain erhalten und
                    melden uns innerhalb von 24 Stunden bei Ihnen.
                  </p>
                </div>
              ) : (
                <p className="contact-phase-message">
                  {contactStep === "details" ? (
                  <>
                    <span>Wir haben Ihre Webseite-Domain erhalten</span>
                    <span>
                      und melden uns innerhalb von 24 Stunden bei Ihnen.
                    </span>
                    <span>
                      Weitere Fragen oder Informationen können Sie uns
                      gerne hier übermitteln.
                    </span>
                  </>
                  ) : (
                  <>
                    <span>Wir haben Ihre Webseite-Domain erhalten</span>
                    <span>
                      und melden uns innerhalb von 24 Stunden bei Ihnen.
                    </span>
                  </>
                  )}
                </p>
              )}

              {showMoreInfoQuestion ? (
                <div className="contact-choice" aria-live="polite">
                  <p>Möchten Sie uns noch mehr Informationen geben?</p>
                  <div className="contact-choice__actions">
                    <button
                      className="contact-choice__button"
                      type="button"
                      onClick={handleMoreInfoChoice}
                    >
                      Ja gerne
                    </button>
                    <button
                      className="contact-choice__button contact-choice__button--secondary"
                      type="button"
                      onClick={handleNoMoreInfoChoice}
                    >
                      Nein danke
                    </button>
                  </div>
                </div>
              ) : null}

              {contactStep === "details" ? (
                <>
                  <div className="contact-field">
                    <label htmlFor="contact-name">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Dein Name"
                      value={form.name}
                      onChange={updateField("name")}
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-email">E-Mail</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="dein.name@firma.de"
                      value={form.email}
                      onChange={updateField("email")}
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-message">
                      Mehr Informationen / Nachricht
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Was sollten wir über dein Anliegen wissen?"
                      value={form.message}
                      onChange={updateField("message")}
                      required
                    />
                  </div>

                  <button
                    className="contact-submit contact-submit--visibility-check"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>
                      {isSubmitting ? "Wird vorbereitet..." : "Nachricht senden"}
                    </span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 17 17 7" />
                      <path d="M9 7h8v8" />
                    </svg>
                  </button>
                </>
              ) : null}
            </>
          )}

          {status.message ? (
            <p className={`contact-status contact-status--${status.tone}`}>
              {status.message}
            </p>
          ) : null}
        </form>
      </div>

      <footer className="contact-footer" aria-label="Footer">
        <div className="contact-footer__inner">
          <div className="contact-footer__links">
            <Link href="/datenschutz" onClick={handleLegalLinkClick}>
              Datenschutz
            </Link>
            <Link href="/impressum" onClick={handleLegalLinkClick}>
              Impressum
            </Link>
          </div>
          <p>SimplyDelegate 2026</p>
        </div>
      </footer>
    </section>
  );
}
