import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — The People of Meraki",
  description:
    "Step into the Leadership Pavilion of the Meraki Art Federation. Meet the founder, the operations team, and the partners behind the movement—Shore Global and Foxbytes Studios.",
};

/**
 * Meraki — About route marker.
 * The Leadership Pavilion (3D room with team portraits) is driven by TvClient
 * mounted in RootLayout; the engine treats /about as its own walkable room.
 */
export default function AboutPage() {
  return null;
}
