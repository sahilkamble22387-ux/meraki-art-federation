# Meraki Art Federation (merakiartfed.com)

A high-end, gallery-grade web platform for the **Meraki Art Federation** — an international coalition of contemporary fine artists, sculptors, and creative visionaries.

---

## 🏛️ Features Included

1. **Editorial Fine-Art Aesthetics**:
   - Palette: Deep Museum Charcoal (`#0b090e`), Travertine Ivory (`#f4efe8`), and Burnished Gold (`#cda250`).
   - Typography: Classical Cormorant Garamond Serif paired with Plus Jakarta Sans.
2. **Curated Exhibition Spotlight**:
   - Spotlight for upcoming physical salons (Paris) & virtual reality vernissages.
3. **The Permanent Vault (Interactive Artworks Gallery)**:
   - Filterable categories: Oil & Linen, Bronze & Sculpture, Mixed Media, Minimalist Reliefs.
   - Artwork metadata: Medium, year, dimensions, exhibition status.
   - Interactive acquisition inquiry modal.
4. **Resident Masters & Fellows Collective**:
   - Artist profiles, disciplines, origins, and philosophical statements.
5. **The Meraki Manifesto**:
   - Core pillars: Artistic Sovereignty, Endowed Fellowships, Global Salons, Archival Provenance.
6. **Fellowship Application Portal**:
   - Submission form for candidate artists, sculptors, and fellows.

---

## 🚀 How to Deploy to Vercel with merakiartfed.com

### Step 1: Initialize Git & Push to GitHub
In terminal:
```bash
cd /Users/sahilkamble/Desktop/meraki-art-federation
git init
git add .
git commit -m "feat: initial release of Meraki Art Federation website"
```
Create a GitHub repo (e.g. `meraki-art-federation`) and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/meraki-art-federation.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New..."** → **"Project"**.
2. Select your `meraki-art-federation` repository.
3. Framework Preset: **Next.js** (auto-detected).
4. Click **Deploy**.

### Step 3: Connect Custom Domain (`merakiartfed.com`)
1. In your project on Vercel, go to **Settings** → **Domains**.
2. Enter `merakiartfed.com` and click **Add**.
3. Choose the recommended option to also add `www.merakiartfed.com`.
4. Vercel will give you the DNS records.

### Step 4: What your friend adds in their domain provider
Send this to your friend:
- **Type: A** | Name: `@` | Value: `76.76.21.21`
- **Type: CNAME** | Name: `www` | Value: `cname.vercel-dns.com`

Within a few minutes, Vercel will verify the domain, issue a free SSL certificate, and `https://merakiartfed.com` will be live worldwide!
