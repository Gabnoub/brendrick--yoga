// ===== OCEAN CANVAS BACKGROUND =====
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;
    let waveOffset = 0;

    function resizeCanvas() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      drawOcean();
    }
    window.addEventListener('resize', resizeCanvas);

    function drawOcean() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Nachthimmel über dem Meer
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0,   '#12396b');
      sky.addColorStop(0.3, '#1d64c2');
      sky.addColorStop(0.55,'#0A1728');
      sky.addColorStop(0.75,'#0C2038');
      sky.addColorStop(1,   '#17519d');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Sterne
      for (let i = 0; i < 120; i++) {
        const x = (Math.sin(i * 137.5) * 0.5 + 0.5) * W;
        const y = (Math.sin(i * 97.3)  * 0.5 + 0.5) * H * 0.45;
        const r = Math.random() * 1.2 + 0.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${0.08 + Math.random()*0.3})`;
        ctx.fill();
      }

      // Mond – blassblau/weiß
      const moonX = W * 0.72, moonY = H * 0.12, moonR = 36;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 6);
      moonGlow.addColorStop(0,   '#f1c563');
      moonGlow.addColorStop(0.3, 'rgba(100,180,220,0.06)');
      moonGlow.addColorStop(1,   'transparent');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, W, H);

      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      const moonDisc = ctx.createRadialGradient(moonX - 6, moonY - 6, 4, moonX, moonY, moonR);
      moonDisc.addColorStop(0,   '#edcb80');
      moonDisc.addColorStop(0.6, '#edcb80');
      moonDisc.addColorStop(1,   '#edcb80');
      ctx.fillStyle = moonDisc;
      ctx.fill();

      // Mondspiegelung auf dem Wasser
      const reflH = H * 0.18;
      const reflY = H * 0.62;
      const refl = ctx.createRadialGradient(moonX, reflY, 0, moonX, reflY, W * 0.25);
      refl.addColorStop(0,   'rgba(140,200,230,0.18)');
      refl.addColorStop(0.4, 'rgba(80,150,200,0.08)');
      refl.addColorStop(1,   'transparent');
      ctx.fillStyle = refl;
      ctx.fillRect(0, reflY - reflH/2, W, reflH);

      // Horizont-Dunst / Übergang Meer
      const horizon = ctx.createLinearGradient(0, H * 0.52, 0, H * 0.72);
      horizon.addColorStop(0,   'transparent');
      horizon.addColorStop(0.5, 'rgba(10,30,60,0.22)');
      horizon.addColorStop(1,   'rgba(6,18,40,0.1)');
      ctx.fillStyle = horizon;
      ctx.fillRect(0, 0, W, H);

      // Ozeanfläche (dunkles Teal/Blau)
      ctx.fillStyle = '#05111E';
      ctx.fillRect(0, H * 0.80, W, H * 0.20);

      // Sanfte Wellen
      function drawWave(yBase, amplitude, wavelength, color, alpha) {
        ctx.beginPath();
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= W; x += 4) {
          const y = yBase + Math.sin((x / wavelength) + waveOffset) * amplitude
                          + Math.sin((x / (wavelength * 0.6)) + waveOffset * 1.3) * (amplitude * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      drawWave(H * 0.73, 6, 320, '#061828', 0.9);
      drawWave(H * 0.76, 5, 260, '#071C30', 0.9);
      drawWave(H * 0.79, 4, 200, '#050F1C', 1.0);

      // Leuchtlinie auf dem Wasser (Mondschein-Streifen)
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#90C8E0';
      ctx.beginPath();
      ctx.ellipse(moonX, H * 0.76, 22, H * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    resizeCanvas();

    // Wellen animieren
    function animateWaves() {
      waveOffset += 0.012;
      drawOcean();
      requestAnimationFrame(animateWaves);
    }
    animateWaves();

    // ===== AMBIENT DOTS (Meeresblasen / aufsteigende Partikel) =====
    const ambientEl = document.getElementById('ambient');
    for (let i = 0; i < 22; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const dur = 8 + Math.random() * 14;
      const delay = Math.random() * 12;
      const bottom = Math.random() * 40;
      dot.style.cssText = `
        width:${size}px; height:${size}px;
        left:${x}%; bottom:${bottom}%;
        background: rgba(${60+Math.random()*60}, ${160+Math.random()*60}, ${200+Math.random()*55}, ${0.3+Math.random()*0.4});
        animation-duration:${dur}s;
        animation-delay:${delay}s;
      `;
      ambientEl.appendChild(dot);
    }