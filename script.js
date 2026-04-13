/* ============================================
   STUDIO Portfolio — JavaScript
   ============================================ */

(function () {
  'use strict';

  // ── Page Loader ──────────────────────────────
  window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
      loader.classList.add('page-loader--hidden');
    }, 800);
    setTimeout(() => {
      loader.remove();
    }, 1500);
  });

  // ── Custom Cursor ────────────────────────────
  const cursor = document.getElementById('cursor');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  const cursorSpeed = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * cursorSpeed;
    cursorY += (mouseY - cursorY) * cursorSpeed;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor light/dark
  const hero = document.getElementById('hero');
  const heroTransition = document.querySelector('.hero-transition');
  const goatFooter = document.getElementById('goatFooter');

  function updateCursorColor() {
    const heroRect = hero.getBoundingClientRect();
    const transRect = heroTransition ? heroTransition.getBoundingClientRect() : { top: 0, bottom: 0 };
    const goatRect = goatFooter ? goatFooter.getBoundingClientRect() : { top: 99999, bottom: 99999 };

    const isOnLight =
      (mouseY >= heroRect.top && mouseY <= heroRect.bottom) ||
      (heroTransition && mouseY >= transRect.top && mouseY <= transRect.bottom) ||
      (goatFooter && mouseY >= goatRect.top && mouseY <= goatRect.bottom);

    if (isOnLight) {
      cursor.classList.remove('cursor--light');
    } else {
      cursor.classList.add('cursor--light');
    }
  }

  document.addEventListener('mousemove', updateCursorColor);
  document.addEventListener('scroll', updateCursorColor, { passive: true });

  // Cursor hover + radial spotlight effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .location-tag');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
      el.classList.remove('cursor-spotlight');
    });
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
      el.classList.add('cursor-spotlight');
    });
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  // ── Floating Nav ─────────────────────────────
  const floatingNav = document.getElementById('floatingNav');
  const header = document.getElementById('header');

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          floatingNav.classList.add('floating-nav--visible');
          header.style.opacity = '0';
          header.style.pointerEvents = 'none';
        } else {
          floatingNav.classList.remove('floating-nav--visible');
          header.style.opacity = '1';
          header.style.pointerEvents = 'auto';
        }
      });
    },
    { threshold: 0.1 }
  );
  heroObserver.observe(hero);

  // ── Live Clock (Buenos Aires) ────────────────
  const headerTime = document.getElementById('headerTime');
  function updateClock() {
    if (!headerTime) return;
    const now = new Date();
    headerTime.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: 'America/Asuncion',
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── Asunción Paraguay Clock (Location Tag) ───
  const locationTime = document.getElementById('locationTime');
  function updateLocationClock() {
    const now = new Date();
    const t = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: 'America/Asuncion',
    });
    locationTime.textContent = t + ' PYT';
  }
  updateLocationClock();
  setInterval(updateLocationClock, 1000);


  // ── Scroll Reveal ────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.classList.add('reveal-stagger--visible');
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // ── Smooth Scroll ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });



  // ── Vertical Parallax ─────────
  function parallaxOnScroll() {
    const scrollY = window.scrollY;

    // Section-level parallax (about statement, bio)
    const parallaxSections = document.querySelectorAll('.about__statement, .bio-full__main');
    parallaxSections.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.top < windowH && rect.bottom > 0) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const offset = (progress - 0.5) * -15;
        el.style.transform = `translateY(${offset}px)`;
      }
    });

    requestAnimationFrame(parallaxOnScroll);
  }
  parallaxOnScroll();

  // ── Header transition ────────────────────────
  const headerEl = document.querySelector('.header');
  function updateHeaderTransition() {
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom < 80) {
      headerEl.style.transition = 'opacity 0.4s ease';
    }
  }
  window.addEventListener('scroll', updateHeaderTransition, { passive: true });

  // ══════════════════════════════════════════════
  // ── GOAT PARTICLE EFFECT (Image-based Mask) ──
  // ══════════════════════════════════════════════
  const canvas = document.getElementById('goatCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    let particles = [];
    let goatMouse = { x: -9999, y: -9999 };

    // Physics constants from Processing
    const DOT_COUNT = 4500;
    const DOT_MIN = 1.2;
    const DOT_MAX = 3.2;
    const RETURN_FORCE = 0.06;
    const DAMPING = 0.88;
    const MOUSE_RADIUS = 40;
    const MOUSE_FORCE = 2.2;
    const NOISE_SPEED = 0.008;
    const NOISE_AMT = 10;

    let maskImgLoaded = false;
    const maskImg = new Image();
    maskImg.src = 'assets/goat.png'; // Make sure to save the goat shape here!

    maskImg.onload = () => {
      maskImgLoaded = true;
      resizeCanvas();
    };

    maskImg.onerror = () => {
      // Fallback fallback if image is missing
      console.warn("Image could not be loaded, using fallback path.");
      maskImgLoaded = false;
      resizeCanvas();
    };

    // Fallback data
    const fallbackPath = [
      [0.30, 0.80], [0.35, 0.85], [0.40, 0.87], [0.45, 0.88], [0.50, 0.88], [0.55, 0.87], [0.60, 0.85], [0.65, 0.82],
      [0.62, 0.90], [0.63, 0.95], [0.64, 1.00], [0.58, 0.90], [0.57, 0.95], [0.56, 1.00],
      [0.35, 0.88], [0.34, 0.93], [0.33, 1.00], [0.29, 0.85], [0.28, 0.93], [0.27, 1.00],
      [0.65, 0.75], [0.63, 0.70], [0.60, 0.65], [0.55, 0.62], [0.50, 0.60], [0.45, 0.58], [0.40, 0.58], [0.35, 0.60], [0.30, 0.63], [0.28, 0.68], [0.25, 0.70],
      [0.23, 0.65], [0.21, 0.58], [0.20, 0.52], [0.19, 0.46],
      [0.18, 0.42], [0.16, 0.40], [0.14, 0.39], [0.13, 0.40], [0.12, 0.42], [0.13, 0.44], [0.15, 0.45], [0.17, 0.46], [0.19, 0.48],
      [0.15, 0.36], [0.14, 0.32], [0.15, 0.28], [0.18, 0.38], [0.19, 0.34], [0.21, 0.30],
      [0.17, 0.40], [0.19, 0.38],
      [0.67, 0.72], [0.70, 0.68], [0.72, 0.65], [0.73, 0.62],
      [0.13, 0.46], [0.12, 0.50], [0.11, 0.53]
    ];

    function createParticle(x, y) {
      let color = '#191919';
      if (Math.random() < 0.03) {
        color = `rgb(${100+Math.random()*155},${50+Math.random()*70},${50+Math.random()*70})`;
      }
      return {
        homeX: x, homeY: y, x: x, y: y,
        vx: 0, vy: 0, radius: DOT_MIN + Math.random() * (DOT_MAX - DOT_MIN),
        color: color, seed: Math.random() * 1000
      };
    }

    function generateGoatParticles() {
      particles = [];
      const cw = canvas.width;
      const ch = canvas.height;

      if (!maskImgLoaded) {
        // Fallback drawing logic
        const goatW = Math.min(cw * 0.35, 220);
        const goatH = goatW * 1.1;
        const offsetX = (cw - goatW) / 2;
        const offsetY = (ch - goatH) / 2 - 10;
        
        fallbackPath.forEach(([nx, ny]) => {
          const x = offsetX + nx * goatW;
          const y = offsetY + ny * goatH;
          particles.push(createParticle(x, y));
          for (let j = 0; j < 3; j++) {
            particles.push(createParticle(x + (Math.random() - 0.5) * 8, y + (Math.random() - 0.5) * 8));
          }
        });
        
        const bodyBounds = { xMin: offsetX + 0.2*goatW, xMax: offsetX + 0.68*goatW, yMin: offsetY + 0.4*goatH, yMax: offsetY + 0.9*goatH };
        for (let i = 0; i < 400; i++) {
          const x = bodyBounds.xMin + Math.random() * (bodyBounds.xMax - bodyBounds.xMin);
          const y = bodyBounds.yMin + Math.random() * (bodyBounds.yMax - bodyBounds.yMin);
          const nx = (x - offsetX) / goatW;
          const ny = (y - offsetY) / goatH;
          let inside = false;
          if (nx >= 0.25 && nx <= 0.65 && ny >= 0.55 && ny <= 0.88) {
            const topCurve = 0.58 + (nx - 0.45) * (nx - 0.45) * 2;
            const bottomCurve = 0.88 - Math.abs(nx - 0.47) * 0.08;
            inside = ny >= topCurve && ny <= bottomCurve;
          }
          if (nx >= 0.18 && nx <= 0.28 && ny >= 0.42 && ny <= 0.70) inside = true;
          if (inside) particles.push(createParticle(x, y));
        }
        return;
      }

      const goatScale = 0.28;

      // Draw mask to offscreen canvas to read pixels
      const offCanvas = document.createElement('canvas');
      offCanvas.width = maskImg.width;
      offCanvas.height = maskImg.height;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      offCtx.drawImage(maskImg, 0, 0);

      let imgData;
      try {
        imgData = offCtx.getImageData(0, 0, maskImg.width, maskImg.height).data;
      } catch (e) {
        console.warn("Could not read image data (CORS issue?). Running without particles.");
        maskImgLoaded = false;
        generateGoatParticles(); // Call again for fallback
        return;
      }

      const goatOffsetX = cw * 0.5;
      const goatOffsetY = ch * 0.5;

      let tries = 0;
      const maxTries = DOT_COUNT * 50;

      while (particles.length < DOT_COUNT && tries < maxTries) {
        tries++;
        const x = Math.floor(Math.random() * maskImg.width);
        const y = Math.floor(Math.random() * maskImg.height);
        
        // Index in 1D pixel array: (y * width + x) * 4 for RGBA
        const i = (y * maskImg.width + x) * 4;
        
        // Assuming goat is dark on light background. b = roughly luminance
        const r = imgData[i];
        const g = imgData[i+1];
        const b = imgData[i+2];
        const brightness = (r + g + b) / 3;

        if (brightness < 80) { // Belongs to goat
          const sx = (x - maskImg.width / 2) * goatScale + goatOffsetX;
          const sy = (y - maskImg.height / 2) * goatScale + goatOffsetY;
          
          const radius = DOT_MIN + Math.random() * (DOT_MAX - DOT_MIN);
          
          // Blancos y grises claros para el Dark Mode
          const gray = Math.floor(180 + Math.random() * 75);
          const alpha = 0.5 + Math.random() * 0.5;
          let color = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;

          particles.push({
            homeX: sx,
            homeY: sy,
            x: sx,
            y: sy,
            vx: 0,
            vy: 0,
            radius: radius,
            color: color,
            seed: Math.random() * 1000
          });
        }
      }
    }

    function resizeCanvas() {
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      generateGoatParticles();
    }

    wrap.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      goatMouse.x = e.clientX - rect.left;
      goatMouse.y = e.clientY - rect.top;
    });

    wrap.addEventListener('mouseleave', () => {
      goatMouse.x = -9999;
      goatMouse.y = -9999;
    });

    // We can use a simple pseudo-random noise approx based on sine waves
    function getNoise(seed, time) {
      const n1 = Math.sin(seed * 43.12 + time * 0.8) * Math.cos(seed * 73.12 + time * 0.9);
      const n2 = Math.cos(seed * 23.45 - time * 0.7) * Math.sin(seed * 83.45 + time);
      return (n1 + n2); // loosely between -2 and 2
    }

    let frameCount = 0;

    function animateGoat() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;
      const t = frameCount * NOISE_SPEED;

      particles.forEach((p) => {
        // 1) Organic movement with pseudo-noise
        const nx = getNoise(p.seed, t);
        const ny = getNoise(p.seed + 999, t);
        const noiseVecX = nx * NOISE_AMT * 0.02;
        const noiseVecY = ny * NOISE_AMT * 0.02;

        // 2) Return force to origin (spring)
        const toOriginX = (p.homeX - p.x) * RETURN_FORCE;
        const toOriginY = (p.homeY - p.y) * RETURN_FORCE;

        // 3) Mouse repulsion
        const dx = p.x - goatMouse.x;
        const dy = p.y - goatMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let repelX = 0;
        let repelY = 0;

        if (dist > 0 && dist < MOUSE_RADIUS) {
          let strength = 1 - (dist / MOUSE_RADIUS);
          strength = strength * strength; // smooth curve
          const force = strength * MOUSE_FORCE * 12;
          repelX = (dx / dist) * force;
          repelY = (dy / dist) * force;
        }

        // 4) Add forces
        p.vx += noiseVecX + toOriginX + repelX;
        p.vy += noiseVecY + toOriginY + repelY;

        // 5) Damping / Friction
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // 6) Integrate position
        p.x += p.vx;
        p.y += p.vy;

        // 7) Render
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animateGoat);
    }

    resizeCanvas();
    animateGoat();

    window.addEventListener('resize', resizeCanvas);
  }

})();
