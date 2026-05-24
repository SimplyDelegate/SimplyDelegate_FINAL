import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="legal-footer" aria-label="Footer">
      <div className="contact-footer legal-footer__content">
        <div className="contact-footer__inner">
          <div className="contact-footer__links">
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/impressum">Impressum</Link>
          </div>
          <p>SimplyDelegate 2026</p>
        </div>
      </div>
    </footer>
  );
}
