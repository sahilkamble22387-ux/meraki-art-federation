"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Compass,
  Palette,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
  Mail,
  Copy,
  Check,
} from "lucide-react";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [time, setTime] = useState("");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@merakiartfed.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#08060a] text-[#f4efe8] flex flex-col justify-between overflow-hidden selection:bg-[#cda250]/30 selection:text-white"
    >
      {/* ── AMBIENT ATMOSPHERIC BACKGROUND ─────────────────────────────── */}
      {/* Dynamic studio spotlight following cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000 opacity-60"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(205, 162, 80, 0.08), transparent 70%)`,
        }}
      />

      {/* Atmospheric warm ambient pools */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#cda250]/10 via-[#b85d38]/5 to-transparent rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 w-[600px] h-[450px] bg-[#914624]/10 rounded-full blur-[150px]" />

      {/* Atelier drafting grid */}
      <div className="pointer-events-none absolute inset-0 atelier-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 atelier-grain opacity-30" />

      {/* Architectural Corner Registration Marks */}
      <div className="pointer-events-none absolute top-6 left-6 text-[10px] font-mono tracking-widest text-[#cda250]/40 flex items-center gap-1.5 select-none">
        <span>⌜</span>
        <span>LAT 48.8566° N · LON 2.3522° E</span>
      </div>
      <div className="pointer-events-none absolute top-6 right-6 text-[10px] font-mono tracking-widest text-[#cda250]/40 flex items-center gap-1.5 select-none">
        <span>ARCHIVE FOLIO: MAF-2026/01</span>
        <span>⌝</span>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 text-[10px] font-mono tracking-widest text-[#cda250]/30 hidden sm:flex items-center gap-1.5 select-none">
        <span>⌞</span>
        <span>ATELIER STATUS: IN SITU COMMISSION</span>
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 text-[10px] font-mono tracking-widest text-[#cda250]/30 hidden sm:flex items-center gap-1.5 select-none">
        <span>VERIFIED PROVENANCE</span>
        <span>⌟</span>
      </div>

      {/* ── TOP NAV BAR / ARCHITECTURAL HEADER ──────────────────────────── */}
      <header className="relative z-20 border-b border-[#231b2e]/80 backdrop-blur-md bg-[#08060a]/70">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          {/* Meraki Federation Mark */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#cda250] to-[#b85d38] p-[1px] shadow-[0_0_20px_rgba(205,162,80,0.25)]">
              <div className="w-full h-full bg-[#0d0a13] rounded-[11px] flex items-center justify-center font-serif text-lg font-bold text-[#e6c587]">
                M
              </div>
            </div>
            <div>
              <div className="font-serif text-base sm:text-lg tracking-[0.18em] text-[#f4efe8] uppercase font-bold leading-none">
                Meraki
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#cda250] font-medium mt-1">
                Art Federation
              </div>
            </div>
          </div>

          {/* Status & Live Ticker */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#15101e] border border-[#2b2238] text-[11px] text-[#a89fad]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cda250] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cda250]" />
              </span>
              <span className="font-mono tracking-wider text-[#e6c587]">
                ATELIER UNDER CONSTRUCTION
              </span>
            </div>

            {time && (
              <div className="font-mono text-xs text-[#71687a] tracking-widest">
                {time}
              </div>
            )}
          </div>

          {/* Foxbyte Studio Badge (Header Pill) */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#120e1a] border border-[#cda250]/25 text-xs text-[#d8cfdf] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="relative w-4 h-4 flex-shrink-0">
              <Image
                src="/images/foxbytelogo.png"
                alt="Foxbyte Studios"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-mono tracking-wider text-[#a89fad]">
              DESIGNED BY{" "}
              <strong className="text-white font-semibold tracking-widest">
                FOXBYTE STUDIOS
              </strong>
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT: EDITORIAL ATELIER STAGE ──────────────────────── */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-24 flex flex-col justify-center">
        {/* Curatorial Folio Header */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#130f1d] border border-[#cda250]/30 text-[#e6c587] text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cda250]" />
            <span>COMMISSION DISPATCH // DIGITAL PAVILION 2026</span>
          </div>

          {/* Massive Bespoke Title */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#f4efe8] tracking-tight leading-[1.06]">
              A sovereign sanctuary for fine art,{" "}
              <span className="italic text-[#cda250] font-normal underline decoration-[#cda250]/30 underline-offset-8">
                currently taking form.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-[#b8b0bf] font-light leading-relaxed max-w-3xl pt-2">
              The official digital home of the{" "}
              <span className="text-white font-medium">Meraki Art Federation</span>{" "}
              is currently under private construction. We are hand-sculpting an
              uncompromising gallery experience dedicated to master painters,
              contemporary sculptors, and endowed international fellowships.
            </p>
          </div>
        </div>

        {/* ── THE FOXBYTE STUDIOS DESIGN SPOTLIGHT CARD ─────────────────── */}
        <div className="mt-14 sm:mt-16 relative">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#15101d] via-[#100d16] to-[#0c0911] border border-[#2b2238] hover:border-[#cda250]/40 transition-all duration-500 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Subtle card ambient highlight */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#cda250]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#cda250]/40 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Foxbyte Identity Lockup with Authentic Logo */}
              <div className="lg:col-span-4 flex flex-col items-start space-y-5 border-b lg:border-b-0 lg:border-r border-[#261e31] pb-6 lg:pb-0 lg:pr-8">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#09070c] border border-[#cda250]/30 p-4 flex items-center justify-center shadow-[0_0_30px_rgba(205,162,80,0.15)] group-hover:scale-105 group-hover:border-[#cda250] transition-all duration-300">
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/foxbytelogo.png"
                        alt="Foxbyte Studios Official Logo"
                        fill
                        className="object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        priority
                      />
                    </div>
                  </div>
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#1f172a] border border-[#cda250]/40 text-[9px] font-mono text-[#e6c587] uppercase tracking-wider">
                    Official Seal
                  </span>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#cda250] font-medium">
                    Architectural Atelier
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mt-0.5">
                    Foxbyte Studios
                  </div>
                  <div className="text-xs text-[#8d8396] font-light mt-1">
                    Digital Craft &amp; Interactive Architecture
                  </div>
                </div>
              </div>

              {/* Design Statement & Ethos */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#cda250] tracking-wider uppercase">
                  <Compass className="w-3.5 h-3.5" />
                  <span>The Architectural Philosophy</span>
                </div>

                <p className="text-sm sm:text-base text-[#cfc7d5] leading-relaxed font-light">
                  &ldquo;A digital salon should carry the tangible gravitas of
                  Belgian linen, cold-cast bronze, and classical gallery lighting.
                  Foxbyte Studios is architecting every interaction of the Meraki
                  Federation with uncompromising restraint, editorial elegance,
                  and archival fidelity.&rdquo;
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#8d8396]">
                  <div className="p-3 rounded-xl bg-[#09070c]/60 border border-[#21192b]">
                    <div className="font-mono text-[10px] text-[#cda250] uppercase tracking-widest">
                      01 / CRAFT
                    </div>
                    <div className="font-medium text-white text-xs mt-1">
                      Bespoke Proportions
                    </div>
                    <div className="text-[11px] text-[#71687a] mt-0.5">
                      No generic templates or AI cliches.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#09070c]/60 border border-[#21192b]">
                    <div className="font-mono text-[10px] text-[#cda250] uppercase tracking-widest">
                      02 / PERFORMANCE
                    </div>
                    <div className="font-medium text-white text-xs mt-1">
                      Archival Vault Speed
                    </div>
                    <div className="text-[11px] text-[#71687a] mt-0.5">
                      High-fidelity artwork rendering.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#09070c]/60 border border-[#21192b]">
                    <div className="font-mono text-[10px] text-[#cda250] uppercase tracking-widest">
                      03 / PROVENANCE
                    </div>
                    <div className="font-medium text-white text-xs mt-1">
                      Collector Privacy
                    </div>
                    <div className="text-[11px] text-[#71687a] mt-0.5">
                      Secure salon acquisition channels.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CURATORIAL FOLIO PROGRESS (LOTS IN PREPARATION) ───────────── */}
        <div className="mt-14 sm:mt-16">
          <div className="flex items-center justify-between border-b border-[#231b2e] pb-3 mb-6">
            <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#a89fad]">
              Exhibition Preparation Folio
            </span>
            <span className="text-xs font-mono text-[#cda250]">
              ESTIMATED UNVEILING · WINTER 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Phase 1 */}
            <div className="p-6 rounded-2xl bg-[#110e17] border border-[#231b2e] hover:border-[#cda250]/40 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-[#cda250] uppercase">
                  Lot I · Curation
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  85% Complete
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                The Permanent Vault
              </h3>
              <p className="text-xs text-[#8d8396] font-light leading-relaxed">
                Archiving 4,200+ fine paintings, bronze vessels, and mixed media
                masterworks by 180 resident fellows.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="p-6 rounded-2xl bg-[#110e17] border border-[#231b2e] hover:border-[#cda250]/40 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-[#cda250] uppercase">
                  Lot II · Architecture
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-[#e6c587] border border-amber-500/20">
                  In Progress
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Private Viewing Rooms
              </h3>
              <p className="text-xs text-[#8d8396] font-light leading-relaxed">
                Designing bespoke collector access desks with confidential
                provenance inspection and acquisitions.
              </p>
            </div>

            {/* Phase 3 */}
            <div className="p-6 rounded-2xl bg-[#110e17] border border-[#231b2e] hover:border-[#cda250]/40 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-[#cda250] uppercase">
                  Lot III · Fellowship
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Quarterly Board
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Artist Endowment Registry
              </h3>
              <p className="text-xs text-[#8d8396] font-light leading-relaxed">
                International residency application portals for ateliers in
                Paris, Kyoto, and London.
              </p>
            </div>
          </div>
        </div>

        {/* ── PRIVATE VERNISSAGE RSVP / EARLY NOTICE FORM ────────────────── */}
        <div className="mt-14 sm:mt-16 bg-[#130f1c] border border-[#2a2136] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#cda250] font-semibold">
              Private Curatorial Register
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Request Early Salon Vernissage Access
            </h2>
            <p className="text-xs sm:text-sm text-[#a89fad] font-light">
              Receive a private invitation to explore the digital vault before
              the public doors open. Curators, patrons, and collectors receive
              priority access.
            </p>

            {submitted ? (
              <div className="pt-4 pb-2 space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Your accession request has been recorded.</span>
                </div>
                <p className="text-[11px] text-[#71687a]">
                  Our curator desk will dispatch your credentials prior to the
                  opening.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubmitted(true);
                }}
                className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="patron@collection.com"
                  className="flex-1 bg-[#09070c] border border-[#2e243d] focus:border-[#cda250] rounded-xl px-4 py-3.5 text-xs text-white placeholder:text-[#52495d] outline-none transition-colors font-mono"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#cda250] via-[#e6c587] to-[#cda250] hover:brightness-110 active:scale-[0.98] text-black font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(205,162,80,0.2)]"
                >
                  <span>Request Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#71687a]">
              <span>Direct inquiries:</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-[#cda250] hover:text-white font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>contact@merakiartfed.com</span>
                {copiedEmail ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-[#71687a]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER / ATELIER COLLABORATION SEAL ─────────────────────────── */}
      <footer className="relative z-20 border-t border-[#21192b] bg-[#060408] py-8 text-xs text-[#71687a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-white tracking-widest uppercase font-bold text-sm">
              Meraki Art Federation
            </span>
            <span className="text-[#3c3349]">×</span>
            <div className="flex items-center gap-1.5 text-white font-medium">
              <div className="relative w-3.5 h-3.5">
                <Image
                  src="/images/foxbytelogo.png"
                  alt="Foxbyte"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="tracking-wide">Foxbyte Studios</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono tracking-wider text-[#645c6d]">
            <span>SALONS: PARIS · KYOTO · LONDON</span>
            <span>·</span>
            <span>PROPRIETARY CRAFT © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
