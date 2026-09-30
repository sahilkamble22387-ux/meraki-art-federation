import Image from "next/image";

export default function MaintenancePage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#070608] select-none">
      {/* ── BACKGROUND IMAGE (CONVERTED TO WEBP & OPTIMIZED) ──────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/chatgpt.webp"
          alt="Meraki Art Federation — Under Maintenance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle vignette overlay to ensure text contrast while preserving image drama */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_35%,_rgba(5,4,7,0.45)_100%] pointer-events-none" />
      </div>

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
