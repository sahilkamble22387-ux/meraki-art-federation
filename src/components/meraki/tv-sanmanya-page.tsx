"use client"

/**
 * Meraki — SANMANYA 2027 (Phase 2) editorial page.
 * White document sheet over the 3D world, matching the artwork pages' language.
 */
import { SANMANYA, SESSIONS, CONTACT, ARTIST_FORM_URL } from "@/lib/meraki-content"
import { getTvEngine } from "@/components/thevertmenthe/tv-engine"
import { TvFooter } from "./tv-footer"

export function TvSanmanyaPage() {
  const go = (path: string) => {
    getTvEngine()?.navigate(path)
  }

  return (
    <div className="tv-doc">
      <button type="button" className="tv-doc_back" onClick={() => go("/")}>
        &lt; Home
      </button>

      <div className="tv-doc_inner">
        <header className="tv-doc_header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="tv-doc_sanmanya_logo"
            src="/thevertmenthe/brand/sanmanya-logo.png"
            alt="SANMANYA — The Dignity of Creation, Phase 2"
          />
          <p className="tv-doc_kicker">Winter Session — Phase 2</p>
          <h1>SANMANYA 2027</h1>
          <p className="tv-doc_lede">
            The Grand Fine Art Showcase &amp; Collector Gala · February 2027 · Chitnavis Centre,
            Nagpur
          </p>
        </header>

        <section>
          <h2>What &ldquo;SANMANYA&rdquo; Means</h2>
          {SANMANYA.meaning.map((p, i) => (
            <p key={i} className={i === 0 ? "tv-doc_strong" : undefined}>
              {p}
            </p>
          ))}
        </section>

        <section>
          <h2>The Heart of Meraki</h2>
          {SANMANYA.heart.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section>
          <h2>Event Details</h2>
          <div className="tv-doc_facts">
            {SANMANYA.facts.map((f) => (
              <div key={f.label} className="tv-doc_fact">
                <span className="tv-doc_fact_label">{f.label}</span>
                <span className="tv-doc_fact_value">{f.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>World-Class Ground Infrastructure</h2>
          {SANMANYA.infrastructure.map((p, i) => (
            <p key={i} className={i === SANMANYA.infrastructure.length - 1 ? "tv-doc_strong" : undefined}>
              {p}
            </p>
          ))}
        </section>

        <section>
          <h2>High Commercial Visibility — 70% Sales Potential</h2>
          <p>{SANMANYA.sales}</p>
        </section>

        <section>
          <h2>Transparent &amp; Fair Commission Structure</h2>
          <div className="tv-doc_commission">
            {SANMANYA.commission.map((c) => (
              <div key={c.tier} className="tv-doc_commission_row">
                <div>
                  <span className="tv-doc_fact_label">{c.tier}</span>
                  <span className="tv-doc_commission_rate">{c.rate}</span>
                </div>
                <p>{c.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>The Two Annual Flagships</h2>
          <div className="tv-doc_sessions">
            {SESSIONS.map((s) => (
              <div key={s.name} className="tv-doc_session">
                <h3>{s.name}</h3>
                <p className="tv-doc_session_tag">{s.tag}</p>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Why Join Meraki?</h2>
          <ol className="tv-doc_values">
            {SANMANYA.valueProps.map((v, i) => (
              <li key={v.title}>
                <span className="tv-doc_value_num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="tv-doc_ctas">
          <button
            type="button"
            className="tv-doc_cta"
            onClick={() => {
              if (ARTIST_FORM_URL) {
                window.open(ARTIST_FORM_URL, "_blank", "noopener")
              } else {
                go("/partner")
              }
            }}
          >
            Apply as an Artist
          </button>
          <button type="button" className="tv-doc_cta tv-doc_cta_ghost" onClick={() => go("/partner")}>
            Partner / Sponsor Meraki
          </button>
          <a className="tv-doc_cta tv-doc_cta_ghost" href={`tel:${CONTACT.phoneHref}`}>
            Call {CONTACT.phone}
          </a>
        </div>

        <TvFooter />
      </div>
    </div>
  )
}
