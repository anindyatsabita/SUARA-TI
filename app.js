const categories = [
  "Akademik",
  "Fasilitas",
  "Bullying dan Kekerasan",
  "Administrasi",
  "Keuangan dan Beasiswa",
  "Teknologi dan Sistem Informasi",
  "Lainnya",
];

const statuses = {
  complete: { label: "Sudah Tuntas", icon: "✓" },
  progress: { label: "Sedang Diproses", icon: "◷" },
  pending: { label: "Belum Diproses", icon: "!" },
};

// Contoh aspirasi untuk demo; kiriman formulir tidak disimpan ke daftar ini.
const aspirations = [
  {
    id: "asp-01",
    category: "Akademik",
    status: "complete",
    text: "Mohon penambahan jadwal konsultasi akademik dengan dosen pembimbing agar mahasiswa lebih mudah berdiskusi mengenai rencana studi dan tugas akhir.",
    date: "24 Maret 2020, 12.07 WIB",
    progress: "Jadwal konsultasi tambahan telah dibuka. Mahasiswa dapat menghubungi program studi untuk memilih waktu yang tersedia.",
  },
  {
    id: "asp-02",
    category: "Fasilitas",
    status: "progress",
    text: "Beberapa komputer di laboratorium sering mengalami kendala saat digunakan untuk praktikum. Mohon dilakukan pemeriksaan dan pembaruan perangkat secara berkala.",
    date: "12 April 2020, 09.30 WIB",
    progress: "Pemeriksaan perangkat laboratorium sedang dikoordinasikan dengan pengelola fasilitas.",
  },
  {
    id: "asp-03",
    category: "Bullying dan Kekerasan",
    status: "pending",
    text: "Mohon tersedia kanal pelaporan yang aman dan mudah diakses bagi mahasiswa yang mengalami atau menyaksikan perundungan maupun kekerasan di lingkungan kampus.",
    date: "18 April 2020, 14.15 WIB",
    progress: "Aspirasi telah diterima dan menunggu peninjauan oleh pihak terkait.",
  },
  {
    id: "asp-04",
    category: "Administrasi",
    status: "complete",
    text: "Informasi mengenai proses pengajuan surat keterangan aktif kuliah diharapkan dapat dipublikasikan dalam satu halaman agar mudah ditemukan.",
    date: "21 April 2020, 10.00 WIB",
    progress: "Panduan pengajuan surat telah dirangkum dan dapat diakses melalui kanal informasi program studi.",
  },
  {
    id: "asp-05",
    category: "Keuangan dan Beasiswa",
    status: "progress",
    text: "Mohon informasi jadwal dan persyaratan beasiswa disampaikan lebih awal supaya mahasiswa mempunyai waktu yang cukup untuk mempersiapkan dokumen.",
    date: "26 April 2020, 08.45 WIB",
    progress: "Informasi beasiswa sedang dihimpun dan akan disampaikan melalui kanal resmi program studi.",
  },
  {
    id: "asp-06",
    category: "Teknologi dan Sistem Informasi",
    status: "pending",
    text: "Portal akademik terkadang sulit diakses pada masa pengisian KRS. Mohon kapasitas sistem dan panduan penanganan kendala dapat ditingkatkan.",
    date: "2 Mei 2020, 11.20 WIB",
    progress: "Aspirasi telah diterima dan menunggu koordinasi dengan pengelola sistem informasi.",
  },
  {
    id: "asp-07",
    category: "Lainnya",
    status: "complete",
    text: "Akan sangat membantu apabila tersedia papan informasi kegiatan mahasiswa yang memuat agenda organisasi dan acara di lingkungan program studi.",
    date: "5 Mei 2020, 15.10 WIB",
    progress: "Papan informasi kegiatan mahasiswa telah disediakan pada kanal komunikasi program studi.",
  },
];

const page = document.body.dataset.page;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createStatusBadge(status) {
  const info = statuses[status];
  return `<span class="status-badge status-${status}"><span aria-hidden="true">${info.icon}</span>${info.label}</span>`;
}

function createHistoryCard(item, index) {
  const excerpt = item.text.length > 205 ? `${item.text.slice(0, 205).trimEnd()}…` : item.text;
  return `
    <article class="history-card panel-card reveal" style="--reveal-delay:${Math.min(index, 6) * 55}ms">
      <div class="history-copy">
        <span class="category-chip">${item.category}</span>
        <p>${excerpt}</p>
      </div>
      <div class="history-progress">
        <span class="progress-label">Progress</span>
        ${createStatusBadge(item.status)}
        <a class="button button-light detail-link" href="detail.html?id=${encodeURIComponent(item.id)}">Lihat Detail</a>
      </div>
    </article>`;
}

function fillFilterOptions() {
  document.querySelectorAll('[data-filter="category"]').forEach((select) => {
    select.innerHTML = `<option value="">Semua Kategori</option>${categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("")}`;
  });
  document.querySelectorAll('[data-filter="status"]').forEach((select) => {
    select.innerHTML = `<option value="">Semua Status</option>${Object.entries(statuses)
      .map(([value, status]) => `<option value="${value}">${status.label}</option>`)
      .join("")}`;
  });
}

function renderHistory(list) {
  document.querySelectorAll("[data-history-list]").forEach((container) => {
    container.innerHTML = list.map(createHistoryCard).join("");
    container.querySelectorAll(".reveal").forEach((card) => revealObserver?.observe(card));
  });
  document.querySelectorAll("[data-empty-state]").forEach((empty) => {
    empty.hidden = list.length !== 0;
  });
}

function setupFilters() {
  const categoryFilters = [...document.querySelectorAll('[data-filter="category"]')];
  const statusFilters = [...document.querySelectorAll('[data-filter="status"]')];
  const searchFields = [...document.querySelectorAll('[data-filter="search"]')];
  if (!categoryFilters.length && !statusFilters.length && !searchFields.length) return;

  const update = () => {
    const category = categoryFilters[0]?.value || "";
    const status = statusFilters[0]?.value || "";
    const query = (searchFields[0]?.value || "").trim().toLocaleLowerCase("id");
    categoryFilters.slice(1).forEach((field) => { field.value = category; });
    statusFilters.slice(1).forEach((field) => { field.value = status; });
    searchFields.slice(1).forEach((field) => { field.value = searchFields[0].value; });
    const filtered = aspirations.filter((item) =>
      (!category || item.category === category)
      && (!status || item.status === status)
      && (!query || `${item.category} ${item.text} ${statuses[item.status].label}`.toLocaleLowerCase("id").includes(query)),
    );
    renderHistory(filtered);
  };

  [...categoryFilters, ...statusFilters].forEach((field) => field.addEventListener("change", update));
  searchFields.forEach((field) => field.addEventListener("input", update));
  update();
}

let revealObserver;

function setupReveals() {
  const elements = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => revealObserver.observe(element));
}

function setupCountUp() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const animate = (element) => {
    const target = Number(element.dataset.count);
    if (reducedMotion) {
      element.textContent = target.toLocaleString("id-ID");
      return;
    }
    const duration = 1100;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = Math.round(target * eased).toLocaleString("id-ID");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (reducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => observer.observe(counter));
}

function setupForm() {
  const form = document.querySelector("#aspiration-form");
  if (!form) return;
  const textarea = form.querySelector("#aspiration");
  const counter = form.querySelector("[data-character-count]");
  const fileInput = form.querySelector("#attachment");
  const uploadArea = form.querySelector("[data-upload-area]");
  const uploadName = form.querySelector("[data-upload-name]");
  const uploadFeedback = form.querySelector("[data-upload-feedback]");
  const dialog = document.querySelector("[data-confirm-dialog]");
  const toast = document.querySelector("[data-toast]");
  let toastTimer;

  const showToast = (message) => {
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3500);
  };

  textarea.addEventListener("input", () => {
    counter.textContent = textarea.value.length;
  });

  const validateFile = () => {
    const file = fileInput.files[0];
    uploadFeedback.textContent = "";
    if (!file) return true;
    const allowed = /\.(jpe?g|png|pdf)$/i.test(file.name);
    if (!allowed) {
      uploadFeedback.textContent = "Format file harus JPG, PNG, atau PDF.";
      fileInput.value = "";
      uploadName.textContent = "Pilih file atau seret ke sini";
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      uploadFeedback.textContent = "Ukuran file melebihi batas maksimal 5 MB.";
      fileInput.value = "";
      uploadName.textContent = "Pilih file atau seret ke sini";
      return false;
    }
    uploadName.textContent = file.name;
    uploadName.classList.remove("file-enter");
    requestAnimationFrame(() => uploadName.classList.add("file-enter"));
    return true;
  };

  fileInput.addEventListener("change", validateFile);
  ["dragenter", "dragover"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadArea.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadArea.classList.remove("is-dragging");
    });
  });
  uploadArea.addEventListener("drop", (event) => {
    const [file] = event.dataTransfer.files;
    if (!file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.files = transfer.files;
    validateFile();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateFile()) {
      fileInput.focus();
      return;
    }
    if (form.reportValidity()) dialog.showModal();
  });

  document.querySelector("[data-confirm-cancel]").addEventListener("click", () => dialog.close());
  document.querySelector("[data-confirm-submit]").addEventListener("click", () => {
    dialog.close();
    form.reset();
    counter.textContent = "0";
    uploadName.textContent = "Pilih file atau seret ke sini";
    uploadFeedback.textContent = "";
    showToast("Simulasi berhasil. Aspirasi tidak disimpan karena situs ini belum terhubung ke backend.");
  });
}

function setupDetail() {
  const card = document.querySelector("[data-detail-card]");
  if (!card) return;
  const requestedId = new URLSearchParams(window.location.search).get("id");
  const item = aspirations.find((aspiration) => aspiration.id === requestedId);
  if (!item) {
    card.innerHTML = '<p class="empty-state">Aspirasi tidak ditemukan. Silakan kembali ke daftar riwayat.</p>';
    document.querySelector("[data-progress-copy]").textContent = "Informasi progress tidak tersedia.";
    return;
  }
  card.innerHTML = `
    <span class="category-chip">${item.category}</span>
    <h2>Isi Aspirasi</h2>
    <p class="detail-copy">${item.text}</p>
    <div class="detail-meta">
      <div><h3>Waktu</h3><p>${item.date}</p></div>
      <div><h3>Status Progress</h3>${createStatusBadge(item.status)}</div>
    </div>`;
  document.querySelector("[data-progress-copy]").textContent = item.progress;
}

function setupButtonsAndNavigation() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".button");
    if (button && !reducedMotion) {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.append(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    }

    const link = event.target.closest("a[href]");
    if (!link || reducedMotion || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || link.target || link.origin !== window.location.origin
      || link.pathname === window.location.pathname
      || link.hash && link.pathname === window.location.pathname) return;
    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => { window.location.href = link.href; }, 170);
  });
}

fillFilterOptions();
setupReveals();
setupCountUp();
setupFilters();
setupForm();
setupDetail();
setupButtonsAndNavigation();
