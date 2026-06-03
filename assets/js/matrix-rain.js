(function () {
  var canvas = document.getElementById('matrix-bg-canvas');
  var video = document.getElementById('hero-video');
  if (!canvas || !video) return;

  var ctx = canvas.getContext('2d');
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var fontSize = 14;
  var columns, drops;
  var animId = null;
  var matrixTimer = null;

  // --- Canvas sizing ---
  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
    }
  }

  // --- Draw one frame ---
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (var i = 0; i < drops.length; i++) {
      var char = letters[Math.floor(Math.random() * letters.length)];
      var x = i * fontSize;
      var y = drops[i] * fontSize;
      // Lead character white
      ctx.fillStyle = '#fff';
      ctx.fillText(char, x, y);
      // Trail characters green
      for (var j = 1; j < 8; j++) {
        var trail = letters[Math.floor(Math.random() * letters.length)];
        var alpha = Math.max(0, 1 - j * 0.15);
        ctx.fillStyle = 'rgba(0, 255, 65, ' + alpha + ')';
        ctx.fillText(trail, x, y - j * fontSize);
      }
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    animId = requestAnimationFrame(draw);
  }

  // --- Start matrix animation ---
  function startMatrix() {
    canvas.classList.add('active');
    video.style.display = 'none';
    resize();
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  // --- Stop matrix, show video ---
  function stopMatrix() {
    canvas.classList.remove('active');
    video.style.display = 'block';
    video.currentTime = 0;
    video.play();
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // --- When video ends, show matrix for 20s then restart video ---
  video.addEventListener('ended', function () {
    startMatrix();
    if (matrixTimer) clearTimeout(matrixTimer);
    matrixTimer = setTimeout(function () {
      stopMatrix();
    }, 20000);
  });

  // --- Handle resize ---
  window.addEventListener('resize', function () {
    if (canvas.classList.contains('active')) {
      resize();
    }
  });

  // --- Initial setup: video visible, canvas hidden ---
  canvas.classList.remove('active');
  video.style.display = 'block';
  video.muted = true;
  video.playsInline = true;
  video.play();

  // If video fails to load or is too short, fall back gracefully
  // Check every 2s if video ended without triggering (safety net)
  setInterval(function () {
    if (video.ended && !canvas.classList.contains('active')) {
      startMatrix();
      if (matrixTimer) clearTimeout(matrixTimer);
      matrixTimer = setTimeout(function () {
        stopMatrix();
      }, 20000);
    }
  }, 2000);
})();