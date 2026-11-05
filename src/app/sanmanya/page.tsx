import type { Metadata } from "next";
import { TvSanmanyaPage } from "@/components/meraki/tv-sanmanya-page";

export const metadata: Metadata = {
  title: "SANMANYA 2027 (Phase 2) — Meraki Art Federation",
  description:
    "SANMANYA 2027 — the grand Winter Session fine art showcase & collector gala. February 2027 at Chitnavis Centre, Nagpur. ~150 selected artists, museum-grade infrastructure, 70% sales potential, and a transparent fair commission structure.",
};

export default function SanmanyaPage() {
  return <TvSanmanyaPage />;
}
