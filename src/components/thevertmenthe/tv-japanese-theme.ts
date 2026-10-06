"use client"

import * as THREE from "three"

/**
 * Japanese Sukiya Tea-House & Zen Art Pavilion Theme Generator.
 * Provides procedural canvas textures and 3D architectural elements:
 * - Rich Hinoki / Cedar Wood Plank Flooring
 * - Traditional Woven Tatami Mats with Midnight-Indigo Heri Cloth Borders
 * - Authentic Shoji & Kumiko Wood Lattice Screens
 * - Tokonoma (床の間) Alcove with Traditional Kakejiku (掛け軸) Hanging Scroll
 * - Andon (行灯) Floor-Standing Paper Lanterns with Warm Point Lights
 * - Serene Floating Sakura / Zen Light Motes Particle System
 */

// ============================================================================
// 1. Procedural Texture Generators
// ============================================================================

/**
 * Creates rich polished Hinoki / Cedar timber floor textures.
 */
export function createHinokiWoodTextures(): {
  colorMap: THREE.CanvasTexture
  roughnessMap: THREE.CanvasTexture
} {
  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!

  // Warm amber cedar base
  ctx.fillStyle = "#8d5d36"
  ctx.fillRect(0, 0, size, size)

  const numPlanks = 8
  const plankWidth = size / numPlanks

  // Plank base tones (subtle natural variation)
  const plankShades = [
    "#9e683c",
    "#8f5e34",
    "#a57041",
    "#8a5930",
    "#976337",
    "#a97444",
    "#936035",
    "#a26d3e",
  ]

  for (let p = 0; p < numPlanks; p++) {
    const px = p * plankWidth
    ctx.fillStyle = plankShades[p % plankShades.length]
    ctx.fillRect(px, 0, plankWidth, size)

    // Fine wood grain rings (longitudinal curves)
    ctx.save()
    ctx.beginPath()
    ctx.rect(px, 0, plankWidth, size)
    ctx.clip()

    for (let g = 0; g < 40; g++) {
      const gy = (g / 40) * size
      const alpha = 0.04 + Math.sin(p + g * 0.4) * 0.025
      ctx.strokeStyle = g % 2 === 0 ? `rgba(50, 25, 10, ${alpha})` : `rgba(215, 165, 110, ${alpha})`
      ctx.lineWidth = 1 + (g % 3)

      ctx.beginPath()
      ctx.moveTo(px, 0)
      for (let y = 0; y <= size; y += 40) {
        const offset = Math.sin((y + p * 120) * 0.012) * (14 + (p % 3) * 6)
        ctx.lineTo(px + plankWidth * 0.5 + offset, y)
      }
      ctx.stroke()
    }
    ctx.restore()

    // Dark seam line between planks
    ctx.fillStyle = "#26150b"
    ctx.fillRect(px, 0, 2, size)
    ctx.fillStyle = "rgba(235, 190, 140, 0.15)"
    ctx.fillRect(px + 2, 0, 1, size)
  }

  const colorMap = new THREE.CanvasTexture(canvas)
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping
  colorMap.colorSpace = THREE.SRGBColorSpace
  colorMap.repeat.set(1.5, 4)

  // Roughness Map (satin wood finish with slightly rougher seams)
  const rCanvas = document.createElement("canvas")
  rCanvas.width = rCanvas.height = size
  const rCtx = rCanvas.getContext("2d")!
  rCtx.fillStyle = "#666666" // satin finish
  rCtx.fillRect(0, 0, size, size)
  for (let p = 0; p < numPlanks; p++) {
    rCtx.fillStyle = "#dddddd" // rough seams
    rCtx.fillRect(p * plankWidth, 0, 3, size)
  }
  const roughnessMap = new THREE.CanvasTexture(rCanvas)
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping
  roughnessMap.repeat.set(1.5, 4)

  return { colorMap, roughnessMap }
}

/**
 * Creates authentic woven rush grass (Igusa) Tatami mat texture with cloth borders.
 */
export function createTatamiTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!

  // Golden-green dried rush grass base tone
  ctx.fillStyle = "#a8966c"
  ctx.fillRect(0, 0, size, size)

  // Woven Igusa weave cords
  const cords = 128
  const cordHeight = size / cords
  for (let c = 0; c < cords; c++) {
    const y = c * cordHeight
    const tone = c % 2 === 0 ? "rgba(120, 105, 70, 0.35)" : "rgba(205, 190, 145, 0.28)"
    ctx.fillStyle = tone
    ctx.fillRect(0, y, size, cordHeight * 0.5)

    // Micro-stitches along the cords
    ctx.fillStyle = "rgba(60, 50, 30, 0.12)"
    for (let x = 0; x < size; x += 16) {
      if ((x / 16 + c) % 2 === 0) {
        ctx.fillRect(x, y, 8, cordHeight)
      }
    }
  }

  // Dark cloth border ribbons (Heri - 縁) along left & right edges
  const heriWidth = 84
  const drawHeri = (xStart: number) => {
    // Deep midnight-indigo silk cloth
    ctx.fillStyle = "#14151b"
    ctx.fillRect(xStart, 0, heriWidth, size)

    // Inner gold woven seam
    ctx.fillStyle = "#9d824d"
    ctx.fillRect(xStart === 0 ? heriWidth - 4 : xStart, 0, 4, size)

    // Repeating traditional Japanese Mon crest diamonds in gold
    for (let y = 30; y < size; y += 64) {
      const cx = xStart + heriWidth * 0.5
      ctx.fillStyle = "rgba(175, 145, 85, 0.65)"
      ctx.beginPath()
      ctx.moveTo(cx, y - 10)
      ctx.lineTo(cx + 10, y)
      ctx.lineTo(cx, y + 10)
      ctx.lineTo(cx - 10, y)
      ctx.closePath()
      ctx.fill()
    }
  }

  drawHeri(0)
  drawHeri(size - heriWidth)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Creates Shoji & Kumiko wood lattice grid texture with translucent washi paper.
 */
export function createShojiLatticeTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!

  // Warm Washi paper background with organic warmth
  ctx.fillStyle = "#faf4e8"
  ctx.fillRect(0, 0, size, size)

  // Subtle washi paper cloud fibers (Unryu-shi)
  ctx.fillStyle = "rgba(220, 205, 185, 0.15)"
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * size
    const ry = Math.random() * size
    const rw = 10 + Math.random() * 30
    const rh = 1 + Math.random() * 3
    ctx.fillRect(rx, ry, rw, rh)
  }

  // Slender dark cedar Kumiko grid bars
  const cols = 6
  const rows = 12
  const colW = size / cols
  const rowH = size / rows

  ctx.strokeStyle = "#25170f"
  ctx.lineWidth = 14

  // Outer framing
  ctx.strokeRect(0, 0, size, size)

  // Vertical wood struts
  for (let c = 1; c < cols; c++) {
    ctx.beginPath()
    ctx.moveTo(c * colW, 0)
    ctx.lineTo(c * colW, size)
    ctx.stroke()
  }

  // Horizontal wood struts
  ctx.lineWidth = 10
  for (let r = 1; r < rows; r++) {
    ctx.beginPath()
    ctx.moveTo(0, r * rowH)
    ctx.lineTo(size, r * rowH)
    ctx.stroke()
  }

  // Delicate diagonal Kumiko accents in alternate cells
  ctx.strokeStyle = "rgba(37, 23, 15, 0.45)"
  ctx.lineWidth = 4
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if ((c + r) % 4 === 0) {
        ctx.beginPath()
        ctx.moveTo(c * colW, r * rowH)
        ctx.lineTo((c + 1) * colW, (r + 1) * rowH)
        ctx.stroke()
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.repeat.set(4, 2)
  return texture
}

/**
 * Creates high-resolution traditional Kakejiku (掛け軸) hanging scroll artwork:
 * - Silk brocade top and bottom borders (Ten / Chi) in deep sumi-indigo
 * - Side pillars (Chūberi) in sage brocade with gold thread piping
 * - Authentic Sumi-e ink painting: misty Japanese mountain ridges & pine
 * - Flowing Japanese calligraphy: 美・魂・創 (Beauty · Soul · Creation)
 * - Vermilion red Hanko seal of Meraki Art Federation
 */
export function createKakejikuTexture(): THREE.CanvasTexture {
  const w = 1024
  const h = 2048
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!

  // 1. Brocade Silk Mounting Background (Deep indigo Ten & Chi)
  ctx.fillStyle = "#181e28"
  ctx.fillRect(0, 0, w, h)

  // Gold brocade woven diamond pattern
  ctx.fillStyle = "rgba(180, 150, 95, 0.2)"
  for (let y = 0; y < h; y += 32) {
    for (let x = 0; x < w; x += 32) {
      if ((x + y) % 64 === 0) {
        ctx.fillRect(x + 14, y + 14, 4, 4)
      }
    }
  }

  // 2. Middle pillars (Chūberi) framing the inner painting
  const marginX = 96
  const topTenH = 340
  const bottomChiH = 360
  const artX = marginX
  const artY = topTenH
  const artW = w - marginX * 2
  const artH = h - topTenH - bottomChiH

  // Sage-olive silk border for Chūberi
  ctx.fillStyle = "#273024"
  ctx.fillRect(marginX - 20, topTenH - 24, artW + 40, artH + 48)

  // Gold piping ribbon (Ichimonji - 一文字)
  ctx.fillStyle = "#bfa365"
  ctx.fillRect(marginX - 20, topTenH - 24, artW + 40, 10)
  ctx.fillRect(marginX - 20, topTenH + artH + 14, artW + 40, 10)

  // 3. Central Artwork Field (Honji - 本紙)
  // Aged warm rice paper parchment
  const artGrad = ctx.createLinearGradient(0, artY, 0, artY + artH)
  artGrad.addColorStop(0, "#f9f5ec")
  artGrad.addColorStop(0.65, "#f4eee0")
  artGrad.addColorStop(1, "#ebdcb9")
  ctx.fillStyle = artGrad
  ctx.fillRect(artX, artY, artW, artH)

  // 4. Sumi-e Japanese Ink Wash Painting (Misty mountain landscape)
  ctx.save()
  ctx.beginPath()
  ctx.rect(artX, artY, artW, artH)
  ctx.clip()

  // Distant mountain ridge (pale ink wash)
  ctx.fillStyle = "rgba(95, 105, 115, 0.25)"
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
  ctx.fillStyle = "rgba(45, 55, 60, 0.48)"
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

  // Foreground crag & ancient pine tree silhouette (dark sumi ink)
  ctx.fillStyle = "rgba(20, 24, 25, 0.88)"
  ctx.beginPath()
  ctx.moveTo(artX, artY + artH * 0.85)
  ctx.quadraticCurveTo(artX + artW * 0.35, artY + artH * 0.72, artX + artW * 0.5, artY + artH)
  ctx.lineTo(artX, artY + artH)
  ctx.closePath()
  ctx.fill()

  // Pine tree trunk and needles on the left
  ctx.lineWidth = 14
  ctx.strokeStyle = "rgba(20, 24, 25, 0.85)"
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

  // Pine needle tufts
  ctx.fillStyle = "rgba(25, 30, 28, 0.8)"
  const drawNeedles = (cx: number, cy: number, r: number) => {
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI * 0.8, Math.PI * 1.9)
    ctx.fill()
  }
  drawNeedles(artX + 160, artY + artH * 0.62, 38)
  drawNeedles(artX + 220, artY + artH * 0.56, 46)
  drawNeedles(artX + 270, artY + artH * 0.53, 34)

  // Floating red sun / moon disk in the mist
  ctx.fillStyle = "rgba(195, 60, 50, 0.35)"
  ctx.beginPath()
  ctx.arc(artX + artW * 0.72, artY + artH * 0.32, 54, 0, Math.PI * 2)
  ctx.fill()

  // 5. Japanese Calligraphy (Shodō - 書道)
  ctx.fillStyle = "rgba(18, 18, 22, 0.92)"
  ctx.font = "bold 68px 'Hiragino Mincho ProN', 'Yu Mincho', serif"
  ctx.textAlign = "center"

  // Vertical Kanji: 美 (Beauty), 魂 (Soul), 創 (Creation)
  const textX = artX + artW * 0.72
  ctx.fillText("美", textX, artY + artH * 0.48)
  ctx.fillText("魂", textX, artY + artH * 0.55)
  ctx.fillText("創", textX, artY + artH * 0.62)

  // Secondary vertical inscription
  ctx.font = "32px 'Hiragino Mincho ProN', 'Yu Mincho', serif"
  const subX = artX + artW * 0.82
  ctx.fillText("和", subX, artY + artH * 0.48)
  ctx.fillText("敬", subX, artY + artH * 0.53)
  ctx.fillText("清", subX, artY + artH * 0.58)
  ctx.fillText("寂", subX, artY + artH * 0.63)

  // English subtitling beneath
  ctx.font = "italic 22px 'Times New Roman', serif"
  ctx.fillStyle = "rgba(60, 50, 45, 0.75)"
  ctx.fillText("MERAKI ART FEDERATION", artX + artW * 0.5, artY + artH * 0.92)

  // 6. Vermilion Red Hanko Seal Stamp (判子)
  const sealX = subX - 18
  const sealY = artY + artH * 0.68
  ctx.fillStyle = "#c5221f"
  ctx.fillRect(sealX, sealY, 36, 36)
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 2
  ctx.strokeRect(sealX + 3, sealY + 3, 30, 30)
  ctx.font = "bold 16px sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.fillText("藝術", sealX + 18, sealY + 24)

  ctx.restore()

  // 7. Hanging Ribbons (Fūtai - 風帯) hanging from the top
  ctx.fillStyle = "#161b24"
  ctx.fillRect(artX + artW * 0.22, 0, 24, topTenH + 60)
  ctx.fillRect(artX + artW * 0.78, 0, 24, topTenH + 60)

  // Gold tassels on the ribbon ends
  ctx.fillStyle = "#bfa365"
  ctx.fillRect(artX + artW * 0.22, topTenH + 60, 24, 8)
  ctx.fillRect(artX + artW * 0.78, topTenH + 60, 24, 8)

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

  // Hinoki wood plaque background
  ctx.fillStyle = "#c49a68"
  ctx.fillRect(0, 0, w, h)

  // Wood grain
  ctx.fillStyle = "rgba(60, 30, 10, 0.08)"
  for (let y = 0; y < h; y += 12) {
    ctx.fillRect(0, y, w, 4)
  }

  // Dark timber border frame
  ctx.strokeStyle = "#2b1a0e"
  ctx.lineWidth = 12
  ctx.strokeRect(0, 0, w, h)

  // Inner gold hairline
  ctx.strokeStyle = "rgba(220, 180, 110, 0.6)"
  ctx.lineWidth = 2
  ctx.strokeRect(14, 14, w - 28, h - 28)

  // Calligraphy
  ctx.fillStyle = "#1e130a"
  ctx.font = "bold 64px 'Hiragino Mincho ProN', 'Yu Mincho', serif"
  ctx.textAlign = "center"
  ctx.fillText(kanji, w * 0.5, 105)

  // English subtitle
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif"
  ctx.fillStyle = "#3d2716"
  let subText = english.toUpperCase()
  if (arrow === "left") subText = `◀  ${subText}`
  if (arrow === "right") subText = `${subText}  ▶`
  ctx.fillText(subText, w * 0.5, 160)

  // Red seal stamp in the corner
  ctx.fillStyle = "#b5201d"
  ctx.fillRect(w - 70, h - 70, 36, 36)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 14px serif"
  ctx.fillText("美", w - 52, h - 46)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// ============================================================================
// 2. 3D Architectural Elements
// ============================================================================

/**
 * Creates an authentic Andon (行灯) floor-standing wooden paper lantern.
 * Includes dark timber framing, glowing Washi paper core, and a warm PointLight.
 */
export function createAndonLantern(x: number, z: number, intensity: number = 1.6): THREE.Group {
  const group = new THREE.Group()
  group.position.set(x, 0, z)

  // Materials
  const woodMat = new THREE.MeshStandardMaterial({
    color: "#1c1209",
    roughness: 0.8,
    metalness: 0.1,
  })

  const washiMat = new THREE.MeshStandardMaterial({
    color: "#fff3db",
    emissive: "#ffaa45",
    emissiveIntensity: 0.45,
    roughness: 0.85,
    metalness: 0,
  })

  // 1. Base platform
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.26), woodMat)
  base.position.y = 0.02
  base.castShadow = true
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
    post.castShadow = true
    group.add(post)
  })

  // 3. Glowing Washi paper inner cube
  const washiCube = new THREE.Mesh(new THREE.BoxGeometry(0.2, postH - 0.04, 0.2), washiMat)
  washiCube.position.y = 0.04 + postH * 0.5
  group.add(washiCube)

  // 4. Horizontal Kumiko lattice struts around the 4 sides
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
  topCap.castShadow = true
  group.add(topCap)

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 8, 16), woodMat)
  handle.rotation.x = Math.PI * 0.5
  handle.position.y = 0.04 + postH + 0.05
  group.add(handle)

  // 6. Warm amber PointLight casting cozy light on the floor and surroundings
  const light = new THREE.PointLight("#ffaa48", intensity, 3.8, 1.8)
  light.position.set(0, 0.35, 0)
  light.castShadow = false // keep lightweight
  group.add(light)

  return group
}

/**
 * Creates the traditional Tokonoma (床の間) Alcove at the back wall:
 * - Raised dark lacquer platform (Toko-kamachi) with inlaid Tatami surface
 * - Traditional Kakejiku hanging scroll with top rod & bottom roller
 * - Minimalist Zen Ikebana / Bonsai silhouette stand
 */
export function createTokonomaAlcove(
  backWallZ: number = -11.2,
  kakejikuTex: THREE.CanvasTexture,
  tatamiTex: THREE.CanvasTexture,
): THREE.Group {
  const group = new THREE.Group()

  // 1. Raised Wooden Platform (Toko-kamachi - 床框)
  const platformW = 2.8
  const platformH = 0.09
  const platformD = 1.3
  const platformZ = backWallZ + platformD * 0.5

  const lacquerMat = new THREE.MeshStandardMaterial({
    color: "#150f0b",
    roughness: 0.25,
    metalness: 0.15,
  })

  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(platformW, platformH, platformD),
    lacquerMat,
  )
  platform.position.set(0, platformH * 0.5, platformZ)
  platform.receiveShadow = true
  platform.castShadow = true
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
  const scrollW = 1.15
  const scrollH = 2.3
  const scrollZ = backWallZ + 0.05
  const scrollY = platformH + 1.6

  // Scroll canvas plane
  const scrollMat = new THREE.MeshStandardMaterial({
    map: kakejikuTex,
    roughness: 0.8,
    side: THREE.FrontSide,
  })
  const scrollMesh = new THREE.Mesh(new THREE.PlaneGeometry(scrollW, scrollH), scrollMat)
  scrollMesh.position.set(0, scrollY, scrollZ)
  scrollMesh.receiveShadow = true
  group.add(scrollMesh)

  // Top suspension rod (Hyōmoku)
  const topRodMat = new THREE.MeshStandardMaterial({ color: "#1c140d", roughness: 0.6 })
  const topRod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, scrollW + 0.12, 16), topRodMat)
  topRod.rotation.z = Math.PI * 0.5
  topRod.position.set(0, scrollY + scrollH * 0.5 + 0.01, scrollZ + 0.01)
  group.add(topRod)

  // Bottom cylindrical roller (Jiku-gi)
  const bottomRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.026, scrollW + 0.18, 16),
    new THREE.MeshStandardMaterial({ color: "#120d09", roughness: 0.35 }),
  )
  bottomRod.rotation.z = Math.PI * 0.5
  bottomRod.position.set(0, scrollY - scrollH * 0.5 - 0.01, scrollZ + 0.018)
  group.add(bottomRod)

  // 3. Zen Bonsai Display Stand on the side of the platform
  const standGroup = new THREE.Group()
  standGroup.position.set(0.85, platformH + 0.002, platformZ)

  // Low curved stand
  const standBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.04, 0.32),
    new THREE.MeshStandardMaterial({ color: "#22160d", roughness: 0.4 }),
  )
  standBase.position.y = 0.02
  standGroup.add(standBase)

  // Ceramic shallow pot
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.09, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: "#2f3833", roughness: 0.7 }),
  )
  pot.position.y = 0.065
  standGroup.add(pot)

  // Bonsai trunk & foliage
  const trunkMat = new THREE.MeshStandardMaterial({ color: "#2b1c13", roughness: 0.9 })
  const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.22, 8), trunkMat)
  trunk1.position.set(0, 0.16, 0)
  trunk1.rotation.z = -0.35
  standGroup.add(trunk1)

  const trunk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.025, 0.18, 8), trunkMat)
  trunk2.position.set(-0.06, 0.29, 0)
  trunk2.rotation.z = 0.45
  standGroup.add(trunk2)

  // Cloud foliage tufts (deep pine green)
  const foliageMat = new THREE.MeshStandardMaterial({ color: "#1a2c1f", roughness: 0.85 })
  const addTuft = (fx: number, fy: number, fz: number, r: number) => {
    const tuft = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), foliageMat)
    tuft.scale.set(1.4, 0.6, 1.2)
    tuft.position.set(fx, fy, fz)
    standGroup.add(tuft)
  }
  addTuft(-0.14, 0.32, 0, 0.08)
  addTuft(0.02, 0.39, 0.02, 0.095)
  addTuft(0.12, 0.34, -0.02, 0.075)

  group.add(standGroup)

  // 4. Dedicated soft Tokonoma warm accent spotlight
  const alcoveLight = new THREE.SpotLight("#fff1d6", 3.2, 5.5, Math.PI / 4, 0.6, 1.2)
  alcoveLight.position.set(0, platformH + 3.2, platformZ + 1.2)
  alcoveLight.target.position.set(0, scrollY, scrollZ)
  group.add(alcoveLight, alcoveLight.target)

  return group
}

/**
 * Creates a serene particle system of floating Sakura (cherry blossom) petals and warm Zen motes.
 */
export function createSakuraParticles(count: number = 36): {
  group: THREE.Group
  update: (delta: number) => void
} {
  const group = new THREE.Group()

  const geo = new THREE.PlaneGeometry(0.045, 0.065)
  const petalMat = new THREE.MeshBasicMaterial({
    color: "#ffc9d6",
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  const moteMat = new THREE.MeshBasicMaterial({
    color: "#ffe5b4",
    transparent: true,
    opacity: 0.5,
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
      (Math.random() - 0.5) * 2.6,
      0.2 + Math.random() * 2.8,
      -10.5 + Math.random() * 12.5,
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
      if (p.mesh.position.y < 0.04) {
        p.mesh.position.y = 2.8 + Math.random() * 0.4
        p.mesh.position.x = (Math.random() - 0.5) * 2.6
        p.mesh.position.z = -10.5 + Math.random() * 12.5
      }
    }
  }

  return { group, update }
}
