"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Eye,
  Award,
  Globe2,
  Palette,
  Layers,
  Compass,
  CheckCircle2,
  Mail,
  Send,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  category: "oil" | "sculpture" | "mixed" | "minimal";
  medium: string;
  dimensions: string;
  image: string;
  status: "Available via Federation" | "Private Collection" | "Salon Exhibition";
  description: string;
}

const ARTWORKS: Artwork[] = [
  {
    id: "art-1",
    title: "L'Heure Dorée (The Golden Hour)",
    artist: "Éléonore Vance",
    year: "2025",
    category: "oil",
    medium: "Oil & 24K Gold Leaf on Belgian Linen",
    dimensions: "160 × 120 cm",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85",
    status: "Salon Exhibition",
    description: "An evocative study of dusk over the Mediterranean, utilizing historic glazing techniques layered with delicate gold foil.",
  },
  {
    id: "art-2",
    title: "Vessel of Infinite Echoes",
    artist: "Kenjiro Takahashi",
    year: "2026",
    category: "sculpture",
    medium: "Cold-Cast Bronze & Volcanic Basalt",
    dimensions: "95 × 45 × 40 cm",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=85",
    status: "Available via Federation",
    description: "A monumental study of negative space and stillness, balancing raw volcanic stone with polished patinated bronze.",
  },
  {
    id: "art-3",
    title: "Subconscious Cartography No. 7",
    artist: "Amara Al-Mansoor",
    year: "2025",
    category: "mixed",
    medium: "Mineral Pigments, Saffron Wash & Raw Silk",
    dimensions: "180 × 140 cm",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=85",
    status: "Private Collection",
    description: "An intricate layered landscape mapping forgotten architectural memories through organic earth pigments.",
  },
  {
    id: "art-4",
    title: "Solitude in Crimson & Ochre",
    artist: "David Sterling",
    year: "2026",
    category: "oil",
    medium: "Impasto Oil on Heavy Canvas",
    dimensions: "150 × 110 cm",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=85",
    status: "Available via Federation",
    description: "Rich textural palette-knife strokes exploring emotional resilience and quiet contemplation under deep ambient hues.",
  },
  {
    id: "art-5",
    title: "Kinetic Equilibrium",
    artist: "Sofia Rostova",
    year: "2025",
    category: "sculpture",
    medium: "Brushed Titanium & Carrara Marble",
    dimensions: "120 × 60 × 60 cm",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=85",
    status: "Salon Exhibition",
    description: "Aerodynamic forms suspended in delicate counterweight tension, inspired by bird migration and mathematical harmony.",
  },
  {
    id: "art-6",
    title: "The Quiet Architecture of Light",
    artist: "Julian Moreau",
    year: "2026",
    category: "minimal",
    medium: "Gesso, Encaustic Wax & Graphite on Wood",
    dimensions: "140 × 100 cm",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
    status: "Available via Federation",
    description: "Meditative white-on-white textural reliefs that shift perception based on natural ambient illumination throughout the day.",
  },
];

const ARTISTS = [
  {
    name: "Éléonore Vance",
    discipline: "Fine Arts & Classical Glazing",
    origin: "Paris, France",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
    statement: "Every canvas is a vessel where memory transforms into pigment. The federation protects the quiet space artists need to dare.",
  },
  {
    name: "Kenjiro Takahashi",
    discipline: "Architectural Bronze & Stonework",
    origin: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85",
    statement: "In bronze, every milligram is an intention. Meraki gives us the global reach to share contemplative sculpture with the world.",
  },
  {
    name: "Amara Al-Mansoor",
    discipline: "Contemporary Mixed Media & Natural Pigments",
    origin: "Dubai / London",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
    statement: "Bridging ancient heritage pigments with contemporary existential forms is our shared pulse at Meraki.",
  },
];

export default function MerakiHomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inquiryArtwork, setInquiryArtwork] = useState<Artwork | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const filteredArtworks =
    selectedCategory === "all"
      ? ARTWORKS
      : ARTWORKS.filter((art) => art.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b090e] text-[#f4efe8]">
      {/* ── HEADER NAVIGATION ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0b090e]/90 backdrop-blur-md border-b border-[#241e2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#cda250] to-[#b85d38] flex items-center justify-center font-serif text-xl font-bold text-black shadow-[0_0_20px_rgba(205,162,80,0.3)] group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <span className="block font-serif text-lg sm:text-xl font-bold tracking-widest text-[#f4efe8] uppercase leading-none">
                Meraki
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-[#cda250] font-medium mt-1">
                Art Federation
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-[#a89fad]">
            <a href="#exhibitions" className="hover:text-[#cda250] transition-colors">
              Exhibitions
            </a>
            <a href="#gallery" className="hover:text-[#cda250] transition-colors">
              Vault & Gallery
            </a>
            <a href="#artists" className="hover:text-[#cda250] transition-colors">
              Collective
            </a>
            <a href="#manifesto" className="hover:text-[#cda250] transition-colors">
              Manifesto
            </a>
            <a href="#contact" className="hover:text-[#cda250] transition-colors">
              Contact
            </a>
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold text-black bg-gradient-to-r from-[#cda250] via-[#e6c587] to-[#cda250] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(205,162,80,0.25)]"
            >
              <span>Join Fellowship</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#a89fad] hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#100d16] border-b border-[#241e2f] px-6 py-6 space-y-4 text-sm uppercase tracking-widest text-[#a89fad]">
            <a
              href="#exhibitions"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#cda250]"
            >
              Exhibitions
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#cda250]"
            >
              Vault & Gallery
            </a>
            <a
              href="#artists"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#cda250]"
            >
              Collective
            </a>
            <a
              href="#manifesto"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#cda250]"
            >
              Manifesto
            </a>
            <a
              href="#apply"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#cda250] font-bold"
            >
              Apply for Fellowship →
            </a>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden">
        {/* Ambient radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#cda250]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-10 right-10 w-[350px] h-[350px] bg-[#b85d38]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Editorial pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181320] border border-[#cda250]/30 text-[#e6c587] text-xs font-semibold uppercase tracking-[0.2em] mb-8 shadow-[0_0_20px_rgba(205,162,80,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#cda250]" />
            <span>International Guild of Fine Arts & Creative Soul</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#f4efe8] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Where Passion Meets Canvas &amp;{" "}
            <span className="italic text-[#cda250] font-normal underline decoration-[#cda250]/30 underline-offset-8">
              Soul Takes Form
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#b8b0bf] max-w-2xl mx-auto font-light leading-relaxed">
            <strong className="text-white font-medium">Meraki Art Federation</strong> is a sovereign international collective uniting visionary painters, master sculptors, and contemporary auteurs. We curate exclusive salon exhibitions, provide creator grants, and preserve timeless artistic heritage.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#gallery"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#cda250] via-[#e6c587] to-[#cda250] text-black font-semibold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(205,162,80,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Explore The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#manifesto"
              className="px-8 py-4 rounded-full bg-[#181320] hover:bg-[#20192b] border border-white/10 hover:border-[#cda250]/50 text-white font-semibold text-xs uppercase tracking-widest transition-all"
            >
              Read Our Manifesto
            </a>
          </div>

          {/* Key Metric Counters */}
          <div className="mt-20 pt-10 border-t border-[#241e2f] grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#cda250]">180+</div>
              <div className="text-[11px] uppercase tracking-widest text-[#8d8396] mt-1">Resident Masters</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#cda250]">34</div>
              <div className="text-[11px] uppercase tracking-widest text-[#8d8396] mt-1">Global Salons & Shows</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#cda250]">14</div>
              <div className="text-[11px] uppercase tracking-widest text-[#8d8396] mt-1">Heritage Fellowships</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#cda250]">4,200+</div>
              <div className="text-[11px] uppercase tracking-widest text-[#8d8396] mt-1">Archived Works</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXHIBITION SPOTLIGHT ─────────────────────────────────────────── */}
      <section id="exhibitions" className="py-20 bg-[#0f0c15] border-y border-[#241e2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#cda250] font-semibold">
                Salon In Spotlight
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
                Autumn Vernissage: Echoes of Ochre
              </h2>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-[#a89fad] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Current Exhibition · Paris &amp; Virtual Reality</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#15111d] border border-[#2b2339] rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-7 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-inner">
              <Image
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85"
                alt="Exhibition Spotlight"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300">
                <span>Curated by Lordes Saint-Claire</span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  Oct 12 — Nov 30, 2026
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-[#cda250]/15 border border-[#cda250]/30 text-[#e6c587] text-[11px] uppercase tracking-wider font-semibold">
                Exclusive Salon Presentation
              </div>
              <h3 className="text-2xl font-serif font-bold text-white leading-snug">
                Investigating natural earth minerals and raw pigment alchemy across 30 European ateliers.
              </h3>
              <p className="text-sm text-[#a89fad] leading-relaxed font-light">
                Featuring works by 18 Meraki Fellows, this collection interrogates historical ground-pigment layering alongside modern structural impasto. Available for private viewing and acquisitions.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-full bg-[#cda250] hover:bg-[#e6c587] text-black font-semibold text-xs uppercase tracking-wider text-center transition-colors"
                >
                  Request Salon Catalog
                </a>
                <a
                  href="#gallery"
                  className="px-6 py-3 rounded-full border border-white/20 hover:border-white text-white font-semibold text-xs uppercase tracking-wider text-center transition-colors"
                >
                  View Featured Pieces
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE VAULT: ARTWORKS GALLERY ──────────────────────────────────── */}
      <section id="gallery" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#cda250] font-semibold">
              The Permanent Vault
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-2">
              Curated Masterworks
            </h2>
            <p className="text-sm text-[#a89fad] mt-3 font-light">
              Explore pieces officially endorsed and archived by the federation curatorial committee.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { id: "all", label: "All Curations" },
              { id: "oil", label: "Oil & Linen" },
              { id: "sculpture", label: "Bronze & Stone" },
              { id: "mixed", label: "Mixed Media" },
              { id: "minimal", label: "Minimalist Relief" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-[#cda250] text-black font-bold shadow-[0_0_15px_rgba(205,162,80,0.3)]"
                    : "bg-[#16121f] text-[#8d8396] hover:text-white border border-[#2b2339]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Artworks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="group bg-[#130f1b] border border-[#271f33] hover:border-[#cda250]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-[#e6c587] font-medium">
                    {art.status}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs text-[#cda250] font-serif italic mb-1">
                      {art.artist} ({art.year})
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#e6c587] transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#8d8396] mt-2 line-clamp-2 font-light">
                      {art.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#231b2e] flex items-center justify-between">
                    <span className="text-[11px] text-[#71687a]">{art.dimensions}</span>
                    <button
                      type="button"
                      onClick={() => setInquiryArtwork(art)}
                      className="text-xs text-[#cda250] hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Inquire Piece</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE ARTIST COLLECTIVE ────────────────────────────────────────── */}
      <section id="artists" className="py-20 bg-[#0f0c15] border-t border-[#241e2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#cda250] font-semibold">
              The Resident Masters
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
              The Meraki Fellowship
            </h2>
            <p className="text-sm text-[#a89fad] mt-2 font-light">
              Voices of our inducted resident artists shaping the global discourse of fine art.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTISTS.map((artist, idx) => (
              <div
                key={idx}
                className="bg-[#14101c] border border-[#2b2339] rounded-2xl p-6 text-center flex flex-col items-center hover:border-[#cda250]/40 transition-colors"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#cda250] mb-4 shadow-[0_0_15px_rgba(205,162,80,0.2)]">
                  <Image src={artist.image} alt={artist.name} fill className="object-cover" />
                </div>
                <h4 className="text-xl font-serif font-bold text-white">{artist.name}</h4>
                <p className="text-xs text-[#cda250] mt-0.5">{artist.discipline}</p>
                <p className="text-[11px] text-[#71687a] mt-0.5">{artist.origin}</p>
                <blockquote className="mt-4 text-xs italic text-[#b8b0bf] font-light leading-relaxed border-t border-white/5 pt-4">
                  &ldquo;{artist.statement}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO & PILLARS ──────────────────────────────────────────── */}
      <section id="manifesto" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#cda250] font-semibold">
                Our Manifesto
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                Art Built from <span className="italic text-[#cda250]">Meraki</span> — Heart, Soul &amp; Purpose
              </h2>
              <p className="text-sm text-[#b8b0bf] leading-relaxed font-light">
                In classical Greek, <em>Meraki</em> describes pouring yourself entirely into what you create. We reject disposable aesthetics and superficial art markets. We build an enduring home for work that outlives trends.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Palette,
                  title: "Artistic Sovereignty",
                  desc: "Artists maintain complete creative authority and copyright. We curate, protect, and advocate.",
                },
                {
                  icon: Award,
                  title: "Endowed Fellowships",
                  desc: "Annual creator grants and studio stipends so painters and sculptors can focus purely on mastery.",
                },
                {
                  icon: Globe2,
                  title: "International Salons",
                  desc: "Curated physical exhibitions in cultural capitals alongside high-fidelity virtual reality archives.",
                },
                {
                  icon: ShieldCheck,
                  title: "Provenance & Authenticity",
                  desc: "Every masterwork receives tamper-proof archival certification registered in the Federation Vault.",
                },
              ].map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-[#14101c] border border-[#2b2339] space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#cda250]/15 flex items-center justify-center text-[#cda250]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white font-serif">{pillar.title}</h3>
                    <p className="text-xs text-[#8d8396] leading-relaxed font-light">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FELLOWSHIP APPLICATION FORM ─────────────────────────────────── */}
      <section id="apply" className="py-20 bg-[#0f0c15] border-t border-[#241e2f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#cda250] font-semibold">
            Join The Federation
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
            Submit Your Portfolio for Fellowship
          </h2>
          <p className="text-sm text-[#a89fad] mt-2 max-w-lg mx-auto font-light">
            We review candidate submissions quarterly. Open to visual artists, sculptors, and fine craftsmen worldwide.
          </p>

          <div className="mt-10 bg-[#16121f] border border-[#2c233c] rounded-3xl p-6 sm:p-10 text-left shadow-2xl">
            {formSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-2xl font-serif font-bold text-white">Application Received</h4>
                <p className="text-sm text-[#a89fad] max-w-md mx-auto">
                  Thank you for sharing your work with the Meraki Art Federation Curatorial Board. You will receive an acknowledgment email within 3 business days.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 text-xs text-[#cda250] underline cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a89fad] mb-1.5 font-medium">
                      Full Legal / Artist Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Éléonore Vance"
                      className="w-full bg-[#0c0911] border border-[#2f2642] focus:border-[#cda250] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52495d] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a89fad] mb-1.5 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="artist@atelier.com"
                      className="w-full bg-[#0c0911] border border-[#2f2642] focus:border-[#cda250] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52495d] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a89fad] mb-1.5 font-medium">
                      Primary Medium / Discipline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Oil on Canvas, Bronze, Mixed Media..."
                      className="w-full bg-[#0c0911] border border-[#2f2642] focus:border-[#cda250] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52495d] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a89fad] mb-1.5 font-medium">
                      Portfolio / Website URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://yourportfolio.com"
                      className="w-full bg-[#0c0911] border border-[#2f2642] focus:border-[#cda250] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52495d] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a89fad] mb-1.5 font-medium">
                    Artist Statement &amp; Vision (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell our board about your creative process, your heritage, and what Meraki means to your practice..."
                    className="w-full bg-[#0c0911] border border-[#2f2642] focus:border-[#cda250] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52495d] outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#cda250] via-[#e6c587] to-[#cda250] text-black font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(205,162,80,0.25)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Fellowship Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── INQUIRY MODAL (FOR ARTWORKS) ─────────────────────────────────── */}
      {inquiryArtwork && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14101c] border border-[#2b2339] rounded-2xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => {
                setInquiryArtwork(null);
                setInquirySent(false);
              }}
              className="absolute top-4 right-4 text-[#8d8396] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {inquirySent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-serif font-bold text-white">Inquiry Forwarded</h4>
                <p className="text-xs text-[#a89fad]">
                  Our curator desk will contact you with provenance details and acquisition terms.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Inquire Acquisition</h3>
                <p className="text-xs text-[#cda250] mt-1 font-serif italic">
                  {inquiryArtwork.title} by {inquiryArtwork.artist}
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInquirySent(true);
                  }}
                  className="mt-5 space-y-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    className="w-full bg-[#0c0911] border border-[#2f2642] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#cda250]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    className="w-full bg-[#0c0911] border border-[#2f2642] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#cda250]"
                  />
                  <textarea
                    rows={3}
                    placeholder="Special requests, shipping country, or institutional inquiry..."
                    className="w-full bg-[#0c0911] border border-[#2f2642] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#cda250] resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#cda250] text-black font-bold text-xs uppercase tracking-wider hover:brightness-105"
                  >
                    Submit Acquisition Inquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer id="contact" className="border-t border-[#241e2f] bg-[#08060a] py-16 text-xs text-[#71687a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#cda250] text-black font-serif font-bold text-base flex items-center justify-center">
                M
              </div>
              <span className="font-serif font-bold text-base text-white tracking-widest uppercase">
                Meraki Art Federation
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8d8396] font-light">
              International coalition of fine artists and sculptors dedicated to creative sovereignty, heritage preservation, and global salons.
            </p>
            <div className="text-[11px] text-[#cda250] font-mono">
              merakiartfed.com
            </div>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-3">
              Navigation
            </h5>
            <ul className="space-y-2">
              <li>
                <a href="#exhibitions" className="hover:text-[#cda250] transition-colors">
                  Current Exhibitions
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#cda250] transition-colors">
                  Vault &amp; Catalog
                </a>
              </li>
              <li>
                <a href="#artists" className="hover:text-[#cda250] transition-colors">
                  Resident Masters
                </a>
              </li>
              <li>
                <a href="#manifesto" className="hover:text-[#cda250] transition-colors">
                  Federation Manifesto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-3">
              Curator Ateliers
            </h5>
            <ul className="space-y-2 text-[11px] text-[#8d8396]">
              <li>Paris Atelier: 14 Rue de Beaux-Arts</li>
              <li>Kyoto Studio: Gion Art District</li>
              <li>London Salon: Mayfair Curatorial Desk</li>
              <li className="pt-1 text-[#cda250]">curator@merakiartfed.com</li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-3">
              Domain &amp; Deployment
            </h5>
            <p className="text-[11px] text-[#8d8396] leading-relaxed">
              Configured for production deployment to <strong className="text-white">merakiartfed.com</strong> via Vercel with automated SSL certification and edge routing.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#1c1724] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>© {new Date().getFullYear()} Meraki Art Federation (merakiartfed.com). All rights reserved.</span>
          <span className="text-[#a89fad]">Built with soul &amp; passion.</span>
        </div>
      </footer>
    </div>
  );
}
