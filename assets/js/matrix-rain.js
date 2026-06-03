/* ============================================
   CSS Matrix Rain Effect - JavaScript
   Falling English alphabet letters
 ============================================ */

(function () {
  var canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var container = canvas.parentElement;
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var fontSize = 14;
  var columns, drops;

  function resize() {
    var rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
    }
  }

  function draw() {
    // Semi-transparent black overlay creates fade trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (var i = 0; i < drops.length; i++) {
      var char = letters[Math.floor(Math.random() * letters.length)];
      var x = i * fontSize;
      var y = drops[i] * fontSize;

      // Bright white leading character
      ctx.fillStyle = '#fff';
      ctx.fillText(char, x, y);

      // Dim green trail behind
      for (var j = 1; j < 8; j++) {
        var trail = letters[Math.floor(Math.random() * letters.length)];
        var alpha = Math.max(0, 1 - j * 0.15);
        ctx.fillStyle = 'rgba(0, 255, 65, ' + alpha + ')';
        ctx.fillText(trail, x, y - j * fontSize);
      }

      // Random reset when off-screen
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();