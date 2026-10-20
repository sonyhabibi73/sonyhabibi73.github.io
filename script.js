/* ============================================================
   1) ISI URL PROYEK DI BAGIAN INI AJA
   ------------------------------------------------------------
   Ganti tanda "..." dengan link aslimu.
   - live : alamat website yang bisa dibuka (hasil hosting)
   - repo : alamat repository di GitHub

   Contoh:
     senjapustaka: {
       live: "https://senjapustaka.vercel.app",
       repo: "https://github.com/sonyhabibi/senjapustaka",
     },
   Kalau live dikosongkan, tombolnya otomatis disembunyikan.
   ============================================================ */

const PROJECT_LINKS = {
  senjapustaka: { live: "...", repo: "https://github.com/sonyhabibi73/SenjaPustaka" },
  website:     { live: "...", repo: "https://github.com/sonyhabibi73/website-berita" },
  game:        { live: "https://penjaga-ladang.netlify.app", repo: "..." },
  rokenai:     { live: "...", repo: "https://github.com/mifada2543/RoKenAI" },
};

/* Neobrutalist PKL Portfolio — interactions */

// ============ MOBILE NAV ============
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
});

// Tutup menu saat link diklik (mobile)
navMenu.addEventListener("click", (e) => {
  if (e.target.matches(".nav-link")) {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ============ CUSTOM PIXEL CURSOR ============
(() => {
  // hidup di mouse/trackpad; dimatikan hanya di layar sentuh (coarse)
  const coarse = window.matchMedia("(any-pointer: coarse)");
  const canHover = window.matchMedia("(any-hover: hover)");
  if (coarse.matches && !canHover.matches) return;

  const root = document.documentElement;
  const main = document.createElement("div");
  main.className = "px-cursor";
  main.setAttribute("aria-hidden", "true");
  const dot = document.createElement("div");
  dot.className = "px-cursor-dot";
  dot.setAttribute("aria-hidden", "true");
  document.body.append(main, dot);
  root.classList.add("has-cursor");

  const HOVER_SEL = 'a, button, input, textarea, select, [role="button"], label';
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let dx = mx, dy = my;
  let raf = null;

  const move = (e) => {
    mx = e.clientX;
    my = e.clientY;
    // posisi utama langsung (pixel: tak ada smoothing)
    main.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    if (!raf) raf = requestAnimationFrame(follow);
  };

  // titik pink mengejar dengan sedikit jeda -> kesan_chunky
  const follow = () => {
    dx += (mx - dx) * 0.22;
    dy += (my - dy) * 0.22;
    dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    if (Math.abs(mx - dx) > 0.5 || Math.abs(my - dy) > 0.5) {
      raf = requestAnimationFrame(follow);
    } else {
      raf = null;
    }
  };

  document.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerleave", () => {
    main.style.opacity = "0";
    dot.style.opacity = "0";
  });
  document.addEventListener("pointerenter", () => {
    main.style.opacity = "1";
    dot.style.opacity = "1";
  });

  // membesar saat di atas elemen interaktif
  document.addEventListener(
    "pointerover",
    (e) => {
      if (e.target instanceof Element && e.target.closest(HOVER_SEL)) {
        main.classList.add("is-hover");
      }
    },
    { passive: true }
  );
  document.addEventListener(
    "pointerout",
    (e) => {
      if (e.target instanceof Element && e.target.closest(HOVER_SEL)) {
        main.classList.remove("is-hover");
      }
    },
    { passive: true }
  );

  // klik -> cursorgentar sedikit (tekan-tahan)
  document.addEventListener(
    "pointerdown",
    () => main.classList.add("is-press"),
    { passive: true }
  );
  document.addEventListener(
    "pointerup",
    () => main.classList.remove("is-press"),
    { passive: true }
  );
})();

// ============ FLOATING NAV (dock saat scroll) ============
const navWrap = document.querySelector(".nav-wrap");
const topBar = document.querySelector(".top-bar");
function syncHeader() {
  const topbarH = topBar ? topBar.offsetHeight : 0;
  document.documentElement.style.setProperty("--topbar-h", `${topbarH}px`);
  navWrap.classList.toggle("is-scrolled", window.scrollY > topbarH + 10);
}
window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("resize", syncHeader);
syncHeader();

// ============ STAT COUNTER (animate on view) ============
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stats = document.querySelectorAll(".stat__num");

function animateCount(el) {
  const target = Number(el.dataset.count) || 0;
  if (reduceMotion) {
    el.textContent = target;
    return;
  }
  const duration = 900;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

stats.forEach((el) => statsObserver.observe(el));

// ============ ACTIVE NAV LINK ============
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", active);
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((sec) => sectionObserver.observe(sec));

// ============ PROJECT SLIDER (grid, geser per halaman) ============
(() => {
  const root = document.querySelector("[data-projects-slider]");
  if (!root) return;
  const grid = root.querySelector(".projects");
  const items = [...grid.children];
  const prevBtn = root.querySelector("[data-projects-prev]");
  const nextBtn = root.querySelector("[data-projects-next]");
  const nowOut = root.querySelector("#projectsNow");
  const totalOut = root.querySelector("#projectsTotal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pad = (n) => String(n).padStart(2, "0");
  const perView = () =>
    window.matchMedia("(max-width: 719px)").matches ? 1
    : window.matchMedia("(max-width: 1023px)").matches ? 2
    : 3;

  let page = 0;
  let pages = 1;

  const layout = () => {
    const cols = perView();
    pages = Math.max(1, Math.ceil(items.length / cols));
    page = Math.min(page, pages - 1);

    items.forEach((el, i) => {
      const inPage = Math.floor(i / cols) === page;
      el.style.display = inPage ? "" : "none";
      el.style.opacity = "1";
    });

    grid.style.transform = "";

    nowOut.textContent = pad(page + 1);
    totalOut.textContent = pad(pages);
    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === pages - 1;
  };

  const go = (n) => {
    const target = Math.max(0, Math.min(n, pages - 1));
    if (target === page) return;
    page = target;
    if (!reduceMotion) {
      items.forEach((el) => { el.style.opacity = "0.2"; });
    }
    layout();
    if (!reduceMotion) {
      requestAnimationFrame(() => {
        items.forEach((el) => {
          if (el.style.display !== "none") el.style.opacity = "1";
        });
      });
    }
  };

  nextBtn.addEventListener("click", () => go(page + 1));
  prevBtn.addEventListener("click", () => go(page - 1));

  root.setAttribute("tabindex", "0");
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(page + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(page - 1); }
  });

  let startX = null;
  root.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) go(page + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  window.addEventListener("resize", layout);
  layout();
})();

// ============ CONTACT FORM ============
// Pengiriman: Formspree (gratis, tanpa backend).
//   1. Buka https://formspree.io → daftar dengan email songhabibi73@gmail.com
//   2. Buat form baru → salin ID-nya (contoh: "mvgprjqz")
//   3. Tempel ID itu di FORM_ID di bawah
const FORM_ID = "xyekaozk";
const FORM_ENDPOINT = `https://formspree.io/f/${FORM_ID}`;
const CONTACT_EMAIL = "songhabibi73@gmail.com";

// Domain email sekali pakai yang umum dipakai untuk spam / coba-coba.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "10minutemail.com", "guerrillamail.com", "guerrillamail.net",
  "sharklasers.com", "yopmail.com", "tempmail.com", "temp-mail.org",
  "throwawaymail.com", "getnada.com", "dispostable.com", "maildrop.cc",
  "fakeinbox.com", "mailnesia.com", "mintemail.com", "mytemp.email",
  "spam4.me", "trashmail.com", "emailondeck.com", "moakt.com",
  "tempr.email", "discard.email", "33mail.com", "mail.tm",
]);

const RATE_KEY = "portfolio:lastMessage";
const RATE_MS = 60 * 1000;
const MIN_FILL_MS = 3000;
const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const submitBtn = form.querySelector('button[type="submit"]');
const submitHTML = submitBtn.innerHTML;
let sending = false;

form.dataset.loadedAt = String(Date.now());

function setStatus(msg, kind = "") {
  status.textContent = msg;
  status.className = "form-status" + (kind ? ` is-${kind}` : "");
}

function flag(field, bad) {
  if (bad) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
  return !bad;
}

function readRate() {
  try {
    return Number(localStorage.getItem(RATE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeRate() {
  try {
    localStorage.setItem(RATE_KEY, String(Date.now()));
  } catch {
    /* mode privat: abaikan */
  }
}

// Pastikan domain email punya server email (record MX).
// Kalau jaringan/DNS gagal, sengaja dianggap lolos supaya pengunjung asli tidak diblokir.
async function domainHasMail(domain) {
  const query = `name=${encodeURIComponent(domain)}&type=MX`;
  const sources = [
    `https://cloudflare-dns.com/dns-query?${query}`,
    `https://dns.google/resolve?${query}`,
  ];
  for (const url of sources) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/dns-json" } });
      if (!res.ok) continue;
      const json = await res.json();
      if (!Array.isArray(json.Answer)) return false;
      return json.Answer.some((a) => a.type === 15);
    } catch {
      /* coba sumber berikutnya */
    }
  }
  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (sending) return;

  const nama = form.elements.nama.value.trim();
  const email = form.elements.email.value.trim().toLowerCase();
  const pesan = form.elements.pesan.value.trim();
  const domain = email.split("@")[1] || "";

  // 1. Honeypot: cuma bot yang mengisi kolom tak terlihat ini.
  if (form.elements.website.value.trim()) {
    setStatus("Pesan terkirim. Terima kasih!", "ok");
    return;
  }

  // 2. Terlalu cepat terisi = bot.
  if (Date.now() - Number(form.dataset.loadedAt) < MIN_FILL_MS) {
    setStatus("Tunggu sebentar, lalu kirim lagi.", "err");
    return;
  }

  // 3. Isi form.
  let valid = true;
  valid = flag(form.elements.nama, nama.length < 2) && valid;
  valid = flag(form.elements.pesan, pesan.length < 5) && valid;

  const badEmail =
    !EMAIL_RE.test(email) || email.length > 120 || DISPOSABLE_DOMAINS.has(domain);
  valid = flag(form.elements.email, badEmail) && valid;

  if (!valid) {
    setStatus(
      badEmail && email
        ? "Email tidak valid. Pakai email asli yang aktif, bukan email sementara."
        : "Mohon lengkapi semua kolom dengan benar.",
      "err"
    );
    return;
  }

  // 4. Satu pesan per menit.
  if (Date.now() - readRate() < RATE_MS) {
    setStatus("Pesan sebelumnya baru terkirim. Tunggu sebentar lagi.", "err");
    return;
  }

  // 5. Domain email harus punya server email.
  setStatus("Memeriksa email...", "wait");
  if (!(await domainHasMail(domain))) {
    flag(form.elements.email, true);
    setStatus("Domain email itu tidak punya server email. Pakai email yang benar.", "err");
    return;
  }

  if (!FORM_ID) {
    setStatus(`Form belum aktif. Kirim langsung ke ${CONTACT_EMAIL}.`, "err");
    console.warn("[contact] FORM_ID masih kosong — isi di script.js.");
    return;
  }

  // 6. Kirim.
  sending = true;
  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-busy", "true");
  submitBtn.textContent = "Mengirim...";
  setStatus("Mengirim pesan...", "wait");

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: nama,
        email,
        message: pesan,
        _subject: `Pesan portofolio dari ${nama}`,
        _gotcha: "",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      throw new Error(data.errors?.[0]?.message || `HTTP ${res.status}`);
    }
    writeRate();
    form.reset();
    form.dataset.loadedAt = String(Date.now());
    setStatus("Pesan terkirim. Terima kasih, saya balas ke email kamu.", "ok");
  } catch (err) {
    console.error("[contact]", err);
    setStatus(
      `Pesan gagal terkirim. Coba lagi, atau email langsung ke ${CONTACT_EMAIL}.`,
      "err"
    );
  } finally {
    sending = false;
    submitBtn.disabled = false;
    submitBtn.removeAttribute("aria-busy");
    submitBtn.innerHTML = submitHTML;
  }
});

// Reset status error saat mengetik
form.addEventListener("input", (e) => {
  if (e.target.hasAttribute("aria-invalid")) {
    e.target.removeAttribute("aria-invalid");
    status.textContent = "";
    status.className = "form-status";
  }
});

// ============ BOOK MODAL (detail proyek ala buku) ============
const BOOKS = {
  senjapustaka: {
    num: "01",
    shot: "assets/shot-1.jpg",
    shotCaption: "Halaman utama — katalog buku dan pencarian",
    cover: "stripes",
    kind: "Web Development · Project",
    title: "SenjaPustaka",
    desc: "Website perpustakaan ebook digital gratis untuk pelajar, dengan fitur pencarian, pembacaan ebook, bookmark, catatan, rating, review, dan profil pengguna.",
    meta: [
      ["Peran", "Full-Stack Developer · project mandiri"],
      ["Stack", "Laravel · MySQL · Chart.js"],
      ["Fokus", "CRUD, autentikasi, dan relasi database"],
    ],
    points: [
      "Pencarian ebook dan pembacaan langsung di browser",
      "Bookmark dan catatan pribadi tiap pengguna",
      "Rating dan review untuk tiap judul buku",
      "Profil pengguna dan riwayat bacaan",
    ],
  },
  website: {
    num: "02",
    shot: "assets/shot-2.jpg",
    shotCaption: "Tampilan desktop dengan menu mode gelap",
    cover: "dots",
    kind: "School / Web · Project",
    title: "Website Sekolah",
    desc: "Project website yang dikerjakan sebagai bagian dari proses belajar pengembangan website di lingkungan sekolah.",
    meta: [
      ["Peran", "Front-End Developer · tugas sekolah"],
      ["Stack", "HTML · CSS · JavaScript"],
      ["Fokus", "Slicing desain dan layout responsif"],
    ],
    points: [
      "Slicing tampilan dari referensi desain",
      "Layout responsif dari mobile sampai desktop",
      "Navigasi antar halaman yang rapi",
      "Formulir kontak dengan validasi dasar",
    ],
  },
  game: {
    num: "03",
    cover: "checker",
    kind: "Game Dev · RPG Maker MZ",
    title: "Penjaga Ladang",
    desc: "Game RPG bertema farming. Shiro mewarisi ladang keluarganya. Dia menanam sayuran dan melawan Goblin serta Treant yang datang ke ladang.",
    shot: "assets/shot-3.jpg",
    shotCaption: "Area ladang utama — petak tanah siap tanam",
    meta: [
      ["Peran", "Game Dev · cerita, map, dan balancing"],
      ["Engine", "RPG Maker MZ"],
      ["Isi", "16 map · 8 kelas · 7 musuh"],
    ],
    points: [
      "Cerita Shiro yang mewarisi ladang peninggalan keluarganya",
      "Sistem bertani: tanam sayuran lalu petik hasilnya",
      "Delapan kelas: Swordsman, Sorcerer, Knight, sampai Hunter",
      "Musuh: Goblin, Gnome, Crow, dan Treant",
      "16 area: ladang, Item Shop, Mountain Village, Stone Cave",
    ],
  },
  rokenai: {
    num: "04",
    cover: "rings",
    kind: "Team Project · AI Platform",
    title: "RoKenAI",
    desc: "Platform pelaporan jalan rusak berbasis AI. Warga cukup memfoto, AI mendeteksi tingkat kerusakan secara otomatis, lalu laporan langsung diproses oleh pemerintah. Dikembangkan bersama teman-teman tim.",
    shot: "assets/shot-4.jpg",
    shotCaption: "Halaman utama platform RoKenAI",
    meta: [
      ["Peran", "Front-end dev · kerja sama tim"],
      ["Tim", "Tim FourJST"],
      ["Tech", "PHP · Tailwind · Python"],
      ["AI", "YOLOv8 · Computer Vision"],
    ],
    points: [
      "Warga cukup foto jalan rusak, tanpa tulis keluhan panjang",
      "Model YOLOv8 mendeteksi lubang dan retak dari foto HP",
      "AI memberi tingkat kerusakan supaya bisa diprioritaskan",
      "Tanya AI untuk konsultasi jenis kerusakan dan rekomendasi",
      "Dashboard admin untuk verifikasi dan lacak perbaikan",
    ],
  },
}

// gabungkan URL dari config di atas ke tiap proyek
for (const [slug, links] of Object.entries(PROJECT_LINKS)) {
  if (!BOOKS[slug]) continue;
  const clean = (v) => (typeof v === "string" && v.trim() && v.trim() !== "..." ? v.trim() : "");
  BOOKS[slug].live = clean(links.live);
  BOOKS[slug].repo = clean(links.repo);
}

// ambil teks ringkas untuk ditampilkan di tombol
// website  -> "senjapustaka.vercel.app"
// github    -> "github.com/sonyhabibi/senjapustaka"
function prettyUrl(url, withPath) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = withPath ? u.pathname.replace(/\/+$/, "") : "";
    return host + path;
  } catch {
    return url;
  }
}

// ---- hiasan sampul kiri: bahasa desain sama, komposisi beda tiap buku ----
// item: [nama stiker, x%, y%, ukuran px, rotasi deg]  ·  "pill" = label teks
const BOOK_DECOR = {
  senjapustaka: {
    accent: "#ffd93d",
    deco: "stripes",
    pill: "Perpustakaan",
    routes: ["M89 35 C 97 48, 93 63, 85 74"],
    items: [
      ["star", 15, 10, 82, -6], ["cloud", 43, 8, 56, 0], ["smiley", 82, 12, 78, 8],
      ["badge", 12, 32, 88, -10], ["pin", 89, 31, 46, 6], ["cross", 30, 23, 22, 0],
      ["sqcheck", 13, 59, 34, 12], ["tri", 88, 51, 28, 0], ["disc", 19, 77, 116, 0],
      ["cursor", 84, 74, 98, -8], ["globe", 46, 89, 46, 0], ["pill", 59, 67, 0, -7],
    ],
  },
  website: {
    accent: "#6e9bff",
    deco: "dots",
    pill: "Web Sekolah",
    routes: ["M88 60 C 95 67, 92 73, 84 77", "M13 37 C 7 44, 9 52, 14 58"],
    items: [
      ["disc", 16, 12, 96, 0], ["cloud", 44, 9, 50, 0], ["bolt", 84, 12, 54, 10],
      ["cross", 62, 26, 22, 0], ["sqcheck", 11, 34, 34, -12], ["badge", 88, 33, 60, 8],
      ["tri", 15, 60, 30, 0], ["pin", 88, 57, 44, 0], ["pill", 46, 68, 0, -5],
      ["cursor", 82, 78, 92, -6], ["globe", 24, 84, 50, 0],
    ],
  },
  game: {
    accent: "#ff5c8a",
    deco: "checker",
    pill: "Farming RPG",
    routes: ["M84 22 C 92 33, 91 45, 86 51"],
    items: [
      ["smiley", 13, 12, 78, 0], ["pin", 44, 8, 44, 8], ["disc", 84, 15, 102, 0],
      ["cross", 32, 24, 20, 0], ["star", 15, 34, 42, -8], ["tri", 88, 41, 28, 0],
      ["sqcheck", 12, 61, 34, 14], ["pill", 60, 67, 0, -6],
      ["cursor", 84, 76, 96, -8], ["cloud", 30, 89, 52, 0], ["globe", 66, 88, 42, 0],
    ],
  },
  rokenai: {
    accent: "#a78bfa",
    deco: "rings",
    pill: "Tim FourJST",
    routes: ["M84 24 C 92 32, 92 39, 88 44"],
    items: [
      ["globe", 14, 13, 58, 0], ["pin", 45, 8, 42, 0], ["target", 84, 14, 92, 0],
      ["cross", 32, 22, 20, 0], ["star", 15, 35, 44, -8], ["bolt", 70, 31, 34, 0],
      ["badge", 88, 45, 48, 0], ["sqcheck", 12, 63, 32, 10], ["pill", 58, 67, 0, -6],
      ["disc", 20, 80, 104, 0], ["cursor", 84, 78, 94, -8],
    ],
  },
  algo: {
    accent: "#43e0b0",
    deco: "grid",
    pill: "Logika",
    routes: ["M88 36 C 95 44, 92 51, 87 55"],
    items: [
      ["code", 15, 12, 78, 0], ["star", 44, 9, 42, 0], ["bolt", 84, 12, 50, 8],
      ["cross", 24, 30, 20, 0], ["sqcheck", 88, 32, 30, 0], ["badge", 13, 45, 62, -8],
      ["tri", 88, 56, 28, 0], ["pill", 56, 67, 0, -6], ["disc", 18, 78, 100, 0],
      ["cursor", 83, 76, 92, -6], ["globe", 52, 89, 44, 0],
    ],
  },
};

const bookStickers = document.getElementById("bookStickers");
const bookBack = document.getElementById("bookBack");

function renderDecor(key, num) {
  const d = BOOK_DECOR[key] || BOOK_DECOR.senjapustaka;
  bookBack.dataset.deco = d.deco;
  bookBack.style.setProperty("--st-accent", d.accent);
  bookStickers.style.setProperty("--st-accent", d.accent);
  const routes = (d.routes || [])
    .map(
      (p) =>
        `<path d="${p}" fill="none" stroke="#161616" stroke-width="2.5" stroke-dasharray="6 7" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`
    )
    .join("");
  const items = d.items
    .map(([name, x, y, s, rot], idx) => {
      const delay = 260 + idx * 42;
      const pos = `--x:${x}%;--y:${y}%;--rot:${rot}deg;--d:${delay}ms`;
      return name === "pill"
        ? `<span class="book__st book__st--pill book__st--pop" style="${pos}">${d.pill}</span>`
        : `<svg class="book__st book__st--pop" style="${pos}--s:${s}px;color:${d.accent}" viewBox="0 0 100 100" aria-hidden="true"><use href="#st-${name}"/></svg>`;
    })
    .join("");
  bookStickers.innerHTML =
    (routes
      ? `<svg class="book__route" viewBox="0 0 100 100" preserveAspectRatio="none">${routes}</svg>`
      : "") + items;
  bookBack.dataset.num = num;
}

const bookOverlay = document.getElementById("bookOverlay");
const book = document.getElementById("book");
const bookCover = document.getElementById("bookCover");
const bookClose = document.getElementById("bookClose");
let lastTrigger = null;
let bookHideTimer = null;

function fillBook(key) {
  const d = BOOKS[key];
  if (!d) return;
  document.getElementById("bookNum").textContent = d.num;
  document.getElementById("bookCoverKind").textContent = d.kind;
  document.getElementById("bookCoverTitle").textContent = d.title;
  document.getElementById("bookKind").textContent = d.kind;
  document.getElementById("bookTitle").textContent = d.title;
  document.getElementById("bookDesc").textContent = d.desc;
  document.getElementById("bookMeta").innerHTML = d.meta
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("");
  const bookLive = document.getElementById("bookLive");
  const bookRepo = document.getElementById("bookRepo");
  bookLive.href = d.live || "#";
  bookRepo.href = d.repo || "#";
  bookLive.hidden = !d.live;
  const liveDomain = document.getElementById("bookLiveDomain");
  const repoDomain = document.getElementById("bookRepoDomain");
  liveDomain.textContent = d.live ? prettyUrl(d.live, false) : "";
  repoDomain.textContent = d.repo ? prettyUrl(d.repo, true) : "";
  const shot = document.getElementById("bookShot");
  shot.src = d.shot;
  shot.alt = `Screenshot ${d.title}`;
  document.getElementById("bookShotCaption").textContent = d.shotCaption;
  bookRepo.hidden = !d.repo;
  document.getElementById("bookPoints").innerHTML = d.points
    .map((p) => `<li>${p}</li>`)
    .join("");
  [...bookCover.classList]
    .filter((c) => c.startsWith("book__cover--"))
    .forEach((c) => bookCover.classList.remove(c));
  bookCover.classList.add(`book__cover--${d.cover}`);
  renderDecor(key, d.num);
}

function openBook(key, dir, trigger) {
  if (!BOOKS[key]) return;
  lastTrigger = trigger || null;
  clearTimeout(bookHideTimer);
  fillBook(key);
  book.classList.toggle("book--spine-right", dir === "left");
  bookOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      bookOverlay.classList.add("is-visible");
      book.classList.add("is-open");
    })
  );
  bookClose.focus({ preventScroll: true });
}

function closeBook(instant) {
  book.classList.remove("is-open");
  const done = () => {
    bookOverlay.classList.remove("is-visible");
    bookOverlay.hidden = true;
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  };
  if (instant) {
    done();
  } else {
    clearTimeout(bookHideTimer);
    bookHideTimer = setTimeout(done, 430);
  }
}

document.querySelectorAll("[data-book]").forEach((btn) => {
  btn.addEventListener("click", () =>
    openBook(btn.dataset.book, btn.dataset.dir || "right", btn)
  );
});
bookClose.addEventListener("click", () => closeBook(false));
bookOverlay.addEventListener("click", (e) => {
  if (e.target === bookOverlay) closeBook(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !bookOverlay.hidden) closeBook(false);
});
book.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusables = [...book.querySelectorAll("button, a[href]")].filter(
    (el) => !el.disabled
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
