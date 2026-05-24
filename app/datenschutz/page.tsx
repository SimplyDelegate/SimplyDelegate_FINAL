import type { Metadata } from "next";
import { LegalFooter } from "@/components/LegalFooter";
import { StickyNavbar } from "@/components/StickyNavbar";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | SimplyDelegate",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf simplydelegate.de.",
};

export default function DatenschutzPage() {
  return (
    <>
      <StickyNavbar />
      <main className="legal-page">
        <article className="legal-document" aria-labelledby="datenschutz-heading">
          <header className="legal-document__header">
            <h1 id="datenschutz-heading">Datenschutzerklärung</h1>
          </header>

        <section className="legal-section" aria-labelledby="verantwortlicher-heading">
          <h2 id="verantwortlicher-heading">1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Verarbeitung personenbezogener Daten auf
            dieser Website ist:
          </p>
          <address className="legal-address">
            David Kien
            <br />
            Sandfahrel 55
            <br />
            27572 Bremerhaven
            <br />
            Deutschland
            <br />
            Telefon: <a href="tel:+4917682188278">+49 176 82188278</a>
            <br />
            E-Mail:{" "}
            <a href="mailto:d.kien@simplydelegate.de">
              d.kien@simplydelegate.de
            </a>
          </address>
          <p>
            Weitere Kontaktperson:
            <br />
            Alexander Fuchs
            <br />
            E-Mail:{" "}
            <a href="mailto:a.fuchs@simplydelegate.de">
              a.fuchs@simplydelegate.de
            </a>
          </p>
        </section>

        <section className="legal-section" aria-labelledby="datenverarbeitung-heading">
          <h2 id="datenverarbeitung-heading">
            2. Allgemeine Hinweise zur Datenverarbeitung
          </h2>
          <p>
            Wir verarbeiten personenbezogene Daten nur, soweit dies zur
            Bereitstellung dieser Website, zur Bearbeitung von Anfragen, zur
            Terminbuchung oder zur Analyse der Nutzung unserer Website
            erforderlich ist.
          </p>
          <p>
            Personenbezogene Daten sind alle Informationen, mit denen eine
            natürliche Person identifiziert werden kann oder identifizierbar ist.
            Dazu gehören insbesondere Name, E-Mail-Adresse, Domain, IP-Adresse
            sowie technische Nutzungsdaten.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="vercel-hosting-heading">
          <h2 id="vercel-hosting-heading">3. Hosting über Vercel</h2>
          <p>Diese Website wird über Vercel gehostet.</p>
          <p>Anbieter:</p>
          <address className="legal-address">
            Vercel Inc.
            <br />
            340 S Lemon Ave #4133
            <br />
            Walnut, CA 91789
            <br />
            USA
          </address>
          <p>
            Beim Aufruf der Website verarbeitet Vercel technische Zugriffsdaten.
            Dazu können insbesondere gehören:
          </p>
          <ul className="legal-list">
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Browsertyp und Browserversion</li>
            <li>Betriebssystem</li>
            <li>Referrer-URL</li>
            <li>angefragte Dateien</li>
            <li>technische Server-Logdaten</li>
          </ul>
          <p>
            Die Verarbeitung erfolgt zur sicheren, stabilen und effizienten
            Bereitstellung der Website.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
            Interesse liegt in der technischen Bereitstellung, Sicherheit und
            Optimierung der Website.
          </p>
          <p>
            Vercel stellt ein Data Processing Addendum bereit; dieses gilt nach
            Vercel-Angaben für Kunden in Enterprise- und Pro-Plänen. Prüfe daher
            konkret, ob dein gewählter Vercel-Plan einen AV-Vertrag/DPA umfasst.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="kontaktformular-heading">
          <h2 id="kontaktformular-heading">4. Kontaktformular</h2>
          <p>
            Auf unserer Website befindet sich ein Kontaktformular. Wenn du uns
            über das Formular kontaktierst, verarbeiten wir die von dir
            eingegebenen Daten.
          </p>
          <p>Dabei können insbesondere folgende Daten verarbeitet werden:</p>
          <ul className="legal-list">
            <li>Name</li>
            <li>E-Mail-Adresse</li>
            <li>Domain</li>
            <li>Inhalt der Anfrage</li>
            <li>Zeitpunkt der Übermittlung</li>
            <li>technische Metadaten</li>
          </ul>
          <p>
            Zweck der Verarbeitung ist die Bearbeitung deiner Anfrage, die
            Kontaktaufnahme und gegebenenfalls die Vorbereitung eines
            Vertragsverhältnisses.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn deine Anfrage
            auf den Abschluss oder die Durchführung eines Vertrags gerichtet ist.
            In anderen Fällen ist Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO.
            Unser berechtigtes Interesse liegt in der effizienten Bearbeitung
            von Anfragen.
          </p>
          <p>
            Die Daten werden gelöscht, sobald sie für die Bearbeitung der Anfrage
            nicht mehr erforderlich sind und keine gesetzlichen
            Aufbewahrungspflichten bestehen.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="google-workspace-heading">
          <h2 id="google-workspace-heading">
            5. Verarbeitung über Google Workspace / Google Sheets
          </h2>
          <p>
            Die über das Kontaktformular übermittelten Daten werden in Google
            Sheets gespeichert und verarbeitet.
          </p>
          <p>Anbieter:</p>
          <address className="legal-address">
            Google Ireland Limited
            <br />
            Gordon House
            <br />
            Barrow Street
            <br />
            Dublin 4
            <br />
            Irland
          </address>
          <p>
            Google Sheets wird im Rahmen von Google Workspace genutzt. Google
            stellt für Workspace-Dienste ein Data Processing Addendum bereit.
            Google beschreibt darin, dass personenbezogene Kundendaten im Rahmen
            der Bereitstellung der Dienste verarbeitet werden.
          </p>
          <p>
            Die Verarbeitung erfolgt zur strukturierten Verwaltung und
            Bearbeitung eingehender Kontaktanfragen.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage
            vertragsbezogen ist, ansonsten Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="n8n-heading">
          <h2 id="n8n-heading">6. Automatisierte Benachrichtigung über n8n</h2>
          <p>
            Für interne Benachrichtigungen nutzen wir n8n als self-hosted
            Workflow-Automation.
          </p>
          <p>Die n8n-Instanz wird über DigitalOcean betrieben.</p>
          <p>Anbieter der Hosting-Infrastruktur:</p>
          <address className="legal-address">
            DigitalOcean, LLC
            <br />
            101 6th Avenue
            <br />
            New York, NY 10013
            <br />
            USA
          </address>
          <p>
            Über n8n können Formularinformationen verarbeitet werden, um uns
            automatisch über neue Anfragen zu informieren.
          </p>
          <p>Verarbeitete Daten können insbesondere sein:</p>
          <ul className="legal-list">
            <li>Name</li>
            <li>E-Mail-Adresse</li>
            <li>Domain</li>
            <li>Inhalt der Anfrage</li>
            <li>Zeitpunkt der Anfrage</li>
          </ul>
          <p>
            Die Verarbeitung erfolgt zur effizienten internen Bearbeitung von
            Kontaktanfragen.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
            Interesse liegt in der Automatisierung interner Geschäftsprozesse und
            der schnellen Bearbeitung von Anfragen.
          </p>
          <p>DigitalOcean stellt ein Data Processing Agreement bereit.</p>
        </section>

        <section className="legal-section" aria-labelledby="vercel-analytics-heading">
          <h2 id="vercel-analytics-heading">7. Vercel Analytics</h2>
          <p>
            Wir nutzen Vercel Web Analytics, um die Nutzung unserer Website
            statistisch auszuwerten.
          </p>
          <p>
            Vercel Web Analytics verwendet nach Angaben von Vercel keine
            Drittanbieter-Cookies. Besucher werden stattdessen über einen Hash
            aus der eingehenden Anfrage identifiziert; eine Besuchersitzung wird
            laut Vercel nicht dauerhaft gespeichert und nach 24 Stunden
            verworfen.
          </p>
          <p>Verarbeitete Daten können insbesondere sein:</p>
          <ul className="legal-list">
            <li>Seitenaufrufe</li>
            <li>Referrer</li>
            <li>Gerätetyp</li>
            <li>Browserinformationen</li>
            <li>ungefährer Standort</li>
            <li>technische Zugriffsdaten</li>
          </ul>
          <p>Zweck der Verarbeitung ist die Analyse und Verbesserung der Website.</p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
            Interesse liegt in der statistischen Auswertung und Optimierung
            unserer Website.
          </p>
          <p>
            Da Vercel Analytics nach Anbieterangaben ohne Cookies arbeitet, ist
            nach aktueller Einschätzung keine Cookie-Einwilligung allein wegen
            Vercel Analytics erforderlich. Trotzdem muss der Einsatz in der
            Datenschutzerklärung genannt werden.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="calendly-heading">
          <h2 id="calendly-heading">8. Terminbuchung über Calendly</h2>
          <p>Auf unserer Website ist Calendly zur Terminbuchung eingebunden.</p>
          <p>Anbieter:</p>
          <address className="legal-address">
            Calendly, LLC
            <br />
            115 E Main St., Ste A1B
            <br />
            Buford, GA 30518
            <br />
            USA
          </address>
          <p>
            Wenn du den eingebetteten Calendly-Kalender nutzt, werden
            personenbezogene Daten an Calendly übermittelt. Dazu können
            insbesondere gehören:
          </p>
          <ul className="legal-list">
            <li>Name</li>
            <li>E-Mail-Adresse</li>
            <li>gebuchter Termin</li>
            <li>eingegebene Nachrichten</li>
            <li>IP-Adresse</li>
            <li>Browser- und Gerätedaten</li>
            <li>Kalender- und Verfügbarkeitsdaten, soweit relevant</li>
          </ul>
          <p>Zweck der Verarbeitung ist die einfache Online-Terminbuchung.</p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern die
            Terminbuchung zur Vertragsanbahnung erfolgt. Zusätzlich kann Art. 6
            Abs. 1 lit. f DSGVO einschlägig sein, da wir ein berechtigtes
            Interesse an einer effizienten Terminverwaltung haben.
          </p>
          <p>Calendly stellt ein Data Processing Addendum bereit.</p>
        </section>

        <section className="legal-section" aria-labelledby="cookies-heading">
          <h2 id="cookies-heading">9. Cookies und Einwilligungsverwaltung</h2>
          <p>
            Unsere Website kann technisch notwendige Cookies oder vergleichbare
            Technologien verwenden. Diese sind erforderlich, damit die Website
            technisch funktioniert.
          </p>
          <p>Für technisch notwendige Cookies ist keine Einwilligung erforderlich.</p>
          <p>
            Calendly setzt nach eigener Dokumentation Cookies bei eingebetteten
            Kalendern. Calendly zeigt bei Embeds standardmäßig ein Cookie-Banner.
            Wenn dieses Banner ausgeblendet wird, muss die Website selbst die
            Cookie-Präferenzen verwalten und Calendly erst nach Zustimmung laden.
          </p>
          <p>
            Daher sollte Calendly auf dieser Website erst nach aktiver Zustimmung
            des Nutzers geladen werden.
          </p>
          <p>Empfohlener Hinweis vor dem Laden von Calendly:</p>
          <div className="legal-callout">
            <p>Terminbuchung über Calendly</p>
            <p>
              Zur Anzeige des Buchungskalenders wird Calendly geladen. Dabei
              können personenbezogene Daten und Cookies an Calendly übermittelt
              werden.
            </p>
            <p>[Calendly laden]</p>
          </div>
          <p>
            Erst nach Klick auf „Calendly laden“ sollte das Calendly-Embed
            technisch eingebunden werden.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="speicherdauer-heading">
          <h2 id="speicherdauer-heading">10. Speicherdauer</h2>
          <p>
            Wir speichern personenbezogene Daten nur so lange, wie es für die
            jeweiligen Zwecke erforderlich ist.
          </p>
          <p>
            Kontaktanfragen werden gelöscht, wenn sie abschließend bearbeitet
            wurden und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
          <p>
            Geschäftliche Kommunikation kann aufgrund gesetzlicher
            Aufbewahrungspflichten länger gespeichert werden.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="empfaenger-heading">
          <h2 id="empfaenger-heading">11. Empfänger personenbezogener Daten</h2>
          <p>
            Im Rahmen des Betriebs dieser Website können personenbezogene Daten
            an folgende Dienstleister übermittelt werden:
          </p>
          <ul className="legal-list">
            <li>Vercel, Hosting und Website-Bereitstellung</li>
            <li>
              Google Workspace / Google Sheets, Speicherung und Bearbeitung von
              Kontaktanfragen
            </li>
            <li>DigitalOcean, Hosting der self-hosted n8n-Instanz</li>
            <li>Calendly, Terminbuchung</li>
            <li>n8n, interne Workflow-Automatisierung</li>
          </ul>
        </section>

        <section className="legal-section" aria-labelledby="drittland-heading">
          <h2 id="drittland-heading">12. Drittlandübermittlungen</h2>
          <p>
            Einige der eingesetzten Dienstleister haben Sitz in den USA oder
            können personenbezogene Daten in den USA verarbeiten.
          </p>
          <p>
            Bei Datenübermittlungen in Drittländer stützen wir uns, soweit
            erforderlich, auf geeignete Garantien nach Art. 44 ff. DSGVO,
            insbesondere Angemessenheitsbeschlüsse, Standardvertragsklauseln oder
            sonstige verfügbare datenschutzrechtliche Mechanismen.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="rechte-heading">
          <h2 id="rechte-heading">13. Rechte der betroffenen Personen</h2>
          <p>Du hast im Rahmen der gesetzlichen Voraussetzungen folgende Rechte:</p>
          <ul className="legal-list">
            <li>Recht auf Auskunft</li>
            <li>Recht auf Berichtigung</li>
            <li>Recht auf Löschung</li>
            <li>Recht auf Einschränkung der Verarbeitung</li>
            <li>Recht auf Datenübertragbarkeit</li>
            <li>Recht auf Widerspruch gegen bestimmte Verarbeitungen</li>
            <li>Recht auf Widerruf einer erteilten Einwilligung</li>
          </ul>
          <p>
            Zur Ausübung deiner Rechte kannst du uns unter{" "}
            <a href="mailto:d.kien@simplydelegate.de">
              d.kien@simplydelegate.de
            </a>{" "}
            kontaktieren.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="beschwerde-heading">
          <h2 id="beschwerde-heading">
            14. Beschwerderecht bei einer Aufsichtsbehörde
          </h2>
          <p>
            Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu
            beschweren, wenn du der Ansicht bist, dass die Verarbeitung deiner
            personenbezogenen Daten gegen Datenschutzrecht verstößt.
          </p>
          <p>
            Zuständig kann insbesondere die Datenschutzaufsichtsbehörde deines
            Wohnorts oder unseres Unternehmenssitzes sein.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="aenderung-heading">
          <h2 id="aenderung-heading">15. Änderung dieser Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn
            sich technische, rechtliche oder organisatorische Änderungen ergeben.
          </p>
          <p>Stand: Mai 2026</p>
        </section>
        </article>
      </main>
      <LegalFooter />
    </>
  );
}
