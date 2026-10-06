"use client"

/**
 * ThevertMenthe — persistent client shell.
 * Owns the WebGL canvas + engine, the loading screen, the fullscreen menu,
 * the keyboard legend, the mobile joystick and the ink page transition.
 * Mounted once in /thevertmenthe/layout.tsx so the 3D world survives
 * client-side navigation between home, gallery and article pages.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import gsap from "gsap"
import {
  createTvEngine,
  getTvEngine,
} from "./tv-engine"
import { TV_ARTICLES } from "@/lib/thevertmenthe-articles"
import { MerakiCountdownBanner } from "@/components/meraki/meraki-countdown-banner"
import { MerakiModalPanels, MerakiPanelTab } from "@/components/meraki/meraki-modal-panels"

const BASE = ""

type TvInkHandle = {
  close: () => Promise<void>
  open: () => Promise<void>
}

/** Noisy ink-flood overlay drawn on a 2D canvas (sits above every DOM layer). */
function TvInkOverlay({ inkRef }: { inkRef: React.RefObject<TvInkHandle | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let running = false
    let dir = 1
    let progress = 0

    const hash = (x: number) => {
      const s = Math.sin(x * 12.9898) * 43758.5453
      return s - Math.floor(s)
    }
    const noise1 = (x: number) => {
      const i = Math.floor(x)
      const f = x - i
      const u = f * f * (3 - 2 * f)
      return hash(i) * (1 - u) + hash(i + 1) * u
    }

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const t = performance.now() / 1000
      const cx = w / 2
      const cy = h / 2
      const radius = (dir === 1 ? -0.35 + progress * 3.75 : -0.35 + progress * 3.75) * Math.hypot(w, h) * 0.5
      ctx.beginPath()
      const steps = 140
      for (let i = 0; i <= steps; i++) {
        const ang = (i / steps) * Math.PI * 2
        const c = Math.cos(ang)
        const s = Math.sin(ang)
        const edge =
          (noise1(c * 2.2 + s * 2.2 + t * 0.35) * 0.55 +
            noise1(c * 5.5 - s * 5.5 - t * 0.22) * 0.25) *
          Math.hypot(w, h) *
          0.16
        const rr = radius + edge
        const x = cx + Math.cos(ang) * rr
        const y = cy + Math.sin(ang) * rr
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = dir === 1 ? "#000000" : "#000000"
      // closing: fill the ink blob; opening: fill everything then carve the hole
      if (dir === 1) {
        ctx.fill()
      } else {
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, w, h)
        ctx.fill()
        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        const steps2 = 140
        for (let i = 0; i <= steps2; i++) {
          const ang = (i / steps2) * Math.PI * 2
          const c = Math.cos(ang)
          const s = Math.sin(ang)
          const edge =
            (noise1(c * 2.2 + s * 2.2 + t * 0.35) * 0.55 +
              noise1(c * 5.5 - s * 5.5 - t * 0.22) * 0.25) *
            Math.hypot(w, h) *
            0.16
          const rr = radius + edge
          const x = cx + Math.cos(ang) * rr
          const y = cy + Math.sin(ang) * rr
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      if (running) {
        raf = requestAnimationFrame(draw)
      }
    }

    const animate = (d: 0 | 1) =>
      new Promise<void>((resolve) => {
        dir = d
        progress = 0
        running = true
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(draw)
        const target = { v: 0 }
        gsap.to(target, {
          v: 1,
          duration: 1.05,
          ease: d === 1 ? "power2.in" : "power2.out",
          onUpdate: () => {
            progress = target.v
          },
          onComplete: () => {
            running = false
            if (d === 0) {
              cancelAnimationFrame(raf)
              ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
            }
            resolve()
          },
        })
      })

    inkRef.current = {
      close: () => animate(1),
      open: () => animate(0),
    }
    return () => {
      cancelAnimationFrame(raf)
      running = false
    }
  }, [inkRef])

  return (
    <canvas
      ref={canvasRef}
      className="tv-ink"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 950,
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  )
}

export function TvClient({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<TvInkHandle | null>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const [progress, setProgress] = useState(0)
  const [loaderGone, setLoaderGone] = useState(false)
  const [ready, setReady] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIdx, setActiveIdx] = useState(-1)
  const [activeModalTab, setActiveModalTab] = useState<MerakiPanelTab>(null)

  const router = useRouter()
  const pathname = usePathname()
  const inkArmed = useRef(false)

  const isArticle = Boolean(pathname?.match(/^\/(thevertmenthe\/)?gallery\/.+/))

  // ---------- navigate with ink transition ----------
  const navigate = useCallback(
    async (href: string) => {
      const ink = inkRef.current
      const url = href.startsWith("http") ? new URL(href).pathname + new URL(href).search : href
      if (url === pathname) return
      setMenuOpen(false)
      if (ink) {
        await ink.close()
        inkArmed.current = true
      }
      router.push(url)
    },
    [pathname, router],
  )

  // ---------- engine mount ----------
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const engine = createTvEngine()
    engine.onProgress = (p) => setProgress(p)
    engine.onReady = () => {
      setReady(true)
      const tl = gsap.timeline()
      tl.to(".tv-loader_inner", { opacity: 1, duration: 0.1 }, 0)
        .to(".tv-loader_line", { width: "100%", duration: 0.5, ease: "power1.inOut" }, 0)
        .to(".tv-loader_title", { y: "110%", duration: 0.6, ease: "power3.in" }, "+=0.4")
        .to(
          ".tv-loader_number, .tv-loader_subtitle",
          { y: "-110%", duration: 0.6, ease: "power3.in" },
          "<",
        )
        .add(() => {
          canvas.style.opacity = "1"
        }, "-=0.3")
        .to(loaderRef.current, { display: "none", duration: 0.01 })
        .add(() => setLoaderGone(true))
    }
    engine.onControlsVisible = (v) => setControlsVisible(v)
    engine.navigate = (href) => void navigate(href)
    engine.init(canvas, container)

    // menu open button entrance
    gsap.fromTo(
      ".tv-menu_open button",
      { y: "100%" },
      { y: "0%", duration: 0.3, ease: "sine.inOut", delay: 2.6 },
    )

    return () => {
      engine.dispose()
    }
     
  }, [])

  // ---------- route -> engine ----------
  useEffect(() => {
    const engine = getTvEngine()
    if (!engine) return
    engine.setRoute(pathname ?? "/")
    // drain the ink flood after the route content is in place
    if (inkArmed.current) {
      inkArmed.current = false
      void inkRef.current?.open()
    }
  }, [pathname, ready])

  // ---------- ESC toggles menu ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        setMenuOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // ---------- menu open/close animation ----------
  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    if (menuOpen) {
      gsap.set(menu, { display: "block" })
      const tl = gsap.timeline()
      tl.fromTo(
        ".tv-menu_line",
        { height: "0%" },
        { height: "100%", duration: 0.7, ease: "sine.inOut" },
      )
        .fromTo(
          ".tv-menu_canvas_container",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "sine.inOut" },
          0.2,
        )
        .fromTo(
          ".tv-menu_main_links a",
          { y: "-110%" },
          { y: "0%", duration: 0.5, stagger: 0.08, ease: "sine.out" },
          0.2,
        )
        .fromTo(
          ".tv-menu_links a",
          { y: "-100%" },
          { y: "0%", duration: 0.4, stagger: 0.008, ease: "sine.out" },
          0.35,
        )
        .fromTo(
          ".tv-search_bar",
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          0.8,
        )
        .fromTo(
          ".tv-menu_contact, .tv-menu_insta",
          { opacity: 0 },
          { opacity: 0.6, duration: 0.4 },
          0.9,
        )
    } else {
      const tl = gsap.timeline()
      tl.to(".tv-search_bar", { opacity: 0, duration: 0.2 })
        .to(".tv-menu_contact, .tv-menu_insta", { opacity: 0, duration: 0.2 }, 0)
        .to(".tv-menu_links a", { y: "-100%", duration: 0.25, stagger: 0.004 }, 0)
        .to(".tv-menu_main_links a", { y: "-110%", duration: 0.3 }, 0)
        .to(".tv-menu_canvas_container", { opacity: 0, duration: 0.3 }, 0)
        .to(".tv-menu_line", { height: "0%", duration: 0.4 }, 0.1)
        .set(menu, { display: "none" })
    }
  }, [menuOpen])

  // ---------- menu keyboard navigation ----------
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      const el = searchRef.current
      const typing = document.activeElement === el
      const visible = visibleLinks()
      if (!visible.length) return
      const step = (d: number) => {
        setActiveIdx((i) => {
          const cur = i < 0 ? -1 : indexOfVisible(visible, i)
          const next = (cur + d + visible.length) % visible.length
          return visible[next]
        })
      }
      switch (e.code) {
        case "ArrowDown":
        case "KeyS":
          if (!typing) {
            step(1)
            e.preventDefault()
          }
          break
        case "ArrowRight":
        case "KeyD":
          if (!typing) {
            step(1)
            e.preventDefault()
          }
          break
        case "ArrowUp":
        case "KeyW":
          if (!typing) {
            step(-1)
            e.preventDefault()
          }
          break
        case "ArrowLeft":
        case "KeyA":
          if (!typing) {
            step(-1)
            e.preventDefault()
          }
          break
        case "Enter": {
          if (typing) break
          const idx = activeIdx
          if (idx >= 0) {
            const a = document.querySelector<HTMLElement>(
              `.tv-menu_links a[data-uid="${TV_ARTICLES[idx]?.uid}"]`,
            )
            a?.click()
            e.preventDefault()
          }
          break
        }
        default:
          break
      }
    }
    const visibleLinks = () => {
      const out: number[] = []
      document.querySelectorAll<HTMLElement>(".tv-menu_links li").forEach((li, i) => {
        if (li.style.display !== "none") out.push(i)
      })
      return out
    }
    const indexOfVisible = (visible: number[], idx: number) => {
      const pos = visible.indexOf(idx)
      return pos >= 0 ? pos : 0
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen, activeIdx])

  // ---------- menu link hover video ----------
  const onLinkEnter = useCallback(() => {
    videoRef.current?.play().catch(() => {})
  }, [])
  const onLinkLeave = useCallback(() => {
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
    }
  }, [])

  // ---------- contact ----------
  const contact = useCallback(() => {
    const email = "contact@merakiartfed.com"
    const subject = "Inquiry regarding Meraki Art Federation collection"
    const body = `Hello,

I am reaching out regarding the Meraki Art Federation collection. I am interested in learning more about your curations and available acquisitions.

Kind regards,
`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [])

  // ---------- filtered articles ----------
  const filtered = TV_ARTICLES.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()),
  )

  // ---------- joystick ----------
  const joyRef = useRef<{ id: number; cx: number; cy: number } | null>(null)
  const joyBaseRef = useRef<HTMLDivElement>(null)
  const joyHandleRef = useRef<HTMLDivElement>(null)

  const onJoyStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0]
    const base = joyBaseRef.current
    if (!base) return
    const r = base.getBoundingClientRect()
    joyRef.current = { id: t.identifier, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
  }
  const onJoyMove = (e: React.TouchEvent) => {
    const st = joyRef.current
    if (!st) return
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier !== st.id) continue
      const dx = t.clientX - st.cx
      const dy = t.clientY - st.cy
      const max = 40
      const len = Math.min(Math.hypot(dx, dy), max)
      const ang = Math.atan2(dx, -dy)
      const nx = len === 0 ? 0 : (Math.sin(ang) * len) / max
      const ny = len === 0 ? 0 : (-Math.cos(ang) * len) / max
      if (joyHandleRef.current) {
        joyHandleRef.current.style.transform = `translate(${nx * max}px, ${ny * max}px)`
      }
      getTvEngine()?.setJoystick(ang, len / max)
    }
  }
  const onJoyEnd = () => {
    joyRef.current = null
    if (joyHandleRef.current) joyHandleRef.current.style.transform = "translate(0px, 0px)"
    getTvEngine()?.setJoystick(0, 0)
  }

  return (
    <div className="tv-page">
      <canvas ref={canvasRef} className="tv-webgl" style={{ opacity: ready ? undefined : 0 }} />
      <div className="tv-viewport" style={{ opacity: ready ? 1 : 0 }} />

      {/* projected "See details" links live here */}
      <div ref={containerRef} className="container" style={{ display: isArticle ? "none" : "block" }} />

      {/* Floating Japanese countdown banner */}
      {ready && !isArticle && (
        <MerakiCountdownBanner
          onOpenAbout={() => setActiveModalTab("about")}
          onOpenTeam={() => setActiveModalTab("team")}
          onOpenEvents={() => setActiveModalTab("events")}
        />
      )}

      {/* Japanese modal panels for About, Team, Events */}
      <MerakiModalPanels
        activeTab={activeModalTab}
        onClose={() => setActiveModalTab(null)}
        onSelectTab={(tab) => setActiveModalTab(tab)}
      />

      {/* keyboard legend */}
      <div
        className="controls tv-controls"
        style={{
          opacity: controlsVisible && ready && !isArticle ? 1 : 0,
          display: undefined,
        }}
      />

      {/* article pages render here (above the canvas) */}
      {children}

      {/* menu buttons */}
      {!menuOpen ? (
        <span className="menu_button menu_open tv-menu_open">
          <button
            onClick={() => setMenuOpen(true)}
            style={{ pointerEvents: "all", opacity: ready ? 1 : 0 }}
          >
            menu
          </button>
        </span>
      ) : null}

      {/* fullscreen menu */}
      <div ref={menuRef} className="menu tv-menu" style={{ display: "none" }}>
        <div className="menu_canvas_container tv-menu_canvas_container">
          <img className="menu_image" src="/thevertmenthe/textures/oeuvre.png" alt="" />
          <video
            ref={videoRef}
            className="menu_video"
            muted
            playsInline
            src="/thevertmenthe/videos/ink.mp4"
          />
        </div>
        <div className="menu_text tv-menu_text">
          <div className="menu_main_links tv-menu_main_links">
            <span>
              <a
                href="/"
                className={pathname === "/" || pathname === "/thevertmenthe" ? "menu_actif" : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  void navigate("/")
                }}
              >
                Home
              </a>{" "}
              &gt;
            </span>
            <span>
              <a
                href="/gallery"
                className={pathname === "/gallery" || pathname === "/thevertmenthe/gallery" ? "menu_actif" : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  void navigate("/gallery")
                }}
              >
                Gallery
              </a>{" "}
              &gt;
            </span>
            <span>
              <button
                type="button"
                className="hover:text-[#faefe0] text-[#c2b4a3] transition-colors"
                onClick={() => {
                  setMenuOpen(false)
                  setActiveModalTab("about")
                }}
              >
                About
              </button>{" "}
              &gt;
            </span>
            <span>
              <button
                type="button"
                className="hover:text-[#faefe0] text-[#c2b4a3] transition-colors"
                onClick={() => {
                  setMenuOpen(false)
                  setActiveModalTab("team")
                }}
              >
                Team
              </button>{" "}
              &gt;
            </span>
            <span>
              <button
                type="button"
                className="hover:text-[#faefe0] text-[#d4af72] transition-colors flex items-center gap-1 inline-flex"
                onClick={() => {
                  setMenuOpen(false)
                  setActiveModalTab("events")
                }}
              >
                Events
              </button>{" "}
              &gt;
            </span>
          </div>
          <div className="menu_line tv-menu_line" />
          <div className="menu_links tv-menu_links">
            <ul>
              {filtered.map((a, i) => (
                <li key={a.uid}>
                  <a
                    href={`/gallery/${a.uid}`}
                    data-uid={a.uid}
                    onMouseEnter={() => {
                      onLinkEnter()
                      setActiveIdx(TV_ARTICLES.indexOf(a))
                    }}
                    onMouseLeave={() => {
                      onLinkLeave()
                      setActiveIdx((cur) => (cur === TV_ARTICLES.indexOf(a) ? -1 : cur))
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      onLinkLeave()
                      void navigate(`/gallery/${a.uid}`)
                    }}
                    style={activeIdx === TV_ARTICLES.indexOf(a) ? { opacity: 0.4 } : undefined}
                  >
                    {a.title}
                  </a>
                  <div
                    className="menu_links_hover"
                    style={{
                      display: activeIdx === TV_ARTICLES.indexOf(a) && i >= 0 ? "block" : "none",
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="search_bar tv-search_bar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#ffffff"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search an artwork"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <span className="menu_button menu_close tv-menu_close">
          <button onClick={() => setMenuOpen(false)}>close</button>
        </span>
        <a className="menu_contact tv-menu_contact" onClick={contact}>
          Contact us
        </a>
        <a
          href="https://merakiartfed.com"
          target="_blank"
          rel="noreferrer"
          className="menu_insta tv-menu_insta"
        >
          Meraki Art Federation
        </a>
      </div>

      {/* mobile joystick */}
      <div
        className={`tv-joystick_container${isArticle ? " tv-hidden" : ""}`}
        onTouchStart={onJoyStart}
        onTouchMove={onJoyMove}
        onTouchEnd={onJoyEnd}
        onTouchCancel={onJoyEnd}
      >
        <div ref={joyBaseRef} className="tv-joystick_base">
          <div ref={joyHandleRef} className="tv-joystick_handle" />
        </div>
      </div>

      {/* loading screen */}
      <div ref={loaderRef} className="loader tv-loader">
        <div className="tv-loader_inner" style={{ opacity: 1 }}>
          <span>
            <h1 className="loader_title tv-loader_title">Meraki Art Federation</h1>
          </span>
          <div className="loader_line tv-loader_line" style={{ width: `${progress}%` }} />
          <span>
            <div className="loader_sub">
              <div className="loader_number tv-loader_number">{progress}%</div>
              <div className="loader_subtitle tv-loader_subtitle">curations</div>
            </div>
          </span>
        </div>
      </div>

      {/* ink page transition */}
      <TvInkOverlay inkRef={inkRef} />
    </div>
  )
}
