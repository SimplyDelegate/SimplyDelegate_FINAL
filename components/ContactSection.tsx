"use client";

import Link from "next/link";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { rememberHomeScrollPosition } from "@/lib/historyRestore";

type ContactTopic =
  | "Suchmaschinen-Sichtbarkeit"
  | "KI-Sichtbarkeit"
  | "Webdesign";

type FormState = {
  name: string;
  domain: string;
  email: string;
  topics: ContactTopic[];
};

type SubmitState = {
  tone: "idle" | "success" | "error";
  message: string;
};

const initialFormState: FormState = {
  name: "",
  domain: "",
  email: "",
  topics: [],
};

const contactTopics: ContactTopic[] = [
  "Suchmaschinen-Sichtbarkeit",
  "KI-Sichtbarkeit",
  "Webdesign",
];

export function ContactSection() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitState>({
    tone: "idle",
    message: "",
  });

  const updateField =
    (field: "name" | "domain" | "email") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const toggleTopic = (topic: ContactTopic) => {
    setForm((current) => {
      const isSelected = current.topics.includes(topic);

      return {
        ...current,
        topics: isSelected
          ? current.topics.filter((currentTopic) => currentTopic !== topic)
          : [...current.topics, topic],
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ tone: "idle", message: "" });

    if (!form.topics.length) {
      setStatus({
        tone: "error",
        message: "Bitte wähle mindestens ein Thema aus.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const message = [
        form.domain.trim() ? `Domain: ${form.domain.trim()}` : null,
        `Interesse: ${form.topics.join(", ")}`,
      ]
        .filter(Boolean)
        .join("\n");

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

        <form className="contact-card" onSubmit={handleSubmit}>
          <div className="contact-card__header">
            <h3>Kontakt aufnehmen</h3>
          </div>

          <div className="contact-field-row">
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
              <label htmlFor="contact-domain">Domain</label>
              <input
                id="contact-domain"
                name="domain"
                type="text"
                autoComplete="url"
                placeholder="deine-website.de"
                value={form.domain}
                onChange={updateField("domain")}
              />
            </div>
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

          <fieldset className="contact-field contact-topic-field">
            <legend>Wobei dürfen wir helfen?</legend>
            <div className="contact-topic-options">
              {contactTopics.map((topic) => {
                const isSelected = form.topics.includes(topic);

                return (
                  <button
                    className={`contact-topic-button ${
                      isSelected ? "contact-topic-button--selected" : ""
                    }`}
                    type="button"
                    aria-pressed={isSelected}
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button className="contact-submit" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Wird vorbereitet..." : "Nachricht senden"}</span>
            <span aria-hidden="true">→</span>
          </button>

          <p className="contact-card__note">
            Wir melden uns persönlich zurück. Keine automatisierten Sales-Mails,
            kein Druck.
          </p>

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
