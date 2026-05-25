import { db, auth, storage } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Default portfolio data to match the website's initial state
const DEFAULT_PORTFOLIO_DATA = {
  personal: {
    name: "Alara Soysan",
    email: "info@alarasoysan.com",
    phone: "+31625632446",
    instagram: "https://instagram.com/alarasoysan",
    linkedin: "https://www.linkedin.com/in/alara-soysan-8a901a243/",
    cvUrl: "alaraCV.pdf",
    profileImage: "assets/images/ALARA.jpeg"
  },
  coreSkills: [
    { title: "Digital Content", desc: "Görsel ve video tasarımı, sosyal medya kampanyaları ve kreatif içerik planlaması." },
    { title: "Structured Details", desc: "Analitik ve yapılandırılmış planlama, pazar araştırması ve veri odaklı kararlar." },
    { title: "Website UX", desc: "Kullanıcı odaklı dijital arayüz tasarımı ve marka deneyimi geliştirme." },
    { title: "Communication", desc: "Şeffaf ve etkili iletişim, işveren markası ve kurumsal iç iletişim." },
    { title: "Adaptability", desc: "Değişen koşullara hızlı uyum, dinamik proje yönetimi ve esnek çözümler." }
  ],
  projects: [
    {
      id: "project-1",
      title: "de Schouw Branding Campaign",
      category: "SOCIAL MEDIA STRATEGY",
      thumbnail: "assets/images/schouwKapak.jpeg",
      images: "assets/images/schouwKapak.jpeg, assets/images/social.jpeg, assets/images/seo.jpeg",
      description: "Rotterdam'daki yerel bir topluluk merkezi için tasarlanan bütünleşik marka ve dijital pazarlama kampanyası. Dijital görünürlüğü artırmayı ve yerel etkileşimi güçlendirmeyi hedefler.",
      metaRole: "Branding & Content Creator",
      metaClientLabel: "CLIENT / GROUP",
      metaClient: "de Schouw (Team Iron Man 4)",
      metaTools: "Canva, Photoshop, CapCut",
      metaCategory: "Digital Marketing & Branding",
      goals: "UNSDG 11, UNSDG 12",
      achievements: [
        "Canva ile tutarlı ve sürdürülebilir bir görsel tasarım sistemi kuruldu.",
        "Yerel topluluğun sosyal medya etkileşim oranlarında %45 artış gözlemlendi.",
        "SEO odaklı kopya yazımı ile dijital görünürlük ve erişim artırıldı."
      ]
    },
    {
      id: "project-2",
      title: "Nike Employer Brand",
      category: "EMPLOYER BRANDING",
      thumbnail: "assets/images/project_nike.png",
      images: "assets/images/project_nike.png, assets/images/branding.jpeg",
      description: "Nike Turkey bünyesinde yürütülen işveren markası araştırması ve yetenek edinimi strateji sunumu. Yeni nesil aday deneyimini geliştirmeye odaklanır.",
      metaRole: "Brand Consultant",
      metaClientLabel: "CLIENT / GROUP",
      metaClient: "Nike Turkey",
      metaTools: "Office 365, Canva, Illustrator",
      metaCategory: "Recruitment & Employer Branding",
      goals: "UNSDG 8, UNSDG 10",
      achievements: [
        "Genç yeteneklere yönelik işveren markası konumlandırma analizi gerçekleştirildi.",
        "Aday başvuru süreçlerindeki sürtünmeyi azaltmak için UX iyileştirme önerileri sunuldu.",
        "Sosyal medya üzerinden potansiyel aday erişimi için içerik şablonları tasarlandı."
      ]
    },
    {
      id: "project-3",
      title: "Student Yoga Studio",
      category: "CAMPUS ENGAGEMENT",
      thumbnail: "assets/images/yogaProject/kapak.jpeg",
      images: "assets/images/yogaProject/kapak.jpeg, assets/images/yogaProject/anaSayfa.jpeg, assets/images/yogaProject/aboutMe.jpeg, assets/images/yogaProject/aciklama.jpeg, assets/images/yogaProject/post.jpeg",
      description: "Hogeschool Rotterdam kampüsünde öğrencilerin iyi olma hallerini (well-being) desteklemek için kurulan yoga stüdyosunun iletişim ve tanıtım projesi.",
      metaRole: "Project Coordinator",
      metaClientLabel: "SPONSOR",
      metaClient: "Hogeschool Rotterdam",
      metaTools: "SPSS Tool, Office, Google Forms",
      metaCategory: "Well-being & Engagement",
      goals: "UNSDG 3, UNSDG 4",
      achievements: [
        "SPSS analizleri ile öğrenci stres düzeyleri ve yoga aktivitelerinin etkileri raporlandı.",
        "Sosyal medya entegrasyonu ile haftalık katılım oranlarında %30 artış elde edildi.",
        "Bilinçli detaylar ve sade estetik odaklı marka kimliği tasarlandı."
      ]
    }
  ],
  education: [
    {
      date: "2021 - Present",
      school: "Hogeschool Rotterdam",
      degree: "International Business",
      desc: "Focus: Digital Marketing & Organisational Change"
    },
    {
      date: "2021 - 2022",
      school: "Erasmus University Rotterdam",
      degree: "Pre-master (Partial)",
      desc: "Courses in Business Administration"
    }
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
        "Inter-team collaboration to maintain brand integrity across channels."
      ]
    },
    {
      id: "exp-2",
      date: "FEBRUARY 2025 - FEBRUARY 2026",
      role: "Stock Filler",
      company: "Albert Heijn",
      accomplishments: [
        "Maintaining customer relationships and product flow in a dynamic store environment.",
        "Time management and team coordination skills."
      ]
    },
    {
      id: "exp-3",
      date: "2022",
      role: "Science Exhibitions Volunteer",
      company: "Volunteer Work",
      accomplishments: [
        "Setting up and presenting interactive science booths to visitors."
      ]
    }
  ],
  languages: [
    { name: "Türkçe (Native)", stars: 5 },
    { name: "English (C2 Professional)", stars: 4 },
    { name: "Nederlands (A2.2 Basic)", stars: 3 }
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
    "Time Management"
  ],
  certificates: [
    {
      id: "cert-1",
      title: "E-posta Pazarlaması Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert1.jpeg",
      validity: "Geçerlilik: Ocak 2026 - Şubat 2028",
      desc: "E-posta stratejisi oluşturma, segmentasyon, yüksek performanslı gönderimler ve optimizasyon süreçleri."
    },
    {
      id: "cert-2",
      title: "Dijital Reklamcılık Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert2.jpeg",
      validity: "Geçerlilik: Ocak 2026 - Şubat 2027",
      desc: "Dijital reklam kampanyaları, içerik stratejisi ve en iyi reklam yönetimi uygulamaları."
    },
    {
      id: "cert-3",
      title: "Sosyal Medya Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert3.jpeg",
      validity: "Geçerlilik: Aralık 2025 - Ocak 2028",
      desc: "Inbound sosyal medya stratejisi, içerik yönetimi, sosyal dinleme ve ROI ölçümleme teknikleri."
    },
    {
      id: "cert-4",
      title: "Inbound Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert4.jpeg",
      validity: "Geçerlilik: Ocak 2026 - Şubat 2028",
      desc: "Potansiyel müşterileri çekme, etkileşime geçme ve Inbound metodolojisine dayalı Flywheel iş modeli."
    },
    {
      id: "cert-5",
      title: "Dijital Pazarlama Sertifikası",
      issuer: "HubSpot Academy",
      letter: "H",
      image: "assets/images/cert5.jpeg",
      validity: "Geçerlilik: Aralık 2025 - Haziran 2027",
      desc: "SEO dostu içerik üretimi, web sitesi optimizasyonu ve bütünleşik dijital pazarlama stratejileri."
    },
    {
      id: "cert-6",
      title: "Google Analytics Sertifikası",
      issuer: "Google Academy",
      letter: "G",
      image: "assets/images/cert6.jpeg",
      validity: "Geçerlilik: Aralık 2025 - Aralık 2026",
      desc: "Veri takibi, kanal performans ölçümleri, kullanıcı analizleri ve gösterge panoları kullanımı."
    }
  ]
};

// Global application state
let portfolioData = null;

document.addEventListener("DOMContentLoaded", () => {
  initSecurity();
  initTheme();
  initTabNavigation();
  initSubTabNavigation();
  initForms();
});

// Theme toggle sync
function initTheme() {
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

// Security Check (Firebase Authentication)
function initSecurity() {
  const loginWrapper = document.getElementById("login-wrapper");
  const loginForm = document.getElementById("login-form");
  const adminMain = document.getElementById("admin-main");
  const logoutBtn = document.getElementById("logout-btn");

  // Track Firebase auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginWrapper.classList.add("hidden");
      adminMain.classList.remove("hidden");
      loadData();
    } else {
      loginWrapper.classList.remove("hidden");
      adminMain.classList.add("hidden");
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("admin-password").value;
    const email = document.getElementById("admin-email").value;

    // Show loading state
    const submitBtn = loginForm.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Incorrect password or login failed! Error: " + err.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error("Error signing out:", err);
      window.location.reload();
    }
  });
}

// Tab navigation setup
function initTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// Subtab navigation setup for Resume
function initSubTabNavigation() {
  const subTabButtons = document.querySelectorAll(".sub-tab-btn");
  const subTabContents = document.querySelectorAll(".sub-tab-content");

  subTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      subTabButtons.forEach(b => b.classList.remove("active"));
      subTabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const subTabId = btn.getAttribute("data-subtab");
      document.getElementById(subTabId).classList.add("active");
    });
  });
}

// Data loading and saving
async function loadData() {
  try {
    const docRef = doc(db, "portfolio", "data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      portfolioData = docSnap.data();
    } else {
      console.log("No data found in Firestore. Seeding from local files...");
      try {
        const res = await fetch("/portfolio-data.json");
        if (res.ok) {
          portfolioData = await res.json();
        } else {
          portfolioData = DEFAULT_PORTFOLIO_DATA;
        }
      } catch (err) {
        portfolioData = DEFAULT_PORTFOLIO_DATA;
      }
      // Seed Firestore with the initial data
      await setDoc(docRef, portfolioData);
    }
  } catch (e) {
    console.warn("Failed to fetch from Firestore, falling back to localStorage", e);
    const localData = localStorage.getItem("portfolioData");
    if (localData) {
      try {
        portfolioData = JSON.parse(localData);
      } catch (err) {
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

// Function to display fallback data warnings to avoid data loss
function showFallbackWarning() {
  const mainEl = document.getElementById("admin-main");
  if (mainEl && !document.getElementById("fallback-warning")) {
    const banner = document.createElement("div");
    banner.id = "fallback-warning";
    banner.style.cssText = "background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px; font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;";
    banner.innerHTML = `⚠️ <span style="margin-left: 0.25rem;"><strong>Uyarı:</strong> Canlı sunucudan veri yüklenemedi. Şu anda yerel eski şablon verileri yüklendi. Burada değişiklik yapıp kaydetmek canlı verilerinizi sıfırlayabilir!</span>`;
    mainEl.insertBefore(banner, mainEl.firstChild);
  }
}


async function saveData() {
  localStorage.setItem("portfolioData", JSON.stringify(portfolioData));

  try {
    const docRef = doc(db, "portfolio", "data");
    await setDoc(docRef, portfolioData);
    console.log("Successfully saved data to Firestore");
  } catch (e) {
    console.error("Error saving data to Firestore", e);
    alert("Error saving data to Firebase: " + e.message);
  }
}



// ── Carousel thumbnail strip renderer (with drag-to-reorder) ─────────
function renderCarouselThumbs(stripId, textInputId) {
  const strip = document.getElementById(stripId);
  const textInput = document.getElementById(textInputId);
  if (!strip || !textInput) return;

  const paths = textInput.value
    .split(",")
    .map(p => p.trim())
    .filter(p => p && !p.includes("Uploading") && !p.includes("Yükleniyor"));

  strip.innerHTML = "";
  if (paths.length === 0) return;

  // Index of the item currently being dragged
  let dragSrcIdx = null;

  function reorder(fromIdx, toIdx) {
    const current = textInput.value.split(",").map(p => p.trim()).filter(Boolean);
    const [moved] = current.splice(fromIdx, 1);
    current.splice(toIdx, 0, moved);
    textInput.value = current.join(", ");
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
    if (src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http")) {
      img.src = src;
    } else if (typeof blobPreviewCache !== 'undefined' && blobPreviewCache && blobPreviewCache[src]) {
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
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
      };
    }

    // Order badge (bottom-left)
    const badge = document.createElement("span");
    badge.className = "carousel-thumb-order";
    badge.textContent = idx + 1;

    // Remove button (top-right)
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "carousel-thumb-remove";
    removeBtn.title = "Kaldır";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const current = textInput.value.split(",").map(p => p.trim()).filter(Boolean);
      current.splice(idx, 1);
      textInput.value = current.join(", ");
      renderCarouselThumbs(stripId, textInputId);
    });

    // ── Drag events ──
    item.addEventListener("dragstart", (e) => {
      dragSrcIdx = idx;
      e.dataTransfer.effectAllowed = "move";
      // Slight delay so the ghost image captures the un-faded state
      setTimeout(() => item.classList.add("dragging"), 0);
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      strip.querySelectorAll(".carousel-thumb-item").forEach(el => el.classList.remove("drag-over"));
      dragSrcIdx = null;
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragSrcIdx === idx) return;
      strip.querySelectorAll(".carousel-thumb-item").forEach(el => el.classList.remove("drag-over"));
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
function populatePersonalForm() {
  const p = portfolioData.personal;
  document.getElementById("p-name").value = p.name || "";
  document.getElementById("p-email").value = p.email || "";
  document.getElementById("p-phone").value = p.phone || "";
  document.getElementById("p-instagram").value = p.instagram || "";
  document.getElementById("p-linkedin").value = p.linkedin || "";
  document.getElementById("p-cv").value = p.cvUrl || "";

  const profileImgPath = p.profileImage || "assets/images/ALARA.jpeg";
  document.getElementById("p-img-path").value = profileImgPath;
  const previewImg = document.getElementById("p-img-preview");
  if (previewImg) {
    const isAbsolute = profileImgPath.startsWith('http://') || profileImgPath.startsWith('https://');
    const relativeUrl = isAbsolute ? profileImgPath : (profileImgPath.startsWith('/') ? profileImgPath : '/' + profileImgPath);
    previewImg.src = relativeUrl;
    if (!isAbsolute) {
      previewImg.onerror = () => {
        previewImg.onerror = null;
        previewImg.src = `https://alarasysn.com/${profileImgPath}`;
      };
    }
  }

  const cvFile = document.getElementById("p-cv-file");
  if (cvFile) cvFile.value = "";
  const imgFile = document.getElementById("p-img-file");
  if (imgFile) imgFile.value = "";
}

// Core Skills Managers
function renderCoreSkills() {
  const tbody = document.getElementById("skills-list-body");
  tbody.innerHTML = "";

  portfolioData.coreSkills.forEach((skill, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${skill.title}</strong></td>
      <td>${skill.desc}</td>
      <td>
        <div style="display:flex;gap:0.4rem;">
          <button class="btn btn-secondary btn-sm" onclick="editCoreSkill(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCoreSkill(${index})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.editCoreSkill = function (index) {
  const skill = portfolioData.coreSkills[index];
  if (!skill) return;

  document.getElementById("new-skill-title").value = skill.title;
  document.getElementById("new-skill-desc").value = skill.desc;
  document.getElementById("edit-skill-index").value = index;
  document.getElementById("skill-submit-btn").textContent = "Save Changes";
  document.getElementById("skill-cancel-btn").classList.remove("hidden");

  // Scroll form into view
  document.getElementById("add-skill-form").scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("new-skill-title").focus();
};

window.deleteCoreSkill = function (index) {
  if (confirm("Are you sure you want to delete this skill?")) {
    portfolioData.coreSkills.splice(index, 1);
    saveData();
    renderCoreSkills();
  }
};

// Projects Managers
function renderProjects() {
  const tbody = document.getElementById("projects-list-body");
  tbody.innerHTML = "";

  portfolioData.projects.forEach((proj) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${proj.thumbnail}" onerror="this.onerror=null; this.src='https://alarasysn.com/' + this.getAttribute('src');" class="project-thumb-preview" alt=""></td>
      <td><strong>${proj.title}</strong></td>
      <td><span class="admin-tag" style="background-color: var(--folder-bg);">${proj.category}</span></td>
      <td><span style="font-size: 0.85rem; color: var(--text-muted);">${proj.images.split(",").length} images</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="openProjectEditor('${proj.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject('${proj.id}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openProjectEditor = function (id) {
  const modal = document.getElementById("project-editor-modal");
  const form = document.getElementById("project-form");
  form.reset();

  if (id) {
    const proj = portfolioData.projects.find(p => p.id === id);
    if (!proj) return;

    document.getElementById("proj-id").value = proj.id;
    document.getElementById("proj-title").value = proj.title;
    document.getElementById("proj-category").value = proj.category;
    document.getElementById("proj-thumbnail").value = proj.thumbnail;
    document.getElementById("proj-images").value = proj.images;
    document.getElementById("proj-description").value = proj.description;
    document.getElementById("proj-meta-role").value = proj.metaRole || "";
    document.getElementById("proj-meta-client-label").value = proj.metaClientLabel || "";
    document.getElementById("proj-meta-client").value = proj.metaClient || "";
    document.getElementById("proj-meta-tools").value = proj.metaTools || "";
    document.getElementById("proj-meta-category").value = proj.metaCategory || "";
    document.getElementById("proj-goals").value = proj.goals || "";
    document.getElementById("proj-achievements").value = (proj.achievements || []).join("\n");
    // Render existing image thumbnails
    renderCarouselThumbs("proj-images-thumbs", "proj-images");

    document.getElementById("editor-title-label").textContent = "Edit Project";
  } else {
    document.getElementById("proj-id").value = "";
    document.getElementById("editor-title-label").textContent = "Add New Project";
    // Clear thumbnail strip for new project
    renderCarouselThumbs("proj-images-thumbs", "proj-images");
  }

  modal.classList.remove("hidden");
};

window.deleteProject = function (id) {
  if (confirm("Are you sure you want to delete this project?")) {
    portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
    saveData();
    renderProjects();
  }
};

// Education Managers
function renderEducation() {
  const tbody = document.getElementById("education-list-body");
  tbody.innerHTML = "";

  portfolioData.education.forEach((edu, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${edu.date}</td>
      <td><strong>${edu.school}</strong></td>
      <td>${edu.degree}</td>
      <td><span style="font-size: 0.85rem;">${edu.desc}</span></td>
      <td>
        <div style="display:flex;gap:0.4rem;">
          <button class="btn btn-secondary btn-sm" onclick="editEducation(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteEducation(${index})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.editEducation = function (index) {
  const edu = portfolioData.education[index];
  if (!edu) return;

  document.getElementById("edu-date").value = edu.date;
  document.getElementById("edu-school").value = edu.school;
  document.getElementById("edu-degree").value = edu.degree;
  document.getElementById("edu-desc").value = edu.desc;
  document.getElementById("edit-edu-index").value = index;
  document.getElementById("edu-submit-btn").textContent = "Save Changes";
  document.getElementById("edu-cancel-btn").classList.remove("hidden");

  document.getElementById("education-form").scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("edu-date").focus();
};

window.deleteEducation = function (index) {
  if (confirm("Delete this education entry?")) {
    portfolioData.education.splice(index, 1);
    saveData();
    renderEducation();
  }
};

// Experience Managers
function renderExperience() {
  const tbody = document.getElementById("experience-list-body");
  tbody.innerHTML = "";

  portfolioData.experience.forEach((exp) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${exp.date}</td>
      <td><strong>${exp.role}</strong></td>
      <td>${exp.company}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="openExpEditor('${exp.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteExperience('${exp.id}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openExpEditor = function (id) {
  const modal = document.getElementById("exp-editor-modal");
  const form = document.getElementById("exp-form");
  form.reset();

  if (id) {
    const exp = portfolioData.experience.find(e => e.id === id);
    if (!exp) return;

    document.getElementById("exp-id").value = exp.id;
    document.getElementById("exp-date").value = exp.date;
    document.getElementById("exp-role").value = exp.role;
    document.getElementById("exp-company").value = exp.company;
    document.getElementById("exp-accomplishments").value = (exp.accomplishments || []).join("\n");
  } else {
    document.getElementById("exp-id").value = "";
  }

  modal.classList.remove("hidden");
};

window.deleteExperience = function (id) {
  if (confirm("Are you sure you want to delete this experience entry?")) {
    portfolioData.experience = portfolioData.experience.filter(e => e.id !== id);
    saveData();
    renderExperience();
  }
};

// Language Managers
function renderLanguages() {
  const tbody = document.getElementById("languages-list-body");
  tbody.innerHTML = "";

  portfolioData.languages.forEach((lang, index) => {
    const tr = document.createElement("tr");
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
      starsHtml += i < lang.stars ? "★" : "☆";
    }
    tr.innerHTML = `
      <td><strong>${lang.name}</strong></td>
      <td style="color: var(--primary-accent); font-size: 1.1rem;">${starsHtml}</td>
      <td>
        <div style="display:flex;gap:0.4rem;">
          <button class="btn btn-secondary btn-sm" onclick="editLanguage(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteLanguage(${index})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.editLanguage = function (index) {
  const lang = portfolioData.languages[index];
  if (!lang) return;

  document.getElementById("lang-name").value = lang.name;
  document.getElementById("lang-stars").value = lang.stars;
  document.getElementById("edit-lang-index").value = index;
  document.getElementById("lang-submit-btn").textContent = "Save Changes";
  document.getElementById("lang-cancel-btn").classList.remove("hidden");

  document.getElementById("language-form").scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("lang-name").focus();
};

window.deleteLanguage = function (index) {
  if (confirm("Delete this language?")) {
    portfolioData.languages.splice(index, 1);
    saveData();
    renderLanguages();
  }
};

// Toolkit Managers
function renderToolkit() {
  const container = document.getElementById("toolkit-badges-list");
  container.innerHTML = "";

  portfolioData.toolkit.forEach((badge, index) => {
    const badgeEl = document.createElement("span");
    badgeEl.className = "badge-editable";
    badgeEl.innerHTML = `
      <span>${badge}</span>
      <button class="remove-badge-btn" onclick="deleteBadge(${index})">×</button>
    `;
    container.appendChild(badgeEl);
  });
}

window.deleteBadge = function (index) {
  portfolioData.toolkit.splice(index, 1);
  saveData();
  renderToolkit();
};

// Certificates Managers
function renderCertificates() {
  const tbody = document.getElementById("certs-list-body");
  tbody.innerHTML = "";

  portfolioData.certificates.forEach((cert) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${cert.title}</strong></td>
      <td>${cert.issuer}</td>
      <td>${cert.validity}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="openCertEditor('${cert.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCert('${cert.id}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openCertEditor = function (id) {
  const modal = document.getElementById("cert-editor-modal");
  const form = document.getElementById("cert-form");
  form.reset();

  if (id) {
    const cert = portfolioData.certificates.find(c => c.id === id);
    if (!cert) return;

    document.getElementById("cert-id").value = cert.id;
    document.getElementById("cert-title").value = cert.title;
    document.getElementById("cert-issuer").value = cert.issuer;
    document.getElementById("cert-issuer-letter").value = cert.letter;
    document.getElementById("cert-image").value = cert.image;
    document.getElementById("cert-validity").value = cert.validity;
    document.getElementById("cert-desc").value = cert.desc;
  } else {
    document.getElementById("cert-id").value = "";
  }

  modal.classList.remove("hidden");
};

window.deleteCert = function (id) {
  if (confirm("Are you sure you want to delete this certificate?")) {
    portfolioData.certificates = portfolioData.certificates.filter(c => c.id !== id);
    saveData();
    renderCertificates();
  }
};

// File upload helper (Firebase Storage)
// prefixInputId: optional id of an <input> whose value overrides defaultPathPrefix at runtime
function setupOfflineFileUpload(fileInputId, textInputId, defaultPathPrefix, callback, prefixInputId) {
  const fileInput = document.getElementById(fileInputId);
  const textInput = document.getElementById(textInputId);

  if (!fileInput || !textInput) return;

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const prefixEl = prefixInputId ? document.getElementById(prefixInputId) : null;
    const prefix = (prefixEl && prefixEl.value.trim()) ? prefixEl.value.trim() : defaultPathPrefix;
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${prefix}${safeFilename}`;

    const originalText = textInput.value;
    textInput.value = "Yükleniyor...";
    
    // Disable submit button in the parent form during upload
    const form = textInput.closest("form");
    const submitBtn = form ? form.querySelector("button[type='submit']") : null;
    let originalSubmitText = "";
    if (submitBtn) {
      submitBtn.disabled = true;
      originalSubmitText = submitBtn.textContent;
      submitBtn.textContent = "Yükleniyor...";
    }

    try {
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Instant local preview
      if (typeof callback === "function") {
        const localUrl = URL.createObjectURL(file);
        callback(localUrl, file);
      }

      uploadTask.on('state_changed', 
        (snapshot) => {}, 
        (error) => {
          console.error("Upload error:", error);
          alert("Görsel yüklenemedi. Storage kurallarını kontrol edin.");
          textInput.value = originalText;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalSubmitText;
          }
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          textInput.value = downloadURL;
          textInput.dispatchEvent(new Event("input"));
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalSubmitText;
          }
          if (typeof callback === "function") {
            callback(downloadURL, file);
          }
        }
      );
    } catch (err) {
      console.error("Storage error:", err);
      textInput.value = originalText;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalSubmitText;
      }
    }
    
    fileInput.value = "";
  });
}

// Blob preview cache: maps "assets/images/filename.jpg" -> "blob:..." for current session
const blobPreviewCache = {};

function setupOfflineMultiFileUpload(fileInputId, textInputId, prefixInputId) {
  const fileInput = document.getElementById(fileInputId);
  const textInput = document.getElementById(textInputId);
  const stripId = textInputId + "-thumbs";

  if (!fileInput || !textInput) return;

  fileInput.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const originalText = textInput.value;
    const currentClean = originalText
      .replace(/,\s*Uploading\.\.\./, "").replace(/^Uploading\.\.\./, "")
      .replace(/,\s*Yükleniyor\.\.\./, "").replace(/^Yükleniyor\.\.\./, "");

    const prefixEl = prefixInputId ? document.getElementById(prefixInputId) : null;
    const prefix = (prefixEl && prefixEl.value.trim()) ? prefixEl.value.trim() : "assets/images/";

    textInput.value = currentClean ? `${currentClean}, Yükleniyor...` : "Yükleniyor...";
    
    // Disable submit button in the parent form during upload
    const form = textInput.closest("form");
    const submitBtn = form ? form.querySelector("button[type='submit']") : null;
    let originalSubmitText = "";
    if (submitBtn) {
      submitBtn.disabled = true;
      originalSubmitText = submitBtn.textContent;
      submitBtn.textContent = "Yükleniyor...";
    }

    const newUrls = [];
    
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `${prefix}${safeFilename}`;
        const storageRef = ref(storage, storagePath);
        
        // Cache blob for instant preview
        const reader = new FileReader();
        reader.onload = (ev) => { 
          blobPreviewCache[storagePath] = ev.target.result;
          renderCarouselThumbs(stripId, textInputId);
        };
        reader.readAsDataURL(file);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
          null, 
          (error) => {
            console.error("Error uploading file", file.name, error);
            resolve(null);
          }, 
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            newUrls.push(url);
            resolve(url);
          }
        );
      });
    });
    
    await Promise.all(uploadPromises);
    
    if (newUrls.length > 0) {
      const newUrlsStr = newUrls.join(", ");
      textInput.value = currentClean ? `${currentClean}, ${newUrlsStr}` : newUrlsStr;
      textInput.dispatchEvent(new Event("input"));
    } else {
      alert("Görseller yüklenemedi.");
      textInput.value = currentClean;
    }
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalSubmitText;
    }
    
    renderCarouselThumbs(stripId, textInputId);
    
    fileInput.value = "";
  });
}

// Forms Submission Setup
function initForms() {
  // Setup offline file browse handlers
  setupOfflineFileUpload("p-cv-file", "p-cv", "assets/docs/");
  setupOfflineFileUpload("p-img-file", "p-img-path", "assets/images/", (url, file) => {
    const previewImg = document.getElementById("p-img-preview");
    if (previewImg) {
      previewImg.src = url;
    }
  });
  setupOfflineFileUpload("proj-thumbnail-file", "proj-thumbnail", "assets/images/", null, "proj-thumbnail-prefix");
  setupOfflineMultiFileUpload("proj-images-file", "proj-images", "proj-images-prefix");
  setupOfflineFileUpload("cert-image-file", "cert-image", "assets/images/");

  // Sync manual text changes in profile image input with the polaroid preview
  const pImgPath = document.getElementById("p-img-path");
  if (pImgPath) {
    pImgPath.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      const previewImg = document.getElementById("p-img-preview");
      if (previewImg && val && val !== "Yükleniyor...") {
        const isAbsolute = val.startsWith('http://') || val.startsWith('https://');
        previewImg.src = isAbsolute ? val : (val.startsWith('/') ? val : '/' + val);
      }
    });
  }

  // Setup manual clear button for carousel images
  const clearBtn = document.getElementById("btn-clear-proj-images");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      document.getElementById("proj-images").value = "";
      renderCarouselThumbs("proj-images-thumbs", "proj-images");
    });
  }

  // Personal form submission
  document.getElementById("personal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const profileImgVal = document.getElementById("p-img-path").value;
    if (profileImgVal === "Yükleniyor...") {
      alert("Lütfen görsel yüklemesinin tamamlanmasını bekleyin.");
      return;
    }

    portfolioData.personal.name = document.getElementById("p-name").value;
    portfolioData.personal.email = document.getElementById("p-email").value;
    portfolioData.personal.phone = document.getElementById("p-phone").value;
    portfolioData.personal.instagram = document.getElementById("p-instagram").value;
    portfolioData.personal.linkedin = document.getElementById("p-linkedin").value;
    portfolioData.personal.cvUrl = document.getElementById("p-cv").value;
    portfolioData.personal.profileImage = profileImgVal;

    saveData();
    alert("Personal details updated successfully!");
  });

  // Add / Edit Core Skill
  document.getElementById("add-skill-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-skill-title").value.trim();
    const desc = document.getElementById("new-skill-desc").value.trim();
    const editIdx = document.getElementById("edit-skill-index").value;

    if (editIdx !== "") {
      // Edit mode — update existing skill
      portfolioData.coreSkills[parseInt(editIdx)] = { title, desc };
    } else {
      // Add mode — push new skill
      portfolioData.coreSkills.push({ title, desc });
    }

    saveData();
    renderCoreSkills();

    // Reset form to add mode
    document.getElementById("add-skill-form").reset();
    document.getElementById("edit-skill-index").value = "";
    document.getElementById("skill-submit-btn").textContent = "Add";
    document.getElementById("skill-cancel-btn").classList.add("hidden");
  });

  document.getElementById("skill-cancel-btn").addEventListener("click", () => {
    document.getElementById("add-skill-form").reset();
    document.getElementById("edit-skill-index").value = "";
    document.getElementById("skill-submit-btn").textContent = "Add";
    document.getElementById("skill-cancel-btn").classList.add("hidden");
  });

  // Project Editor submit
  document.getElementById("project-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("proj-id").value;
    const title = document.getElementById("proj-title").value;
    const category = document.getElementById("proj-category").value;
    const thumbnail = document.getElementById("proj-thumbnail").value;
    const images = document.getElementById("proj-images").value;
    const description = document.getElementById("proj-description").value;
    const metaRole = document.getElementById("proj-meta-role").value;
    const metaClientLabel = document.getElementById("proj-meta-client-label").value;
    const metaClient = document.getElementById("proj-meta-client").value;
    const metaTools = document.getElementById("proj-meta-tools").value;
    const metaCategory = document.getElementById("proj-meta-category").value;
    const goals = document.getElementById("proj-goals").value;
    const achievementsRaw = document.getElementById("proj-achievements").value;

    const achievements = achievementsRaw.split("\n").map(a => a.trim()).filter(Boolean);

    if (id) {
      // Edit existing
      const idx = portfolioData.projects.findIndex(p => p.id === id);
      if (idx !== -1) {
        portfolioData.projects[idx] = {
          id, title, category, thumbnail, images, description,
          metaRole, metaClientLabel, metaClient, metaTools, metaCategory, goals, achievements
        };
      }
    } else {
      // Add new
      const newId = "project-" + Date.now();
      portfolioData.projects.push({
        id: newId, title, category, thumbnail, images, description,
        metaRole, metaClientLabel, metaClient, metaTools, metaCategory, goals, achievements
      });
    }

    saveData();
    renderProjects();
    document.getElementById("project-editor-modal").classList.add("hidden");
  });

  document.getElementById("btn-new-project").addEventListener("click", () => openProjectEditor(""));
  document.getElementById("project-editor-close").addEventListener("click", () => {
    document.getElementById("project-editor-modal").classList.add("hidden");
  });
  document.getElementById("btn-cancel-project").addEventListener("click", () => {
    document.getElementById("project-editor-modal").classList.add("hidden");
  });

  // Education form: Add / Edit
  document.getElementById("education-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("edu-date").value.trim();
    const school = document.getElementById("edu-school").value.trim();
    const degree = document.getElementById("edu-degree").value.trim();
    const desc = document.getElementById("edu-desc").value.trim();
    const editIdx = document.getElementById("edit-edu-index").value;

    if (editIdx !== "") {
      portfolioData.education[parseInt(editIdx)] = { date, school, degree, desc };
    } else {
      portfolioData.education.push({ date, school, degree, desc });
    }

    saveData();
    renderEducation();

    document.getElementById("education-form").reset();
    document.getElementById("edit-edu-index").value = "";
    document.getElementById("edu-submit-btn").textContent = "Add";
    document.getElementById("edu-cancel-btn").classList.add("hidden");
  });

  document.getElementById("edu-cancel-btn").addEventListener("click", () => {
    document.getElementById("education-form").reset();
    document.getElementById("edit-edu-index").value = "";
    document.getElementById("edu-submit-btn").textContent = "Add";
    document.getElementById("edu-cancel-btn").classList.add("hidden");
  });

  // Experience Editor submit
  document.getElementById("exp-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("exp-id").value;
    const date = document.getElementById("exp-date").value;
    const role = document.getElementById("exp-role").value;
    const company = document.getElementById("exp-company").value;
    const accomplishmentsRaw = document.getElementById("exp-accomplishments").value;

    const accomplishments = accomplishmentsRaw.split("\n").map(a => a.trim()).filter(Boolean);

    if (id) {
      const idx = portfolioData.experience.findIndex(ex => ex.id === id);
      if (idx !== -1) {
        portfolioData.experience[idx] = { id, date, role, company, accomplishments };
      }
    } else {
      const newId = "exp-" + Date.now();
      portfolioData.experience.push({ id: newId, date, role, company, accomplishments });
    }

    saveData();
    renderExperience();
    document.getElementById("exp-editor-modal").classList.add("hidden");
  });

  document.getElementById("btn-new-exp").addEventListener("click", () => openExpEditor(""));
  document.getElementById("exp-editor-close").addEventListener("click", () => {
    document.getElementById("exp-editor-modal").classList.add("hidden");
  });
  document.getElementById("btn-cancel-exp").addEventListener("click", () => {
    document.getElementById("exp-editor-modal").classList.add("hidden");
  });

  // Language form: Add / Edit
  document.getElementById("language-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("lang-name").value.trim();
    const stars = parseInt(document.getElementById("lang-stars").value);
    const editIdx = document.getElementById("edit-lang-index").value;

    if (editIdx !== "") {
      portfolioData.languages[parseInt(editIdx)] = { name, stars };
    } else {
      portfolioData.languages.push({ name, stars });
    }

    saveData();
    renderLanguages();

    document.getElementById("language-form").reset();
    document.getElementById("edit-lang-index").value = "";
    document.getElementById("lang-submit-btn").textContent = "Add";
    document.getElementById("lang-cancel-btn").classList.add("hidden");
  });

  document.getElementById("lang-cancel-btn").addEventListener("click", () => {
    document.getElementById("language-form").reset();
    document.getElementById("edit-lang-index").value = "";
    document.getElementById("lang-submit-btn").textContent = "Add";
    document.getElementById("lang-cancel-btn").classList.add("hidden");
  });

  // Toolkit form submit
  document.getElementById("toolkit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const badge = document.getElementById("new-badge").value;

    portfolioData.toolkit.push(badge);
    saveData();
    renderToolkit();
    document.getElementById("toolkit-form").reset();
  });

  // Certificate Editor submit
  document.getElementById("cert-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("cert-id").value;
    const title = document.getElementById("cert-title").value;
    const issuer = document.getElementById("cert-issuer").value;
    const letter = document.getElementById("cert-issuer-letter").value;
    const image = document.getElementById("cert-image").value;
    const validity = document.getElementById("cert-validity").value;
    const desc = document.getElementById("cert-desc").value;

    if (id) {
      const idx = portfolioData.certificates.findIndex(c => c.id === id);
      if (idx !== -1) {
        portfolioData.certificates[idx] = { id, title, issuer, letter, image, validity, desc };
      }
    } else {
      const newId = "cert-" + Date.now();
      portfolioData.certificates.push({ id: newId, title, issuer, letter, image, validity, desc });
    }

    saveData();
    renderCertificates();
    document.getElementById("cert-editor-modal").classList.add("hidden");
  });

  document.getElementById("btn-new-cert").addEventListener("click", () => openCertEditor(""));
  document.getElementById("cert-editor-close").addEventListener("click", () => {
    document.getElementById("cert-editor-modal").classList.add("hidden");
  });
  document.getElementById("btn-cancel-cert").addEventListener("click", () => {
    document.getElementById("cert-editor-modal").classList.add("hidden");
  });

}
