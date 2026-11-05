"use client"

/**
 * Meraki — shared footer for the DOM pages (/sanmanya, /partner).
 * Internal links ride the engine's ink transition.
 */
import { CONTACT } from "@/lib/meraki-content"
import { getTvEngine } from "@/components/gallery3d/tv-engine"

const LINKS = [
  { label: "About Meraki", href: "/about" },
  { label: "SANMANYA 2027 (Phase 2)", href: "/sanmanya" },
  { label: "Artist Portal & Registration", href: "/partner" },
  { label: "Partnership & Sponsorship", href: "/partner" },
]

export function TvFooter() {
  const go = (href: string) => {
    getTvEngine()?.navigate(href)
  }

  return (
    <footer className="tv-footer">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="tv-footer_mark"
          src="/meraki/brand/meraki-logo.png"
          alt="Meraki Art Federation logo"
        />
        <h4 className="tv-footer_brand">Meraki Art Federation</h4>
        <p>{CONTACT.headquarters}</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={(e) => {
              e.preventDefault()
              go(l.href)
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
      <div>
        <h4>Contact Us</h4>
        <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
        <a href={`mailto:${CONTACT.emailInquiries}`}>{CONTACT.emailInquiries}</a>
        <a href={`mailto:${CONTACT.emailPartnerships}`}>{CONTACT.emailPartnerships}</a>
      </div>
      <div className="tv-footer_bottom">
        <span>© {new Date().getFullYear()} Meraki Art Federation. All rights reserved.</span>
        <span className="tv-footer_credit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/meraki/brand/foxbytes-black.png" alt="" />
          Designed by Foxbytes Studios
        </span>
        <span>{CONTACT.headquarters}</span>
      </div>
    </footer>
  )
}
