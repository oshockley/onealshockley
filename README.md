# O'Neal Shockley: Portfolio

Portfolio site for a freelance full stack developer, deployed on Netlify.

It's a static site with **zero dependencies**. A small Node script (`scripts/build.js`) reads one content file and writes plain HTML to `dist/`. Netlify runs that script automatically on every deploy.

```
src/
  content.js      ← ALL text, links, projects, services, stats, testimonials
  styles.css      ← design tokens + components (inlined into the page at build)
  main.js         ← nav, reveals, case-study modals, copy buttons, GitHub feed, form
  assets/
    images/       ← photo, project screenshots, og-image.jpg
    fonts/        ← self-hosted Bricolage Grotesque, Geist, Geist Mono (woff2)
  public/         ← favicon.svg, favicon.ico, apple-touch-icon.png (copied to site root)
scripts/
  build.js        ← renders the site into dist/
  dev.js          ← local preview server with auto-rebuild
  highlight.js    ← build-time syntax highlighting for code snippets
  icons.js        ← generated icon set (Simple Icons + Lucide)
netlify.toml      ← build command, caching and security headers
```

## Preview locally

Requires Node 18 or newer.

```bash
npm run dev
```

Open http://localhost:3000. The site rebuilds whenever you save a file in `src/`, so refresh the browser to see the change. Contact form submissions are simulated locally and printed in the terminal. Real submissions only work on Netlify.

---

## Editing content

Everything you'd want to change lives in **`src/content.js`**. Edit it, save, and push. You never need to touch layout code.

| To change… | Edit this in `content.js` |
| --- | --- |
| Headline, intro paragraph | `hero` |
| "Available for new projects" badge | `person.available` (`true`/`false`) and `person.availabilityText` |
| Email, phone, location | `person` |
| GitHub / LinkedIn links | `social` |
| "Hire Me" / "View My Work" labels | `cta` (used everywhere on the site) |
| Hero stats | `stats`. `"{repos}"` fills in your live GitHub repo count at each deploy |
| Tech marquee | `marquee` |
| Journey chapters, skills | `journey.chapters` |
| Services (and prices) | `services.items`. Set `startingAt: 1500` to show "Starting at $1,500"; leave `null` to hide |
| Process steps | `process.steps` |
| Featured case studies | `work.projects` |
| Smaller project cards | `moreWork.items` |
| Code snippets | `code.snippets` |
| Contact form dropdowns | `contact.projectTypes`, `contact.budgets`, `contact.timelines` |
| SEO title/description, site URL | `site` |

**Icons:** wherever a list takes `icon` or tech names (`stack`, `skills`, `marquee`), use a slug from `scripts/icons.js` (for example `react`, `nodedotjs`, `mongodb`, `tailwindcss`). Any other text, such as `"Chart.js"`, shows as a plain tag without a logo.

**Apostrophes:** wrap text that contains an apostrophe in double quotes, e.g. `"I'll reply within 24 hours"`.

### Featured projects

Each project in `work.projects` has:

- `liveUrl`: the **Live Demo** button and green **Live** badge only appear when this is set. Leave it `null` when there's no working deployment. There are never dead links.
- `badge`: optional extra label, e.g. `"Concept"`.
- `problem`, `solution`, `features`, `highlights`, `stack`: shown on the card and in the case-study modal.
- `image`: the base name of the screenshot files (see below).

Each case study also has a shareable link: `https://onealshockley.netlify.app/#case-hilllife` opens that modal directly.

### Adding testimonials

Use **real quotes only.** The Testimonials section and its nav link stay hidden while the list is empty. They appear automatically as soon as you add one:

```js
testimonials: {
  eyebrow: "Testimonials",
  heading: "What clients say.",
  items: [
    {
      quote: "Exactly what the client said, word for word.",
      name: "Client Name",
      role: "Owner",
      company: "Their Business",
      photo: "/assets/images/testimonial-client.webp", // optional, square, ~96×96
      url: "https://their-business.com",              // optional
    },
  ],
},
```

Ask the client for permission before publishing their name and quote.

---

## Swapping images

All images live in `src/assets/images/`. Keep the file names, or update the matching path in `content.js`. The build adds a version hash to every image URL, so browsers always fetch the new file.

| Image | File(s) | Size |
| --- | --- | --- |
| Profile photo | `oneal-shockley.webp` + `oneal-shockley.jpg` (fallback) | Square. **At least 800×800 recommended**: the current photo is 400×400, which looks slightly soft on high-density screens |
| Project screenshots | `<image>-640.webp` and `<image>-1280.webp` | 16:10 (e.g. 1280×800), top of the page visible |
| Social share image | `og-image.jpg` | Exactly 1200×630 |

To make WebP files, use any converter (for example squoosh.app). Quality around 75–80 is plenty. When you swap the photo, update `person.photo.width` and `height` in `content.js` to the new dimensions.

To add a new project screenshot, export `myproject-640.webp` and `myproject-1280.webp`, then set `image: "myproject"` on the project.

---

## Deploying to Netlify

The site is already connected to Netlify at https://onealshockley.netlify.app.

1. Commit and push to `main`. Netlify builds automatically with `node scripts/build.js` (configured in `netlify.toml`) and publishes `dist/`.
2. Check **Deploys** in the Netlify dashboard: the build log ends with `✓ Built dist/ … GitHub: live · NN repos`.

If you ever set up the site again from scratch: **Add new site → Import an existing project → pick this repo**. Netlify reads the build settings from `netlify.toml`, so there's nothing to fill in.

**Optional:** to avoid GitHub API rate limits during builds, add an environment variable `GITHUB_TOKEN` (a fine-grained token with no extra permissions) under **Site configuration → Environment variables**. The build still works without it; it falls back to saved repo data.

### Contact form submissions

The form uses **Netlify Forms**. Netlify detects it automatically at deploy time (`data-netlify="true"`). A hidden honeypot field filters out bots.

1. After the first deploy, open the Netlify dashboard → your site → **Forms**. You should see a form called **contact**. If form detection is turned off, click **Enable form detection** and redeploy.
2. Submissions appear under **Forms → contact**, with name, email, project type, budget, timeline and message.
3. **Get an email for every submission:** go to **Site configuration → Forms → Form notifications → Add notification → Email notification**, choose the `contact` form and enter `shockleyoneal@gmail.com`.
4. Spam caught by the honeypot or Netlify's filter shows under **Forms → contact → Spam submissions**. Check it occasionally in case a real lead lands there.

The free plan includes 100 form submissions per month.

### Custom domain (optional)

If you add a domain later (e.g. `onealshockley.com`), change `site.url` in `content.js` so canonical URLs, Open Graph tags, the sitemap and structured data all point to it.

---

## Checks done before launch

- Lighthouse (local, gzip): mobile **98 / 100 / 100 / 100**, desktop **100 / 100 / 100 / 100** (Performance / Accessibility / Best Practices / SEO)
- No console errors. Every link and button verified, including modals, copy buttons, the GitHub feed, form validation and success states, the mobile menu, keyboard focus order, reduced motion, and the 404 and thank-you pages.
