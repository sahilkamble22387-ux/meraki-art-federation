"use client"

import * as THREE from "three"
import { HERO } from "@/lib/meraki-content"

/**
 * Japanese Sukiya Tea-House & Zen Art Pavilion Theme Generator.
 * Faithful reproduction of the serene, monochromatic Japanese pavilion aesthetic:
 * - Pale natural rush straw Tatami mats with midnight-charcoal Heri cloth borders
 * - Deep smoked ebony / Yakisugi timber floorboards & framing
 * - Textured pale cream Washi plaster with soft slanting diagonal sunlight (Komorebi)
 * - Beautiful botanical Sakura cherry blossom tree branches with detailed SVGs
 * - Low dark timber bench with sculpted miniature Bonsai pine tree
 * - Traditional Tokonoma alcove with Sumi-e mountain hanging scroll
 * - Muted, serene natural museum lighting (zero harsh yellow/orange emissive glow)
 */

// ============================================================================
// 1. Procedural Texture Generators
// ============================================================================

/**
 * Creates deep smoked ebony / Yakisugi timber floor textures.
 * Matches the dark wood borders and floorboards in the reference photograph.
 */
export function createHinokiWoodTextures(): {
  colorMap: THREE.CanvasTexture
  roughnessMap: THREE.CanvasTexture
} {
  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!

  // Deep dark charcoal-brown smoked timber base
  ctx.fillStyle = "#1a1613"
  ctx.fillRect(0, 0, size, size)

  const numPlanks = 8
  const plankWidth = size / numPlanks

  // Subtle tonal variations between smoked cedar planks
  const plankShades = [
    "#1e1916",
    "#181512",
    "#221d19",
    "#171411",
    "#201b17",
    "#191512",
    "#1d1815",
    "#161310",
  ]

  for (let p = 0; p < numPlanks; p++) {
    const px = p * plankWidth
    ctx.fillStyle = plankShades[p % plankShades.length]
    ctx.fillRect(px, 0, plankWidth, size)

    // Longitudinal fine timber grain
    ctx.save()
    ctx.beginPath()
    ctx.rect(px, 0, plankWidth, size)
    ctx.clip()

    for (let g = 0; g < 36; g++) {
      const alpha = 0.04 + Math.sin(p + g * 0.5) * 0.02
      ctx.strokeStyle = g % 2 === 0 ? `rgba(10, 8, 6, ${alpha})` : `rgba(70, 60, 52, ${alpha})`
      ctx.lineWidth = 1 + (g % 3)

      ctx.beginPath()
      ctx.moveTo(px, 0)
      for (let y = 0; y <= size; y += 40) {
        const offset = Math.sin((y + p * 120) * 0.012) * (12 + (p % 3) * 5)
        ctx.lineTo(px + plankWidth * 0.5 + offset, y)
      }
      ctx.stroke()
    }
    ctx.restore()

    // Clean dark seam groove between planks
    ctx.fillStyle = "#0c0a08"
    ctx.fillRect(px, 0, 2, size)
    ctx.fillStyle = "rgba(80, 70, 60, 0.12)"
    ctx.fillRect(px + 2, 0, 1, size)
  }

  const colorMap = new THREE.CanvasTexture(canvas)
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping
  colorMap.colorSpace = THREE.SRGBColorSpace
  colorMap.repeat.set(1.5, 4)

  // Roughness Map (subtle satin sheen with matte seams)
  const rCanvas = document.createElement("canvas")
  rCanvas.width = rCanvas.height = size
  const rCtx = rCanvas.getContext("2d")!
  rCtx.fillStyle = "#707070" // smooth satin timber
  rCtx.fillRect(0, 0, size, size)
  for (let p = 0; p < numPlanks; p++) {
    rCtx.fillStyle = "#c0c0c0" // rough seams
    rCtx.fillRect(p * plankWidth, 0, 3, size)
  }
  const roughnessMap = new THREE.CanvasTexture(rCanvas)
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping
  roughnessMap.repeat.set(1.5, 4)

  return { colorMap, roughnessMap }
}

/**
 * Creates authentic borderless Ryukyu Tatami (縁無し畳) mat texture.
 * Completely free of any dark/black borders; continuous natural pale rush straw weave.
 */
export function createTatamiTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!

  // Warm, natural pale dried rush straw base (clean, bright, zero black)
  ctx.fillStyle = "#ded8cb"
  ctx.fillRect(0, 0, size, size)

  // Natural subtle woven Igusa cords in soft organic straw tones
  const cords = 128
  const cordHeight = size / cords
  for (let c = 0; c < cords; c++) {
    const y = c * cordHeight
    const tone = c % 2 === 0 ? "rgba(185, 178, 166, 0.22)" : "rgba(248, 245, 239, 0.35)"
    ctx.fillStyle = tone
    ctx.fillRect(0, y, size, cordHeight * 0.5)

    // Delicate micro-weave fiber variations in soft warm straw tones
    ctx.fillStyle = "rgba(170, 162, 150, 0.12)"
    for (let x = 0; x < size; x += 16) {
      if ((x / 16 + c) % 2 === 0) {
        ctx.fillRect(x, y, 8, cordHeight)
      }
    }
  }

  // Soft natural mat seam crease along edges (warm muted straw tone, zero black)
  ctx.fillStyle = "rgba(165, 156, 142, 0.22)"
  ctx.fillRect(0, 0, 3, size)
  ctx.fillRect(size - 3, 0, 3, size)
  ctx.fillStyle = "rgba(255, 252, 246, 0.3)"
  ctx.fillRect(3, 0, 2, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Creates textured pale cream Washi plaster with soft diagonal slanting sunlight shadows (Komorebi).
 * Directly recreates the natural light streaks and shadows on the wall in the reference photo.
 */
export function createWashiPlasterTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!

  // 1. Soft neutral washi cream plaster base (matches reference photo #ece7de)
  ctx.fillStyle = "#ece7de"
  ctx.fillRect(0, 0, size, size)

  // 2. Micro paper fibers (Unryu-shi)
  ctx.fillStyle = "rgba(100, 90, 80, 0.05)"
  for (let i = 0; i < 900; i++) {
    const rx = Math.random() * size
    const ry = Math.random() * size
    const rw = 4 + Math.random() * 22
    const rh = 1 + Math.random() * 2
    ctx.fillRect(rx, ry, rw, rh)
  }

  // 3. Diagonal sunlight streaks (Komorebi / 木漏れ日) angled across the plaster
  ctx.save()
  ctx.translate(size / 2, size / 2)
  ctx.rotate(-0.55) // ~32 degrees diagonal sunlight angle
  ctx.translate(-size, -size)

  // Soft light and shadow bands
  for (let x = -size; x < size * 3; x += 150) {
    // Soft diagonal light streak
    const grad = ctx.createLinearGradient(x, 0, x + 85, 0)
    grad.addColorStop(0, "rgba(255, 255, 255, 0)")
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.16)")
    grad.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = grad
    ctx.fillRect(x, -size, 85, size * 4)

    // Subtle soft diagonal shadow streak
    const sGrad = ctx.createLinearGradient(x + 85, 0, x + 150, 0)
    sGrad.addColorStop(0, "rgba(40, 35, 30, 0)")
    sGrad.addColorStop(0.5, "rgba(40, 35, 30, 0.04)")
    sGrad.addColorStop(1, "rgba(40, 35, 30, 0)")
    ctx.fillStyle = sGrad
    ctx.fillRect(x + 85, -size, 65, size * 4)
  }
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Creates clean, neutral Shoji & Kumiko wood lattice grid texture.
 */
export function createShojiLatticeTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!

  // Clean neutral Washi paper background
  ctx.fillStyle = "#f6f3ec"
  ctx.fillRect(0, 0, size, size)

  // Paper cloud fibers
  ctx.fillStyle = "rgba(180, 170, 155, 0.12)"
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * size
    const ry = Math.random() * size
    const rw = 10 + Math.random() * 30
    const rh = 1 + Math.random() * 3
    ctx.fillRect(rx, ry, rw, rh)
  }

  // Slender dark ebony Kumiko grid bars
  const cols = 6
  const rows = 12
  const colW = size / cols
  const rowH = size / rows

  ctx.strokeStyle = "#1b1714"
  ctx.lineWidth = 14

  // Outer framing
  ctx.strokeRect(0, 0, size, size)

  // Vertical struts
  for (let c = 1; c < cols; c++) {
    ctx.beginPath()
    ctx.moveTo(c * colW, 0)
    ctx.lineTo(c * colW, size)
    ctx.stroke()
  }

  // Horizontal struts
  ctx.lineWidth = 10
  for (let r = 1; r < rows; r++) {
    ctx.beginPath()
    ctx.moveTo(0, r * rowH)
    ctx.lineTo(size, r * rowH)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.repeat.set(4, 2)
  return texture
}

/**
 * Meraki hero banner — the home pavilion's Tokonoma kakejiku scroll carrying
 * the site headline, sub-headline, the two call-to-action buttons and the
 * trust badges. The CTA rectangles are exported in UV space so the engine can
 * raycast clicks against them.
 */
export type HeroBannerCta = {
  id: "sanmanya" | "apply"
  u0: number
  u1: number
  v0: number
  v1: number
}

const BANNER_W = 3072
const BANNER_H = 1536
const BANNER_CTA_W = 1100
const BANNER_CTA_H = 180
const BANNER_CTA_GAP = 160
const BANNER_CTA_X = (BANNER_W - (BANNER_CTA_W * 2 + BANNER_CTA_GAP)) / 2
const BANNER_CTA_Y = 990

/** CTA rectangles in banner UV space (v measured from the bottom) — mirrors the drawn buttons. */
export const HERO_BANNER_CTAS: HeroBannerCta[] = (() => {
  const uvY1 = (y: number) => 1 - y / BANNER_H
  const x1 = BANNER_CTA_X
  const x2 = BANNER_CTA_X + BANNER_CTA_W + BANNER_CTA_GAP
  return [
    {
      id: "sanmanya",
      u0: x1 / BANNER_W,
      u1: (x1 + BANNER_CTA_W) / BANNER_W,
      v0: uvY1(BANNER_CTA_Y + BANNER_CTA_H),
      v1: uvY1(BANNER_CTA_Y),
    },
    {
      id: "apply",
      u0: x2 / BANNER_W,
      u1: (x2 + BANNER_CTA_W) / BANNER_W,
      v0: uvY1(BANNER_CTA_Y + BANNER_CTA_H),
      v1: uvY1(BANNER_CTA_Y),
    },
  ]
})()

export function createHeroScrollTexture(
  logo?: HTMLImageElement | null,
): {
  texture: THREE.CanvasTexture
  ctas: HeroBannerCta[]
} {
  const w = BANNER_W
  const h = BANNER_H
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!

  // 1. Brocade Silk Mounting Background (Deep indigo Ten & Chi)
  ctx.fillStyle = "#181a1f"
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = "rgba(140, 130, 115, 0.15)"
  for (let y = 0; y < h; y += 32) {
    for (let x = 0; x < w; x += 32) {
      if ((x + y) % 64 === 0) {
        ctx.fillRect(x + 14, y + 14, 4, 4)
      }
    }
  }

  // 2. Mounting borders + Ichimonji ribbons
  const marginX = 110
  const topTenH = 110
  const bottomChiH = 120
  const artX = marginX
  const artY = topTenH
  const artW = w - marginX * 2
  const artH = h - topTenH - bottomChiH
  const cx = artX + artW * 0.5

  ctx.fillStyle = "#222528"
  ctx.fillRect(artX - 20, artY - 24, artW + 40, artH + 48)
  ctx.fillStyle = "#8a7a60"
  ctx.fillRect(artX - 20, artY - 24, artW + 40, 8)
  ctx.fillRect(artX - 20, artY + artH + 16, artW + 40, 8)

  // 3. Parchment field
  const artGrad = ctx.createLinearGradient(0, artY, 0, artY + artH)
  artGrad.addColorStop(0, "#f8f5ed")
  artGrad.addColorStop(0.7, "#f2eee4")
  artGrad.addColorStop(1, "#e8e1d2")
  ctx.fillStyle = artGrad
  ctx.fillRect(artX, artY, artW, artH)

  ctx.save()
  ctx.beginPath()
  ctx.rect(artX, artY, artW, artH)
  ctx.clip()

  ctx.textAlign = "center"

  // 4. Organization kicker
  ctx.fillStyle = "rgba(50, 45, 40, 0.75)"
  ctx.font = "600 40px -apple-system, BlinkMacSystemFont, sans-serif"
  ctx.fillText("M E R A K I   A R T   F E D E R A T I O N", cx, artY + 130)

  // 5. Headline — two lines across the full width
  const headline = [HERO.headlineA.toUpperCase(), HERO.headlineB.toUpperCase()]
  const headSize = 175
  ctx.fillStyle = "rgba(15, 15, 18, 0.94)"
  ctx.font = `bold ${headSize}px 'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif`
  let ty = artY + 390
  for (const line of headline) {
    ctx.fillText(line, cx, ty)
    ty += headSize * 1.32
  }

  // 6. Sub-headline
  const wrapText = (text: string, font: string, maxWidth: number) => {
    ctx.font = font
    const words = text.split(" ")
    const lines: string[] = []
    let line = ""
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
    return lines
  }
  const subFont = "italic 38px 'Times New Roman', Georgia, serif"
  ty = artY + 740
  ctx.fillStyle = "rgba(40, 36, 32, 0.85)"
  for (const line of wrapText(HERO.sub, subFont, artW - 260)) {
    ctx.fillText(line, cx, ty)
    ty += 60
  }

  // 7. Call-to-action buttons, side by side (rects exported for click hit-testing)
  const ctaY = BANNER_CTA_Y
  const drawCta = (x: number, label: string, solid: boolean) => {
    if (solid) {
      ctx.fillStyle = "#14100d"
      ctx.fillRect(x, ctaY, BANNER_CTA_W, BANNER_CTA_H)
      ctx.strokeStyle = "rgba(242, 237, 228, 0.4)"
      ctx.lineWidth = 2
      ctx.strokeRect(x + 10, ctaY + 10, BANNER_CTA_W - 20, BANNER_CTA_H - 20)
      ctx.fillStyle = "#f2ede4"
    } else {
      ctx.fillStyle = "rgba(20, 16, 13, 0.06)"
      ctx.fillRect(x, ctaY, BANNER_CTA_W, BANNER_CTA_H)
      ctx.strokeStyle = "#14100d"
      ctx.lineWidth = 5
      ctx.strokeRect(x, ctaY, BANNER_CTA_W, BANNER_CTA_H)
      ctx.strokeStyle = "rgba(20, 16, 13, 0.35)"
      ctx.lineWidth = 2
      ctx.strokeRect(x + 10, ctaY + 10, BANNER_CTA_W - 20, BANNER_CTA_H - 20)
      ctx.fillStyle = "#14100d"
    }
    ctx.font = "bold 52px -apple-system, BlinkMacSystemFont, sans-serif"
    ctx.fillText(label, x + BANNER_CTA_W * 0.5, ctaY + BANNER_CTA_H * 0.5 + 18)
  }
  drawCta(BANNER_CTA_X, "E X P L O R E   S A N M A N Y A   2 0 2 7", true)
  drawCta(BANNER_CTA_X + BANNER_CTA_W + BANNER_CTA_GAP, "A P P L Y   A S   A N   A R T I S T", false)

  // 8. Trust badges in a row of four
  const badgeY = ctaY + BANNER_CTA_H + 90
  ctx.strokeStyle = "rgba(26, 22, 19, 0.22)"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(artX + 60, badgeY)
  ctx.lineTo(artX + artW - 60, badgeY)
  ctx.stroke()
  const cellW = artW / HERO.badges.length
  HERO.badges.forEach((b, i) => {
    const cellCx = artX + cellW * (i + 0.5)
    ctx.fillStyle = "rgba(15, 15, 18, 0.92)"
    ctx.font = "bold 42px -apple-system, BlinkMacSystemFont, sans-serif"
    ctx.fillText(b.stat.toUpperCase(), cellCx, badgeY + 72)
    ctx.fillStyle = "rgba(50, 45, 40, 0.65)"
    ctx.font = "italic 30px 'Times New Roman', Georgia, serif"
    ctx.fillText(b.note, cellCx, badgeY + 124)
  })

  // 9. Vermilion Hanko seal — bottom-left of the field
  ctx.fillStyle = "#b71c1c"
  ctx.fillRect(artX + 40, artY + artH - 104, 64, 64)
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 3
  ctx.strokeRect(artX + 46, artY + artH - 98, 52, 52)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 28px serif"
  ctx.fillText("美", artX + 72, artY + artH - 61)

  ctx.restore()

  // 10. Hanging ribbons (Fūtai)
  ctx.fillStyle = "#181a1f"
  ctx.fillRect(artX + artW * 0.1, 0, 24, topTenH + 60)
  ctx.fillRect(artX + artW * 0.9 - 24, 0, 24, topTenH + 60)

  // 11. Maker's mark in the bottom mounting band — Designed by Foxbytes Studios
  if (logo) {
    const lw = 42
    const lh = Math.round((logo.naturalHeight / logo.naturalWidth) * lw)
    const off = document.createElement("canvas")
    off.width = lw
    off.height = lh
    const octx = off.getContext("2d")!
    octx.drawImage(logo, 0, 0, lw, lh)
    const img = octx.getImageData(0, 0, lw, lh)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      d[i + 3] = Math.max(d[i], d[i + 1], d[i + 2])
    }
    octx.putImageData(img, 0, 0)

    const mark = "A N   E X P E R I E N C E   B Y   F O X B Y T E S   S T U D I O S"
    ctx.font = "600 26px -apple-system, BlinkMacSystemFont, sans-serif"
    const markW = ctx.measureText(mark).width
    const markRight = w - 150
    const baseline = h - bottomChiH * 0.5 + 10
    ctx.fillStyle = "rgba(207, 201, 190, 0.7)"
    ctx.textAlign = "right"
    ctx.fillText(mark, markRight, baseline)
    ctx.drawImage(off, markRight - markW - 26 - lw, baseline - lh + 7)
    ctx.textAlign = "center"
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  return { texture, ctas: HERO_BANNER_CTAS }
}

/**
 * Creates traditional Kakejiku (掛け軸) hanging scroll artwork with ink-wash mountain painting.
 */
export function createKakejikuTexture(): THREE.CanvasTexture {
  const w = 1024
  const h = 2048
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!

  // 1. Brocade Silk Mounting Background (Deep indigo Ten & Chi)
  ctx.fillStyle = "#181a1f"
  ctx.fillRect(0, 0, w, h)

  // Subtle woven diamond texture
  ctx.fillStyle = "rgba(140, 130, 115, 0.15)"
  for (let y = 0; y < h; y += 32) {
    for (let x = 0; x < w; x += 32) {
      if ((x + y) % 64 === 0) {
        ctx.fillRect(x + 14, y + 14, 4, 4)
      }
    }
  }

  // 2. Middle pillars (Chūberi)
  const marginX = 96
  const topTenH = 340
  const bottomChiH = 360
  const artX = marginX
  const artY = topTenH
  const artW = w - marginX * 2
  const artH = h - topTenH - bottomChiH

  // Dark slate-grey silk border
  ctx.fillStyle = "#222528"
  ctx.fillRect(marginX - 20, topTenH - 24, artW + 40, artH + 48)

  // Subtle ribbon strip (Ichimonji)
  ctx.fillStyle = "#8a7a60"
  ctx.fillRect(marginX - 20, topTenH - 24, artW + 40, 8)
  ctx.fillRect(marginX - 20, topTenH + artH + 16, artW + 40, 8)

  // 3. Central Artwork Field (Honji) - Aged parchment
  const artGrad = ctx.createLinearGradient(0, artY, 0, artY + artH)
  artGrad.addColorStop(0, "#f8f5ed")
  artGrad.addColorStop(0.7, "#f2eee4")
  artGrad.addColorStop(1, "#e8e1d2")
  ctx.fillStyle = artGrad
  ctx.fillRect(artX, artY, artW, artH)

  // 4. Sumi-e Japanese Ink Wash Painting
  ctx.save()
  ctx.beginPath()
  ctx.rect(artX, artY, artW, artH)
  ctx.clip()

  // Distant mountain ridge (pale ink wash)
  ctx.fillStyle = "rgba(80, 85, 90, 0.22)"
  ctx.beginPath()
  ctx.moveTo(artX, artY + artH * 0.55)
  ctx.bezierCurveTo(
    artX + artW * 0.25,
    artY + artH * 0.35,
    artX + artW * 0.65,
    artY + artH * 0.42,
    artX + artW,
    artY + artH * 0.5,
  )
  ctx.lineTo(artX + artW, artY + artH)
  ctx.lineTo(artX, artY + artH)
  ctx.closePath()
  ctx.fill()

  // Midground mountain peaks (deeper sumi ink)
  ctx.fillStyle = "rgba(40, 45, 50, 0.45)"
  ctx.beginPath()
  ctx.moveTo(artX, artY + artH * 0.68)
  ctx.bezierCurveTo(
    artX + artW * 0.3,
    artY + artH * 0.48,
    artX + artW * 0.55,
    artY + artH * 0.6,
    artX + artW,
    artY + artH * 0.62,
  )
  ctx.lineTo(artX + artW, artY + artH)
  ctx.lineTo(artX, artY + artH)
  ctx.closePath()
  ctx.fill()

  // Foreground pine silhouette (dark sumi ink)
  ctx.fillStyle = "rgba(18, 20, 22, 0.88)"
  ctx.beginPath()
  ctx.moveTo(artX, artY + artH * 0.85)
  ctx.quadraticCurveTo(artX + artW * 0.35, artY + artH * 0.72, artX + artW * 0.5, artY + artH)
  ctx.lineTo(artX, artY + artH)
  ctx.closePath()
  ctx.fill()

  // Pine tree trunk
  ctx.lineWidth = 14
  ctx.strokeStyle = "rgba(18, 20, 22, 0.85)"
  ctx.beginPath()
  ctx.moveTo(artX + 50, artY + artH * 0.82)
  ctx.bezierCurveTo(
    artX + 110,
    artY + artH * 0.7,
    artX + 130,
    artY + artH * 0.62,
    artX + 220,
    artY + artH * 0.56,
  )
  ctx.stroke()

  // Pine needles
  ctx.fillStyle = "rgba(22, 26, 24, 0.8)"
  const drawNeedles = (cx: number, cy: number, r: number) => {
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI * 0.8, Math.PI * 1.9)
    ctx.fill()
  }
  drawNeedles(artX + 160, artY + artH * 0.62, 38)
  drawNeedles(artX + 220, artY + artH * 0.56, 46)
  drawNeedles(artX + 270, artY + artH * 0.53, 34)

  // Moon disc in the mist
  ctx.fillStyle = "rgba(160, 150, 140, 0.28)"
  ctx.beginPath()
  ctx.arc(artX + artW * 0.72, artY + artH * 0.32, 54, 0, Math.PI * 2)
  ctx.fill()

  // 5. Japanese Calligraphy (Shodō)
  ctx.fillStyle = "rgba(15, 15, 18, 0.92)"
  ctx.font = "bold 68px 'Hiragino Mincho ProN', 'Yu Mincho', serif"
  ctx.textAlign = "center"

  const textX = artX + artW * 0.72
  ctx.fillText("美", textX, artY + artH * 0.48)
  ctx.fillText("魂", textX, artY + artH * 0.55)
  ctx.fillText("創", textX, artY + artH * 0.62)

  // Secondary inscription
  ctx.font = "32px 'Hiragino Mincho ProN', 'Yu Mincho', serif"
  const subX = artX + artW * 0.82
  ctx.fillText("和", subX, artY + artH * 0.48)
  ctx.fillText("敬", subX, artY + artH * 0.53)
  ctx.fillText("清", subX, artY + artH * 0.58)
  ctx.fillText("寂", subX, artY + artH * 0.63)

  // English subtitling beneath
  ctx.font = "italic 22px 'Times New Roman', serif"
  ctx.fillStyle = "rgba(50, 45, 40, 0.75)"
  ctx.fillText("MERAKI ART FEDERATION", artX + artW * 0.5, artY + artH * 0.92)

  // 6. Vermilion Red Hanko Seal Stamp
  const sealX = subX - 18
  const sealY = artY + artH * 0.68
  ctx.fillStyle = "#b71c1c"
  ctx.fillRect(sealX, sealY, 36, 36)
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 2
  ctx.strokeRect(sealX + 3, sealY + 3, 30, 30)
  ctx.font = "bold 16px sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.fillText("藝術", sealX + 18, sealY + 24)

  ctx.restore()

  // Hanging ribbons (Fūtai)
  ctx.fillStyle = "#181a1f"
  ctx.fillRect(artX + artW * 0.22, 0, 24, topTenH + 60)
  ctx.fillRect(artX + artW * 0.78, 0, 24, topTenH + 60)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Creates Japanese wooden directional signs for corridor navigation.
 */
export function createJapaneseSignTexture(
  kanji: string,
  english: string,
  arrow: "left" | "right" | "none" = "none",
): THREE.CanvasTexture {
  const w = 512
  const h = 256
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!

  // Deep dark timber plaque background
  ctx.fillStyle = "#1c1815"
  ctx.fillRect(0, 0, w, h)

  // Wood grain
  ctx.fillStyle = "rgba(40, 35, 30, 0.4)"
  for (let y = 0; y < h; y += 12) {
    ctx.fillRect(0, y, w, 4)
  }

  // Border frame
  ctx.strokeStyle = "#0e0c0a"
  ctx.lineWidth = 10
  ctx.strokeRect(0, 0, w, h)

  // Inner subtle hairline
  ctx.strokeStyle = "rgba(160, 150, 135, 0.35)"
  ctx.lineWidth = 1.5
  ctx.strokeRect(12, 12, w - 24, h - 24)

  // Calligraphy
  ctx.fillStyle = "#f2ede4"
  ctx.font = "bold 64px 'Hiragino Mincho ProN', 'Yu Mincho', serif"
  ctx.textAlign = "center"
  ctx.fillText(kanji, w * 0.5, 105)

  // English subtitle
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif"
  ctx.fillStyle = "#cfc9be"
  let subText = english.toUpperCase()
  if (arrow === "left") subText = `◀  ${subText}`
  if (arrow === "right") subText = `${subText}  ▶`
  ctx.fillText(subText, w * 0.5, 160)

  // Red seal stamp in the corner
  ctx.fillStyle = "#b71c1c"
  ctx.fillRect(w - 68, h - 68, 34, 34)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 14px serif"
  ctx.fillText("美", w - 51, h - 45)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// ============================================================================
// 2. 3D Architectural Elements
// ============================================================================

/**
 * Creates an authentic Andon (行灯) floor-standing wooden paper lantern.
 * Muted, serene natural lighting (no harsh orange glow).
 */
export function createAndonLantern(x: number, z: number, intensity: number = 0.4): THREE.Group {
  const group = new THREE.Group()
  group.position.set(x, 0, z)

  // Deep dark smoked timber material
  const woodMat = new THREE.MeshStandardMaterial({
    color: "#161311",
    roughness: 0.75,
    metalness: 0.08,
  })

  // Soft neutral Washi paper (subtle gentle glow, no orange)
  const washiMat = new THREE.MeshStandardMaterial({
    color: "#f6f3ea",
    emissive: "#fcf8f0",
    emissiveIntensity: 0.12,
    roughness: 0.9,
    metalness: 0,
  })

  // 1. Base platform
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.26), woodMat)
  base.position.y = 0.02
  base.receiveShadow = true
  group.add(base)

  // 2. 4 vertical corner pillars
  const postH = 0.58
  const postGeo = new THREE.BoxGeometry(0.02, postH, 0.02)
  const offsets = [
    [-0.11, -0.11],
    [-0.11, 0.11],
    [0.11, -0.11],
    [0.11, 0.11],
  ]
  offsets.forEach(([px, pz]) => {
    const post = new THREE.Mesh(postGeo, woodMat)
    post.position.set(px, 0.04 + postH * 0.5, pz)
    group.add(post)
  })

  // 3. Washi paper core
  const washiCube = new THREE.Mesh(new THREE.BoxGeometry(0.2, postH - 0.04, 0.2), washiMat)
  washiCube.position.y = 0.04 + postH * 0.5
  group.add(washiCube)

  // 4. Horizontal struts
  const strutGeoX = new THREE.BoxGeometry(0.22, 0.012, 0.01)
  const strutGeoZ = new THREE.BoxGeometry(0.01, 0.012, 0.22)
  for (let s = 1; s <= 3; s++) {
    const sy = 0.04 + (postH / 4) * s
    const sx1 = new THREE.Mesh(strutGeoX, woodMat)
    sx1.position.set(0, sy, 0.105)
    const sx2 = new THREE.Mesh(strutGeoX, woodMat)
    sx2.position.set(0, sy, -0.105)
    const sz1 = new THREE.Mesh(strutGeoZ, woodMat)
    sz1.position.set(0.105, sy, 0)
    const sz2 = new THREE.Mesh(strutGeoZ, woodMat)
    sz2.position.set(-0.105, sy, 0)
    group.add(sx1, sx2, sz1, sz2)
  }

  // 5. Wooden top cap with handle
  const topCap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.28), woodMat)
  topCap.position.y = 0.04 + postH + 0.015
  group.add(topCap)

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 8, 16), woodMat)
  handle.rotation.x = Math.PI * 0.5
  handle.position.y = 0.04 + postH + 0.05
  group.add(handle)

  // 6. Gentle soft neutral-warm point light (subtle, NOT orange)
  const light = new THREE.PointLight("#fff8ed", intensity, 2.5, 2.0)
  light.position.set(0, 0.35, 0)
  group.add(light)

  return group
}

/**
 * Creates the low dark timber bench with sculpted miniature Bonsai pine tree on the left.
 * Exactly recreates the left bench and bonsai composition from the reference image.
 */
export function createBonsaiBench(x: number, z: number): THREE.Group {
  const group = new THREE.Group()
  group.position.set(x, 0, z)

  const timberMat = new THREE.MeshStandardMaterial({
    color: "#181411", // dark smoked timber
    roughness: 0.65,
    metalness: 0.08,
  })

  // 1. Low bench top
  const benchTop = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.045, 0.28), timberMat)
  benchTop.position.y = 0.12
  benchTop.castShadow = true
  benchTop.receiveShadow = true
  group.add(benchTop)

  // 2. Bench legs (two low block supports)
  const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.10, 0.26), timberMat)
  leg1.position.set(-0.28, 0.05, 0)
  const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.10, 0.26), timberMat)
  leg2.position.set(0.28, 0.05, 0)
  group.add(leg1, leg2)

  // 3. Ceramic pot (Bonsai-bachi)
  const potMat = new THREE.MeshStandardMaterial({
    color: "#28231f", // dark matte ceramic glaze
    roughness: 0.5,
    metalness: 0.1,
  })
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.06, 24), potMat)
  pot.position.set(-0.06, 0.17, 0)
  pot.castShadow = true
  group.add(pot)

  // Soil inside pot
  const soil = new THREE.Mesh(
    new THREE.CircleGeometry(0.085, 16),
    new THREE.MeshStandardMaterial({ color: "#14100c", roughness: 0.95 }),
  )
  soil.rotation.x = -Math.PI * 0.5
  soil.position.set(-0.06, 0.201, 0)
  group.add(soil)

  // 4. Bonsai trunk leaning toward center (matching reference photo)
  const barkMat = new THREE.MeshStandardMaterial({ color: "#221912", roughness: 0.85 })
  const trunkBase = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, 0.16, 8), barkMat)
  trunkBase.position.set(-0.06, 0.27, 0)
  trunkBase.rotation.z = -0.45 // leaning right toward center
  trunkBase.castShadow = true
  group.add(trunkBase)

  const trunkMid = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.14, 8), barkMat)
  trunkMid.position.set(-0.01, 0.38, 0)
  trunkMid.rotation.z = 0.35 // graceful S-curve
  trunkMid.castShadow = true
  group.add(trunkMid)

  const trunkBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.12, 8), barkMat)
  trunkBranch.position.set(0.05, 0.44, 0)
  trunkBranch.rotation.z = -0.55
  group.add(trunkBranch)

  // 5. Tiered cloud foliage pads in deep pine green
  const foliageMat = new THREE.MeshStandardMaterial({
    color: "#18231a", // deep sumi pine green
    roughness: 0.85,
  })
  const addCloud = (cx: number, cy: number, cz: number, rx: number, rz: number) => {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(rx, 10, 8), foliageMat)
    cloud.scale.set(1.4, 0.5, rz)
    cloud.position.set(cx, cy, cz)
    cloud.castShadow = true
    group.add(cloud)
  }
  addCloud(-0.12, 0.36, 0.02, 0.065, 1.2)
  addCloud(0.02, 0.45, -0.01, 0.08, 1.3)
  addCloud(0.12, 0.41, 0.01, 0.07, 1.2)
  addCloud(0.06, 0.49, 0, 0.06, 1.1)

  return group
}

/**
 * Creates the high-resolution botanical Sakura (cherry blossom) tree branch mesh in the upper corner.
 * Directly recreates the graceful blossoming cherry branch hanging in the upper-right corner in the reference image.
 */
export function createSakuraBranchMesh(x: number, y: number, z: number, scale: number = 1.0): THREE.Mesh {
  const loader = new THREE.TextureLoader()
  const tex = loader.load("/thevertmenthe/textures/sakura_branch.svg")
  tex.colorSpace = THREE.SRGBColorSpace

  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0.98,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  // 1600x1200 aspect ratio = 4:3
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4 * scale, 1.8 * scale), mat)
  mesh.position.set(x, y, z)
  return mesh
}

/**
 * Creates the traditional Tokonoma (床の間) Alcove at the back wall:
 * - Raised dark lacquer platform (Toko-kamachi) with inlaid Tatami surface
 * - Traditional Kakejiku hanging scroll with top rod & bottom roller
 */
export function createTokonomaAlcove(
  backWallZ: number = -11.2,
  kakejikuTex: THREE.CanvasTexture,
  tatamiTex: THREE.CanvasTexture,
  scrollSize?: { w?: number; h?: number; y?: number },
): THREE.Group {
  const group = new THREE.Group()

  // 1. Raised Wooden Platform (Toko-kamachi)
  const platformW = 2.8
  const platformH = 0.09
  const platformD = 1.3
  const platformZ = backWallZ + platformD * 0.5

  const lacquerMat = new THREE.MeshStandardMaterial({
    color: "#161310",
    roughness: 0.35,
    metalness: 0.1,
  })

  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(platformW, platformH, platformD),
    lacquerMat,
  )
  platform.position.set(0, platformH * 0.5, platformZ)
  platform.receiveShadow = true
  group.add(platform)

  // Inlaid Tatami mat on top of the platform
  const tatamiTop = new THREE.Mesh(
    new THREE.PlaneGeometry(platformW - 0.12, platformD - 0.12),
    new THREE.MeshStandardMaterial({
      map: tatamiTex,
      roughness: 0.85,
    }),
  )
  tatamiTop.rotation.x = -Math.PI * 0.5
  tatamiTop.position.set(0, platformH + 0.002, platformZ)
  tatamiTop.receiveShadow = true
  group.add(tatamiTop)

  // 2. Kakejiku (掛け軸) Hanging Scroll
  const scrollW = scrollSize?.w ?? 1.15
  const scrollH = scrollSize?.h ?? 2.3
  const scrollZ = backWallZ + 0.05
  const scrollY = scrollSize?.y ?? platformH + 1.6

  // Scroll canvas plane
  const scrollMat = new THREE.MeshStandardMaterial({
    map: kakejikuTex,
    roughness: 0.85,
    side: THREE.FrontSide,
  })
  const scrollMesh = new THREE.Mesh(new THREE.PlaneGeometry(scrollW, scrollH), scrollMat)
  scrollMesh.name = "tokonoma_scroll"
  scrollMesh.position.set(0, scrollY, scrollZ)
  scrollMesh.receiveShadow = true
  group.add(scrollMesh)

  // Top suspension rod (Hyōmoku)
  const topRodMat = new THREE.MeshStandardMaterial({ color: "#161310", roughness: 0.6 })
  const topRod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, scrollW + 0.12, 16), topRodMat)
  topRod.rotation.z = Math.PI * 0.5
  topRod.position.set(0, scrollY + scrollH * 0.5 + 0.01, scrollZ + 0.01)
  group.add(topRod)

  // Bottom cylindrical roller (Jiku-gi)
  const bottomRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.026, scrollW + 0.18, 16),
    new THREE.MeshStandardMaterial({ color: "#100d0a", roughness: 0.4 }),
  )
  bottomRod.rotation.z = Math.PI * 0.5
  bottomRod.position.set(0, scrollY - scrollH * 0.5 - 0.01, scrollZ + 0.018)
  group.add(bottomRod)

  // 3. Dedicated soft Tokonoma natural accent spotlight
  const alcoveLight = new THREE.SpotLight("#faf7f0", 2.4, 5.5, Math.PI / 4, 0.6, 1.2)
  alcoveLight.position.set(0, platformH + 3.2, platformZ + 1.2)
  alcoveLight.target.position.set(0, scrollY, scrollZ)
  group.add(alcoveLight, alcoveLight.target)

  return group
}

export type ParticleBounds = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  zMin: number
  zMax: number
}

/**
 * Creates a serene particle system of floating Sakura (cherry blossom) petals.
 */
export function createSakuraParticles(
  count: number = 36,
  bounds: ParticleBounds = {
    xMin: -1.3,
    xMax: 1.3,
    yMin: 0.2,
    yMax: 2.8,
    zMin: -10.5,
    zMax: 2.0,
  },
): {
  group: THREE.Group
  update: (delta: number) => void
} {
  const group = new THREE.Group()

  const geo = new THREE.PlaneGeometry(0.045, 0.065)
  const petalMat = new THREE.MeshBasicMaterial({
    color: "#fff0f4",
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  const moteMat = new THREE.MeshBasicMaterial({
    color: "#f6ede8",
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  type PetalData = {
    mesh: THREE.Mesh
    speedY: number
    rotSpeedX: number
    rotSpeedY: number
    swayFreq: number
    swayAmp: number
    phase: number
  }

  const petals: PetalData[] = []

  for (let i = 0; i < count; i++) {
    const isPetal = i % 2 === 0
    const m = new THREE.Mesh(geo, isPetal ? petalMat : moteMat)
    m.position.set(
      bounds.xMin + Math.random() * (bounds.xMax - bounds.xMin),
      bounds.yMin + Math.random() * (bounds.yMax - bounds.yMin),
      bounds.zMin + Math.random() * (bounds.zMax - bounds.zMin),
    )
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    group.add(m)

    petals.push({
      mesh: m,
      speedY: 0.12 + Math.random() * 0.18,
      rotSpeedX: (Math.random() - 0.5) * 1.8,
      rotSpeedY: (Math.random() - 0.5) * 2.2,
      swayFreq: 1.2 + Math.random() * 1.5,
      swayAmp: 0.008 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
    })
  }

  let time = 0
  const update = (delta: number) => {
    time += delta
    for (const p of petals) {
      p.mesh.position.y -= p.speedY * delta
      p.mesh.position.x += Math.sin(time * p.swayFreq + p.phase) * p.swayAmp
      p.mesh.position.z += Math.cos(time * p.swayFreq + p.phase) * (p.swayAmp * 0.5)
      p.mesh.rotation.x += p.rotSpeedX * delta
      p.mesh.rotation.y += p.rotSpeedY * delta

      // Reset when reaching the floor
      if (p.mesh.position.y < bounds.yMin) {
        p.mesh.position.y = bounds.yMax + Math.random() * 0.4
        p.mesh.position.x = bounds.xMin + Math.random() * (bounds.xMax - bounds.xMin)
        p.mesh.position.z = bounds.zMin + Math.random() * (bounds.zMax - bounds.zMin)
      }
    }
  }

  return { group, update }
}

// ============================================================================
// 3. Meraki Leadership Pavilion — plaques, text panels & quote scroll
// ============================================================================

/**
 * Dark timber engraved plaque for name plates and partner boards
 * (Shore Global / Foxbytes) in the Leadership Pavilion.
 */
export function createPlaqueTexture(
  title: string,
  subtitle: string,
  logo?: HTMLImageElement | null,
): THREE.CanvasTexture {
  const w = 512
  const h = 192
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!

  // Ebony timber base with grain
  ctx.fillStyle = "#1c1815"
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = "rgba(40, 35, 30, 0.4)"
  for (let y = 0; y < h; y += 12) {
    ctx.fillRect(0, y, w, 4)
  }

  // Frame + inner hairline
  ctx.strokeStyle = "#0e0c0a"
  ctx.lineWidth = 8
  ctx.strokeRect(0, 0, w, h)
  ctx.strokeStyle = "rgba(180, 165, 135, 0.45)"
  ctx.lineWidth = 1.5
  ctx.strokeRect(10, 10, w - 20, h - 20)

  const serif = "'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif"
  const sans = "-apple-system, BlinkMacSystemFont, sans-serif"

  // Shrink text until it fits its column
  const fit = (text: string, weight: string, family: string, size: number, min: number, maxW: number) => {
    ctx.font = `${weight} ${size}px ${family}`
    while (size > min && ctx.measureText(text).width > maxW) {
      size -= 1
      ctx.font = `${weight} ${size}px ${family}`
    }
  }

  ctx.textAlign = "center"

  if (logo) {
    // Key the mark's black background to transparency (white logo on dark timber)
    const lw = 94
    const lh = Math.round((logo.naturalHeight / logo.naturalWidth) * lw)
    const off = document.createElement("canvas")
    off.width = lw
    off.height = lh
    const octx = off.getContext("2d")!
    octx.drawImage(logo, 0, 0, lw, lh)
    const img = octx.getImageData(0, 0, lw, lh)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      d[i + 3] = Math.max(d[i], d[i + 1], d[i + 2])
    }
    octx.putImageData(img, 0, 0)
    ctx.drawImage(off, 32, (h - lh) / 2)

    // Text column right of the mark — title and subtitle auto-fit
    const textL = 32 + lw + 30
    const textR = w - 34
    const textCx = (textL + textR) / 2
    const maxW = textR - textL

    fit(title, "bold", serif, 40, 26, maxW)
    ctx.fillStyle = "#f2ede4"
    ctx.fillText(title, textCx, h * 0.4)

    const sub = subtitle.toUpperCase()
    ctx.font = `600 17px ${sans}`
    if (ctx.measureText(sub).width <= maxW) {
      fit(sub, "600", sans, 17, 12, maxW)
      ctx.fillStyle = "#cfc9be"
      ctx.fillText(sub, textCx, h * 0.71)
    } else {
      // wrap long subtitles onto two lines
      const words = sub.split(" ")
      let line1 = ""
      let line2 = ""
      ctx.font = `600 15px ${sans}`
      for (const word of words) {
        if (ctx.measureText(line1 ? `${line1} ${word}` : word).width <= maxW && !line2) {
          line1 = line1 ? `${line1} ${word}` : word
        } else {
          line2 = line2 ? `${line2} ${word}` : `${word}`
        }
      }
      ctx.fillStyle = "#cfc9be"
      ctx.fillText(line1, textCx, h * 0.62)
      ctx.fillText(line2, textCx, h * 0.8)
    }
  } else {
    fit(title, "bold", serif, 44, 28, w - 60)
    ctx.fillStyle = "#f2ede4"
    ctx.fillText(title, w * 0.5, h * 0.44)

    fit(subtitle.toUpperCase(), "600", sans, 20, 13, w - 60)
    ctx.fillStyle = "#cfc9be"
    ctx.fillText(subtitle.toUpperCase(), w * 0.5, h * 0.74)

    // Small red seal
    ctx.fillStyle = "#b71c1c"
    ctx.fillRect(14, h - 44, 26, 26)
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 13px serif"
    ctx.fillText("美", 27, h - 25)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Framed calligraphy panel for the Essence / Mission / Vision / Goals walls
 * of the Leadership Pavilion: kakejiku-style mounting with a parchment field,
 * a single kanji motif and an English title. Rendered inside cadre frames.
 */
export function createScrollPanelTexture(kanji: string, title: string, subtitle: string): THREE.CanvasTexture {
  const w = 1024
  const h = 1440
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!

  // Indigo brocade mounting
  ctx.fillStyle = "#181a1f"
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = "rgba(140, 130, 115, 0.15)"
  for (let y = 0; y < h; y += 32) {
    for (let x = 0; x < w; x += 32) {
      if ((x + y) % 64 === 0) ctx.fillRect(x + 14, y + 14, 4, 4)
    }
  }

  // Parchment field
  const marginX = 90
  const mountY = 200
  const artX = marginX
  const artY = mountY
  const artW = w - marginX * 2
  const artH = h - mountY * 2
  ctx.fillStyle = "#222528"
  ctx.fillRect(artX - 18, artY - 18, artW + 36, artH + 36)
  ctx.fillStyle = "#8a7a60"
  ctx.fillRect(artX - 18, artY - 18, artW + 36, 7)
  ctx.fillRect(artX - 18, artY + artH + 11, artW + 36, 7)
  const grad = ctx.createLinearGradient(0, artY, 0, artY + artH)
  grad.addColorStop(0, "#f8f5ed")
  grad.addColorStop(0.7, "#f2eee4")
  grad.addColorStop(1, "#e8e1d2")
  ctx.fillStyle = grad
  ctx.fillRect(artX, artY, artW, artH)

  // Kanji motif
  ctx.fillStyle = "rgba(15, 15, 18, 0.92)"
  ctx.font = "bold 330px 'Hiragino Mincho ProN', 'Yu Mincho', serif"
  ctx.textAlign = "center"
  ctx.fillText(kanji, artX + artW * 0.5, artY + artH * 0.42)

  // Rule
  ctx.strokeStyle = "rgba(26, 22, 19, 0.5)"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(artX + artW * 0.2, artY + artH * 0.55)
  ctx.lineTo(artX + artW * 0.8, artY + artH * 0.55)
  ctx.stroke()

  // English title + subtitle
  ctx.fillStyle = "rgba(20, 18, 16, 0.95)"
  ctx.font = "bold 74px -apple-system, BlinkMacSystemFont, sans-serif"
  ctx.fillText(title.toUpperCase(), artX + artW * 0.5, artY + artH * 0.68)
  ctx.fillStyle = "rgba(50, 45, 40, 0.75)"
  ctx.font = "italic 30px 'Times New Roman', serif"
  ctx.fillText(subtitle, artX + artW * 0.5, artY + artH * 0.76)

  // Vermilion seal
  const sealX = artX + artW * 0.5 - 24
  const sealY = artY + artH * 0.84
  ctx.fillStyle = "#b71c1c"
  ctx.fillRect(sealX, sealY, 48, 48)
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 2
  ctx.strokeRect(sealX + 4, sealY + 4, 40, 40)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 20px serif"
  ctx.fillText("藝", sealX + 24, sealY + 32)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Founder's quote rendered as a Tokonoma kakejiku hanging scroll.
 */
export function createQuoteScrollTexture(quote: string, author: string): THREE.CanvasTexture {
  const w = 1024
  const h = 2048
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!

  // Brocade mounting
  ctx.fillStyle = "#181a1f"
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = "rgba(140, 130, 115, 0.15)"
  for (let y = 0; y < h; y += 32) {
    for (let x = 0; x < w; x += 32) {
      if ((x + y) % 64 === 0) ctx.fillRect(x + 14, y + 14, 4, 4)
    }
  }

  const marginX = 96
  const topTenH = 340
  const bottomChiH = 360
  const artX = marginX
  const artY = topTenH
  const artW = w - marginX * 2
  const artH = h - topTenH - bottomChiH

  ctx.fillStyle = "#222528"
  ctx.fillRect(artX - 20, artY - 24, artW + 40, artH + 48)
  ctx.fillStyle = "#8a7a60"
  ctx.fillRect(artX - 20, artY - 24, artW + 40, 8)
  ctx.fillRect(artX - 20, artY + artH + 16, artW + 40, 8)

  const grad = ctx.createLinearGradient(0, artY, 0, artY + artH)
  grad.addColorStop(0, "#f8f5ed")
  grad.addColorStop(0.7, "#f2eee4")
  grad.addColorStop(1, "#e8e1d2")
  ctx.fillStyle = grad
  ctx.fillRect(artX, artY, artW, artH)

  // Wrapped quote text
  ctx.save()
  ctx.beginPath()
  ctx.rect(artX, artY, artW, artH)
  ctx.clip()

  ctx.fillStyle = "rgba(15, 15, 18, 0.92)"
  ctx.textAlign = "center"
  const fontSize = 64
  ctx.font = `bold ${fontSize}px 'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif`
  const maxWidth = artW - 120
  const words = quote.split(" ")
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const blockH = lines.length * fontSize * 1.3
  let ty = artY + artH * 0.5 - blockH * 0.5 + fontSize
  for (const l of lines) {
    ctx.fillText(l, artX + artW * 0.5, ty)
    ty += fontSize * 1.3
  }

  // Author
  ctx.font = "600 30px -apple-system, BlinkMacSystemFont, sans-serif"
  ctx.fillStyle = "rgba(50, 45, 40, 0.8)"
  ctx.fillText(author.toUpperCase(), artX + artW * 0.5, artY + artH * 0.86)

  // Vermilion seal
  const sealX = artX + artW - 86
  const sealY = artY + artH * 0.08
  ctx.fillStyle = "#b71c1c"
  ctx.fillRect(sealX, sealY, 40, 40)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 17px serif"
  ctx.fillText("美", sealX + 20, sealY + 26)

  ctx.restore()

  // Hanging ribbons (Fūtai)
  ctx.fillStyle = "#181a1f"
  ctx.fillRect(artX + artW * 0.22, 0, 24, topTenH + 60)
  ctx.fillRect(artX + artW * 0.78, 0, 24, topTenH + 60)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Creates the handcrafted Meraki Artist Satchel & Hanging Japanese Art Scrolls.
 * Parented directly to the character's spine/torso bone so it naturally sways with movement.
 */
export function createArtistSatchel(): THREE.Group {
  const satchel = new THREE.Group()

  // Materials
  const leatherMat = new THREE.MeshStandardMaterial({
    color: "#3e2718", // Warm chestnut saddle leather
    roughness: 0.5,
    metalness: 0.1,
  })

  const brassMat = new THREE.MeshStandardMaterial({
    color: "#d4af37", // Brushed antique brass
    roughness: 0.35,
    metalness: 0.85,
  })

  const scrollMat = new THREE.MeshStandardMaterial({
    color: "#f0ebe1", // Aged natural washi parchment
    roughness: 0.88,
    metalness: 0.0,
  })

  const ribbonMat = new THREE.MeshStandardMaterial({
    color: "#b71c1c", // Meraki vermillion red silk ribbon
    roughness: 0.45,
    metalness: 0.1,
  })

  const rodMat = new THREE.MeshStandardMaterial({
    color: "#181410", // Smoked timber rod ends
    roughness: 0.6,
  })

  // 1. Leather messenger bag body
  const bagGeo = new THREE.BoxGeometry(0.68, 0.52, 0.16)
  const bag = new THREE.Mesh(bagGeo, leatherMat)
  bag.position.set(0, 0, 0)
  bag.castShadow = true
  satchel.add(bag)

  // 2. Leather flap over the front
  const flapGeo = new THREE.BoxGeometry(0.7, 0.26, 0.18)
  const flap = new THREE.Mesh(flapGeo, leatherMat)
  flap.position.set(0, -0.06, 0.01)
  flap.castShadow = true
  satchel.add(flap)

  // 3. Brass closure buckle on the flap
  const buckleGeo = new THREE.BoxGeometry(0.08, 0.09, 0.04)
  const buckle = new THREE.Mesh(buckleGeo, brassMat)
  buckle.position.set(0, -0.16, 0.1)
  satchel.add(buckle)

  // 4. Two rolled Japanese Washi Art Scrolls strapped across top
  // Scroll 1
  const scroll1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.88, 16), scrollMat)
  scroll1.rotation.z = Math.PI * 0.48
  scroll1.rotation.x = 0.1
  scroll1.position.set(0, 0.28, -0.02)
  scroll1.castShadow = true
  satchel.add(scroll1)

  // Scroll 1 wooden rod tips
  const rod1A = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), rodMat)
  rod1A.position.y = 0.45
  const rod1B = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), rodMat)
  rod1B.position.y = -0.45
  scroll1.add(rod1A, rod1B)

  // Scroll 1 red silk ribbon tie
  const tie1 = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.012, 8, 16), ribbonMat)
  tie1.rotation.x = Math.PI * 0.5
  tie1.position.set(0, 0.28, -0.02)
  satchel.add(tie1)

  // Scroll 2 (slightly angled behind scroll 1)
  const scroll2 = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.82, 16), scrollMat)
  scroll2.rotation.z = Math.PI * 0.52
  scroll2.rotation.x = -0.15
  scroll2.position.set(0, 0.24, -0.09)
  scroll2.castShadow = true
  satchel.add(scroll2)

  const tie2 = new THREE.Mesh(new THREE.TorusGeometry(0.051, 0.012, 8, 16), ribbonMat)
  tie2.rotation.x = Math.PI * 0.5
  tie2.position.set(0, 0.24, -0.09)
  satchel.add(tie2)

  // 5. Diagonal Leather Strap wrapping over the shoulder
  const strapGeo = new THREE.BoxGeometry(0.07, 1.4, 0.025)
  const strap = new THREE.Mesh(strapGeo, leatherMat)
  strap.rotation.z = -0.55
  strap.rotation.y = 0.25
  strap.position.set(-0.25, 0.55, 0.1)
  satchel.add(strap)

  // 6. Meraki Vermillion Artist Seal Badge on strap
  const seal = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), ribbonMat)
  seal.position.set(-0.35, 0.82, 0.12)
  seal.rotation.z = -0.55
  satchel.add(seal)

  // Angle the satchel naturally on the back
  satchel.rotation.z = 0.18
  satchel.rotation.y = -0.12
  satchel.position.set(0.12, -0.12, -0.68)

  return satchel
}
