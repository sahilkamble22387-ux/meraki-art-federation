/**
 * Meraki Art Federation — official website copy (single source of truth).
 * The 3D engine (About room), the hero overlay, the menu, the footer and the
 * DOM pages (/sanmanya, /partner) all read from here so strings are never duplicated.
 *
 * NOTE: external URLs (Google Form, WhatsApp channel, Instagram, YouTube) are
 * pending from the client. Leave them as "" and the UI degrades gracefully
 * (the Apply CTA falls back to the /partner form). Fill them in when received.
 */

export const CONTACT = {
  organization: "Meraki Art Federation",
  division: "A Division of Shore Global",
  techPartner: "Foxbytes Studios",
  phone: "+91 9284962491",
  phoneHref: "+919284962491",
  emailInquiries: "contact@merakiartfed.com",
  emailPartnerships: "partnerships@merakiartfed.com",
  headquarters: "Nagpur, Maharashtra, India",
}

/** Artist application Google Form — pending from client; "" = use /partner fallback. */
export const ARTIST_FORM_URL = ""

/** Social / channel links — pending from client. */
export const SOCIAL_LINKS = {
  whatsapp: "",
  instagram: "",
  youtube: "",
}

// ---------------------------------------------------------------- hero

export const HERO = {
  kicker: "Meraki Art Federation",
  headlineA: "Art for the Soul,",
  headlineB: "Tour for the World.",
  sub: "Meraki bridges the gap between grassroots creators and global stages. From fine canvas art and heavy sculptures to soul-stirring music, classical dance, and literature—we build world-class platforms that honor the true dignity of creation.",
  badges: [
    { stat: "80% Direct Artist Payout", note: "Fair, Dignified, Sovereign" },
    { stat: "2 Annual Flagships", note: "Summer & Winter Sessions" },
    { stat: "5 Art Disciplines", note: "Fine Art • Sculpture • Music • Dance • Literature" },
    { stat: "Global Tour Network", note: "Taking Grassroots Talent Worldwide" },
  ],
}

// ---------------------------------------------------------------- about room

export type TeamMember = {
  uid: string
  name: string
  role: string
  rank: string
  photo: string
  bio: string[]
  founder?: boolean
}

export const TEAM: TeamMember[] = [
  {
    uid: "kalyani-muley",
    name: "Kalyani Muley",
    role: "Head of Operations",
    rank: "1st Number",
    photo: "/meraki/team/kalyani-muley.png",
    bio: [
      "Overseeing administrative compliance, ground execution protocols, vendor relations, and overall event alignment for Meraki flagships.",
    ],
  },
  {
    uid: "aditya-muley",
    name: "Aditya Muley",
    role: "Operations Manager",
    rank: "2nd Number",
    photo: "/meraki/team/aditya-muley.png",
    bio: [
      "Directing ground logistics, infrastructure execution, and corporate sponsor alignment for seamless operational delivery across all grand showcases.",
    ],
  },
  {
    uid: "khushali-naidu",
    name: "Khushali Naidu",
    role: "Head of Artist & Curator Relations",
    rank: "3rd Number",
    photo: "/meraki/team/khushali-naidu.png",
    bio: [
      "Leading artist outreach, curator onboarding, and community engagement to connect master and emerging creators with Meraki platforms.",
    ],
  },
  {
    uid: "ayush-bhoyar",
    name: "Ayush Milind Bhoyar",
    role: "Founder",
    rank: "Founder",
    photo: "/meraki/team/ayush-bhoyar.png",
    founder: true,
    bio: [
      "Meraki is not everywhere, but somewhere it stands with dignity.",
      "No artist is an artist by profession. Perhaps right from childhood, they see certain colors in their dreams and bring them to life on a blank canvas to express their emotions. Just like children playing in the sand build whimsical shapes, or playing in the water give new direction to the waves—someone who captures an unseen emotion that forces everyone to think, that is a true artist.",
    ],
  },
]

export const PARTNERS = [
  {
    name: "Shore Global",
    role: "Parent Conglomerate",
    line: "Providing overarching strategic governance, corporate backing, and institutional vision for the Meraki Art Federation.",
  },
  {
    name: "Foxbytes Studios",
    role: "Official Digital Infrastructure Partner",
    line: "Powering the digital ecosystem, web architecture, online catalog engines, digital ticketing, and tech infrastructure for Meraki globally.",
  },
]

export type AboutPanel = {
  id: string
  kicker: string
  title: string
  paragraphs: string[]
}

export const ABOUT_PANELS: Record<string, AboutPanel> = {
  essence: {
    id: "essence",
    kicker: "About Meraki",
    title: "The Essence of Meraki",
    paragraphs: [
      "At its core, Meraki is a Greek word that means doing something with total soul, passion, and devotion—leaving a piece of yourself in what you create.",
      "We operate as a global movement dedicated to restoring honor, freedom, and economic empowerment to artists. We believe art is not confined to a gallery wall—art is anything born directly from the soul. Whether expressed through the stroke of a brush, the resonance of a melody, the form of a sculpture, the rhythm of dance, or the weight of a written line, Meraki provides the stage, the audience, and the global platform creators deserve.",
      "By organizing international showcase tours and hosting two grand annual national milestones—our flagship Summer Session and Winter Session—we build self-sustaining ecosystems where creators thrive without commercial exploitation.",
    ],
  },
  mission: {
    id: "mission",
    kicker: "Mission",
    title: "Our Mission",
    paragraphs: [
      "To discover, elevate, and empower master and emerging creators across all disciplines by building world-class platforms, guaranteeing an unprecedented 80% sales payout, and taking authentic art from local studios to global stages.",
    ],
  },
  vision: {
    id: "vision",
    kicker: "Vision",
    title: "Our Vision",
    paragraphs: [
      "To build a world where creative talent is celebrated as a vital force of human culture—where every artist retains dignity, creative sovereignty, and fair financial independence without gatekeeping.",
    ],
  },
  goals: {
    id: "goals",
    kicker: "Core Goals",
    title: "Strategic Goals",
    paragraphs: [
      "Global Talent Mobility — Organize structured international showcase tours connecting regional artists with global collectors, galleries, and cultural institutions.",
      "Economic Dignity — Reclaim fair monetization through our strict 80% direct-to-artist sales payout policy on all sold masterpieces.",
      "Biannual Excellence — Execute high-impact, multi-disciplinary national flagships twice a year—the Summer and Winter Sessions—setting benchmark standards in gallery design, technical lighting, and VIP collector experiences.",
      "Cross-Disciplinary Integration — Break down barriers between fine art, music, dance, sculpture, and literature into unified, multi-sensory cultural festivals.",
    ],
  },
  founder: {
    id: "founder",
    kicker: "Founder's Statement",
    title: "Ayush Milind Bhoyar",
    paragraphs: [
      "“Meraki is not everywhere, but somewhere it stands with dignity.”",
      "“No artist is an artist by profession. Perhaps right from childhood, they see certain colors in their dreams and bring them to life on a blank canvas to express their emotions. Just like children playing in the sand build whimsical shapes, or playing in the water give new direction to the waves—someone who captures an unseen emotion that forces everyone to think, that is a true artist.”",
    ],
  },
}

// ---------------------------------------------------------------- sessions

export const SESSIONS = [
  {
    name: "The Summer Session",
    tag: "Outdoors, Movement & Global Launchpad",
    body: "Hosted annually during the summer months, the Summer Session serves as an expansive celebration of open-air art pavilions, live performance festivals, outdoor sculpture workshops, and the official launching pad for Meraki's international artist tours.",
  },
  {
    name: "The Winter Session (SANMANYA)",
    tag: "The Grand Fine Art Showcase & Collector Gala",
    body: "Held during the winter, SANMANYA represents Meraki's premier multi-day fine art, sculpture, live music, and literary gathering. Bringing together over 200+ master creators, high-net-worth collectors, architects, and corporate leaders, SANMANYA stands as a beacon of artistic prestige and social impact.",
  },
]

// ---------------------------------------------------------------- SANMANYA page

export const SANMANYA = {
  meaning: [
    "Sanmanya stands for equal respect and honor.",
    "At Meraki, we respect every single creation done by an artist equally—no artist or artwork is superior or inferior. Every discipline (painting, sculpture, music, dance, literature) holds equal value and dignity on our platform.",
  ],
  heart: [
    "Meraki represents anything created with pure soul, passion, and devotion.",
    "We curate international tours to take master and emerging talent across world stages.",
    "We host two grand annual milestones: our flagship Summer Session and Winter Session.",
  ],
  facts: [
    { label: "Dates", value: "February 2027" },
    { label: "Venue", value: "Chitnavis Centre, Nagpur" },
    { label: "Scale", value: "≈150 selected artists under one grand multi-disciplinary roof" },
    { label: "Sales Potential", value: "70% likelihood of sale with targeted VIP collector invitations" },
  ],
  infrastructure: [
    "Exhibitions are hosted on the main ground lawn with full professional museum-grade infrastructure provided directly by Meraki.",
    "Every artist is provided with dedicated ply-board display panels, heavy pedestals (for sculptures), and specialized gallery track lighting.",
    "You simply bring your art; we handle the setup.",
  ],
  sales: "With targeted VIP collector invitations, interior designers (IIID), architects, and corporate buyers attending, exhibiting on our platform gives your artwork a 70% probability of getting sold.",
  commission: [
    { tier: "Artworks priced under ₹10,000", rate: "0% Commission", note: "Emerging creators retain maximum sales value — you keep 100%." },
    { tier: "Artworks priced above ₹10,000", rate: "Flat 20% Commission", note: "A nominal commission only — you keep 80% of your earnings." },
  ],
  valueProps: [
    {
      title: "The 80% Direct Payout Model",
      body: "Meraki passes 80% of all artwork sale proceeds directly to the artist, ensuring creators are fairly rewarded for their work.",
    },
    {
      title: "International Tour Access",
      body: "Exhibiting with Meraki unlocks opportunities to participate in international cultural exchanges and global gallery tours organized by the federation across key art capitals.",
    },
    {
      title: "Museum-Grade Infrastructure",
      body: "Every painting, sculpture, and performance is presented using heavy-duty ply display walls, high-gallery track lighting, and professional acoustic sound setups.",
    },
    {
      title: "Direct HNI & Collector Visibility",
      body: "Gain direct access to high-net-worth individuals, members of the Indian Institute of Interior Designers (IIID), architects, luxury property developers, and corporate art buyers.",
    },
  ],
}
