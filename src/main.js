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
// 1. PROCEDURAL 3D FORM GENERATORS (CLASSY MR MONOGRAM & 3D TYPOGRAPHY)
// ==========================================================================
const FormGenerators = {
  // Classy 3D "MR" Monogram with luxury geometric diamond/circle badge
  monogramMR(count) {
    const offscreen = document.createElement('canvas');
    offscreen.width = 800;
    offscreen.height = 800;
    const ctx = offscreen.getContext('2d', { willReadFrequently: true });

    const cx = offscreen.width / 2;
    const cy = offscreen.height / 2;

    // Draw luxury outer geometric circular badge
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 280, 0, PI2);
    ctx.stroke();

    // Subtle inner luxury diamond accent
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 305);
    ctx.lineTo(cx + 305, cy);
    ctx.lineTo(cx, cy + 305);
    ctx.lineTo(cx - 305, cy);
    ctx.closePath();
    ctx.stroke();

    // Bold luxury "MR" monogram typography
    ctx.font = 'bold 220px "Syne", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MR', cx, cy - 10);

    // Subtle subtext "MOHAMMAD ROSHAN"
    ctx.font = '600 24px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
    ctx.letterSpacing = '6px';
    ctx.fillText('MOHAMMAD ROSHAN', cx, cy + 130);

    const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    const points = [];

    const step = 4;
    for (let y = 0; y < offscreen.height; y += step) {
      for (let x = 0; x < offscreen.width; x += step) {
        const alpha = imgData[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 80) {
          // Layered 3D depth for sculptural physical weight
          points.push(
            (x - cx) / 450,
            (cy - y) / 450,
            rand(-0.12, 0.12)
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
      target[i * 3 + 2] = (points[srcIdx + 2] || 0) + rand(-0.008, 0.008);
    }

    return target;
  },

  // 3D Stacked Volumetric Typography: "MOHAMMAD ROSHAN"
  fullName(count) {
    const offscreen = document.createElement('canvas');
    offscreen.width = 1200;
    offscreen.height = 600;
    const ctx = offscreen.getContext('2d', { willReadFrequently: true });

    const cx = offscreen.width / 2;
    const cy = offscreen.height / 2;

    // Stacked high-impact editorial typography
    ctx.font = 'bold 125px "Syne", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MOHAMMAD', cx, cy - 80);
    ctx.fillText('ROSHAN', cx, cy + 65);

    // Accent line
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 240, cy + 155);
    ctx.lineTo(cx + 240, cy + 155);
    ctx.stroke();

    ctx.font = '500 22px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
    ctx.fillText('AI & DATA ARCHITECT', cx, cy + 195);

    const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    const points = [];

    const step = 4;
    for (let y = 0; y < offscreen.height; y += step) {
      for (let x = 0; x < offscreen.width; x += step) {
        const alpha = imgData[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 85) {
          points.push(
            (x - cx) / 500,
            (cy - y) / 500,
            rand(-0.09, 0.09)
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
      target[i * 3 + 2] = (points[srcIdx + 2] || 0) + rand(-0.006, 0.006);
    }

    return target;
  },

  // 3D "AI & DATA" Systems Matrix
  aiData(count) {
    const offscreen = document.createElement('canvas');
    offscreen.width = 1100;
    offscreen.height = 500;
    const ctx = offscreen.getContext('2d', { willReadFrequently: true });

    const cx = offscreen.width / 2;
    const cy = offscreen.height / 2;

    ctx.font = 'bold 120px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI & DATA', cx, cy - 40);

    ctx.font = 'bold 44px "Space Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('SYSTEMS ARCHITECT', cx, cy + 60);

    const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    const textPoints = [];

    const step = 4;
    for (let y = 0; y < offscreen.height; y += step) {
      for (let x = 0; x < offscreen.width; x += step) {
        const alpha = imgData[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 90) {
          textPoints.push(
            (x - cx) / 460,
            (cy - y) / 460,
            rand(-0.08, 0.08)
          );
        }
      }
    }

    const target = new Float32Array(count * 3);
    const validCount = textPoints.length / 3 || 1;
    const torusPortion = Math.floor(count * 0.35);

    for (let i = 0; i < count; i++) {
      if (i < count - torusPortion) {
        const srcIdx = (i % validCount) * 3;
        target[i * 3] = (textPoints[srcIdx] || 0) + rand(-0.005, 0.005);
        target[i * 3 + 1] = (textPoints[srcIdx + 1] || 0) + rand(-0.005, 0.005);
        target[i * 3 + 2] = (textPoints[srcIdx + 2] || 0) + rand(-0.006, 0.006);
      } else {
        // Surrounding orbital neural ring
        const u = Math.random() * PI2;
        const v = Math.random() * PI2;
        const R = 0.85 + 0.08 * Math.cos(v);
        target[i * 3] = R * Math.cos(u);
        target[i * 3 + 1] = 0.08 * Math.sin(v) + rand(-0.02, 0.02);
        target[i * 3 + 2] = R * Math.sin(u) * 0.4 + rand(-0.08, 0.08);
      }
    }

    return target;
  },

  // 3D "CREATIVE ENGINEER" Convergence with Starfield
  creative(count) {
    const offscreen = document.createElement('canvas');
    offscreen.width = 1100;
    offscreen.height = 500;
    const ctx = offscreen.getContext('2d', { willReadFrequently: true });

    const cx = offscreen.width / 2;
    const cy = offscreen.height / 2;

    ctx.font = 'bold 110px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CREATIVE', cx, cy - 45);

    ctx.font = 'bold 95px "Syne", sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('ENGINEER', cx, cy + 65);

    const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    const textPoints = [];

    const step = 4;
    for (let y = 0; y < offscreen.height; y += step) {
      for (let x = 0; x < offscreen.width; x += step) {
        const alpha = imgData[(y * offscreen.width + x) * 4 + 3];
        if (alpha > 90) {
          textPoints.push(
            (x - cx) / 460,
            (cy - y) / 460,
            rand(-0.08, 0.08)
          );
        }
      }
    }

    const target = new Float32Array(count * 3);
    const validCount = textPoints.length / 3 || 1;
    const galaxyPortion = Math.floor(count * 0.4);

    for (let i = 0; i < count; i++) {
      if (i < count - galaxyPortion) {
        const srcIdx = (i % validCount) * 3;
        target[i * 3] = (textPoints[srcIdx] || 0) + rand(-0.005, 0.005);
        target[i * 3 + 1] = (textPoints[srcIdx + 1] || 0) + rand(-0.005, 0.005);
        target[i * 3 + 2] = (textPoints[srcIdx + 2] || 0) + rand(-0.006, 0.006);
      } else {
        // Celestial spiral halo
        const angle = Math.random() * PI2 * 3;
        const rad = 0.5 + Math.random() * 0.75;
        target[i * 3] = rad * Math.cos(angle) + rand(-0.03, 0.03);
        target[i * 3 + 1] = rad * Math.sin(angle) * 0.45 + rand(-0.03, 0.03);
        target[i * 3 + 2] = rand(-0.25, 0.25);
      }
    }

    return target;
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

  // Ambient Celestial Constellation Ring
  celestial(count, target) {
    for (let i = 0; i < count; i++) {
      const u = Math.random() * PI2;
      const r = 0.55 + Math.random() * 0.75;
      target[i * 3] = r * Math.cos(u) + rand(-0.04, 0.04);
      target[i * 3 + 1] = r * Math.sin(u) * 0.5 + rand(-0.04, 0.04);
      target[i * 3 + 2] = rand(-0.35, 0.35);
    }
  }
};

// ==========================================================================
// 2. GLSL SHADER DEFINITIONS FOR DUAL-MODE 3D ENGINE
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
  uniform float uMouseForce;
  uniform float uSwirl;
  uniform float uAlpha;

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
    float shade = clamp(0.5 + p.z * 1.2, 0.25, 1.0);
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

    // Subtle natural organic drift
    screen += vec2(sin(uTime * 0.6 + aSeed.y * 6.283), cos(uTime * 0.5 + aSeed.z * 6.283)) * 1.4;

    // Interactive Mouse Repulsion & Swirl
    vec2 mouseOffset = screen - uMouse;
    float mouseDist = length(mouseOffset);
    if (mouseDist < 220.0 && mouseDist > 0.1) {
      float repel = (1.0 - mouseDist / 220.0);
      screen += normalize(mouseOffset) * repel * repel * 38.0 * uMouseForce;
    }

    // Convert to WebGL NDC
    gl_Position = vec4(
      (screen.x / uViewport.x) * 2.0 - 1.0,
      1.0 - (screen.y / uViewport.y) * 2.0,
      0.0,
      1.0
    );

    vAlpha = alpha * uAlpha;
    gl_PointSize = size * 1.25;
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
    // Cyan accent on ~2.5% of stars
    color = mix(color, uAccent, step(0.975, vSeed));

    float mask = smoothstep(0.5, 0.22, d);
    gl_FragColor = vec4(color, mask * vAlpha);
  }
`;

// ==========================================================================
// 3. BACKGROUND & 3D JOURNEY WEBGL ENGINE
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

  // Initialize distinct 3D forms
  const forms = {
    mr: FormGenerators.monogramMR(COUNT),
    name: FormGenerators.fullName(COUNT),
    aiData: FormGenerators.aiData(COUNT),
    creative: FormGenerators.creative(COUNT),
    cube: new Float32Array(COUNT * 3),
    helix: new Float32Array(COUNT * 3),
    celestial: new Float32Array(COUNT * 3)
  };

  FormGenerators.cube(COUNT, forms.cube);
  FormGenerators.helix(COUNT, forms.helix);
  FormGenerators.celestial(COUNT, forms.celestial);

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

  geometry.attributes.aFrom.array.set(forms.mr);
  geometry.attributes.aTo.array.set(forms.name);
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
    uMouseForce: { value: 0.2 },
    uSwirl: { value: 0.14 },
    uAlpha: { value: 0.45 },
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

  // Site Mode Scroll Sections
  const sections = [
    { id: '#hero', form: 'mr', tilt: 0.1, spin: 0.05 },
    { id: '#projects', form: 'cube', tilt: 0.55, spin: 0.2 },
    { id: '#skills', form: 'helix', tilt: 0.35, spin: 0.25 },
    { id: '#about', form: 'aiData', tilt: 0.2, spin: 0.1 },
    { id: '#contact', form: 'name', tilt: 0, spin: 0 }
  ];

  // 3D Journey Chapters: 1: Classy MR, 2: Full Name, 3: AI & Data, 4: Creative Engineer
  const chapterForms = ['mr', 'name', 'aiData', 'creative'];

  let currentMode = 'site';
  let storyChapter = 1;
  let isTransitioning = false;
  let transitionProgress = 0;
  const transitionDuration = 1100;
  let transitionStartTime = 0;
  let fromFormName = 'mr';
  let toFormName = 'mr';

  let currentFromIdx = 0;
  let currentToIdx = 1;

  // Mouse State for smooth steering and parallax
  const mouse = {
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    normX: 0,
    normY: 0
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.normX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.normY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  let clock = new THREE.Clock();

  function triggerChapterTransition(targetChapter) {
    if (targetChapter < 1 || targetChapter > 4) return;
    const fromName = chapterForms[storyChapter - 1];
    const toName = chapterForms[targetChapter - 1];

    fromFormName = fromName;
    toFormName = toName;
    storyChapter = targetChapter;

    geometry.attributes.aFrom.array.set(forms[fromName]);
    geometry.attributes.aTo.array.set(forms[toName]);
    geometry.attributes.aFrom.needsUpdate = true;
    geometry.attributes.aTo.needsUpdate = true;

    isTransitioning = true;
    transitionStartTime = performance.now();
    transitionProgress = 0;

    // Synchronize DOM UI elements
    document.querySelectorAll('.story-chapter').forEach((ch) => {
      ch.classList.toggle('active-chapter', ch.getAttribute('data-chapter') === String(targetChapter));
    });
    document.querySelectorAll('.story-dot').forEach((dot) => {
      dot.classList.toggle('active', dot.getAttribute('data-index') === String(targetChapter));
    });

    playStoryTone(280 + targetChapter * 110);
  }

  function render() {
    requestAnimationFrame(render);
    const time = clock.getElapsedTime();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;
    uniforms.uMouse.value.set(mouse.x, mouse.y);
    uniforms.uTime.value = time;
    uniforms.uViewport.value.set(vw, vh);

    if (currentMode === 'story') {
      // --- 3D JOURNEY MODE ---
      if (isTransitioning) {
        const elapsed = performance.now() - transitionStartTime;
        transitionProgress = Math.min(elapsed / transitionDuration, 1.0);
        uniforms.uMix.value = transitionProgress;
        uniforms.uSwirl.value = 0.28;

        if (transitionProgress >= 1.0) {
          isTransitioning = false;
          geometry.attributes.aFrom.array.set(forms[toFormName]);
          geometry.attributes.aFrom.needsUpdate = true;
          uniforms.uMix.value = 0.0;
          uniforms.uSwirl.value = 0.12;
        }
      } else {
        uniforms.uMix.value = 0.0;
        uniforms.uSwirl.value = 0.12;
      }

      const centerX = vw * 0.5;
      const centerY = vh * 0.44;
      const scale = toFormName === 'name' ? Math.min(vh * 0.55, vw * 0.85) : Math.min(vh * 0.65, vw * 0.55);

      uniforms.uFrom.value.set(centerX, centerY, scale, 1);
      uniforms.uTo.value.set(centerX, centerY, scale, 1);

      // Interactive 3D tilt & rotation steered by mouse
      const rotTiltX = 0.2 + mouse.normY * 0.35;
      const rotTiltY = time * 0.15 + mouse.normX * 0.45;

      uniforms.uFromRot.value.set(rotTiltX, rotTiltY);
      uniforms.uToRot.value.set(rotTiltX, rotTiltY);

      uniforms.uAlpha.value = 0.95;
      uniforms.uDot.value = 2.4;
      uniforms.uMouseForce.value = 1.0;
    } else {
      // --- SITE EXPERIENCE MODE ---
      const scrollY = window.scrollY;
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

      uniforms.uFrom.value.set(vw * 0.5, vh * 0.5, Math.min(vh * 0.7, vw * 0.7), 1);
      uniforms.uTo.value.set(vw * 0.5, vh * 0.5, Math.min(vh * 0.7, vw * 0.7), 1);

      uniforms.uFromRot.value.set(sections[fromIdx].tilt, time * sections[fromIdx].spin);
      uniforms.uToRot.value.set(sections[toIdx].tilt, time * sections[toIdx].spin);

      uniforms.uMix.value = mixRatio;
      uniforms.uAlpha.value = 0.42;
      uniforms.uDot.value = 1.8;
      uniforms.uMouseForce.value = 0.2;
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
        triggerChapterTransition(1);
      }
    },
    goToChapter(ch) {
      triggerChapterTransition(ch);
    },
    nextChapter() {
      let next = storyChapter + 1;
      if (next > 4) next = 1;
      triggerChapterTransition(next);
    },
    prevChapter() {
      let prev = storyChapter - 1;
      if (prev < 1) prev = 4;
      triggerChapterTransition(prev);
    },
    getChapter() {
      return storyChapter;
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
  let autoPlayEnabled = true;
  let autoPlayTimer = null;
  const AUTOPLAY_INTERVAL_MS = 6800;

  function resetAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    if (!autoPlayEnabled || activeMode !== 'story') return;

    autoPlayTimer = setInterval(() => {
      if (activeMode === 'story') {
        engine?.nextChapter();
      }
    }, AUTOPLAY_INTERVAL_MS);
  }

  const autoplayBtn = document.getElementById('story-autoplay-btn');
  const autoplayLabel = document.getElementById('autoplay-label');

  autoplayBtn?.addEventListener('click', () => {
    autoPlayEnabled = !autoPlayEnabled;
    autoplayBtn.classList.toggle('is-active', autoPlayEnabled);
    if (autoplayLabel) {
      autoplayLabel.textContent = autoPlayEnabled ? 'Auto Flow: ON' : 'Auto Flow: PAUSED';
    }
    if (autoPlayEnabled) {
      resetAutoPlay();
    } else if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
    }
  });

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
      if (autoPlayTimer) clearInterval(autoPlayTimer);
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
      resetAutoPlay();
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

  // Story Next / Prev Controls
  storyPrev?.addEventListener('click', () => {
    engine?.prevChapter();
    resetAutoPlay();
  });
  storyNext?.addEventListener('click', () => {
    engine?.nextChapter();
    resetAutoPlay();
  });

  storyDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        engine?.goToChapter(idx);
        resetAutoPlay();
      }
    });
  });

  // Keyboard navigation for 3D Journey
  window.addEventListener('keydown', (e) => {
    if (activeMode !== 'story') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      engine?.nextChapter();
      resetAutoPlay();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      engine?.prevChapter();
      resetAutoPlay();
    }
  });

  // Mouse Wheel navigation (debounced)
  let lastWheelTime = 0;
  window.addEventListener('wheel', (e) => {
    if (activeMode !== 'story') return;
    if (Date.now() - lastWheelTime < 650) return;
    if (e.deltaY > 25) {
      lastWheelTime = Date.now();
      engine?.nextChapter();
      resetAutoPlay();
    } else if (e.deltaY < -25) {
      lastWheelTime = Date.now();
      engine?.prevChapter();
      resetAutoPlay();
    }
  }, { passive: true });

  // Touch Swipe navigation
  let touchY = 0;
  window.addEventListener('touchstart', (e) => {
    if (activeMode !== 'story') return;
    touchY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (activeMode !== 'story') return;
    const dy = e.changedTouches[0].clientY - touchY;
    if (dy < -45) {
      engine?.nextChapter();
      resetAutoPlay();
    } else if (dy > 45) {
      engine?.prevChapter();
      resetAutoPlay();
    }
  }, { passive: true });

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
