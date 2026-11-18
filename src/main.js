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
// 1. PROCEDURAL 3D FORM GENERATORS (4 HIGH-FIDELITY CHAPTER FORMATIONS)
// ==========================================================================
const FormGenerators = {
  // Chapter 01: Raw Signals & Chaos — Cosmic Spherical Galactic Nebula
  celestial(count, target) {
    for (let i = 0; i < count; i++) {
      const u = Math.random() * PI2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.62) * 0.95 + 0.12;
      const spiral = r * 1.85;
      const theta = u + spiral;

      target[i * 3] = r * Math.sin(v) * Math.cos(theta) + rand(-0.025, 0.025);
      target[i * 3 + 1] = r * Math.sin(v) * Math.sin(theta) * 0.65 + rand(-0.025, 0.025);
      target[i * 3 + 2] = r * Math.cos(v) * 0.75 + rand(-0.025, 0.025);
    }
  },

  // Chapter 02: Neural Synapses — 3D Cybernetic Synaptic Torus & Interconnected Lattice
  torus(count, target) {
    for (let i = 0; i < count; i++) {
      const u = Math.random() * PI2;
      const v = Math.random() * PI2;
      const isCoreNode = i % 8 === 0;
      const R = isCoreNode ? 0.38 : 0.64;
      const r = isCoreNode ? 0.11 : 0.22;
      const twist = Math.sin(u * 5.0) * 0.045;

      target[i * 3] = (R + (r + twist) * Math.cos(v)) * Math.cos(u);
      target[i * 3 + 1] = (r + twist) * Math.sin(v);
      target[i * 3 + 2] = (R + (r + twist) * Math.cos(v)) * Math.sin(u);
    }
  },

  // Chapter 03: Distributed Matrix — 3D Architectural Coordinate Hyper-Cube
  cube(count, target) {
    for (let i = 0; i < count; i++) {
      if (i % 6 < 4) {
        // Precision layered outer grid faces
        const gridRes = 14;
        const u = (Math.floor(Math.random() * gridRes) / (gridRes - 1) - 0.5) * 0.82;
        const v = (Math.floor(Math.random() * gridRes) / (gridRes - 1) - 0.5) * 0.82;
        const face = (i % 2 === 0 ? 0.41 : -0.41);
        const axis = Math.floor(Math.random() * 3);

        target[i * 3] = axis === 0 ? face : axis === 1 ? u : v;
        target[i * 3 + 1] = axis === 0 ? u : axis === 1 ? face : v;
        target[i * 3 + 2] = axis === 2 ? face : axis === 1 ? u : v;
      } else {
        // Internal Cartesian distribution lines (streaming pipelines)
        const axis = i % 3;
        const t = (Math.random() - 0.5) * 0.82;
        const crossU = rand(-0.08, 0.08);
        const crossV = rand(-0.08, 0.08);

        target[i * 3] = axis === 0 ? t : crossU;
        target[i * 3 + 1] = axis === 1 ? t : crossV;
        target[i * 3 + 2] = axis === 2 ? t : crossU;
      }
    }
  },

  // Chapter 04: Convergence — Double Helix & Mathematical Horizon Wave
  convergence(count, target) {
    for (let i = 0; i < count; i++) {
      if (i % 4 < 2) {
        // Intertwining double helix: AI & Data systems synthesis
        const a = Math.random();
        const strand = i % 2 === 0 ? 0 : Math.PI;
        const angle = a * PI2 * 3.0 + strand;
        const radius = 0.32 + Math.sin(a * PI2) * 0.07;

        target[i * 3] = Math.cos(angle) * radius + rand(-0.012, 0.012);
        target[i * 3 + 1] = (a - 0.5) * 0.95;
        target[i * 3 + 2] = Math.sin(angle) * radius + rand(-0.012, 0.012);
      } else {
        // Undulating mathematical horizon wave
        const side = Math.ceil(Math.sqrt(count / 2));
        const u = ((i % side) / side - 0.5) * 1.35;
        const v = (Math.floor(i / side) / side - 0.5) * 1.35;
        const wave = Math.sin(u * 6.0) * 0.10 + Math.cos(v * 5.0) * 0.08;

        target[i * 3] = u;
        target[i * 3 + 1] = wave - 0.28;
        target[i * 3 + 2] = v;
      }
    }
  }
};

// ==========================================================================
// 2. GLSL SHADER DEFINITIONS FOR SCROLL-DRIVEN POINT-CLOUD MORPHING
// ==========================================================================
const vertexShader = `
  uniform float uScrollProgress; // 0.0 to 3.0 continuous float
  uniform float uTime;
  uniform float uDot;
  uniform vec2 uViewport;
  uniform vec2 uMouse;
  uniform float uMouseForce;
  uniform float uSwirl;
  uniform float uAlpha;
  uniform vec4 uFrame; // cx, cy, size px, aspect
  uniform vec2 uRotation;

  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute vec3 aPos4;
  attribute float aLum;
  attribute vec3 aSeed;

  varying float vLum;
  varying float vSeed;
  varying float vAlpha;

  const float CAMERA = 2.4;

  float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  vec3 rotate3D(vec3 p, vec2 r) {
    float cy = cos(r.y), sy = sin(r.y);
    p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
    float cx = cos(r.x), sx = sin(r.x);
    return vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  }

  void main() {
    vLum = aLum;
    vSeed = aSeed.z;

    float p = clamp(uScrollProgress, 0.0, 3.0);
    vec3 pFrom = aPos1;
    vec3 pTo = aPos2;
    float tRaw = 0.0;

    if (p <= 1.0) {
      pFrom = aPos1;
      pTo = aPos2;
      tRaw = p;
    } else if (p <= 2.0) {
      pFrom = aPos2;
      pTo = aPos3;
      tRaw = p - 1.0;
    } else {
      pFrom = aPos3;
      pTo = aPos4;
      tRaw = p - 2.0;
    }

    // Staggered organic departure based on individual particle seed
    float order = aSeed.x * 0.28;
    float raw = clamp((tRaw - order) / 0.72, 0.0, 1.0);
    float t = easeInOutCubic(raw);
    float flight = sin(t * 3.14159265);

    // Continuous 3D world-space position interpolation
    vec3 pos = mix(pFrom, pTo, t);

    // Vapour-mist flight vortex during transitions
    vec3 flightDir = normalize(aSeed * 2.0 - 1.0 + 0.0001);
    pos += flightDir * flight * uSwirl;

    // Subtle natural organic ambient breathing
    pos += vec3(
      sin(uTime * 0.55 + aSeed.y * 6.283) * 0.016,
      cos(uTime * 0.50 + aSeed.z * 6.283) * 0.016,
      sin(uTime * 0.45 + aSeed.x * 6.283) * 0.016
    );

    // Perspective spatial rotation
    vec3 pRot = rotate3D(pos, uRotation);
    pRot.z = min(pRot.z, CAMERA - 0.25);

    // Perspective projection
    float persp = CAMERA / (CAMERA - pRot.z);
    vec2 screen = uFrame.xy + vec2(pRot.x, -pRot.y) * persp * uFrame.z;

    // Subtle magnetic cursor deflection
    vec2 mouseDiff = screen - uMouse;
    float mouseDist = length(mouseDiff);
    if (mouseDist < 200.0 && mouseDist > 0.1) {
      float repel = (1.0 - mouseDist / 200.0);
      screen += normalize(mouseDiff) * (repel * repel * 24.0 * uMouseForce);
    }

    // Depth shading & point size
    float depthShade = clamp(0.55 + pRot.z * 1.1, 0.25, 1.0);
    float ptSize = uDot * (0.65 + aSeed.y * 0.7) * persp;

    gl_Position = vec4(
      (screen.x / uViewport.x) * 2.0 - 1.0,
      1.0 - (screen.y / uViewport.y) * 2.0,
      0.0,
      1.0
    );

    vAlpha = depthShade * uAlpha;
    gl_PointSize = ptSize * 1.25;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform vec3 uAccent2;
  varying float vLum;
  varying float vSeed;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    vec3 color = uColor * (0.40 + 0.60 * vLum);
    color = mix(color, uAccent, step(0.970, vSeed));
    color = mix(color, uAccent2, step(0.992, vSeed));

    float mask = smoothstep(0.5, 0.20, d);
    gl_FragColor = vec4(color, mask * vAlpha);
  }
`;

// ==========================================================================
// 3. CONTINUOUS SCROLL-DRIVEN 3D PARTICLE ENGINE
// ==========================================================================
function initBackgroundEngine() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return null;

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

  // Initialize the 4 formations
  const forms = {
    celestial: new Float32Array(COUNT * 3),
    torus: new Float32Array(COUNT * 3),
    cube: new Float32Array(COUNT * 3),
    convergence: new Float32Array(COUNT * 3)
  };

  FormGenerators.celestial(COUNT, forms.celestial);
  FormGenerators.torus(COUNT, forms.torus);
  FormGenerators.cube(COUNT, forms.cube);
  FormGenerators.convergence(COUNT, forms.convergence);

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
  geometry.setAttribute('aPos1', new THREE.BufferAttribute(forms.celestial, 3));
  geometry.setAttribute('aPos2', new THREE.BufferAttribute(forms.torus, 3));
  geometry.setAttribute('aPos3', new THREE.BufferAttribute(forms.cube, 3));
  geometry.setAttribute('aPos4', new THREE.BufferAttribute(forms.convergence, 3));
  geometry.setAttribute('aLum', new THREE.BufferAttribute(lums, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));

  const uniforms = {
    uScrollProgress: { value: 0.0 },
    uTime: { value: 0.0 },
    uDot: { value: 2.2 },
    uViewport: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMouse: { value: new THREE.Vector2(-999, -999) },
    uMouseForce: { value: 0.8 },
    uSwirl: { value: 0.22 },
    uAlpha: { value: 0.90 },
    uFrame: { value: new THREE.Vector4(window.innerWidth * 0.5, window.innerHeight * 0.44, Math.min(window.innerHeight * 0.65, window.innerWidth * 0.58), 1.0) },
    uRotation: { value: new THREE.Vector2(0.2, 0.0) },
    uColor: { value: new THREE.Color('#94a3b8') },
    uAccent: { value: new THREE.Color('#00f0ff') },
    uAccent2: { value: new THREE.Color('#38bdf8') }
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

  let currentMode = 'site';
  let targetScrollProgress = 0.0;
  let currentScrollProgress = 0.0;
  let activeChapterIndex = 0;

  const mouse = {
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    normX: 0,
    normY: 0,
    curNormX: 0,
    curNormY: 0
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.normX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.normY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  let clock = new THREE.Clock();

  function render() {
    requestAnimationFrame(render);
    const time = clock.getElapsedTime();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;
    mouse.curNormX += (mouse.normX - mouse.curNormX) * 0.07;
    mouse.curNormY += (mouse.normY - mouse.curNormY) * 0.07;

    uniforms.uMouse.value.set(mouse.x, mouse.y);
    uniforms.uTime.value = time;
    uniforms.uViewport.value.set(vw, vh);

    if (currentMode === 'story') {
      // --- 3D JOURNEY MODE (Scroll-Driven Point Cloud Morphing) ---
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.085;
      uniforms.uScrollProgress.value = currentScrollProgress;

      const cx = vw * 0.5;
      const cy = vh * 0.44;
      const size = Math.min(vh * 0.66, vw * 0.58);
      uniforms.uFrame.value.set(cx, cy, size, 1.0);

      const rotX = 0.22 + mouse.curNormY * 0.35;
      const rotY = time * 0.12 + mouse.curNormX * 0.45;
      uniforms.uRotation.value.set(rotX, rotY);

      uniforms.uAlpha.value = 0.92;
      uniforms.uDot.value = 2.4;
      uniforms.uMouseForce.value = 1.0;
      uniforms.uSwirl.value = 0.24;

      // Synchronize Chapter text and dot indicators
      const newActiveIdx = Math.round(currentScrollProgress);
      if (newActiveIdx !== activeChapterIndex) {
        activeChapterIndex = newActiveIdx;
        playStoryTone(280 + activeChapterIndex * 110);
      }

      const chapters = document.querySelectorAll('.story-chapter');
      chapters.forEach((ch, idx) => {
        ch.classList.toggle('active-chapter', idx === activeChapterIndex);
      });

      const dots = document.querySelectorAll('.story-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeChapterIndex);
      });
    } else {
      // --- SITE EXPERIENCE MODE ---
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - vh;
      const scrollRatio = totalHeight > 0 ? scrollY / totalHeight : 0;
      const siteProgress = scrollRatio * 3.0;

      currentScrollProgress += (siteProgress - currentScrollProgress) * 0.1;
      uniforms.uScrollProgress.value = currentScrollProgress;

      uniforms.uFrame.value.set(vw * 0.5, vh * 0.5, Math.min(vh * 0.7, vw * 0.7), 1.0);

      const rotX = 0.18 + mouse.curNormY * 0.15;
      const rotY = time * 0.08 + mouse.curNormX * 0.2;
      uniforms.uRotation.value.set(rotX, rotY);

      uniforms.uAlpha.value = 0.42;
      uniforms.uDot.value = 1.7;
      uniforms.uMouseForce.value = 0.25;
      uniforms.uSwirl.value = 0.16;
    }

    renderer.render(scene, camera);
  }
  render();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    uniforms.uViewport.value.set(window.innerWidth, window.innerHeight);
  });

  return {
    setMode(mode) {
      currentMode = mode;
      if (mode === 'story') {
        targetScrollProgress = 0.0;
        currentScrollProgress = 0.0;
      }
    },
    addScroll(delta) {
      targetScrollProgress = Math.max(0.0, Math.min(3.0, targetScrollProgress + delta));
    },
    scrollToChapter(idx) {
      targetScrollProgress = Math.max(0.0, Math.min(3.0, idx));
    },
    nextChapter() {
      if (currentScrollProgress >= 2.9) {
        targetScrollProgress = 0.0;
      } else {
        targetScrollProgress = Math.min(3.0, Math.floor(currentScrollProgress + 1.05));
      }
    },
    prevChapter() {
      if (currentScrollProgress <= 0.1) {
        targetScrollProgress = 3.0;
      } else {
        targetScrollProgress = Math.max(0.0, Math.ceil(currentScrollProgress - 1.05));
      }
    },
    getProgress() {
      return currentScrollProgress;
    }
  };
}

// ==========================================================================
// 4. ATMOSPHERIC SOUNDTRACK & PROCEDURAL AUDIO SYSTEM
// ==========================================================================
let audioTrack = null;
let soundEnabled = false;
let storyToneCtx = null;

function playStoryTone(freq = 440) {
  try {
    if (!storyToneCtx) {
      storyToneCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (storyToneCtx.state === 'suspended') {
      storyToneCtx.resume();
    }
    const osc = storyToneCtx.createOscillator();
    const gain = storyToneCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, storyToneCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, storyToneCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.035, storyToneCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, storyToneCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(storyToneCtx.destination);
    osc.start();
    osc.stop(storyToneCtx.currentTime + 0.12);
  } catch (e) {
    // Audio context may await user gesture
  }
}

function initAudioSystem() {
  const audioBtn = document.getElementById('audio-toggle');
  const audioLabel = document.getElementById('audio-label');
  if (!audioBtn) return;

  function ensureAudio() {
    if (!audioTrack) {
      audioTrack = new Audio('./assets/audio/epic-soundtrack.mp3');
      audioTrack.loop = true;
      audioTrack.volume = 0;
    }
  }

  function fadeAudio(targetVol, duration, onComplete) {
    if (!audioTrack) return;
    const startVol = audioTrack.volume;
    const delta = targetVol - startVol;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audioTrack.volume = Math.max(0, Math.min(1, startVol + delta * progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (onComplete) {
        onComplete();
      }
    }
    requestAnimationFrame(step);
  }

  audioBtn.addEventListener('click', () => {
    ensureAudio();
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      audioBtn.classList.add('playing');
      if (audioLabel) audioLabel.textContent = 'Sound On';
      audioTrack.play().then(() => {
        fadeAudio(0.5, 800);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    } else {
      audioBtn.classList.remove('playing');
      if (audioLabel) audioLabel.textContent = 'Sound Off';
      fadeAudio(0, 600, () => {
        audioTrack.pause();
      });
    }
  });
}

// ==========================================================================
// 5. SITE VIEW VS 3D JOURNEY MODE SWITCHER & STORY CONTROLS
// ==========================================================================
function initModeSwitcher(engine) {
  const siteView = document.getElementById('site-view');
  const storyView = document.getElementById('story-view');
  const btnSite = document.getElementById('btn-mode-site');
  const btnStory = document.getElementById('btn-mode-story');
  const btnStorySwitch = document.getElementById('btn-story-switch');
  const btnStoryContact = document.getElementById('btn-story-contact');

  const storyPrev = document.getElementById('story-prev');
  const storyNext = document.getElementById('story-next');
  const storyDots = document.querySelectorAll('.story-dot');

  let activeMode = 'site';

  function setMode(mode) {
    activeMode = mode;
    if (mode === 'site') {
      btnSite?.classList.add('active');
      btnStory?.classList.remove('active');
      siteView?.classList.remove('hidden-view');
      storyView?.classList.add('hidden-view');
      document.body.classList.remove('mode-story');
      document.body.style.overflow = 'auto';
      window.history.replaceState(null, '', '?v=site');
      engine?.setMode('site');
    } else {
      btnStory?.classList.add('active');
      btnSite?.classList.remove('active');
      siteView?.classList.add('hidden-view');
      storyView?.classList.remove('hidden-view');
      document.body.classList.add('mode-story');
      document.body.style.overflow = 'hidden';
      window.history.replaceState(null, '', '?v=story');
      engine?.setMode('story');
    }
  }

  btnSite?.addEventListener('click', () => setMode('site'));
  btnStory?.addEventListener('click', () => setMode('story'));
  btnStorySwitch?.addEventListener('click', () => setMode('site'));
  btnStoryContact?.addEventListener('click', (e) => {
    e.preventDefault();
    setMode('site');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });

  // Continuous Trackpad / Mouse Wheel Scroll Morphing in 3D Journey
  window.addEventListener('wheel', (e) => {
    if (activeMode !== 'story') return;
    const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120);
    engine?.addScroll(delta * 0.0016);
  }, { passive: true });

  // Continuous Touch Drag Morphing
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (activeMode !== 'story') return;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (activeMode !== 'story') return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;
    touchStartY = currentY;
    engine?.addScroll(deltaY * 0.0035);
  }, { passive: true });

  // Story Next / Prev Controls
  storyPrev?.addEventListener('click', () => engine?.prevChapter());
  storyNext?.addEventListener('click', () => engine?.nextChapter());

  // Direct Chapter Dot Jumps
  storyDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10) - 1;
      if (!isNaN(idx)) engine?.scrollToChapter(idx);
    });
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (activeMode !== 'story') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      engine?.nextChapter();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      engine?.prevChapter();
    }
  });

  // URL Initial State Detection
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
const engine = initBackgroundEngine();
initPortraitReveal();
initAudioSystem();
initModeSwitcher(engine);
initUIControls();
