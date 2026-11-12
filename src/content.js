/* ==========================================================================
   SITE CONTENT
   --------------------------------------------------------------------------
   Every piece of text, link, project, service and stat on the site lives in
   this file. Edit it, save, and redeploy (or run `npm run dev` to preview).
   You never need to touch the layout code to change wording.

   Tips
   - Keep quotes balanced: use "double quotes" around text containing an
     apostrophe (O'Neal), or escape it like 'O\'Neal'.
   - Brand icons: use the slugs listed in scripts/icons.js (e.g. "react",
     "nodedotjs", "mongodb"). Anything else shows as a plain text tag.
   - Images live in src/assets/images/. See README.md > "Swapping images".
   ========================================================================== */

module.exports = {
  /* ------------------------------------------------------------------------
     SITE / SEO
     ------------------------------------------------------------------------ */
  site: {
    // The one canonical URL for the site. Change this if you add a custom domain.
    url: "https://onealshockley.netlify.app",
    title: "O'Neal Shockley | Freelance Full Stack Developer",
    description:
      "O'Neal Shockley is a freelance full stack developer (MERN) in Laguna Niguel, CA. Custom web apps, websites, maintenance and optimization for small businesses and startups.",
    ogImage: "/assets/images/og-image.jpg",
    ogImageAlt: "O'Neal Shockley, Freelance Full Stack Developer",
    themeColor: "#0A0A0B",
    locale: "en_US",
  },

  /* ------------------------------------------------------------------------
     PERSON
     ------------------------------------------------------------------------ */
  person: {
    name: "O'Neal Shockley",
    firstName: "O'Neal",
    title: "Freelance Full Stack Developer",
    specialty: "MERN specialist",
    location: "Laguna Niguel, California",
    locality: "Laguna Niguel",
    region: "CA",
    country: "US",
    remoteNote: "Working with clients remotely",
    email: "shockleyoneal@gmail.com",
    phoneDisplay: "(949) 315-8598",
    phoneHref: "+19493158598",
    photo: {
      src: "/assets/images/oneal-shockley.webp",
      fallback: "/assets/images/oneal-shockley.jpg",
      width: 400,
      height: 400,
      alt: "O'Neal Shockley smiling outdoors, wearing glasses and a graduation stole",
    },
    available: true, // set to false to hide the "Available for new projects" badge
    availabilityText: "Available for new projects",
    responseNote: "I reply within 24 hours. The first call is free.",
  },

  social: [
    { label: "GitHub", icon: "github", url: "https://github.com/oshockley" },
    { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/oneal-shockley/" },
  ],

  githubUsername: "oshockley",

  /* ------------------------------------------------------------------------
     NAVIGATION + CTA
     One label for every "contact me" button, used everywhere on the site.
     ------------------------------------------------------------------------ */
  cta: {
    primary: "Hire Me",
    secondary: "View My Work",
  },

  /* ------------------------------------------------------------------------
     HERO
     ------------------------------------------------------------------------ */
  hero: {
    headline: "Custom web apps",
    // Shown in the accent color on the line after the headline. Leave "" to hide.
    headlineAccent: "built to grow your business.",
    lead:
      "I build fast, custom websites and web applications for small businesses, entrepreneurs and startups. With a background in sales and client relations, I learn your business first, keep you updated throughout, and ship software that does its job.",
  },

  /* Verifiable stats only.
     - value "{repos}" is replaced at build time with your live public repo count
       from GitHub (falls back to `reposFallback` if GitHub can't be reached). */
  stats: [
    { value: "{repos}", label: "Public repos on GitHub" },
    { value: "2020", label: "Working with clients since" },
    { value: "UCI", label: "Certified software engineer" },
  ],
  reposFallback: 51,

  /* ------------------------------------------------------------------------
     TECH MARQUEE (shown once, under the hero)
     `icon` = slug from scripts/icons.js, or a UI icon name like "cloud".
     ------------------------------------------------------------------------ */
  marquee: [
    { name: "JavaScript", icon: "javascript" },
    { name: "TypeScript", icon: "typescript" },
    { name: "React", icon: "react" },
    { name: "Node.js", icon: "nodedotjs" },
    { name: "Express", icon: "express" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "Python", icon: "python" },
    { name: "Flask", icon: "flask" },
    { name: "HTML5", icon: "html5" },
    { name: "CSS", icon: "css" },
    { name: "Tailwind CSS", icon: "tailwindcss" },
    { name: "Vite", icon: "vite" },
    { name: "Git", icon: "git" },
    { name: "GitHub Actions", icon: "githubactions" },
    { name: "Cypress", icon: "cypress" },
    { name: "Docker", icon: "docker" },
    { name: "AWS", icon: "cloud" },
    { name: "Vercel", icon: "vercel" },
    { name: "Netlify", icon: "netlify" },
  ],

  /* ------------------------------------------------------------------------
     JOURNEY (3 chapters)
     ------------------------------------------------------------------------ */
  journey: {
    eyebrow: "My Journey",
    heading: "From the sales floor to full-stack software.",
    lead:
      "Most developers learn clients on the job. I spent three years working with them before I wrote production code, and that's the difference you'll notice.",
    chapters: [
      {
        number: "01",
        years: "2020 – 2023",
        title: "The Spark",
        role: "Sales & Client Relations",
        body:
          "Three years of listening to customers, translating needs into solutions and being accountable for results. That's where I learned that projects succeed or fail on communication.",
        clientBenefit:
          "I ask the right questions up front, explain technical trade-offs in plain English and never leave you guessing about progress.",
        points: [
          "Requirement gathering and needs analysis",
          "Clear, proactive communication",
          "Deadline-driven project management",
          "Long-term relationships built on trust",
        ],
      },
      {
        number: "02",
        years: "2023 – 2024",
        title: "The Craft",
        role: "Software Engineering Certification · UC Irvine",
        body:
          "An intensive software engineering program at UC Irvine. I shipped solo and team projects end to end with industry-standard tools, Git workflows, testing and deployment.",
        clientBenefit:
          "Your project is built on solid engineering: version control, tests, clean architecture and code another developer can pick up.",
        points: [
          "Full-stack JavaScript and the MERN stack",
          "Team collaboration with Git and pull requests",
          "Testing, CI/CD and deployment",
          "Data structures, algorithms and scalable design",
        ],
        // Grouped skills shown inside this chapter.
        skills: [
          { group: "Frontend", items: ["javascript", "typescript", "react", "html5", "css", "tailwindcss", "Vue.js"] },
          { group: "Backend", items: ["nodedotjs", "express", "mongodb", "postgresql", "python", "flask"] },
          { group: "Tools & Cloud", items: ["git", "githubactions", "cypress", "docker", "AWS", "vercel", "netlify", "Figma"] },
        ],
      },
      {
        number: "03",
        years: "2024 – Present",
        title: "The Work",
        role: "Freelance Full Stack Developer",
        body:
          "I now build custom web apps and websites for small businesses, entrepreneurs and startups, combining full-stack engineering with the client-first approach I learned in sales.",
        clientBenefit:
          "One person who understands both your business goals and the code, from first call through launch and beyond.",
        points: [
          "Full-stack MERN applications and business websites",
          "Automated testing and CI/CD pipelines",
          "Performance, SEO and accessibility from day one",
          "Ongoing maintenance and support after launch",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------
     SERVICES
     startingAt: set to a number (e.g. 1500) to show "Starting at $1,500".
     Leave null to hide the price line (the section ends with a quote CTA).
     ------------------------------------------------------------------------ */
  services: {
    eyebrow: "Services",
    heading: "What I can build for you.",
    lead: "From a brand-new web app to keeping your current site fast and secure.",
    quoteHeading: "Every project is quoted to its scope.",
    quoteText: "Tell me what you need and I'll send a clear, itemized quote with no surprises.",
    quoteCta: "Get a Quote",
    items: [
      {
        icon: "layers",
        title: "Full Stack Development",
        benefit: "One developer for the whole product, from database to interface.",
        bullets: ["Custom web applications", "RESTful API development", "Database design & integration", "Responsive design"],
        startingAt: null,
      },
      {
        icon: "monitor-smartphone",
        title: "Frontend Development",
        benefit: "Interfaces that look sharp and feel fast on every device.",
        bullets: ["React applications", "Responsive web design", "UI/UX implementation", "Performance optimization"],
        startingAt: null,
      },
      {
        icon: "server",
        title: "Backend Development",
        benefit: "Secure, reliable servers and APIs your business can grow on.",
        bullets: ["Node.js & Express APIs", "MongoDB & PostgreSQL", "Authentication & security", "Server deployment"],
        startingAt: null,
      },
      {
        icon: "wrench",
        title: "Website Maintenance",
        benefit: "Your site stays updated, secure and working, so you can focus on business.",
        bullets: ["Regular updates & patches", "Bug fixing & testing", "Performance monitoring", "Technical support"],
        startingAt: null,
      },
      {
        icon: "gauge",
        title: "Web Optimization",
        benefit: "Faster pages, better rankings and more visitors who convert.",
        bullets: ["Speed optimization", "SEO improvements", "Code refactoring", "Accessibility compliance"],
        startingAt: null,
      },
      {
        icon: "handshake",
        title: "Consulting & Support",
        benefit: "Straight answers on technology choices before you spend money.",
        bullets: ["Technical consultation", "Code reviews", "Architecture planning", "Team training"],
        startingAt: null,
      },
    ],
  },

  /* ------------------------------------------------------------------------
     PROCESS
     ------------------------------------------------------------------------ */
  process: {
    eyebrow: "Process",
    heading: "How we'll work together.",
    lead: "A simple, transparent process, so you always know what's happening and what comes next.",
    steps: [
      {
        icon: "messages-square",
        title: "Discovery Call",
        body: "A free call to understand your business, your customers and what success looks like. You'll get honest advice even if we don't end up working together.",
        deliverable: "Clear goals",
      },
      {
        icon: "file-text",
        title: "Plan & Proposal",
        body: "A written proposal covering scope, timeline and price, agreed before any work begins. No vague estimates.",
        deliverable: "Written proposal",
      },
      {
        icon: "code-xml",
        title: "Design & Build",
        body: "Regular progress updates and a live preview link, so you can see the work and give feedback as it takes shape.",
        deliverable: "Live preview",
      },
      {
        icon: "rocket",
        title: "Launch & Support",
        body: "Deployment, testing on real devices and a walkthrough of your new site, followed by optional ongoing maintenance and support.",
        deliverable: "Launched & supported",
      },
    ],
  },

  /* ------------------------------------------------------------------------
     FEATURED PROJECTS (case studies)
     - liveUrl: leave null if there's no working deployment. The "Live Demo"
       button and "Live" badge only appear when liveUrl is set.
     - image: base name of files in src/assets/images/ — the build expects
       <image>-640.webp and <image>-1280.webp (16:10 ratio).
     ------------------------------------------------------------------------ */
  work: {
    eyebrow: "Featured Work",
    heading: "Projects that show how I build.",
    lead: "Each one solves a real problem. Open a case study to see the challenge, my approach and the stack.",
    projects: [
      {
        id: "cdslashci",
        title: "CDSlashCI",
        type: "Full-Stack App · CI/CD Pipeline",
        year: "2025",
        image: "cdslashci",
        imageAlt: "Render dashboard showing a successful automated deploy of CDSlashCI after a merged pull request",
        summary:
          "A MERN + TypeScript quiz application with an automated pipeline: every pull request is tested with Cypress, and every merge to main deploys itself.",
        problem:
          "Manual deployments and untested merges are how bugs reach real users. Teams need confidence that every change works before it goes live, without someone babysitting each release.",
        solution:
          "I built a full-stack TypeScript app (React + Vite client, Express + MongoDB API) and wired it into GitHub Actions. Pull requests into develop automatically run Cypress tests across Node 18, 20 and 22; merging into main triggers an automatic deploy to Render.",
        features: [
          "React + TypeScript client built with Vite",
          "Express + Mongoose REST API with seed data",
          "Cypress component tests, with API calls mocked via MSW",
          "GitHub Actions: tests on every PR into develop",
          "Automatic Render deploy when changes merge to main",
          "Matrix builds across Node 18, 20 and 22",
        ],
        highlights: [
          "Broken code is caught before it ships",
          "Releases happen automatically on merge",
          "A branching workflow ready for a team",
        ],
        stack: ["react", "typescript", "nodedotjs", "express", "mongodb", "cypress", "githubactions", "render"],
        liveUrl: null, // Render instance is currently offline. Add the URL back here if you redeploy it.
        githubUrl: "https://github.com/oshockley/CDSlashCI",
      },
      {
        id: "hilllife",
        title: "HillLife",
        type: "Full-Stack Web App · Fitness",
        year: "2025",
        image: "hilllife",
        imageAlt: "HillLife landing page with a coral gradient hero reading 'Hill Life — Reach your pinnacle'",
        summary:
          "A fitness tracking app for hill sprints, beach runs and street training. Log workouts, follow weekly analytics and export your data.",
        problem:
          "People who train outdoors don't need a bloated gym app. They want a quick way to log a session and see whether they're actually improving week to week.",
        solution:
          "I built a Python/Flask app with secure accounts, fast workout logging and a weekly analytics dashboard with Chart.js. Users can export their history to CSV, and the app is deployed on Vercel.",
        features: [
          "Workout logging: exercises, sets, reps, weight, duration and calories",
          "Weekly analytics dashboard with interactive charts",
          "Automatic calorie estimates by exercise type",
          "CSV export of all training data",
          "Secure accounts with Bcrypt-hashed passwords",
          "Responsive UI with real-time form validation",
        ],
        highlights: [
          "Live in production on Vercel",
          "Full auth, database and analytics in one app",
          "Mobile-friendly for logging on the go",
        ],
        stack: ["python", "flask", "SQLAlchemy", "SQLite", "Chart.js", "Bootstrap", "vercel"],
        liveUrl: "https://hill-life.vercel.app",
        githubUrl: "https://github.com/oshockley/HillLife",
      },
      {
        id: "forgeline",
        title: "Forgeline Athletic Club",
        type: "Small-Business Website",
        year: "2026",
        image: "forgeline",
        imageAlt: "Forgeline Athletic Club hero: 'Train harder. Feel stronger.' over a dark photo of a barbell lift",
        badge: "Concept",
        summary:
          "A concept marketing site for a strength gym, built to show what an agency-quality small-business website looks like. It scores 99–100 on Lighthouse.",
        problem:
          "Local gyms lose sign-ups to slow, generic websites that hide schedules and pricing. Visitors need answers fast: what classes, when, and how much.",
        solution:
          "I designed and built a single-page site with React, TypeScript and Tailwind: filterable class schedules, a monthly/annual pricing toggle, an accessible gallery and a validated free-trial form. Every interaction works by keyboard and respects reduced motion.",
        features: [
          "Weekly schedule filterable by day and class type",
          "Pricing with a monthly/annual toggle",
          "Free-trial form with inline validation and success/error states",
          "Accessible lightbox gallery and mobile menu",
          "Sticky mobile 'Join Now' bar",
          "SEO: Open Graph, sitemap and HealthClub structured data",
        ],
        highlights: [
          "Lighthouse 99–100 across all categories on mobile",
          "Fully keyboard accessible",
          "Built the way I'd build your business site",
        ],
        stack: ["react", "typescript", "vite", "tailwindcss", "Framer Motion", "vercel"],
        liveUrl: "https://forgeline-athletic-club.vercel.app",
        githubUrl: "https://github.com/oshockley/forgeline-athletic-club",
      },
    ],
  },

  /* ------------------------------------------------------------------------
     MORE WORK (compact cards + link to all repos)
     ------------------------------------------------------------------------ */
  moreWork: {
    heading: "More work",
    items: [
      {
        title: "SleepTrackerPro",
        description: "A sleep tracking app built with Expo, React Native and TypeScript, with a standalone web version for logging sessions and viewing sleep trends.",
        stack: ["react", "typescript", "Expo"],
        liveUrl: "https://oshockley.github.io/SleepTrackerPro/",
        githubUrl: "https://github.com/oshockley/SleepTrackerPro",
      },
      {
        title: "Interactive Study Guide",
        description: "An educational web app for learning web fundamentals, with organized lessons and interactive console activities.",
        stack: ["html5", "css", "javascript"],
        liveUrl: "https://oshockley.github.io/prework-study-guide/",
        githubUrl: "https://github.com/oshockley/prework-study-guide",
      },
      {
        title: "Professional Portfolio V1",
        description: "My first portfolio: a responsive layout with Flexbox and Grid that shows where this site started.",
        stack: ["html5", "css"],
        liveUrl: null,
        githubUrl: "https://github.com/oshockley/Module-2-Portfolio",
      },
    ],
  },

  /* ------------------------------------------------------------------------
     CODE IN THE WILD
     ------------------------------------------------------------------------ */
  code: {
    eyebrow: "Code in the Wild",
    heading: "Clean code, built to last.",
    lead: "A peek at the kind of code behind every project: readable, resilient and reusable.",
    snippets: [
      {
        id: "fetch-retry",
        title: "Async fetch with retry & exponential backoff",
        language: "JavaScript",
        icon: "javascript",
        code: `// Robust API call with retry logic
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}`,
      },
      {
        id: "use-debounce",
        title: "Custom React hook for debounced search",
        language: "React",
        icon: "react",
        code: `// Optimized search with debouncing
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in component
const searchTerm = useDebounce(inputValue, 500);`,
      },
    ],
  },

  /* ------------------------------------------------------------------------
     LIVE FROM GITHUB
     The feed loads your most recently pushed public repos in the browser.
     If GitHub is unreachable it shows a snapshot taken at build time, or
     these fallback repos if the build couldn't reach GitHub either.
     ------------------------------------------------------------------------ */
  github: {
    eyebrow: "Live From GitHub",
    heading: "What I'm building right now.",
    lead: "Pulled live from the GitHub API: my most recently updated public repositories.",
    count: 6,
    hideRepos: ["onealshockley", "oshockley"], // repo names never to show in the feed
    fallbackRepos: [
      { name: "forgeline-athletic-club", description: "Responsive gym website concept built with React, Tailwind CSS, and Vite.", language: "TypeScript", html_url: "https://github.com/oshockley/forgeline-athletic-club", stargazers_count: 0, forks_count: 0, pushed_at: "2026-11-10T23:03:39Z" },
      { name: "HillLife", description: "A performance-focused fitness app built for real-world training.", language: "HTML", html_url: "https://github.com/oshockley/HillLife", stargazers_count: 0, forks_count: 0, pushed_at: "2025-07-25T04:06:22Z" },
      { name: "CDSlashCI", description: "Full-stack TypeScript app with a Cypress + GitHub Actions + Render CI/CD pipeline.", language: "TypeScript", html_url: "https://github.com/oshockley/CDSlashCI", stargazers_count: 0, forks_count: 0, pushed_at: "2025-05-16T05:40:18Z" },
    ],
  },

  /* ------------------------------------------------------------------------
     TESTIMONIALS
     REAL quotes only. The whole section (and its nav link) stays hidden
     while this list is empty. To add one, copy the example below, remove
     the // marks, and fill it in. `photo` and `url` are optional.
     ------------------------------------------------------------------------ */
  testimonials: {
    eyebrow: "Testimonials",
    heading: "What clients say.",
    items: [
      // {
      //   quote: "O'Neal rebuilt our booking site in three weeks and kept us updated the whole way.",
      //   name: "Jane Doe",
      //   role: "Owner",
      //   company: "Example Co.",
      //   photo: "/assets/images/testimonial-jane.webp", // optional, square image
      //   url: "https://example.com",                     // optional
      // },
    ],
  },

  /* ------------------------------------------------------------------------
     CONTACT
     ------------------------------------------------------------------------ */
  contact: {
    // FREE email delivery: get a key at https://web3forms.com (enter your Gmail,
    // the key is emailed to you) and paste it here. Every form submission is then
    // emailed straight to that address. Leave "" to use Netlify Forms instead.
    // The key is safe to publish; it can only send email to you.
    web3formsKey: "1a82ffc0-94bc-40f0-96f9-0b7f7b0f4287",
    eyebrow: "What's Next",
    heading: "Let's write the next chapter.",
    lead:
      "Need a complete web application, a website redesign or ongoing support? Tell me about your project and I'll get back to you with next steps.",
    projectTypes: [
      "Full Stack Development",
      "Frontend Development",
      "Backend Development",
      "Website Maintenance",
      "Web Optimization",
      "Consulting & Support",
      "Other",
    ],
    budgets: ["Under $1,000", "$1,000 – $3,000", "$3,000 – $7,500", "$7,500 – $15,000", "$15,000+", "Not sure yet"],
    timelines: ["ASAP (within 2 weeks)", "Within 1 month", "1 – 3 months", "3+ months", "Flexible"],
    submitLabel: "Send Message",
    successMessage: "Thanks! Your message is on its way. I'll reply within 24 hours.",
    errorMessage: "Something went wrong sending your message. Please try again, or email me directly at shockleyoneal@gmail.com.",
  },

  /* ------------------------------------------------------------------------
     FOOTER
     ------------------------------------------------------------------------ */
  footer: {
    tagline: "Freelance full stack developer building web apps that serve real business goals.",
  },
};
