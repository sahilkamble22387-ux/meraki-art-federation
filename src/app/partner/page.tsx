import type { Metadata } from "next";
import { TvPartnerPage } from "@/components/meraki/tv-partner-page";

export const metadata: Metadata = {
  title: "Partner & Sponsor — Meraki Art Federation",
  description:
    "Apply as an artist or partner with Meraki Art Federation as a business. Sponsorship and partnership inquiries reach Team Meraki directly. A Division of Shore Global, Nagpur, Maharashtra.",
};

export default function PartnerPage() {
  return <TvPartnerPage />;
}
