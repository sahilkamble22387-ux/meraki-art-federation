"use client"

/**
 * Meraki — corner CTA strip for the Home pavilion.
 * A slim, screen-readable doorway to the two conversion actions while the
 * banner scroll carries the visual hero. Fades out the moment the visitor
 * starts walking (visibility controlled by TvClient).
 */
import { ARTIST_FORM_URL } from "@/lib/meraki-content"
import { getTvEngine } from "@/components/thevertmenthe/tv-engine"

export function TvCtaStrip({ visible }: { visible: boolean }) {
  const go = (path: string) => {
    getTvEngine()?.navigate(path)
  }

  return (
    <div className={`tv-ctastrip${visible ? "" : " tv-ctastrip_hidden"}`}>
      <a
        href="/sanmanya"
        onClick={(e) => {
          e.preventDefault()
          go("/sanmanya")
        }}
      >
        Explore SANMANYA 2027
      </a>
      <span className="tv-ctastrip_divider" />
      <a
        href={ARTIST_FORM_URL || "/partner"}
        target={ARTIST_FORM_URL ? "_blank" : undefined}
        rel={ARTIST_FORM_URL ? "noreferrer" : undefined}
        onClick={
          ARTIST_FORM_URL
            ? undefined
            : (e) => {
                e.preventDefault()
                go("/partner")
              }
        }
      >
        Apply as an Artist
      </a>
    </div>
  )
}
