import type { Metadata } from "next";
import "./globals.css";
import { TvClient } from "@/components/gallery3d/tv-client";

export const metadata: Metadata = {
  title: "Meraki Art Federation — Art for the Soul, Tour for the World",
  description:
    "Meraki bridges the gap between grassroots creators and global stages—fine art, sculpture, music, dance and literature—with an 80% direct artist payout and two annual flagships: the Summer Session and SANMANYA 2027, the Winter Session at Nagpur.",
  metadataBase: new URL("https://merakiartfed.com"),
  alternates: {
    canonical: "https://merakiartfed.com",
  },
  openGraph: {
    title: "Meraki Art Federation — Art for the Soul, Tour for the World",
    description:
      "Meraki bridges the gap between grassroots creators and global stages—fine art, sculpture, music, dance and literature—with an 80% direct artist payout and two annual flagships: the Summer Session and SANMANYA 2027, the Winter Session at Nagpur.",
    url: "https://merakiartfed.com",
    siteName: "Meraki Art Federation",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meraki Art Federation — Art for the Soul, Tour for the World",
    description:
      "Meraki bridges the gap between grassroots creators and global stages—fine art, sculpture, music, dance and literature—with an 80% direct artist payout and two annual flagships: the Summer Session and SANMANYA 2027, the Winter Session at Nagpur.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#070608] text-foreground select-none">
        <TvClient>{children}</TvClient>
      </body>
    </html>
  );
}
