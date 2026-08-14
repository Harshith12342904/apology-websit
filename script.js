/**
 * Apology Website - Page Transitions, Letter Scrolling & Decision Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initNavigation();
  initScrollAnimations();
  initReadingProgressBar();
  initDecisionButtons();
  initMicroInteractions();
});

/* ==========================================================================
   Ambient Falling Sakura Petals
   ========================================================================== */
function initPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const PETAL_COUNT = 15;
  const colors = ['#fcd5dc', '#fadbe2', '#f6c3ce', '#fedae2'];

  for (let i = 0; i < PETAL_COUNT; i++) {
    createPetal(container, colors, i * 400);
  }
}

function createPetal(container, colors, delay = 0) {
  const petal = document.createElement('div');
  petal.className = 'falling-petal';

  const size = Math.random() * 10 + 10; // 10px - 20px
  const startLeft = Math.random() * 100; // 0 - 100vw
  const duration = Math.random() * 8 + 9; // 9s - 17s
  const color = colors[Math.floor(Math.random() * colors.length)];
  const opacity = Math.random() * 0.4 + 0.35;

  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.3}px`;
  petal.style.left = `${startLeft}vw`;
  petal.style.background = `linear-gradient(135deg, ${color}, #ffffff)`;
  petal.style.opacity = opacity;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}ms`;

  container.appendChild(petal);

  petal.addEventListener('animationiteration', () => {
    petal.style.left = `${Math.random() * 100}vw`;
  });
}

/* ==========================================================================
   Page Transitions & Navigation
   ========================================================================== */
function initNavigation() {
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const btnNext = document.getElementById('btn-to-page-2');
  const btnBack = document.getElementById('btn-back-to-1');
  const progressBar = document.getElementById('reading-progress-bar');

  if (btnNext && page1 && page2) {
    btnNext.addEventListener('click', () => {
      // Transition from Page 1 to Page 2
      page1.classList.remove('active');
      page1.classList.add('slide-out-left');
      document.body.classList.add('on-page-2');

      setTimeout(() => {
        page1.style.display = 'none';
        page1.classList.remove('slide-out-left');

        page2.style.display = 'block';
        if (progressBar) progressBar.style.display = 'block';
        
        // Trigger reflow
        void page2.offsetWidth;
        page2.classList.add('active', 'slide-in-right');

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger reveal on the visible initial elements
        checkInitialScroll();
      }, 350);
    });
  }

  if (btnBack && page1 && page2) {
    btnBack.addEventListener('click', () => {
      // Transition back from Page 2 to Page 1
      page2.classList.remove('active', 'slide-in-right');
      document.body.classList.remove('on-page-2');
      if (progressBar) progressBar.style.display = 'none';

      setTimeout(() => {
        page2.style.display = 'none';
        page1.style.display = 'block';
        void page1.offsetWidth;
        page1.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    });
  }
}

/* ==========================================================================
   Scroll Reveal with IntersectionObserver
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
}

function checkInitialScroll() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add('is-visible');
    }
  });
}

/* ==========================================================================
   Reading Progress Bar
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const page2 = document.getElementById('page-2');
    if (!page2 || page2.style.display === 'none') return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  });
}

/* ==========================================================================
   Decision Buttons & Response Handlers
   ========================================================================== */
function initDecisionButtons() {
  const btnForgive = document.getElementById('btn-forgive');
  const btnNotReady = document.getElementById('btn-not-ready');
  const responseBox = document.getElementById('response-box');

  if (!btnForgive || !btnNotReady || !responseBox) return;

  // Option A: "I Forgive You"
  btnForgive.addEventListener('click', () => {
    btnForgive.classList.add('btn-chosen');
    btnForgive.disabled = true;
    btnNotReady.disabled = true;
    btnNotReady.style.opacity = '0.5';

    responseBox.className = 'response-message-box response-forgive';
    responseBox.innerHTML = `
      <h3 class="resp-title">Thank you so much... 🌸</h3>
      <p class="resp-p">It took me two days to make this, and I really hoped you'd read it.</p>
      <p class="resp-p">If you really do forgive me, please call me and let me know.</p>
      <p class="resp-p resp-call-emphasis">I'd really like to talk to you again.</p>
    `;

    void responseBox.offsetWidth;
    responseBox.classList.add('revealed');

    // Smooth scroll to revealed response
    setTimeout(() => {
      responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  });

  // Option B: "I'm Not Ready Yet" (Respectful, stable, no guilt-tripping)
  btnNotReady.addEventListener('click', () => {
    btnNotReady.classList.add('btn-chosen');
    btnNotReady.disabled = true;
    btnForgive.disabled = true;
    btnForgive.style.opacity = '0.5';

    responseBox.className = 'response-message-box response-not-ready';
    responseBox.innerHTML = `
      <h3 class="resp-title">I understand... 🕊️</h3>
      <p class="resp-p">Take your time. You don't have to forgive me right now.</p>
      <p class="resp-p">Thank you for taking the time to read all of this.</p>
      <p class="resp-p">I'll respect your decision.</p>
      <p class="resp-p resp-call-emphasis">Take care, and goodbye.</p>
    `;

    void responseBox.offsetWidth;
    responseBox.classList.add('revealed');

    // Smooth scroll to revealed response
    setTimeout(() => {
      responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  });
}

/* ==========================================================================
   Micro Interactions
   ========================================================================== */
function initMicroInteractions() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, input')) return;
    spawnSparkle(e.clientX, e.clientY);
  });
}

function spawnSparkle(x, y) {
  const sparkle = document.createElement('span');
  sparkle.innerText = '🌸';
  sparkle.style.position = 'fixed';
  sparkle.style.left = `${x - 10}px`;
  sparkle.style.top = `${y - 10}px`;
  sparkle.style.pointerEvents = 'none';
  sparkle.style.fontSize = '18px';
  sparkle.style.zIndex = '9999';
  sparkle.style.opacity = '1';
  sparkle.style.transform = 'scale(0.5) translateY(0)';
  sparkle.style.transition = 'all 0.8s cubic-bezier(0.2, 0.9, 0.3, 1)';

  document.body.appendChild(sparkle);

  requestAnimationFrame(() => {
    sparkle.style.transform = `scale(1.2) translateY(-25px) rotate(${Math.random() * 40 - 20}deg)`;
    sparkle.style.opacity = '0';
  });

  setTimeout(() => {
    sparkle.remove();
  }, 850);
}
