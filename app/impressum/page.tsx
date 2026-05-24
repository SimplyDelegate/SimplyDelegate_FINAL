import type { Metadata } from "next";
import { LegalFooter } from "@/components/LegalFooter";
import { StickyNavbar } from "@/components/StickyNavbar";

export const metadata: Metadata = {
  title: "Impressum | SimplyDelegate",
  description: "Rechtliche Anbieterkennzeichnung von SimplyDelegate.",
};

export default function ImpressumPage() {
  return (
    <>
      <StickyNavbar />
      <main className="legal-page">
        <article className="legal-document" aria-labelledby="impressum-heading">
          <header className="legal-document__header">
            <h1 id="impressum-heading">Impressum</h1>
          </header>

        <section className="legal-section" aria-labelledby="ddg-heading">
          <h2 id="ddg-heading">Angaben gemäß § 5 DDG</h2>
          <address className="legal-address">
            David Kien
            <br />
            Sandfahrel 55
            <br />
            27572 Bremerhaven
            <br />
            Deutschland
          </address>
        </section>

        <section className="legal-section" aria-labelledby="kontakt-heading">
          <h2 id="kontakt-heading">Kontakt</h2>
          <p>
            Telefon: <a href="tel:+4917682188278">+49 176 82188278</a>
            <br />
            E-Mail:{" "}
            <a href="mailto:d.kien@simplydelegate.de">
              d.kien@simplydelegate.de
            </a>
          </p>
        </section>

        <section className="legal-section" aria-labelledby="kontaktperson-heading">
          <h2 id="kontaktperson-heading">Weitere Kontaktperson</h2>
          <p>
            Alexander Fuchs
            <br />
            E-Mail:{" "}
            <a href="mailto:a.fuchs@simplydelegate.de">
              a.fuchs@simplydelegate.de
            </a>
          </p>
        </section>

        <section className="legal-section" aria-labelledby="website-heading">
          <h2 id="website-heading">Website</h2>
          <p>
            <a href="https://simplydelegate.de">https://simplydelegate.de</a>
          </p>
        </section>

        <section className="legal-section" aria-labelledby="ust-heading">
          <h2 id="ust-heading">Umsatzsteuer-ID</h2>
          <p>
            Eine Umsatzsteuer-Identifikationsnummer ist derzeit nicht vorhanden.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="register-heading">
          <h2 id="register-heading">Registereintrag</h2>
          <p>Es besteht derzeit kein Registereintrag.</p>
        </section>

        <section className="legal-section" aria-labelledby="inhalt-heading">
          <h2 id="inhalt-heading">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <address className="legal-address">
            David Kien
            <br />
            Sandfahrel 55
            <br />
            27572 Bremerhaven
            <br />
            Deutschland
          </address>
        </section>

        <section className="legal-section" aria-labelledby="streit-heading">
          <h2 id="streit-heading">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung bereit.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="verbraucher-heading">
          <h2 id="verbraucher-heading">Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht verpflichtet und nicht bereit, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>
        </article>
      </main>
      <LegalFooter />
    </>
  );
}
