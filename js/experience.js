const DEFAULT_ABOUT = "Tuliskan gambaran singkat tentang perusahaan/institusi ini di sini — bidang usaha, skala, dan hal lain yang relevan.";
const DEFAULT_DIVISION = "Tuliskan nama divisi/departemen tempat ditempatkan di sini.";
const DEFAULT_JOBDESC = [
  "Tuliskan tanggung jawab atau tugas utama pertama di sini.",
  "Tuliskan tanggung jawab atau tugas utama kedua di sini.",
  "Tuliskan tanggung jawab atau tugas utama ketiga di sini."
];
const DEFAULT_RESULTS = [
  { title: "Hasil Kerja 1", desc: "Deskripsikan output, deliverable, atau pencapaian di sini." },
  { title: "Hasil Kerja 2", desc: "Deskripsikan output, deliverable, atau pencapaian di sini." }
];
const PHOTO_COUNT = 5;

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderNotFound() {
  document.getElementById('detailRoot').innerHTML = `
    <div class="container detail-empty">
      <h1>Pengalaman tidak ditemukan</h1>
      <p class="muted">Data untuk pengalaman ini belum tersedia.</p>
      <a href="index.html#experience" class="btn btn-pill btn-dark">← Kembali ke Portfolio</a>
    </div>
  `;
}

function renderExperience(id, data) {
  document.title = `${data.role} — ${data.company} | Valina Awwaliyah Putri`;

  document.getElementById('dDate').textContent = data.date;
  const durationEl = document.getElementById('dDuration');
  if (durationEl) durationEl.textContent = data.date;
  document.getElementById('dIcon').textContent = data.icon || "💼";
  document.getElementById('dRole').textContent = data.role;
  document.getElementById('dCompany').textContent = data.company;

  document.getElementById('dAbout').textContent = data.about || DEFAULT_ABOUT;
  document.getElementById('dDivision').textContent = data.division || DEFAULT_DIVISION;

  const jobDesc = (data.jobDesc && data.jobDesc.length) ? data.jobDesc : DEFAULT_JOBDESC;
  const jobDescEl = document.getElementById('dJobDesc');
  jobDescEl.innerHTML = jobDesc.map(item => `<li>${item}</li>`).join('');

  const results = (data.results && data.results.length) ? data.results : DEFAULT_RESULTS;
  const resultsEl = document.getElementById('dResults');
  resultsEl.innerHTML = results.map(r => `
    <div class="result-card">
      <h4>${r.title}</h4>
      <p class="muted">${r.desc}</p>
    </div>
  `).join('');

  const galleryEl = document.getElementById('dGallery');
  let photosHtml = '';
  for (let i = 1; i <= PHOTO_COUNT; i++) {
    photosHtml += `
      <div class="photo-slot">
        <span class="photo-slot-icon">📷</span>
        <span class="photo-slot-label">Foto ${i}</span>
      </div>
    `;
  }
  galleryEl.innerHTML = photosHtml;
}

(function init() {
  const id = getParam('id');
  const data = id && window.EXPERIENCE_DATA ? window.EXPERIENCE_DATA[id] : null;

  if (!data) {
    renderNotFound();
    return;
  }

  renderExperience(id, data);
})();
