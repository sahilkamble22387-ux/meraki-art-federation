"use client"

import { useState, useEffect } from "react"

// Target official launch date: November 15, 2026 00:00:00 UTC
const TARGET_DATE = new Date("2026-11-15T00:00:00Z").getTime()

interface CountdownBannerProps {
  onOpenAbout?: () => void
  onOpenTeam?: () => void
  onOpenEvents?: () => void
}

export function MerakiCountdownBanner({
  onOpenAbout,
  onOpenTeam,
  onOpenEvents,
}: CountdownBannerProps) {
  const [countdown, setCountdown] = useState<{
    days: string
    hours: string
    minutes: string
    seconds: string
  } | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const diff = Math.max(0, TARGET_DATE - now)

      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)

      setCountdown({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[850] max-w-[95vw] pointer-events-auto select-none">
      <div className="relative group flex items-center gap-3 sm:gap-5 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#08070ad9] backdrop-blur-xl border border-[#cda250]/30 shadow-[0_8px_32px_rgba(0,0,0,0.7)] text-[#f4efe8] transition-all duration-300 hover:border-[#cda250]/60">
        {/* Japanese Hanko-style seal badge */}
        <div className="flex items-center gap-2 border-r border-[#cda250]/20 pr-3 sm:pr-4">
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#b32b2b] text-[#faefe0] text-[10px] sm:text-xs font-serif flex items-center justify-center font-bold shadow-[0_0_8px_rgba(179,43,43,0.5)]">
            印
          </span>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#d4af72] font-medium uppercase">
              Meraki Art Fed
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.18em] text-[#9a8c7b] font-light">
              公開まで • Launch In
            </span>
          </div>
        </div>

        {/* Live Countdown digits */}
        <div className="flex items-center gap-2 sm:gap-3.5 font-serif">
          {/* Days */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base md:text-lg font-light text-[#faefe0] tracking-wider">
              {countdown ? countdown.days : "00"}
            </span>
            <span className="text-[7px] sm:text-[8px] font-sans uppercase tracking-[0.16em] text-[#8e8072]">
              d
            </span>
          </div>

          <span className="text-[#cda250]/50 text-xs sm:text-sm font-light select-none">:</span>

          {/* Hours */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base md:text-lg font-light text-[#faefe0] tracking-wider">
              {countdown ? countdown.hours : "00"}
            </span>
            <span className="text-[7px] sm:text-[8px] font-sans uppercase tracking-[0.16em] text-[#8e8072]">
              h
            </span>
          </div>

          <span className="text-[#cda250]/50 text-xs sm:text-sm font-light select-none">:</span>

          {/* Minutes */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base md:text-lg font-light text-[#faefe0] tracking-wider">
              {countdown ? countdown.minutes : "00"}
            </span>
            <span className="text-[7px] sm:text-[8px] font-sans uppercase tracking-[0.16em] text-[#8e8072]">
              m
            </span>
          </div>

          <span className="text-[#cda250]/50 text-xs sm:text-sm font-light select-none">:</span>

          {/* Seconds */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base md:text-lg font-light text-[#dfbe85] tracking-wider">
              {countdown ? countdown.seconds : "00"}
            </span>
            <span className="text-[7px] sm:text-[8px] font-sans uppercase tracking-[0.16em] text-[#8e8072]">
              s
            </span>
          </div>
        </div>

        {/* Quick action buttons for About, Team, Events */}
        <div className="hidden md:flex items-center gap-1.5 border-l border-[#cda250]/20 pl-3 sm:pl-4 text-[10px] tracking-[0.2em] uppercase font-light">
          {onOpenAbout ? (
            <button
              onClick={onOpenAbout}
              className="px-2.5 py-1 rounded text-[#d6c7b2] hover:text-[#faefe0] hover:bg-[#cda250]/15 transition-colors"
            >
              About
            </button>
          ) : null}
          {onOpenTeam ? (
            <button
              onClick={onOpenTeam}
              className="px-2.5 py-1 rounded text-[#d6c7b2] hover:text-[#faefe0] hover:bg-[#cda250]/15 transition-colors"
            >
              Team
            </button>
          ) : null}
          {onOpenEvents ? (
            <button
              onClick={onOpenEvents}
              className="px-2.5 py-1 rounded text-[#d4af72] hover:text-[#faefe0] hover:bg-[#cda250]/20 transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#cda250] animate-pulse" />
              Events
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
