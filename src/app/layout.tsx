import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const serifFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Meraki Art Federation — Global Collective of Visionary Artists",
  description:
    "Meraki Art Federation is an international coalition of contemporary painters, sculptors, and creative visionaries — curating world-class exhibitions, fellowships, and private collections.",
  metadataBase: new URL("https://merakiartfed.com"),
  alternates: {
    canonical: "https://merakiartfed.com",
  },
  openGraph: {
    title: "Meraki Art Federation — Where Passion Takes Form",
    description:
      "International collective of contemporary artists, sculptors, and cultural visionaries.",
    url: "https://merakiartfed.com",
    siteName: "Meraki Art Federation",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#0b090e] text-[#f4efe8] selection:bg-[#cda250]/30 selection:text-[#f4efe8]">
        {children}
      </body>
    </html>
  );
}
