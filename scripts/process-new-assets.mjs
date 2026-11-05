/**
 * One-off asset pipeline for the batch of new Meraki files (Nov 2026):
 * - team photos        -> public/thevertmenthe/team/*.png (720x960 portrait crop)
 * - 10 paintings       -> public/thevertmenthe/artworks/*.jpg (canvas regions cropped)
 * - Meraki logo        -> src/app/icon.png (favicon) + public/thevertmenthe/brand/meraki-logo.png (footer)
 * - SANMANYA logo      -> public/thevertmenthe/brand/sanmanya-logo.png (/sanmanya hero)
 */
import sharp from "sharp"

const A = "public/thevertmenthe/artworks"
const B = "public/thevertmenthe/brand"
const T = "public/thevertmenthe/team"

// fractional crop boxes for photos taken against walls/tiles [left, top, right, bottom]
const CROPS = {
  "PHOTO-2026-10-30-15-38-48 2.jpg": [0.21, 0.265, 0.77, 0.86], // red dome (portrait)
  "PHOTO-2026-10-30-15-38-48 4.jpg": [0.183, 0.013, 0.75, 0.917], // dancers (landscape)
  "PHOTO-2026-10-30-15-40-46.jpg": [0.066, 0.063, 0.877, 0.9], // boats at dusk
  "PHOTO-2026-10-30-15-40-47.jpg": [0.09, 0.178, 0.914, 0.79], // fishing boat
}

const BRIGHTEN = {
  "PHOTO-2026-10-30-15-40-46.jpg": 1.3,
  "PHOTO-2026-10-30-15-40-47.jpg": 1.35,
}

const INSET = {
  "PHOTO-2026-10-30-15-40-07 5.jpg": 0.02, // tree watercolor
  "PHOTO-2026-10-30-15-40-07.jpg": 0.02, // clouds watercolor
  "painting 1.jpg": 0.065, // night marsh (white margin)
}

// ---------------------------------------------------------------- paintings
const paintings = [
  { src: "Men at work_2026_Oil on Canvas_36 inch by 30 icnh.png", out: "men-at-work.jpg", w: 1200 },
  { src: "inside out png.png", out: "inside-out.jpg", w: 1200 },
  { src: "painting 1.jpg", out: "night-marsh.jpg", w: 1000 },
  { src: "painting 2.jpg", out: "golden-mountains.jpg", w: 1200 },
  { src: "PHOTO-2026-10-30-15-39-04.jpg", out: "blue-bird.jpg", w: 1000 },
  { src: "PHOTO-2026-10-30-15-39-04 2.jpg", out: "violet-faces.jpg", w: 1000 },
  { src: "PHOTO-2026-10-30-15-41-05 3.jpg", out: "krishna.jpg", w: 1000 },
  { src: "PHOTO-2026-10-30-15-41-05.jpg", out: "goddess.jpg", w: 1000 },
  { src: "PHOTO-2026-10-30-15-38-48 2.jpg", out: "red-dome.jpg", w: 900 },
  { src: "PHOTO-2026-10-30-15-38-48 4.jpg", out: "dancers.jpg", w: 1100 },
  { src: "PHOTO-2026-10-30-15-40-46.jpg", out: "boats-at-dusk.jpg", w: 1100 },
  { src: "PHOTO-2026-10-30-15-40-47.jpg", out: "fishing-boat.jpg", w: 900 },
  { src: "PHOTO-2026-10-30-15-40-07 5.jpg", out: "tree-watercolor.jpg", w: 900 },
  { src: "PHOTO-2026-10-30-15-40-07.jpg", out: "clouds-watercolor.jpg", w: 900 },
]
for (const { src, out, w } of paintings) {
  // bake EXIF rotation first so crop coordinates match the final orientation
  const buf = await sharp(src).rotate().toBuffer()
  const m = await sharp(buf).metadata()
  let p = sharp(buf)
  const crop = CROPS[src]
  if (crop) {
    p = p.extract({
      left: Math.round(m.width * crop[0]),
      top: Math.round(m.height * crop[1]),
      width: Math.round(m.width * (crop[2] - crop[0])),
      height: Math.round(m.height * (crop[3] - crop[1])),
    })
  } else if (INSET[src]) {
    const i = INSET[src]
    p = p.extract({
      left: Math.round(m.width * i),
      top: Math.round(m.height * i),
      width: Math.round(m.width * (1 - 2 * i)),
      height: Math.round(m.height * (1 - 2 * i)),
    })
  }
  if (BRIGHTEN[src]) p = p.modulate({ brightness: BRIGHTEN[src] })
  await p.resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toFile(`${A}/${out}`)
  console.log("art:", out)
}

// ---------------------------------------------------------------- logos
await sharp("Meraki official logo .png").resize(512, 512).png().toFile("src/app/icon.png")
console.log("favicon: src/app/icon.png")
await sharp("Meraki official logo .png").resize(512, 512).png().toFile(`${B}/meraki-logo.png`)
console.log("footer logo")
await sharp("SANMANYA OFFICIAL LOGO.png").resize({ width: 1200 }).png().toFile(`${B}/sanmanya-logo.png`)
console.log("sanmanya logo")
