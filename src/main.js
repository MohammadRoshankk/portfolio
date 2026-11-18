/**
 * ==========================================================================
 * MOHAMMAD ROSHAN — REVERSE-ENGINEERED 3D ENGINE
 * Faithfully reproducing Inácio Nakiti's (inacionakiti.com) Particle Engine:
 * 1. Image-Sampled Dotted Portrait with Luminance Attenuation
 * 2. Idle Breathing, Sway & Parallax Depth Equation
 * 3. Interactive X-Ray Photo Reveal (Dots scatter to reveal real photo)
 * 4. Staggered "Vapour Mist" Flight Physics between 3D Geometries
 * 5. Generative 3D Sculptures: Cube Matrix, Torus, Helix, Wave & Text Name
 * 6. Dynamic Magnetic Hover Lens
 * ==========================================================================
 */

import * as THREE from 'three';
import { initPortraitReveal } from './portrait-reveal.js';

// --- MATH UTILITIES ---
const PI2 = Math.PI * 2;
const rand = (min = -1, max = 1) => min + Math.random() * (max - min);

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ==========================================================================
// 1. PROCEDURAL 3D FORM GENERATORS (INÁCIO NAKITI SPEC)
// ==========================================================================
const FormGenerators = {
  // 3D Rotating Data Cube with layered inner grid
  cube(count, target) {
    for (let i = 0; i < count; i++) {
      const u = (Math.floor(Math.random() * 14) / 13 - 0.5) * 0.6 + rand(-0.01, 0.01);
      const v = (Math.floor(Math.random() * 14) / 13 - 0.5) * 0.6 + rand(-0.01, 0.01);
      const face = i % 2 === 0 ? 0.3 : -0.3;
      const axis = (i >> 1) % 3;

      const x = axis === 0 ? face : axis === 1 ? u : v;
      const y = axis === 0 ? u : axis === 1 ? face : v;
      const z = axis === 0 ? v : axis === 1 ? u : face;

      target[i * 3] = x;
      target[i * 3 + 1] = y;
      target[i * 3 + 2] = z;
    }
  },

  // 3D Neural Synapse Torus (Donut)
  torus(count, target) {
    for (let i = 0; i < count; i++) {
      const u = Math.random() * PI2;
      const v = Math.random() * PI2;
      const R = 0.33 + 0.11 * Math.cos(v);
      target[i * 3] = R * Math.cos(u);
      target[i * 3 + 1] = 0.11 * Math.sin(v);
      target[i * 3 + 2] = R * Math.sin(u);
    }
  },

  // 3D Data Pipeline Double Helix
  helix(count, target) {
    for (let i = 0; i < count; i++) {
      const a = Math.random();
      if (i % 5 < 2) {
        const angle = a * PI2 * 2 + (i % 5) * Math.PI;
        target[i * 3] = Math.cos(angle) * 0.18 + rand(-0.008, 0.008);
        target[i * 3 + 1] = (a - 0.5) * 0.85;
        target[i * 3 + 2] = Math.sin(angle) * 0.18 + rand(-0.008, 0.008);
      } else {
        const step = Math.floor(a * 26) / 26;
        const angle = step * PI2 * 2;
        const radius = rand(0.05, 0.18);
        target[i * 3] = Math.cos(angle) * radius;
        target[i * 3 + 1] = (step - 0.5) * 0.85;
        target[i * 3 + 2] = Math.sin(angle) * radius;
      }
    }
  },

  // 3D Streaming Telemetry Wave
  wave(count, target) {
    const side = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      const x = ((i % side) / side - 0.5) * 1.1;
      const z = (Math.floor(i / side) / side - 0.5) * 1.1;
      const y = 0.08 * Math.sin(x * 9) + 0.08 * Math.cos(z * 7);
      target[i * 3] = x;
      target[i * 3 + 1] = y;
      target[i * 3 + 2] = z;
    }
  },

  // 3D Text Rasterizer: Spells out Name at the footer
  rasterizeText(text, count) {
    const offscreen = document.createElement('canvas');
    offscreen.width = 1200;
    offscreen.height = 240;
    const ctx = offscreen.getContext('2d', { willReadFrequently: true });

    ctx.font = 'bold 84px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, offscreen.width / 2, offscreen.height / 2);

    const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    const points = [];

    const step = 4;
    for (let y = 0; y < offscreen.height; y += step) {
      for (let x = 0; x < offscreen.width; x += step) {
        const alpha = imgData[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 128) {
          points.push(
            (x - offscreen.width / 2) / offscreen.height,
            (offscreen.height / 2 - y) / offscreen.height,
            rand(-0.02, 0.02)
          );
        }
      }
    }

    const target = new Float32Array(count * 3);
    const validCount = points.length / 3;

    for (let i = 0; i < count; i++) {
      const srcIdx = (i % validCount) * 3;
      target[i * 3] = points[srcIdx] + rand(-0.005, 0.005);
      target[i * 3 + 1] = points[srcIdx + 1] + rand(-0.005, 0.005);
      target[i * 3 + 2] = points[srcIdx + 2];
    }

    return target;
  }
};

// ==========================================================================
// 2. PORTRAIT SAMPLING (DOT-MATRIX GENERATION FROM IMAGE)
// ==========================================================================
async function samplePortrait(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetWidth = 320;
      const targetHeight = Math.round(targetWidth * (img.naturalHeight / img.naturalWidth));
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const data = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
      const positions = [];
      const lums = [];

      const step = 3; // Grid spacing in px
      for (let y = 0; y < targetHeight; y += step) {
        for (let x = 0; x < targetWidth; x += step) {
          const idx = (y * targetWidth + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          if (a > 64) {
            // Standard perceptual luminance
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0;

            // Normalized coordinates centered at (0, 0)
            const nx = (x - targetWidth / 2) / targetHeight;
            const ny = (targetHeight / 2 - y) / targetHeight;
            const nz = rand(-0.015, 0.015);

            positions.push(nx, ny, nz);
            lums.push(lum);
          }
        }
      }

      resolve({
        count: lums.length,
        positions: new Float32Array(positions),
        lums: new Float32Array(lums),
        aspect: targetWidth / targetHeight
      });
    };
    img.src = imageSrc;
  });
}

// ==========================================================================
// 3. GLSL SHADER CODE (EXACT INÁCIO NAKITI ENGINE ARCHITECTURE)
// ==========================================================================
const vertexShader = `
  uniform vec4 uFrom;       // cx, cy (px), size px, kind (0=portrait, 1=form)
  uniform vec4 uTo;
  uniform vec2 uFromRot;
  uniform vec2 uToRot;
  uniform float uFromAlpha;
  uniform float uToAlpha;
  uniform float uMix;
  uniform float uTime;
  uniform float uProgress;
  uniform float uSpacing;
  uniform float uDot;
  uniform vec2 uViewport;
  uniform vec2 uMouse;      // px (y down)
  uniform float uHover;
  uniform vec3 uLens;       // open hover lens: cx, cy, radius
  uniform float uLensMax;
  uniform float uLensDot;
  uniform vec3 uReveal;     // hero portrait reveal: cx, cy, radius
  uniform float uSwirl;     // how far dots swing out mid-flight
  uniform float uMist;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aLum;
  attribute vec3 aSeed;

  varying float vLum;
  varying float vSeed;
  varying float vAlpha;

  const float CAMERA = 2.2;

  float easeInOut(float t) {
    return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
  }

  // Portrait fade at lower torso
  float portraitFade(float y) {
    return mix(0.15, 1.0, smoothstep(-0.5, -0.1, y));
  }

  vec3 rotate(vec3 p, vec2 r) {
    float cy = cos(r.y), sy = sin(r.y);
    p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
    float cx = cos(r.x), sx = sin(r.x);
    return vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  }

  // Projection: screen xy, point size, alpha
  vec4 place(vec3 local, vec4 frame, vec2 rot, float alpha) {
    vec3 p = rotate(local, rot);
    p.z = min(p.z, CAMERA - 0.3);
    float persp = CAMERA / (CAMERA - p.z);
    vec2 screen = frame.xy + vec2(p.x, -p.y) * persp * frame.z;
    
    // Portrait mode
    if (frame.w < 0.5) {
      return vec4(screen, uSpacing * (0.3 + aLum * 0.95) * persp, alpha * portraitFade(local.y));
    }
    
    // 3D Forms mode
    float shade = clamp(0.55 + p.z * 1.4, 0.2, 1.0);
    return vec4(screen, uDot * (0.6 + aSeed.y * 0.8) * persp, alpha * shade);
  }

  // Inacio Nakiti's Idle Sway & Breathing Equation
  vec2 idle() {
    float h = aFrom.y + 0.5; // 0 at torso, 1 at head
    vec2 o = vec2(sin(uTime * 0.45) * 4.0 * h, -sin(uTime * 1.1) * 3.0 * h);
    o.x += sin(aFrom.y * 16.0 - uTime * 1.8 + aSeed.z * 2.0) * 1.4 * smoothstep(0.1, 0.9, h);
    // Cursor depth parallax
    o += (uMouse - uFrom.xy) / uViewport * (aLum - 0.4) * 28.0;
    return o;
  }

  void main() {
    vLum = aLum;
    vSeed = aSeed.z;

    vec3 dir = normalize(aSeed * 2.0 - 1.0 + 0.0001);
    bool fromPortrait = uFrom.w < 0.5;
    bool mist = fromPortrait || uMist > 0.5;

    // Staggered flight departure
    float order = aSeed.x * (mist ? 0.3 : 0.45);
    float raw = clamp((uMix - order) / (mist ? 0.7 : 0.55), 0.0, 1.0);
    float t = easeInOut(raw);
    float flight = sin(t * 3.14159);

    vec4 a = place(aFrom, uFrom, uFromRot, uFromAlpha);
    if (fromPortrait) a.xy += idle();

    vec4 b = place(aTo, uTo, uToRot, uToAlpha);

    // Mid-flight interpolation
    vec2 screen = mix(a.xy, b.xy, t);

    // Swing outwards into "vapour mist"
    screen += dir.xy * flight * uViewport.y * uSwirl;

    float size = mix(a.z, b.z, t);
    float alpha = mix(a.w, b.w, t);

    // Mist: dots swell and vaporize mid-flight
    if (mist) {
      size *= 1.0 + flight * 0.6;
      alpha *= 1.0 - flight * 0.45;
    }

    // Intro assembly from scattered cloud
    float p = clamp((uProgress - aSeed.x * 0.6) / 0.4, 0.0, 1.0);
    p = 1.0 - pow(1.0 - p, 3.0);
    vec2 scattered = uViewport * 0.5 + dir.xy * uViewport.y * (0.4 + aSeed.y * 0.6);
    screen = mix(scattered, screen, p);
    alpha *= 0.4 + 0.6 * p;

    // Subtle breathing shimmer
    screen += vec2(sin(uTime * 0.8 + aSeed.y * 6.283), cos(uTime * 0.7 + aSeed.z * 6.283)) * 1.2;

    // Magnetic Hover Lens: dots peel off and orbit the cursor
    float lensMix = clamp(clamp(uLens.z / uLensMax, 0.0, 1.0) * 1.4 - aSeed.x * 0.4, 0.0, 1.0);
    lensMix = lensMix * lensMix * (3.0 - 2.0 * lensMix);
    float angle = aSeed.z * 6.283 + uTime * 0.25 * (aSeed.y - 0.5);
    float radius = uLens.z * (sqrt(aSeed.y) * 0.97 + 0.08 * step(0.93, aSeed.x) * aSeed.z);
    screen = mix(screen, uLens.xy + vec2(cos(angle), sin(angle)) * radius, lensMix);
    size = mix(size, uLensDot, lensMix);
    alpha = mix(alpha, 1.7, lensMix);

    // Cursor Repulsion force
    vec2 diff = screen - uMouse;
    float force = smoothstep(130.0, 0.0, length(diff)) * uHover * (1.0 - lensMix);
    screen += normalize(diff + 0.0001) * force * 35.0;

    // Inacio Nakiti Portrait X-Ray Reveal:
    // When hovering over the portrait, dots scatter to reveal real photo underneath!
    float reveal = step(uFrom.w, 0.5) * (1.0 - t) * smoothstep(uReveal.z, uReveal.z * 0.35, length(screen - uReveal.xy));
    screen += normalize(screen - uReveal.xy + 0.0001) * reveal * 26.0;
    alpha *= 1.0 - reveal * 0.95;

    vAlpha = alpha;

    // Convert screen space pixels to WebGL NDC
    gl_Position = vec4(
      (screen.x / uViewport.x) * 2.0 - 1.0,
      1.0 - (screen.y / uViewport.y) * 2.0,
      0.0,
      1.0
    );

    gl_PointSize = size * (1.0 + force * 0.6);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vLum;
  varying float vSeed;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    // Base color modulated by luminance
    vec3 color = uColor * (0.28 + 0.72 * vLum);

    // Starry accent shimmer on ~1.5% of dots
    color = mix(color, uAccent, step(0.985, vSeed));

    // Smooth circular alpha
    float mask = smoothstep(0.5, 0.25, d);

    gl_FragColor = vec4(color, mask * vAlpha);
  }
`;

// ==========================================================================
// 4. MAIN ENGINE ORCHESTRATION
// ==========================================================================
async function initEngine() {
  const canvas = document.getElementById('webgl-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance'
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // 1. Sample User's Real Portrait (roshan.jpg)
  const portraitData = await samplePortrait('./roshan.jpg');
  const count = portraitData.count;

  // 2. Generate Corresponding 3D Geometries with matching count
  const forms = {
    portrait: portraitData.positions,
    cube: new Float32Array(count * 3),
    torus: new Float32Array(count * 3),
    helix: new Float32Array(count * 3),
    wave: new Float32Array(count * 3),
    name: FormGenerators.rasterizeText('MOHAMMAD ROSHAN', count)
  };

  FormGenerators.cube(count, forms.cube);
  FormGenerators.torus(count, forms.torus);
  FormGenerators.helix(count, forms.helix);
  FormGenerators.wave(count, forms.wave);

  // 3. Setup Random Seed Attributes for Stagger & Noise
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    seeds[i] = Math.random();
  }

  // 4. Setup BufferGeometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aFrom', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aTo', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aLum', new THREE.BufferAttribute(portraitData.lums, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));

  // Initialize aFrom and aTo to portrait initially
  geometry.attributes.aFrom.array.set(forms.portrait);
  geometry.attributes.aTo.array.set(forms.cube);
  geometry.attributes.aFrom.needsUpdate = true;
  geometry.attributes.aTo.needsUpdate = true;

  // 5. Shader Material Setup
  const uniforms = {
    uFrom: { value: new THREE.Vector4(0, 0, 0, 0) },
    uTo: { value: new THREE.Vector4(0, 0, 0, 1) },
    uFromRot: { value: new THREE.Vector2(0, 0) },
    uToRot: { value: new THREE.Vector2(0, 0) },
    uFromAlpha: { value: 1 },
    uToAlpha: { value: 1 },
    uMix: { value: 0 },
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uSpacing: { value: 3.2 },
    uDot: { value: 1.8 },
    uViewport: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMouse: { value: new THREE.Vector2(-999, -999) },
    uHover: { value: 0 },
    uLens: { value: new THREE.Vector3(-999, -999, 0) },
    uLensMax: { value: 65 },
    uLensDot: { value: 3.2 },
    uReveal: { value: new THREE.Vector3(-999, -999, 0) },
    uSwirl: { value: 0.18 },
    uMist: { value: 0 },
    uColor: { value: new THREE.Color('#e0e6ed') },
    uAccent: { value: new THREE.Color('#00f0ff') }
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms
  });

  const pointsMesh = new THREE.Points(geometry, material);
  pointsMesh.frustumCulled = false;
  scene.add(pointsMesh);

  // 6. Section Mapping Configuration
  const sections = [
    { id: '#hero', form: 'portrait', tilt: 0, spin: 0 },
    { id: '#projects', form: 'cube', tilt: 0.55, spin: 0.25 },
    { id: '#skills', form: 'helix', tilt: 0.35, spin: 0.35 },
    { id: '#about', form: 'wave', tilt: 0.95, spin: 0.1 },
    { id: '#contact', form: 'name', tilt: 0, spin: 0 }
  ];

  // 7. Interaction State
  const mouse = { x: -999, y: -999, targetX: -999, targetY: -999, hover: 0 };
  const reveal = { x: -999, y: -999, radius: 0, targetRadius: 0 };
  const lens = { x: -999, y: -999, radius: 0, targetRadius: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.hover = 1;

    // Check if mouse is hovering over hero photo for X-Ray reveal
    const photoFrame = document.querySelector('.portrait-stage');
    if (photoFrame && window.scrollY < window.innerHeight * 0.7) {
      const rect = photoFrame.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        reveal.targetRadius = 155;
        reveal.x = e.clientX;
        reveal.y = e.clientY;
      } else {
        reveal.targetRadius = 0;
      }
    } else {
      reveal.targetRadius = 0;
    }
  });

  // Magnetic Hover Lens on Links / Buttons
  document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
    el.addEventListener('mouseenter', (e) => {
      const rect = el.getBoundingClientRect();
      lens.x = rect.left + rect.width / 2;
      lens.y = rect.top + rect.height / 2;
      lens.targetRadius = Math.max(rect.width, rect.height) * 0.65;
    });
    el.addEventListener('mouseleave', () => {
      lens.targetRadius = 0;
    });
  });

  // Preloader fade-out
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('fade-out');
    document.body.classList.remove('loading');
  }, 500);

  // 8. Render Animation Loop
  let clock = new THREE.Clock();
  let currentFromIdx = 0;
  let currentToIdx = 1;
  let activeMix = 0;

  function render() {
    requestAnimationFrame(render);

    const time = clock.getElapsedTime();
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Damping mouse & reveals
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;
    reveal.radius += (reveal.targetRadius - reveal.radius) * 0.12;
    lens.radius += (lens.targetRadius - lens.radius) * 0.15;

    // Calculate active section morphing based on scroll
    const totalHeight = document.documentElement.scrollHeight - vh;
    const scrollProgress = totalHeight > 0 ? scrollY / totalHeight : 0;
    const sectionIndex = scrollProgress * (sections.length - 1);
    const fromIdx = Math.floor(sectionIndex);
    const toIdx = Math.min(sections.length - 1, fromIdx + 1);
    const mixRatio = sectionIndex - fromIdx;

    if (fromIdx !== currentFromIdx || toIdx !== currentToIdx) {
      currentFromIdx = fromIdx;
      currentToIdx = toIdx;

      geometry.attributes.aFrom.array.set(forms[sections[fromIdx].form]);
      geometry.attributes.aTo.array.set(forms[sections[toIdx].form]);
      geometry.attributes.aFrom.needsUpdate = true;
      geometry.attributes.aTo.needsUpdate = true;
    }

    activeMix = mixRatio;

    // Placement Frame Dimensions
    // Portrait: aligned to .hero-photo-frame in DOM
    const photoFrame = document.querySelector('.hero-photo-frame');
    let px = vw * 0.72;
    let py = vh * 0.5;
    let pSize = Math.min(vh * 0.7, 440);

    if (photoFrame) {
      const rect = photoFrame.getBoundingClientRect();
      px = rect.left + rect.width / 2;
      py = rect.top + rect.height / 2;
      pSize = rect.height;
    }

    // Set Frames: cx, cy, size, kind (0=portrait, 1=form)
    if (sections[fromIdx].form === 'portrait') {
      uniforms.uFrom.value.set(px, py, pSize, 0);
    } else {
      uniforms.uFrom.value.set(vw * 0.68, vh * 0.5, Math.min(vh * 0.65, vw * 0.4), 1);
    }

    if (sections[toIdx].form === 'portrait') {
      uniforms.uTo.value.set(px, py, pSize, 0);
    } else if (sections[toIdx].form === 'name') {
      uniforms.uTo.value.set(vw * 0.5, vh * 0.85, vw * 0.95, 1);
    } else {
      uniforms.uTo.value.set(vw * 0.68, vh * 0.5, Math.min(vh * 0.65, vw * 0.4), 1);
    }

    // Uniform Rotations
    uniforms.uFromRot.value.set(sections[fromIdx].tilt, time * sections[fromIdx].spin);
    uniforms.uToRot.value.set(sections[toIdx].tilt, time * sections[toIdx].spin);

    // Uniform Updates
    uniforms.uMix.value = activeMix;
    uniforms.uTime.value = time;
    uniforms.uProgress.value = Math.min(time * 0.8, 1.0);
    uniforms.uViewport.value.set(vw, vh);
    uniforms.uMouse.value.set(mouse.x, mouse.y);
    uniforms.uHover.value = mouse.hover;
    uniforms.uReveal.value.set(reveal.x, reveal.y, reveal.radius);
    uniforms.uLens.value.set(lens.x, lens.y, lens.radius);
    uniforms.uMist.value = sections[toIdx].form === 'name' ? 1.0 : 0.0;

    renderer.render(scene, camera);
  }

  render();

  // Window Resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    uniforms.uViewport.value.set(window.innerWidth, window.innerHeight);
  });
}

// Start Engines
initEngine();
initPortraitReveal();
