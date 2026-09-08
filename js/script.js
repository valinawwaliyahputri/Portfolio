// Mobile nav toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Active link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

if (navAnchors.length) {
  function setActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// Horizontal scroll controls (Experience cards)
const expScroll = document.getElementById('expScroll');
const expPrev = document.getElementById('expPrev');
const expNext = document.getElementById('expNext');
if (expScroll && expPrev && expNext) {
  const scrollAmount = () => expScroll.querySelector('.exp-card').offsetWidth + 22;
  expPrev.addEventListener('click', () => expScroll.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  expNext.addEventListener('click', () => expScroll.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
}

// Projects: draggable arch-card carousel with dark intro panel
const projScroll = document.getElementById('projScroll');
const projPrev = document.getElementById('projPrev');
const projNext = document.getElementById('projNext');
const projPagerWrap = document.getElementById('projPager');

if (projScroll && projPrev && projNext) {
  const projCards = Array.from(projScroll.querySelectorAll('.proj-card'));
  const projStep = () => projCards[0].offsetWidth + 24;
  const cardsPerPage = 3;
  const pageCount = Math.ceil(projCards.length / cardsPerPage);

  let projDots = [];
  if (projPagerWrap) {
    for (let i = 0; i < pageCount; i++) {
      const btn = document.createElement('button');
      btn.textContent = String(i + 1).padStart(2, '0');
      btn.addEventListener('click', () => {
        projScroll.scrollTo({ left: i * cardsPerPage * projStep(), behavior: 'smooth' });
      });
      projPagerWrap.appendChild(btn);
    }
    projDots = Array.from(projPagerWrap.children);
  }

  function updateProjPager() {
    if (!projDots.length) return;
    const page = Math.round(projScroll.scrollLeft / (cardsPerPage * projStep()));
    projDots.forEach((dot, i) => dot.classList.toggle('active', i === Math.min(page, pageCount - 1)));
  }

  projPrev.addEventListener('click', () => projScroll.scrollBy({ left: -projStep(), behavior: 'smooth' }));
  projNext.addEventListener('click', () => projScroll.scrollBy({ left: projStep(), behavior: 'smooth' }));
  projScroll.addEventListener('scroll', updateProjPager);
  window.addEventListener('resize', updateProjPager);
  updateProjPager();

  // Mouse drag-to-scroll
  let isDragging = false, dragStartX = 0, scrollStart = 0, dragMoved = false;
  projScroll.addEventListener('mousedown', (e) => {
    isDragging = true; dragMoved = false;
    dragStartX = e.pageX;
    scrollStart = projScroll.scrollLeft;
    projScroll.classList.add('dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = e.pageX - dragStartX;
    if (Math.abs(delta) > 4) dragMoved = true;
    projScroll.scrollLeft = scrollStart - delta;
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    projScroll.classList.remove('dragging');
  });
  projScroll.addEventListener('click', (e) => {
    if (dragMoved) { e.preventDefault(); e.stopPropagation(); }
  }, true);
}

// Organization & Committee coverflow carousel
const orgCarousel = document.getElementById('orgCarousel');
const orgPrev = document.getElementById('orgPrev');
const orgNext = document.getElementById('orgNext');
const orgDotsWrap = document.getElementById('orgDots');

if (orgCarousel && orgPrev && orgNext) {
  const orgCards = Array.from(orgCarousel.querySelectorAll('.org-card'));
  const orgTotal = orgCards.length;
  let orgActive = 0;

  if (orgDotsWrap) {
    orgCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'org-dot';
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => { orgActive = i; renderOrgCarousel(); });
      orgDotsWrap.appendChild(dot);
    });
  }
  const orgDots = orgDotsWrap ? Array.from(orgDotsWrap.children) : [];

  function orgShortestOffset(i) {
    let diff = i - orgActive;
    if (diff > orgTotal / 2) diff -= orgTotal;
    if (diff < -orgTotal / 2) diff += orgTotal;
    return diff;
  }

  function renderOrgCarousel() {
    const cardWidth = orgCards[0].offsetWidth;
    const step = cardWidth * 0.78;

    orgCards.forEach((card, i) => {
      const offset = orgShortestOffset(i);
      const abs = Math.abs(offset);
      let scale, opacity, z, translateX;

      if (abs === 0) { scale = 1; opacity = 1; z = 5; translateX = 0; }
      else if (abs === 1) { scale = .82; opacity = .55; z = 4; translateX = offset * step; }
      else if (abs === 2) { scale = .68; opacity = .25; z = 3; translateX = offset * step * 1.85; }
      else { scale = .6; opacity = 0; z = 1; translateX = offset * step * 2.4; }

      card.style.transform = `translate(-50%,-50%) translateX(${translateX}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = z;
      card.style.pointerEvents = abs > 2 ? 'none' : 'auto';
    });

    orgDots.forEach((dot, i) => dot.classList.toggle('active', i === orgActive));
  }

  orgCards.forEach((card, i) => {
    card.addEventListener('click', () => { orgActive = i; renderOrgCarousel(); });
  });

  orgPrev.addEventListener('click', () => { orgActive = (orgActive - 1 + orgTotal) % orgTotal; renderOrgCarousel(); });
  orgNext.addEventListener('click', () => { orgActive = (orgActive + 1) % orgTotal; renderOrgCarousel(); });

  window.addEventListener('resize', renderOrgCarousel);
  renderOrgCarousel();
}

// Documentation photo accordion (expand on click, with prev/next nav)
const dGallery = document.getElementById('dGallery');
const galPrev = document.getElementById('galPrev');
const galNext = document.getElementById('galNext');
if (dGallery) {
  const gallerySlots = Array.from(dGallery.querySelectorAll('.photo-slot'));
  let galleryActive = gallerySlots.findIndex(s => s.classList.contains('active'));
  if (galleryActive === -1) galleryActive = 0;

  function setGalleryActive(i) {
    galleryActive = (i + gallerySlots.length) % gallerySlots.length;
    gallerySlots.forEach((s, idx) => s.classList.toggle('active', idx === galleryActive));
  }
  setGalleryActive(galleryActive);

  gallerySlots.forEach((slot, idx) => {
    slot.addEventListener('click', () => setGalleryActive(idx));
  });
  if (galPrev) galPrev.addEventListener('click', () => setGalleryActive(galleryActive - 1));
  if (galNext) galNext.addEventListener('click', () => setGalleryActive(galleryActive + 1));
}

// Navbar shrink shadow on scroll (subtle)
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 20px 45px -18px rgba(0,0,0,.55)';
    } else {
      navbar.style.boxShadow = '0 15px 35px -18px rgba(0,0,0,.4)';
    }
  });
}
