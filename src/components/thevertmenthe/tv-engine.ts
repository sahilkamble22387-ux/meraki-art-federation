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
import { TV_DRAW_FRAGMENT, TV_DRAW_VERTEX } from "./tv-shaders"

const ASSET_BASE = "/thevertmenthe"

type TvArticle = (typeof TV_ARTICLES)[number]

type Cadre = {
  instance: THREE.Object3D
  draw: THREE.Mesh | null
  article: TvArticle
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
  personnage: `${ASSET_BASE}/models/personnage_opti.glb`,
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
  image_left_bottom: "snow-kissed",
  image_left_mid: "friend",
  image_left_mid_loin: "realization",
  image_left_top: "medieval-journey",
  image_right_bottom: "only-temporary",
  image_right_mid: "dear-elephant",
  image_right_mid_loin: "untilted",
  image_right_top: "at-eternitys-gates",
}

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
  route: "home" | "gallery" | "article" = "home"
  private homeRoot: THREE.Group | null = null
  private galleryRoot: THREE.Group | null = null
  private cadres: Cadre[] = []
  private buttons: FloorButton[] = []
  private links: LinkProj[] = []
  private spotLights: THREE.SpotLight[] = []
  private homeSize = { x: 1.4, zMin: -10.9, zMax: 3 }
  private gallerySize = 44 * 1.2 + 12
  private autoNavFired = false
  lastGalleryX = 0

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
  navigate: (path: string) => void = () => {}

  // ================= setup =================
  init(canvas: HTMLCanvasElement, container: HTMLElement) {
    this.canvas = canvas
    this.container = container
    this.isPhone = window.matchMedia("(max-width: 820px)").matches
    this.velocity = this.isPhone ? 1.5 : 1

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

    this.loadTotal = STATIC_ASSETS.models.length + STATIC_ASSETS.textures.length + TV_ARTICLES.length
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
    // artwork textures (keyed by uid)
    for (const a of TV_ARTICLES) {
      try {
        const tex = await texLoader.loadAsync(a.image)
        tex.colorSpace = THREE.SRGBColorSpace
        this.items[a.uid] = tex
      } catch {
        this.items[a.uid] = null
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
    const mat = new THREE.MeshBasicMaterial({ color: "black" })
    p.traverse((o: any) => {
      if (o.isMesh) {
        o.material = mat
        o.castShadow = true
      }
    })
    p.scale.set(0.08, 0.08, 0.08)
    this.personnage = p
    this.mixer = new THREE.AnimationMixer(p)
    const clips: THREE.AnimationClip[] = gltf.animations
    const findClip = (n: string) =>
      clips.find((c) => c.name.toLowerCase().includes(n)) ?? clips[0]
    const stay = this.mixer.clipAction(findClip("wait"))
    const walk = this.mixer.clipAction(findClip("walk"))
    const hi = this.mixer.clipAction(findClip("coucou"))
    walk.timeScale = 5 * this.velocity
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

  // ================= home world =================
  private buildHome() {
    const g = new THREE.Group()
    const galerie = this.items.galerie?.scene?.clone(true)
    if (!galerie) return
    galerie.position.y = -0.001

    const floor = galerie.getObjectByName("floor")
    const roof = galerie.getObjectByName("roof")
    const barriere = galerie.getObjectByName("barriere")
    const vitre = galerie.getObjectByName("vitre")

    if (floor) {
      floor.receiveShadow = true
      const m = new THREE.MeshStandardMaterial({
        map: this.items.marble_color,
        normalMap: this.items.marble_normal,
        roughnessMap: this.items.marble_roughness,
      })
      const old: any[] = []
      floor.traverse((o: any) => o.isMesh && old.push(o.material))
      floor.traverse((o: any) => {
        if (o.isMesh) o.material = m
      })
      old.forEach((x) => x?.dispose?.())
    }
    if (roof) {
      roof.receiveShadow = true
      const m = new THREE.MeshStandardMaterial({
        map: this.items.platre_color,
        normalMap: this.items.platre_normal,
        roughnessMap: this.items.platre_roughness,
      })
      roof.traverse((o: any) => {
        if (o.isMesh) o.material = m
      })
    }
    if (barriere) {
      barriere.traverse((o: any) => {
        if (o.isMesh) o.castShadow = true
      })
    }
    if (vitre) {
      const white = new THREE.MeshBasicMaterial({ color: "white" })
      vitre.traverse((o: any) => {
        if (o.isMesh) o.material = white
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

    // lights (original values)
    const amb = new THREE.AmbientLight("#ffffff", 0.5)
    const dir = new THREE.DirectionalLight("#ffffff", 1)
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
    const dir2 = new THREE.DirectionalLight("#ffffff", 1.5)
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
        const spot = new THREE.SpotLight("#ffffff", 5, 6, Math.PI / 6, 0.4, 1)
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

    // description plane (back-wall bio text, baked into a texture)
    if (this.items.description) {
      const geo = new THREE.PlaneGeometry(1, 1)
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        alphaMap: this.items.description,
        color: "black",
      })
      const plane = new THREE.Mesh(geo, mat)
      const anchor = galerie.getObjectByName("description")
      if (anchor) {
        const wp = new THREE.Vector3()
        anchor.getWorldPosition(wp)
        plane.position.copy(wp)
        plane.position.z += 0.01
      }
      plane.scale.set(150 * 0.015, 120 * 0.015, 1)
      g.add(plane)
    }

    // wall signs (Home / Gallery arrows)
    const signs: Array<[string, number]> = [
      ["galleryL", 0.01],
      ["galleryR", -0.01],
    ]
    for (const [nm, off] of signs) {
      const anchor = galerie.getObjectByName(nm)
      if (!anchor) continue
      const tex = this.items[`panneau_${nm}`]
      if (!tex) continue
      const geo = new THREE.PlaneGeometry(2, 1)
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        alphaMap: tex,
        color: "black",
      })
      const plane = new THREE.Mesh(geo, mat)
      const wp = new THREE.Vector3()
      anchor.getWorldPosition(wp)
      const wq = new THREE.Quaternion()
      anchor.getWorldQuaternion(wq)
      plane.position.copy(wp)
      plane.position.x += off
      plane.quaternion.copy(wq)
      plane.scale.set(0.3, 0.3, 0.3)
      g.add(plane)
    }

    // 8 framed artworks on the anchors
    const uids = HOME_SLOTS.map((s) => HOME_MAP[s])
    this.cadres = []
    this.buttons = []
    anchors.forEach((anchor, n) => {
      const uid = uids[n % uids.length]
      const article = TV_ARTICLES.find((a) => a.uid === uid)
      const tex = this.items[uid]
      const cadre = this.buildCadre(anchor, 2, tex, article)
      this.cadres.push(cadre)
      this.buttons.push(this.buildFloorButton(cadre, "home", n))
    })

    this.homeRoot = g
    this.scene.add(g)
  }

  private buildCadre(anchor: THREE.Object3D, scale: number, tex: any, article: TvArticle | undefined): Cadre {
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

    const draw = instance.getObjectByName("draw") as THREE.Mesh | null
    if (draw) {
      if (tex) {
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
        color: new THREE.Color(0.9058823529411765 * 2, 0.8901960784313725 * 2, 0.8627450980392157 * 2),
      })
    }
    this.scene.add(instance)
    return { instance, draw, article: article ?? TV_ARTICLES[0] }
  }

  private buildFloorButton(cadre: Cadre, world: "home" | "gallery", index: number): FloorButton {
    const group = new THREE.Group()
    const mk = () => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.21, 40, 1),
        new THREE.MeshBasicMaterial({ color: "black" }),
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
    this.scene.add(group)
    return { group, r2, isOpen: false, cadreIndex: index }
  }

  // ================= gallery world =================
  private buildGallery() {
    const g = new THREE.Group()
    const size = this.gallerySize

    const marbleColor = (this.items.marble_color as THREE.Texture).clone()
    const marbleNormal = (this.items.marble_normal as THREE.Texture).clone()
    const marbleRough = (this.items.marble_roughness as THREE.Texture).clone()
    ;[marbleColor, marbleNormal, marbleRough].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(4 + size, 4)
      t.needsUpdate = true
    })
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(4 + size, 4),
      new THREE.MeshStandardMaterial({
        map: marbleColor,
        normalMap: marbleNormal,
        roughnessMap: marbleRough,
      }),
    )
    floor.rotation.x = -Math.PI * 0.5
    floor.position.set((4 + size) / 2 - 2, 0, 1)
    floor.receiveShadow = true
    g.add(floor)

    const platreColor = (this.items.platre_color as THREE.Texture).clone()
    const platreNormal = (this.items.platre_normal as THREE.Texture).clone()
    const platreRough = (this.items.platre_roughness as THREE.Texture).clone()
    ;[platreColor, platreNormal, platreRough].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set((2 + size) / 5, 2)
      t.needsUpdate = true
    })
    const wallMat = new THREE.MeshStandardMaterial({
      map: platreColor,
      normalMap: platreNormal,
      roughnessMap: platreRough,
    })
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(4 + size, 10),
      wallMat,
    )
    wall.position.set((4 + size) / 2 - 2, 5, -0.5)
    wall.receiveShadow = true
    g.add(wall)

    // ceiling strip with skylight glow (matches the room's white ceiling look)
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(4 + size, 4),
      new THREE.MeshStandardMaterial({ color: "#e8e6e2" }),
    )
    ceil.rotation.x = Math.PI * 0.5
    ceil.position.set((4 + size) / 2 - 2, 10, 1)
    g.add(ceil)

    const amb = new THREE.AmbientLight("#ffffff", 0.75)
    const dir = new THREE.DirectionalLight("#ffffff", 1.1)
    dir.position.set(2, 8, 4)
    dir.castShadow = true
    dir.shadow.mapSize.set(1024, 1024)
    dir.shadow.camera.left = -20
    dir.shadow.camera.right = 20
    dir.shadow.camera.near = 0.1
    dir.shadow.camera.far = 40
    g.add(amb, dir)

    // wall signs at both ends (Gallery / Home arrows)
    const addSign = (texName: string, x: number) => {
      const tex = this.items[texName]
      if (!tex) return
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 1),
        new THREE.MeshBasicMaterial({
          transparent: true,
          alphaMap: tex,
          color: "black",
        }),
      )
      plane.scale.set(0.3, 0.3, 0.3)
      plane.position.set(x, 1, -0.495)
      g.add(plane)
    }
    addSign("panneau_galerieR", 0)
    addSign("panneau_homeL", size - 10.6)
    addSign("panneau_homeR", size - 10.6 + 0.7)

    // all 44 artworks in a long wall row
    this.cadres = []
    this.buttons = []
    TV_ARTICLES.forEach((a, n) => {
      const tex = this.items[a.uid]
      const anchor = new THREE.Object3D()
      anchor.position.set(1.2 + n * 1.2, 0.99 + (n % 2) * 0.99, -0.5)
      anchor.updateMatrixWorld(true)
      const cadre = this.buildCadre(anchor, 1.5, tex, a)
      this.cadres.push(cadre)
      this.buttons.push(this.buildFloorButton(cadre, "gallery", n))
    })

    this.galleryRoot = g
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
      el.href = `/gallery/${cadre.article.uid}`
      el.innerHTML = "<p>See details</p><div></div>"
      Object.assign(el.style, {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        transition: "opacity 0.2s ease",
      } as CSSStyleDeclaration)
      el.addEventListener("click", (ev) => {
        ev.preventDefault()
        this.lastGalleryX = this.personnage?.position.x ?? 0
        this.onControlsVisible(true)
        this.navigate(el.href)
      })
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
    const boneName = foot === "left" ? "footL" : "footR"
    const bone = this.personnage.getObjectByName(boneName)
    const pos = new THREE.Vector3()
    if (bone) {
      bone.getWorldPosition(pos)
    } else {
      pos.copy(this.personnage.position)
    }
    pos.y = 0.004
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    })
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.2), mat)
    m.rotation.x = -Math.PI * 0.5
    m.rotation.z = Math.atan2(
      this.personnage.quaternion.x,
      this.personnage.quaternion.w,
    ) * 0 // keep upright; the room is axis-aligned
    m.position.copy(pos)
    this.scene.add(m)
    const fp = { mesh: m, life: 0 }
    this.footprints.push(fp)
  }

  // ================= input =================
  private onKeyDown = (e: KeyboardEvent) => {
    this.keyPressed[e.code.toLowerCase()] = true
  }
  private onKeyUp = (e: KeyboardEvent) => {
    this.keyPressed[e.code.toLowerCase()] = false
  }
  private onResize = () => {
    if (!this.renderer) return
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  setJoystick(angle: number, distance: number) {
    this.joyAngle = angle
    this.joyDistance = distance
  }

  // ================= routing =================
  setRoute(path: string): "home" | "gallery" | "article" {
    let r: "home" | "gallery" | "article" = "article"
    if (path === "" || path === "/" || path === "/thevertmenthe" || path === "/thevertmenthe/") r = "home"
    else if (path === "/gallery" || path === "/thevertmenthe/gallery") r = "gallery"
    this.route = r
    if (this.phase !== "ready") return r
    this.applyRoute()
    return r
  }

  private applyRoute() {
    // tear down previous world's dynamic bits
    this.links.forEach((l) => l.el.remove())
    this.links = []
    this.buttons.forEach((b) => {
      this.scene.remove(b.group)
      b.group.traverse((o: any) => {
        if (o.isMesh) {
          o.geometry.dispose()
          o.material.dispose()
        }
      })
    })
    this.buttons = []
    if (this.homeRoot) this.homeRoot.visible = false
    if (this.galleryRoot) this.galleryRoot.visible = false
    this.autoNavFired = false

    if (this.route === "home") {
      if (!this.homeRoot) this.buildHome()
      if (this.homeRoot) this.homeRoot.visible = true
      this.rebuildLinks()
      if (this.personnage) this.personnage.position.set(0, 0, 0)
      this.controlsEnabled = true
      this.onControlsVisible(true)
    } else if (this.route === "gallery") {
      if (!this.galleryRoot) this.buildGallery()
      if (this.galleryRoot) this.galleryRoot.visible = true
      this.rebuildLinks()
      if (this.personnage) this.personnage.position.set(this.lastGalleryX, 0, 0)
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
    if (this.isPhone && this.joyDistance > 0) {
      return -this.joyAngle + Math.PI * 0.5
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
    if (next !== this.currentAction) this.playAnimation(next as "stay" | "walk" | "hi")

    if (this.currentAction === "walk" && this.controlsEnabled) {
      const s = Math.atan2(
        this.camera.position.x - this.personnage.position.x,
        this.camera.position.z - this.personnage.position.z,
      )
      const o = this.directionOffset(this.keyPressed)
      this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, s + o)
      this.personnage.quaternion.rotateTowards(
        this.rotateQuaternion,
        this.isPhone ? 0.8 : 0.15,
      )
      this.camera.getWorldDirection(this.walkDir)
      this.walkDir.y = 0
      this.walkDir.normalize()
      this.walkDir.applyAxisAngle(this.rotateAngle, o)
      const dx = this.walkDir.x * this.velocity * delta * 60 * 0.016
      const dz = this.walkDir.z * this.velocity * delta * 60 * 0.016
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
        this.personnage.position.z = Math.max(-1.4, Math.min(1.4, this.personnage.position.z))
        this.personnage.position.x = Math.max(-1.4, Math.min(this.gallerySize - 9.6, this.personnage.position.x))
        if (this.personnage.position.x > this.gallerySize - 10.6 + 1 && !this.autoNavFired) {
          this.autoNavFired = true
          this.onControlsVisible(false)
          this.controlsEnabled = false
          this.navigate("/")
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
      if (!btn.isOpen && d < 0.25) {
        this.onControlsVisible(false)
        gsap.to(btn.r2.position, { y: 0.1, duration: 0.5 })
        btn.isOpen = true
      } else if (btn.isOpen && d > 0.25) {
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
      this.camPosTarget.set(-x, y + 1, z + 3)
      this.camTarget.set(x, y + 0.6, z - 0.5)
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
    this.camera.position.lerp(this.camPosTarget, this.isPhone ? 0.1 : 0.03)
    if (!this.smoothedTarget) this.smoothedTarget = new THREE.Vector3()
    this.smoothedTarget.lerp(this.camTarget, this.isPhone ? 0.1 : 0.03)
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
