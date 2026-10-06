"use client"

import { useEffect, useState } from "react"

export type MerakiPanelTab = "about" | "team" | "events" | null

interface MerakiModalPanelsProps {
  activeTab: MerakiPanelTab
  onClose: () => void
  onSelectTab: (tab: MerakiPanelTab) => void
}

export function MerakiModalPanels({
  activeTab,
  onClose,
  onSelectTab,
}: MerakiModalPanelsProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeTab) {
        onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [activeTab, onClose])

  if (!activeTab) return null

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none animate-in fade-in duration-300">
      {/* Dimmed backdrop with sumi ink wash tint */}
      <div
        className="absolute inset-0 bg-[#050406]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Washi / Dark Lacquer Card */}
      <div className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto bg-[#0a090ce6] border border-[#cda250]/30 shadow-[0_20px_70px_rgba(0,0,0,0.85)] rounded-2xl text-[#f4efe8] flex flex-col p-6 sm:p-8 md:p-10">
        {/* Subtle Japanese vertical Kanji watermark */}
        <div className="absolute right-6 top-10 pointer-events-none select-none text-[80px] sm:text-[120px] font-serif font-light text-[#cda250]/[0.03] leading-none writing-vertical">
          芸術連盟
        </div>

        {/* Top Header Bar with Tabs & Hanko Stamp */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#cda250]/20 pb-5">
          <div className="flex items-center gap-3">
            {/* Red Hanko seal stamp */}
            <div className="w-8 h-8 rounded bg-[#b32b2b] text-[#faefe0] text-xs font-serif font-bold flex items-center justify-center shadow-[0_0_12px_rgba(179,43,43,0.5)] border border-[#faefe0]/20">
              印
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-light tracking-[0.2em] text-[#faefe0] uppercase">
                Meraki Art Federation
              </h2>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#a0907d]">
                『 メラキ芸術連盟 』 • Salon & Curated Vault
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab("about")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-[0.2em] uppercase transition-all duration-200 ${
                activeTab === "about"
                  ? "bg-[#cda250] text-[#0a090c] font-medium shadow-[0_2px_12px_rgba(205,162,80,0.4)]"
                  : "text-[#c2b4a3] hover:text-[#faefe0] hover:bg-[#cda250]/15"
              }`}
            >
              理念 About
            </button>
            <button
              onClick={() => onSelectTab("team")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-[0.2em] uppercase transition-all duration-200 ${
                activeTab === "team"
                  ? "bg-[#cda250] text-[#0a090c] font-medium shadow-[0_2px_12px_rgba(205,162,80,0.4)]"
                  : "text-[#c2b4a3] hover:text-[#faefe0] hover:bg-[#cda250]/15"
              }`}
            >
              役員 Team
            </button>
            <button
              onClick={() => onSelectTab("events")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-[0.2em] uppercase transition-all duration-200 ${
                activeTab === "events"
                  ? "bg-[#cda250] text-[#0a090c] font-medium shadow-[0_2px_12px_rgba(205,162,80,0.4)]"
                  : "text-[#c2b4a3] hover:text-[#faefe0] hover:bg-[#cda250]/15"
              }`}
            >
              催事 Events
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="ml-2 w-8 h-8 rounded-full border border-[#cda250]/30 hover:border-[#cda250] flex items-center justify-center text-[#c2b4a3] hover:text-[#faefe0] transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab 1: About Us / Manifesto */}
        {activeTab === "about" && (
          <div className="mt-8 space-y-6 text-[#d6c7b2] font-light leading-relaxed">
            <div className="space-y-3">
              <span className="text-[11px] font-sans tracking-[0.35em] text-[#d4af72] uppercase">
                理念 • The Curatorial Manifesto
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#faefe0] font-light tracking-wide">
                Pouring Soul into Matter
              </h3>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#dfd4c5]">
              The word <span className="text-[#faefe0] font-normal italic">Meraki</span> defines the act of leaving a piece of yourself, your soul, creativity, and love into whatever you craft. The <strong className="text-[#faefe0] font-medium">Meraki Art Federation</strong> was founded as a global alliance of master craftsmen, fine ink draughtsmen, and visual visionaries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#cda250]/15">
              <div className="p-4 rounded-xl bg-[#141217]/60 border border-[#cda250]/15 space-y-2">
                <span className="text-xs font-serif text-[#d4af72] tracking-[0.2em] uppercase block">
                  01. 一筋 • The Ballpoint Discipline
                </span>
                <p className="text-xs text-[#b8a996] leading-relaxed">
                  Honoring the raw discipline of permanent ballpoint ink. Every line irreversible, every gradient built from thousands of delicate, meditative strokes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141217]/60 border border-[#cda250]/15 space-y-2">
                <span className="text-xs font-serif text-[#d4af72] tracking-[0.2em] uppercase block">
                  02. 空間 • Spatial Pavilion
                </span>
                <p className="text-xs text-[#b8a996] leading-relaxed">
                  Transcending 2D flat screens through an interactive virtual 3D salon, allowing collectors worldwide to walk the halls and experience art in presence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141217]/60 border border-[#cda250]/15 space-y-2">
                <span className="text-xs font-serif text-[#d4af72] tracking-[0.2em] uppercase block">
                  03. 継承 • Legacy & Fellowship
                </span>
                <p className="text-xs text-[#b8a996] leading-relaxed">
                  Connecting patrons and connoisseurs with irreplaceable acquisitions, ensuring the patronage of visionary artists across Europe and Asia.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-[#9c8d7c]">
              <span>Headquarters: International Salon • Tokyo / Paris / Geneva</span>
              <span className="text-[#d4af72]">contact@merakiartfed.com</span>
            </div>
          </div>
        )}

        {/* Tab 2: The Team / Curatorial Council */}
        {activeTab === "team" && (
          <div className="mt-8 space-y-6 text-[#d6c7b2]">
            <div className="space-y-2">
              <span className="text-[11px] font-sans tracking-[0.35em] text-[#d4af72] uppercase">
                役員・審議員 • The Curatorial Council & Masters
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#faefe0] font-light tracking-wide">
                Custodians of the Collection
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
              {/* Member 1: Master Draughtsman */}
              <div className="p-5 rounded-xl bg-[#141217]/70 border border-[#cda250]/20 flex flex-col justify-between space-y-4 hover:border-[#cda250]/50 transition-colors">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#1e1b24] border border-[#cda250]/30 flex items-center justify-center font-serif text-sm text-[#faefe0]">
                    筆
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-[#faefe0] font-normal tracking-wide">
                      Master Draughtsman
                    </h4>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af72] font-mono block mt-0.5">
                      筆頭画家 • Fine Ballpoint Master
                    </span>
                  </div>
                  <p className="text-xs text-[#b8a996] leading-relaxed">
                    Creator of the 44 foundational ballpoint drawings enshrined in the virtual vault. Pioneering contemporary ink realism through delicate micro-hatching.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#cda250]/15 flex items-center justify-between text-[11px] text-[#9c8d7c]">
                  <span>Vault Artworks: 44 Pieces</span>
                  <span className="text-[#d4af72]">Active Fellow</span>
                </div>
              </div>

              {/* Member 2: Curatorial Directorate */}
              <div className="p-5 rounded-xl bg-[#141217]/70 border border-[#cda250]/20 flex flex-col justify-between space-y-4 hover:border-[#cda250]/50 transition-colors">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#1e1b24] border border-[#cda250]/30 flex items-center justify-center font-serif text-sm text-[#faefe0]">
                    館
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-[#faefe0] font-normal tracking-wide">
                      Curatorial Directorate
                    </h4>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af72] font-mono block mt-0.5">
                      主席学芸員 • Principal Curator
                    </span>
                  </div>
                  <p className="text-xs text-[#b8a996] leading-relaxed">
                    Directing international acquisitions, provenance verification, and physical-to-virtual vernissage salons for European and Asian patrons.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#cda250]/15 flex items-center justify-between text-[11px] text-[#9c8d7c]">
                  <span>Salon Direction</span>
                  <span className="text-[#d4af72]">Inquiries Open</span>
                </div>
              </div>

              {/* Member 3: Foxbyte Studios */}
              <div className="p-5 rounded-xl bg-[#141217]/70 border border-[#cda250]/20 flex flex-col justify-between space-y-4 hover:border-[#cda250]/50 transition-colors">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#1e1b24] border border-[#cda250]/30 flex items-center justify-center font-serif text-sm text-[#faefe0]">
                    創
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-[#faefe0] font-normal tracking-wide">
                      Foxbyte Studios
                    </h4>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#d4af72] font-mono block mt-0.5">
                      空間設計 • Spatial Architecture & WebGL
                    </span>
                  </div>
                  <p className="text-xs text-[#b8a996] leading-relaxed">
                    Engineering the interactive 3D digital pavilion, WebGL shaders, camera kinetics, and digital vault architecture powering Meraki Art Federation.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#cda250]/15 flex items-center justify-between text-[11px] text-[#9c8d7c]">
                  <span>Digital Engineering</span>
                  <span className="text-[#d4af72]">Design Partner</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Upcoming Events / Vernissages */}
        {activeTab === "events" && (
          <div className="mt-8 space-y-6 text-[#d6c7b2]">
            <div className="space-y-2">
              <span className="text-[11px] font-sans tracking-[0.35em] text-[#d4af72] uppercase">
                催事・展覧会 • Exhibition Calendar & Vernissages
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#faefe0] font-light tracking-wide">
                Upcoming Salons
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              {/* Event 1: Grand Launch */}
              <div className="p-5 rounded-xl bg-[#17141d]/80 border border-[#cda250]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] tracking-[0.16em] uppercase font-medium bg-[#cda250] text-[#0a090c]">
                      Inaugural Opening
                    </span>
                    <span className="text-xs text-[#d4af72] font-mono">November 15, 2026</span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl text-[#faefe0] tracking-wide">
                    Tokyo & Paris Vernissage: The Complete 44 Inks
                  </h4>
                  <p className="text-xs text-[#b8a996] max-w-xl">
                    Official worldwide opening of the Meraki digital pavilion and unveil of the entire permanent collection with private acquisition rights.
                  </p>
                </div>
                <a
                  href="mailto:contact@merakiartfed.com?subject=Inquiry:%20Inaugural%20Vernissage%20Pass%20(Nov%2015)&body=Hello%20Meraki%20Art%20Federation,%0A%0AI%20would%20like%20to%20request%20an%20invitation%20pass%20to%20the%20Inaugural%20Vernissage%20on%20November%2015,%202026."
                  className="shrink-0 px-4 py-2 rounded-full border border-[#cda250] bg-[#cda250]/15 hover:bg-[#cda250] text-[#faefe0] hover:text-[#0a090c] text-xs font-serif tracking-[0.2em] uppercase transition-all duration-300 text-center"
                >
                  Request Pass
                </a>
              </div>

              {/* Event 2: Winter Salon */}
              <div className="p-5 rounded-xl bg-[#141217]/60 border border-[#cda250]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] tracking-[0.16em] uppercase font-medium bg-[#1f1c24] text-[#a99c8b] border border-[#cda250]/20">
                      Curated Salon
                    </span>
                    <span className="text-xs text-[#d4af72] font-mono">December 20, 2026</span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl text-[#faefe0] tracking-wide">
                    Winter Solstice: Monolith & Charcoal Reflections
                  </h4>
                  <p className="text-xs text-[#b8a996] max-w-xl">
                    A nocturnal walkthrough exhibition exploring negative space (間 - Ma) and dark ink gradients through newly commissioned guest fellows.
                  </p>
                </div>
                <a
                  href="mailto:contact@merakiartfed.com?subject=Inquiry:%20Winter%20Solstice%20Salon&body=Hello%20Meraki%20Art%20Federation,%0A%0AI%20am%20interested%20in%20attending%20the%20Winter%20Solstice%20Salon."
                  className="shrink-0 px-4 py-2 rounded-full border border-[#cda250]/30 hover:border-[#cda250] text-[#d6c7b2] hover:text-[#faefe0] text-xs font-serif tracking-[0.2em] uppercase transition-colors text-center"
                >
                  Inquire
                </a>
              </div>

              {/* Event 3: Spring Auction */}
              <div className="p-5 rounded-xl bg-[#141217]/60 border border-[#cda250]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] tracking-[0.16em] uppercase font-medium bg-[#1f1c24] text-[#a99c8b] border border-[#cda250]/20">
                      Private Auction
                    </span>
                    <span className="text-xs text-[#d4af72] font-mono">February 2027</span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl text-[#faefe0] tracking-wide">
                    Spring Fellowship Acquisitions & Physical Catalog
                  </h4>
                  <p className="text-xs text-[#b8a996] max-w-xl">
                    Private auction and limited-edition embossed art book presentation for registered federation patrons.
                  </p>
                </div>
                <a
                  href="mailto:contact@merakiartfed.com?subject=Inquiry:%20Spring%20Fellowship%20Catalog&body=Hello%20Meraki%20Art%20Federation,%0A%0APlease%20keep%20me%20updated%20regarding%20the%20Spring%20Fellowship%20Catalog%20and%20Auction."
                  className="shrink-0 px-4 py-2 rounded-full border border-[#cda250]/30 hover:border-[#cda250] text-[#d6c7b2] hover:text-[#faefe0] text-xs font-serif tracking-[0.2em] uppercase transition-colors text-center"
                >
                  Join Waitlist
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
