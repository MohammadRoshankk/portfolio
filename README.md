# Mohammad Roshan — 3D WebGL Portfolio & AI Systems

An award-winning caliber 3D interactive portfolio inspired by **inacionakiti.com**, built for **Mohammad Roshan K** — Creative Engineer, AI Engineer, and Data Systems Architect.

---

## 🌟 Key Features

1. **Dual-Mode Interactive Experience**
   - **Full Site Experience (`?v=site`)**: Rich portfolio with physics-based smooth scrolling, 3D spline camera pathing, interactive project showcase with 3D tilt, skills matrix, and direct contact.
   - **3D Particle Journey (`?v=story`)**: 4-chapter narrative journey through the data space with procedural shape-morphing (Nebula $\rightarrow$ Neural Synapse Torus $\rightarrow$ Distributed Matrix $\rightarrow$ Fluid Wave).
2. **28,000 GPU Particles with Custom GLSL Shaders**
   - 3D curl noise turbulence.
   - Real-time mouse field repulsion & attraction.
   - ACES Filmic Tone Mapping with responsive point size attenuation.
3. **Procedural Web Audio Synthesizer**
   - Synthesizes dynamic binaural ambient drone pads (55Hz/110Hz) and interactive UI feedback blips using the native **Web Audio API** without loading external audio files.
4. **Optimized for Zero-Config Preview**
   - Native ESM import maps allow instant preview with any static HTTP server (`python3 -m http.server 3000`) or standard modern bundling with **Vite**.

---

## 🚀 Quick Start

### Option A: Static Preview (Instant, Zero Install)
```bash
python3 -m http.server 3000
```
Then visit:
- **Site Mode**: [http://localhost:3000/?v=site](http://localhost:3000/?v=site)
- **3D Journey**: [http://localhost:3000/?v=story](http://localhost:3000/?v=story)

### Option B: Vite Dev Server
```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
portfolio/
├── index.html         # Main markup, SEO meta, dual-mode containers
├── style.css          # Dark luxury styling, glassmorphism, responsive grid
├── roshan.jpg         # High-resolution portrait photo
├── vite.config.js     # Vite configuration
├── package.json       # Dependencies & scripts
└── src/
    └── main.js        # Three.js scene, GLSL shaders, camera splines, audio synth
```

---

## 🔗 Connected Profiles

- **LinkedIn**: [https://www.linkedin.com/in/roshankk/](https://www.linkedin.com/in/roshankk/)
- **GitHub**: [https://github.com/MohammadRoshankk](https://github.com/MohammadRoshankk)
- **GitHub (Alrawi / Cosmoshift)**: [https://github.com/alrawiweb-code](https://github.com/alrawiweb-code)
- **Email**: [rosancva@gmail.com](mailto:rosancva@gmail.com)
