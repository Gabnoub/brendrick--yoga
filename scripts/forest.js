/* ============================================================
   BRENDRICK YOGA – Forest Background + Ambient Particles
   Einbinden: <script src="forest-bg.js"></script>
   ============================================================ */

(function () {
  'use strict';

  // ----- CANVAS SETUP -----
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', function () {
    resizeCanvas();
    drawForest();
  });

  // ----- FOREST RENDERER -----
  function drawForest() {
    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0,   '#050E07');
    sky.addColorStop(0.4, '#0D1A0F');
    sky.addColorStop(0.7, '#132016');
    sky.addColorStop(1,   '#1A2E1D');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Stars (deterministic positions via sin-hash)
    for (let i = 0; i < 80; i++) {
      const x = (Math.sin(i * 137.5) * 0.5 + 0.5) * W;
      const y = (Math.sin(i * 97.3)  * 0.5 + 0.5) * H * 0.5;
      const r = (Math.sin(i * 53.1)  * 0.5 + 0.5) * 1.2 + 0.3;
      const a =  Math.sin(i * 71.9)  * 0.1 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,220,190,' + a + ')';
      ctx.fill();
    }

    // Moon glow
    const moonX = W * 0.78;
    const moonY = H * 0.12;
    const moonR = 36;

    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 6);
    moonGlow.addColorStop(0,   'rgba(200,220,180,0.12)');
    moonGlow.addColorStop(0.3, 'rgba(180,200,160,0.06)');
    moonGlow.addColorStop(1,   'transparent');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, W, H);

    // Moon disc
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    const moonDisc = ctx.createRadialGradient(moonX - 6, moonY - 6, 4, moonX, moonY, moonR);
    moonDisc.addColorStop(0,   'rgba(240,248,230,0.85)');
    moonDisc.addColorStop(0.6, 'rgba(200,220,180,0.7)');
    moonDisc.addColorStop(1,   'rgba(160,185,140,0.4)');
    ctx.fillStyle = moonDisc;
    ctx.fill();

    // Mist layer
    const mist = ctx.createLinearGradient(0, H * 0.55, 0, H * 0.78);
    mist.addColorStop(0,   'transparent');
    mist.addColorStop(0.5, 'rgba(30,60,32,0.18)');
    mist.addColorStop(1,   'rgba(20,40,22,0.08)');
    ctx.fillStyle = mist;
    ctx.fillRect(0, 0, W, H);

    // Tree layers (back → front)
    drawTreeLayer(0.60, H * 0.38, 18, 'rgba(8,18,9,0.85)',   0.40, 22);
    drawTreeLayer(0.75, H * 0.48, 14, 'rgba(10,20,11,0.9)',  0.35, 18);
    drawTreeLayer(1.00, H * 0.60, 10, 'rgba(12,22,13,0.95)', 0.28, 14);

    // Ground
    ctx.fillStyle = '#050D06';
    ctx.fillRect(0, H * 0.78, W, H * 0.22);
  }

  function drawTreeLayer(density, baseY, minH, color, spread, treeW) {
    ctx.fillStyle = color;
    const count = Math.floor(W / (treeW * 1.4) * density);
    for (let i = 0; i <= count; i++) {
      const x = (i / count) * W * (1 + spread) - W * spread * 0.5;
      const h = minH
        * (0.7 + Math.sin(i * 7.3) * 0.3 + Math.sin(i * 3.7) * 0.2)
        * (H / 400);
      const w = treeW * (0.8 + Math.sin(i * 5.1) * 0.2) * (W / 800);
      drawTree(x, baseY, w, h * 3.5);
    }
  }

  function drawTree(x, baseY, w, h) {
    ctx.beginPath();
    ctx.moveTo(x,            baseY);
    ctx.lineTo(x - w * 0.5,  baseY);
    ctx.lineTo(x - w * 0.6,  baseY - h * 0.30);
    ctx.lineTo(x - w * 0.4,  baseY - h * 0.28);
    ctx.lineTo(x - w * 0.5,  baseY - h * 0.55);
    ctx.lineTo(x - w * 0.3,  baseY - h * 0.52);
    ctx.lineTo(x - w * 0.38, baseY - h * 0.75);
    ctx.lineTo(x - w * 0.15, baseY - h * 0.72);
    ctx.lineTo(x,             baseY - h);
    ctx.lineTo(x + w * 0.15, baseY - h * 0.72);
    ctx.lineTo(x + w * 0.38, baseY - h * 0.75);
    ctx.lineTo(x + w * 0.3,  baseY - h * 0.52);
    ctx.lineTo(x + w * 0.5,  baseY - h * 0.55);
    ctx.lineTo(x + w * 0.4,  baseY - h * 0.28);
    ctx.lineTo(x + w * 0.6,  baseY - h * 0.30);
    ctx.lineTo(x + w * 0.5,  baseY);
    ctx.closePath();
    ctx.fill();
  }

  drawForest();

  // ----- AMBIENT PARTICLES -----
  const ambientEl = document.getElementById('ambient');
  if (ambientEl) {
    for (let i = 0; i < 14; i++) {
      const dot   = document.createElement('div');
      dot.className = 'ambient-dot';
      const size  = Math.random() * 3 + 1;
      const x     = Math.random() * 100;
      const dur   = 8  + Math.random() * 14;
      const delay = Math.random() * 12;
      const bot   = Math.random() * 40;
      const r     = 100 + Math.floor(Math.random() * 80);
      const g     = 140 + Math.floor(Math.random() * 80);
      const b     = 80  + Math.floor(Math.random() * 60);
      const a     = (0.3 + Math.random() * 0.4).toFixed(2);
      dot.style.cssText = [
        'width:'            + size  + 'px',
        'height:'           + size  + 'px',
        'left:'             + x     + '%',
        'bottom:'           + bot   + '%',
        'background:rgba('  + r + ',' + g + ',' + b + ',' + a + ')',
        'animation-duration:' + dur   + 's',
        'animation-delay:'  + delay  + 's',
      ].join(';');
      ambientEl.appendChild(dot);
    }
  }
}());