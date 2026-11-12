/* O'Neal Shockley portfolio: progressive enhancement. The page works without this file. */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Header: scrolled state, back-to-top ---------- */
  const header = $('[data-header]');
  const toTop = $('[data-to-top]');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    updateTimeline();
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $('[data-nav-toggle]');
  const panel = $('[data-nav-panel]');
  const toggleLabel = $('[data-nav-toggle-label]');
  const mqDesktop = window.matchMedia('(min-width: 900px)');

  function setMenu(open, { focusToggle = false } = {}) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = open ? 'Close menu' : 'Open menu';
    panel.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    if (open) { const first = $('a', panel); if (first) first.focus(); }
    else if (focusToggle) toggle.focus();
  }
  if (toggle) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, { focusToggle: true });
    });
    // Keep focus inside the open menu (toggle + panel links).
    header.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || toggle.getAttribute('aria-expanded') !== 'true') return;
      const items = [toggle, ...$$('a', panel)];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    mqDesktop.addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Active section highlighting ---------- */
  const navLinks = $$('[data-nav-link]');
  const sections = navLinks.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
      let best = null, bestRatio = 0;
      sections.forEach((s) => { const r = visible.get(s.id) || 0; if (r > bestRatio) { best = s.id; bestRatio = r; } });
      navLinks.forEach((a) => {
        const on = a.hash === '#' + best;
        a.classList.toggle('is-active', on);
        on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.01, 0.25, 0.5, 1] });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('[data-reveal]');
  const finishReveal = (el) => {
    el.classList.add('is-visible');
    // Hand control back to the element's own hover transitions once revealed.
    const delay = parseFloat(getComputedStyle(el).transitionDelay) || 0;
    setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('is-visible'); }, 900 + delay * 1000);
  };
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.removeAttribute('data-reveal'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { finishReveal(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Journey timeline progress ---------- */
  const tl = $('[data-timeline]');
  const fill = $('[data-timeline-fill]');
  const chapters = $$('.chapter');
  function updateTimeline() {
    if (!tl || !fill) return;
    const r = tl.getBoundingClientRect();
    const anchor = window.innerHeight * 0.55;
    const pct = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
    fill.style.height = (pct * 100).toFixed(2) + '%';
    let current = -1;
    chapters.forEach((ch, i) => { if (ch.getBoundingClientRect().top < anchor) current = i; });
    chapters.forEach((ch, i) => {
      ch.classList.toggle('is-current', i === current);
      ch.classList.toggle('is-past', i < current);
    });
  }
  requestAnimationFrame(onScroll);

  /* ---------- Case study dialogs ---------- */
  let lastTrigger = null;
  function openDialog(id, trigger) {
    const dlg = document.getElementById(id);
    if (!dlg || typeof dlg.showModal !== 'function') return false;
    lastTrigger = trigger || document.activeElement;
    if (!dlg.open) dlg.showModal();
    document.body.classList.add('is-locked');
    const body = $('.case-body', dlg); if (body) body.scrollTop = 0;
    const close = $('.case-close', dlg); if (close) close.focus();
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    return true;
  }
  $$('[data-dialog-open]').forEach((btn) => {
    btn.addEventListener('click', () => openDialog(btn.dataset.dialogOpen, btn));
  });
  $$('dialog.case').forEach((dlg) => {
    dlg.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      if (location.hash === '#' + dlg.id) history.replaceState(null, '', location.pathname + location.search);
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
    });
    // Click on the backdrop (outside the panel) closes.
    dlg.addEventListener('click', (e) => {
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside || e.target === dlg) dlg.close();
    });
    $$('[data-dialog-close]', dlg).forEach((b) => b.addEventListener('click', (e) => {
      const href = b.getAttribute('href');
      lastTrigger = null;
      dlg.close();
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
          const field = $('input:not([type=hidden]):not([name=bot-field])', target);
          if (field) setTimeout(() => field.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 600);
        }
      }
    }));
  });
  // Deep link: /#case-hilllife opens that case study.
  if (/^#case-[\w-]+$/.test(location.hash) && document.querySelector(location.hash)) {
    const id = location.hash.slice(1);
    const card = document.getElementById('project-' + id.replace(/^case-/, ''));
    if (card) card.scrollIntoView();
    openDialog(id, card && $('[data-dialog-open]', card));
  }

  /* ---------- Copy code ---------- */
  const copyStatus = $('[data-copy-status]');
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through */ }
    }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove(); return ok;
  }
  $$('[data-copy]').forEach((btn) => {
    const label = $('[data-copy-label]', btn);
    btn.addEventListener('click', async () => {
      const code = document.getElementById('code-' + btn.dataset.copy);
      if (!code) return;
      const ok = await copyText(code.textContent);
      label.textContent = ok ? 'Copied!' : 'Press Ctrl+C';
      btn.classList.toggle('is-copied', ok);
      if (copyStatus) copyStatus.textContent = ok ? 'Code copied to clipboard.' : 'Copy failed. Select the code and copy manually.';
      if (!ok) { const sel = getSelection(); const range = document.createRange(); range.selectNodeContents(code); sel.removeAllRanges(); sel.addRange(range); }
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { label.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 2000);
    });
  });

  /* ---------- GitHub feed ---------- */
  const feed = $('[data-gh-feed]');
  const ghStatus = $('[data-gh-status]');
  const cfgEl = document.getElementById('gh-config');
  const LANG = { JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#663399', Python: '#3572a5', Shell: '#89e051', Vue: '#41b883', 'Jupyter Notebook': '#da5b0b' };
  const escHtml = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ICON_GH = '<svg class="icon" aria-hidden="true"><use href="#i-github"/></svg>';
  const ICON_STAR = '<svg class="icon" aria-hidden="true"><use href="#i-star"/></svg>';

  function timeAgo(iso) {
    const d = new Date(iso); if (isNaN(d)) return '';
    const s = (Date.now() - d.getTime()) / 1000;
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [u, sec] of units) {
      const v = Math.floor(s / sec);
      if (v >= 1) return `${v} ${u}${v > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  }
  function renderRepos(repos) {
    feed.innerHTML = repos.map((r) => `
      <li class="card card--hover repo">
        <a class="repo-link" href="${escHtml(r.html_url)}" target="_blank" rel="noopener noreferrer"><span class="repo-name">${ICON_GH}${escHtml(r.name)}</span><span class="visually-hidden"> (opens in a new tab)</span></a>
        <p class="repo-desc">${escHtml(r.description || 'No description yet.')}</p>
        <p class="repo-meta">
          ${r.language ? `<span><span class="lang-dot" style="--lang:${LANG[r.language] || 'var(--accent)'}" aria-hidden="true"></span>${escHtml(r.language)}</span>` : ''}
          ${r.stargazers_count ? `<span>${ICON_STAR}<span class="visually-hidden">Stars: </span>${r.stargazers_count}</span>` : ''}
          <span>Updated ${escHtml(timeAgo(r.pushed_at))}</span>
        </p>
      </li>`).join('');
    feed.setAttribute('aria-busy', 'false');
  }
  function setGhStatus(text, live) {
    if (!ghStatus) return;
    ghStatus.textContent = text;
    ghStatus.classList.toggle('is-live', !!live);
  }

  async function loadGitHub() {
    let cfg;
    try { cfg = JSON.parse(cfgEl.textContent); } catch { return; }
    const CACHE_KEY = 'gh-repos-v1';
    const TTL = 60 * 60 * 1000;
    const hide = new Set((cfg.hide || []).map((s) => s.toLowerCase()));
    const pick = (list) => list
      .filter((r) => !r.fork && !r.archived && !hide.has(String(r.name).toLowerCase()))
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, cfg.count);

    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.t < TTL && cached.repos.length) {
        renderRepos(cached.repos); setGhStatus('Live from the GitHub API', true); return;
      }
    } catch { /* storage unavailable */ }

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cfg.user)}/repos?sort=pushed&per_page=40`, {
        headers: { Accept: 'application/vnd.github+json' }, signal: ctrl.signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const repos = pick(await res.json());
      if (!repos.length) throw new Error('empty');
      renderRepos(repos);
      setGhStatus('Live from the GitHub API', true);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), repos })); } catch { /* ignore */ }
    } catch {
      // Graceful fallback: never leave the skeleton spinning.
      renderRepos(pick(cfg.snapshot || []));
      setGhStatus(cfg.snapshotLive ? 'Showing a recent snapshot (GitHub is busy right now)' : 'Showing highlights. Visit GitHub for the latest', false);
    } finally {
      clearTimeout(timer);
    }
  }
  if (feed && cfgEl) {
    if ('IntersectionObserver' in window) {
      const gio = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { gio.disconnect(); loadGitHub(); }
      }, { rootMargin: '600px 0px' });
      gio.observe(feed);
    } else { loadGitHub(); }
  }

  /* ---------- Contact form (Netlify Forms via AJAX, falls back to normal POST) ---------- */
  const form = $('[data-contact-form]');
  if (form) {
    form.noValidate = true;
    const status = $('[data-form-status]', form);
    const submit = $('[data-submit]', form);
    const submitLabel = $('[data-submit-label]', form);
    const fields = $$('input:not([type=hidden]):not([name=bot-field]), select, textarea', form);
    const ICON_OK = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
    const ICON_ERR = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';

    const messageFor = (el) => {
      const v = el.validity;
      const label = (form.querySelector(`label[for="${el.id}"]`)?.firstChild?.textContent || 'This field').trim();
      if (v.valueMissing) return el.tagName === 'SELECT' ? `Please choose a ${label.toLowerCase()}.` : `Please enter ${label.toLowerCase()}.`;
      if (v.typeMismatch && el.type === 'email') return 'Please enter a valid email address, like name@company.com.';
      if (v.tooShort) return `Please add a little more detail (at least ${el.minLength} characters).`;
      if (v.tooLong) return `Please keep this under ${el.maxLength} characters.`;
      return '';
    };
    const validate = (el) => {
      if (el.type === 'email') el.value = el.value.trim();
      const msg = el.checkValidity() ? '' : messageFor(el);
      const err = document.getElementById(el.id + '-error');
      if (err) err.textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };
    fields.forEach((el) => {
      el.addEventListener('blur', () => { if (el.value || el.getAttribute('aria-invalid') === 'true') validate(el); });
      el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validate(el); });
      el.addEventListener('change', () => { if (el.getAttribute('aria-invalid') === 'true') validate(el); });
    });

    const showStatus = (type, msg) => {
      status.className = 'form-status is-' + type;
      status.innerHTML = (type === 'success' ? ICON_OK : ICON_ERR) + `<span>${msg}</span>`;
      status.focus({ preventScroll: true });
      status.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form-status'; status.textContent = '';
      const invalid = fields.filter((el) => !validate(el));
      if (invalid.length) { invalid[0].focus(); return; }

      submit.disabled = true; submit.classList.add('is-loading');
      const original = submitLabel.textContent; submitLabel.textContent = 'Sending…';
      try {
        const body = new URLSearchParams(new FormData(form)).toString();
        const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        fields.forEach((el) => el.removeAttribute('aria-invalid'));
        showStatus('success', escHtml(status.dataset.success));
      } catch {
        const msg = escHtml(status.dataset.errorMsg).replace(/([\w.+-]+@[\w-]+\.[\w.]+)/, '<a href="mailto:$1">$1</a>');
        showStatus('error', msg);
      } finally {
        submit.disabled = false; submit.classList.remove('is-loading'); submitLabel.textContent = original;
      }
    });
  }
})();
