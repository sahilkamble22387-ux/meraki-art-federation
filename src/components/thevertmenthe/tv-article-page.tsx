"use client"

/**
 * ThevertMenthe — article detail page (DOM layer over the engine).
 * White sheet: title + artwork center, sizes/notes on the left column,
 * contact button bottom-right, prev/next arrows, back to gallery.
 */
import { TV_ARTICLES } from "@/lib/thevertmenthe-articles"
import { getTvEngine } from "./tv-engine"

type TvArticle = (typeof TV_ARTICLES)[number]

export function TvArticlePage({
  article,
  prev,
  next,
}: {
  article: TvArticle
  prev: TvArticle | null
  next: TvArticle | null
}) {
  const go = (path: string) => {
    getTvEngine()?.navigate(path)
  }

  return (
    <div className="tv-article">
      <div className="article_container">
        <div className="article_left">
          <ul className="data_top">
            {article.size ? <li>{article.size}</li> : null}
            {article.technique ? <li>{article.technique}</li> : null}
            {article.year ? <li>{article.year}</li> : null}
            {article.vendu ? <li className="vendu">sold</li> : null}
          </ul>
          <ul className="data_bottom">
            {article.notesTop.map((n, i) => (
              <li key={`t${i}`}>{n}</li>
            ))}
            {article.notesBottom.map((n, i) => (
              <li key={`b${i}`}>{n}</li>
            ))}
          </ul>
        </div>
        <div className="article_mid">
          <h1>{article.title}</h1>
          <img src={article.image} alt={article.title} />
        </div>
        <div className="article_right">
          <button
            className="contact_button"
            onClick={() => {
              const email = "contact@merakiartfed.com"
              const subject = `Inquiry regarding "${article.title}" — Meraki Art Federation`
              const body = `Hello,

I am inquiring regarding the artwork "${article.title}" from the Meraki Art Federation collection.

Kind regards,
`
              window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            }}
          >
            Inquire / Contact
          </button>
        </div>
      </div>

      <button className="article_back" onClick={() => go("/gallery")}>
        &lt; Back
      </button>

      <div className="article_arrows">
        <div className="arrowL">
          {prev ? (
            <a
              href={`/gallery/${prev.uid}`}
              aria-label={prev.title}
              onClick={(e) => {
                e.preventDefault()
                go(`/gallery/${prev.uid}`)
              }}
            />
          ) : null}
        </div>
        <div className="arrowR">
          {next ? (
            <a
              href={`/gallery/${next.uid}`}
              aria-label={next.title}
              onClick={(e) => {
                e.preventDefault()
                go(`/gallery/${next.uid}`)
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
