// ============================================================
// Liam McBride — Portfolio
// Shared site behavior: sticky anchor nav with scroll-spy,
// mobile toggle, animated hero scatter (UMAP-style)
// ============================================================

// Single-page site: all primary sections live on index.html.
// Case-study pages (project-*.html) link back here via anchors.
const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function isIndexPage() {
  const path = window.location.pathname.split("/").pop();
  return path === "" || path === "index.html";
}

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const onIndex = isIndexPage();
  // On index: plain #section anchors (scroll-spy handles active state).
  // On a case-study page: link back to index.html#section instead.
  const links = SECTIONS.map((s) => {
    const href = onIndex ? `#${s.id}` : `index.html#${s.id}`;
    return `<li><a href="${href}" data-section="${s.id}">${s.label}</a></li>`;
  }).join("");

  mount.innerHTML = `
    <div class="nav-row">
      <a class="site-title" href="index.html"><strong>Liam McBride</strong> <span>/ Bioinformatician</span></a>
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-links">Menu</button>
      <ul class="nav-links" id="nav-links">${links}</ul>
    </div>
  `;

  const toggle = document.getElementById("nav-toggle");
  const list = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = list.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  // Close the mobile menu once a link is tapped, so it doesn't linger open.
  list.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      list.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  if (onIndex) initScrollSpy();
}

// ---------- Scroll-spy: highlights the nav link for the section in view ----------
function initScrollSpy() {
  const navLinks = document.querySelectorAll(".nav-links a[data-section]");
  const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
  if (!navLinks.length || !sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
  setActive("home"); // sensible default before any scrolling occurs
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const year = new Date().getFullYear();
  mount.innerHTML = `
    <div class="footer-row">
      <span>© ${year} Liam McBride</span>
      <span>
        <a href="https://github.com/lmcbride053" target="_blank" rel="noopener">GitHub</a> ·
        <a href="https://linkedin.com/in/liam-mcbride-2b413019b" target="_blank" rel="noopener">LinkedIn</a> ·
        <a href="mailto:lmcbride053@gmail.com">Email</a>
      </span>
    </div>
    <div class="footer-credit">Built with HTML, CSS &amp; JavaScript — no framework. Set in Newsreader &amp; IBM Plex. Hosted on GitHub Pages.</div>
  `;
}

// ---------- Hero scatter (UMAP/PCA-style animated cluster plot) ----------
// Pine-dominant palette: three pine tones carry the motif, with a single
// small clay accent cluster -- restraint over competing colors.
function renderHeroScatter() {
  const el = document.getElementById("hero-scatter");
  if (!el) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const width = 600;
  const height = 460;
  const clusters = [
    { cx: 150, cy: 160, color: "#2F6F4E", n: 26, spread: 55 }, // pine
    { cx: 430, cy: 120, color: "#4E8A69", n: 20, spread: 45 }, // lighter pine
    { cx: 330, cy: 340, color: "#1F4E36", n: 22, spread: 50 }, // pine-dark
    { cx: 480, cy: 320, color: "#A8481F", n: 10, spread: 30 }, // clay, small accent only
  ];

  let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">`;

  // simple seeded-ish random via mulberry32 for stable-looking layout
  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(42);

  clusters.forEach((cluster) => {
    for (let i = 0; i < cluster.n; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = rand() * cluster.spread;
      const x = (cluster.cx + Math.cos(angle) * radius).toFixed(1);
      const y = (cluster.cy + Math.sin(angle) * radius).toFixed(1);
      const r = (2 + rand() * 3).toFixed(1);
      const dx = (rand() * 10 - 5).toFixed(1);
      const dy = (rand() * 10 - 5).toFixed(1);
      const delay = (rand() * 4).toFixed(2);
      const opacity = (0.35 + rand() * 0.45).toFixed(2);
      const style = prefersReducedMotion
        ? ""
        : ` style="--dx:${dx}px;--dy:${dy}px;animation-delay:${delay}s"`;
      const cls = prefersReducedMotion ? "" : "scatter-dot";
      svg += `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}" fill="${cluster.color}" opacity="${opacity}"${style}></circle>`;
    }
  });

  svg += `</svg>`;
  el.innerHTML = svg;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderHeroScatter();
});
