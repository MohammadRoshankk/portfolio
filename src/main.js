/**
 * ==========================================================================
 * MOHAMMAD ROSHAN — 3D PORTFOLIO WEBGL ENGINE
 * Inspired by inacionakiti.com
 * ==========================================================================
 */

import * as THREE from 'three';

// --- CONFIG & STATE ---
const STATE = {
  mode: 'site', // 'site' or 'story'
  storyChapter: 1,
  soundEnabled: false,
  scrollProgress: 0,
  scrollVelocity: 0,
  mouse: {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    normalizedX: 0,
    normalizedY: 0
  }
};

// ==========================================================================
// 1. PRELOADER & INITIALIZATION
// ==========================================================================
const preloader = document.getElementById('preloader');
const loaderCounter = document.getElementById('loader-counter');
const loaderBarFill = document.getElementById('loader-bar-fill');

let loadPercent = 0;
const loadInterval = setInterval(() => {
  loadPercent += Math.floor(Math.random() * 15) + 8;
  if (loadPercent >= 100) {
    loadPercent = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('loading');
      initAudioPrompt();
    }, 400);
  }
  loaderCounter.textContent = `${loadPercent < 10 ? '0' : ''}${loadPercent}%`;
  loaderBarFill.style.width = `${loadPercent}%`;
}, 60);

// ==========================================================================
// 2. THREE.JS SCENE SETUP
// ==========================================================================
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ==========================================================================
// 3. MORPHING 3D PARTICLE SYSTEM (GLSL SHADERS)
// ==========================================================================
const PARTICLE_COUNT = window.innerWidth < 768 ? 12000 : 28000;
const particleGeometry = new THREE.BufferGeometry();

const posInitial = new Float32Array(PARTICLE_COUNT * 3);
const posTorus = new Float32Array(PARTICLE_COUNT * 3);
const posCube = new Float32Array(PARTICLE_COUNT * 3);
const posWave = new Float32Array(PARTICLE_COUNT * 3);
const randoms = new Float32Array(PARTICLE_COUNT);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  // Shape 1: Fibonacci Sphere Nebula
  const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const radius = 2.8 * Math.cbrt(Math.random() * 0.8 + 0.2);
  
  posInitial[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  posInitial[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  posInitial[i * 3 + 2] = radius * Math.cos(phi);

  // Shape 2: Torus Knot / Vortex
  const u = Math.random() * Math.PI * 2;
  const v = Math.random() * Math.PI * 2;
  const R = 2.4;
  const r = 0.8 + Math.random() * 0.3;
  posTorus[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
  posTorus[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
  posTorus[i * 3 + 2] = r * Math.sin(v) + Math.sin(u * 3) * 0.4;

  // Shape 3: Cyber Matrix / Cube Grid
  const side = 4.2;
  posCube[i * 3] = (Math.random() - 0.5) * side;
  posCube[i * 3 + 1] = (Math.random() - 0.5) * side;
  posCube[i * 3 + 2] = (Math.random() - 0.5) * side;

  // Shape 4: Fluid Wave Landscape
  const wx = (Math.random() - 0.5) * 6;
  const wz = (Math.random() - 0.5) * 6;
  const wy = Math.sin(wx * 1.5) * Math.cos(wz * 1.5) * 0.8;
  posWave[i * 3] = wx;
  posWave[i * 3 + 1] = wy;
  posWave[i * 3 + 2] = wz;

  randoms[i] = Math.random();
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posInitial, 3));
particleGeometry.setAttribute('aPosTorus', new THREE.BufferAttribute(posTorus, 3));
particleGeometry.setAttribute('aPosCube', new THREE.BufferAttribute(posCube, 3));
particleGeometry.setAttribute('aPosWave', new THREE.BufferAttribute(posWave, 3));
particleGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// GLSL Vertex Shader
const vertexShader = `
  uniform float uTime;
  uniform float uMorphState; // 0: Sphere, 1: Torus, 2: Cube, 3: Wave
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  uniform float uDPR;

  attribute vec3 aPosTorus;
  attribute vec3 aPosCube;
  attribute vec3 aPosWave;
  attribute float aRandom;

  varying vec3 vPosition;
  varying float vRandom;
  varying float vDist;

  // Simple pseudo 3D curl noise
  vec3 curl(vec3 p) {
    return vec3(
      sin(p.y * 1.2 + uTime * 0.6) * 0.35,
      cos(p.z * 1.2 + uTime * 0.6) * 0.35,
      sin(p.x * 1.2 + uTime * 0.6) * 0.35
    );
  }

  void main() {
    vRandom = aRandom;

    // Morph interpolation across 4 target geometries
    vec3 p0 = position;
    vec3 p1 = aPosTorus;
    vec3 p2 = aPosCube;
    vec3 p3 = aPosWave;

    vec3 blendedPos = p0;
    if (uMorphState < 1.0) {
      blendedPos = mix(p0, p1, uMorphState);
    } else if (uMorphState < 2.0) {
      blendedPos = mix(p1, p2, uMorphState - 1.0);
    } else {
      blendedPos = mix(p2, p3, min(uMorphState - 2.0, 1.0));
    }

    // Add turbulence noise
    vec3 turbulence = curl(blendedPos * 0.8);
    vec3 finalPos = blendedPos + turbulence * (0.2 + aRandom * 0.3);

    // Mouse interactive deflection in XY plane
    float mouseDistance = distance(finalPos.xy, uMouse * 4.5);
    if (mouseDistance < 2.2) {
      vec2 dir = normalize(finalPos.xy - (uMouse * 4.5));
      finalPos.xy += dir * (2.2 - mouseDistance) * 0.6;
    }

    vPosition = finalPos;
    vDist = mouseDistance;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Responsive Point Size Attenuation
    gl_PointSize = (14.0 * aRandom + 6.0) * (1.0 / -mvPosition.z) * uDPR;
  }
`;

// GLSL Fragment Shader
const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uTime;

  varying vec3 vPosition;
  varying float vRandom;
  varying float vDist;

  void main() {
    // Generate soft circular point sprite
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Soft radial glow gradient
    float alpha = smoothstep(0.5, 0.05, dist);

    // Dynamic color gradient based on coordinates and time
    float colorFactor = sin(vPosition.y * 0.5 + uTime * 0.3 + vRandom) * 0.5 + 0.5;
    vec3 color = mix(uColorA, uColorB, colorFactor);

    // Neon highlight when mouse is nearby
    if (vDist < 2.5) {
      color = mix(uColorC, color, vDist / 2.5);
      alpha *= 1.2;
    }

    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;

const particleMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uMorphState: { value: 0 },
    uScrollProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uDPR: { value: Math.min(window.devicePixelRatio, 1.75) },
    uColorA: { value: new THREE.Color('#3b82f6') }, // Royal Electric Blue
    uColorB: { value: new THREE.Color('#8b5cf6') }, // Vivid Purple
    uColorC: { value: new THREE.Color('#00f0ff') }, // Bright Cyan Neon
  }
});

const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particlePoints);

// Central ambient accent light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// ==========================================================================
// 4. CAMERA PATH & SMOOTH SCROLL CHOREOGRAPHY
// ==========================================================================
const cameraCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 7.5),     // Section 1: Hero front view
  new THREE.Vector3(3.2, 1.5, 5.0),  // Section 2: Projects high angle
  new THREE.Vector3(-2.8, -1.2, 4.2),// Section 3: Skills dynamic view
  new THREE.Vector3(0, -2.5, 3.8),   // Section 4: About close intimacy
  new THREE.Vector3(0, 0, 6.0),      // Section 5: Contact finale
]);

// Smooth scroll listener
let targetScrollY = window.scrollY;
let currentScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  targetScrollY = window.scrollY;
});

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;

  // Eased scroll lerp
  currentScrollY += (targetScrollY - currentScrollY) * 0.08;
  const progress = Math.max(0, Math.min(1, currentScrollY / maxScroll));
  
  STATE.scrollProgress = progress;
  particleMaterial.uniforms.uScrollProgress.value = progress;

  // In site mode, morph the particles as user scrolls
  if (STATE.mode === 'site') {
    const morphTarget = progress * 3.0;
    particleMaterial.uniforms.uMorphState.value += (morphTarget - particleMaterial.uniforms.uMorphState.value) * 0.05;

    // Follow camera spline
    const camPos = cameraCurve.getPointAt(progress);
    camera.position.lerp(camPos, 0.08);

    const lookTarget = cameraCurve.getPointAt(Math.min(progress + 0.04, 1.0));
    camera.lookAt(lookTarget);
  }
}

// ==========================================================================
// 5. MOUSE PARALLAX & MAGNETIC CURSOR
// ==========================================================================
const cursorDot = document.getElementById('cursor-dot');
const cursorCircle = document.getElementById('cursor-circle');

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let circleX = cursorX;
let circleY = cursorY;

window.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;

  // Normalized mouse (-1 to 1)
  STATE.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
  STATE.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Magnetic elements hover
document.querySelectorAll('[data-magnetic]').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover');
    playTone(580, 0.05);
  });
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
  });
});

// Tilt Cards
document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y * 0.03}deg) rotateY(${x * 0.03}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
  });
});

// ==========================================================================
// 6. PROCEDURAL WEB AUDIO SYNTHESIZER
// ==========================================================================
let audioCtx = null;
let masterGain = null;
let ambientOscA = null;
let ambientOscB = null;

function initAudioPrompt() {
  const audioBtn = document.getElementById('audio-toggle');
  const audioLabel = document.getElementById('audio-label');

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // Ambient low synth drone A (55 Hz A1)
      ambientOscA = audioCtx.createOscillator();
      ambientOscA.type = 'sine';
      ambientOscA.frequency.setValueAtTime(55, audioCtx.currentTime);

      // Ambient low synth drone B (110 Hz A2 with detune)
      ambientOscB = audioCtx.createOscillator();
      ambientOscB.type = 'triangle';
      ambientOscB.frequency.setValueAtTime(110, audioCtx.currentTime);
      ambientOscB.detune.setValueAtTime(4, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, audioCtx.currentTime);

      ambientOscA.connect(filter);
      ambientOscB.connect(filter);
      filter.connect(masterGain);

      ambientOscA.start();
      ambientOscB.start();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    STATE.soundEnabled = !STATE.soundEnabled;
    if (STATE.soundEnabled) {
      masterGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.3);
      audioBtn.classList.add('playing');
      audioLabel.textContent = 'Sound On';
      playTone(440, 0.1);
    } else {
      masterGain.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 0.3);
      audioBtn.classList.remove('playing');
      audioLabel.textContent = 'Sound Off';
    }
  });
}

function playTone(freq = 440, duration = 0.08) {
  if (!audioCtx || !STATE.soundEnabled) return;
  const osc = audioCtx.createOscillator();
  const toneGain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

  toneGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(toneGain);
  toneGain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// ==========================================================================
// 7. DUAL-MODE LOGIC: SITE (?v=site) VS 3D STORY (?v=story)
// ==========================================================================
const siteView = document.getElementById('site-view');
const storyView = document.getElementById('story-view');
const btnModeSite = document.getElementById('btn-mode-site');
const btnModeStory = document.getElementById('btn-mode-story');
const btnStorySwitch = document.getElementById('btn-story-switch');
const storyChapters = document.querySelectorAll('.story-chapter');
const storyDots = document.querySelectorAll('.story-dot');
const storyPrevBtn = document.getElementById('story-prev');
const storyNextBtn = document.getElementById('story-next');

// Check URL search parameters on load
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('v') === 'story') {
  setMode('story');
} else {
  setMode('site');
}

btnModeSite.addEventListener('click', () => setMode('site'));
btnModeStory.addEventListener('click', () => setMode('story'));
btnStorySwitch.addEventListener('click', () => setMode('site'));

function setMode(mode) {
  STATE.mode = mode;
  playTone(mode === 'site' ? 520 : 660, 0.12);

  if (mode === 'site') {
    btnModeSite.classList.add('active');
    btnModeStory.classList.remove('active');
    siteView.classList.remove('hidden-view');
    storyView.classList.add('hidden-view');
    document.body.style.overflow = 'auto';
    window.history.replaceState(null, '', '?v=site');
  } else {
    btnModeStory.classList.add('active');
    btnModeSite.classList.remove('active');
    siteView.classList.add('hidden-view');
    storyView.classList.remove('hidden-view');
    document.body.style.overflow = 'hidden';
    setStoryChapter(1);
    window.history.replaceState(null, '', '?v=story');
  }
}

function setStoryChapter(num) {
  STATE.storyChapter = num;
  storyChapters.forEach((ch, idx) => {
    ch.classList.toggle('active-chapter', idx === num - 1);
  });
  storyDots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === num - 1);
  });

  // Camera and morph targets for story mode
  const morphValue = num - 1; // 0, 1, 2, 3
  particleMaterial.uniforms.uMorphState.value = morphValue;

  const positions = [
    new THREE.Vector3(0, 0, 7.5),
    new THREE.Vector3(0, 1.8, 5.2),
    new THREE.Vector3(3.5, 0, 4.5),
    new THREE.Vector3(0, 0, 5.5)
  ];
  camera.position.set(positions[num - 1].x, positions[num - 1].y, positions[num - 1].z);
  camera.lookAt(0, 0, 0);

  playTone(330 * (1 + num * 0.2), 0.15);
}

storyDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    setStoryChapter(parseInt(dot.getAttribute('data-index')));
  });
});

storyNextBtn.addEventListener('click', () => {
  let next = STATE.storyChapter + 1;
  if (next > 4) next = 1;
  setStoryChapter(next);
});

storyPrevBtn.addEventListener('click', () => {
  let prev = STATE.storyChapter - 1;
  if (prev < 1) prev = 4;
  setStoryChapter(prev);
});

// Email Copy Button
const btnCopy = document.getElementById('btn-copy');
const copyBtnText = document.getElementById('copy-btn-text');
const emailAddress = document.getElementById('email-address').textContent;

btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(emailAddress).then(() => {
    copyBtnText.textContent = 'Copied! ✓';
    btnCopy.style.background = '#00f0ff';
    playTone(880, 0.1);
    setTimeout(() => {
      copyBtnText.textContent = 'Copy Email';
      btnCopy.style.background = '#ffffff';
    }, 2000);
  });
});

// ==========================================================================
// 8. RENDER ANIMATION LOOP
// ==========================================================================
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Mouse lerping
  STATE.mouse.x += (STATE.mouse.targetX - STATE.mouse.x) * 0.06;
  STATE.mouse.y += (STATE.mouse.targetY - STATE.mouse.y) * 0.06;

  // Custom Cursor damping
  circleX += (cursorX - circleX) * 0.15;
  circleY += (cursorY - circleY) * 0.15;
  cursorDot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
  cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;

  // Update uniforms
  particleMaterial.uniforms.uTime.value = elapsedTime;
  particleMaterial.uniforms.uMouse.value.set(STATE.mouse.x, STATE.mouse.y);

  // Update scroll
  updateScrollProgress();

  // Gentle autonomous particle rotation
  particlePoints.rotation.y = elapsedTime * 0.06 + STATE.mouse.x * 0.3;
  particlePoints.rotation.x = STATE.mouse.y * 0.2;

  renderer.render(scene, camera);
}
animate();

// ==========================================================================
// 9. WINDOW RESIZING
// ==========================================================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  particleMaterial.uniforms.uDPR.value = Math.min(window.devicePixelRatio, 1.75);
});
