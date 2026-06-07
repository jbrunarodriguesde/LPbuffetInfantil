/* ============================================
   BUFFET KIDS PREMIUM — script.js
   ============================================ */

'use strict';

/* ── LOADING SCREEN ── */
window.addEventListener('load', () => {
  const screen = document.getElementById('loading-screen');
  setTimeout(() => screen.classList.add('hidden'), 1800);
});

/* ── HEADER SCROLL ── */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  toggleBackToTop();
}, { passive: true });

/* ── HAMBURGER / MOBILE NAV ── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── HERO SLIDESHOW ── */
const slides     = document.querySelectorAll('.slide');
const dots       = document.querySelectorAll('.dot');
let   currentSlide = 0;
let   slideTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }

function startSlider() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 5000);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); startSlider(); });
});

startSlider();

/* ── ANIMATED COUNTERS ── */
let countersStarted = false;

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step     = target / (duration / 16);
  let   current  = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString('pt-BR');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
    }
  }, 16);
}

function startCounters() {
  if (countersStarted) return;
  const hero = document.querySelector('.hero-stats');
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    countersStarted = true;
    document.querySelectorAll('.stat-number').forEach(animateCounter);
  }
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay || 0;
    setTimeout(() => entry.target.classList.add('visible'), parseInt(delay, 10));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

window.addEventListener('scroll', startCounters, { passive: true });
startCounters();

/* ── GALLERY FILTER ── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.opacity    = match ? '1' : '0';
      item.style.transform  = match ? 'scale(1)' : 'scale(0.9)';
      item.style.pointerEvents = match ? 'auto' : 'none';
      item.style.transition = 'opacity .35s ease, transform .35s ease';
      setTimeout(() => { item.style.display = match ? '' : 'none'; }, match ? 0 : 350);
      if (match) requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
    });
  });
});

/* ── LIGHTBOX ── */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lbClose      = document.getElementById('lightbox-close');
const lbPrev       = document.getElementById('lightbox-prev');
const lbNext       = document.getElementById('lightbox-next');

let visibleItems   = [];
let currentLbIndex = 0;

function openLightbox(index) {
  visibleItems = [...galleryItems].filter(i => i.style.display !== 'none' && i.style.opacity !== '0');
  currentLbIndex = index;
  const img = visibleItems[currentLbIndex]?.querySelector('img');
  if (!img) return;
  lightboxImg.src = img.src.replace('w=500', 'w=1200');
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener('click', () => {
  currentLbIndex = (currentLbIndex - 1 + visibleItems.length) % visibleItems.length;
  const img = visibleItems[currentLbIndex]?.querySelector('img');
  if (img) { lightboxImg.src = img.src.replace('w=500', 'w=1200'); lightboxImg.alt = img.alt; }
});

lbNext.addEventListener('click', () => {
  currentLbIndex = (currentLbIndex + 1) % visibleItems.length;
  const img = visibleItems[currentLbIndex]?.querySelector('img');
  if (img) { lightboxImg.src = img.src.replace('w=500', 'w=1200'); lightboxImg.alt = img.alt; }
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lbPrev.click();
  if (e.key === 'ArrowRight')  lbNext.click();
});

/* ── VIDEO MODAL ── */
const playBtn        = document.getElementById('play-btn');
const videoModal     = document.getElementById('video-modal');
const videoIframe    = document.getElementById('video-iframe');
const videoClose     = document.getElementById('video-modal-close');

playBtn.addEventListener('click', () => {
  videoIframe.src = videoIframe.dataset.src;
  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeVideoModal() {
  videoModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { videoIframe.src = ''; }, 300);
}

videoClose.addEventListener('click', closeVideoModal);
videoModal.addEventListener('click', e => { if (e.target === videoModal) closeVideoModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideoModal();
});

/* ── BACK TO TOP ── */
const backToTop = document.getElementById('back-to-top');

function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── SMOOTH ACTIVE NAV LINK ── */
const sections     = document.querySelectorAll('section[id]');
const navItems     = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navItems.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── PARALLAX HERO (subtle) ── */
const heroOverlay = document.querySelector('.hero-overlay');

window.addEventListener('scroll', () => {
  if (!heroOverlay) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroOverlay.style.transform = `translateY(${y * 0.2}px)`;
  }
}, { passive: true });

/* ── SERVICE CARD hover ripple (touch-friendly) ── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('pointerenter', () => card.classList.add('hovered'));
  card.addEventListener('pointerleave', () => card.classList.remove('hovered'));
});
