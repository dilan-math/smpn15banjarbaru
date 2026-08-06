/*
 * Small, dependency-free runtime for GitHub Pages.
 * It restores the two scripts referenced by the source export and connects
 * the public news area to the editable JSON files.
 */
(function () {
  "use strict";
  const replacements = [
    ["SMP LABSCHOOL JAKARTA", "SMP NEGERI 15 BANJARBARU"],
    ["SMP LABSCHOOL", "SMP NEGERI 15"],
    ["SMP Labschool Jakarta", "SMP Negeri 15 Banjarbaru"],
    ["Labschool Jakarta", "SMP Negeri 15 Banjarbaru"],
    ["SMP Labschool", "SMP Negeri 15"],
    ["LBS", "SMPN 15"],
    ["JAKARTA", "BANJARBARU"],
    ["Jakarta Timur, DKI Jakarta 13220", "Banjarbaru, Kalimantan Selatan 70714"],
    ["Jl. Pemuda No.10, Rawamangun", "Jl. Pendidikan No. 15, Banjarbaru"],
    ["(021) 480 1525", "(0511) 477 1515"],
    ["info@labschool-jkt.sch.id", "info@smpn15banjarbaru.sch.id"],
    ["PPDB 2025/2026", "PPDB 2026/2027"]
  ];

  function replaceText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue;
      replacements.forEach(([from, to]) => { value = value.split(from).join(to); });
      if (value !== node.nodeValue) node.nodeValue = value;
    });
    root.querySelectorAll("img, input, textarea").forEach((el) => {
      ["alt", "placeholder", "title"].forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        let value = el.getAttribute(attr);
        replacements.forEach(([from, to]) => { value = value.split(from).join(to); });
        el.setAttribute(attr, value);
      });
    });
  }

  function updateMetadata() {
    document.title = "SMP Negeri 15 Banjarbaru | Sekolah Berkarakter dan Berprestasi";
    let icon = document.querySelector('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = new URL("favicon.svg", window.location.href).href;
    [
      ["og:title", document.title],
      ["og:description", "Website resmi SMP Negeri 15 Banjarbaru."],
      ["og:type", "website"]
    ].forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = "Website resmi SMP Negeri 15 Banjarbaru, sekolah negeri yang berkomitmen membentuk generasi berkarakter, berprestasi, dan berwawasan global.";
    let keywords = document.querySelector('meta[name="keywords"]');
    if (!keywords) {
      keywords = document.createElement("meta");
      keywords.name = "keywords";
      document.head.appendChild(keywords);
    }
    keywords.content = "SMP Negeri 15 Banjarbaru, sekolah Banjarbaru, pendidikan Kalimantan Selatan, PPDB";
  }

  async function loadNews() {
    try {
      const response = await fetch("data/berita.json", { cache: "no-store" });
      if (!response.ok) return;
      const items = await response.json();
      const cards = [...document.querySelectorAll("[data-news]")];
      items.slice(0, cards.length).forEach((item, index) => {
        const card = cards[index];
        const title = card.querySelector("h3");
        const description = card.querySelector("p");
        const date = card.querySelector("span:last-of-type");
        const category = card.querySelector("span");
        if (title) title.textContent = item.judul;
        if (description) description.textContent = item.ringkasan;
        if (date) date.textContent = item.tanggal;
        if (category) category.textContent = item.kategori.toUpperCase();
        card.dataset.category = item.kategori;
      });
    } catch (_) {
      // A static copy must remain useful when opened offline.
    }
  }

  function apply() {
    // The exported design renders its header as a component root rather than
    // a literal <header>, so use the rendered body as the readiness signal.
    if (!document.body || !document.body.textContent) return false;
    replaceText(document.body);
    updateMetadata();
    loadNews();
    document.documentElement.dataset.schoolBrand = "smpn15banjarbaru";
    const logo = document.querySelector("image-slot#logo-emblem");
    if (logo && !logo.querySelector("[data-school-mark]")) {
      logo.innerHTML = '<span data-school-mark style="display:grid;place-items:center;width:100%;height:100%;font-size:12px;font-weight:800;color:#0B5ED7;letter-spacing:-.06em">15</span>';
    }
    return true;
  }

  let attempts = 0;
  const timer = setInterval(() => {
    if (apply() || ++attempts > 80) clearInterval(timer);
  }, 150);
  if (document.readyState !== "loading") apply();
  else document.addEventListener("DOMContentLoaded", apply, { once: true });
})();