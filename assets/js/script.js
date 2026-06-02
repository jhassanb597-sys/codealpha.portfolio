/* script.js — Portfolio */
(function () {

  /* Sticky header */
  var header = document.querySelector('.header');
  var btt    = document.getElementById('btt');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    if (btt)    btt.classList.toggle('show', window.scrollY > 360);
  }, { passive: true });

  /* Back to top */
  if (btt) btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* Hamburger */
  var ham = document.querySelector('.ham');
  var mob = document.querySelector('.mob');
  if (ham && mob) {
    ham.addEventListener('click', function () {
      var open = mob.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mob.classList.remove('open'); ham.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', function (e) {
      if (mob.classList.contains('open') && !mob.contains(e.target) && !ham.contains(e.target)) {
        mob.classList.remove('open'); ham.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* Scroll reveal */
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revs.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });
    revs.forEach(function (el) { obs.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add('in'); });
  }

  /* Active nav link */
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob a').forEach(function (a) {
    if ((a.getAttribute('href') || '').includes(page)) a.classList.add('active');
  });

  /* Contact form */
  var form = document.getElementById('contact-form');
  var succ = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('.ferr').forEach(function (el) { el.classList.remove('show'); });
      [
        { id: 'name',    msg: 'Please enter your name.',          ok: function (v) { return v.trim().length >= 2; } },
        { id: 'email',   msg: 'Please enter a valid email.',      ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
        { id: 'subject', msg: 'Please enter a subject.',          ok: function (v) { return v.trim().length >= 2; } },
        { id: 'message', msg: 'At least 10 characters required.', ok: function (v) { return v.trim().length >= 10; } }
      ].forEach(function (r) {
        var inp = document.getElementById(r.id);
        var err = document.getElementById(r.id + '-err');
        if (!inp || r.ok(inp.value)) return;
        ok = false; inp.style.borderColor = '#c0392b';
        if (err) { err.textContent = r.msg; err.classList.add('show'); }
        inp.addEventListener('input', function () {
          inp.style.borderColor = ''; if (err) err.classList.remove('show');
        }, { once: true });
      });
      if (ok) {
        /* TODO: connect Formspree / EmailJS / PHP */
        if (succ) succ.classList.add('show');
        form.reset(); form.style.display = 'none';
      }
    });
  }

  /* Year */
  document.querySelectorAll('.yr').forEach(function (el) { el.textContent = new Date().getFullYear(); });

})();
