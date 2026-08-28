# Liam McBride — Portfolio Site

A static, no-build-step site: one scrolling home page, three project case
studies, a shared stylesheet, and a shared JS file. No framework, no
`npm install` — this is intentional, so GitHub Pages can serve it directly
with zero configuration.

## File structure

```
portfolio-site/
├── index.html                    Single-page site — hero, about, education,
│                                  experience, thesis, skills, projects,
│                                  publications, contact (all one page)
├── project-clinical-trials.html  Case study: Alzheimer's clinical trials pipeline
├── project-pyspark.html          Case study: rare cell population recovery (PySpark)
├── project-churn.html            Case study: churn prediction & retention strategy
├── style.css                     Shared design tokens + all styling
├── main.js                       Sticky nav w/ scroll-spy, hero animation, footer
├── resume.pdf                    ← add your résumé PDF here (referenced from index.html)
└── assets/
    └── img/
        ├── headshot.jpg          Used in the index.html hero
        ├── graduation.jpg        Used in the About section
        ├── churn/                 25 images, used only by project-churn.html
        └── pyspark/                11 images, used only by project-pyspark.html
                                    (qc_distributions_raw.png is an unused spare)
```

`index.html` is the whole site — About, Education, Experience, Thesis,
Skills, Projects, and Contact are all sections on one scrolling page, not
separate files. The three project pages are the only other real pages;
they link back to `index.html#section` anchors rather than having their
own nav.

Header and footer aren't duplicated by hand — `main.js` injects them into
`<header id="site-header">` and `<footer id="site-footer">` on page load.
Edit the nav sections or footer content once, in `main.js`, and every page
updates.

## Navigation

The header is a **sticky nav with scroll-spy**: it stays visible while you
scroll `index.html`, and highlights whichever section (`#home`, `#about`,
`#experience`, `#projects`, `#contact`) is currently in view, via an
`IntersectionObserver` in `main.js`. Three sections — Education, Thesis,
Skills, and Publications — don't have their own nav entry but are still
real, anchor-linkable sections if you want to link directly to them.

On the three project pages, the same nav links back to
`index.html#section` instead of a plain `#section`, since those sections
don't exist on that page.

## Design system

- **Colors, fonts, spacing:** all defined as CSS custom properties at the
  top of `style.css` (`:root { ... }`) — change values there and they
  cascade everywhere.
- **Pine (`--pine`) is the single dominant accent color** — used for links,
  the nav, buttons, and highlights. Clay (`--clay`) is reserved for two
  specific semantic uses only (`.status-progress` badges and
  `.callout.warn` boxes) rather than competing as a second general accent.
- **Fonts:** Newsreader (serif, headings) + IBM Plex Sans (body) + IBM Plex
  Mono (labels, stats, code-like text).
- **Reusable components:** `.card` (project cards), `.timeline-item`
  (education/experience/publications), `.callout` / `.callout.warn`
  (highlighted findings), `.data-table` (project-page stat tables),
  `.figure` / `.figure-grid` (image galleries on project pages), `.readout`
  (quick-fact stat strips).

## Before you send this to anyone

1. **Fill in the two remaining content placeholders** in `index.html`,
   both marked with `[Add ...]` text: the Experience entry (dates, what
   the role involves, tools) and the personal line in the About section.
2. **Three links are still placeholders (`href="#"`)**: the PySpark
   project's GitHub repo, the Telco churn project's GitHub repo, and the
   published Power BI dashboard link — in `index.html` and their
   respective case-study pages.
3. **Add `resume.pdf`** to the project root.
4. **Confirm every asset file listed above is actually in place locally**
   — file names must match exactly what's referenced in the HTML.
5. **Click through the live site yourself** before sharing it — nav
   anchors, scroll-spy highlighting, mobile menu, the contact form, and
   every image on every page.

## Deploy with GitHub Pages (free, ~5 minutes)

1. Create a GitHub repo — name it `yourusername.github.io` if you want it
   at the root of your GitHub domain, or anything else if a `/repo-name/`
   subpath is fine.
2. Push these files to the repo's `main` branch (root of the repo, not a
   subfolder — the HTML files reference `style.css` and `main.js` as
   siblings).
3. In the repo: **Settings → Pages → Build and deployment → Source** →
   "Deploy from a branch" → branch `main`, folder `/ (root)` → Save.
4. GitHub gives you a live URL within a minute or two (shown at the top of
   the Pages settings once it's built).

## Customizing further

- **Adding a new project case study:** copy one of the existing
  `project-*.html` files as a template — it already has the right
  `.project-hero`, `.figure-grid`, `.callout`, and `.data-table` patterns.
  Link it from a project card in `index.html`'s Projects section.
- **Hero animation:** generated by `renderHeroScatter()` in `main.js` — a
  UMAP/PCA-style animated scatter, tinted to the site's pine-dominant
  palette with a single small clay accent cluster.
- **Adding a new top-level nav section:** add the section to `index.html`
  with a matching `id`, then add it to the `SECTIONS` array at the top of
  `main.js` — the nav link and scroll-spy behavior pick it up
  automatically.
