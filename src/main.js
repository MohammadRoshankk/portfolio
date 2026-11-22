/**
 * ==========================================================================
 * MOHAMMAD ROSHAN — SENIOR ENGINEERING PORTFOLIO ARCHITECTURE
 * - Background WebGL Engine: GPU-accelerated 4-stage facial evolution
 * - Dedicated Natural Portrait Reveal: Managed via portrait-reveal.js
 * - Dual-Mode Support: Site Experience (?v=site) & 3D Journey (?v=story)
 * ==========================================================================
 */

import * as THREE from 'three';
import { initPortraitReveal } from './portrait-reveal.js';
import {
  EVOLUTION_COUNT,
  STAGE01_POSITIONS,
  STAGE02_POSITIONS,
  STAGE03_POSITIONS,
  STAGE04_POSITIONS,
  STAGE01_COLORS,
  STAGE02_COLORS,
  STAGE03_COLORS,
  STAGE04_COLORS,
  STAGE_LUMS,
  STAGE_FEATURES
} from './evolution-stages-data.js';

// ==========================================================================
// 1. PROCEDURAL 3D FORM POPULATOR (4 CONTINUOUS FACIAL EVOLUTION STAGES)
// ==========================================================================
const FormGenerators = {
  populateEvolutionStages(count, forms, colors, lums, features) {
    for (let i = 0; i < count; i++) {
      const srcIdx = count === 12000 ? i : (i * 2) % 12000;

      // Positions
      forms.stage01[i * 3]     = STAGE01_POSITIONS[srcIdx * 3];
      forms.stage01[i * 3 + 1] = STAGE01_POSITIONS[srcIdx * 3 + 1];
      forms.stage01[i * 3 + 2] = STAGE01_POSITIONS[srcIdx * 3 + 2];

      forms.stage02[i * 3]     = STAGE02_POSITIONS[srcIdx * 3];
      forms.stage02[i * 3 + 1] = STAGE02_POSITIONS[srcIdx * 3 + 1];
      forms.stage02[i * 3 + 2] = STAGE02_POSITIONS[srcIdx * 3 + 2];

      forms.stage03[i * 3]     = STAGE03_POSITIONS[srcIdx * 3];
      forms.stage03[i * 3 + 1] = STAGE03_POSITIONS[srcIdx * 3 + 1];
      forms.stage03[i * 3 + 2] = STAGE03_POSITIONS[srcIdx * 3 + 2];

      forms.stage04[i * 3]     = STAGE04_POSITIONS[srcIdx * 3];
      forms.stage04[i * 3 + 1] = STAGE04_POSITIONS[srcIdx * 3 + 1];
      forms.stage04[i * 3 + 2] = STAGE04_POSITIONS[srcIdx * 3 + 2];

      // Colors
      colors.stage01[i * 3]     = STAGE01_COLORS[srcIdx * 3];
      colors.stage01[i * 3 + 1] = STAGE01_COLORS[srcIdx * 3 + 1];
      colors.stage01[i * 3 + 2] = STAGE01_COLORS[srcIdx * 3 + 2];

      colors.stage02[i * 3]     = STAGE02_COLORS[srcIdx * 3];
      colors.stage02[i * 3 + 1] = STAGE02_COLORS[srcIdx * 3 + 1];
      colors.stage02[i * 3 + 2] = STAGE02_COLORS[srcIdx * 3 + 2];

      colors.stage03[i * 3]     = STAGE03_COLORS[srcIdx * 3];
      colors.stage03[i * 3 + 1] = STAGE03_COLORS[srcIdx * 3 + 1];
      colors.stage03[i * 3 + 2] = STAGE03_COLORS[srcIdx * 3 + 2];

      colors.stage04[i * 3]     = STAGE04_COLORS[srcIdx * 3];
      colors.stage04[i * 3 + 1] = STAGE04_COLORS[srcIdx * 3 + 1];
      colors.stage04[i * 3 + 2] = STAGE04_COLORS[srcIdx * 3 + 2];

      // Luminance & Feature weights
      lums[i] = STAGE_LUMS[srcIdx];
      features[i] = STAGE_FEATURES[srcIdx];
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
  attribute vec3 aCol1;
  attribute vec3 aCol2;
  attribute vec3 aCol3;
  attribute vec3 aCol4;
  attribute float aFeature;
  attribute float aLum;
  attribute vec3 aSeed;

  varying float vLum;
  varying float vSeed;
  varying float vAlpha;
  varying vec3 vColor;
  varying float vFeature;
  varying float vDepth;

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
    vFeature = aFeature;

    float p = clamp(uScrollProgress, 0.0, 3.0);
    vec3 pFrom = aPos1;
    vec3 pTo = aPos2;
    vec3 cFrom = aCol1;
    vec3 cTo = aCol2;
    float tRaw = 0.0;

    if (p <= 1.0) {
      pFrom = aPos1;
      pTo = aPos2;
      cFrom = aCol1;
      cTo = aCol2;
      tRaw = p;
    } else if (p <= 2.0) {
      pFrom = aPos2;
      pTo = aPos3;
      cFrom = aCol2;
      cTo = aCol3;
      tRaw = p - 1.0;
    } else {
      pFrom = aPos3;
      pTo = aPos4;
      cFrom = aCol3;
      cTo = aCol4;
      tRaw = p - 2.0;
    }

    // Staggered organic departure based on individual particle seed
    float order = aSeed.x * 0.25;
    float raw = clamp((tRaw - order) / 0.75, 0.0, 1.0);
    float t = easeInOutCubic(raw);
    float flight = sin(t * 3.14159265);

    // Continuous 3D world-space position interpolation
    vec3 pos = mix(pFrom, pTo, t);

    // Continuous 3D stage color interpolation
    vColor = mix(cFrom, cTo, t);

    // Subtle flight vortex during transitions
    vec3 flightDir = normalize(aSeed * 2.0 - 1.0 + 0.0001);
    pos += flightDir * flight * uSwirl;

    // Subtle natural organic ambient breathing
    pos += vec3(
      sin(uTime * 0.55 + aSeed.y * 6.283) * 0.008,
      cos(uTime * 0.50 + aSeed.z * 6.283) * 0.008,
      sin(uTime * 0.45 + aSeed.x * 6.283) * 0.008
    );

    // Perspective spatial rotation
    vec3 pRot = rotate3D(pos, uRotation);
    pRot.z = min(pRot.z, CAMERA - 0.25);
    vDepth = pRot.z;

    // Perspective projection
    float persp = CAMERA / (CAMERA - pRot.z);
    vec2 screen = uFrame.xy + vec2(pRot.x, -pRot.y) * persp * uFrame.z;

    // Subtle magnetic cursor deflection
    vec2 mouseDiff = screen - uMouse;
    float mouseDist = length(mouseDiff);
    if (mouseDist < 180.0 && mouseDist > 0.1) {
      float repel = (1.0 - mouseDist / 180.0);
      screen += normalize(mouseDiff) * (repel * repel * 20.0 * uMouseForce);
    }

    // Depth shading & point size
    float depthShade = clamp(0.60 + pRot.z * 0.85, 0.30, 1.0);
    float featureSize = mix(1.1, 0.88, aFeature);
    float ptSize = uDot * (0.65 + aSeed.y * 0.6) * persp * featureSize;

    gl_Position = vec4(
      (screen.x / uViewport.x) * 2.0 - 1.0,
      1.0 - (screen.y / uViewport.y) * 2.0,
      0.0,
      1.0
    );

    gl_PointSize = clamp(ptSize, 1.0, 24.0);

    // Alpha blending with depth fade
    vAlpha = uAlpha * depthShade * mix(0.70, 1.0, aLum);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform vec3 uAccent2;
  uniform int uColorMode; // 0: Natural Portrait, 1: Cyan Cyber, 2: 3D Depth

  varying float vLum;
  varying float vSeed;
  varying float vAlpha;
  varying vec3 vColor;
  varying float vFeature;
  varying float vDepth;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float d = length(coord);
    if (d > 0.5) discard;

    // Palette 0: Natural Color
    vec3 naturalColor = vColor;

    // Palette 1: Cyan Cyber Accent
    vec3 cyberColor = mix(
      vec3(0.08, 0.12, 0.18),
      uAccent,
      pow(vLum, 1.35)
    );
    if (vFeature > 0.5) {
      cyberColor = mix(cyberColor, uAccent2, 0.45);
    }

    // Palette 2: 3D Depth Spectrum
    float normDepth = clamp((vDepth + 0.35) / 0.85, 0.0, 1.0);
    vec3 depthColor = mix(
      vec3(0.02, 0.08, 0.22),
      mix(vec3(0.0, 0.94, 1.0), vec3(1.0, 0.85, 0.5), normDepth),
      normDepth
    );

    vec3 finalColor;
    if (uColorMode == 1) {
      finalColor = cyberColor;
    } else if (uColorMode == 2) {
      finalColor = depthColor;
    } else {
      finalColor = naturalColor;
    }

    float mask = smoothstep(0.5, 0.18, d);
    gl_FragColor = vec4(finalColor, mask * vAlpha);
  }
`;

// ==========================================================================
// 3. CONTINUOUS SCROLL-DRIVEN 3D PARTICLE ENGINE
// ==========================================================================
function initBackgroundEngine() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, depth: false });
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const COUNT = window.innerWidth < 768 ? 6000 : 12000;

  // Initialize the 4 continuous facial evolution formations
  const forms = {
    stage01: new Float32Array(COUNT * 3),
    stage02: new Float32Array(COUNT * 3),
    stage03: new Float32Array(COUNT * 3),
    stage04: new Float32Array(COUNT * 3)
  };

  const colors = {
    stage01: new Float32Array(COUNT * 3),
    stage02: new Float32Array(COUNT * 3),
    stage03: new Float32Array(COUNT * 3),
    stage04: new Float32Array(COUNT * 3)
  };

  const features = new Float32Array(COUNT);
  const lums = new Float32Array(COUNT);
  const seeds = new Float32Array(COUNT * 3);

  FormGenerators.populateEvolutionStages(COUNT, forms, colors, lums, features);

  for (let i = 0; i < COUNT * 3; i++) {
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geometry.setAttribute('aPos1', new THREE.BufferAttribute(forms.stage01, 3));
  geometry.setAttribute('aPos2', new THREE.BufferAttribute(forms.stage02, 3));
  geometry.setAttribute('aPos3', new THREE.BufferAttribute(forms.stage03, 3));
  geometry.setAttribute('aPos4', new THREE.BufferAttribute(forms.stage04, 3));
  geometry.setAttribute('aCol1', new THREE.BufferAttribute(colors.stage01, 3));
  geometry.setAttribute('aCol2', new THREE.BufferAttribute(colors.stage02, 3));
  geometry.setAttribute('aCol3', new THREE.BufferAttribute(colors.stage03, 3));
  geometry.setAttribute('aCol4', new THREE.BufferAttribute(colors.stage04, 3));
  geometry.setAttribute('aFeature', new THREE.BufferAttribute(features, 1));
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
    uAccent2: { value: new THREE.Color('#38bdf8') },
    uColorMode: { value: 0 } // 0: Natural Portrait, 1: Cyan Cyber, 2: 3D Depth
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

  // Facial View Controls State
  let anglePreset = 'free'; // 'front', 'left', 'right', 'free'
  let targetPresetRot = { x: 0.06, y: 0.0 };

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
    mouse.curNormX += (mouse.normX - mouse.curNormX) * 0.06;
    mouse.curNormY += (mouse.normY - mouse.curNormY) * 0.06;

    uniforms.uTime.value = time;
    uniforms.uMouse.value.set(mouse.x, mouse.y);

    if (currentMode === 'story') {
      // --- 3D STORY JOURNEY MODE ---
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.085;
      uniforms.uScrollProgress.value = currentScrollProgress;

      let targetRotX = 0.0;
      let targetRotY = 0.0;

      if (anglePreset === 'front') {
        targetRotX = 0.04;
        targetRotY = 0.0;
      } else if (anglePreset === 'left') {
        targetRotX = 0.04;
        targetRotY = 0.436; // +25 deg
      } else if (anglePreset === 'right') {
        targetRotX = 0.04;
        targetRotY = -0.436; // -25 deg
      } else {
        // Free Orbit: Smooth spatial rotation steered by cursor position
        targetRotX = 0.06 - mouse.curNormY * 0.22;
        targetRotY = mouse.curNormX * 0.38;
      }

      targetPresetRot.x += (targetRotX - targetPresetRot.x) * 0.08;
      targetPresetRot.y += (targetRotY - targetPresetRot.y) * 0.08;

      uniforms.uRotation.value.set(targetPresetRot.x, targetPresetRot.y);

      // Centered framing for 3D face stage
      const portraitSize = Math.min(vh * 0.72, vw * 0.62);
      const portraitCx = vw * 0.5;
      const portraitCy = vh * 0.42;

      uniforms.uFrame.value.set(portraitCx, portraitCy, portraitSize, 1.0);
      uniforms.uAlpha.value = 0.95;
      uniforms.uMouseForce.value = 0.65;
      uniforms.uSwirl.value = 0.18;

      // Update story chapters and indicator dots
      const chapterIdx = Math.max(0, Math.min(3, Math.round(currentScrollProgress)));
      if (chapterIdx !== activeChapterIndex) {
        activeChapterIndex = chapterIdx;
      }

      const chapters = document.querySelectorAll('.story-chapter');
      const dots = document.querySelectorAll('.story-dot');

      chapters.forEach((chap, idx) => {
        chap.classList.toggle('active-chapter', idx === activeChapterIndex);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeChapterIndex);
      });
    } else {
      // --- SITE EXPERIENCE MODE ---
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - vh;
      const scrollRatio = totalHeight > 0 ? scrollY / totalHeight : 0;

      currentScrollProgress += (scrollRatio * 3.0 - currentScrollProgress) * 0.08;
      uniforms.uScrollProgress.value = currentScrollProgress;

      // Ambient background rotation steered by scroll and mouse
      const rotX = 0.12 - mouse.curNormY * 0.12;
      const rotY = mouse.curNormX * 0.18 + currentScrollProgress * 0.15;
      uniforms.uRotation.value.set(rotX, rotY);

      // Scale and position behind the editorial content
      const bgSize = Math.min(vh * 0.68, vw * 0.55);
      const bgCx = vw * 0.5;
      const bgCy = vh * 0.48;

      uniforms.uFrame.value.set(bgCx, bgCy, bgSize, 1.0);
      uniforms.uAlpha.value = Math.max(0.20, 0.45 - scrollRatio * 0.25);
      uniforms.uMouseForce.value = 0.35;
      uniforms.uSwirl.value = 0.10;
    }

    renderer.render(scene, camera);
  }

  render();

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    uniforms.uViewport.value.set(w, h);
  }

  window.addEventListener('resize', onResize);

  return {
    setMode(mode, targetProg = null) {
      currentMode = mode;
      if (mode === 'story') {
        if (targetProg !== null) {
          targetScrollProgress = targetProg;
          currentScrollProgress = targetProg;
        } else {
          targetScrollProgress = 0.0;
          currentScrollProgress = 0.0;
          activeChapterIndex = 0;
        }
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
    cycleAngle() {
      const angles = ['front', 'left', 'right', 'free'];
      const nextIdx = (angles.indexOf(anglePreset) + 1) % angles.length;
      this.setAnglePreset(angles[nextIdx]);
    },
    cycleShading() {
      const nextMode = (uniforms.uColorMode.value + 1) % 3;
      this.setColorMode(nextMode);
    },
    setAnglePreset(preset) {
      anglePreset = preset;
    },
    setColorMode(mode) {
      uniforms.uColorMode.value = mode;
    }
  };
}

// ==========================================================================
// 4. DUAL-MODE CONTROLLER & STORY INTERACTION (SITE vs 3D JOURNEY)
// ==========================================================================
function initModeSwitcher(engine) {
  const btnSite = document.getElementById('btn-mode-site');
  const btnStory = document.getElementById('btn-mode-story');
  const siteView = document.getElementById('site-view');
  const storyView = document.getElementById('story-view');

  const btnStorySwitch = document.getElementById('btn-story-switch');
  const btnStoryContact = document.getElementById('btn-story-contact');

  const storyPrev = document.getElementById('story-prev');
  const storyNext = document.getElementById('story-next');
  const storyDots = document.querySelectorAll('.story-dot');

  let activeMode = 'site';

  function setMode(mode, initialChapter = null) {
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
      engine?.setMode('story', initialChapter);
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

  // Trackpad / Mouse Wheel Scroll Morphing in 3D Journey
  window.addEventListener('wheel', (e) => {
    if (activeMode !== 'story') return;
    const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120);
    engine?.addScroll(delta * 0.0016);
  }, { passive: true });

  // Touch Drag Morphing
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

  // Keyboard Shortcuts in 3D Journey Mode
  window.addEventListener('keydown', (e) => {
    if (activeMode !== 'story') return;

    // Stage Direct Jumps [1-4]
    if (['1', '2', '3', '4'].includes(e.key)) {
      const stageIdx = parseInt(e.key, 10) - 1;
      engine?.scrollToChapter(stageIdx);
      return;
    }

    // Camera Angle Preset Cycle [A / a]
    if (e.key === 'a' || e.key === 'A') {
      engine?.cycleAngle();
      return;
    }

    // Shading Palette Cycle [S / s]
    if (e.key === 's' || e.key === 'S') {
      engine?.cycleShading();
      return;
    }

    // Arrow Navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      engine?.nextChapter();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      engine?.prevChapter();
    }
  });

  // URL Initial State Detection
  const params = new URLSearchParams(window.location.search);
  if (params.get('stage') === '4' || params.get('v') === 'poc') {
    setMode('story', 3.0);
  } else if (params.get('v') === 'story') {
    setMode('story');
  } else {
    setMode('site');
  }
}

// ==========================================================================
// 5. COPY EMAIL & CURSOR CONTROLS
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
initModeSwitcher(engine);
initUIControls();
