// Default portfolio data to match the website's initial state
const DEFAULT_PORTFOLIO_DATA = {
  personal: {
    name: "Alara Soysan",
    email: "info@alarasoysan.com",
    phone: "+31625632446",
    instagram: "https://instagram.com/alarasoysan",
    linkedin: "https://www.linkedin.com/in/alara-soysan-8a901a243/",
    cvUrl: "alaraCV.pdf"
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
      thumbnail: "assets/images/project_yoga.png",
      images: "assets/images/project_yoga.png, assets/images/yogaProject/kapak.jpeg",
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

// Security Check (simple PIN protection)
function initSecurity() {
  const loginWrapper = document.getElementById("login-wrapper");
  const loginForm = document.getElementById("login-form");
  const adminMain = document.getElementById("admin-main");
  const logoutBtn = document.getElementById("logout-btn");

  const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";

  if (isLoggedIn) {
    loginWrapper.classList.add("hidden");
    adminMain.classList.remove("hidden");
    loadData();
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("admin-password").value;
    if (password === "#asysn03!") {
      sessionStorage.setItem("adminLoggedIn", "true");
      loginWrapper.classList.add("hidden");
      adminMain.classList.remove("hidden");
      loadData();
    } else {
      alert("Hatalı şifre! Lütfen tekrar deneyin.");
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("adminLoggedIn");
    window.location.reload();
  });
}

// Tab navigation setup
function initTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const activeTabLabel = document.getElementById("active-tab-label");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
      activeTabLabel.textContent = btn.textContent;
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
function loadData() {
  const localData = localStorage.getItem("portfolioData");
  if (localData) {
    try {
      portfolioData = JSON.parse(localData);
    } catch (e) {
      portfolioData = DEFAULT_PORTFOLIO_DATA;
    }
  } else {
    portfolioData = DEFAULT_PORTFOLIO_DATA;
    saveData(false); // save default configuration to storage
  }

  populatePersonalForm();
  renderCoreSkills();
  renderProjects();
  renderEducation();
  renderExperience();
  renderLanguages();
  renderToolkit();
  renderCertificates();
  updateJsonPreview();
}

function saveData(updatePreview = true) {
  localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
  if (updatePreview) {
    updateJsonPreview();
  }
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
        <button class="btn btn-danger btn-sm" onclick="deleteCoreSkill(${index})">Sil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.deleteCoreSkill = function(index) {
  if (confirm("Bu yeteneği silmek istediğinize emin misiniz?")) {
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
      <td><img src="${proj.thumbnail}" class="project-thumb-preview" alt=""></td>
      <td><strong>${proj.title}</strong></td>
      <td><span class="admin-tag" style="background-color: var(--folder-bg);">${proj.category}</span></td>
      <td><span style="font-size: 0.85rem; color: var(--text-muted);">${proj.images.split(",").length} görsel</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="openProjectEditor('${proj.id}')">Düzenle</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject('${proj.id}')">Sil</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openProjectEditor = function(id) {
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

    document.getElementById("editor-title-label").textContent = "Proje Düzenle";
  } else {
    document.getElementById("proj-id").value = "";
    document.getElementById("editor-title-label").textContent = "Yeni Proje Ekle";
  }

  modal.classList.remove("hidden");
};

window.deleteProject = function(id) {
  if (confirm("Bu projeyi silmek istediğinize emin misiniz?")) {
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
        <button class="btn btn-danger btn-sm" onclick="deleteEducation(${index})">Sil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.deleteEducation = function(index) {
  if (confirm("Bu eğitim kaydını silmek istediğinize emin misiniz?")) {
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
          <button class="btn btn-secondary btn-sm" onclick="openExpEditor('${exp.id}')">Düzenle</button>
          <button class="btn btn-danger btn-sm" onclick="deleteExperience('${exp.id}')">Sil</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openExpEditor = function(id) {
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

window.deleteExperience = function(id) {
  if (confirm("Bu deneyim kaydını silmek istediğinize emin misiniz?")) {
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
        <button class="btn btn-danger btn-sm" onclick="deleteLanguage(${index})">Sil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.deleteLanguage = function(index) {
  if (confirm("Bu dil bilgisini silmek istediğinize emin misiniz?")) {
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

window.deleteBadge = function(index) {
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
          <button class="btn btn-secondary btn-sm" onclick="openCertEditor('${cert.id}')">Düzenle</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCert('${cert.id}')">Sil</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openCertEditor = function(id) {
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

window.deleteCert = function(id) {
  if (confirm("Bu sertifikayı silmek istediğinize emin misiniz?")) {
    portfolioData.certificates = portfolioData.certificates.filter(c => c.id !== id);
    saveData();
    renderCertificates();
  }
};

// Forms Submission Setup
function initForms() {
  // Personal form submission
  document.getElementById("personal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    portfolioData.personal.name = document.getElementById("p-name").value;
    portfolioData.personal.email = document.getElementById("p-email").value;
    portfolioData.personal.phone = document.getElementById("p-phone").value;
    portfolioData.personal.instagram = document.getElementById("p-instagram").value;
    portfolioData.personal.linkedin = document.getElementById("p-linkedin").value;
    portfolioData.personal.cvUrl = document.getElementById("p-cv").value;

    saveData();
    alert("Kişisel bilgiler başarıyla güncellendi!");
  });

  // Add Core Skill
  document.getElementById("add-skill-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-skill-title").value;
    const desc = document.getElementById("new-skill-desc").value;

    portfolioData.coreSkills.push({ title, desc });
    saveData();
    renderCoreSkills();
    document.getElementById("add-skill-form").reset();
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

  // Education form submit
  document.getElementById("education-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("edu-date").value;
    const school = document.getElementById("edu-school").value;
    const degree = document.getElementById("edu-degree").value;
    const desc = document.getElementById("edu-desc").value;

    portfolioData.education.push({ date, school, degree, desc });
    saveData();
    renderEducation();
    document.getElementById("education-form").reset();
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

  // Language form submit
  document.getElementById("language-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("lang-name").value;
    const stars = parseInt(document.getElementById("lang-stars").value);

    portfolioData.languages.push({ name, stars });
    saveData();
    renderLanguages();
    document.getElementById("language-form").reset();
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

  // Download & Copy JSON
  document.getElementById("btn-download-json").addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  document.getElementById("btn-copy-json").addEventListener("click", () => {
    const textarea = document.getElementById("json-preview");
    textarea.select();
    document.execCommand("copy");
    alert("JSON verisi panoya kopyalandı!");
  });
}

function updateJsonPreview() {
  document.getElementById("json-preview").value = JSON.stringify(portfolioData, null, 2);
}
