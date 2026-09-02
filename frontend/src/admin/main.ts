// ===================================================================
// Admin Panel Controller
// TypeScript port of the legacy admin.js — DOM output, class names, and
// escaping/sanitizing behavior are unchanged. See migration plan §Faz 3.
//
// The 13 window.* globals the legacy file used for inline onclick=
// handlers in generated table rows are replaced with event delegation
// (data-action / data-id / data-index attributes + one delegated click
// listener per stable container). Static markup never used these
// globals, so this has no effect on index.html/admin_panel.html.
// ===================================================================

import { escapeHtml, sanitizeImgSrc } from "../lib/sanitize";
import {
  checkSession,
  fetchPortfolioStatic,
  login as apiLogin,
  logout as apiLogout,
  updatePortfolio,
  uploadImage,
  UnauthorizedError,
} from "../lib/api";
import type { PortfolioData, Project, Experience, Certificate } from "../types/portfolio";

const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  personal: {
    name: "Alara Soysan",
    email: "info@alarasysn.com",
    phone: "+31625632446",
    instagram: "https://instagram.com/alarasysn",
    linkedin: "https://www.linkedin.com/in/alara-soysan-8a901a243/",
    cvUrl: "alaraCV.pdf",
    profileImage: "assets/images/ALARA.jpeg",
  },
  coreSkills: [
    { title: "Digital Content", desc: "Görsel ve video tasarımı, sosyal medya kampanyaları ve kreatif içerik planlaması." },
    { title: "Structured Details", desc: "Analitik ve yapılandırılmış planlama, pazar araştırması ve veri odaklı kararlar." },
    { title: "Website UX", desc: "Kullanıcı odaklı dijital arayüz tasarımı ve marka deneyimi geliştirme." },
    { title: "Communication", desc: "Şeffaf ve etkili iletişim, işveren markası ve kurumsal iç iletişim." },
    { title: "Adaptability", desc: "Değişen koşullara hızlı uyum, dinamik proje yönetimi ve esnek çözümler." },
  ],
  projects: [
    {
      id: "project-1",
      title: "de Schouw Branding Campaign",
      category: "SOCIAL MEDIA STRATEGY",
      thumbnail: "assets/images/schouwKapak.jpeg",
      images: "assets/images/schouwKapak.jpeg, assets/images/social.jpeg, assets/images/seo.jpeg",
      description:
        "Rotterdam'daki yerel bir topluluk merkezi için tasarlanan bütünleşik marka ve dijital pazarlama kampanyası. Dijital görünürlüğü artırmayı ve yerel etkileşimi güçlendirmeyi hedefler.",
      metaRole: "Branding & Content Creator",
      metaClientLabel: "CLIENT / GROUP",
      metaClient: "de Schouw (Team Iron Man 4)",
      metaTools: "Canva, Photoshop, CapCut",
      metaCategory: "Digital Marketing & Branding",
      goals: "UNSDG 11, UNSDG 12",
      achievements: [
        "Canva ile tutarlı ve sürdürülebilir bir görsel tasarım sistemi kuruldu.",
        "Yerel topluluğun sosyal medya etkileşim oranlarında %45 artış gözlemlendi.",
        "SEO odaklı kopya yazımı ile dijital görünürlük ve erişim artırıldı.",
      ],
    },
    {
      id: "project-2",
      title: "Nike Employer Brand",
      category: "EMPLOYER BRANDING",
      thumbnail: "assets/images/project_nike.png",
      images: "assets/images/project_nike.png, assets/images/branding.jpeg",
      description:
        "Nike Turkey bünyesinde yürütülen işveren markası araştırması ve yetenek edinimi strateji sunumu. Yeni nesil aday deneyimini geliştirmeye odaklanır.",
      metaRole: "Brand Consultant",
      metaClientLabel: "CLIENT / GROUP",
      metaClient: "Nike Turkey",
      metaTools: "Office 365, Canva, Illustrator",
      metaCategory: "Recruitment & Employer Branding",
      goals: "UNSDG 8, UNSDG 10",
      achievements: [
        "Genç yeteneklere yönelik işveren markası konumlandırma analizi gerçekleştirildi.",
        "Aday başvuru süreçlerindeki sürtünmeyi azaltmak için UX iyileştirme önerileri sunuldu.",
        "Sosyal medya üzerinden potansiyel aday erişimi için içerik şablonları tasarlandı.",
      ],
    },
    {
      id: "project-3",
      title: "Student Yoga Studio",
      category: "CAMPUS ENGAGEMENT",
      thumbnail: "assets/images/yogaProject/kapak.jpeg",
      images:
        "assets/images/yogaProject/kapak.jpeg, assets/images/yogaProject/anaSayfa.jpeg, assets/images/yogaProject/aboutMe.jpeg, assets/images/yogaProject/aciklama.jpeg, assets/images/yogaProject/post.jpeg",
      description:
        "Hogeschool Rotterdam kampüsünde öğrencilerin iyi olma hallerini (well-being) desteklemek için kurulan yoga stüdyosunun iletişim ve tanıtım projesi.",
      metaRole: "Project Coordinator",
      metaClientLabel: "SPONSOR",
      metaClient: "Hogeschool Rotterdam",
      metaTools: "SPSS Tool, Office, Google Forms",
      metaCategory: "Well-being & Engagement",
      goals: "UNSDG 3, UNSDG 4",
      achievements: [
        "SPSS analizleri ile öğrenci stres düzeyleri ve yoga aktivitelerinin etkileri raporlandı.",
        "Sosyal medya entegrasyonu ile haftalık katılım oranlarında %30 artış elde edildi.",
        "Bilinçli detaylar ve sade estetik odaklı marka kimliği tasarlandı.",
      ],
    },
  ],
  education: [
    {
      date: "2021 - Present",
      school: "Hogeschool Rotterdam",
      degree: "International Business",
      desc: "Focus: Digital Marketing & Organisational Change",
    },
    {
      date: "2021 - 2022",
      school: "Erasmus University Rotterdam",
      degree: "Pre-master (Partial)",
      desc: "Courses in Business Administration",
    },
  ],
  experience: [
    {
      id: "exp-1",
      date: "FEBRUARY 2026 - PRESENT",
      role: "HR & Branding Intern",
      company: "Turkcell",
      accomplishments: [
        "Designing social media visual and video content for employer branding projects using Canva and CapCut.",
        "Coordination of internal communication and employee engagement activities.",
        "Inter-team collaboration to maintain brand integrity across channels.",
      ],
    },
    {
      id: "exp-2",
      date: "FEBRUARY 2025 - FEBRUARY 2026",
      role: "Stock Filler",
      company: "Albert Heijn",
      accomplishments: [
        "Maintaining customer relationships and product flow in a dynamic store environment.",
        "Time management and team coordination skills.",
      ],
    },
    {
      id: "exp-3",
      date: "2022",
      role: "Science Exhibitions Volunteer",
      company: "Volunteer Work",
      accomplishments: ["Setting up and presenting interactive science booths to visitors."],
    },
  ],
  languages: [
    { name: "Türkçe (Native)", stars: 5 },
    { name: "English (C2 Professional)", stars: 4 },
    { name: "Nederlands (A2.2 Basic)", stars: 3 },
  ],
  toolkit: [
    "Microsoft Office",
    "SPSS Tool",
    "Canva Visuals",
    "CapCut Editing",
    "Content Creation",
    "SEO Copywriting",
    "Google Analytics",
    "Email Marketing",
    "Communication",
    "Adaptability",
    "Collaboration",
    "Time Management",
  ],
  certificates: [
    {
      id: "cert-1",
      title: "E-posta Pazarlaması Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert1.jpeg",
      validity: "Geçerlilik: Ocak 2026 - Şubat 2028",
      desc: "E-posta stratejisi oluşturma, segmentasyon, yüksek performanslı gönderimler ve optimizasyon süreçleri.",
    },
    {
      id: "cert-2",
      title: "Dijital Reklamcılık Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert2.jpeg",
      validity: "Geçerlilik: Ocak 2026 - Şubat 2027",
      desc: "Dijital reklam kampanyaları, içerik stratejisi ve en iyi reklam yönetimi uygulamaları.",
    },
    {
      id: "cert-3",
      title: "Sosyal Medya Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert3.jpeg",
      validity: "Geçerlilik: Aralık 2025 - Ocak 2028",
      desc: "Inbound sosyal medya stratejisi, içerik yönetimi, sosyal dinleme ve ROI ölçümleme teknikleri.",
    },
    {
      id: "cert-4",
      title: "Inbound Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert4.jpeg",
      validity: "Geçerlilik: Ocak 2026 - Şubat 2028",
      desc: "Potansiyel müşterileri çekme, etkileşime geçme ve Inbound metodolojisine dayalı Flywheel iş modeli.",
    },
    {
      id: "cert-5",
      title: "Dijital Pazarlama Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert5.jpeg",
      validity: "Geçerlilik: Aralık 2025 - Haziran 2027",
      desc: "SEO dostu içerik üretimi, web sitesi optimizasyonu ve bütünleşik dijital pazarlama stratejileri.",
    },
    {
      id: "cert-6",
      title: "Google Analytics Sertifikası",
      issuer: "Google Academy",
      letter: "G",
      image: "assets/images/cert6.jpeg",
      validity: "Geçerlilik: Aralık 2025 - Aralık 2026",
      desc: "Veri takibi, kanal performans ölçümleri, kullanıcı analizleri ve gösterge panoları kullanımı.",
    },
  ],
};

// Global application state (matches legacy's implicit non-null assumption
// after loadData() has run — see migration plan §Faz 3).
let portfolioData: PortfolioData = null as unknown as PortfolioData;

document.addEventListener("DOMContentLoaded", () => {
  initSecurity();
  initTheme();
  initTabNavigation();
  initSubTabNavigation();
  initTableActionDelegation();
  initForms();
});

// Theme toggle sync
// NOTE: #theme-toggle does not exist in admin_panel.html — this listener
// never attaches, matching legacy behavior (see migration plan §Faz 10).
function initTheme(): void {
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
}

// Security Check (backend JWT httpOnly-cookie session)
function initSecurity(): void {
  const loginWrapper = document.getElementById("login-wrapper")!;
  const loginForm = document.getElementById("login-form") as HTMLFormElement;
  const adminMain = document.getElementById("admin-main")!;
  const logoutBtn = document.getElementById("logout-btn")!;

  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const loginFormBody = document.getElementById("login-form-body");
  const resetPasswordBody = document.getElementById("reset-password-body");
  const backToLoginBtn = document.getElementById("btn-back-to-login");
  const resetPasswordForm = document.getElementById("reset-password-form");

  // Check for an existing session (cookie) on load
  (async () => {
    const ok = await checkSession();
    if (ok) {
      loginWrapper.classList.add("hidden");
      adminMain.classList.remove("hidden");
      loadData();
    } else {
      loginWrapper.classList.remove("hidden");
      adminMain.classList.add("hidden");
    }
  })();

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = (document.getElementById("admin-password") as HTMLInputElement).value;
    const email = (document.getElementById("admin-email") as HTMLInputElement).value;

    const submitBtn = loginForm.querySelector("button[type='submit']") as HTMLButtonElement;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    try {
      await apiLogin(email, password);
      loginWrapper.classList.add("hidden");
      adminMain.classList.remove("hidden");
      loadData();
    } catch (err) {
      console.error("Login failed:", err);
      alert("Hata: " + (err as Error).message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  if (forgotPasswordLink && loginFormBody && resetPasswordBody) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      const loginEmail = (document.getElementById("admin-email") as HTMLInputElement).value;
      if (loginEmail) (document.getElementById("reset-email") as HTMLInputElement).value = loginEmail;
      loginFormBody.classList.add("hidden");
      resetPasswordBody.classList.remove("hidden");
    });
  }

  if (backToLoginBtn && loginFormBody && resetPasswordBody) {
    backToLoginBtn.addEventListener("click", () => {
      resetPasswordBody.classList.add("hidden");
      loginFormBody.classList.remove("hidden");
    });
  }

  if (resetPasswordForm && loginFormBody && resetPasswordBody) {
    resetPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Admin credentials are server environment variables (no self-service
      // email reset flow) — only the server operator can change them.
      alert("Şifre sıfırlama e-postayla yapılamıyor. Şifreyi değiştirmek için sunucudaki ADMIN_PASSWORD ortam değişkenini güncelleyin.");
      resetPasswordBody.classList.add("hidden");
      loginFormBody.classList.remove("hidden");
    });
  }

  logoutBtn.addEventListener("click", async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      window.location.reload();
    }
  });
}

// Tab navigation setup
function initTabNavigation(): void {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab")!;
      document.getElementById(tabId)!.classList.add("active");
    });
  });
}

// Subtab navigation setup for Resume
function initSubTabNavigation(): void {
  const subTabButtons = document.querySelectorAll(".sub-tab-btn");
  const subTabContents = document.querySelectorAll(".sub-tab-content");

  subTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      subTabButtons.forEach((b) => b.classList.remove("active"));
      subTabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const subTabId = btn.getAttribute("data-subtab")!;
      document.getElementById(subTabId)!.classList.add("active");
    });
  });
}

// ── Delegated row-action handling (replaces legacy window.* onclick=) ──
// Table bodies are stable DOM nodes across re-renders (only their
// innerHTML is replaced), so one listener attached once per container
// keeps working after every renderX() call.
function bindDelegatedActions(
  container: HTMLElement | null,
  actions: Record<string, (value: string) => void>
): void {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!target || !container.contains(target)) return;
    const action = target.dataset.action || "";
    const handler = actions[action];
    if (!handler) return;
    handler(target.dataset.id ?? target.dataset.index ?? "");
  });
}

function initTableActionDelegation(): void {
  bindDelegatedActions(document.getElementById("skills-list-body"), {
    "edit-skill": (v) => editCoreSkill(parseInt(v, 10)),
    "delete-skill": (v) => deleteCoreSkill(parseInt(v, 10)),
  });
  bindDelegatedActions(document.getElementById("projects-list-body"), {
    "edit-project": (v) => openProjectEditor(v),
    "delete-project": (v) => deleteProject(v),
  });
  bindDelegatedActions(document.getElementById("education-list-body"), {
    "edit-education": (v) => editEducation(parseInt(v, 10)),
    "delete-education": (v) => deleteEducation(parseInt(v, 10)),
  });
  bindDelegatedActions(document.getElementById("experience-list-body"), {
    "edit-experience": (v) => openExpEditor(v),
    "delete-experience": (v) => deleteExperience(v),
  });
  bindDelegatedActions(document.getElementById("languages-list-body"), {
    "edit-language": (v) => editLanguage(parseInt(v, 10)),
    "delete-language": (v) => deleteLanguage(parseInt(v, 10)),
  });
  bindDelegatedActions(document.getElementById("toolkit-badges-list"), {
    "delete-badge": (v) => deleteBadge(parseInt(v, 10)),
  });
  bindDelegatedActions(document.getElementById("certs-list-body"), {
    "edit-cert": (v) => openCertEditor(v),
    "delete-cert": (v) => deleteCert(v),
  });
}

// Data loading and saving via the backend API
async function loadData(): Promise<void> {
  try {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      portfolioData = await res.json();
    } else {
      console.log("No data found on the backend yet. Falling back to local files...");
      try {
        portfolioData = await fetchPortfolioStatic();
      } catch {
        portfolioData = DEFAULT_PORTFOLIO_DATA;
      }
    }
  } catch (e) {
    console.warn("Failed to fetch from backend API, falling back to localStorage", e);
    const localData = localStorage.getItem("portfolioData");
    if (localData) {
      try {
        portfolioData = JSON.parse(localData);
      } catch {
        portfolioData = DEFAULT_PORTFOLIO_DATA;
        showFallbackWarning();
      }
    } else {
      portfolioData = DEFAULT_PORTFOLIO_DATA;
      showFallbackWarning();
    }
  }

  populatePersonalForm();
  renderCoreSkills();
  renderProjects();
  renderEducation();
  renderExperience();
  renderLanguages();
  renderToolkit();
  renderCertificates();
}

function showFallbackWarning(): void {
  const mainEl = document.getElementById("admin-main");
  if (mainEl && !document.getElementById("fallback-warning")) {
    const banner = document.createElement("div");
    banner.id = "fallback-warning";
    banner.style.cssText =
      "background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px; font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;";
    banner.innerHTML = `⚠️ <span style="margin-left: 0.25rem;"><strong>Uyarı:</strong> Canlı sunucudan veri yüklenemedi. Şu anda yerel eski şablon verileri yüklendi. Burada değişiklik yapıp kaydetmek canlı verilerinizi sıfırlayabilir!</span>`;
    mainEl.insertBefore(banner, mainEl.firstChild);
  }
}

async function saveData(): Promise<void> {
  localStorage.setItem("portfolioData", JSON.stringify(portfolioData));

  try {
    await updatePortfolio(portfolioData);
    console.log("Successfully saved data to backend API");
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      alert("Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.");
      window.location.reload();
      return;
    }
    console.error("Error saving data to backend API", e);
    alert("Veri kaydedilirken hata oluştu: " + (e as Error).message);
  }
}

// ── Carousel thumbnail strip renderer (with drag-to-reorder) ─────────
function renderCarouselThumbs(stripId: string, textInputId: string): void {
  const strip = document.getElementById(stripId);
  const textInput = document.getElementById(textInputId) as HTMLInputElement | null;
  if (!strip || !textInput) return;

  const paths = textInput.value
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p && !p.includes("Uploading") && !p.includes("Yükleniyor"));

  strip.innerHTML = "";
  if (paths.length === 0) return;

  // Index of the item currently being dragged
  let dragSrcIdx: number | null = null;

  function reorder(fromIdx: number, toIdx: number): void {
    const current = textInput!.value.split(",").map((p) => p.trim()).filter(Boolean);
    const [moved] = current.splice(fromIdx, 1);
    current.splice(toIdx, 0, moved);
    textInput!.value = current.join(", ");
    renderCarouselThumbs(stripId, textInputId);
  }

  paths.forEach((src, idx) => {
    const item = document.createElement("div");
    item.className = "carousel-thumb-item";
    item.draggable = true;
    item.title = "Sürükle ile sıralamayı değiştir";

    // Image — use blob preview cache for newly-browsed files,
    // otherwise try relative path with a clean placeholder fallback (no broken icon)
    const img = document.createElement("img");
    img.alt = "";
    if (src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http") || src.startsWith("/")) {
      img.src = src;
    } else if (blobPreviewCache[src]) {
      // Use cached blob data URL for instant preview
      img.src = blobPreviewCache[src];
    } else {
      img.src = "/" + src;
      img.onerror = () => {
        img.onerror = null;
        // Show a neutral placeholder instead of a broken icon
        img.style.objectFit = "contain";
        img.style.background = "var(--folder-bg, #2a2a3a)";
        img.style.padding = "8px";
        img.src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
      };
    }

    // Order badge (bottom-left)
    const badge = document.createElement("span");
    badge.className = "carousel-thumb-order";
    badge.textContent = String(idx + 1);

    // Remove button (top-right)
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "carousel-thumb-remove";
    removeBtn.title = "Kaldır";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const current = textInput.value.split(",").map((p) => p.trim()).filter(Boolean);
      current.splice(idx, 1);
      textInput.value = current.join(", ");
      renderCarouselThumbs(stripId, textInputId);
    });

    // ── Drag events ──
    item.addEventListener("dragstart", (e) => {
      dragSrcIdx = idx;
      (e as DragEvent).dataTransfer!.effectAllowed = "move";
      // Slight delay so the ghost image captures the un-faded state
      setTimeout(() => item.classList.add("dragging"), 0);
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      strip.querySelectorAll(".carousel-thumb-item").forEach((el) => el.classList.remove("drag-over"));
      dragSrcIdx = null;
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      (e as DragEvent).dataTransfer!.dropEffect = "move";
      if (dragSrcIdx === idx) return;
      strip.querySelectorAll(".carousel-thumb-item").forEach((el) => el.classList.remove("drag-over"));
      item.classList.add("drag-over");
    });

    item.addEventListener("dragleave", () => {
      item.classList.remove("drag-over");
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      item.classList.remove("drag-over");
      if (dragSrcIdx === null || dragSrcIdx === idx) return;
      reorder(dragSrcIdx, idx);
    });

    item.appendChild(img);
    item.appendChild(badge);
    item.appendChild(removeBtn);
    strip.appendChild(item);
  });
}

// Personal Form Logic
function populatePersonalForm(): void {
  const p = portfolioData.personal;
  (document.getElementById("p-name") as HTMLInputElement).value = p.name || "";
  (document.getElementById("p-email") as HTMLInputElement).value = p.email || "";
  (document.getElementById("p-phone") as HTMLInputElement).value = p.phone || "";
  (document.getElementById("p-instagram") as HTMLInputElement).value = p.instagram || "";
  (document.getElementById("p-linkedin") as HTMLInputElement).value = p.linkedin || "";
  (document.getElementById("p-cv") as HTMLInputElement).value = p.cvUrl || "";

  const profileImgPath = p.profileImage || "assets/images/ALARA.jpeg";
  (document.getElementById("p-img-path") as HTMLInputElement).value = profileImgPath;
  const previewImg = document.getElementById("p-img-preview") as HTMLImageElement | null;
  if (previewImg) {
    const isAbsolute = profileImgPath.startsWith("http://") || profileImgPath.startsWith("https://");
    const relativeUrl = isAbsolute ? profileImgPath : profileImgPath.startsWith("/") ? profileImgPath : "/" + profileImgPath;
    previewImg.src = relativeUrl;
    if (!isAbsolute) {
      previewImg.onerror = () => {
        previewImg.onerror = null;
        previewImg.src = `https://alarasysn.com/${profileImgPath}`;
      };
    }
  }

  const cvFile = document.getElementById("p-cv-file") as HTMLInputElement | null;
  if (cvFile) cvFile.value = "";
  const imgFile = document.getElementById("p-img-file") as HTMLInputElement | null;
  if (imgFile) imgFile.value = "";
}

// Core Skills Managers
function renderCoreSkills(): void {
  const tbody = document.getElementById("skills-list-body")!;
  tbody.innerHTML = "";

  portfolioData.coreSkills.forEach((skill, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${escapeHtml(skill.title)}</strong></td>
      <td>${escapeHtml(skill.desc)}</td>
      <td>
        <div style="display:flex;gap:0.4rem;">
          <button class="btn btn-secondary btn-sm" data-action="edit-skill" data-index="${index}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete-skill" data-index="${index}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editCoreSkill(index: number): void {
  const skill = portfolioData.coreSkills[index];
  if (!skill) return;

  (document.getElementById("new-skill-title") as HTMLInputElement).value = skill.title;
  (document.getElementById("new-skill-desc") as HTMLTextAreaElement).value = skill.desc;
  (document.getElementById("edit-skill-index") as HTMLInputElement).value = String(index);
  document.getElementById("skill-submit-btn")!.textContent = "Save Changes";
  document.getElementById("skill-cancel-btn")!.classList.remove("hidden");

  // Scroll form into view
  document.getElementById("add-skill-form")!.scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("new-skill-title")!.focus();
}

function deleteCoreSkill(index: number): void {
  if (confirm("Are you sure you want to delete this skill?")) {
    portfolioData.coreSkills.splice(index, 1);
    saveData();
    renderCoreSkills();
  }
}

// Projects Managers
function renderProjects(): void {
  const tbody = document.getElementById("projects-list-body")!;
  tbody.innerHTML = "";

  portfolioData.projects.forEach((proj) => {
    const tr = document.createElement("tr");
    const safeThumb = sanitizeImgSrc(proj.thumbnail);
    tr.innerHTML = `
      <td><img src="${safeThumb}" onerror="this.onerror=null; this.src='https://alarasysn.com/' + this.getAttribute('src');" class="project-thumb-preview" alt=""></td>
      <td><strong>${escapeHtml(proj.title)}</strong></td>
      <td><span class="admin-tag" style="background-color: var(--folder-bg);">${escapeHtml(proj.category)}</span></td>
      <td><span style="font-size: 0.85rem; color: var(--text-muted);">${proj.images.split(",").length} images</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" data-action="edit-project" data-id="${escapeHtml(proj.id)}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete-project" data-id="${escapeHtml(proj.id)}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openProjectEditor(id: string): void {
  const modal = document.getElementById("project-editor-modal")!;
  const form = document.getElementById("project-form") as HTMLFormElement;
  form.reset();

  if (id) {
    const proj = portfolioData.projects.find((p) => p.id === id);
    if (!proj) return;

    (document.getElementById("proj-id") as HTMLInputElement).value = proj.id;
    (document.getElementById("proj-title") as HTMLInputElement).value = proj.title;
    (document.getElementById("proj-category") as HTMLInputElement).value = proj.category;
    (document.getElementById("proj-thumbnail") as HTMLInputElement).value = proj.thumbnail;
    (document.getElementById("proj-images") as HTMLInputElement).value = proj.images;
    (document.getElementById("proj-description") as HTMLTextAreaElement).value = proj.description;
    (document.getElementById("proj-meta-role") as HTMLInputElement).value = proj.metaRole || "";
    (document.getElementById("proj-meta-client-label") as HTMLInputElement).value = proj.metaClientLabel || "";
    (document.getElementById("proj-meta-client") as HTMLInputElement).value = proj.metaClient || "";
    (document.getElementById("proj-meta-tools") as HTMLInputElement).value = proj.metaTools || "";
    (document.getElementById("proj-meta-category") as HTMLInputElement).value = proj.metaCategory || "";
    (document.getElementById("proj-goals") as HTMLInputElement).value = proj.goals || "";
    (document.getElementById("proj-achievements") as HTMLTextAreaElement).value = (proj.achievements || []).join("\n");
    // Render existing image thumbnails
    renderCarouselThumbs("proj-images-thumbs", "proj-images");

    document.getElementById("editor-title-label")!.textContent = "Edit Project";
  } else {
    (document.getElementById("proj-id") as HTMLInputElement).value = "";
    document.getElementById("editor-title-label")!.textContent = "Add New Project";
    // Clear thumbnail strip for new project
    renderCarouselThumbs("proj-images-thumbs", "proj-images");
  }

  modal.classList.remove("hidden");
}

function deleteProject(id: string): void {
  if (confirm("Are you sure you want to delete this project?")) {
    portfolioData.projects = portfolioData.projects.filter((p) => p.id !== id);
    saveData();
    renderProjects();
  }
}

// Education Managers
function renderEducation(): void {
  const tbody = document.getElementById("education-list-body")!;
  tbody.innerHTML = "";

  portfolioData.education.forEach((edu, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(edu.date)}</td>
      <td><strong>${escapeHtml(edu.school)}</strong></td>
      <td>${escapeHtml(edu.degree)}</td>
      <td><span style="font-size: 0.85rem;">${escapeHtml(edu.desc)}</span></td>
      <td>
        <div style="display:flex;gap:0.4rem;">
          <button class="btn btn-secondary btn-sm" data-action="edit-education" data-index="${index}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete-education" data-index="${index}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editEducation(index: number): void {
  const edu = portfolioData.education[index];
  if (!edu) return;

  (document.getElementById("edu-date") as HTMLInputElement).value = edu.date;
  (document.getElementById("edu-school") as HTMLInputElement).value = edu.school;
  (document.getElementById("edu-degree") as HTMLInputElement).value = edu.degree;
  (document.getElementById("edu-desc") as HTMLTextAreaElement).value = edu.desc;
  (document.getElementById("edit-edu-index") as HTMLInputElement).value = String(index);
  document.getElementById("edu-submit-btn")!.textContent = "Save Changes";
  document.getElementById("edu-cancel-btn")!.classList.remove("hidden");

  document.getElementById("education-form")!.scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("edu-date")!.focus();
}

function deleteEducation(index: number): void {
  if (confirm("Delete this education entry?")) {
    portfolioData.education.splice(index, 1);
    saveData();
    renderEducation();
  }
}

// Experience Managers
function renderExperience(): void {
  const tbody = document.getElementById("experience-list-body")!;
  tbody.innerHTML = "";

  portfolioData.experience.forEach((exp) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(exp.date)}</td>
      <td><strong>${escapeHtml(exp.role)}</strong></td>
      <td>${escapeHtml(exp.company)}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" data-action="edit-experience" data-id="${escapeHtml(exp.id)}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete-experience" data-id="${escapeHtml(exp.id)}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openExpEditor(id: string): void {
  const modal = document.getElementById("exp-editor-modal")!;
  const form = document.getElementById("exp-form") as HTMLFormElement;
  form.reset();

  if (id) {
    const exp = portfolioData.experience.find((e) => e.id === id);
    if (!exp) return;

    (document.getElementById("exp-id") as HTMLInputElement).value = exp.id;
    (document.getElementById("exp-date") as HTMLInputElement).value = exp.date;
    (document.getElementById("exp-role") as HTMLInputElement).value = exp.role;
    (document.getElementById("exp-company") as HTMLInputElement).value = exp.company;
    (document.getElementById("exp-accomplishments") as HTMLTextAreaElement).value = (exp.accomplishments || []).join("\n");
  } else {
    (document.getElementById("exp-id") as HTMLInputElement).value = "";
  }

  modal.classList.remove("hidden");
}

function deleteExperience(id: string): void {
  if (confirm("Are you sure you want to delete this experience entry?")) {
    portfolioData.experience = portfolioData.experience.filter((e) => e.id !== id);
    saveData();
    renderExperience();
  }
}

// Language Managers
function renderLanguages(): void {
  const tbody = document.getElementById("languages-list-body")!;
  tbody.innerHTML = "";

  portfolioData.languages.forEach((lang, index) => {
    const tr = document.createElement("tr");
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
      starsHtml += i < lang.stars ? "★" : "☆";
    }
    tr.innerHTML = `
      <td><strong>${escapeHtml(lang.name)}</strong></td>
      <td style="color: var(--primary-accent); font-size: 1.1rem;">${starsHtml}</td>
      <td>
        <div style="display:flex;gap:0.4rem;">
          <button class="btn btn-secondary btn-sm" data-action="edit-language" data-index="${index}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete-language" data-index="${index}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editLanguage(index: number): void {
  const lang = portfolioData.languages[index];
  if (!lang) return;

  (document.getElementById("lang-name") as HTMLInputElement).value = lang.name;
  (document.getElementById("lang-stars") as HTMLInputElement).value = String(lang.stars);
  (document.getElementById("edit-lang-index") as HTMLInputElement).value = String(index);
  document.getElementById("lang-submit-btn")!.textContent = "Save Changes";
  document.getElementById("lang-cancel-btn")!.classList.remove("hidden");

  document.getElementById("language-form")!.scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("lang-name")!.focus();
}

function deleteLanguage(index: number): void {
  if (confirm("Delete this language?")) {
    portfolioData.languages.splice(index, 1);
    saveData();
    renderLanguages();
  }
}

// Toolkit Managers
function renderToolkit(): void {
  const container = document.getElementById("toolkit-badges-list")!;
  container.innerHTML = "";

  portfolioData.toolkit.forEach((badge, index) => {
    const badgeEl = document.createElement("span");
    badgeEl.className = "badge-editable";
    badgeEl.innerHTML = `
      <span>${escapeHtml(badge)}</span>
      <button class="remove-badge-btn" data-action="delete-badge" data-index="${index}">×</button>
    `;
    container.appendChild(badgeEl);
  });
}

function deleteBadge(index: number): void {
  portfolioData.toolkit.splice(index, 1);
  saveData();
  renderToolkit();
}

// Certificates Managers
function renderCertificates(): void {
  const tbody = document.getElementById("certs-list-body")!;
  tbody.innerHTML = "";

  portfolioData.certificates.forEach((cert) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${escapeHtml(cert.title)}</strong></td>
      <td>${escapeHtml(cert.issuer)}</td>
      <td>${escapeHtml(cert.validity)}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" data-action="edit-cert" data-id="${escapeHtml(cert.id)}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete-cert" data-id="${escapeHtml(cert.id)}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openCertEditor(id: string): void {
  const modal = document.getElementById("cert-editor-modal")!;
  const form = document.getElementById("cert-form") as HTMLFormElement;
  form.reset();

  if (id) {
    const cert = portfolioData.certificates.find((c) => c.id === id);
    if (!cert) return;

    (document.getElementById("cert-id") as HTMLInputElement).value = cert.id;
    (document.getElementById("cert-title") as HTMLInputElement).value = cert.title;
    (document.getElementById("cert-issuer") as HTMLInputElement).value = cert.issuer;
    (document.getElementById("cert-issuer-letter") as HTMLInputElement).value = cert.letter;
    (document.getElementById("cert-image") as HTMLInputElement).value = cert.image;
    (document.getElementById("cert-validity") as HTMLInputElement).value = cert.validity;
    (document.getElementById("cert-desc") as HTMLTextAreaElement).value = cert.desc;
  } else {
    (document.getElementById("cert-id") as HTMLInputElement).value = "";
  }

  modal.classList.remove("hidden");
}

function deleteCert(id: string): void {
  if (confirm("Are you sure you want to delete this certificate?")) {
    portfolioData.certificates = portfolioData.certificates.filter((c) => c.id !== id);
    saveData();
    renderCertificates();
  }
}

// File upload helper (backend-mediated upload)
// prefixInputId: optional id of an <input> whose value overrides defaultPathPrefix at runtime
function setupOfflineFileUpload(
  fileInputId: string,
  textInputId: string,
  defaultPathPrefix: string,
  callback?: ((url: string, file: File) => void) | null,
  prefixInputId?: string
): void {
  const fileInput = document.getElementById(fileInputId) as HTMLInputElement | null;
  const textInput = document.getElementById(textInputId) as HTMLInputElement | null;

  if (!fileInput || !textInput) return;

  fileInput.addEventListener("change", async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const prefixEl = prefixInputId ? (document.getElementById(prefixInputId) as HTMLInputElement | null) : null;
    const prefix = prefixEl && prefixEl.value.trim() ? prefixEl.value.trim() : defaultPathPrefix;

    const originalText = textInput.value;
    textInput.value = "Yükleniyor...";

    try {
      const url = await uploadImage(file, prefix);
      textInput.value = url;
      if (typeof callback === "function") {
        callback(url, file);
      }
    } catch (err) {
      console.error("Upload error:", err);
      const timedOut = (err as Error).name === "AbortError";
      alert(timedOut ? "Yükleme zaman aşımına uğradı. Lütfen tekrar deneyin." : "Görsel yüklenemedi: " + (err as Error).message);
      textInput.value = originalText;
    }

    fileInput.value = "";
  });
}

// Blob preview cache: maps "assets/images/filename.jpg" -> "blob:..." for current session
const blobPreviewCache: Record<string, string> = {};

function setupOfflineMultiFileUpload(fileInputId: string, textInputId: string, prefixInputId?: string): void {
  const fileInput = document.getElementById(fileInputId) as HTMLInputElement | null;
  const textInput = document.getElementById(textInputId) as HTMLInputElement | null;
  const stripId = textInputId + "-thumbs";

  if (!fileInput || !textInput) return;

  fileInput.addEventListener("change", async (e) => {
    const files = Array.from((e.target as HTMLInputElement).files || []);
    if (files.length === 0) return;

    const originalText = textInput.value;
    const currentClean = originalText
      .replace(/,\s*Uploading\.\.\./, "")
      .replace(/^Uploading\.\.\./, "")
      .replace(/,\s*Yükleniyor\.\.\./, "")
      .replace(/^Yükleniyor\.\.\./, "");

    const prefixEl = prefixInputId ? (document.getElementById(prefixInputId) as HTMLInputElement | null) : null;
    const prefix = prefixEl && prefixEl.value.trim() ? prefixEl.value.trim() : "assets/images/";

    textInput.value = currentClean ? `${currentClean}, Yükleniyor...` : "Yükleniyor...";
    const newUrls: string[] = [];

    const uploadPromises = files.map((file) => {
      return new Promise<void>((resolve) => {
        // Cache blob for instant preview (keyed by a temp id, resolved to the real URL below)
        const previewKey = `${prefix}${file.name}`;
        const reader = new FileReader();
        reader.onload = (ev) => {
          blobPreviewCache[previewKey] = ev.target!.result as string;
        };
        reader.readAsDataURL(file);

        uploadImage(file, prefix)
          .then((url) => {
            if (blobPreviewCache[previewKey]) {
              blobPreviewCache[url] = blobPreviewCache[previewKey];
            }
            newUrls.push(url);
            resolve();
          })
          .catch((error) => {
            console.error("Error uploading file", file.name, error);
            resolve();
          });
      });
    });

    await Promise.all(uploadPromises);

    if (newUrls.length > 0) {
      const newUrlsStr = newUrls.join(", ");
      textInput.value = currentClean ? `${currentClean}, ${newUrlsStr}` : newUrlsStr;
    } else {
      alert("Görseller yüklenemedi.");
      textInput.value = currentClean;
    }
    renderCarouselThumbs(stripId, textInputId);

    fileInput.value = "";
  });
}

// Forms Submission Setup
function initForms(): void {
  // Setup offline file browse handlers
  setupOfflineFileUpload("p-cv-file", "p-cv", "assets/docs/");
  setupOfflineFileUpload("p-img-file", "p-img-path", "assets/images/", (_url, file) => {
    const previewImg = document.getElementById("p-img-preview") as HTMLImageElement | null;
    if (previewImg && file) {
      // Use FileReader for instant local preview without a network request
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImg.src = ev.target!.result as string;
      };
      reader.readAsDataURL(file);
    }
  });
  setupOfflineFileUpload("proj-thumbnail-file", "proj-thumbnail", "assets/images/", null, "proj-thumbnail-prefix");
  setupOfflineMultiFileUpload("proj-images-file", "proj-images", "proj-images-prefix");
  setupOfflineFileUpload("cert-image-file", "cert-image", "assets/images/");

  // Setup manual clear button for carousel images
  const clearBtn = document.getElementById("btn-clear-proj-images");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      (document.getElementById("proj-images") as HTMLInputElement).value = "";
      renderCarouselThumbs("proj-images-thumbs", "proj-images");
    });
  }

  // Personal form submission
  document.getElementById("personal-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    portfolioData.personal.name = (document.getElementById("p-name") as HTMLInputElement).value;
    portfolioData.personal.email = (document.getElementById("p-email") as HTMLInputElement).value;
    portfolioData.personal.phone = (document.getElementById("p-phone") as HTMLInputElement).value;
    portfolioData.personal.instagram = (document.getElementById("p-instagram") as HTMLInputElement).value;
    portfolioData.personal.linkedin = (document.getElementById("p-linkedin") as HTMLInputElement).value;
    portfolioData.personal.cvUrl = (document.getElementById("p-cv") as HTMLInputElement).value;
    portfolioData.personal.profileImage = (document.getElementById("p-img-path") as HTMLInputElement).value;

    saveData();
    alert("Personal details updated successfully!");
  });

  // Add / Edit Core Skill
  document.getElementById("add-skill-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = (document.getElementById("new-skill-title") as HTMLInputElement).value.trim();
    const desc = (document.getElementById("new-skill-desc") as HTMLTextAreaElement).value.trim();
    const editIdx = (document.getElementById("edit-skill-index") as HTMLInputElement).value;

    if (editIdx !== "") {
      // Edit mode — update existing skill
      portfolioData.coreSkills[parseInt(editIdx, 10)] = { title, desc };
    } else {
      // Add mode — push new skill
      portfolioData.coreSkills.push({ title, desc });
    }

    saveData();
    renderCoreSkills();

    // Reset form to add mode
    (document.getElementById("add-skill-form") as HTMLFormElement).reset();
    (document.getElementById("edit-skill-index") as HTMLInputElement).value = "";
    document.getElementById("skill-submit-btn")!.textContent = "Add";
    document.getElementById("skill-cancel-btn")!.classList.add("hidden");
  });

  document.getElementById("skill-cancel-btn")!.addEventListener("click", () => {
    (document.getElementById("add-skill-form") as HTMLFormElement).reset();
    (document.getElementById("edit-skill-index") as HTMLInputElement).value = "";
    document.getElementById("skill-submit-btn")!.textContent = "Add";
    document.getElementById("skill-cancel-btn")!.classList.add("hidden");
  });

  // Project Editor submit
  document.getElementById("project-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = (document.getElementById("proj-id") as HTMLInputElement).value;
    const title = (document.getElementById("proj-title") as HTMLInputElement).value;
    const category = (document.getElementById("proj-category") as HTMLInputElement).value;
    const thumbnail = (document.getElementById("proj-thumbnail") as HTMLInputElement).value;
    const images = (document.getElementById("proj-images") as HTMLInputElement).value;
    const description = (document.getElementById("proj-description") as HTMLTextAreaElement).value;
    const metaRole = (document.getElementById("proj-meta-role") as HTMLInputElement).value;
    const metaClientLabel = (document.getElementById("proj-meta-client-label") as HTMLInputElement).value;
    const metaClient = (document.getElementById("proj-meta-client") as HTMLInputElement).value;
    const metaTools = (document.getElementById("proj-meta-tools") as HTMLInputElement).value;
    const metaCategory = (document.getElementById("proj-meta-category") as HTMLInputElement).value;
    const goals = (document.getElementById("proj-goals") as HTMLInputElement).value;
    const achievementsRaw = (document.getElementById("proj-achievements") as HTMLTextAreaElement).value;

    const achievements = achievementsRaw.split("\n").map((a) => a.trim()).filter(Boolean);

    if (id) {
      // Edit existing
      const idx = portfolioData.projects.findIndex((p) => p.id === id);
      if (idx !== -1) {
        portfolioData.projects[idx] = {
          id,
          title,
          category,
          thumbnail,
          images,
          description,
          metaRole,
          metaClientLabel,
          metaClient,
          metaTools,
          metaCategory,
          goals,
          achievements,
        };
      }
    } else {
      // Add new
      const newId = "project-" + Date.now();
      const newProject: Project = {
        id: newId,
        title,
        category,
        thumbnail,
        images,
        description,
        metaRole,
        metaClientLabel,
        metaClient,
        metaTools,
        metaCategory,
        goals,
        achievements,
      };
      portfolioData.projects.push(newProject);
    }

    saveData();
    renderProjects();
    document.getElementById("project-editor-modal")!.classList.add("hidden");
  });

  document.getElementById("btn-new-project")!.addEventListener("click", () => openProjectEditor(""));
  document.getElementById("project-editor-close")!.addEventListener("click", () => {
    document.getElementById("project-editor-modal")!.classList.add("hidden");
  });
  document.getElementById("btn-cancel-project")!.addEventListener("click", () => {
    document.getElementById("project-editor-modal")!.classList.add("hidden");
  });

  // Education form: Add / Edit
  document.getElementById("education-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = (document.getElementById("edu-date") as HTMLInputElement).value.trim();
    const school = (document.getElementById("edu-school") as HTMLInputElement).value.trim();
    const degree = (document.getElementById("edu-degree") as HTMLInputElement).value.trim();
    const desc = (document.getElementById("edu-desc") as HTMLTextAreaElement).value.trim();
    const editIdx = (document.getElementById("edit-edu-index") as HTMLInputElement).value;

    if (editIdx !== "") {
      portfolioData.education[parseInt(editIdx, 10)] = { date, school, degree, desc };
    } else {
      portfolioData.education.push({ date, school, degree, desc });
    }

    saveData();
    renderEducation();

    (document.getElementById("education-form") as HTMLFormElement).reset();
    (document.getElementById("edit-edu-index") as HTMLInputElement).value = "";
    document.getElementById("edu-submit-btn")!.textContent = "Add";
    document.getElementById("edu-cancel-btn")!.classList.add("hidden");
  });

  document.getElementById("edu-cancel-btn")!.addEventListener("click", () => {
    (document.getElementById("education-form") as HTMLFormElement).reset();
    (document.getElementById("edit-edu-index") as HTMLInputElement).value = "";
    document.getElementById("edu-submit-btn")!.textContent = "Add";
    document.getElementById("edu-cancel-btn")!.classList.add("hidden");
  });

  // Experience Editor submit
  document.getElementById("exp-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = (document.getElementById("exp-id") as HTMLInputElement).value;
    const date = (document.getElementById("exp-date") as HTMLInputElement).value;
    const role = (document.getElementById("exp-role") as HTMLInputElement).value;
    const company = (document.getElementById("exp-company") as HTMLInputElement).value;
    const accomplishmentsRaw = (document.getElementById("exp-accomplishments") as HTMLTextAreaElement).value;

    const accomplishments = accomplishmentsRaw.split("\n").map((a) => a.trim()).filter(Boolean);

    if (id) {
      const idx = portfolioData.experience.findIndex((ex) => ex.id === id);
      if (idx !== -1) {
        portfolioData.experience[idx] = { id, date, role, company, accomplishments };
      }
    } else {
      const newId = "exp-" + Date.now();
      const newExperience: Experience = { id: newId, date, role, company, accomplishments };
      portfolioData.experience.push(newExperience);
    }

    saveData();
    renderExperience();
    document.getElementById("exp-editor-modal")!.classList.add("hidden");
  });

  document.getElementById("btn-new-exp")!.addEventListener("click", () => openExpEditor(""));
  document.getElementById("exp-editor-close")!.addEventListener("click", () => {
    document.getElementById("exp-editor-modal")!.classList.add("hidden");
  });
  document.getElementById("btn-cancel-exp")!.addEventListener("click", () => {
    document.getElementById("exp-editor-modal")!.classList.add("hidden");
  });

  // Language form: Add / Edit
  document.getElementById("language-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("lang-name") as HTMLInputElement).value.trim();
    const stars = parseInt((document.getElementById("lang-stars") as HTMLInputElement).value, 10);
    const editIdx = (document.getElementById("edit-lang-index") as HTMLInputElement).value;

    if (editIdx !== "") {
      portfolioData.languages[parseInt(editIdx, 10)] = { name, stars };
    } else {
      portfolioData.languages.push({ name, stars });
    }

    saveData();
    renderLanguages();

    (document.getElementById("language-form") as HTMLFormElement).reset();
    (document.getElementById("edit-lang-index") as HTMLInputElement).value = "";
    document.getElementById("lang-submit-btn")!.textContent = "Add";
    document.getElementById("lang-cancel-btn")!.classList.add("hidden");
  });

  document.getElementById("lang-cancel-btn")!.addEventListener("click", () => {
    (document.getElementById("language-form") as HTMLFormElement).reset();
    (document.getElementById("edit-lang-index") as HTMLInputElement).value = "";
    document.getElementById("lang-submit-btn")!.textContent = "Add";
    document.getElementById("lang-cancel-btn")!.classList.add("hidden");
  });

  // Toolkit form submit
  document.getElementById("toolkit-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const badge = (document.getElementById("new-badge") as HTMLInputElement).value;

    portfolioData.toolkit.push(badge);
    saveData();
    renderToolkit();
    (document.getElementById("toolkit-form") as HTMLFormElement).reset();
  });

  // Certificate Editor submit
  document.getElementById("cert-form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = (document.getElementById("cert-id") as HTMLInputElement).value;
    const title = (document.getElementById("cert-title") as HTMLInputElement).value;
    const issuer = (document.getElementById("cert-issuer") as HTMLInputElement).value;
    const letter = (document.getElementById("cert-issuer-letter") as HTMLInputElement).value;
    const image = (document.getElementById("cert-image") as HTMLInputElement).value;
    const validity = (document.getElementById("cert-validity") as HTMLInputElement).value;
    const desc = (document.getElementById("cert-desc") as HTMLTextAreaElement).value;

    if (id) {
      const idx = portfolioData.certificates.findIndex((c) => c.id === id);
      if (idx !== -1) {
        portfolioData.certificates[idx] = { id, title, issuer, letter, image, validity, desc };
      }
    } else {
      const newId = "cert-" + Date.now();
      const newCert: Certificate = { id: newId, title, issuer, letter, image, validity, desc };
      portfolioData.certificates.push(newCert);
    }

    saveData();
    renderCertificates();
    document.getElementById("cert-editor-modal")!.classList.add("hidden");
  });

  document.getElementById("btn-new-cert")!.addEventListener("click", () => openCertEditor(""));
  document.getElementById("cert-editor-close")!.addEventListener("click", () => {
    document.getElementById("cert-editor-modal")!.classList.add("hidden");
  });
  document.getElementById("btn-cancel-cert")!.addEventListener("click", () => {
    document.getElementById("cert-editor-modal")!.classList.add("hidden");
  });
}
