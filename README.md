# 🌌 PolarisChain

**Navigating Trust Across Federated PKI Ecosystems**

PolarisChain is a research-driven platform focused on modeling trust relationships in federated Public Key Infrastructure (PKI) environments using graph-based approaches. Its goal is to enable efficient, explainable, and interoperable certificate validation across complex, multi-domain ecosystems.

---

## 🚀 Overview

In modern PKI ecosystems, certificate validation paths can become increasingly complex due to:

- Cross-certification between Certification Authorities (CAs)
- Multiple trust anchors
- Heterogeneous federation models (mesh, bridge, hybrid)

PolarisChain addresses this complexity by:

- Representing PKI ecosystems as **trust graphs**
- Enabling **path discovery algorithms** for certificate validation
- Providing a **visual and conceptual framework** for federated trust

---

## 🧠 Key Concepts

- **Federated PKI**: Interconnected certification domains with shared trust relationships  
- **Trust Graphs**: Graph-based modeling of CAs and trust paths  
- **Path Discovery**: Finding optimal validation chains between entities  
- **Interoperability**: Supporting diverse PKI models without replacing existing standards (e.g., PKIX)

---

## 🏗️ Project Structure

This repository contains the **main web interface** of PolarisChain.

```text
polarischain-web/
├── public/        # Static assets
├── src/
│   ├── components/  # UI and graph components
│   ├── layouts/     # Page layouts
│   ├── pages/       # Routes (Astro)
│   └── styles/      # Styling
├── astro.config.mjs
├── package.json
└── README.md

---

## 🧪 Development

Run locally:

```sh
npm install
npm run dev
```

Build for production:

```sh
npm run build
```

The generated static site will be available in:

```
/dist
```

---

## 🧞 Commands

All commands are run from the root of the project:

| Command           | Action                            |
|------------------|-----------------------------------|
| `npm install`    | Install dependencies              |
| `npm run dev`    | Start local development server    |
| `npm run build`  | Build production site             |
| `npm run preview`| Preview build locally             |
| `npm run astro`  | Run Astro CLI commands            |

---

## 🌐 Deployment

This project is designed to be deployed as a **static site**.

Example deployment environments:

- IIS (Windows Server)
- Nginx / Apache
- Static hosting (GitHub Pages, Vercel, Netlify)

---

## 🔗 Ecosystem

PolarisChain is structured as a modular platform:

- `polarischain-web` → Main website (this repository)
- `polarischain-docs` → Technical documentation
- `polarischain-app` → Core application (validation engine & APIs)

---

## 🎓 Academic Context

This project is developed as part of:

- 🎓 Master’s Degree in Cybersecurity & Cyberintelligence  
- 🏫 Universitat Politècnica de València (UPV)  
- 📄 Master’s Thesis (TFM), with potential continuation toward a PhD  

---

## 🔬 Research Vision

PolarisChain aims to contribute to:

- Scalable trust in global PKI ecosystems  
- Graph-based validation models  
- Post-quantum-ready interoperability strategies  

---

## 🤝 Open Source Philosophy

This project embraces an open and collaborative approach to:

- Share knowledge with the cybersecurity community  
- Enable reproducible research  
- Contribute to the evolution of PKI systems  

---

## 📬 Contact

Author: Jorge Pablo Trías Posa  
Institution: Universitat Politècnica de València  

---

## ⭐ Future Work

- Trust path optimization algorithms  
- Visual graph exploration tools  
- Integration with real PKI infrastructures (EJBCA, etc.)  
- Support for hybrid and post-quantum PKI models  

---

## 🧭 Inspiration

Just as navigators relied on the **Polaris star** to find their way across the ocean,  
**PolarisChain** aims to guide certificates through the complexity of federated trust.

## 👀 Live Deployment

The PolarisChain platform is available online:

👉 https://polarischain.org

Experience the graph-based trust model and explore federated PKI concepts in a real environment.