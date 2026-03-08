// Portfolio JS — Mahesh Biradar

// ─── Navigation: scroll + active link ───
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const hamburger = document.querySelector('.hamburger');
const navLinksList = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  // Scrolled class
  nav.classList.toggle('scrolled', window.scrollY > 50);

  // Active link highlight
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// Hamburger menu
hamburger?.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.forEach(link => link.addEventListener('click', () => {
  navLinksList.classList.remove('open');
}));

// ─── Scroll Reveal ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Skill Bar Animation ───
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-item').forEach(item => barObserver.observe(item));

// ─── Typed text effect ───
const typedEl = document.getElementById('typed-text');
const roles = ['Senior Software Engineer', 'Backend Developer', 'Python Specialist', 'API Architect', 'Microservices Expert'];
let roleIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
  if (!typedEl) return;
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { deleting = true; setTimeout(typeEffect, 1800); return; }
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeEffect, deleting ? 60 : 90);
}
typeEffect();

// ─── Contact Form ───
const form = document.getElementById('contact-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1200);
});

// ─── Particle / star Canvas ───
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speed = Math.random() * 0.3 + 0.05;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() { this.y -= this.speed; if (this.y < 0) this.reset(); this.y = this.y < 0 ? canvas.height : this.y; }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 180, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ─── Smooth number count up for stats ───
function countUp(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)) + el.dataset.suffix;
    if (start < target) requestAnimationFrame(tick);
  };
  tick();
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        countUp(el, parseFloat(el.dataset.target));
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);
