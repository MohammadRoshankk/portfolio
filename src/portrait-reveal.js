/**
 * ==========================================================================
 * MOHAMMAD ROSHAN — INTERACTIVE EDITORIAL PORTRAIT & PARTICLE SYSTEM
 * Implements the interactive portrait experience:
 * - Large prominent hero portrait (40-45% composition)
 * - Subtle darkened / monochrome base state
 * - Canvas particle field with gentle ambient drift (Codrops / Phantom.land aesthetic)
 * - Fluid cursor tracking via lerp
 * - Dynamic particle repulsion / dispersion around cursor
 * - Feathered radial mask revealing the pristine 100% authentic color photograph
 * - Smooth spring return when cursor departs
 * - Natural full-color mobile fallback
 * ==========================================================================
 */

export function initPortraitReveal() {
  const stage = document.getElementById('portrait-stage');
  const canvas = document.getElementById('portrait-particle-canvas');
  if (!stage || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Track state
  const state = {
    width: stage.clientWidth,
    height: stage.clientHeight,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    mouseX: stage.clientWidth / 2,
    mouseY: stage.clientHeight / 2,
    lerpX: stage.clientWidth / 2,
    lerpY: stage.clientHeight / 2,
    radius: 0,
    targetRadius: 0,
    opacity: 0,
    targetOpacity: 0,
    isHovered: false,
    particles: []
  };

  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice) {
    stage.classList.add('is-touch');
    return;
  }

  // Color palette for high-tech digital particle veil
  const particleColors = [
    'rgba(0, 240, 255, ',    // Cyan
    'rgba(165, 243, 252, ',  // Ice cyan
    'rgba(224, 242, 254, ',  // Soft white-blue
    'rgba(255, 255, 255, '   // Pure white
  ];

  // Initialize Particle Grid
  function createParticles() {
    state.particles = [];
    const spacing = 14; // Elegant density: ~900-1100 fine dots
    const cols = Math.floor(state.width / spacing);
    const rows = Math.floor(state.height / spacing);
    const offsetX = (state.width - cols * spacing) / 2;
    const offsetY = (state.height - rows * spacing) / 2;

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        // Add subtle natural jitter so it feels organic rather than stiff
        const jitterX = (Math.random() - 0.5) * 3;
        const jitterY = (Math.random() - 0.5) * 3;
        const originX = offsetX + c * spacing + jitterX;
        const originY = offsetY + r * spacing + jitterY;

        // Subtle gradient density: slightly higher opacity in center
        const dxCenter = (originX - state.width / 2) / (state.width / 2);
        const dyCenter = (originY - state.height / 2) / (state.height / 2);
        const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        const baseAlpha = Math.max(0.2, 0.65 - distCenter * 0.25) * (0.4 + Math.random() * 0.6);

        state.particles.push({
          originX,
          originY,
          x: originX,
          y: originY,
          vx: 0,
          vy: 0,
          size: 1.1 + Math.random() * 0.9,
          colorPrefix: particleColors[Math.floor(Math.random() * particleColors.length)],
          baseAlpha,
          alpha: baseAlpha,
          ambientPhase: Math.random() * Math.PI * 2,
          ambientSpeed: 0.0015 + Math.random() * 0.002
        });
      }
    }
  }

  function resizeCanvas() {
    state.width = stage.clientWidth;
    state.height = stage.clientHeight;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = state.width * state.dpr;
    canvas.height = state.height * state.dpr;
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.scale(state.dpr, state.dpr);
    createParticles();
  }

  resizeCanvas();

  // Pointer Event Listeners
  function onPointerEnter(e) {
    state.isHovered = true;
    state.targetRadius = 220;
    state.targetOpacity = 1;

    const rect = stage.getBoundingClientRect();
    state.mouseX = e.clientX - rect.left;
    state.mouseY = e.clientY - rect.top;
    state.lerpX = state.mouseX;
    state.lerpY = state.mouseY;

    stage.classList.add('is-hovering');
  }

  function onPointerMove(e) {
    const rect = stage.getBoundingClientRect();
    state.mouseX = e.clientX - rect.left;
    state.mouseY = e.clientY - rect.top;
  }

  function onPointerLeave() {
    state.isHovered = false;
    state.targetRadius = 0;
    state.targetOpacity = 0;
    stage.classList.remove('is-hovering');
  }

  stage.addEventListener('pointerenter', onPointerEnter);
  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave);

  // Resize Observer
  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(stage);

  // Animation Loop
  let rafId = null;
  let time = 0;

  function render() {
    time += 1;

    // Smooth Lerp for Cursor Tracking & Spotlight Radius
    state.lerpX += (state.mouseX - state.lerpX) * 0.12;
    state.lerpY += (state.mouseY - state.lerpY) * 0.12;
    state.radius += (state.targetRadius - state.radius) * 0.085;
    state.opacity += (state.targetOpacity - state.opacity) * 0.085;

    // Apply Radial Mask Variables to Reveal Layer
    stage.style.setProperty('--reveal-x', `${state.lerpX.toFixed(1)}px`);
    stage.style.setProperty('--reveal-y', `${state.lerpY.toFixed(1)}px`);
    stage.style.setProperty('--reveal-r', `${state.radius.toFixed(1)}px`);
    stage.style.setProperty('--reveal-opacity', state.opacity.toFixed(3));

    // Clear Canvas
    ctx.clearRect(0, 0, state.width, state.height);

    const repelRadius = 175; // Cursor repulsion radius
    const spring = 0.07;     // Return speed
    const friction = 0.82;   // Damping

    // Update and Draw Particles
    for (let i = 0; i < state.particles.length; i++) {
      const p = state.particles[i];

      // Subtle Ambient Drift (Breathing motion)
      const ambientX = Math.sin(time * p.ambientSpeed + p.ambientPhase) * 1.8;
      const ambientY = Math.cos(time * p.ambientSpeed + p.ambientPhase) * 1.8;
      const homeX = p.originX + ambientX;
      const homeY = p.originY + ambientY;

      // Distance from cursor
      const dx = p.x - state.lerpX;
      const dy = p.y - state.lerpY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repulsion force when hovered
      if (state.isHovered && dist < repelRadius && dist > 0.001) {
        const force = (1 - dist / repelRadius);
        const pushMag = force * force * 35; // Exponential dispersal
        const nx = dx / dist;
        const ny = dy / dist;

        p.vx += nx * pushMag;
        p.vy += ny * pushMag;

        // Fade out particles inside the spotlight core so the face is pristine
        const fadeRatio = Math.min(1, Math.max(0, (dist - 40) / (repelRadius - 40)));
        p.alpha += (p.baseAlpha * fadeRatio - p.alpha) * 0.18;
      } else {
        // Return to normal resting alpha
        p.alpha += (p.baseAlpha - p.alpha) * 0.06;
      }

      // Spring physics back to home
      const ax = (homeX - p.x) * spring;
      const ay = (homeY - p.y) * spring;
      p.vx = (p.vx + ax) * friction;
      p.vy = (p.vy + ay) * friction;

      p.x += p.vx;
      p.y += p.vy;

      // Render Particle
      if (p.alpha > 0.02) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${p.alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    rafId = requestAnimationFrame(render);
  }

  rafId = requestAnimationFrame(render);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    resizeObserver.disconnect();
    stage.removeEventListener('pointerenter', onPointerEnter);
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerleave', onPointerLeave);
  };
}
