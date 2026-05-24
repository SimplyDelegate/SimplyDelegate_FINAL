"use client";

import Link from "next/link";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

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
      className="contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="contact-section__glow contact-section__glow--violet" />
      <div className="contact-section__glow contact-section__glow--cyan" />

      <div className="contact-section__inner">
        <div className="contact-section__copy">
          <p className="contact-section__eyebrow">Kontakt</p>
          <h2 id="contact-heading">
            <span>Bereit, mehr Kunden über</span>
            <span>Google & KI-Suchen zu gewinnen?</span>
          </h2>
          <p>
            Schreib uns direkt oder buche dein kostenloses Gespräch - ein
            offener Austausch ohne Verpflichtungen.
          </p>
        </div>

        <form
          className={`contact-card contact-card--${contactStep}`}
          onSubmit={handleSubmit}
        >
          <div className="contact-card__header">
            <h3>Kontakt aufnehmen</h3>
          </div>

          {contactStep === "domain" ? (
            <>
              <div className="contact-field">
                <label htmlFor="contact-domain">Domain</label>
                <input
                  id="contact-domain"
                  name="domain"
                  type="text"
                  autoComplete="url"
                  placeholder="deine-website.de"
                  value={form.domain}
                  onChange={updateField("domain")}
                  required
                />
              </div>

              <button className="contact-submit" type="submit">
                <span>Domain prüfen</span>
                <span aria-hidden="true">→</span>
              </button>
            </>
          ) : (
            <>
              <p className="contact-phase-message">
                Wir werden uns so schnell wie möglich bei Ihnen melden.
              </p>

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
                    <label htmlFor="contact-domain">Domain</label>
                    <input
                      id="contact-domain"
                      name="domain"
                      type="text"
                      autoComplete="url"
                      placeholder="deine-website.de"
                      value={form.domain}
                      onChange={updateField("domain")}
                      required
                    />
                  </div>

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
                    className="contact-submit"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>
                      {isSubmitting ? "Wird vorbereitet..." : "Nachricht senden"}
                    </span>
                    <span aria-hidden="true">→</span>
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
