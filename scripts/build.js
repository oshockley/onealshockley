#!/usr/bin/env node
/* ==========================================================================
   Static site builder: zero dependencies, runs on Netlify automatically.
   Reads src/content.js, renders HTML, and writes everything to dist/.
     node scripts/build.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ICONS = require('./icons');
const { highlight } = require('./highlight');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

// Re-require content fresh each build (dev server rebuilds in-process).
function loadContent() {
  const p = path.join(SRC, 'content.js');
  delete require.cache[require.resolve(p)];
  return require(p);
}

/* ---------- helpers ---------- */
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const join = (arr, fn) => arr.map(fn).join('');
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Icons are emitted once as <symbol>s in a sprite and referenced with <use>,
// so repeated logos don't bloat the HTML.
const usedIcons = new Set();
function icon(name, cls = '') {
  if (!ICONS.brand[name] && !ICONS.ui[name]) return '';
  usedIcons.add(name);
  return `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
}
function iconSprite() {
  const syms = [...usedIcons].map((n) => ICONS.brand[n]
    ? `<symbol id="i-${n}" viewBox="0 0 24 24"><path fill="currentColor" d="${ICONS.brand[n].path}"/></symbol>`
    : `<symbol id="i-${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICONS.ui[n]}</symbol>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${syms}</svg>`;
}
const brandTitle = (s) => (ICONS.brand[s] ? ICONS.brand[s].title : s);

// A tech tag: brand slug -> logo + official name; anything else -> plain text.
function tag(item) {
  return `<li class="tag">${icon(item)}${esc(brandTitle(item))}</li>`;
}
const tags = (items, cls = '') => `<ul class="tags${cls ? ' ' + cls : ''}" aria-label="Technologies">${join(items, tag)}</ul>`;

const hashCache = new Map();
function assetHash(rel) {
  if (hashCache.has(rel)) return hashCache.get(rel);
  const file = path.join(SRC, rel.replace(/^\//, ''));
  let h = '';
  try { h = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8); } catch { /* missing file: no hash */ }
  hashCache.set(rel, h);
  return h;
}
// Append ?v=<hash> to every /assets/... reference so files can be cached forever.
function versionAssets(html) {
  return html.replace(/(\/assets\/[\w\-./]+\.(?:woff2|webp|jpg|jpeg|png|svg|gif|avif))(?![\w?])/g, (m) => {
    const h = assetHash(m);
    return h ? `${m}?v=${h}` : m;
  });
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name), b = path.join(to, entry.name);
    entry.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}

/* ---------- GitHub snapshot (build time) ---------- */
async function fetchGitHub(C) {
  const headers = { 'User-Agent': 'portfolio-build', Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const get = async (url) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch(url, { headers, signal: ctrl.signal });
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return await r.json();
    } finally { clearTimeout(t); }
  };
  const result = { repoCount: C.reposFallback, repos: C.github.fallbackRepos, live: false };
  if (process.env.SKIP_GITHUB) return result;
  try {
    const [user, repos] = await Promise.all([
      get(`https://api.github.com/users/${C.githubUsername}`),
      get(`https://api.github.com/users/${C.githubUsername}/repos?sort=pushed&per_page=40`),
    ]);
    if (typeof user.public_repos === 'number') result.repoCount = user.public_repos;
    const picked = filterRepos(repos, C);
    if (picked.length) result.repos = picked;
    result.live = true;
  } catch (e) {
    console.warn(`  ! GitHub API unavailable at build (${e.message}). Using fallback data.`);
  }
  return result;
}
function filterRepos(repos, C) {
  const hide = new Set(C.github.hideRepos.map((s) => s.toLowerCase()));
  return repos
    .filter((r) => !r.fork && !r.archived && !hide.has(r.name.toLowerCase()))
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, C.github.count)
    .map(({ name, description, language, html_url, stargazers_count, forks_count, pushed_at }) => ({
      name, description, language, html_url, stargazers_count, forks_count, pushed_at,
    }));
}

/* ==========================================================================
   SECTIONS
   ========================================================================== */
function sectionHead(num, eyebrow, heading, lead, id) {
  return `
      <header class="section-head" data-reveal>
        <p class="eyebrow"><span class="eyebrow-num">${num}</span>${esc(eyebrow)}</p>
        <h2 class="section-title" id="${id}-title">${esc(heading)}</h2>
        ${lead ? `<p class="section-lead">${esc(lead)}</p>` : ''}
      </header>`;
}

function renderNav(C, links) {
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <nav class="nav container" aria-label="Primary">
      <a class="brand" href="#top">
        <span class="brand-mark" aria-hidden="true">OS</span>
        <span class="brand-name">${esc(C.person.name)}</span>
      </a>
      <div class="nav-panel" id="nav-panel" data-nav-panel>
        <ul class="nav-links" role="list">
          ${join(links, (l) => `<li><a class="nav-link" href="#${l.id}" data-nav-link>${esc(l.label)}</a></li>`)}
        </ul>
        <a class="btn btn--primary btn--sm nav-cta" href="#contact">${esc(C.cta.primary)}</a>
      </div>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-panel" data-nav-toggle>
        <span class="visually-hidden" data-nav-toggle-label>Open menu</span>
        <span class="nav-toggle-bars" aria-hidden="true"><span></span><span></span></span>
      </button>
    </nav>
  </header>`;
}

function renderHero(C, gh) {
  const P = C.person;
  const stat = (s) => {
    const v = s.value === '{repos}' ? String(gh.repoCount) : s.value;
    return `<div class="stat"><dt class="stat-label">${esc(s.label)}</dt><dd class="stat-value">${esc(v)}</dd></div>`;
  };
  return `
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero-bg" aria-hidden="true"><div class="hero-grid"></div><div class="hero-glow"></div><div class="hero-glow hero-glow--2"></div></div>
    <div class="container hero-inner">
      <div class="hero-copy">
        ${P.available ? `<p class="status-badge hero-anim" style="--d:0"><span class="status-dot" aria-hidden="true"></span>${esc(P.availabilityText)}</p>` : ''}
        <h1 class="hero-title" id="hero-title">
          <span class="hero-kicker hero-anim" style="--d:1">${esc(P.name)} <span aria-hidden="true">·</span> ${esc(P.title)}</span>
          <span class="hero-headline hero-anim" style="--d:2">${esc(C.hero.headline)}${C.hero.headlineAccent ? ` <em>${esc(C.hero.headlineAccent)}</em>` : ''}</span>
        </h1>
        <p class="hero-lead hero-anim" style="--d:3">${esc(C.hero.lead)}</p>
        <div class="hero-ctas hero-anim" style="--d:4">
          <a class="btn btn--primary btn--lg" href="#contact">${esc(C.cta.primary)}${icon('arrow-right')}</a>
          <a class="btn btn--ghost btn--lg" href="#work">${esc(C.cta.secondary)}</a>
        </div>
        <div class="hero-meta hero-anim" style="--d:5">
          <ul class="social" role="list">
            ${join(C.social, (s) => `<li><a class="icon-btn" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label)} (opens in a new tab)">${icon(s.icon)}</a></li>`)}
            <li><a class="icon-btn" href="mailto:${esc(P.email)}" aria-label="Email ${esc(P.email)}">${icon('mail')}</a></li>
          </ul>
          <p class="hero-location">${icon('map-pin')}${esc(P.locality)}, ${esc(P.region)} · ${esc(P.remoteNote)}</p>
        </div>
      </div>
      <div class="hero-visual hero-anim" style="--d:2">
        <figure class="portrait">
          <div class="portrait-frame">
            <picture>
              <source srcset="${P.photo.src}" type="image/webp">
              <img src="${P.photo.fallback}" width="${P.photo.width}" height="${P.photo.height}" alt="${esc(P.photo.alt)}" fetchpriority="high" decoding="async">
            </picture>
          </div>
          <figcaption class="portrait-chip portrait-chip--top"><span class="mono">&lt;/&gt;</span> ${esc(P.specialty)}</figcaption>
        </figure>
        <div class="portrait-chip portrait-chip--bottom" aria-hidden="true">${icon('handshake')}<span>Developer who speaks business</span></div>
      </div>
    </div>
    <div class="container">
      <dl class="hero-stats hero-anim" style="--d:6">${join(C.stats, stat)}</dl>
    </div>
  </section>`;
}

function renderMarquee(C) {
  const item = (t) => `<li class="marquee-item">${icon(t.icon)}<span>${esc(t.name)}</span></li>`;
  const list = join(C.marquee, item);
  return `
  <section class="marquee" aria-label="Technologies I work with">
    <div class="marquee-viewport">
      <div class="marquee-track">
        <ul class="marquee-list" role="list">${list}</ul>
        <ul class="marquee-list marquee-list--dupe" role="list" aria-hidden="true">${list}</ul>
      </div>
    </div>
  </section>`;
}

function renderJourney(C, num) {
  const J = C.journey;
  const chapter = (ch) => `
        <li class="chapter" data-reveal>
          <div class="chapter-marker" aria-hidden="true"><span>${esc(ch.number)}</span></div>
          <article class="card chapter-card" aria-labelledby="chapter-${slug(ch.title)}">
            <div class="chapter-main">
              <p class="chapter-years">${esc(ch.years)}</p>
              <h3 class="chapter-title" id="chapter-${slug(ch.title)}">${esc(ch.title)}</h3>
              <p class="chapter-role">${esc(ch.role)}</p>
              <p class="chapter-body">${esc(ch.body)}</p>
              <div class="benefit">
                <p class="benefit-label">${icon('target')}What this means for you</p>
                <p class="benefit-text">${esc(ch.clientBenefit)}</p>
              </div>
            </div>
            <div class="chapter-side">
              <ul class="checklist" role="list">${join(ch.points, (p) => `<li>${icon('check')}<span>${esc(p)}</span></li>`)}</ul>
              ${ch.skills ? `<div class="skill-groups">${join(ch.skills, (g) => `
                <div class="skill-group"><h4 class="skill-group-title">${esc(g.group)}</h4>${tags(g.items, 'tags--sm')}</div>`)}
              </div>` : ''}
            </div>
          </article>
        </li>`;
  return `
  <section class="section journey" id="journey" aria-labelledby="journey-title">
    <div class="container">
      ${sectionHead(num, J.eyebrow, J.heading, J.lead, 'journey')}
      <div class="timeline-wrap">
        <div class="timeline-rail" aria-hidden="true"><div class="timeline-fill" data-timeline-fill></div></div>
        <ol class="timeline" role="list" data-timeline>${join(J.chapters, chapter)}
        </ol>
      </div>
      <div class="journey-cta" data-reveal>
        <p>Ready for the next chapter to be yours?</p>
        <a class="btn btn--primary" href="#contact">${esc(C.cta.primary)}${icon('arrow-right')}</a>
      </div>
    </div>
  </section>`;
}

function renderServices(C, num) {
  const S = C.services;
  const money = (n) => '$' + Number(n).toLocaleString('en-US');
  const card = (s, i) => `
        <li class="card card--hover service" data-reveal style="--i:${i}">
          <span class="icon-tile">${icon(s.icon)}</span>
          <h3 class="card-title">${esc(s.title)}</h3>
          <p class="service-benefit">${esc(s.benefit)}</p>
          <ul class="checklist checklist--compact" role="list">${join(s.bullets, (b) => `<li>${icon('check')}<span>${esc(b)}</span></li>`)}</ul>
          ${s.startingAt ? `<p class="service-price">Starting at <strong>${money(s.startingAt)}</strong></p>` : ''}
        </li>`;
  return `
  <section class="section services" id="services" aria-labelledby="services-title">
    <div class="container">
      ${sectionHead(num, S.eyebrow, S.heading, S.lead, 'services')}
      <ul class="grid grid--3" role="list">${S.items.map(card).join('')}
      </ul>
      <div class="quote-banner card" data-reveal>
        <div>
          <h3 class="quote-banner-title">${esc(S.quoteHeading)}</h3>
          <p>${esc(S.quoteText)}</p>
        </div>
        <a class="btn btn--primary" href="#contact">${esc(S.quoteCta)}${icon('arrow-right')}</a>
      </div>
    </div>
  </section>`;
}

function renderProcess(C, num) {
  const P = C.process;
  const step = (s, i) => `
        <li class="step" data-reveal style="--i:${i}">
          <div class="step-head">
            <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
            <span class="icon-tile icon-tile--sm">${icon(s.icon)}</span>
          </div>
          <h3 class="card-title">${esc(s.title)}</h3>
          <p>${esc(s.body)}</p>
          <p class="step-deliverable">${icon('circle-check')}${esc(s.deliverable)}</p>
        </li>`;
  return `
  <section class="section process" id="process" aria-labelledby="process-title">
    <div class="container">
      ${sectionHead(num, P.eyebrow, P.heading, P.lead, 'process')}
      <ol class="steps" role="list">${P.steps.map(step).join('')}
      </ol>
    </div>
  </section>`;
}

function projectImg(p, sizes, lazy = true) {
  return `<img src="/assets/images/${p.image}-640.webp" srcset="/assets/images/${p.image}-640.webp 640w, /assets/images/${p.image}-1280.webp 1280w" sizes="${sizes}" width="1280" height="800" alt="${esc(p.imageAlt)}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
}
function projectBadges(p) {
  let b = '';
  if (p.liveUrl) b += `<span class="badge badge--live"><span class="status-dot" aria-hidden="true"></span>Live</span>`;
  if (p.badge) b += `<span class="badge">${esc(p.badge)}</span>`;
  return b;
}
function projectLinks(p, C, inDialog = false) {
  return `
          ${p.liveUrl ? `<a class="btn btn--primary btn--sm" href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">${icon('external-link')}Live Demo<span class="visually-hidden"> of ${esc(p.title)} (opens in a new tab)</span></a>` : ''}
          <a class="btn btn--ghost btn--sm" href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">${icon('github')}GitHub<span class="visually-hidden"> repository for ${esc(p.title)} (opens in a new tab)</span></a>
          ${inDialog ? `<a class="btn btn--ghost btn--sm case-hire" href="#contact" data-dialog-close>Want something like this? ${esc(C.cta.primary)}</a>` : ''}`;
}

function renderWork(C, num, gh) {
  const W = C.work;
  const card = (p, i) => `
        <article class="card project${i % 2 ? ' project--flip' : ''}" id="project-${p.id}" data-reveal aria-labelledby="project-${p.id}-title">
          <div class="project-media">
            <button class="project-media-btn" type="button" data-dialog-open="case-${p.id}" aria-label="View details for ${esc(p.title)}">
              ${projectImg(p, '(min-width: 1000px) 560px, 100vw')}
            </button>
          </div>
          <div class="project-body">
            <div class="project-meta"><p class="project-type">${esc(p.type)}</p>${projectBadges(p)}</div>
            <h3 class="project-title" id="project-${p.id}-title">${esc(p.title)}</h3>
            <dl class="ps">
              <div><dt>The problem</dt><dd>${esc(p.problem)}</dd></div>
              <div><dt>My solution</dt><dd>${esc(p.solution)}</dd></div>
            </dl>
            ${tags(p.stack, 'tags--sm')}
            <div class="project-actions">
              <button class="btn btn--light btn--sm" type="button" data-dialog-open="case-${p.id}">View Details${icon('arrow-up-right')}<span class="visually-hidden"> for ${esc(p.title)}</span></button>
              ${projectLinks(p, C)}
            </div>
          </div>
        </article>`;

  const more = (m) => `
          <li class="card card--hover mini">
            <h4 class="card-title">${esc(m.title)}</h4>
            <p>${esc(m.description)}</p>
            ${tags(m.stack, 'tags--sm')}
            <div class="mini-links">
              ${m.liveUrl ? `<a class="text-link" href="${esc(m.liveUrl)}" target="_blank" rel="noopener noreferrer">${icon('external-link')}Live demo<span class="visually-hidden"> of ${esc(m.title)} (opens in a new tab)</span></a>` : ''}
              <a class="text-link" href="${esc(m.githubUrl)}" target="_blank" rel="noopener noreferrer">${icon('github')}Code<span class="visually-hidden"> for ${esc(m.title)} (opens in a new tab)</span></a>
            </div>
          </li>`;

  return `
  <section class="section work" id="work" aria-labelledby="work-title">
    <div class="container">
      ${sectionHead(num, W.eyebrow, W.heading, W.lead, 'work')}
      <div class="projects">${W.projects.map(card).join('')}
      </div>

      <div class="more-work" id="more-work">
        <h3 class="subhead" data-reveal>${esc(C.moreWork.heading)}</h3>
        <ul class="grid grid--4" role="list" data-reveal>${join(C.moreWork.items, more)}
          <li class="card card--hover mini mini--cta">
            <span class="icon-tile">${icon('github')}</span>
            <h4 class="card-title">${gh.repoCount} public repositories</h4>
            <p>Experiments, client-style builds and coursework, all on GitHub.</p>
            <a class="btn btn--ghost btn--sm" href="https://github.com/${esc(C.githubUsername)}" target="_blank" rel="noopener noreferrer">Explore GitHub${icon('arrow-up-right')}<span class="visually-hidden"> (opens in a new tab)</span></a>
          </li>
        </ul>
      </div>
    </div>
  </section>`;
}

function renderDialogs(C) {
  return join(C.work.projects, (p) => `
  <dialog class="case" id="case-${p.id}" aria-labelledby="case-${p.id}-title">
    <div class="case-inner">
      <header class="case-head">
        <div>
          <p class="project-type">${esc(p.type)} · ${esc(p.year)}</p>
          <h2 class="case-title" id="case-${p.id}-title">${esc(p.title)}</h2>
        </div>
        <button class="icon-btn case-close" type="button" data-dialog-close aria-label="Close case study">${icon('x')}</button>
      </header>
      <div class="case-body">
        <div class="case-media">${projectImg(p, '(min-width: 900px) 860px, 100vw')}</div>
        <p class="case-lead">${esc(p.summary)}</p>
        <div class="case-grid">
          <section class="case-block"><h3>${icon('circle-alert')}The problem</h3><p>${esc(p.problem)}</p></section>
          <section class="case-block"><h3>${icon('sparkles')}My solution</h3><p>${esc(p.solution)}</p></section>
        </div>
        <section class="case-section"><h3>Key features</h3>
          <ul class="checklist checklist--2col" role="list">${join(p.features, (f) => `<li>${icon('check')}<span>${esc(f)}</span></li>`)}</ul>
        </section>
        <section class="case-section"><h3>Highlights</h3>
          <ul class="highlights" role="list">${join(p.highlights, (h) => `<li>${icon('trending-up')}<span>${esc(h)}</span></li>`)}</ul>
        </section>
        <section class="case-section"><h3>Tech stack</h3>${tags(p.stack)}</section>
      </div>
      <footer class="case-foot">${projectLinks(p, C, true)}
      </footer>
    </div>
  </dialog>`);
}

function renderCode(C, num) {
  const K = C.code;
  const snip = (s, i) => `
        <figure class="card code-card" data-reveal style="--i:${i}">
          <figcaption class="code-head">
            <span class="code-dots" aria-hidden="true"><span></span><span></span><span></span></span>
            <span class="code-title">${esc(s.title)}</span>
            <span class="badge badge--mono">${icon(s.icon)}${esc(s.language)}</span>
            <button class="btn btn--ghost btn--xs" type="button" data-copy="${s.id}" aria-label="Copy ${esc(s.title)} code">${icon('copy')}<span data-copy-label>Copy</span></button>
          </figcaption>
          <pre class="code-block" tabindex="0" aria-label="${esc(s.title)} code sample"><code id="code-${s.id}">${highlight(s.code.replace(/\r\n?/g, '\n'))}</code></pre>
        </figure>`;
  return `
  <section class="section code" id="code" aria-labelledby="code-title">
    <div class="container">
      ${sectionHead(num, K.eyebrow, K.heading, K.lead, 'code')}
      <div class="grid grid--2 code-grid">${K.snippets.map(snip).join('')}
      </div>
      <p class="visually-hidden" role="status" aria-live="polite" data-copy-status></p>
    </div>
  </section>`;
}

function repoCardStatic(r) {
  const d = new Date(r.pushed_at);
  const when = isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `<li class="card card--hover repo"><a class="repo-link" href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer"><span class="repo-name">${icon('github')}${esc(r.name)}</span></a><p class="repo-desc">${esc(r.description || 'No description yet.')}</p><p class="repo-meta">${r.language ? `<span>${esc(r.language)}</span>` : ''}<span>Updated ${esc(when)}</span></p></li>`;
}

function renderGitHub(C, num, gh) {
  const G = C.github;
  icon('star'); icon('github'); // used by the client-side feed renderer
  const skeleton =`<li class="card repo repo--skeleton" aria-hidden="true"><span class="sk sk--title"></span><span class="sk"></span><span class="sk sk--short"></span><span class="sk sk--meta"></span></li>`;
  return `
  <section class="section github" id="github" aria-labelledby="github-title">
    <div class="container">
      ${sectionHead(num, G.eyebrow, G.heading, G.lead, 'github')}
      <ul class="grid grid--3 repo-grid" role="list" data-gh-feed aria-busy="true" aria-live="polite">
        ${skeleton.repeat(G.count)}
      </ul>
      <noscript><ul class="grid grid--3 repo-grid" role="list">${join(gh.repos, repoCardStatic)}</ul></noscript>
      <div class="github-foot">
        <p class="gh-status" data-gh-status></p>
        <a class="btn btn--ghost" href="https://github.com/${esc(C.githubUsername)}?tab=repositories" target="_blank" rel="noopener noreferrer">${icon('github')}View all ${gh.repoCount} repositories<span class="visually-hidden"> (opens in a new tab)</span></a>
      </div>
      <script type="application/json" id="gh-config">${JSON.stringify({
        user: C.githubUsername,
        count: G.count,
        hide: G.hideRepos,
        snapshot: gh.repos,
        snapshotLive: gh.live,
      }).replace(/</g, '\\u003c')}</script>
    </div>
  </section>`;
}

function renderTestimonials(C, num) {
  const T = C.testimonials;
  if (!T.items || !T.items.length) return '';
  const card = (t, i) => `
        <figure class="card testimonial" data-reveal style="--i:${i}">
          ${icon('quote', 'testimonial-mark')}
          <blockquote><p>${esc(t.quote)}</p></blockquote>
          <figcaption class="testimonial-by">
            ${t.photo ? `<img src="${esc(t.photo)}" width="48" height="48" alt="" loading="lazy" decoding="async">` : `<span class="testimonial-initial" aria-hidden="true">${esc(t.name.charAt(0))}</span>`}
            <span><strong>${t.url ? `<a href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">${esc(t.name)}</a>` : esc(t.name)}</strong>
            <span class="testimonial-role">${esc([t.role, t.company].filter(Boolean).join(', '))}</span></span>
          </figcaption>
        </figure>`;
  return `
  <section class="section testimonials" id="testimonials" aria-labelledby="testimonials-title">
    <div class="container">
      ${sectionHead(num, T.eyebrow, T.heading, '', 'testimonials')}
      <div class="grid grid--3">${T.items.map(card).join('')}
      </div>
    </div>
  </section>`;
}

function renderContact(C, num) {
  const K = C.contact, P = C.person;
  const opts = (arr) => join(arr, (o) => `<option value="${esc(o)}">${esc(o)}</option>`);
  const field = (id, label, control, opt = false) => `
          <div class="field" data-field>
            <label for="${id}">${esc(label)}${opt ? ' <span class="optional">(optional)</span>' : ''}</label>
            ${control}
            <p class="field-error" id="${id}-error" data-error></p>
          </div>`;
  return `
  <section class="section contact" id="contact" aria-labelledby="contact-title">
    <div class="container contact-grid">
      <div class="contact-info" data-reveal>
        <p class="eyebrow"><span class="eyebrow-num">${num}</span>${esc(K.eyebrow)}</p>
        <h2 class="section-title" id="contact-title">${esc(K.heading)}</h2>
        <p class="section-lead">${esc(K.lead)}</p>
        <ul class="contact-list" role="list">
          <li><a class="contact-item" href="mailto:${esc(P.email)}"><span class="icon-tile icon-tile--sm">${icon('mail')}</span><span><span class="contact-label">Email</span><span class="contact-value">${esc(P.email)}</span></span></a></li>
          <li><a class="contact-item" href="tel:${esc(P.phoneHref)}"><span class="icon-tile icon-tile--sm">${icon('phone')}</span><span><span class="contact-label">Phone / Text</span><span class="contact-value">${esc(P.phoneDisplay)}</span></span></a></li>
          <li><div class="contact-item"><span class="icon-tile icon-tile--sm">${icon('map-pin')}</span><span><span class="contact-label">Location</span><span class="contact-value">${esc(P.location)} · Remote</span></span></div></li>
        </ul>
        <p class="contact-note">${icon('clock')}${esc(P.responseNote)}</p>
        <ul class="social" role="list">
          ${join(C.social, (s) => `<li><a class="icon-btn" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label)} (opens in a new tab)">${icon(s.icon)}</a></li>`)}
        </ul>
      </div>

      <form class="card form" name="contact" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="bot-field" data-contact-form data-reveal>
        <input type="hidden" name="form-name" value="contact">
        <p class="hp" aria-hidden="true"><label>Leave this field empty: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <h3 class="form-title">Tell me about your project</h3>
        <div class="form-grid">
          ${field('f-name', 'Your name', `<input id="f-name" name="name" type="text" autocomplete="name" required maxlength="100" aria-describedby="f-name-error">`)}
          ${field('f-email', 'Your email', `<input id="f-email" name="email" type="email" autocomplete="email" required maxlength="150" aria-describedby="f-email-error">`)}
          ${field('f-type', 'Project type', `<select id="f-type" name="project-type" required aria-describedby="f-type-error"><option value="">Select a service…</option>${opts(K.projectTypes)}</select>`)}
          ${field('f-budget', 'Budget range', `<select id="f-budget" name="budget" aria-describedby="f-budget-error"><option value="">Select a range…</option>${opts(K.budgets)}</select>`, true)}
          ${field('f-timeline', 'Timeline', `<select id="f-timeline" name="timeline" aria-describedby="f-timeline-error"><option value="">Select a timeline…</option>${opts(K.timelines)}</select>`, true)}
          ${field('f-message', 'Project details', `<textarea id="f-message" name="message" rows="5" required minlength="20" maxlength="5000" aria-describedby="f-message-error" placeholder="What are you building, who is it for, and what does success look like?"></textarea>`)}
        </div>
        <div class="form-foot">
          <button class="btn btn--primary btn--lg" type="submit" data-submit>${icon('send')}<span data-submit-label>${esc(K.submitLabel)}</span></button>
          <p class="form-hint">No spam, ever. Your details are only used to reply to you.</p>
        </div>
        <div class="form-status" role="status" aria-live="polite" tabindex="-1" data-form-status data-success="${esc(K.successMessage)}" data-error-msg="${esc(K.errorMessage)}"></div>
      </form>
    </div>
  </section>`;
}

function renderFooter(C, links) {
  const year = new Date().getFullYear();
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="brand" href="/#top"><span class="brand-mark" aria-hidden="true">OS</span><span class="brand-name">${esc(C.person.name)}</span></a>
          <p>${esc(C.footer.tagline)}</p>
        </div>
        <nav class="footer-nav" aria-label="Footer">
          <h2 class="footer-heading">Explore</h2>
          <ul role="list">${join(links, (l) => `<li><a href="/#${l.id}">${esc(l.label)}</a></li>`)}<li><a href="/#contact">${esc(C.cta.primary)}</a></li></ul>
        </nav>
        <div class="footer-connect">
          <h2 class="footer-heading">Connect</h2>
          <ul role="list">
            <li><a href="mailto:${esc(C.person.email)}">${icon('mail')}${esc(C.person.email)}</a></li>
            <li><a href="tel:${esc(C.person.phoneHref)}">${icon('phone')}${esc(C.person.phoneDisplay)}</a></li>
            ${join(C.social, (s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${icon(s.icon)}${esc(s.label)}<span class="visually-hidden"> (opens in a new tab)</span></a></li>`)}
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© <span data-year>${year}</span> ${esc(C.person.name)}. All rights reserved.</p>
        <p class="mono">Designed &amp; built by hand in ${esc(C.person.locality)}, CA</p>
      </div>
    </div>
  </footer>
  <a class="to-top" href="#top" data-to-top aria-label="Back to top">${icon('chevron-up')}</a>`;
}

/* ==========================================================================
   PAGE SHELL
   ========================================================================== */
function jsonLd(C) {
  const url = C.site.url + '/';
  const P = C.person;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': url + '#person',
        name: P.name,
        jobTitle: P.title,
        url,
        image: C.site.url + P.photo.fallback,
        email: 'mailto:' + P.email,
        telephone: P.phoneHref,
        address: { '@type': 'PostalAddress', addressLocality: P.locality, addressRegion: P.region, addressCountry: P.country },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of California, Irvine' },
        knowsAbout: ['MERN stack', 'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript', 'Web development'],
        sameAs: C.social.map((s) => s.url),
      },
      {
        '@type': 'ProfessionalService',
        '@id': url + '#business',
        name: `${P.name}: ${P.title}`,
        url,
        image: C.site.url + C.site.ogImage,
        description: C.site.description,
        email: P.email,
        telephone: P.phoneHref,
        founder: { '@id': url + '#person' },
        address: { '@type': 'PostalAddress', addressLocality: P.locality, addressRegion: P.region, addressCountry: P.country },
        areaServed: 'Worldwide (remote)',
        knowsAbout: C.services.items.map((s) => s.title),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Web development services',
          itemListElement: C.services.items.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.benefit } })),
        },
      },
    ],
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function shell(C, { title, description, canonicalPath = '/', body, css, noindex = false, jsVersion }) {
  const url = C.site.url + canonicalPath;
  const og = C.site.url + C.site.ogImage;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
  <meta name="theme-color" content="${C.site.themeColor}">
  <meta name="color-scheme" content="dark">
  <meta name="author" content="${esc(C.person.name)}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(C.person.name)}">
  <meta property="og:locale" content="${C.site.locale}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${og}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(C.site.ogImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${og}">
  <meta name="twitter:image:alt" content="${esc(C.site.ogImageAlt)}">

  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preload" href="/assets/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
  ${noindex ? '' : `<link rel="preconnect" href="https://api.github.com" crossorigin>`}
  <script>document.documentElement.classList.add('js')</script>
  <style>${css}</style>
  ${noindex ? '' : `<script type="application/ld+json">${jsonLd(C)}</script>`}
  <script src="/main.js?v=${jsVersion}" defer></script>
</head>
<body>
${iconSprite()}
${body}
</body>
</html>
`;
}

/* ==========================================================================
   BUILD
   ========================================================================== */
async function build() {
  const t0 = Date.now();
  hashCache.clear();
  usedIcons.clear();
  const C = loadContent();
  const gh = await fetchGitHub(C);

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));
  copyDir(path.join(SRC, 'public'), DIST);

  const js = fs.readFileSync(path.join(SRC, 'main.js'), 'utf8');
  fs.writeFileSync(path.join(DIST, 'main.js'), js);
  const jsVersion = crypto.createHash('md5').update(js).digest('hex').slice(0, 8);
  const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '\n').trim();

  // Sections + numbering (testimonials only counted when present)
  const hasTestimonials = C.testimonials.items && C.testimonials.items.length > 0;
  const order = ['journey', 'services', 'process', 'work', 'code', 'github', ...(hasTestimonials ? ['testimonials'] : []), 'contact'];
  const n = (id) => String(order.indexOf(id) + 1).padStart(2, '0');
  const navLinks = [
    { id: 'journey', label: 'Journey' },
    { id: 'services', label: 'Services' },
    { id: 'process', label: 'Process' },
    { id: 'work', label: 'Work' },
    { id: 'code', label: 'Code' },
    ...(hasTestimonials ? [{ id: 'testimonials', label: 'Testimonials' }] : []),
  ];

  const home = `
${renderNav(C, navLinks)}
<main id="main">
${renderHero(C, gh)}
${renderMarquee(C)}
${renderJourney(C, n('journey'))}
${renderServices(C, n('services'))}
${renderProcess(C, n('process'))}
${renderWork(C, n('work'), gh)}
${renderCode(C, n('code'))}
${renderGitHub(C, n('github'), gh)}
${renderTestimonials(C, hasTestimonials ? n('testimonials') : '')}
${renderContact(C, n('contact'))}
</main>
${renderDialogs(C)}
${renderFooter(C, navLinks)}`;

  const write = (rel, html) => {
    const file = path.join(DIST, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, versionAssets(html));
  };

  write('index.html', shell(C, { title: C.site.title, description: C.site.description, body: home, css, jsVersion }));

  const simplePage = (heading, text, iconName) => `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header is-solid"><nav class="nav container" aria-label="Primary">
  <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">OS</span><span class="brand-name">${esc(C.person.name)}</span></a>
  <a class="btn btn--ghost btn--sm" href="/">Back to home</a>
</nav></header>
<main id="main" class="simple-page">
  <div class="container simple-inner">
    <span class="icon-tile icon-tile--lg">${icon(iconName)}</span>
    <h1 class="section-title">${heading}</h1>
    <p class="section-lead">${text}</p>
    <div class="hero-ctas"><a class="btn btn--primary btn--lg" href="/">Back to home${icon('arrow-right')}</a><a class="btn btn--ghost btn--lg" href="/#work">${esc(C.cta.secondary)}</a></div>
  </div>
</main>
${renderFooter(C, navLinks)}`;

  write('thank-you/index.html', shell(C, {
    title: `Message sent | ${C.person.name}`, description: 'Thanks for reaching out.', canonicalPath: '/thank-you/', noindex: true, css, jsVersion,
    body: simplePage('Thanks, your message is on its way.', esc(C.contact.successMessage), 'circle-check'),
  }));
  write('404.html', shell(C, {
    title: `Page not found | ${C.person.name}`, description: 'This page could not be found.', canonicalPath: '/404', noindex: true, css, jsVersion,
    body: simplePage('This page took a wrong turn.', 'The page you are looking for doesn’t exist or has moved.', 'compass'),
  }));

  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${C.site.url}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
`);
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${C.site.url}/sitemap.xml\n`);

  console.log(`✓ Built dist/ in ${Date.now() - t0}ms · GitHub: ${gh.live ? 'live' : 'fallback'} · ${gh.repoCount} repos · testimonials: ${hasTestimonials ? C.testimonials.items.length : 'hidden'}`);
}

module.exports = { build };
if (require.main === module) {
  build().catch((e) => { console.error(e); process.exit(1); });
}
