// Portfolio JS — Mahesh Biradar

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Navigation: scroll + active link ───
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const navLinksList = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
nav.classList.toggle('scrolled', window.scrollY > 40);

// Highlight the nav link matching the current page (multi-page site — not scroll-based)
const currentPage = location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const linkPage = link.getAttribute('href').split('/').pop();
  link.classList.toggle('active', linkPage === currentPage);
});

// Hamburger menu
hamburger?.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});
navLinks.forEach(link => link.addEventListener('click', () => {
  navLinksList.classList.remove('open');
}));

// ─── Scroll reveal ───
if (prefersReducedMotion) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ─── Skill bar fill (Skills page) ───
const skillFillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      skillFillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.skills-group').forEach(group => skillFillObserver.observe(group));

// ─── Contact Form ───
const form = document.getElementById('contact-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending';
  btn.disabled = true;
  setTimeout(() => {
    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1000);
});

// ─── Hero stat counters ───
// These sit inside the hero itself (not a scroll-away section), and on most real
// viewport heights (laptop 1366x768, any phone) the stats row starts below the
// fold — an IntersectionObserver gated on 50% visibility never fires without a
// full manual scroll. Since these numbers are meant to be seen as part of landing
// on the page, animate them on load instead of waiting for a scroll intersection.
function countUp(el, target, duration = 1400) {
  const suffix = el.dataset.suffix || '';
  const isInt = Number.isInteger(target);
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = (isInt ? Math.floor(start) : start.toFixed(1)) + suffix;
    if (start < target) requestAnimationFrame(tick);
  };
  tick();
}

const statEls = document.querySelectorAll('.stat-num[data-target]');
if (statEls.length) {
  const runCounters = () => statEls.forEach(el => {
    if (prefersReducedMotion) {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    } else {
      countUp(el, parseFloat(el.dataset.target));
    }
  });
  if (document.readyState === 'complete') {
    requestAnimationFrame(runCounters);
  } else {
    window.addEventListener('load', () => requestAnimationFrame(runCounters));
  }
}

// ─── Waveform visualizer — the one deliberate animated moment ───
const waveCanvas = document.getElementById('waveform-canvas');
if (waveCanvas) {
  const ctx = waveCanvas.getContext('2d');
  const BAR_COUNT = 28;
  let bars = new Array(BAR_COUNT).fill(0).map(() => Math.random());
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function sizeCanvas() {
    const rect = waveCanvas.getBoundingClientRect();
    waveCanvas.width = rect.width * dpr;
    waveCanvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  const signalColor = () => getComputedStyle(document.documentElement).getPropertyValue('--signal').trim() || '#2A4DE0';

  function drawStatic() {
    const rect = waveCanvas.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);
    const gap = w / BAR_COUNT;
    const barWidth = gap * 0.5;
    ctx.fillStyle = signalColor();
    bars.forEach((v, i) => {
      const barH = Math.max(3, v * h * 0.7 + h * 0.08);
      const x = i * gap + (gap - barWidth) / 2;
      const y = (h - barH) / 2;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, 2);
      ctx.fill();
    });
  }

  if (prefersReducedMotion) {
    drawStatic();
  } else {
    let t = 0;
    function animateWave() {
      t += 0.045;
      bars = bars.map((_, i) => {
        const phase = i * 0.4;
        return 0.35 + 0.35 * Math.sin(t + phase) + 0.25 * Math.sin(t * 2.3 + phase * 1.7);
      }).map(v => Math.min(1, Math.max(0.08, Math.abs(v))));
      drawStatic();
      requestAnimationFrame(animateWave);
    }
    animateWave();
  }
}
