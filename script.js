/* ═══════════════════════════════════════════
   AURORA CANVAS
═══════════════════════════════════════════ */
(function initAurora() {
  const canvas = document.getElementById('auroraCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  const blobs = [
    { x: .15, y: .2,  r: .45, hue: 38,  sat: 100, lit: 55 }, // gold
    { x: .8,  y: .75, r: .4,  hue: 280, sat: 80,  lit: 65 }, // violet
    { x: .5,  y: .5,  r: .35, hue: 330, sat: 80,  lit: 60 }, // flamingo
    { x: .1,  y: .8,  r: .3,  hue: 200, sat: 70,  lit: 50 }, // blue accent
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Dark base
    ctx.fillStyle = '#08081A';
    ctx.fillRect(0, 0, W, H);

    blobs.forEach((b, i) => {
      const speed = 0.0003 + i * 0.0001;
      const px = W * (b.x + Math.sin(t * speed * 1.3 + i * 1.4) * 0.18);
      const py = H * (b.y + Math.cos(t * speed * 1.7 + i * 2.1) * 0.14);
      const radius = Math.min(W, H) * b.r;

      const grd = ctx.createRadialGradient(px, py, 0, px, py, radius);
      grd.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, ${b.lit}%, 0.18)`);
      grd.addColorStop(1, 'transparent');

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    });

    t++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ═══════════════════════════════════════════
   MUSIC TOGGLE
═══════════════════════════════════════════ */
const musicBtn  = document.getElementById('musicBtn');
const bgMusic   = document.getElementById('bgMusic');
let   playing   = false;

function tryPlay() {
  bgMusic.volume = 0.4;
  bgMusic.play().then(() => {
    playing = true;
    musicBtn.classList.add('playing');
  }).catch(() => {});
}

musicBtn.addEventListener('click', () => {
  if (playing) {
    bgMusic.pause();
    playing = false;
    musicBtn.classList.remove('playing');
  } else {
    tryPlay();
  }
});

// Attempt autoplay on first real interaction
document.addEventListener('pointerdown', () => { if (!playing) tryPlay(); }, { once: true });


/* ═══════════════════════════════════════════
   CELEBRATE BUTTON — CONFETTI BURST
═══════════════════════════════════════════ */
const celebBtn = document.getElementById('celebrateBtn');

celebBtn.addEventListener('click', () => {
  const colors = ['#FFB800', '#FFD966', '#C084FC', '#FF6B9D', '#FFFFFF'];

  // Left cannon
  confetti({ angle: 60,  spread: 70, particleCount: 80, origin: { x: 0,   y: .7 }, colors });
  // Right cannon
  confetti({ angle: 120, spread: 70, particleCount: 80, origin: { x: 1,   y: .7 }, colors });
  // Center burst
  confetti({ spread: 160, startVelocity: 40, particleCount: 100, origin: { x: .5, y: .6 }, colors, scalar: 1.2 });

  // Stars
  confetti({
    particleCount: 60,
    spread: 100,
    origin: { x: .5, y: .5 },
    colors: [colors[0]],
    shapes: ['star'],
    scalar: 1.5,
  });

  // Second wave
  setTimeout(() => {
    confetti({ angle: 90, spread: 50, particleCount: 60, origin: { x: .5, y: .4 }, colors, startVelocity: 55 });
  }, 400);

  // Animate the button
  if (window.anime) {
    anime({
      targets: celebBtn,
      scale: [1, 1.15, 1],
      duration: 400,
      easing: 'easeOutElastic(1, .6)',
    });
  }
});


/* ═══════════════════════════════════════════
   SUBTLE CURSOR SPARKLE (desktop only)
═══════════════════════════════════════════ */
if (window.matchMedia('(pointer: fine)').matches) {
  let lastSparkle = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkle < 120) return;
    if (Math.random() > .55) return;
    lastSparkle = now;

    const el = document.createElement('span');
    el.textContent = ['✦', '✧', '★', '✨'][Math.floor(Math.random() * 4)];
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      font-size: ${12 + Math.random() * 14}px;
      color: hsl(${40 + Math.random() * 40}, 100%, 70%);
      pointer-events: none;
      z-index: 9999;
      user-select: none;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(el);

    if (window.anime) {
      anime({
        targets: el,
        translateY: -40 - Math.random() * 30,
        translateX: (Math.random() - .5) * 40,
        opacity: [1, 0],
        scale: [1, .3],
        rotate: anime.random(-120, 120),
        duration: 800 + Math.random() * 400,
        easing: 'easeOutExpo',
        complete: () => el.remove(),
      });
    } else {
      setTimeout(() => el.remove(), 900);
    }
  });
}


/* ═══════════════════════════════════════════
   REASON CARDS — NUMBER HIGHLIGHT ON HOVER
═══════════════════════════════════════════ */
document.querySelectorAll('.reason-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (!window.anime) return;
    anime({
      targets: card.querySelector('.r-num'),
      scale: [1, 1.25, 1],
      duration: 400,
      easing: 'easeOutElastic(1, .7)',
    });
  });
});


/* ═══════════════════════════════════════════
   PARALLAX — HERO STRIP DRIFT ON SCROLL
═══════════════════════════════════════════ */
const heroStrip = document.querySelector('.hero-strip');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroStrip) {
    heroStrip.style.transform = `translateX(${y * -0.08}px)`;
  }
}, { passive: true });


/* ═══════════════════════════════════════════
   NEON FLICKER — INTENSIFY ON SCROLL INTO VIEW
═══════════════════════════════════════════ */
const neonObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && window.anime) {
      anime({
        targets: '.n-digit',
        opacity: [0.4, 1],
        scale: [0.85, 1],
        delay: anime.stagger(80),
        duration: 700,
        easing: 'easeOutExpo',
      });
      neonObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
neonObserver.observe(document.getElementById('neonNumber'));


/* ═══════════════════════════════════════════
   MOSAIC ITEMS — STAGGERED TILT ON HOVER
═══════════════════════════════════════════ */
document.querySelectorAll('.mosaic-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    if (!window.anime) return;
    const rect = item.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width  * 8;
    const dy = (e.clientY - cy) / rect.height * 8;
    item.style.transform = `perspective(600px) rotateY(${dx}deg) rotateX(${-dy}deg) scale(1.02)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});


console.log('🎂 Happy 19th Birthday, Abena! — Made with 💛 by John Dadson');
