"use client"

/**
 * Meraki — overlay card opened from the Leadership Pavilion (About room).
 * Resolves two kinds of panels:
 *   - "member:<uid>"  → team portrait card (photo, role, bio)
 *   - any other id    → text panel from ABOUT_PANELS (essence/mission/vision/goals/founder)
 */
import { TEAM, ABOUT_PANELS } from "@/lib/meraki-content"

export function TvInfoCard({ id, onClose }: { id: string; onClose: () => void }) {
  if (id.startsWith("member:")) {
    const uid = id.slice("member:".length)
    const member = TEAM.find((m) => m.uid === uid)
    if (!member) return null
    return (
      <div className="tv-card_backdrop" onClick={onClose}>
        <div className="tv-card" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="tv-card_close" onClick={onClose}>
            close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="tv-card_photo" src={member.photo} alt={member.name} />
          <div className="tv-card_body">
            <p className="tv-card_rank">{member.founder ? "Founder" : member.rank}</p>
            <h3>{member.name}</h3>
            <p className="tv-card_role">{member.role}</p>
            {member.bio.map((p, i) => (
              <p key={i} className={member.founder && i === 0 ? "tv-card_quote" : undefined}>
                {member.founder && i === 0 ? `“${p}”` : p}
              </p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const panel = ABOUT_PANELS[id]
  if (!panel) return null
  return (
    <div className="tv-card_backdrop" onClick={onClose}>
      <div className="tv-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="tv-card_close" onClick={onClose}>
          close
        </button>
        <div className="tv-card_body">
          <p className="tv-card_rank">{panel.kicker}</p>
          <h3>{panel.title}</h3>
          {panel.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 && id === "founder" ? "tv-card_quote" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
