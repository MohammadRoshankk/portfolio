/**
 * ==========================================================================
 * MOHAMMAD ROSHAN — REFINED SENIOR ENGINEERING PORTFOLIO ARCHITECTURE
 * - Background WebGL Engine: Restrained ambient 3D depth & scroll morphing
 * - Dedicated Natural Portrait Reveal: Managed via portrait-reveal.js
 * - Procedural Web Audio API Synthesizer
 * - Dual-Mode Support: Site Experience (?v=site) & 3D Journey (?v=story)
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
// 1. PROCEDURAL 3D FORM GENERATORS (RESTYLED FOR ELEGANT BACKGROUND PRESENCE)
// ==========================================================================
const FormGenerators = {
  // Ambient Celestial Constellation Ring (Hero Background)
  celestial(count, target) {
    for (let i = 0; i < count; i++) {
      const u = Math.random() * PI2;
      const r = 0.55 + Math.random() * 0.75;
      target[i * 3] = r * Math.cos(u) + rand(-0.04, 0.04);
      target[i * 3 + 1] = r * Math.sin(u) * 0.5 + rand(-0.04, 0.04);
      target[i * 3 + 2] = rand(-0.35, 0.35);
    }
  },

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

    ctx.font = 'bold 80px "Syne", sans-serif';
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
    const validCount = points.length / 3 || 1;

    for (let i = 0; i < count; i++) {
      const srcIdx = (i % validCount) * 3;
      target[i * 3] = (points[srcIdx] || 0) + rand(-0.005, 0.005);
      target[i * 3 + 1] = (points[srcIdx + 1] || 0) + rand(-0.005, 0.005);
      target[i * 3 + 2] = points[srcIdx + 2] || 0;
    }

    return target;
  }
};

// ==========================================================================
// 2. GLSL SHADER DEFINITIONS FOR RESTRAINED BACKGROUND DEPTH
// ==========================================================================
const vertexShader = `
  uniform vec4 uFrom;       // cx, cy, size px, kind
  uniform vec4 uTo;
  uniform vec2 uFromRot;
  uniform vec2 uToRot;
  uniform float uMix;
  uniform float uTime;
  uniform float uDot;
  uniform vec2 uViewport;
  uniform vec2 uMouse;
  uniform float uSwirl;
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

  vec3 rotate(vec3 p, vec2 r) {
    float cy = cos(r.y), sy = sin(r.y);
    p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
    float cx = cos(r.x), sx = sin(r.x);
    return vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  }

  vec4 place(vec3 local, vec4 frame, vec2 rot) {
    vec3 p = rotate(local, rot);
    p.z = min(p.z, CAMERA - 0.3);
    float persp = CAMERA / (CAMERA - p.z);
    vec2 screen = frame.xy + vec2(p.x, -p.y) * persp * frame.z;
    float shade = clamp(0.5 + p.z * 1.2, 0.2, 1.0);
    return vec4(screen, uDot * (0.6 + aSeed.y * 0.8) * persp, shade);
  }

  void main() {
    vLum = aLum;
    vSeed = aSeed.z;

    vec3 dir = normalize(aSeed * 2.0 - 1.0 + 0.0001);
    float order = aSeed.x * 0.35;
    float raw = clamp((uMix - order) / 0.65, 0.0, 1.0);
    float t = easeInOut(raw);
    float flight = sin(t * 3.14159);

    vec4 a = place(aFrom, uFrom, uFromRot);
    vec4 b = place(aTo, uTo, uToRot);

    vec2 screen = mix(a.xy, b.xy, t);
    screen += dir.xy * flight * uViewport.y * uSwirl;

    float size = mix(a.z, b.z, t);
    float alpha = mix(a.w, b.w, t);

    // Subtle drift
    screen += vec2(sin(uTime * 0.6 + aSeed.y * 6.283), cos(uTime * 0.5 + aSeed.z * 6.283)) * 1.2;

    // Convert to WebGL NDC
    gl_Position = vec4(
      (screen.x / uViewport.x) * 2.0 - 1.0,
      1.0 - (screen.y / uViewport.y) * 2.0,
      0.0,
      1.0
    );

    vAlpha = alpha * 0.45; // Restrained background opacity
    gl_PointSize = size * 1.2;
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

    vec3 color = uColor * (0.35 + 0.65 * vLum);
    // Subtle cyan accent on ~1.5% of stars
    color = mix(color, uAccent, step(0.985, vSeed));

    float mask = smoothstep(0.5, 0.25, d);
    gl_FragColor = vec4(color, mask * vAlpha);
  }
`;

// ==========================================================================
// 3. BACKGROUND 3D ENGINE INITIALIZATION
// ==========================================================================
function initBackgroundEngine() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

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

  const COUNT = window.innerWidth < 768 ? 6000 : 12000;

  // Initialize shapes
  const forms = {
    celestial: new Float32Array(COUNT * 3),
    cube: new Float32Array(COUNT * 3),
    helix: new Float32Array(COUNT * 3),
    wave: new Float32Array(COUNT * 3),
    name: FormGenerators.rasterizeText('MOHAMMAD ROSHAN', COUNT)
  };

  FormGenerators.celestial(COUNT, forms.celestial);
  FormGenerators.cube(COUNT, forms.cube);
  FormGenerators.helix(COUNT, forms.helix);
  FormGenerators.wave(COUNT, forms.wave);

  const seeds = new Float32Array(COUNT * 3);
  const lums = new Float32Array(COUNT);
  for (let i = 0; i < COUNT * 3; i++) {
    seeds[i] = Math.random();
  }
  for (let i = 0; i < COUNT; i++) {
    lums[i] = Math.random() * 0.8 + 0.2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geometry.setAttribute('aFrom', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geometry.setAttribute('aTo', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geometry.setAttribute('aLum', new THREE.BufferAttribute(lums, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));

  geometry.attributes.aFrom.array.set(forms.celestial);
  geometry.attributes.aTo.array.set(forms.cube);
  geometry.attributes.aFrom.needsUpdate = true;
  geometry.attributes.aTo.needsUpdate = true;

  const uniforms = {
    uFrom: { value: new THREE.Vector4(0, 0, 0, 1) },
    uTo: { value: new THREE.Vector4(0, 0, 0, 1) },
    uFromRot: { value: new THREE.Vector2(0, 0) },
    uToRot: { value: new THREE.Vector2(0, 0) },
    uMix: { value: 0 },
    uTime: { value: 0 },
    uDot: { value: 1.8 },
    uViewport: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMouse: { value: new THREE.Vector2(-999, -999) },
    uSwirl: { value: 0.14 },
    uMist: { value: 0 },
    uColor: { value: new THREE.Color('#94a3b8') },
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

  const sections = [
    { id: '#hero', form: 'celestial', tilt: 0.1, spin: 0.05 },
    { id: '#projects', form: 'cube', tilt: 0.55, spin: 0.2 },
    { id: '#skills', form: 'helix', tilt: 0.35, spin: 0.25 },
    { id: '#about', form: 'wave', tilt: 0.95, spin: 0.1 },
    { id: '#contact', form: 'name', tilt: 0, spin: 0 }
  ];

  let clock = new THREE.Clock();
  let currentFromIdx = 0;
  let currentToIdx = 1;

  function render() {
    requestAnimationFrame(render);
    const time = clock.getElapsedTime();
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

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

    // Set Placement Frames in background
    uniforms.uFrom.value.set(vw * 0.5, vh * 0.5, Math.min(vh * 0.7, vw * 0.7), 1);
    uniforms.uTo.value.set(vw * 0.5, vh * 0.5, Math.min(vh * 0.7, vw * 0.7), 1);

    uniforms.uFromRot.value.set(sections[fromIdx].tilt, time * sections[fromIdx].spin);
    uniforms.uToRot.value.set(sections[toIdx].tilt, time * sections[toIdx].spin);

    uniforms.uMix.value = mixRatio;
    uniforms.uTime.value = time;
    uniforms.uViewport.value.set(vw, vh);

    renderer.render(scene, camera);
  }
  render();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    uniforms.uViewport.value.set(window.innerWidth, window.innerHeight);
  });
}

// ==========================================================================
// 4. PROCEDURAL WEB AUDIO SYNTHESIZER
// ==========================================================================
let audioCtx = null;
let masterGain = null;
let soundEnabled = false;

function initAudioSystem() {
  const audioBtn = document.getElementById('audio-toggle');
  const audioLabel = document.getElementById('audio-label');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      const oscA = audioCtx.createOscillator();
      oscA.type = 'sine';
      oscA.frequency.setValueAtTime(55, audioCtx.currentTime);

      const oscB = audioCtx.createOscillator();
      oscB.type = 'triangle';
      oscB.frequency.setValueAtTime(110, audioCtx.currentTime);
      oscB.detune.setValueAtTime(3, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(masterGain);

      oscA.start();
      oscB.start();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      masterGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.3);
      audioBtn.classList.add('playing');
      if (audioLabel) audioLabel.textContent = 'Sound On';
    } else {
      masterGain.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 0.3);
      audioBtn.classList.remove('playing');
      if (audioLabel) audioLabel.textContent = 'Sound Off';
    }
  });
}

// ==========================================================================
// 5. SITE VIEW VS 3D JOURNEY MODE SWITCHER
// ==========================================================================
function initModeSwitcher() {
  const siteView = document.getElementById('site-view');
  const storyView = document.getElementById('story-view');
  const btnSite = document.getElementById('btn-mode-site');
  const btnStory = document.getElementById('btn-mode-story');
  const btnStorySwitch = document.getElementById('btn-story-switch');

  function setMode(mode) {
    if (mode === 'site') {
      btnSite?.classList.add('active');
      btnStory?.classList.remove('active');
      siteView?.classList.remove('hidden-view');
      storyView?.classList.add('hidden-view');
      document.body.style.overflow = 'auto';
      window.history.replaceState(null, '', '?v=site');
    } else {
      btnStory?.classList.add('active');
      btnSite?.classList.remove('active');
      siteView?.classList.add('hidden-view');
      storyView?.classList.remove('hidden-view');
      document.body.style.overflow = 'hidden';
      window.history.replaceState(null, '', '?v=story');
    }
  }

  btnSite?.addEventListener('click', () => setMode('site'));
  btnStory?.addEventListener('click', () => setMode('story'));
  btnStorySwitch?.addEventListener('click', () => setMode('site'));

  const params = new URLSearchParams(window.location.search);
  if (params.get('v') === 'story') {
    setMode('story');
  } else {
    setMode('site');
  }
}

// ==========================================================================
// 6. COPY EMAIL & UI CONTROLS
// ==========================================================================
function initUIControls() {
  const btnCopy = document.getElementById('btn-copy');
  const copyText = document.getElementById('copy-btn-text');
  const emailAddr = document.getElementById('email-address')?.textContent || 'rosancva@gmail.com';

  btnCopy?.addEventListener('click', () => {
    navigator.clipboard.writeText(emailAddr).then(() => {
      if (copyText) copyText.textContent = 'Copied!';
      btnCopy.style.background = '#00f0ff';
      setTimeout(() => {
        if (copyText) copyText.textContent = 'Copy Email';
        btnCopy.style.background = '#ffffff';
      }, 2000);
    });
  });

  // Preloader Counter Animation
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('loader-counter');
  const barFillEl = document.getElementById('loader-bar-fill');

  let loadCount = 0;
  const countInterval = setInterval(() => {
    loadCount += Math.floor(Math.random() * 12) + 8;
    if (loadCount >= 100) {
      loadCount = 100;
      clearInterval(countInterval);
      if (counterEl) counterEl.textContent = '100%';
      if (barFillEl) barFillEl.style.width = '100%';

      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        document.body.classList.remove('loading');
      }, 200);
    } else {
      if (counterEl) counterEl.textContent = `${loadCount < 10 ? '0' : ''}${loadCount}%`;
      if (barFillEl) barFillEl.style.width = `${loadCount}%`;
    }
  }, 28);

  // Custom Magnetic Cursor
  const dot = document.getElementById('cursor-dot');
  const circle = document.getElementById('cursor-circle');
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx, ty = cy;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (dot) dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
  });

  function updateCursor() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    if (circle) circle.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  const portraitStage = document.getElementById('portrait-stage');
  if (portraitStage) {
    portraitStage.addEventListener('mouseenter', () => document.body.classList.add('cursor-reveal-active'));
    portraitStage.addEventListener('mouseleave', () => document.body.classList.remove('cursor-reveal-active'));
  }
}

// ==========================================================================
// BOOTSTRAP APPLICATION
// ==========================================================================
initBackgroundEngine();
initPortraitReveal();
initAudioSystem();
initModeSwitcher();
initUIControls();
