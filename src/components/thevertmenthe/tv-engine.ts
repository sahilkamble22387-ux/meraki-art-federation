"use client"

/**
 * ThevertMenthe — three.js engine.
 * Faithful rebuild of thevertmenthe.dault-lafon.fr (three.js r158 original):
 * gallery room GLB, 8 wall frames + shader crossfade, floor spot rings,
 * projected "See details" links, walking character (walk/wait/hi animations),
 * camera follow + zoom, footprints, ink-flood page transition, joystick input.
 */
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import gsap from "gsap"
import { TV_ARTICLES } from "@/lib/thevertmenthe-articles"
import { TEAM, PARTNERS, ARTIST_FORM_URL } from "@/lib/meraki-content"
import { TV_DRAW_FRAGMENT, TV_DRAW_VERTEX } from "./tv-shaders"
import {
  createHinokiWoodTextures,
  createTatamiTexture,
  createWashiPlasterTexture,
  createShojiLatticeTexture,
  createHeroScrollTexture,
  HERO_BANNER_CTAS,
  type HeroBannerCta,
  createJapaneseSignTexture,
  createAndonLantern,
  createBonsaiBench,
  createTokonomaAlcove,
  createSakuraParticles,
  createPlaqueTexture,
  createScrollPanelTexture,
  createQuoteScrollTexture,
} from "./tv-japanese-theme"

const ASSET_BASE = "/thevertmenthe"

type TvArticle = (typeof TV_ARTICLES)[number]

type Cadre = {
  instance: THREE.Object3D
  draw: THREE.Mesh | null
  article?: TvArticle
  /** When set, the projected link opens an info panel instead of navigating. */
  panelId?: string
  linkLabel?: string
}

type FloorButton = {
  group: THREE.Group
  r2: THREE.Mesh
  isOpen: boolean
  cadreIndex: number
}

type LinkProj = {
  el: HTMLAnchorElement
  cadre: Cadre
  button: FloorButton
  visible: boolean
}

type Footprint = {
  mesh: THREE.Mesh
  life: number
}

export type EnginePhase = "loading" | "ready"

const STATIC_ASSETS = {
  models: ["personnage", "cadre", "galerie"] as const,
  textures: [
    "footprintL",
    "footprintR",
    "noise",
    "notfound",
    "marble_color",
    "marble_normal",
    "marble_roughness",
    "platre_roughness",
    "platre_color",
    "platre_normal",
    "description",
    "panneau_galerieL",
    "panneau_galerieR",
    "panneau_homeL",
    "panneau_homeR",
    "oeuvre",
  ] as const,
}

const STATIC_PATHS: Record<string, string> = {
  personnage: `${ASSET_BASE}/models/meraki_curator.glb`,
  cadre: `${ASSET_BASE}/models/cadre.glb`,
  galerie: `${ASSET_BASE}/models/galerie.glb`,
  footprintL: `${ASSET_BASE}/textures/footprintL2.png`,
  footprintR: `${ASSET_BASE}/textures/footprintR2.png`,
  noise: `${ASSET_BASE}/textures/noise.png`,
  notfound: `${ASSET_BASE}/textures/404.png`,
  marble_color: `${ASSET_BASE}/textures/marble/color.png`,
  marble_normal: `${ASSET_BASE}/textures/marble/normal.png`,
  marble_roughness: `${ASSET_BASE}/textures/marble/roughness.png`,
  platre_roughness: `${ASSET_BASE}/textures/platre/roughness.jpg`,
  platre_color: `${ASSET_BASE}/textures/platre/color.jpg`,
  platre_normal: `${ASSET_BASE}/textures/platre/normal.jpg`,
  description: `${ASSET_BASE}/textures/description.png`,
  panneau_galerieL: `${ASSET_BASE}/textures/panneau_galerieL.png`,
  panneau_galerieR: `${ASSET_BASE}/textures/panneau_galerieR.png`,
  panneau_homeL: `${ASSET_BASE}/textures/panneau_homeL.png`,
  panneau_homeR: `${ASSET_BASE}/textures/panneau_homeR.png`,
  oeuvre: `${ASSET_BASE}/textures/oeuvre.png`,
}

/** Home wall slots, in the original cadre_controller.000 -> .007 order. */
const HOME_SLOTS = [
  "image_left_bottom",
  "image_left_mid",
  "image_left_mid_loin",
  "image_left_top",
  "image_right_bottom",
  "image_right_mid",
  "image_right_mid_loin",
  "image_right_top",
] as const

const HOME_MAP: Record<(typeof HOME_SLOTS)[number], string> = {
  image_left_bottom: "men-at-work",
  image_left_mid: "inside-out",
  image_left_mid_loin: "krishna",
  image_left_top: "goddess",
  image_right_bottom: "blue-bird",
  image_right_mid: "violet-faces",
  image_right_mid_loin: "golden-mountains",
  image_right_top: "night-marsh",
}

/**
 * About room (Leadership Pavilion) wall plan, in HOME_SLOTS anchor order.
 * Portraits hang like paintings; the remaining four anchors carry the
 * Essence / Mission / Vision / Goals calligraphy panels.
 */
const ABOUT_SLOTS: Array<{
  kind: "member" | "panel"
  uid?: string
  panelId?: string
  kanji?: string
  title?: string
}> = [
  { kind: "member", uid: "kalyani-muley" },
  { kind: "panel", panelId: "essence", kanji: "魂", title: "The Essence" },
  { kind: "panel", panelId: "mission", kanji: "命", title: "Our Mission" },
  { kind: "member", uid: "ayush-bhoyar" },
  { kind: "member", uid: "aditya-muley" },
  { kind: "panel", panelId: "vision", kanji: "望", title: "Our Vision" },
  { kind: "member", uid: "khushali-naidu" },
  { kind: "panel", panelId: "goals", kanji: "志", title: "Strategic Goals" },
]

/** Number of artworks shown in the gallery corridor (the rest live in the menu vault). */
const GALLERY_COUNT = 10

/** Calligraphy panels hanging in the Leadership Pavilion (inside cadre frames). */
const ABOUT_PANELS_BUILDERS: Record<string, { kanji: string; title: string; subtitle: string }> = {
  essence: { kanji: "魂", title: "The Essence", subtitle: "The Essence of Meraki" },
  mission: { kanji: "命", title: "Our Mission", subtitle: "Discover · Elevate · Empower" },
  vision: { kanji: "望", title: "Our Vision", subtitle: "Dignity · Sovereignty · Independence" },
  goals: { kanji: "志", title: "Strategic Goals", subtitle: "Mobility · Dignity · Excellence · Unity" },
}

/** Partner plaques (Shore Global / Foxbytes) mounted on the side walls near the entrance. */
const PARTNER_PLAQUE_ANCHORS = [
  { x: -1.12, z: -11.02, rotY: 0, title: PARTNERS[0].name, subtitle: PARTNERS[0].role, brand: null },
  { x: 1.12, z: -11.02, rotY: 0, title: PARTNERS[1].name, subtitle: PARTNERS[1].role, brand: "brand:foxbytes" },
]

/** Floor rings in the Leadership Pavilion — darker & larger so the standing spots read clearly. */
const ABOUT_RING_STYLE = { color: "#5f4f3a", radius: 0.3 }

export class TvEngine {
  // ---------- core ----------
  private canvas!: HTMLCanvasElement
  private container!: HTMLElement
  private renderer!: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  camera!: THREE.PerspectiveCamera
  private clock = new THREE.Clock()
  private raf = 0
  private disposed = false
  isPhone = false

  // ---------- assets ----------
  private manager = new THREE.LoadingManager()
  private items: Record<string, any> = {}
  private loadTotal = 0
  private loadDone = 0

  // ---------- world ----------
  phase: EnginePhase = "loading"
  route: "home" | "gallery" | "about" | "article" = "home"
  private homeRoot: THREE.Group | null = null
  private galleryRoot: THREE.Group | null = null
  private aboutRoot: THREE.Group | null = null
  private cadres: Cadre[] = []
  private homeCadres: Cadre[] = []
  private galleryCadres: Cadre[] = []
  private aboutCadres: Cadre[] = []
  private buttons: FloorButton[] = []
  private homeButtons: FloorButton[] = []
  private galleryButtons: FloorButton[] = []
  private aboutButtons: FloorButton[] = []
  private links: LinkProj[] = []
  private spotLights: THREE.SpotLight[] = []
  private homeSize = { x: 1.4, zMin: -10.9, zMax: 3 }
  // corridor: 1.2m per artwork plus 4m of entrance/exit runway
  private gallerySize = GALLERY_COUNT * 1.2 + 4
  private autoNavFired = false
  lastGalleryX = 0
  private sakuraParticleSystem: { group: THREE.Group; update: (delta: number) => void } | null = null
  private gallerySakuraSystem: { group: THREE.Group; update: (delta: number) => void } | null = null
  private aboutSakuraSystem: { group: THREE.Group; update: (delta: number) => void } | null = null

  // ---------- character ----------
  private personnage: THREE.Object3D | null = null
  private mixer: THREE.AnimationMixer | null = null
  private animations: Record<"stay" | "walk" | "hi", THREE.AnimationAction> | null = null
  private currentAction: "stay" | "walk" | "hi" = "stay"
  private velocity = 1
  private keyPressed: Record<string, boolean> = {}
  private walkDir = new THREE.Vector3()
  private rotateQuaternion = new THREE.Quaternion()
  private rotateAngle = new THREE.Vector3(0, 1, 0)
  private fadeDuration = 0.2
  private walkAction: THREE.AnimationAction | null = null
  private walkDuration = 1
  private footprintFrames = [
    { progress: 9.4, foot: "left" as const, done: false },
    { progress: 56, foot: "right" as const, done: false },
  ]
  private lastProgress = 0
  private footprints: Footprint[] = []
  private controlsEnabled = false

  // ---------- joystick ----------
  private joyAngle = 0
  private joyDistance = 0

  // ---------- camera follow ----------
  private camTarget = new THREE.Vector3()
  private camPosTarget = new THREE.Vector3()
  private smoothedTarget = new THREE.Vector3()

  // ---------- callbacks (set by React) ----------
  onProgress: (pct: number) => void = () => {}
  onReady: () => void = () => {}
  onControlsVisible: (v: boolean) => void = () => {}
  onWalking: (walking: boolean) => void = () => {}
  openPanel: (id: string) => void = () => {}
  navigate: (path: string) => void = () => {}

  // ---------- home hero banner (raycast CTAs) ----------
  private heroScrollMesh: THREE.Mesh | null = null
  private raycaster = new THREE.Raycaster()
  private lastBannerClick = 0

  // ================= setup =================
  init(canvas: HTMLCanvasElement, container: HTMLElement) {
    this.canvas = canvas
    this.container = container
    this.isPhone = window.matchMedia("(max-width: 820px)").matches || "ontouchstart" in window || (navigator.maxTouchPoints > 0 && window.innerWidth <= 1024)
    this.velocity = 0.95

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    })
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.75
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.setClearColor("#000000")
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )
    this.camera.position.set(0, 1, 6)
    this.scene.add(this.camera)

    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
    window.addEventListener("resize", this.onResize)
    this.canvas.addEventListener("pointerdown", this.onCanvasPointerDown)
    this.canvas.addEventListener("pointermove", this.onCanvasPointerMove)

    const homeUids = new Set(Object.values(HOME_MAP))
    const hungCount = new Set([
      ...TV_ARTICLES.slice(0, GALLERY_COUNT).map((a) => a.uid),
      ...homeUids,
    ]).size
    this.loadTotal =
      STATIC_ASSETS.models.length +
      STATIC_ASSETS.textures.length +
      hungCount +
      TEAM.length +
      1
    this.loadAll()
    this.clock.start()
    this.raf = requestAnimationFrame(this.tick)
  }

  // ================= loading =================
  private trackLoad<T>(promise: Promise<T>): Promise<T> {
    this.loadDone += 1
    this.onProgress(Math.round((this.loadDone / this.loadTotal) * 100))
    return promise
  }

  private async loadAll() {
    const draco = new DRACOLoader()
    draco.setDecoderPath(`${ASSET_BASE}/draco/gltf/`)
    const gltfLoader = new GLTFLoader(this.manager)
    gltfLoader.setDRACOLoader(draco)
    const texLoader = new THREE.TextureLoader(this.manager)

    // models
    for (const name of STATIC_ASSETS.models) {
      try {
        const gltf = await gltfLoader.loadAsync(STATIC_PATHS[name])
        this.items[name] = gltf
      } catch {
        this.items[name] = null
      }
      this.trackLoad(Promise.resolve())
    }
    // static textures
    for (const name of STATIC_ASSETS.textures) {
      try {
        const tex = await texLoader.loadAsync(STATIC_PATHS[name])
        if (
          [
            "marble_color",
            "platre_color",
            "description",
            "panneau_galerieL",
            "panneau_galerieR",
            "panneau_homeL",
            "panneau_homeR",
            "notfound",
          ].includes(name)
        ) {
          tex.colorSpace = THREE.SRGBColorSpace
        }
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        this.items[name] = tex
      } catch {
        this.items[name] = null
      }
      this.trackLoad(Promise.resolve())
    }
    // artwork textures — only the ones actually hung (home slots + corridor) (keyed by uid)
    const homeUids = new Set(Object.values(HOME_MAP))
    const hung = TV_ARTICLES.filter((a, i) => i < GALLERY_COUNT || homeUids.has(a.uid))
    for (const a of hung) {
      try {
        const tex = await texLoader.loadAsync(a.image)
        tex.colorSpace = THREE.SRGBColorSpace
        this.items[a.uid] = tex
      } catch {
        this.items[a.uid] = null
      }
      this.trackLoad(Promise.resolve())
    }
    // partner brand marks
    try {
      const brandTex = await texLoader.loadAsync("/thevertmenthe/brand/foxbytes-mark.png")
      brandTex.colorSpace = THREE.SRGBColorSpace
      this.items["brand:foxbytes"] = brandTex
    } catch {
      this.items["brand:foxbytes"] = null
    }
    this.trackLoad(Promise.resolve())

    // team portraits for the Leadership Pavilion (keyed by uid)
    for (const m of TEAM) {
      try {
        const tex = await texLoader.loadAsync(m.photo)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        this.items[`team:${m.uid}`] = tex
      } catch {
        this.items[`team:${m.uid}`] = null
      }
      this.trackLoad(Promise.resolve())
    }

    if (this.disposed) return
    this.buildCharacter()
    this.applyRoute()
    this.phase = "ready"
    this.onReady()
  }

  // ================= character =================
  private buildCharacter() {
    const gltf = this.items.personnage
    if (!gltf) return
    const p = gltf.scene

    // Sculpted Japanese Clay Figurine for Meraki Art Federation
    p.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })

    p.scale.set(0.13, 0.13, 0.13)
    this.personnage = p

    // Warm museum studio lighting to showcase the smooth clay/ceramic tactile depth
    const clayKey = new THREE.DirectionalLight("#fff8f0", 1.35)
    clayKey.position.set(0, 10, 7)
    clayKey.target.position.set(0, 2.5, 0)
    p.add(clayKey, clayKey.target)

    const clayRim = new THREE.DirectionalLight("#faede0", 0.85)
    clayRim.position.set(0, 8, -6)
    clayRim.target.position.set(0, 2.5, 0)
    p.add(clayRim, clayRim.target)

    this.mixer = new THREE.AnimationMixer(p)
    const clips: THREE.AnimationClip[] = gltf.animations
    const findClip = (n: string) =>
      clips.find((c) => c.name.toLowerCase().includes(n)) ?? clips[0]
    const stay = this.mixer.clipAction(findClip("wait"))
    const walk = this.mixer.clipAction(findClip("walk"))
    const hi = this.mixer.clipAction(findClip("coucou"))
    walk.timeScale = 4.5
    hi.timeScale = 5
    stay.play()
    this.walkAction = walk
    this.walkDuration = walk.getClip().duration
    this.animations = { stay, walk, hi }
    this.currentAction = "stay"
    this.scene.add(p)
  }

  private playAnimation(e: "stay" | "walk" | "hi") {
    if (!this.animations || this.currentAction === e) return
    this.animations[this.currentAction].fadeOut(this.fadeDuration)
    this.animations[e].reset().fadeIn(this.fadeDuration).play()
    this.currentAction = e
  }

  /** Enable anisotropic filtering so canvas textures stay crisp at glancing angles. */
  private crisp<T extends THREE.Texture>(tex: T): T {
    tex.anisotropy = 8
    return tex
  }

  // ================= home world =================
  private buildHome() {
    const g = new THREE.Group()
    const galerie = this.items.galerie?.scene?.clone(true)
    if (!galerie) return
    galerie.position.y = -0.001

    // Generate Japanese procedural architectural textures (sepia-washi palette)
    const hinoki = createHinokiWoodTextures()
    const tatamiTex = createTatamiTexture()
    const washiPlaster = createWashiPlasterTexture()
    const shojiTex = createShojiLatticeTexture()
    // Home tokonoma banner carries the site headline, CTAs and trust badges
    const hero = createHeroScrollTexture(
      (this.items["brand:foxbytes"]?.image as HTMLImageElement) ?? null,
    )
    const kakejikuTex = this.crisp(hero.texture)

    const floor = galerie.getObjectByName("floor")
    const roof = galerie.getObjectByName("roof")
    const barriere = galerie.getObjectByName("barriere")
    const vitre = galerie.getObjectByName("vitre")

    // 1. Pale Natural Woven Tatami Matting covering the main floor (high contrast with black character)
    if (floor) {
      floor.receiveShadow = true
      const floorTatami = tatamiTex.clone()
      floorTatami.repeat.set(4, 16)
      floorTatami.needsUpdate = true
      const m = new THREE.MeshStandardMaterial({
        map: floorTatami,
        roughness: 0.9,
        metalness: 0.0,
      })
      const old: any[] = []
      floor.traverse((o: any) => o.isMesh && old.push(o.material))
      floor.traverse((o: any) => {
        if (o.isMesh) {
          o.material = m
          o.receiveShadow = true
        }
      })
      old.forEach((x) => x?.dispose?.())
    }

    // 3. Textured pale cream Washi plaster walls with soft diagonal sunlight shadows
    if (roof) {
      roof.receiveShadow = true
      const m = new THREE.MeshStandardMaterial({
        map: washiPlaster,
        roughness: 0.95,
        metalness: 0.02,
      })
      roof.traverse((o: any) => {
        if (o.isMesh) o.material = m
      })
    }

    // 4. Shoji & Kumiko Wood Lattice Skylight (soft neutral daylight, no orange glow)
    if (vitre) {
      const shojiMat = new THREE.MeshStandardMaterial({
        map: shojiTex,
        roughness: 0.7,
        emissive: "#faf7f2",
        emissiveIntensity: 0.08,
      })
      vitre.traverse((o: any) => {
        if (o.isMesh) o.material = shojiMat
      })
    }

    const cadreNode = galerie.getObjectByName("vitre_cadre")
    if (cadreNode) {
      const darkWood = new THREE.MeshStandardMaterial({ color: "#161311", roughness: 0.8 })
      cadreNode.traverse((o: any) => {
        if (o.isMesh) o.material = darkWood
      })
    }

    if (barriere) {
      const darkWood = new THREE.MeshStandardMaterial({ color: "#1a1613", roughness: 0.75 })
      barriere.traverse((o: any) => {
        if (o.isMesh) {
          o.material = darkWood
          o.castShadow = true
        }
      })
    }

    const lightMeshes: THREE.Object3D[] = []
    const anchors: THREE.Object3D[] = []
    galerie.traverse((o: THREE.Object3D) => {
      if (o.name.includes("lights")) lightMeshes.push(o)
      if (o.name.includes("cadre_controller")) anchors.push(o)
    })
    anchors.sort((a, b) => a.name.localeCompare(b.name))
    galerie.scale.set(0.08, 0.08, 0.08)
    g.add(galerie)

    // 5. Clean, Natural Museum Daylight (Neutral & Crisp, matching reference image)
    const amb = new THREE.AmbientLight("#f2ede4", 0.78)
    const dir = new THREE.DirectionalLight("#faf7f0", 1.15)
    dir.position.set(0.9, 2.6, 0)
    dir.target.position.set(-1.2, 0, -0.8)
    dir.shadow.mapSize.width = 1024
    dir.shadow.mapSize.height = 1024
    dir.shadow.camera.left = -15
    dir.shadow.camera.right = 15
    dir.shadow.camera.top = 5
    dir.shadow.camera.bottom = -5
    dir.shadow.camera.near = 0.1
    dir.shadow.camera.far = 20
    dir.castShadow = true

    const dir2 = new THREE.DirectionalLight("#eae6de", 0.5)
    dir2.position.set(-0.9, 2.6, 0)
    dir2.target.position.set(1.2, 0, 0)
    dir2.shadow.mapSize.width = 1024
    dir2.shadow.mapSize.height = 1024
    dir2.shadow.camera.left = -15
    dir2.shadow.camera.right = 15
    dir2.shadow.camera.top = 5
    dir2.shadow.camera.bottom = -5
    dir2.shadow.camera.near = 0.1
    dir2.shadow.camera.far = 20
    dir2.castShadow = true
    g.add(amb, dir, dir2, dir.target, dir2.target)

    if (!this.isPhone) {
      lightMeshes.forEach((lm, i) => {
        const spot = new THREE.SpotLight("#fcf9f2", 3.8, 6, Math.PI / 6, 0.45, 1)
        const pos = new THREE.Vector3()
        lm.getWorldPosition(pos)
        spot.position.copy(pos)
        const target = new THREE.Vector3(
          i % 2 ? pos.x + 2 : pos.x - 2,
          pos.y - 1,
          pos.z,
        )
        spot.target.position.copy(target)
        spot.updateMatrixWorld(true)
        spot.target.updateMatrixWorld(true)
        this.spotLights.push(spot)
        g.add(spot, spot.target)
      })
    }

    // 6. Andon Floor Paper Lanterns with gentle soft neutral illumination (along side borders)
    const lanternCoords: Array<[number, number]> = [
      [-1.48, -1.4],
      [1.48, -1.4],
      [-1.48, -5.0],
      [1.48, -5.0],
      [-1.48, -8.6],
      [1.48, -8.6],
      [1.48, 0.8],
    ]
    lanternCoords.forEach(([lx, lz]) => {
      const lantern = createAndonLantern(lx, lz, 0.35)
      g.add(lantern)
    })

    // 7. Low Dark Timber Bench with Bonsai Pine on the Left
    const bonsaiBench = createBonsaiBench(-1.35, -0.6)
    g.add(bonsaiBench)

    // 9. Tokonoma Alcove with the wide landscape hero banner
    const tokonoma = createTokonomaAlcove(-10.8, kakejikuTex, tatamiTex, {
      w: 2.9,
      h: 1.45,
      y: 1.85,
    })
    g.add(tokonoma)
    this.heroScrollMesh = (tokonoma.getObjectByName("tokonoma_scroll") as THREE.Mesh) ?? null

    // lift the ceiling track fixtures so they clear the taller banner
    galerie.traverse((o: THREE.Object3D) => {
      if (o.name.startsWith("light_controller")) o.position.y += 0.35 / 0.08
    })

    // 10. Traditional Dark Timber Directional Signs
    const signLTex = createJapaneseSignTexture("回廊", "Gallery", "left")
    const signRTex = createJapaneseSignTexture("回廊", "Gallery", "right")
    const signList: Array<[string, number, THREE.CanvasTexture]> = [
      ["galleryL", 0.01, signLTex],
      ["galleryR", -0.01, signRTex],
    ]
    for (const [nm, off, signTex] of signList) {
      const anchor = galerie.getObjectByName(nm)
      if (!anchor) continue
      const geo = new THREE.PlaneGeometry(2, 1)
      const mat = new THREE.MeshBasicMaterial({
        map: signTex,
        transparent: true,
      })
      const plane = new THREE.Mesh(geo, mat)
      const wp = new THREE.Vector3()
      anchor.getWorldPosition(wp)
      const wq = new THREE.Quaternion()
      anchor.getWorldQuaternion(wq)
      plane.position.copy(wp)
      plane.position.x += off
      plane.quaternion.copy(wq)
      plane.scale.set(0.32, 0.32, 0.32)
      g.add(plane)
    }

    // 11. Floating Sakura Petals Particle System
    const sakura = createSakuraParticles(36)
    this.sakuraParticleSystem = sakura
    g.add(sakura.group)

    // 12. Framed Artworks on the Anchors
    const uids = HOME_SLOTS.map((s) => HOME_MAP[s])
    this.homeCadres = []
    this.homeButtons = []
    anchors.forEach((anchor, n) => {
      const uid = uids[n % uids.length]
      const article = TV_ARTICLES.find((a) => a.uid === uid)
      const tex = this.items[uid]
      const cadre = this.buildCadre(g, anchor, 2, tex, article)
      this.homeCadres.push(cadre)
      this.homeButtons.push(this.buildFloorButton(g, cadre, "home", n))
    })
    this.cadres = this.homeCadres
    this.buttons = this.homeButtons

    this.homeRoot = g
    this.scene.add(g)
  }

  private buildCadre(
    parentGroup: THREE.Group,
    anchor: THREE.Object3D,
    scale: number,
    tex: any,
    article?: TvArticle,
    panelId?: string,
    linkLabel?: string,
  ): Cadre {
    const src = this.items.cadre?.scene as THREE.Object3D | undefined
    const instance = src ? src.clone(true) : new THREE.Group()
    const wp = new THREE.Vector3()
    anchor.getWorldPosition(wp)
    const wq = new THREE.Quaternion()
    anchor.getWorldQuaternion(wq)
    instance.position.copy(wp)
    instance.position.y += 0.1
    instance.quaternion.copy(wq)
    instance.scale.set(0.12 * scale, 0.12 * scale, 0.12 * scale)

    // Dark smoked ebony outer frame moulding
    instance.traverse((o: any) => {
      if (o.isMesh && o.name !== "draw" && o.name !== "marieLouise") {
        o.material = new THREE.MeshStandardMaterial({
          color: "#161311",
          roughness: 0.65,
          metalness: 0.08,
        })
      }
    })

    const draw = instance.getObjectByName("draw") as THREE.Mesh | null
    if (draw) {
      if (tex) {
        // keep the artwork's own aspect inside the mat opening (museum matting)
        try {
          const geom = draw.geometry as THREE.PlaneGeometry
          const openingAspect = geom.parameters.width / geom.parameters.height
          const img = tex.image as { width: number; height: number }
          const imgAspect = img.width / img.height
          draw.scale.set(
            draw.scale.x * Math.min(1, openingAspect / imgAspect),
            draw.scale.y * Math.min(1, imgAspect / openingAspect),
            draw.scale.z,
          )
        } catch {
          /* non-planar geometry — keep native scale */
        }
        draw.material = new THREE.ShaderMaterial({
          vertexShader: TV_DRAW_VERTEX,
          fragmentShader: TV_DRAW_FRAGMENT,
          uniforms: {
            u_tex: { value: tex },
            u_next: { value: tex },
            u_noise: { value: this.items.noise },
            u_progress: { value: 1 },
          },
        })
      } else {
        draw.material = new THREE.MeshBasicMaterial({ color: "red" })
      }
    }
    const ml = instance.getObjectByName("marieLouise") as THREE.Mesh | null
    if (ml) {
      ml.material = new THREE.MeshStandardMaterial({
        color: "#f6f3eb", // pale off-white washi paper matting
        roughness: 0.95,
      })
    }
    parentGroup.add(instance)
    return { instance, draw, article, panelId, linkLabel }
  }

  private buildFloorButton(
    parentGroup: THREE.Group,
    cadre: Cadre,
    world: "home" | "gallery",
    index: number,
    style?: { color?: string; radius?: number },
  ): FloorButton {
    const color = style?.color ?? "#c0b29c"
    const radius = style?.radius ?? 0.23
    const group = new THREE.Group()
    const mk = () => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(radius, radius + 0.014, 64, 1),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
      )
      m.rotation.x = -Math.PI * 0.5
      return m
    }
    const r1 = mk()
    const r2 = mk()
    group.add(r1, r2)
    group.position.copy(cadre.instance.position)
    if (world === "home") {
      const x = cadre.instance.position.x
      if (Math.abs(x) < 0.01) {
        group.position.x = 0
        group.position.z += 0.8
      } else if (x > 0) {
        group.position.x = 1.2
      } else {
        group.position.x = -1.2
      }
    } else {
      group.position.z += 0.5
    }
    group.position.y = 0.01
    parentGroup.add(group)
    return { group, r2, isOpen: false, cadreIndex: index }
  }

  // ================= gallery world =================
  private buildGallery() {
    const g = new THREE.Group()
    const size = this.gallerySize
    const totalLength = 4 + size

    // Generate Japanese procedural architectural textures (sepia-washi palette)
    const hinoki = createHinokiWoodTextures()
    hinoki.colorMap.repeat.set(totalLength / 3, 2.5)
    hinoki.roughnessMap.repeat.set(totalLength / 3, 2.5)

    const tatamiTex = createTatamiTexture()
    tatamiTex.repeat.set(totalLength / 2.2, 1)

    const washiPlaster = createWashiPlasterTexture()
    washiPlaster.repeat.set(totalLength / 5, 2)

    const shojiTex = createShojiLatticeTexture()
    shojiTex.repeat.set(totalLength / 4, 1.2)

    // 1. Gallery Main Flooring - Pale Natural Woven Tatami Mats (high contrast with black character)
    const galleryTatami = tatamiTex.clone()
    galleryTatami.repeat.set(totalLength / 2.2, 2.5)
    galleryTatami.needsUpdate = true
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(totalLength, 4),
      new THREE.MeshStandardMaterial({
        map: galleryTatami,
        roughness: 0.9,
        metalness: 0.0,
      }),
    )
    floor.rotation.x = -Math.PI * 0.5
    floor.position.set(totalLength / 2 - 2, 0, 1)
    floor.receiveShadow = true
    g.add(floor)

    // 2. Textured pale cream Washi plaster walls with soft diagonal sunlight shadows
    const wallMat = new THREE.MeshStandardMaterial({
      map: washiPlaster,
      roughness: 0.95,
      side: THREE.DoubleSide,
    })
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(totalLength, 10),
      wallMat,
    )
    wall.position.set(totalLength / 2 - 2, 5, -0.5)
    wall.receiveShadow = true
    g.add(wall)

    // 4. End walls enclosing the gallery hall
    const endWallGeo = new THREE.PlaneGeometry(4, 10)
    const endWallLeft = new THREE.Mesh(endWallGeo, wallMat)
    endWallLeft.rotation.y = Math.PI * 0.5
    endWallLeft.position.set(-2, 5, 1)
    g.add(endWallLeft)

    const endWallRight = new THREE.Mesh(endWallGeo, wallMat)
    endWallRight.rotation.y = -Math.PI * 0.5
    endWallRight.position.set(size + 2, 5, 1)
    g.add(endWallRight)

    // 5. Shoji & Kumiko Wood Lattice Skylight Ceiling (soft neutral daylight, no orange glow)
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(totalLength, 4),
      new THREE.MeshStandardMaterial({
        map: shojiTex,
        roughness: 0.7,
        emissive: "#faf7f2",
        emissiveIntensity: 0.08,
        side: THREE.DoubleSide,
      }),
    )
    ceil.rotation.x = Math.PI * 0.5
    ceil.position.set(totalLength / 2 - 2, 10, 1)
    g.add(ceil)

    // 6. Clean, Natural Museum Daylight (Neutral & Crisp, matching reference image)
    const amb = new THREE.AmbientLight("#f2ede4", 0.78)
    const dir = new THREE.DirectionalLight("#faf7f0", 1.1)
    dir.position.set(totalLength / 2 - 2, 8, 4)
    dir.target.position.set(totalLength / 2 - 2, 0, -0.5)
    g.add(amb, dir, dir.target)

    // 7. Procession of Andon Floor Paper Lanterns along the walkway (subtle illumination)
    for (let lx = 1.2; lx <= size - 4; lx += 6.0) {
      const lantern = createAndonLantern(lx, 1.35, 0.3)
      g.add(lantern)
    }

    // 8. Low Dark Timber Bench with Bonsai Pine at Gallery Entrance
    const bonsaiBench = createBonsaiBench(0.2, 0.35)
    g.add(bonsaiBench)

    // 9. Floating Sakura Petals in Gallery
    const gallerySakura = createSakuraParticles(48, {
      xMin: -1,
      xMax: size + 1,
      yMin: 0.2,
      yMax: 3.2,
      zMin: -0.4,
      zMax: 1.8,
    })
    this.gallerySakuraSystem = gallerySakura
    g.add(gallerySakura.group)

    // 11. Japanese Dark Timber Directional Signs at both ends
    const signEntranceTex = this.crisp(createJapaneseSignTexture("回廊", "Exhibition Corridor", "right"))
    const signAboutTex = this.crisp(createJapaneseSignTexture("人物", "About Us", "right"))

    const addSign = (tex: THREE.CanvasTexture, x: number) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 1),
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
        }),
      )
      plane.scale.set(0.32, 0.32, 0.32)
      plane.position.set(x, 1, -0.46)
      g.add(plane)
    }
    addSign(signEntranceTex, 0)
    addSign(signAboutTex, size - 2)

    // 12a. About-room door at the corridor's end wall: walking straight past the
    // last artwork enters the Leadership Pavilion (trigger in updateCharacter).
    const endWallX = size + 2
    const doorway = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 2.6),
      new THREE.MeshBasicMaterial({ color: "#060505" }),
    )
    doorway.position.set(endWallX - 0.06, 1.3, 1)
    doorway.rotation.y = -Math.PI * 0.5
    g.add(doorway)

    const doorwayGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.06),
      new THREE.MeshBasicMaterial({ color: "#3d332a" }),
    )
    doorwayGlow.position.set(endWallX - 0.055, 2.6, 1)
    doorwayGlow.rotation.y = -Math.PI * 0.5
    g.add(doorwayGlow)

    const aboutDoorSign = this.crisp(createJapaneseSignTexture("人物", "About Us", "none"))
    const aboutDoorSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 1),
      new THREE.MeshBasicMaterial({ map: aboutDoorSign, transparent: true }),
    )
    aboutDoorSignMesh.scale.set(0.42, 0.42, 0.42)
    aboutDoorSignMesh.position.set(endWallX - 0.12, 3.05, 1)
    aboutDoorSignMesh.rotation.y = -Math.PI * 0.5
    g.add(aboutDoorSignMesh)

    // 12b. Home door on the entrance end wall: walking back down the corridor
    // returns to the Home pavilion (trigger in updateCharacter).
    const backDoor = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 2.6),
      new THREE.MeshBasicMaterial({ color: "#060505" }),
    )
    backDoor.position.set(-1.94, 1.3, 1)
    backDoor.rotation.y = Math.PI * 0.5
    g.add(backDoor)

    const backDoorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.06),
      new THREE.MeshBasicMaterial({ color: "#3d332a" }),
    )
    backDoorGlow.position.set(-1.945, 2.6, 1)
    backDoorGlow.rotation.y = Math.PI * 0.5
    g.add(backDoorGlow)

    const homeDoorSign = this.crisp(createJapaneseSignTexture("本館", "Home", "none"))
    const homeDoorSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 1),
      new THREE.MeshBasicMaterial({ map: homeDoorSign, transparent: true }),
    )
    homeDoorSignMesh.scale.set(0.42, 0.42, 0.42)
    homeDoorSignMesh.position.set(-1.88, 3.05, 1)
    homeDoorSignMesh.rotation.y = Math.PI * 0.5
    g.add(homeDoorSignMesh)

    // 12. The corridor hangs the first GALLERY_COUNT artworks (the full vault
    // stays reachable through the menu search)
    this.galleryCadres = []
    this.galleryButtons = []
    TV_ARTICLES.slice(0, GALLERY_COUNT).forEach((a, n) => {
      const tex = this.items[a.uid]
      const anchor = new THREE.Object3D()
      anchor.position.set(1.2 + n * 1.2, 0.99 + (n % 2) * 0.99, -0.48)
      anchor.updateMatrixWorld(true)
      const cadre = this.buildCadre(g, anchor, 1.5, tex, a)
      this.galleryCadres.push(cadre)
      this.galleryButtons.push(this.buildFloorButton(g, cadre, "gallery", n))
    })
    this.cadres = this.galleryCadres
    this.buttons = this.galleryButtons

    this.galleryRoot = g
    this.scene.add(g)
  }

  // ================= about world (Leadership Pavilion) =================
  private buildAbout() {
    const g = new THREE.Group()
    const galerie = this.items.galerie?.scene?.clone(true)
    if (!galerie) return
    galerie.position.y = -0.001

    const tatamiTex = createTatamiTexture()
    const washiPlaster = createWashiPlasterTexture()
    const shojiTex = createShojiLatticeTexture()

    const floor = galerie.getObjectByName("floor")
    const roof = galerie.getObjectByName("roof")
    const barriere = galerie.getObjectByName("barriere")
    const vitre = galerie.getObjectByName("vitre")

    if (floor) {
      const floorTatami = tatamiTex.clone()
      floorTatami.repeat.set(4, 16)
      floorTatami.needsUpdate = true
      const m = new THREE.MeshStandardMaterial({ map: floorTatami, roughness: 0.9, metalness: 0.0 })
      floor.traverse((o: any) => {
        if (o.isMesh) {
          o.material = m
          o.receiveShadow = true
        }
      })
    }

    if (roof) {
      const m = new THREE.MeshStandardMaterial({ map: washiPlaster, roughness: 0.95, metalness: 0.02 })
      roof.traverse((o: any) => {
        if (o.isMesh) o.material = m
      })
    }

    // Evening skylight — dimmer, warmer than the daylight pavilion
    if (vitre) {
      const shojiMat = new THREE.MeshStandardMaterial({
        map: shojiTex,
        roughness: 0.7,
        emissive: "#e8d9c2",
        emissiveIntensity: 0.05,
      })
      vitre.traverse((o: any) => {
        if (o.isMesh) o.material = shojiMat
      })
    }

    const cadreNode = galerie.getObjectByName("vitre_cadre")
    if (cadreNode) {
      const darkWood = new THREE.MeshStandardMaterial({ color: "#161311", roughness: 0.8 })
      cadreNode.traverse((o: any) => {
        if (o.isMesh) o.material = darkWood
      })
    }

    if (barriere) {
      const darkWood = new THREE.MeshStandardMaterial({ color: "#1a1613", roughness: 0.75 })
      barriere.traverse((o: any) => {
        if (o.isMesh) {
          o.material = darkWood
          o.castShadow = true
        }
      })
    }

    const lightMeshes: THREE.Object3D[] = []
    const anchors: THREE.Object3D[] = []
    galerie.traverse((o: THREE.Object3D) => {
      if (o.name.includes("lights")) lightMeshes.push(o)
      if (o.name.includes("cadre_controller")) anchors.push(o)
    })
    anchors.sort((a, b) => a.name.localeCompare(b.name))
    galerie.scale.set(0.08, 0.08, 0.08)
    g.add(galerie)

    // Warm evening chamber lighting
    const amb = new THREE.AmbientLight("#c7b49c", 0.6)
    const dir = new THREE.DirectionalLight("#e8cdb0", 0.75)
    dir.position.set(0.9, 2.6, 1.5)
    dir.target.position.set(0, 1, -2)
    dir.shadow.mapSize.width = 1024
    dir.shadow.mapSize.height = 1024
    dir.shadow.camera.left = -15
    dir.shadow.camera.right = 15
    dir.shadow.camera.top = 5
    dir.shadow.camera.bottom = -5
    dir.castShadow = true
    const dir2 = new THREE.DirectionalLight("#8f8578", 0.35)
    dir2.position.set(-0.9, 2.6, 0)
    dir2.target.position.set(1.2, 0, 0)
    g.add(amb, dir, dir.target, dir2, dir2.target)

    if (!this.isPhone) {
      lightMeshes.forEach((lm, i) => {
        const spot = new THREE.SpotLight("#f3e0bd", 3.4, 6, Math.PI / 6, 0.45, 1)
        const pos = new THREE.Vector3()
        lm.getWorldPosition(pos)
        spot.position.copy(pos)
        // rake the beam across the wall frames like the home pavilion does
        const target = new THREE.Vector3(
          i % 2 ? pos.x + 2 : pos.x - 2,
          pos.y - 1,
          pos.z,
        )
        spot.target.position.copy(target)
        spot.updateMatrixWorld(true)
        spot.target.updateMatrixWorld(true)
        g.add(spot, spot.target)
      })
    }

    // Andon lanterns, more of them for the evening tone
    const lanternCoords: Array<[number, number]> = [
      [-1.48, -1.4],
      [1.48, -1.4],
      [-1.48, -5.0],
      [1.48, -5.0],
      [-1.48, -8.6],
      [1.48, -8.6],
      [-1.48, 0.8],
      [1.48, 0.8],
      [-1.48, 2.0],
      [1.48, 2.0],
    ]
    lanternCoords.forEach(([lx, lz]) => {
      g.add(createAndonLantern(lx, lz, 0.5))
    })

    // Bonsai bench on the right this time
    g.add(createBonsaiBench(1.35, -0.6))

    // Founder quote scroll in the tokonoma alcove
    const quoteTex = this.crisp(createQuoteScrollTexture(
      "Meraki is not everywhere, but somewhere it stands with dignity.",
      "Ayush Milind Bhoyar",
    ))
    const tokonoma = createTokonomaAlcove(-10.8, quoteTex, tatamiTex)
    g.add(tokonoma)

    // Room sign above the tokonoma
    const roomSignTex = this.crisp(createJapaneseSignTexture("人物", "The People of Meraki", "none"))
    const roomSign = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 1),
      new THREE.MeshBasicMaterial({ map: roomSignTex, transparent: true }),
    )
    roomSign.scale.set(0.34, 0.34, 0.34)
    roomSign.position.set(0, 3.35, -11.05)
    g.add(roomSign)

    // Partner plaques flanking the entrance, mounted on the side walls
    PARTNER_PLAQUE_ANCHORS.forEach(({ x, z, rotY, title, subtitle, brand }) => {
      const logo = brand ? ((this.items[brand]?.image as HTMLImageElement) ?? null) : null
      const tex = this.crisp(createPlaqueTexture(title, subtitle, logo))
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.82, 0.31),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }),
      )
      plane.position.set(x, 1.55, z)
      plane.rotation.y = rotY
      g.add(plane)
    })

    // Exit signs back to the Gallery (same anchors as the home room)
    const signLTex = this.crisp(createJapaneseSignTexture("回廊", "Gallery", "left"))
    const signRTex = this.crisp(createJapaneseSignTexture("回廊", "Gallery", "right"))
    for (const [nm, off, signTex] of [
      ["galleryL", 0.01, signLTex],
      ["galleryR", -0.01, signRTex],
    ] as Array<[string, number, THREE.CanvasTexture]>) {
      const anchor = galerie.getObjectByName(nm)
      if (!anchor) continue
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 1),
        new THREE.MeshBasicMaterial({ map: signTex, transparent: true }),
      )
      const wp = new THREE.Vector3()
      anchor.getWorldPosition(wp)
      const wq = new THREE.Quaternion()
      anchor.getWorldQuaternion(wq)
      plane.position.copy(wp)
      plane.position.x += off
      plane.quaternion.copy(wq)
      plane.scale.set(0.32, 0.32, 0.32)
      g.add(plane)
    }

    // Sakura petals, sparse for the calm evening mood
    const sakura = createSakuraParticles(22)
    this.aboutSakuraSystem = sakura
    g.add(sakura.group)

    // Portraits & calligraphy panels on the wall anchors
    this.aboutCadres = []
    this.aboutButtons = []
    anchors.forEach((anchor, n) => {
      const slot = ABOUT_SLOTS[n % ABOUT_SLOTS.length]
      const wp = new THREE.Vector3()
      anchor.getWorldPosition(wp)
      const wq = new THREE.Quaternion()
      anchor.getWorldQuaternion(wq)

      if (slot.kind === "member" && slot.uid) {
        const member = TEAM.find((m) => m.uid === slot.uid)
        if (!member) return
        const tex = this.items[`team:${member.uid}`]
        const cadre = this.buildCadre(
          g,
          anchor,
          2,
          tex,
          undefined,
          `member:${member.uid}`,
          `Meet ${member.name.split(" ")[0]}`,
        )
        this.aboutCadres.push(cadre)
        this.aboutButtons.push(
          this.buildFloorButton(g, cadre, "home", this.aboutCadres.length - 1, ABOUT_RING_STYLE),
        )

        // engraved name plaque just below the frame's real bounding box
        // (a fixed offset from the anchor let the plate clip into the frame)
        cadre.instance.updateMatrixWorld(true)
        const frameBox = new THREE.Box3().setFromObject(cadre.instance)
        const plaqueTex = this.crisp(createPlaqueTexture(member.name, `${member.role} — ${member.rank}`))
        const plaque = new THREE.Mesh(
          new THREE.PlaneGeometry(0.62, 0.23),
          new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.7 }),
        )
        plaque.position.set(wp.x, frameBox.min.y - 0.15, wp.z)
        plaque.quaternion.copy(wq)
        plaque.translateZ(0.022)
        g.add(plaque)
      } else if (slot.panelId) {
        const panel = ABOUT_PANELS_BUILDERS[slot.panelId]
        if (!panel) return
        const tex = this.crisp(createScrollPanelTexture(panel.kanji, panel.title, panel.subtitle))
        const cadre = this.buildCadre(g, anchor, 2, tex, undefined, slot.panelId, panel.title)
        this.aboutCadres.push(cadre)
        this.aboutButtons.push(
          this.buildFloorButton(g, cadre, "home", this.aboutCadres.length - 1, ABOUT_RING_STYLE),
        )
      }
    })

    this.cadres = this.aboutCadres
    this.buttons = this.aboutButtons

    this.aboutRoot = g
    this.scene.add(g)
  }

  // ================= DOM "See details" links =================
  private rebuildLinks() {
    this.links.forEach((l) => l.el.remove())
    this.links = []
    this.buttons.forEach((btn, i) => {
      const cadre = this.cadres[btn.cadreIndex] ?? this.cadres[i]
      if (!cadre) return
      const el = document.createElement("a")
      el.classList.add("gallery_link")
      el.classList.add("big_link")
      if (cadre.panelId) {
        el.href = `#${cadre.panelId}`
        el.innerHTML = `<p>${cadre.linkLabel ?? "View"}</p><div></div>`
        el.addEventListener("click", (ev) => {
          ev.preventDefault()
          this.onControlsVisible(true)
          this.openPanel(cadre.panelId!)
        })
      } else {
        el.href = `/gallery/${cadre.article?.uid ?? ""}`
        el.innerHTML = "<p>See details</p><div></div>"
        el.addEventListener("click", (ev) => {
          ev.preventDefault()
          this.lastGalleryX = this.personnage?.position.x ?? 0
          this.onControlsVisible(true)
          this.navigate(el.href)
        })
      }
      Object.assign(el.style, {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        transition: "opacity 0.2s ease",
      } as CSSStyleDeclaration)
      this.container.appendChild(el)
      this.links.push({ el, cadre, button: btn, visible: true })
    })
  }

  private updateLinks() {
    const e = this.isPhone ? 0.44 : 0.5
    const w = window.innerWidth
    const h = window.innerHeight
    this.links.forEach((l) => {
      const p = l.cadre.instance.position
      const v = new THREE.Vector3(
        p.x,
        p.y + 1,
        l.cadre.instance.rotation.y > 0 ? p.z + e : p.z - e,
      ).project(this.camera)
      const x = (v.x * 0.5 + 0.5) * w
      const y = (-v.y * 0.5 + 0.5) * h
      l.el.style.left = `${x}px`
      l.el.style.top = `${y}px`
      if (l.button.isOpen && l.visible) {
        l.el.classList.add("link_open")
      } else {
        l.el.classList.remove("link_open")
      }
    })
  }

  // ================= footprints =================
  private spawnFootprint(foot: "left" | "right") {
    if (!this.personnage) return
    const tex = foot === "left" ? this.items.footprintL : this.items.footprintR
    if (!tex) return
    const boneName = foot === "left" ? "pied_L" : "pied_R"
    const bone = this.personnage.getObjectByName(boneName)
    const pos = new THREE.Vector3()
    const lateral = new THREE.Vector3(1, 0, 0).applyQuaternion(this.personnage.quaternion)
    const sideOffset = foot === "left" ? -0.055 : 0.055

    if (bone) {
      bone.getWorldPosition(pos)
      // Ensure two clear, distinct leg tracks
      pos.addScaledVector(lateral, sideOffset * 0.45)
    } else {
      pos.copy(this.personnage.position)
      pos.addScaledVector(lateral, sideOffset)
    }
    pos.y = 0.003

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.10, 0.16), mat)
    m.quaternion.copy(this.personnage.quaternion)
    m.rotateX(-Math.PI * 0.5)
    m.rotateZ(Math.PI)
    m.position.copy(pos)
    this.scene.add(m)
    const fp = { mesh: m, life: 0 }
    this.footprints.push(fp)
  }

  // ================= input =================
  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      const tag = (document.activeElement as HTMLElement | null)?.tagName
      if (tag !== "INPUT" && this.phase === "ready" && this.route !== "article") {
        this.activateOpenButton()
      }
    }
    this.keyPressed[e.code.toLowerCase()] = true
  }
  private onKeyUp = (e: KeyboardEvent) => {
    this.keyPressed[e.code.toLowerCase()] = false
  }

  /** Opens the detail of the floor button the visitor is standing on (Enter / ⏎). */
  private activateOpenButton() {
    const btn = this.buttons.find((b) => b.isOpen)
    if (!btn) return
    const cadre = this.cadres[btn.cadreIndex]
    if (!cadre) return
    if (cadre.panelId) {
      this.openPanel(cadre.panelId)
      return
    }
    if (cadre.article) {
      this.lastGalleryX = this.personnage?.position.x ?? 0
      this.onControlsVisible(true)
      this.navigate(`/gallery/${cadre.article.uid}`)
    }
  }
  private onResize = () => {
    if (!this.renderer) return
    this.isPhone = window.matchMedia("(max-width: 820px)").matches || "ontouchstart" in window || (navigator.maxTouchPoints > 0 && window.innerWidth <= 1024)
    this.velocity = 0.95
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  setJoystick(angle: number, distance: number) {
    this.joyAngle = angle
    this.joyDistance = distance
  }

  /** Pause/resume walking input (used while an info card is open). */
  setControls(v: boolean) {
    this.controlsEnabled = v
    this.onControlsVisible(v)
  }

  // ================= home hero banner clicks =================
  private bannerCtaAt(uv: THREE.Vector2 | undefined): HeroBannerCta | null {
    if (!uv) return null
    return (
      HERO_BANNER_CTAS.find(
        (c) => uv.x >= c.u0 && uv.x <= c.u1 && uv.y >= c.v0 && uv.y <= c.v1,
      ) ?? null
    )
  }

  private raycastBanner(e: PointerEvent): { cta: HeroBannerCta | null } {
    if (this.phase !== "ready" || this.route !== "home" || !this.heroScrollMesh) {
      return { cta: null }
    }
    const rect = this.canvas.getBoundingClientRect()
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      return { cta: null }
    }
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(ndc, this.camera)
    const hit = this.raycaster.intersectObject(this.heroScrollMesh, false)[0]
    return { cta: hit ? this.bannerCtaAt(hit.uv) : null }
  }

  private onCanvasPointerDown = (e: PointerEvent) => {
    const now = performance.now()
    if (now - this.lastBannerClick < 800) return
    const { cta } = this.raycastBanner(e)
    if (!cta) return
    this.lastBannerClick = now
    if (cta.id === "apply" && ARTIST_FORM_URL) {
      window.open(ARTIST_FORM_URL, "_blank", "noopener")
      return
    }
    this.onControlsVisible(false)
    this.controlsEnabled = false
    this.navigate(cta.id === "sanmanya" ? "/sanmanya" : "/partner")
  }

  private onCanvasPointerMove = (e: PointerEvent) => {
    const { cta } = this.raycastBanner(e)
    this.canvas.style.cursor = cta ? "pointer" : ""
  }

  // ================= routing =================
  setRoute(path: string): "home" | "gallery" | "about" | "article" {
    let r: "home" | "gallery" | "about" | "article" = "article"
    if (path === "" || path === "/" || path === "/thevertmenthe" || path === "/thevertmenthe/") r = "home"
    else if (path === "/gallery" || path === "/thevertmenthe/gallery") r = "gallery"
    else if (path === "/about") r = "about"
    this.route = r
    if (this.phase !== "ready") return r
    this.applyRoute()
    return r
  }

  private applyRoute() {
    this.links.forEach((l) => l.el.remove())
    this.links = []
    this.autoNavFired = false

    if (this.homeRoot) this.homeRoot.visible = false
    if (this.galleryRoot) this.galleryRoot.visible = false
    if (this.aboutRoot) this.aboutRoot.visible = false

    if (this.route === "home") {
      if (!this.homeRoot) this.buildHome()
      if (this.homeRoot) this.homeRoot.visible = true
      this.cadres = this.homeCadres
      this.buttons = this.homeButtons
      this.buttons.forEach((b) => {
        b.isOpen = false
        b.r2.position.y = 0
      })
      this.rebuildLinks()
      if (this.personnage) {
        this.personnage.position.set(0, 0, 0)
        this.camPosTarget.set(0, 1.25, 3.2)
        this.camTarget.set(0, 0.72, -0.5)
        this.camera.position.copy(this.camPosTarget)
        if (this.smoothedTarget) this.smoothedTarget.copy(this.camTarget)
        this.camera.lookAt(this.camTarget)
      }
      this.controlsEnabled = true
      this.onControlsVisible(true)
    } else if (this.route === "gallery") {
      if (!this.galleryRoot) this.buildGallery()
      if (this.galleryRoot) this.galleryRoot.visible = true
      this.cadres = this.galleryCadres
      this.buttons = this.galleryButtons
      this.buttons.forEach((b) => {
        b.isOpen = false
        b.r2.position.y = 0
      })
      this.rebuildLinks()
      if (this.personnage) {
        const gx = Math.max(0, this.lastGalleryX)
        this.personnage.position.set(gx, 0, 0.4)
        this.camPosTarget.set(gx, 1.25, 3.5)
        this.camTarget.set(gx, 0.72, -0.1)
        this.camera.position.copy(this.camPosTarget)
        if (this.smoothedTarget) this.smoothedTarget.copy(this.camTarget)
        this.camera.lookAt(this.camTarget)
      }
      this.controlsEnabled = true
      this.onControlsVisible(true)
    } else if (this.route === "about") {
      if (!this.aboutRoot) this.buildAbout()
      if (this.aboutRoot) this.aboutRoot.visible = true
      this.cadres = this.aboutCadres
      this.buttons = this.aboutButtons
      this.buttons.forEach((b) => {
        b.isOpen = false
        b.r2.position.y = 0
      })
      this.rebuildLinks()
      if (this.personnage) {
        this.personnage.position.set(0, 0, 0)
        this.camPosTarget.set(0, 1.25, 3.2)
        this.camTarget.set(0, 0.72, -0.5)
        this.camera.position.copy(this.camPosTarget)
        if (this.smoothedTarget) this.smoothedTarget.copy(this.camTarget)
        this.camera.lookAt(this.camTarget)
      }
      this.controlsEnabled = true
      this.onControlsVisible(true)
    } else {
      this.controlsEnabled = false
      this.onControlsVisible(false)
    }
  }

  // ================= main loop =================
  private directionOffset(keys: Record<string, boolean>): number {
    let t = 0
    if (this.joyDistance > 0) {
      return this.joyAngle
    }
    if (keys.keys || keys.arrowdown) {
      if (keys.keyd || keys.arrowright) t = Math.PI / 4
      else if (keys.keya || keys.arrowleft) t = -Math.PI / 4
    } else if (keys.keyw || keys.arrowup) {
      if (keys.keyd || keys.arrowright) t = Math.PI / 4 + Math.PI / 2
      else if (keys.keya || keys.arrowleft) t = -Math.PI / 4 - Math.PI / 2
      else t = Math.PI
    } else if (keys.keyd || keys.arrowright) {
      t = Math.PI / 2
    } else if (keys.keya || keys.arrowleft) {
      t = -Math.PI / 2
    }
    return t
  }

  private tick = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.tick)
    const delta = Math.min(this.clock.getDelta(), 0.1)

    if (this.phase === "ready" && this.route !== "article") {
      this.updateCharacter(delta)
      this.updateButtons()
      this.updateCamera()
      this.updateFootprints(delta)
      this.updateLinks()
      if (this.route === "home" && this.sakuraParticleSystem) {
        this.sakuraParticleSystem.update(delta)
      } else if (this.route === "gallery" && this.gallerySakuraSystem) {
        this.gallerySakuraSystem.update(delta)
      } else if (this.route === "about" && this.aboutSakuraSystem) {
        this.aboutSakuraSystem.update(delta)
      }
    }
    if (this.mixer) this.mixer.update(delta)

    this.renderer.render(this.scene, this.camera)
  }

  private updateCharacter(delta: number) {
    if (!this.personnage || !this.animations || !this.mixer) return
    const dirs = ["keyw", "keya", "keys", "keyd", "arrowleft", "arrowright", "arrowup", "arrowdown"]
    let directionPressed = false
    if (this.controlsEnabled) {
      directionPressed = dirs.some((d) => this.keyPressed[d])
    }
    if (this.joyDistance > 0 && this.controlsEnabled) directionPressed = true
    let next = "stay"
    if (directionPressed) next = "walk"
    if (next !== this.currentAction) {
      this.playAnimation(next as "stay" | "walk" | "hi")
      this.onWalking(next === "walk")
    }

    if (this.currentAction === "walk" && this.controlsEnabled) {
      const s = Math.atan2(
        this.camera.position.x - this.personnage.position.x,
        this.camera.position.z - this.personnage.position.z,
      )
      const o = this.directionOffset(this.keyPressed)
      this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, s + o)
      this.personnage.quaternion.rotateTowards(
        this.rotateQuaternion,
        this.joyDistance > 0 ? 0.75 : (this.isPhone ? 0.8 : 0.15),
      )
      this.camera.getWorldDirection(this.walkDir)
      this.walkDir.y = 0
      this.walkDir.normalize()
      this.walkDir.applyAxisAngle(this.rotateAngle, o)
      const speedMultiplier = this.joyDistance > 0 ? Math.max(0.35, Math.min(1.0, this.joyDistance)) : 1.0
      if (this.walkAction) {
        this.walkAction.timeScale = 4.5 * (this.joyDistance > 0 ? Math.max(0.65, speedMultiplier) : 1.0)
      }
      const dx = this.walkDir.x * this.velocity * speedMultiplier * delta * 60 * 0.016
      const dz = this.walkDir.z * this.velocity * speedMultiplier * delta * 60 * 0.016
      this.personnage.position.x -= dx
      this.personnage.position.z -= dz

      if (this.route === "home") {
        this.personnage.position.x = Math.max(
          -this.homeSize.x,
          Math.min(this.homeSize.x, this.personnage.position.x),
        )
        this.personnage.position.z = Math.max(
          this.homeSize.zMin,
          Math.min(this.homeSize.zMax, this.personnage.position.z),
        )
        if (this.personnage.position.z > 2 && !this.autoNavFired) {
          this.autoNavFired = true
          this.onControlsVisible(false)
          this.controlsEnabled = false
          this.lastGalleryX = 0
          this.navigate("/gallery")
        }
      } else if (this.route === "gallery") {
        this.personnage.position.z = Math.max(-0.1, Math.min(1.4, this.personnage.position.z))
        this.personnage.position.x = Math.max(-1.2, Math.min(this.gallerySize + 0.8, this.personnage.position.x))
        // walking back down the corridor past the entrance -> Home pavilion
        if (this.personnage.position.x < -0.6 && !this.autoNavFired) {
          this.autoNavFired = true
          this.onControlsVisible(false)
          this.controlsEnabled = false
          this.lastGalleryX = 0
          this.navigate("/")
        } else if (this.personnage.position.x > this.gallerySize && !this.autoNavFired) {
          // walking straight past the last artwork -> About (Leadership Pavilion)
          this.autoNavFired = true
          this.onControlsVisible(false)
          this.controlsEnabled = false
          this.lastGalleryX = this.gallerySize - 3.4
          this.navigate("/about")
        }
      } else if (this.route === "about") {
        this.personnage.position.x = Math.max(
          -this.homeSize.x,
          Math.min(this.homeSize.x, this.personnage.position.x),
        )
        this.personnage.position.z = Math.max(
          this.homeSize.zMin,
          Math.min(this.homeSize.zMax, this.personnage.position.z),
        )
        // walk back out through the porch -> return to the gallery corridor end
        if (this.personnage.position.z > 2 && !this.autoNavFired) {
          this.autoNavFired = true
          this.onControlsVisible(false)
          this.controlsEnabled = false
          this.lastGalleryX = this.gallerySize - 3.4
          this.navigate("/gallery")
        }
      }

      // footprints along the walk cycle
      if (this.walkAction) {
        const n = (this.walkAction.time * 100) / this.walkDuration
        this.footprintFrames.forEach((f) => {
          if (n >= f.progress && !f.done) {
            this.spawnFootprint(f.foot)
            f.done = true
          }
        })
        if (n < this.lastProgress) {
          this.footprintFrames.forEach((f) => (f.done = false))
        }
        this.lastProgress = n
      }
    }
  }

  private updateButtons() {
    if (!this.personnage) return
    this.buttons.forEach((btn) => {
      const d = this.personnage!.position.distanceTo(btn.group.position)
      if (!btn.isOpen && d < 0.3) {
        this.onControlsVisible(false)
        gsap.to(btn.r2.position, { y: 0.1, duration: 0.5 })
        btn.isOpen = true
      } else if (btn.isOpen && d > 0.3) {
        this.onControlsVisible(true)
        gsap.to(btn.r2.position, { y: 0, duration: 0.5 })
        btn.isOpen = false
      }
    })
  }

  private updateCamera() {
    if (!this.personnage) return
    const { x, y, z } = this.personnage.position
    const anyOpen = this.buttons.some((b) => b.isOpen)
    if (!anyOpen) {
      this.camPosTarget.set(x, y + 1.25, z + 3.2)
      this.camTarget.set(x, y + 0.72, z - 0.5)
    } else {
      const btn = this.buttons.find((b) => b.isOpen)
      const cadre = btn ? this.cadres[btn.cadreIndex] : null
      if (cadre) {
        const dirV = new THREE.Vector3()
        cadre.instance.getWorldDirection(dirV)
        const d = this.isPhone ? 4.5 : 5
        const dd = cadre.instance instanceof THREE.Mesh ? d : 3.2
        this.camPosTarget.copy(cadre.instance.position).addScaledVector(dirV.multiplyScalar(dd), 1.2)
        this.camTarget.copy(cadre.instance.position)
      }
    }
    this.camera.position.lerp(this.camPosTarget, this.isPhone ? 0.1 : 0.05)
    if (!this.smoothedTarget) this.smoothedTarget = new THREE.Vector3()
    this.smoothedTarget.lerp(this.camTarget, this.isPhone ? 0.1 : 0.05)
    this.camera.lookAt(this.smoothedTarget)
  }

  private updateFootprints(delta: number) {
    for (let i = this.footprints.length - 1; i >= 0; i--) {
      const fp = this.footprints[i]
      fp.life += delta
      const mat = fp.mesh.material as THREE.MeshBasicMaterial
      if (fp.life > 4) {
        mat.opacity = Math.max(0, 0.5 - (fp.life - 4) * 0.4)
      }
      if (fp.life > 5.5) {
        this.scene.remove(fp.mesh)
        fp.mesh.geometry.dispose()
        mat.map = null
        mat.dispose()
        this.footprints.splice(i, 1)
      }
    }
  }

  // ================= teardown =================
  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    window.removeEventListener("resize", this.onResize)
    this.canvas?.removeEventListener("pointerdown", this.onCanvasPointerDown)
    this.canvas?.removeEventListener("pointermove", this.onCanvasPointerMove)
    this.links.forEach((l) => l.el.remove())
    this.links = []
    this.renderer?.dispose()
    this.scene.traverse((o: any) => {
      if (o.isMesh) {
        o.geometry?.dispose?.()
        const m = o.material
        if (Array.isArray(m)) m.forEach((x: any) => x?.dispose?.())
        else m?.dispose?.()
      }
    })
  }
}

// ---------------- singleton ----------------
let engine: TvEngine | null = null

export function getTvEngine(): TvEngine | null {
  return engine
}

export function createTvEngine(): TvEngine {
  engine?.dispose()
  engine = new TvEngine()
  return engine
}
