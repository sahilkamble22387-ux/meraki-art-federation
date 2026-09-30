"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Target launch date: 1.5 months from now (November 15, 2026 00:00:00 UTC)
const TARGET_DATE = new Date("2026-11-15T00:00:00Z").getTime();

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, TARGET_DATE - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#070608] select-none">
      {/* ── BACKGROUND IMAGE (PRISTINE CLEAN WEBP) ────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/chatgpt-bg.webp"
          alt="Meraki Art Federation — Under Maintenance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle vignette overlay to ensure text contrast while preserving image drama */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_40%,_rgba(5,4,7,0.45)_100%] pointer-events-none" />
      </div>

      {/* ── TOP COUNTDOWN (BORDERLESS & FLOATING) ───────────────────────── */}
      <header className="absolute top-6 sm:top-9 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* DAYS */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#faefe0] tracking-wider leading-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
              {countdown ? countdown.days : "00"}
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] font-sans tracking-[0.32em] uppercase text-[#8e8072] mt-1.5 pl-[0.32em]">
              Days
            </span>
          </div>

          <span className="text-[#cda250]/40 font-serif text-lg sm:text-xl md:text-2xl -mt-4 select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            :
          </span>

          {/* HOURS */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#faefe0] tracking-wider leading-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
              {countdown ? countdown.hours : "00"}
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] font-sans tracking-[0.32em] uppercase text-[#8e8072] mt-1.5 pl-[0.32em]">
              Hours
            </span>
          </div>

          <span className="text-[#cda250]/40 font-serif text-lg sm:text-xl md:text-2xl -mt-4 select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            :
          </span>

          {/* MINUTES */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#faefe0] tracking-wider leading-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
              {countdown ? countdown.minutes : "00"}
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] font-sans tracking-[0.32em] uppercase text-[#8e8072] mt-1.5 pl-[0.32em]">
              Mins
            </span>
          </div>

          <span className="text-[#cda250]/40 font-serif text-lg sm:text-xl md:text-2xl -mt-4 select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            :
          </span>

          {/* SECONDS */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#dfbe85] tracking-wider leading-none drop-shadow-[0_2px_16px_rgba(205,162,80,0.35)]">
              {countdown ? countdown.seconds : "00"}
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] font-sans tracking-[0.32em] uppercase text-[#8e8072] mt-1.5 pl-[0.32em]">
              Secs
            </span>
          </div>
        </div>
      </header>

      {/* ── CENTER STACK: BRAND & STATUS ───────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 max-w-2xl mx-auto">
        {/* MERAKI BRAND TITLE */}
        <h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-[0.26em] sm:tracking-[0.3em] font-light uppercase leading-none bg-gradient-to-b from-[#faefe0] via-[#dfbe85] to-[#9e763b] bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(205,162,80,0.3)] pl-[0.26em] sm:pl-[0.3em]"
        >
          Meraki
        </h1>

        {/* ART FEDERATION WITH HORIZONTAL ACCENT LINES */}
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-3 sm:gap-4 w-full">
          <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#cda250]/60" />
          <span className="text-[10px] sm:text-[11px] md:text-xs tracking-[0.42em] uppercase font-light text-[#dfceb5] pl-[0.42em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            Art Federation
          </span>
          <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#cda250]/60" />
        </div>

        {/* VERTICAL DIVIDER 1 */}
        <div className="my-7 sm:my-8 h-7 sm:h-9 w-[1px] bg-gradient-to-b from-transparent via-[#d4af72]/50 to-transparent" />

        {/* STATUS SECTION */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm md:text-[15px] font-light tracking-[0.38em] uppercase text-[#ede6dc] pl-[0.38em] drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
            Under Maintenance
          </h2>
          <p className="text-[9px] sm:text-[10.5px] md:text-xs font-light tracking-[0.28em] uppercase text-[#a39786] pl-[0.28em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
            A New Experience Is Being Crafted
          </p>
        </div>

        {/* VERTICAL DIVIDER 2 */}
        <div className="my-7 sm:my-8 h-7 sm:h-9 w-[1px] bg-gradient-to-b from-transparent via-[#d4af72]/50 to-transparent" />

        {/* ATTRIBUTION SECTION: DESIGNED BY FOXBYTE STUDIOS */}
        <div className="flex flex-col items-center space-y-3.5">
          <span className="text-[8.5px] sm:text-[9.5px] font-light tracking-[0.34em] uppercase text-[#8c8072] pl-[0.34em]">
            Being Designed By
          </span>

          {/* FOXBYTE GEOMETRIC LOGO (WARM METALLIC GOLD MASK) */}
          <div className="relative group transition-transform duration-300 hover:scale-105">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-b from-[#f9ecd8] via-[#d4af72] to-[#99733a] drop-shadow-[0_0_14px_rgba(212,175,114,0.35)]"
              style={{
                maskImage: "url(/images/foxbytelogo.png)",
                WebkitMaskImage: "url(/images/foxbytelogo.png)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
          </div>

          {/* FOXBYTE STUDIOS TYPOGRAPHY */}
          <div className="text-center space-y-0.5">
            <div className="font-serif text-xs sm:text-[13px] tracking-[0.32em] font-semibold text-[#e8d5b8] uppercase pl-[0.32em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
              Foxbyte
            </div>
            <div className="text-[8px] sm:text-[8.5px] tracking-[0.36em] uppercase font-light text-[#9e8f7c] pl-[0.36em]">
              Studios
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
