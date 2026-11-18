/**
 * ==========================================================================
 * MOHAMMAD ROSHAN — REFINED EDITORIAL PORTRAIT REVEAL CONTROLLER
 * Strict adherence to Senior Creative Engineering & Design Standards:
 * - Natural photographic presentation (zero facial deformation or overlays)
 * - Subtle monochrome default state
 * - Smooth pointer interpolation (lerp) revealing natural full-color tones
 * - Soft feathered radial mask with zero harsh borders or neon scanners
 * - Natural fallback for mobile devices
 * ==========================================================================
 */

export function initPortraitReveal() {
  const stage = document.getElementById('portrait-stage');
  if (!stage) return;

  const state = {
    x: stage.clientWidth / 2,
    y: stage.clientHeight / 2,
    targetX: stage.clientWidth / 2,
    targetY: stage.clientHeight / 2,
    radius: 0,
    targetRadius: 0,
    opacity: 0,
    targetOpacity: 0,
    isHovered: false
  };

  // Check if device supports fine hover (desktop vs touch)
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice) {
    stage.classList.add('is-touch');
    return;
  }

  function onPointerEnter(e) {
    state.isHovered = true;
    state.targetRadius = 220; // Generous feathered radius
    state.targetOpacity = 1;

    const rect = stage.getBoundingClientRect();
    state.targetX = e.clientX - rect.left;
    state.targetY = e.clientY - rect.top;
    state.x = state.targetX;
    state.y = state.targetY;
  }

  function onPointerMove(e) {
    const rect = stage.getBoundingClientRect();
    state.targetX = e.clientX - rect.left;
    state.targetY = e.clientY - rect.top;
  }

  function onPointerLeave() {
    state.isHovered = false;
    state.targetRadius = 0;
    state.targetOpacity = 0;
  }

  stage.addEventListener('pointerenter', onPointerEnter);
  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave);

  // Smooth Interpolation Loop
  let rafId = null;

  function update() {
    // Eased lerp for fluid organic tracking
    state.x += (state.targetX - state.x) * 0.12;
    state.y += (state.targetY - state.y) * 0.12;
    state.radius += (state.targetRadius - state.radius) * 0.085;
    state.opacity += (state.targetOpacity - state.opacity) * 0.085;

    // Apply CSS variables for feathered radial mask
    stage.style.setProperty('--reveal-x', `${state.x.toFixed(1)}px`);
    stage.style.setProperty('--reveal-y', `${state.y.toFixed(1)}px`);
    stage.style.setProperty('--reveal-r', `${state.radius.toFixed(1)}px`);
    stage.style.setProperty('--reveal-opacity', state.opacity.toFixed(3));

    rafId = requestAnimationFrame(update);
  }

  rafId = requestAnimationFrame(update);

  // Cleanup handler
  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    stage.removeEventListener('pointerenter', onPointerEnter);
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerleave', onPointerLeave);
  };
}
