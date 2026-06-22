// feature.js — UI enhancements for AI Pulse
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // 1) Smooth scroll for same-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
      });
    });

    // 2) Mark images for lazy loading and small perf improvements
    document.querySelectorAll('img').forEach(img => {
      try { img.loading = 'lazy'; } catch (e) {}
      img.decoding = 'async';
    });

    // 3) Reveal-on-scroll animations
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          obs.unobserve(en.target);
        }
      });
    }, {threshold: 0.12});

    document.querySelectorAll('.post-card, .feature, .hero-right img, .stat').forEach(el => revealObserver.observe(el));

    // 4) Subscribe form handling (store email and show toast)
    function showToast(msg, timeout = 2600){
      const t = document.createElement('div');
      t.className = 'site-toast';
      t.textContent = msg;
      document.body.appendChild(t);
      requestAnimationFrame(()=> t.classList.add('visible'));
      setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=> t.remove(),300); }, timeout);
    }

    document.querySelectorAll('.subscribe-form, .search-subscribe').forEach(form => {
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input) return showToast('No email field found');
        const email = (input.value || '').trim();
        if (!email || !email.includes('@')) return showToast('Please enter a valid email');
        localStorage.setItem('ai_pulse_subscriber', email);
        showToast('Thanks — subscription saved');
        form.reset();
      });
    });

    // 5) Theme toggle sync (keeps the button icon in sync)
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn){
      const setIcon = () => {
        const theme = document.documentElement.getAttribute('data-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌓';
      };
      themeBtn.addEventListener('click', () => { setTimeout(setIcon, 80); });
      setIcon();
    }

    // 6) Small accessibility helper: focus visible outlines for keyboard users
    function handleFirstTab(e){
      if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
    }
    window.addEventListener('keydown', handleFirstTab, {once:true});

    // 7) Append minimal styles for animations/toast (uses CSS variables from main sheet)
    const injected = document.createElement('style');
    injected.textContent = `
      .post-card, .feature { transform: translateY(10px); opacity: 0; transition: all 540ms cubic-bezier(.2,.9,.2,1); }
      .post-card.is-visible, .feature.is-visible { transform: none; opacity: 1; }
      .site-toast{ position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%) translateY(14px); background: var(--card); color: var(--text); padding: 10px 14px; border-radius: 10px; box-shadow: 0 8px 20px rgba(2,6,23,0.12); opacity: 0; transition: all 240ms ease; z-index:9999; }
      .site-toast.visible{ opacity: 1; transform: translateX(-50%) translateY(0); }
      :root.user-is-tabbing button:focus, :root.user-is-tabbing a:focus, :root.user-is-tabbing input:focus{ outline: 3px solid rgba(91,124,255,0.18); outline-offset: 3px; }
    `;
    document.head.appendChild(injected);
  });
})();
