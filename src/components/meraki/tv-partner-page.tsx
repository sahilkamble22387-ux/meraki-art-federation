"use client"

/**
 * Meraki — Partnership & Sponsorship page.
 * Two columns per the copy deck: "As an Artist" | "As a Business".
 * Submission composes a structured email to the partnerships inbox
 * (no backend required; upgrade path is a server action + email API).
 */
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CONTACT, SANMANYA } from "@/lib/meraki-content"
import { getTvEngine } from "@/components/gallery3d/tv-engine"
import { TvFooter } from "./tv-footer"

const DISCIPLINES = ["Fine Art", "Sculpture", "Music", "Dance", "Literature"] as const

const artistSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  city: z.string().min(2, "Please enter your city"),
  discipline: z.enum(DISCIPLINES),
  portfolio: z.string().optional(),
  message: z.string().optional(),
})
type ArtistForm = z.infer<typeof artistSchema>

const businessSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  company: z.string().min(2, "Please enter your company"),
  email: z.email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  intent: z.enum(["Partnership", "Sponsorship"]),
  message: z.string().optional(),
})
type BusinessForm = z.infer<typeof businessSchema>

function mailto(subject: string, lines: string[]) {
  window.location.href = `mailto:${CONTACT.emailPartnerships}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(lines.join("\n"))}`
}

function ArtistColumn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtistForm>({
    resolver: zodResolver(artistSchema),
    defaultValues: { discipline: "Fine Art" },
  })

  const onSubmit = handleSubmit((d) => {
    mailto(
      `[ARTIST APPLICATION] ${d.name} — ${d.discipline}`,
      [
        "New artist application via merakiartfed.com",
        "",
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        `Phone: ${d.phone}`,
        `City: ${d.city}`,
        `Discipline: ${d.discipline}`,
        `Portfolio: ${d.portfolio || "—"}`,
        "",
        "Message:",
        d.message || "—",
      ],
    )
  })

  return (
    <form className="tv-form_card" onSubmit={onSubmit} noValidate>
      <h3>As an Artist</h3>
      <p className="tv-form_sub">
        Apply to exhibit with Meraki — museum-grade infrastructure, collector visibility, and a
        fair payout on every sale.
      </p>

      <label>Full Name</label>
      <input type="text" placeholder="Your name" {...register("name")} />
      {errors.name ? <p className="tv-form_error">{errors.name.message}</p> : null}

      <label>Email</label>
      <input type="email" placeholder="you@example.com" {...register("email")} />
      {errors.email ? <p className="tv-form_error">{errors.email.message}</p> : null}

      <label>Phone / WhatsApp</label>
      <input type="tel" placeholder="+91 …" {...register("phone")} />
      {errors.phone ? <p className="tv-form_error">{errors.phone.message}</p> : null}

      <label>City</label>
      <input type="text" placeholder="Nagpur, Mumbai, …" {...register("city")} />
      {errors.city ? <p className="tv-form_error">{errors.city.message}</p> : null}

      <label>Discipline</label>
      <select {...register("discipline")}>
        {DISCIPLINES.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <label>Portfolio / Instagram link (optional)</label>
      <input type="url" placeholder="https://…" {...register("portfolio")} />

      <label>Message (optional)</label>
      <textarea rows={3} placeholder="Tell us about your work…" {...register("message")} />

      <button type="submit" className="tv-form_submit" disabled={isSubmitting}>
        Submit Application
      </button>
      <p className="tv-form_note">Opens your mail app addressed to {CONTACT.emailPartnerships}.</p>
    </form>
  )
}

function BusinessColumn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessForm>({
    resolver: zodResolver(businessSchema),
    defaultValues: { intent: "Partnership" },
  })

  const onSubmit = handleSubmit((d) => {
    mailto(
      `[${d.intent.toUpperCase()} INQUIRY] ${d.company}`,
      [
        `New ${d.intent.toLowerCase()} inquiry via merakiartfed.com`,
        "",
        `Contact Name: ${d.name}`,
        `Company: ${d.company}`,
        `Email: ${d.email}`,
        `Phone: ${d.phone}`,
        `Intent: ${d.intent}`,
        "",
        "Message:",
        d.message || "—",
      ],
    )
  })

  return (
    <form className="tv-form_card" onSubmit={onSubmit} noValidate>
      <h3>As a Business</h3>
      <p className="tv-form_sub">
        Interested in partnership or sponsorship? Get in touch with Team Meraki below.
      </p>

      <label>Contact Name</label>
      <input type="text" placeholder="Your name" {...register("name")} />
      {errors.name ? <p className="tv-form_error">{errors.name.message}</p> : null}

      <label>Company</label>
      <input type="text" placeholder="Company name" {...register("company")} />
      {errors.company ? <p className="tv-form_error">{errors.company.message}</p> : null}

      <label>Email</label>
      <input type="email" placeholder="you@company.com" {...register("email")} />
      {errors.email ? <p className="tv-form_error">{errors.email.message}</p> : null}

      <label>Phone</label>
      <input type="tel" placeholder="+91 …" {...register("phone")} />
      {errors.phone ? <p className="tv-form_error">{errors.phone.message}</p> : null}

      <label>Intent</label>
      <div className="tv-form_radios">
        <label className="tv-form_radio">
          <input type="radio" value="Partnership" {...register("intent")} />
          Partnership
        </label>
        <label className="tv-form_radio">
          <input type="radio" value="Sponsorship" {...register("intent")} />
          Sponsorship
        </label>
      </div>

      <label>Message (optional)</label>
      <textarea rows={3} placeholder="Tell us about your proposal…" {...register("message")} />

      <button type="submit" className="tv-form_submit" disabled={isSubmitting}>
        Submit Inquiry
      </button>
      <p className="tv-form_note">Opens your mail app addressed to {CONTACT.emailPartnerships}.</p>
    </form>
  )
}

export function TvPartnerPage() {
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
          <p className="tv-doc_kicker">Join the Movement</p>
          <h1>Partner With Meraki</h1>
          <p className="tv-doc_lede">
            Choose your column — apply as an artist, or reach Team Meraki as a business for
            partnership and sponsorship. Submissions reach us directly by email.
          </p>
        </header>

        <div className="tv-form_cols">
          <ArtistColumn />
          <BusinessColumn />
        </div>

        <section className="tv-form_contact">
          <h2>Prefer to talk first?</h2>
          <p>
            Call us at <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a> or write to{" "}
            <a href={`mailto:${CONTACT.emailPartnerships}`}>{CONTACT.emailPartnerships}</a>.
          </p>
        </section>

        <TvFooter />
      </div>
    </div>
  )
}
