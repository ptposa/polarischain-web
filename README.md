# 🌌 PolarisChain

**Navigating Trust across federated PKI ecosystems**

PolarisChain is a research-driven platform focused on modeling trust relationships in federated Public Key Infrastructure (PKI) environments using graph-based approaches. Its goal is to enable efficient, explainable, and interoperable certificate validation across complex, multi-domain ecosystems.


## :newspaper: Overview

In modern PKI ecosystems, certificate validation paths can become increasingly complex due to:

- Cross-certification between Certification Authorities (CAs)
- Multiple trust anchors
- Heterogeneous federation models (mesh, bridge, hybrid)

PolarisChain addresses this complexity by making federated trust governance **explicit, computable, and auditable** — not merely an enriched pathfinding exercise. It does so by:

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
│   ├── components/        # One component per narrative section
│   │   ├── hero/          # Scroll-dive hero (constellation, caption)
│   │   └── ...            # Challenges, Platform, UseCases, Research,
│   │                      # MathModel, OptimalPaths, HowItWorks,
│   │                      # Contribution, OpenScience
│   ├── data/              # Typed content (TS + Zod): constellation nodes,
│   │                      # process steps, scoring table, Φ definitions,
│   │                      # cost-function coefficients
│   ├── layouts/           # Base page layout
│   ├── lib/               # Vanilla-TS animation modules, sharing a single
│   │                      # rAF scheduler (no GSAP / animation libraries):
│   │                      #   raf-loop.ts, starfield.ts, scroll-dive.ts,
│   │                      #   step-timeline.ts, pki-graph.ts
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css     # Tailwind v4 @theme tokens (design system)
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

- **Tailwind v4**, tokens-only: every design value (color palette, radii,
  typography) is defined once in `src/styles/global.css` under `@theme`.
  Component markup keeps its own semantic classes rather than being
  rewritten into utility classes, to preserve exact visual fidelity with
  the validated design.
- **Fonts**: Playfair Display (display/serif), DM Sans (body text), IBM
  Plex Mono (all monospaced content) and Archivo (header wordmark only),
  self-hosted via `@fontsource`.
- **Animation**: scroll-driven interactions (hero dive, timeline
  activation, path-discovery graph) are hand-written vanilla TypeScript
  using `requestAnimationFrame` and damped lerp easing, coordinated
  through a single shared scheduler — deliberately without an animation
  library.
- Respects `prefers-reduced-motion: reduce`.


## 🌐 Deployment

This project is 100% static (`output: 'static'`) and is deployed to
**GitHub Pages** via GitHub Actions: every push to `main` triggers
`.github/workflows/deploy.yml`, which builds with pnpm and publishes
`/dist`. `polarischain-docs` is served from GitHub Pages as well.

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
- `polarischain-app` → Core application: validation engine & APIs (ASP.NET Core, SQL Graph, BouncyCastle .NET)


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
