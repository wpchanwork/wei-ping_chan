/* ============================================================
   Holo card controller — see holo.css.
   Any element with [data-holo] tilts toward the pointer and its
   foil/glare layers track it. Movement is spring-smoothed, and each
   card plays one "flash" sweep the first time it scrolls into view
   so the effect is discoverable on touch screens too.
   Options (data attributes):
     data-holo-max="10"   maximum tilt in degrees (default 9)
   ============================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { window.Holo = { init() {} }; return; }

  const lerp = (a, b, t) => a + (b - a) * t;

  function attach(el) {
    const max = parseFloat(el.dataset.holoMax || '9');
    const cur = { x: 50, y: 50, o: 0 };
    let target = { x: 50, y: 50, o: 0 };
    let raf = 0, sweeping = false;

    function frame() {
      cur.x = lerp(cur.x, target.x, .16);
      cur.y = lerp(cur.y, target.y, .16);
      cur.o = lerp(cur.o, target.o, .12);
      el.style.setProperty('--px', cur.x.toFixed(2) + '%');
      el.style.setProperty('--py', cur.y.toFixed(2) + '%');
      el.style.setProperty('--o', cur.o.toFixed(3));
      el.style.setProperty('--rx', (((cur.x - 50) / 50) * max * cur.o).toFixed(2) + 'deg');
      el.style.setProperty('--ry', (((50 - cur.y) / 50) * max * cur.o).toFixed(2) + 'deg');
      const settled = Math.abs(cur.x - target.x) < .05 && Math.abs(cur.y - target.y) < .05 && Math.abs(cur.o - target.o) < .002;
      raf = settled ? 0 : requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    el.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || sweeping) return; // let touch scroll normally
      const r = el.getBoundingClientRect();
      target = {
        x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
        y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
        o: 1
      };
      el.classList.remove('is-resting');
      kick();
    });
    el.addEventListener('pointerleave', () => {
      target = { x: 50, y: 50, o: 0 };
      el.classList.add('is-resting');
      kick();
    });

    // One-shot flash when first visible: sweep the light across the card.
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      sweeping = true;
      const start = performance.now(), dur = 1400;
      (function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const ease = 1 - Math.pow(1 - t, 3);
        target = { x: 10 + 80 * ease, y: 30 + 40 * ease, o: Math.sin(Math.PI * t) * .85 };
        kick();
        if (t < 1) requestAnimationFrame(step);
        else { sweeping = false; target = { x: 50, y: 50, o: 0 }; kick(); }
      })(start);
    }, { threshold: .45 });
    io.observe(el);
  }

  function init(root) { (root || document).querySelectorAll('[data-holo]:not([data-holo-ready])').forEach(el => { el.dataset.holoReady = '1'; attach(el); }); }
  window.Holo = { init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
