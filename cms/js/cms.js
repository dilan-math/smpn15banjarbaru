(function () {
  "use strict";
  const page = document.body.dataset.page || "dashboard";
  const key = "smpn15banjarbaru_cms_";
  const defaults = {
    berita: [
      { id: 1, judul: "SMP Negeri 15 Banjarbaru Raih Prestasi di Ajang Sains", ringkasan: "Siswa SMP Negeri 15 Banjarbaru kembali menunjukkan semangat belajar melalui kompetisi sains tingkat kota.", kategori: "prestasi", tanggal: "12 Juni 2026" },
      { id: 2, judul: "Masa Pengenalan Lingkungan Sekolah Berlangsung Edukatif", ringkasan: "Kegiatan pengenalan sekolah membangun karakter, kedisiplinan, dan semangat kebersamaan peserta didik baru.", kategori: "kegiatan", tanggal: "8 Juni 2026" }
    ],
    galeri: [
      { id: 1, judul: "Kegiatan pembelajaran", gambar: "", deskripsi: "Suasana belajar yang aktif dan menyenangkan." },
      { id: 2, judul: "Upacara bendera", gambar: "", deskripsi: "Menumbuhkan disiplin dan cinta tanah air." }
    ],
    pengumuman: [
      { id: 1, judul: "Informasi Penerimaan Murid Baru", isi: "Informasi jadwal dan persyaratan penerimaan murid baru akan diumumkan melalui kanal resmi sekolah.", tanggal: "1 Juni 2026", status: "aktif" }
    ]
  };
  const labels = { berita: "Berita", galeri: "Galeri", pengumuman: "Pengumuman" };
  function read(type) {
    try { return JSON.parse(localStorage.getItem(key + type)) || defaults[type]; } catch (_) { return defaults[type]; }
  }
  function write(type, data) { localStorage.setItem(key + type, JSON.stringify(data)); }
  function toast(message) {
    const el = document.querySelector(".toast");
    if (!el) return;
    el.textContent = message; el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2600);
  }
  function download(type) {
    const blob = new Blob([JSON.stringify(read(type), null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = type + ".json"; link.click();
    URL.revokeObjectURL(link.href);
  }
  function formFields(type, item) {
    if (type === "berita") return `
      <div class="field full"><label>Judul berita</label><input name="judul" required value="${esc(item.judul || "")}"></div>
      <div class="field"><label>Kategori</label><select name="kategori"><option ${item.kategori==="akademik"?"selected":""}>akademik</option><option ${item.kategori==="kegiatan"?"selected":""}>kegiatan</option><option ${item.kategori==="prestasi"?"selected":""}>prestasi</option></select></div>
      <div class="field"><label>Tanggal</label><input name="tanggal" required value="${esc(item.tanggal || "")}"></div>
      <div class="field full"><label>Ringkasan</label><textarea name="ringkasan" required>${esc(item.ringkasan || "")}</textarea></div>`;
    if (type === "galeri") return `
      <div class="field full"><label>Judul foto</label><input name="judul" required value="${esc(item.judul || "")}"></div>
      <div class="field full"><label>URL gambar (opsional)</label><input name="gambar" type="url" value="${esc(item.gambar || "")}" placeholder="https://..."></div>
      <div class="field full"><label>Deskripsi</label><textarea name="deskripsi">${esc(item.deskripsi || "")}</textarea></div>`;
    return `
      <div class="field full"><label>Judul pengumuman</label><input name="judul" required value="${esc(item.judul || "")}"></div>
      <div class="field"><label>Tanggal</label><input name="tanggal" required value="${esc(item.tanggal || "")}"></div>
      <div class="field"><label>Status</label><select name="status"><option ${item.status==="aktif"?"selected":""}>aktif</option><option ${item.status==="arsip"?"selected":""}>arsip</option></select></div>
      <div class="field full"><label>Isi pengumuman</label><textarea name="isi" required>${esc(item.isi || "")}</textarea></div>`;
  }
  function esc(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char])); }
  function openEditor(type, item) {
    const modal = document.querySelector(".modal-backdrop");
    modal.querySelector("h2").textContent = item ? "Edit " + labels[type] : "Tambah " + labels[type];
    modal.querySelector(".form-grid").innerHTML = formFields(type, item || {});
    modal.querySelector("form").dataset.type = type; modal.querySelector("form").dataset.id = item ? item.id : "";
    modal.classList.add("open"); modal.querySelector("input")?.focus();
  }
  function setupEditor(type) {
    document.querySelector("[data-add]")?.addEventListener("click", () => openEditor(type));
    document.querySelector("[data-export]")?.addEventListener("click", () => { download(type); toast("File JSON berhasil diunduh"); });
    document.querySelector("[data-reset]")?.addEventListener("click", () => {
      if (!confirm("Kembalikan data contoh untuk halaman ini?")) return;
      localStorage.removeItem(key + type); location.reload();
    });
    document.querySelector(".modal-backdrop")?.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal-backdrop") || event.target.closest("[data-close]")) event.currentTarget.classList.remove("open");
    });
    document.querySelector(".modal form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget, data = Object.fromEntries(new FormData(form).entries());
      let items = read(type), id = Number(form.dataset.id);
      if (id) items = items.map(item => item.id === id ? { ...item, ...data } : item);
      else items.push({ ...data, id: Date.now() });
      write(type, items); form.closest(".modal-backdrop").classList.remove("open"); render(type); toast("Perubahan disimpan di browser ini");
    });
    render(type);
  }
  function render(type) {
    const body = document.querySelector("[data-table-body]"); if (!body) return;
    const items = read(type);
    body.innerHTML = items.length ? items.map(item => {
      const title = item.judul, detail = item.ringkasan || item.deskripsi || item.isi || "";
      const status = item.status || item.kategori || "";
      return `<tr><td><strong>${esc(title)}</strong><p>${esc(detail)}</p></td><td><span class="tag ${status==="aktif"?"green":status==="prestasi"?"orange":""}">${esc(status || "—")}</span></td><td>${esc(item.tanggal || "—")}</td><td><div class="row-actions"><button class="button secondary small" data-edit="${item.id}">Edit</button><button class="button danger small" data-delete="${item.id}">Hapus</button></div></td></tr>`;
    }).join("") : `<tr><td colspan="4" class="empty">Belum ada data.</td></tr>`;
    body.querySelectorAll("[data-edit]").forEach(button => button.onclick = () => openEditor(type, items.find(item => item.id === Number(button.dataset.edit))));
    body.querySelectorAll("[data-delete]").forEach(button => button.onclick = () => {
      if (!confirm("Hapus data ini?")) return;
      write(type, items.filter(item => item.id !== Number(button.dataset.delete))); render(type); toast("Data dihapus");
    });
  }
  function setupDashboard() {
    document.querySelectorAll("[data-count]").forEach(el => { el.textContent = read(el.dataset.count).length; });
  }
  if (page === "dashboard") setupDashboard(); else if (labels[page]) setupEditor(page);
})();