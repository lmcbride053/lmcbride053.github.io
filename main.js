// ============================================================
// Liam McBride — Portfolio
// Shared site behavior: nav injection, mobile toggle,
// animated hero scatter (UMAP-style), project tag filtering
// ============================================================

const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About" },
  { href: "projects.html", label: "Projects" },
  { href: "contact.html", label: "Contact" },
];

function currentPage() {
  const path = window.location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
}

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const page = currentPage();

  const links = NAV_LINKS.map(
    (l) =>
      `<li><a href="${l.href}"${l.href === page ? ' class="active" aria-current="page"' : ""}>${l.label}</a></li>`
  ).join("");

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
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const year = new Date().getFullYear();
  mount.innerHTML = `
    <div class="footer-row">
      <span>© ${year} Liam McBride</span>
      <span>
        <a href="https://github.com/yourname" target="_blank" rel="noopener">GitHub</a> ·
        <a href="https://linkedin.com/in/liam-mcbride-2b413019b" target="_blank" rel="noopener">LinkedIn</a> ·
        <a href="mailto:lmcbride053@gmail.com">Email</a>
      </span>
    </div>
  `;
}

// ---------- Hero scatter (UMAP/PCA-style animated cluster plot) ----------
function renderHeroScatter() {
  const el = document.getElementById("hero-scatter");
  if (!el) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const width = 600;
  const height = 460;
  const clusters = [
    { cx: 150, cy: 160, color: "#2F6F4E", n: 26, spread: 55 },
    { cx: 430, cy: 120, color: "#A8481F", n: 20, spread: 45 },
    { cx: 330, cy: 340, color: "#3A5A8C", n: 22, spread: 50 },
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

// ---------- Project tag filtering (projects.html only) ----------
function initProjectFilter() {
  const bar = document.getElementById("filter-bar");
  const cards = document.querySelectorAll("[data-tags]");
  if (!bar || cards.length === 0) return;

  const allTags = new Set();
  cards.forEach((c) => c.dataset.tags.split(",").forEach((t) => allTags.add(t.trim())));

  const tagButtons = ['<span class="label">Filter:</span>', `<button class="tag active" data-filter="all">All</button>`];
  [...allTags].sort().forEach((t) => {
    tagButtons.push(`<button class="tag" data-filter="${t}">${t}</button>`);
  });
  bar.innerHTML = tagButtons.join(" ");

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button.tag");
    if (!btn) return;
    bar.querySelectorAll("button.tag").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      const tags = card.dataset.tags.split(",").map((t) => t.trim());
      const show = filter === "all" || tags.includes(filter);
      card.style.display = show ? "" : "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderHeroScatter();
  initProjectFilter();
});
