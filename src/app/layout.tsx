import type { Metadata } from "next";
import "./globals.css";
import { TvClient } from "@/components/thevertmenthe/tv-client";

export const metadata: Metadata = {
  title: "Meraki Art Federation — 3D Art Gallery & Vault",
  description:
    "Step into the 3D virtual pavilion of the Meraki Art Federation. Explore curated fine arts, ballpoint pen masterpieces, and global acquisitions.",
  metadataBase: new URL("https://merakiartfed.com"),
  alternates: {
    canonical: "https://merakiartfed.com",
  },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Meraki Art Federation — 3D Art Gallery & Vault",
    description:
      "Step into the 3D virtual pavilion of the Meraki Art Federation. Explore curated fine arts, ballpoint pen masterpieces, and global acquisitions.",
    url: "https://merakiartfed.com",
    siteName: "Meraki Art Federation",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meraki Art Federation — 3D Art Gallery & Vault",
    description:
      "Step into the 3D virtual pavilion of the Meraki Art Federation. Explore curated fine arts, ballpoint pen masterpieces, and global acquisitions.",
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
