/* ═══════════════════════════════════════════════
   PORTFOLIO SCRIPT
═══════════════════════════════════════════════ */

/* ── Page Loader ───────────────────────────── */
const loader = document.createElement('div');
loader.className = 'page-loader';
loader.innerHTML = '<span class="loader-text">LOADING</span>';
document.body.prepend(loader);

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 600);
});

/* ── Custom Cursor ─────────────────────────── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor     = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursor.className     = 'custom-cursor';
  cursorRing.className = 'custom-cursor-ring';
  document.body.append(cursor, cursorRing);

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow on interactive elements
  const interactives = 'a, button, .project-item, .stack-list li';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });
}

/* ── Menu Toggle ───────────────────────────── */
const menuBtn    = document.getElementById('menuBtn');
const navOverlay = document.getElementById('navOverlay');
const navClose   = document.getElementById('navClose');

function openMenu() {
  navOverlay.classList.add('open');
  navOverlay.setAttribute('aria-hidden', 'false');
  menuBtn.classList.add('active');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navOverlay.classList.remove('open');
  navOverlay.setAttribute('aria-hidden', 'true');
  menuBtn.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
  navOverlay.classList.contains('open') ? closeMenu() : openMenu();
});

navClose.addEventListener('click', closeMenu);

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ── Scroll-to from nav links ──────────────── */
document.querySelectorAll('.nav-scroll').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.dataset.target;
    const target   = document.getElementById(targetId);
    if (target) {
      closeMenu();
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 450);
    }
  });
});

/* ── Scroll Reveal (IntersectionObserver) ─── */
const revealEls = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

// Stagger children in same parent
revealEls.forEach((el, i) => {
  // Auto-stagger siblings
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal-up'));
  const idx = siblings.indexOf(el);
  if (!el.style.getPropertyValue('--delay')) {
    el.style.setProperty('--delay', `${idx * 0.08}s`);
  }
  revealObserver.observe(el);
});

/* ── Projects Hover (sibling dim) ─────────── */
// Already handled via CSS :hover on parent — no JS needed.
// But we add a subtle line-slide effect on hover.
const projectItems = document.querySelectorAll('.project-item');

projectItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    projectItems.forEach(other => {
      if (other !== item) other.style.opacity = '0.28';
    });
  });
  item.addEventListener('mouseleave', () => {
    projectItems.forEach(other => {
      other.style.opacity = '';
    });
  });
});

/* ── LET'S TALK button text wrap ──────────── */
const talkBtn = document.getElementById('letsTalkBtn');
if (talkBtn) {
  talkBtn.innerHTML = '<span>LET\'S TALK</span>';
}

/* ── Parallax subtle on hero title ────────── */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.15;
    heroTitle.style.transform = `translateY(${rate}px)`;
    heroTitle.style.opacity   = Math.max(1 - scrolled / 600, 0);
  }, { passive: true });
}

/* ── Active section highlight in nav ──────── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks  = document.querySelectorAll('.nav-scroll');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.dataset.target === id ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

/* ── Footer year ───────────────────────────── */
// Already static in HTML; keeping for future dynamic use

/* ── Scroll progress bar ───────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  width: 0%;
  background: var(--accent);
  z-index: 9999;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}, { passive: true });

/* ── Typewriter effect on hero title ───────── */
function typewriterAccent() {
  const el = document.querySelector('.hero-title .accent');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  el.style.borderRight = '3px solid var(--accent)';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(timer);
      setTimeout(() => { el.style.borderRight = 'none'; }, 600);
    }
  }, 80);
}

// Run typewriter after loader hides
setTimeout(typewriterAccent, 900);
