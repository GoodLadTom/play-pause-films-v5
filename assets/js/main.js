/* =================================================================
   PLAY PAUSE FILMS — v2  ·  interactions
   Vanilla JS, no dependencies. Loaded with `defer`.
   ================================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData     = navigator.connection && navigator.connection.saveData;
  const canAutoplay  = !reduceMotion && !saveData;

  /* ---------- Footer year ---------- */
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Live timecode (HH:MM:SS:FF @ 24fps) ---------- */
  (() => {
    const nodes = $$('[data-timecode]');
    if (!nodes.length) return;
    const FPS = 24;
    const pad = n => String(n).padStart(2, '0');
    const start = performance.now();
    let last = '';
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      const frames = Math.floor(t * FPS);
      const ff = frames % FPS;
      const s  = Math.floor(t) % 60;
      const m  = Math.floor(t / 60) % 60;
      const h  = Math.floor(t / 3600) % 24;
      const str = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(ff)}`;
      if (str !== last) { last = str; nodes.forEach(n => (n.textContent = str)); }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })();

  /* ---------- Header stuck state + scroll progress ---------- */
  (() => {
    const header = $('[data-header]');
    const fill   = $('.scrollbar__fill');
    const onScroll = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle('is-stuck', y > 24);
      if (fill) {
        const h = document.documentElement.scrollHeight - innerHeight;
        fill.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Mobile navigation ---------- */
  (() => {
    const toggle = $('.menu-toggle');
    const nav    = $('[data-mobile-nav]');
    if (!toggle || !nav) return;
    const setOpen = open => {
      nav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);
    };
    toggle.addEventListener('click', () => setOpen(nav.hidden));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !nav.hidden) setOpen(false); });
  })();

  /* ---------- Reveal on scroll + active nav link ---------- */
  (() => {
    const revealEls = $$('[data-reveal]');
    if ('IntersectionObserver' in window && !reduceMotion) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // Active nav highlight
    const sections = $$('main section[id]');
    const links = new Map($$('.nav a').map(a => [a.getAttribute('href').slice(1), a]));
    if ('IntersectionObserver' in window && links.size) {
      const sio = new IntersectionObserver(entries => {
        entries.forEach(en => {
          const a = links.get(en.target.id);
          if (a && en.isIntersecting) {
            links.forEach(l => l.classList.remove('is-active'));
            a.classList.add('is-active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(s => sio.observe(s));
    }
  })();

  /* ---------- Hero background video (deferred, adaptive) ---------- */
  (() => {
    const v = $('[data-hero-video]');
    if (!v || !canAutoplay) return;
    const load = () => {
      const wide = innerWidth >= 768;
      v.src = wide ? v.dataset.src720 : v.dataset.src360;
      v.load();
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
      v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
    };
    if (document.readyState === 'complete') requestIdleCallbackSafe(load);
    else addEventListener('load', () => requestIdleCallbackSafe(load), { once: true });
  })();

  /* ---------- Lazy clip videos: play in view / on hover, pause when out ---------- */
  (() => {
    const wraps = $$('[data-video]');
    if (!wraps.length) return;

    const ensure = v => {
      if (v.src) return;
      const src = (v.dataset.src720 || v.dataset.src360)
        ? (innerWidth >= 768 ? (v.dataset.src720 || v.dataset.src360) : (v.dataset.src360 || v.dataset.src720))
        : v.dataset.src;
      if (src) { v.src = src; v.load(); }
    };
    const play = v => { ensure(v); const p = v.play(); if (p && p.catch) p.catch(() => {}); };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          const v = en.target.querySelector('video');
          if (!v) return;
          if (en.isIntersecting && canAutoplay) play(v);
          else if (!v.paused) v.pause();
        });
      }, { threshold: 0.35 });
      wraps.forEach(w => io.observe(w));
    }

    // Desktop hover always offers playback (even under reduced data)
    wraps.forEach(w => {
      const v = w.querySelector('video');
      if (!v) return;
      w.addEventListener('pointerenter', () => play(v));
      w.addEventListener('pointerleave', () => { if (!canAutoplay && !v.paused) v.pause(); });
    });
  })();

  /* ---------- YouTube thumbnails: upgrade to maxres if available ---------- */
  (() => {
    $$('.film__thumb[data-hq]').forEach(img => {
      const probe = new Image();
      probe.onload = () => { if (probe.naturalWidth >= 1000) img.src = img.dataset.hq; };
      probe.src = img.dataset.hq;
    });
  })();

  /* ---------- YouTube click-to-load facade (privacy + performance) ---------- */
  (() => {
    $$('.film[data-yt]').forEach(film => {
      const btn = film.querySelector('.film__btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const id = film.dataset.yt;
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
        iframe.title = 'Play Pause Films — featured film';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        btn.replaceWith(iframe);
      });
    });
  })();

  /* ---------- Brand marquee: duplicate sequence for a seamless loop ---------- */
  (() => {
    $$('[data-marquee]').forEach(m => {
      const track = m.querySelector('.marquee__track');
      const seq = m.querySelector('.marquee__seq');
      if (!track || !seq) return;
      const clone = seq.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
      m.classList.add('is-ready');
    });
  })();

  /* ---------- Lightbox ---------- */
  (() => {
    const modal = $('[data-lightbox-modal]');
    if (!modal) return;
    const img   = $('.lightbox__img', modal);
    const cap   = $('[data-lightbox-caption]', modal);
    const closeBtn = $('.lightbox__close', modal);
    let opener = null;

    const open = (src, caption, alt) => {
      img.src = src; img.alt = alt || caption || '';
      cap.textContent = caption || '';
      modal.hidden = false; modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    };
    const close = () => {
      modal.hidden = true; modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      img.src = '';
      if (opener) opener.focus();
    };

    $$('[data-lightbox]').forEach(btn => {
      btn.addEventListener('click', () => {
        opener = btn;
        const innerImg = btn.querySelector('img');
        open(btn.dataset.src, btn.dataset.caption, innerImg && innerImg.alt);
      });
    });
    $$('[data-lightbox-close]', modal).forEach(el => el.addEventListener('click', close));
    addEventListener('keydown', e => {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); } // single-stop focus trap
    });
  })();

  /* ---------- helper ---------- */
  function requestIdleCallbackSafe(fn) {
    ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 600);
  }
})();
