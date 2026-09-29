# 🌌 PolarisChain

**Navigating Trust across federated PKI ecosystems**

PolarisChain is a research-driven platform focused on modeling trust relationships in federated Public Key Infrastructure (PKI) environments using graph-based approaches. Its goal is to enable efficient, explainable, and interoperable certificate validation across complex, multi-domain ecosystems.


## :newspaper: Overview

In modern PKI ecosystems, certificate validation paths can become increasingly complex due to:

- Cross-certification between Certification Authorities (CAs)
- Multiple trust anchors
- Heterogeneous federation models (mesh, bridge, hybrid)

PolarisChain addresses this complexity by making federated trust governance **explicit, computable, and auditable**, not merely an enriched pathfinding exercise. It does so by:

- Representing PKI ecosystems as **trust graphs**
- Enabling **path discovery algorithms** for certificate validation
- Providing **what-if governance analysis** before signing cross-certification edges
- Providing a **visual and conceptual framework** for federated trust


## 🧠 Key Concepts

- **Federated PKI**: Interconnected certification domains with shared trust relationships
- **Trust Graphs**: Graph-based modeling of CAs and trust paths
- **Discover**: Return admissible certification paths with deployable artifacts
- **Govern**: What-if analysis before signing cross-certification edges, detecting unintended transitive trust
- **Audit**: Visualizing trust propagation, detecting constraint gaps, verifying scope compliance
- **Interoperability**: Supporting diverse PKI models without replacing existing standards (e.g., PKIX / RFC 5280)


## 🏗️ Project Structure

This repository contains the **main web interface** of PolarisChain: a static, narrative landing page built with Astro.

```text
polarischain-web/
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages build + deploy
├── astro.config.mjs
├── package.json
├── public/
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── hero/          # Night-sky hero and its sky chart
│   │   ├── sections/      # One component per chapter of the story:
│   │   │                  #   Motivation, Landscape, Gap, Proposal, Model,
│   │   │                  #   HowItWorks, Admission, CommonLog, Migration,
│   │   │                  #   UseCases, Laboratory, Credits
│   │   ├── figures/       # Inline SVG figures adapted from the thesis,
│   │   │                  #   each with a wide and a narrow drawing
│   │   ├── PathDiscovery.astro   # Live federated path-discovery figure
│   │   ├── Horizon.astro         # Closing night sea: Polaris and a sailboat
│   │   └── Chapter.astro, Figure.astro, Header.astro
│   ├── data/              # Path-discovery scene and key references
│   ├── layouts/           # Base page layout
│   ├── lib/               # Vanilla-TS modules: dive.ts (hero camera move),
│   │                      #   federation-wheel.ts (hero sky chart) and
│   │                      #   path-discovery.ts
│   ├── scripts/main.ts    # Single client entry
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css     # Design tokens and the shared SVG vocabulary
└── tsconfig.json
```


## 🚀 Development

Run locally:

```sh
pnpm install
pnpm dev
```

Build for production:

```sh
pnpm build
```

The generated static site will be available in:

```
/dist
```


## 🧞 Commands

All commands are run from the root of the project:

| Command         | Action                            |
|-----------------|------------------------------------|
| `pnpm install`  | Install dependencies              |
| `pnpm dev`      | Start local development server    |
| `pnpm build`    | Build production site             |
| `pnpm preview`  | Preview build locally             |
| `pnpm astro`    | Run Astro CLI commands            |


## 🎨 Design System

- **Colour**: the IEEE Brand Identity colour guide (03/2025). The page
  opens on a black night sky that fades into a deep shade of IEEE Dark
  Blue, held for the rest of the page. Tokens live in a plain `:root`
  block in `src/styles/global.css`.
- **Typography**: Playfair Display for titles and subtitles; a
  monospaced body face in the style of certificate.transparency.dev,
  iA Writer Duo S when its webfonts are placed in `src/assets/fonts/`
  and IBM Plex Mono, the family it derives from, otherwise; Archivo
  inside the figures; STIX Two Math for the equations and for the Greek
  letters and symbols anywhere else, since the text faces do not carry
  them. All faces are under the SIL Open Font License. Playfair
  Display, IBM Plex Mono and Archivo come from Fontsource; STIX Two
  Math is served whole from `src/assets/fonts/`, since the Fontsource
  package limits it to Latin.
- **Figures**: minimal inline SVG in the style of
  certificate.transparency.dev: thin strokes, still nodes, and only the
  dashed lines in motion. Every figure has a wide drawing and a narrow
  one for phones, so nothing scrolls sideways.
- **Motion**: one scroll-linked camera move in the hero, the federation
  turning about Polaris in the hero sky chart, and the path-discovery
  artefact, all in vanilla TypeScript. The page closes on a night sea,
  with Polaris at the end of the Little Dipper, its track on the water and a
  small sailboat taking a sight on it, in inline SVG with CSS-only
  motion. Respects
  `prefers-reduced-motion: reduce`.


## 🌐 Deployment

`polarischain-web`, the presentation site in this repository, is 100%
static (`output: 'static'`) and is deployed to **GitHub Pages** via
GitHub Actions: every push to `main` triggers
`.github/workflows/deploy.yml`, which builds with pnpm and publishes
`/dist`. `polarischain-docs` is served from GitHub Pages as well.

The wider platform is not static: `polarischain-app` is a real backend
(ASP.NET Core validation engine and APIs) and is hosted separately.

The site is served from a project subpath, so `astro.config.mjs` sets
`site: 'https://ptposa.github.io'` and `base: '/polarischain-web'`:

👉 https://ptposa.github.io/polarischain-web/

A custom domain is planned but not configured yet. Switching to one
means dropping `base` and updating `site` accordingly.

The generated `/dist` output remains compatible with any static host
(Nginx, IIS, Vercel, Netlify).


## 🔗 Ecosystem

PolarisChain is structured as a modular platform:

- `polarischain-web` → Main website (this repository)
- `polarischain-docs` → Technical documentation (Docusaurus)
- `polarischain-app` → Core application: validation engine & APIs (ASP.NET Core on Kestrel, PostgreSQL, BouncyCastle .NET)


## 🎓 Academic Context

This project is developed as part of:

- 🎓 Master's Degree in Cybersecurity & Cyberintelligence
- 🏫 Universitat Politècnica de València (UPV)
- 📄 Master's Thesis (TFM), with planned continuation toward a PhD
- 👨‍🏫 Thesis director: Dr. Mario Aragonés Lozano


## 🔬 Research Vision

PolarisChain aims to contribute to:

- Scalable trust in global PKI ecosystems
- Graph-based validation models with explicit, computable governance
- Post-quantum-ready interoperability strategies (PQ/T hybrid, ML-DSA, SLH-DSA)


## 🤝 Open Source Philosophy

This project embraces an open and collaborative approach to:

- Share knowledge with the cybersecurity community
- Enable reproducible research
- Contribute to the evolution of PKI systems


## 📬 Contact

Author: Jorge Pablo Trías Posa
Institution: Universitat Politècnica de València


## ⭐ Future Work

- Trust path optimization algorithms (Discover pillar)
- What-if governance analysis tooling (Govern pillar)
- Visual graph exploration and constraint-gap auditing (Audit pillar)
- Integration with real PKI infrastructures (EJBCA, three-domain lab: classical / hybrid / PQC-pure)
- Support for hybrid and post-quantum PKI models


## 🧭 Inspiration

Just as navigators relied on the **Polaris star** to find their way across the ocean,
**PolarisChain** aims to guide certificates through the complexity of federated trust.


## 👀 Live Deployment

The PolarisChain platform is available online:

👉 https://ptposa.github.io/polarischain-web/

Experience the graph-based trust model and explore federated PKI concepts in a real environment.

The `polarischain.org` domain is reserved for future use and does not
serve the site yet.
