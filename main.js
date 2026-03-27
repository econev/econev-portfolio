// --- PRELOADER ---
window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('.preloader');
  const bar = document.querySelector('.preloader-progress');
  const percent = document.querySelector('.preloader-percent');
  
  // Show preloader only on initial visit or page refresh
  // Skip it on internal navigation between pages
  const navEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navEntry && navEntry.type === 'reload';
  const isBackForward = navEntry && navEntry.type === 'back_forward';
  const isInternal = document.referrer && document.referrer.includes(window.location.host);

  if (isBackForward || (isInternal && !isReload)) {
    document.documentElement.classList.add('preloader-skipped');
    if (preloader) preloader.style.display = 'none';
    document.body.classList.add('loaded');
    document.body.style.opacity = '1';
    return;
  }

  if (preloader && bar && percent) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      
      bar.style.width = progress + '%';
      percent.textContent = Math.floor(progress) + '%';
      
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('fade-out');
          document.body.classList.add('loaded');
          
          setTimeout(() => {
            document.body.style.opacity = '1';
          }, 800);
        }, 500);
      }
    }, 100);
  } else {
     document.body.style.opacity = '1';
  }
});

// --- NAV SCROLL ---
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// --- MOBILE MENU ---
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[spans.length - 1].style.transform = '';
    }
  });
}

// --- HERO CANVAS PARTICLES ---
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  // Use the new accent color for particles
  const COLORS = ['rgba(226, 83, 25,', 'rgba(120, 120, 130,', 'rgba(255, 255, 255,'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.4 - 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.r = Math.random() * 1.5 + 0.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.001;
      if (this.y < 0 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(226, 83, 25,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// --- REVEAL ON SCROLL ---
function initReveal() {
  const els = document.querySelectorAll('.reveal-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}
initReveal();

// --- COUNTER ANIMATION ---
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const dur = 1800;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.stat-num[data-count]');
if (counterEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => io.observe(el));
}

// --- SKILL BARS ---
const bars = document.querySelectorAll('.skill-bar-fill');
if (bars.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => io.observe(b));
}

// --- 3D TILT EFFECT ---
document.querySelectorAll('.work-card, .project-card, .skill-block').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// --- PARALLAX ---
const parallaxEls = document.querySelectorAll('[data-parallax]');
if (parallaxEls.length) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

// --- PROJECT FILTER ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-tags]');
if (filterBtns.length && projectCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = card.dataset.tags || '';
        const show = filter === 'all' || tags.includes(filter);
        card.style.display = show ? '' : 'none';
        card.style.opacity = show ? '' : '0';
      });
    });
  });
}

// --- SMOOTH PAGE TRANSITIONS ---
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href.startsWith('http') && !link.target) {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { window.location = href; }, 300);
    }
  });
});
// --- CLICKABLE CARDS ---
document.querySelectorAll('.work-card, .project-card').forEach(card => {
  const link = card.querySelector('a.card-link, a.project-arrow, a.project-card-link, a[href$=".html"]');
  if (!link) return;
  
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    
    if (link.target === '_blank') {
      window.open(link.href, '_blank');
    } else {
      link.click();
    }
  });
});
