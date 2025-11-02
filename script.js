/* script.js */
/* ------------------------------------------------
   Interactive JS for portfolio:
   - Responsive nav toggle
   - Theme toggle (dark/light)
   - Typing animation for hero
   - Smooth progress-bar reveal
   - IntersectionObserver scroll-triggered animations
   - Contact form connect to EmailJS
   ------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  /* ========= basic elements ========= */
  const htmlRoot = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const yearSpan = document.getElementById('year');

  // Set year in footer
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ========= theme (dark/light) ========= */
  // load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') htmlRoot.classList.add('light');

  themeToggle.addEventListener('click', () => {
    const isLight = htmlRoot.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    // swap icon
    themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });

  // set initial icon
  themeToggle.innerHTML = htmlRoot.classList.contains('light') ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';

  /* ========= hamburger nav ========= */
  hamburger.addEventListener('click', () => {
    const open = nav.style.display !== 'block';
    if (open) {
      nav.style.display = 'block';
      hamburger.setAttribute('aria-expanded', 'true');
    } else {
      nav.style.display = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close mobile nav when link clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        nav.style.display = '';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ========= typing effect (hero) ========= */
  const typeTextEl = document.getElementById('type-text');
  const phrases = ["Frontend Developer", "UI/UX Designer", "Performance-focused", "React & Component-driven","Python Developer"];
  let typeIndex = 0, charIndex = 0, direction = 1;
  const TYPING_SPEED = 70;
  const PAUSE = 1500;

  function typeLoop(){
    const current = phrases[typeIndex];
    if (direction === 1) {
      // typing
      typeTextEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        direction = 0;
        setTimeout(typeLoop, PAUSE);
        return;
      }
    } else {
      // deleting
      typeTextEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        direction = 1;
        typeIndex = (typeIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, TYPING_SPEED);
  }
  if (typeTextEl) typeLoop();

  /* ========= Intersection Observer for reveal animations & progress bars ========= */
  const obsOptions = { root: null, rootMargin: "0px 0px -80px 0px", threshold: 0.12 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');

        // if element contains progress bars, animate them
        entry.target.querySelectorAll('.progress-bar').forEach(pb => {
          const val = Number(pb.getAttribute('data-progress')) || 0;
          pb.style.width = val + '%';
        });

        obs.unobserve(entry.target);
      }
    });
  }, obsOptions);

  // observe all elements marked data-animate
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  /* ========= Smooth anchor scroll offset (if sticky header) ========= */
  // This adjusts scroll offset for links (so section isn't hidden behind sticky header)
  const headerHeight = document.querySelector('.site-header')?.offsetHeight || 60;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ========= Contact form via EmailJS ========= */
  // NOTE: Replace SERVICE_ID and TEMPLATE_ID with values from your EmailJS account.
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.textContent = 'Sending...';
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      // Use emailjs.sendForm to send the HTML form.
      // Replace "YOUR_SERVICE_ID" and "YOUR_TEMPLATE_ID" with real IDs.
      emailjs.sendForm('service_t8awwxb', 'template_yyrpgcv', contactForm, 'XOmOoZnePW11BwvjD')
      
        .then(() => {
          formStatus.textContent = 'Message sent! I will get back to you soon.';
          contactForm.reset();
          submitBtn.disabled = false;
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          formStatus.textContent = 'Oops — something went wrong. Try again later.';
          submitBtn.disabled = false;
        });
    });
  }

  /* ========= small accessibility helpers ========= */
  // Allow keyboard to open hamburger via Enter / Space
  hamburger.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      hamburger.click();
    }
  });
});