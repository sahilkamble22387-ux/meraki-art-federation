/**
 * Generates elegant placeholder portrait PNGs for the About "Leadership Pavilion"
 * until real team photographs are dropped into public/thevertmenthe/team/.
 * Real photos with the same filenames replace these automatically.
 *
 * Run: node scripts/generate-team-placeholders.mjs
 */
import sharp from "sharp"
import { mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(root, "public", "thevertmenthe", "team")
mkdirSync(outDir, { recursive: true })

const W = 720
const H = 960

const members = [
  { uid: "ayush-bhoyar", initials: "A", name: "Ayush Milind Bhoyar", role: "Founder" },
  { uid: "kalyani-muley", initials: "K", name: "Kalyani Muley", role: "Head of Operations" },
  { uid: "aditya-muley", initials: "A", name: "Aditya Muley", role: "Operations Manager" },
  { uid: "khushali-naidu", initials: "K", name: "Khushali Naidu", role: "Artist & Curator Relations" },
]

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")

const svgFor = (m) => `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="washi" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f2eee5"/>
      <stop offset="0.55" stop-color="#ece7de"/>
      <stop offset="1" stop-color="#e2dccf"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#washi)"/>

  <!-- faint washi paper fibers -->
  <g fill="rgba(100,90,80,0.05)">
    ${Array.from({ length: 140 }, (_, i) => {
      const x = (i * 337) % W
      const y = (i * 541) % H
      return `<rect x="${x}" y="${y}" width="${14 + (i % 5) * 6}" height="2"/>`
    }).join("")}
  </g>

  <!-- diagonal komorebi light -->
  <g opacity="0.5">
    ${Array.from({ length: 6 }, (_, i) => {
      const x = -200 + i * 220
      return `<rect x="${x}" y="-100" width="70" height="${H + 400}" fill="rgba(255,255,255,0.35)" transform="rotate(-32 ${W / 2} ${H / 2})"/>`
    }).join("")}
  </g>

  <!-- ebony outer frame + inner hairline -->
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="#161311" stroke-width="10"/>
  <rect x="38" y="38" width="${W - 76}" height="${H - 76}" fill="none" stroke="rgba(22,19,17,0.35)" stroke-width="2"/>

  <!-- monogram -->
  <text x="${W / 2}" y="${H / 2 - 40}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="300"
        fill="#1a1613" opacity="0.9">${m.initials}</text>
  <text x="${W / 2}" y="${H / 2 + 70}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="34"
        fill="rgba(26,22,19,0.55)">portrait to come</text>

  <!-- name plate -->
  <text x="${W / 2}" y="${H - 130}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="34" letter-spacing="2"
        fill="#1a1613">${m.name.toUpperCase()}</text>
  <text x="${W / 2}" y="${H - 92}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="20" letter-spacing="6"
        fill="rgba(26,22,19,0.6)">${esc(m.role.toUpperCase())}</text>

  <!-- vermillion seal -->
  <rect x="${W - 110}" y="${H - 170}" width="40" height="40" fill="#b71c1c"/>
  <text x="${W - 90}" y="${H - 143}" text-anchor="middle"
        font-family="serif" font-size="20" fill="#ffffff">藝</text>
</svg>
`

for (const m of members) {
  const out = join(outDir, `${m.uid}.png`)
  await sharp(Buffer.from(svgFor(m))).png().toFile(out)
  console.log("wrote", out)
}
