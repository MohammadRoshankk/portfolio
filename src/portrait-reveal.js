/**
 * ==========================================================================
 * MOHAMMAD ROSHAN — INTERACTIVE CURSOR-CONTROLLED PORTRAIT REVEAL ENGINE
 * Built to exact specification:
 * - Large portrait (40-45% hero width)
 * - Obscured base state with subtle darkened particle & halftone treatment
 * - Soft cyan ambient backlight glow
 * - Cursor-controlled circular spotlight with smooth lerp
 * - Particles smoothly disperse outward around cursor position
 * - Original, fully detailed portrait revealed inside spotlight
 * - Smooth spring restoration when cursor moves away/leaves
 * ==========================================================================
 */

export function initPortraitReveal() {
  const stage = document.getElementById('portrait-stage');
  const canvas = document.getElementById('portrait-canvas');
  if (!stage || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width = stage.clientWidth;
  let height = stage.clientHeight;

  // Handle Retina DPR
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();

  // State
  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    radius: 0,
    targetRadius: 0,
    opacity: 0,
    targetOpacity: 0,
    isInside: false
  };

  let particles = [];
  let ambientMotes = [];

  // 1. Sample Image to Build Particle Matrix
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    buildParticles(img);
  };
  img.src = './roshan.jpg';

  function buildParticles(image) {
    const offscreen = document.createElement('canvas');
    // Sample at comfortable resolution for smooth 60fps
    const sampleW = 240;
    const sampleH = Math.round(sampleW * (height / width));
    offscreen.width = sampleW;
    offscreen.height = sampleH;

    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    offCtx.drawImage(image, 0, 0, sampleW, sampleH);

    const imgData = offCtx.getImageData(0, 0, sampleW, sampleH).data;
    particles = [];

    const step = 3; // Grid density step
    for (let y = 0; y < sampleH; y += step) {
      for (let x = 0; x < sampleW; x += step) {
        const idx = (y * sampleW + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3];

        if (a > 50) {
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0;

          // Map from sample coordinates to canvas display coordinates
          const origX = (x / sampleW) * width;
          const origY = (y / sampleH) * height;

          // Give a few dots a subtle cyan accent
          const isAccent = Math.random() > 0.94;

          particles.push({
            originX: origX,
            originY: origY,
            x: origX + (Math.random() - 0.5) * 4,
            y: origY + (Math.random() - 0.5) * 4,
            vx: 0,
            vy: 0,
            size: Math.max(0.8, lum * 2.6),
            lum: lum,
            isAccent: isAccent,
            color: isAccent ? '#00f0ff' : `rgba(230, 235, 245, ${0.4 + lum * 0.55})`
          });
        }
      }
    }

    // 2. Generate Ambient Floating Cyan Motes
    ambientMotes = [];
    const moteCount = 75;
    for (let i = 0; i < moteCount; i++) {
      ambientMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  // 2. Event Listeners for Cursor Interaction
  stage.addEventListener('mouseenter', (e) => {
    mouse.isInside = true;
    mouse.targetRadius = 155; // Spotlight radius
    mouse.targetOpacity = 1;

    const rect = stage.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    mouse.x = mouse.targetX;
    mouse.y = mouse.targetY;
  });

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
  });

  stage.addEventListener('mouseleave', () => {
    mouse.isInside = false;
    mouse.targetRadius = 0;
    mouse.targetOpacity = 0;
  });

  // Support touch for mobile devices
  stage.addEventListener('touchstart', (e) => {
    mouse.isInside = true;
    mouse.targetRadius = 135;
    mouse.targetOpacity = 1;
    const rect = stage.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.targetX = touch.clientX - rect.left;
    mouse.targetY = touch.clientY - rect.top;
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    const rect = stage.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.targetX = touch.clientX - rect.left;
    mouse.targetY = touch.clientY - rect.top;
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    mouse.isInside = false;
    mouse.targetRadius = 0;
    mouse.targetOpacity = 0;
  });

  // 3. Animation & Physics Simulation Loop
  let frame = 0;

  function render() {
    requestAnimationFrame(render);
    frame++;

    // Smooth lerp for mouse coordinates, radius and opacity
    mouse.x += (mouse.targetX - mouse.x) * 0.12;
    mouse.y += (mouse.targetY - mouse.y) * 0.12;
    mouse.radius += (mouse.targetRadius - mouse.radius) * 0.09;
    mouse.opacity += (mouse.targetOpacity - mouse.opacity) * 0.1;

    // Update CSS custom properties for radial mask and spotlight ring
    stage.style.setProperty('--reveal-x', `${mouse.x.toFixed(1)}px`);
    stage.style.setProperty('--reveal-y', `${mouse.y.toFixed(1)}px`);
    stage.style.setProperty('--reveal-radius', `${mouse.radius.toFixed(1)}px`);
    stage.style.setProperty('--reveal-opacity', mouse.opacity.toFixed(3));

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    const curR = mouse.radius;
    const hasSpotlight = curR > 5;

    // A. Render Portrait Particles with Displacement
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Distance to spotlight center
      if (hasSpotlight) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (dist < curR) {
          // Repulsive force pushes particles outward away from cursor
          const force = Math.pow(1 - dist / curR, 1.3) * 32.0;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Restorative spring force pulling back to origin
      p.vx += (p.originX - p.x) * 0.085;
      p.vy += (p.originY - p.y) * 0.085;

      // Spring damping
      p.vx *= 0.76;
      p.vy *= 0.76;

      p.x += p.vx;
      p.y += p.vy;

      // Determine alpha: transparent inside the spotlight center so photo is crisp!
      let alpha = 0.5 + p.lum * 0.45;

      if (hasSpotlight) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < curR * 0.7) {
          // Clear the window completely for the original photo
          alpha *= Math.max(0, (d / (curR * 0.7)) - 0.2);
        } else if (d < curR * 1.08) {
          // Bunching & glow on the perimeter rim
          alpha = Math.min(1.0, alpha * 1.7);
        }
      }

      if (alpha <= 0.01) continue;

      ctx.fillStyle = p.isAccent ? `rgba(0, 240, 255, ${alpha})` : p.color;
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.5, 0, PI2);
      ctx.fill();
    }

    // B. Render Ambient Floating Dust Motes
    for (let i = 0; i < ambientMotes.length; i++) {
      const m = ambientMotes[i];
      m.x += m.vx;
      m.y += m.vy;

      // Wrap around edges
      if (m.x < 0) m.x = width;
      if (m.x > width) m.x = 0;
      if (m.y < 0) m.y = height;
      if (m.y > height) m.y = 0;

      const pulse = Math.sin(frame * m.pulseSpeed + m.pulseOffset) * 0.3 + 0.7;
      ctx.globalAlpha = m.alpha * pulse;
      ctx.fillStyle = '#00f0ff';

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * 0.5, 0, PI2);
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;
  }

  const PI2 = Math.PI * 2;
  render();

  // Resize handler
  window.addEventListener('resize', () => {
    resizeCanvas();
    if (img.complete) {
      buildParticles(img);
    }
  });
}
