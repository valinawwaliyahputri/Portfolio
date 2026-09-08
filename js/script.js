// Mobile nav toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

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

// Navbar shrink shadow on scroll (subtle)
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.style.boxShadow = '0 20px 45px -18px rgba(0,0,0,.55)';
  } else {
    navbar.style.boxShadow = '0 15px 35px -18px rgba(0,0,0,.4)';
  }
});
