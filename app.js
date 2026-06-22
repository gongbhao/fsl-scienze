let current = 1;
const slides = document.querySelectorAll('.slide');
const total = slides.length;
const dotsContainer = document.getElementById('dots');
const counter = document.getElementById('counter');
for (let i = 1; i <= total; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 1 ? ' active' : '');
  dot.onclick = () => goToSlide(i);
  dotsContainer.appendChild(dot);
}
function goToSlide(n) {
  const prev = document.querySelector('.slide.active');
  const next = document.querySelector(`.slide[data-slide="${n}"]`);
  if (prev) prev.classList.remove('active');
  if (next) {
    next.classList.add('active');
    animateSlide(next);
  }
  current = n;
  updateNav();
}
function changeSlide(dir) {
  let next = current + dir;
  if (next < 1) next = 1;
  if (next > total) next = total;
  if (next !== current) {
    goToSlide(next);
  }
}
function updateNav() {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i + 1 === current);
  });
  counter.textContent = current + ' / ' + total;
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); changeSlide(1); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); changeSlide(-1); }
});
let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
document.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
});
function animateSlide(slide) {
  slide.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.offsetHeight;
    const delay = i * 0.08;
    el.style.transition = `opacity 0.35s ease ${delay}s, transform 0.35s ease ${delay}s`;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}
const spotlight = document.querySelector('.mouse-spotlight');
document.addEventListener('mousemove', (e) => {
  if (!spotlight) return;
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--glow-color-rgb').trim() || '56,189,248';
  spotlight.style.background = `radial-gradient(520px circle at ${e.clientX}px ${e.clientY}px, rgba(${rgb},0.09), transparent 45%)`;
});
function initParticles(canvas, options) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  const interactive = options.interactive !== false;
  const count = options.count || (interactive ? 55 : 18);
  let mx = -1000, my = -1000;
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--glow-color-rgb').trim() || '56,189,248';
  const [r, g, b] = rgb.split(',').map(Number);
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 2.4 + 0.8,
    alpha: Math.random() * 0.35 + 0.1
  }));
  if (interactive) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mx = -1000; my = -1000; });
  }
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      if (interactive) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 2;
          p.vx += (dx / dist) * force * 0.08;
          p.vy += (dy / dist) * force * 0.08;
        }
      }
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  })();
}
document.querySelectorAll('.particle-canvas').forEach(c => initParticles(c, { interactive: true, count: 55 }));
if (slides[0]) animateSlide(slides[0]);