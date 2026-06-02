// ===================================================================
// Frontend Application Controller (Visitor View)
// Secure Firebase SDK & XSS Protection
// ===================================================================

import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { escapeHtml, sanitizeUrl, sanitizeImgSrc } from "./sanitize.js";

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadDynamicData();
  initNavigation();
  initScrollAnimations();
  initPortfolioModal();
  initContactForm();
});

// Global portfolioData variable
let portfolioData = null;

async function loadDynamicData() {
  // 1. Try Firebase Firestore (Direct client-side fetch, secured via Security Rules)
  try {
    const docRef = doc(db, "portfolio", "data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      portfolioData = docSnap.data();
      applyDynamicData();
      return;
    }
  } catch (e) {
    console.log("Could not reach Firebase Firestore, trying local/fallback options.", e);
  }

  // 2. Relative path fallback (local dev server / static backup)
  try {
    const res = await fetch("portfolio-data.json");
    if (res.ok) {
      portfolioData = await res.json();
      applyDynamicData();
      return;
    }
  } catch (e) {
    console.log("Relative fetch also failed, trying localStorage.", e);
  }

  // 3. Last resort: localStorage
  const localData = localStorage.getItem("portfolioData");
  if (localData) {
    try {
      portfolioData = JSON.parse(localData);
      applyDynamicData();
    } catch (e) {
      console.warn("Failed to parse localStorage portfolioData", e);
    }
  }
}

function applyDynamicData() {
  if (!portfolioData) return;

  // 1. Personal Details & CV Links
  if (portfolioData.personal) {
    const p = portfolioData.personal;
    
    // Update Profile / Polaroid images (Sanitize URLs)
    if (p.profileImage) {
      const heroProfileImg = document.querySelector(".polaroid-image-box img");
      const contactProfileImg = document.querySelector(".polaroid-pile-item.pile-2 img");
      
      const safeProfileSrc = sanitizeImgSrc(p.profileImage);
      
      if (heroProfileImg && safeProfileSrc) heroProfileImg.setAttribute("src", safeProfileSrc);
      if (contactProfileImg && safeProfileSrc) contactProfileImg.setAttribute("src", safeProfileSrc);
    }
    
    // Update CV links (Sanitize URLs)
    const cvUrl = sanitizeUrl(p.cvUrl || 'alaraCV.pdf');
    const cvButtons = document.querySelectorAll(".resume-actions-group a");
    cvButtons.forEach((btn, idx) => {
      btn.setAttribute("href", cvUrl);
      if (idx !== 0) {
        btn.setAttribute("download", p.cvUrl ? escapeHtml(p.cvUrl.split('/').pop()) : "Alara_Soysan_CV.pdf");
      }
    });

    // Update Hero Social links
    const heroLinkedin = document.querySelector('.hero-socials a[aria-label="LinkedIn"]');
    if (heroLinkedin && p.linkedin) {
      heroLinkedin.setAttribute("href", sanitizeUrl(p.linkedin));
    }
    const heroInstagram = document.querySelector('.hero-socials a[aria-label="Instagram"]');
    if (heroInstagram && p.instagram) {
      heroInstagram.setAttribute("href", sanitizeUrl(p.instagram));
    }

    // Update Instagram and LinkedIn links in contact-channels
    const channelsContainer = document.querySelector(".contact-channels");
    if (channelsContainer) {
      const safeEmail = escapeHtml(p.email || 'info@alarasoysan.com');
      const safeInsta = sanitizeUrl(p.instagram || '');
      const safeLinked = sanitizeUrl(p.linkedin || '');
      
      let channelsHtml = `
        <a href="mailto:${safeEmail}" class="contact-button-card">
          <div class="contact-card-icon">
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <div class="contact-card-text">
            <span class="contact-card-label">E-Posta Gönder</span>
            <span class="contact-card-value">${safeEmail}</span>
          </div>
        </a>
        <div class="contact-button-card">
          <div class="contact-card-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div class="contact-card-text">
            <span class="contact-card-label">Konum</span>
            <span class="contact-card-value">Rotterdam, Hollanda</span>
          </div>
        </div>
      `;

      if (safeInsta) {
        channelsHtml += `
          <a href="${safeInsta}" target="_blank" rel="noopener noreferrer" class="contact-button-card">
            <div class="contact-card-icon" style="background-color: #e1306c; color: white;">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </div>
            <div class="contact-card-text">
              <span class="contact-card-label">Instagram</span>
              <span class="contact-card-value">@alarasoysan</span>
            </div>
          </a>
        `;
      }

      if (safeLinked) {
        channelsHtml += `
          <a href="${safeLinked}" target="_blank" rel="noopener noreferrer" class="contact-button-card">
            <div class="contact-card-icon" style="background-color: #0077b5; color: white;">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <div class="contact-card-text">
              <span class="contact-card-label">LinkedIn</span>
              <span class="contact-card-value">Alara Soysan</span>
            </div>
          </a>
        `;
      }

      // XSS Safe because values are escaped/sanitized
      channelsContainer.innerHTML = channelsHtml; 
    }

    // Update Name elements dynamically (using textContent for safety)
    if (p.name) {
      const pCaption = document.querySelector(".polaroid-caption");
      if (pCaption) pCaption.textContent = p.name;

      const byLine = document.querySelector(".hero-by-line");
      if (byLine) byLine.textContent = `${p.name} Tarafından`;

      const footerCopy = document.querySelector(".footer-copy");
      if (footerCopy) footerCopy.textContent = `© 2026 ${p.name}. Vintage Marketing Concept.`;

      const footerLogo = document.querySelector(".footer-logo");
      if (footerLogo) {
        const parts = p.name.split(" ");
        const first = escapeHtml(parts[0]);
        const rest = escapeHtml(parts.slice(1).join(" "));
        footerLogo.innerHTML = `${first} <span>${rest}.</span>`;
      }
    }

    // Update Hero social buttons
    const heroSocials = document.querySelector(".hero-socials");
    if (heroSocials) {
      const links = heroSocials.querySelectorAll("a");
      links.forEach(link => {
        const ariaLabel = link.getAttribute("aria-label") || "";
        if (ariaLabel.toLowerCase() === "linkedin" && p.linkedin) {
          link.setAttribute("href", sanitizeUrl(p.linkedin));
        } else if (ariaLabel.toLowerCase() === "instagram" && p.instagram) {
          link.setAttribute("href", sanitizeUrl(p.instagram));
        }
      });
    }
  }

  // 2. Core Skills Rendering (supports wrap behavior, up to 5 cols)
  if (portfolioData.coreSkills) {
    const skillsGrid = document.querySelector(".skills-grid");
    if (skillsGrid) {
      skillsGrid.innerHTML = "";
      portfolioData.coreSkills.forEach((skill, index) => {
        const cardClass = `skill-sticky${index === 0 ? "" : ` skill-sticky-${(index % 5) + 1}`}`;
        const card = document.createElement("div");
        card.className = cardClass;
        // XSS Safe: values are escaped
        card.innerHTML = `
          <div class="skill-sticky-content">
            <h4>${escapeHtml(skill.title)}</h4>
            <p>${escapeHtml(skill.desc)}</p>
          </div>
        `;
        skillsGrid.appendChild(card);
      });
    }
  }

  // 3. Projects Rendering (dynamic details inject)
  if (portfolioData.projects) {
    const portfolioGrid = document.querySelector(".portfolio-grid");
    if (portfolioGrid) {
      portfolioGrid.innerHTML = "";
      portfolioData.projects.forEach((proj) => {
        const card = document.createElement("div");
        card.className = "portfolio-card";
        card.setAttribute("data-project-id", escapeHtml(proj.id));
        
        // Safely escape achievements array
        const achievementsHtml = proj.achievements && proj.achievements.length > 0 
          ? `
            <p style="margin-top: 1rem;"><strong>Key Achievements:</strong></p>
            <ul>
              ${proj.achievements.map(ach => `<li>${escapeHtml(ach)}</li>`).join("")}
            </ul>
          ` 
          : "";

        // Ensure safe src for images
        const safeThumb = sanitizeImgSrc(proj.thumbnail);
        const safeImages = escapeHtml(proj.images); // Stored as comma string
        
        // XSS Safe construction
        card.innerHTML = `
          <div class="portfolio-img-box">
            <img src="${safeThumb}" alt="${escapeHtml(proj.title)} Cover Image">
          </div>
          <div class="portfolio-info">
            <span class="portfolio-cat">${escapeHtml(proj.category)}</span>
            <h3 class="portfolio-name">${escapeHtml(proj.title)}</h3>
            <p class="portfolio-desc">${escapeHtml(proj.description).substring(0, 150)}...</p>
            <span class="portfolio-action-btn">
              Detayları Gör
              <svg viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
          <div class="portfolio-hidden-data visually-hidden">
            <div class="data-category">${escapeHtml(proj.category)}</div>
            <div class="data-title">${escapeHtml(proj.title)}</div>
            <div class="data-image notranslate">${safeImages}</div>
            <div class="data-description">
              <p>${escapeHtml(proj.description)}</p>
              ${achievementsHtml}
            </div>
            <div class="data-meta-role">${escapeHtml(proj.metaRole || "")}</div>
            <div class="data-client-label">${escapeHtml(proj.metaClientLabel || "CLIENT / GROUP")}</div>
            <div class="data-meta-client">${escapeHtml(proj.metaClient || "Personal Project")}</div>
            <div class="data-meta-tools">${escapeHtml(proj.metaTools || "")}</div>
            <div class="data-meta-category">${escapeHtml(proj.metaCategory || "")}</div>
            <div class="data-goals">${escapeHtml(proj.goals || "")}</div>
          </div>
        `;
        portfolioGrid.appendChild(card);
      });
    }
  }

  // 4. Education Timeline Rendering
  if (portfolioData.education) {
    const eduTimeline = document.getElementById("education-timeline");
    if (eduTimeline) {
      eduTimeline.innerHTML = "";
      portfolioData.education.forEach((edu) => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.innerHTML = `
          <div class="timeline-node"></div>
          <div class="timeline-date">${escapeHtml(edu.date)}</div>
          <h4 class="timeline-name">${escapeHtml(edu.degree)}</h4>
          <div class="timeline-org">${escapeHtml(edu.school)}</div>
          <div class="timeline-details">
            <p>${escapeHtml(edu.desc)}</p>
          </div>
        `;
        eduTimeline.appendChild(item);
      });
    }
  }

  // 5. Experience Timeline Rendering
  if (portfolioData.experience) {
    const expTimeline = document.getElementById("experience-timeline");
    if (expTimeline) {
      expTimeline.innerHTML = "";
      portfolioData.experience.forEach((exp) => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.innerHTML = `
          <div class="timeline-node"></div>
          <div class="timeline-date">${escapeHtml(exp.date)}</div>
          <h4 class="timeline-name">${escapeHtml(exp.role)}</h4>
          <div class="timeline-org">${escapeHtml(exp.company)}</div>
          <div class="timeline-details">
            <ul>
              ${exp.accomplishments.map(ac => `<li>${escapeHtml(ac)}</li>`).join("")}
            </ul>
          </div>
        `;
        expTimeline.appendChild(item);
      });
    }
  }

  // 6. Languages Rendering
  if (portfolioData.languages) {
    const langContainer = document.getElementById("languages-container");
    if (langContainer) {
      langContainer.innerHTML = "";
      portfolioData.languages.forEach((lang) => {
        const item = document.createElement("div");
        item.className = "lang-item";
        let starsHtml = "";
        for (let i = 0; i < 5; i++) {
          starsHtml += `
            <svg viewBox="0 0 24 24" class="${i < lang.stars ? "star-filled" : "star-empty"}">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          `;
        }
        item.innerHTML = `
          <span class="lang-name">${escapeHtml(lang.name)}</span>
          <div class="lang-stars">
            ${starsHtml}
          </div>
        `;
        langContainer.appendChild(item);
      });
    }
  }

  // 7. Toolkit Rendering
  if (portfolioData.toolkit) {
    const toolkitContainer = document.getElementById("toolkit-container");
    if (toolkitContainer) {
      toolkitContainer.innerHTML = "";
      portfolioData.toolkit.forEach((badge) => {
        const span = document.createElement("span");
        span.className = "retro-badge";
        span.textContent = badge; // TextContent is automatically safe
        toolkitContainer.appendChild(span);
      });
    }
  }

  // 8. Certificates Rendering
  if (portfolioData.certificates) {
    const certsContainer = document.getElementById("certificates-container");
    if (certsContainer) {
      certsContainer.innerHTML = "";
      portfolioData.certificates.forEach((cert) => {
        const card = document.createElement("div");
        card.className = "folder-container cert-folder";
        const isHubspot = cert.issuer.toLowerCase().includes("hubspot");
        const tabStyle = isHubspot ? 'style="background-color: #ff7a59; color: white;"' : "";
        const iconStyle = isHubspot ? 'style="background-color: #ff7a59; color: white;"' : "";

        card.innerHTML = `
          <span class="folder-tab" ${tabStyle}>${escapeHtml(cert.issuer.split(" ")[0])}</span>
          <img class="cert-image" src="${sanitizeImgSrc(cert.image)}" alt="${escapeHtml(cert.title)}">
          <div class="cert-issuer-box">
            <div class="cert-issuer-icon" ${iconStyle}>${escapeHtml(cert.letter)}</div>
            <span class="cert-issuer-name">${escapeHtml(cert.issuer)}</span>
          </div>
          <h3 class="cert-title">${escapeHtml(cert.title)}</h3>
          <div class="cert-body-desc">
            ${escapeHtml(cert.desc)}
            <div class="cert-id">${escapeHtml(cert.validity)}</div>
          </div>
        `;
        certsContainer.appendChild(card);
      });
    }
  }
}

// 1. Theme Controller (Dark/Light Switch)
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("theme") || "light";

  // Set default theme
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

// 2. Navigation Control (Sticky Header & Active Link Tracking)
function initNavigation() {
  const header = document.querySelector("header");
  const navMenu = document.getElementById("nav-menu");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  let lastScrollY = window.scrollY;

  // Sticky header background addition on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
      
      if (window.scrollY > lastScrollY) {
        header.classList.add("nav-hidden");
      } else {
        header.classList.remove("nav-hidden");
      }
    } else {
      header.classList.remove("scrolled");
      header.classList.remove("nav-hidden");
    }
    
    lastScrollY = window.scrollY;

    // Track active section to highlight navigation link
    let currentActiveSection = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        currentActiveSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentActiveSection}`) {
        link.classList.add("active");
      }
    });
  });

  // Mobile Hamburger menu toggle
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    const isOpen = navMenu.classList.contains("open");
    hamburger.innerHTML = isOpen
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  });

  // Close mobile drawer when link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      hamburger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });
  });
}

// 3. Scroll Animations (Intersection Observer)
function initScrollAnimations() {
  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Trigger animation once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(el => revealObserver.observe(el));
}

// 4. Portfolio Details Overlay Modal (Premium Custom Injection)
function initPortfolioModal() {
  const modalOverlay = document.getElementById("portfolio-modal");
  const modalCloseBtn = document.getElementById("modal-close");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  // DOM references inside modal
  const mCategory = modalOverlay.querySelector(".modal-category");
  const mTitle = modalOverlay.querySelector(".modal-title");
  const mDesc = modalOverlay.querySelector(".modal-desc-text");

  const carouselTrack = document.getElementById("carousel-track");
  const carouselPrev = document.getElementById("carousel-prev");
  const carouselNext = document.getElementById("carousel-next");
  const carouselIndicators = document.getElementById("carousel-indicators");

  const metaRole = modalOverlay.querySelector(".meta-role");
  const metaClient = modalOverlay.querySelector(".meta-client");
  const metaTools = modalOverlay.querySelector(".meta-tools");
  const metaCategory = modalOverlay.querySelector(".modal-category");
  const goalBadgeContainer = modalOverlay.querySelector(".modal-goal-badges");

  let currentSlideIndex = 0;
  let totalSlides = 0;

  function updateSlide() {
    carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    const dots = carouselIndicators.querySelectorAll(".carousel-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentSlideIndex);
    });
  }

  carouselPrev.addEventListener("click", () => {
    if (totalSlides <= 1) return;
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    updateSlide();
  });

  carouselNext.addEventListener("click", () => {
    if (totalSlides <= 1) return;
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateSlide();
  });

  portfolioCards.forEach(card => {
    card.addEventListener("click", () => {
      const hiddenData = card.querySelector(".portfolio-hidden-data");
      if (!hiddenData) return;

      // Read from DOM (Safe because they were escaped during creation)
      const category = hiddenData.querySelector(".data-category")?.innerHTML || "";
      const title = hiddenData.querySelector(".data-title")?.innerHTML || "";
      const imageString = hiddenData.querySelector(".data-image")?.textContent || "";
      const description = hiddenData.querySelector(".data-description")?.innerHTML || "";
      const role = hiddenData.querySelector(".data-meta-role")?.innerHTML || "";
      const clientLabelValue = hiddenData.querySelector(".data-client-label")?.innerHTML || "";
      const client = hiddenData.querySelector(".data-meta-client")?.innerHTML || "";
      const course = hiddenData.querySelector(".data-meta-course")?.innerHTML || "";
      const project = hiddenData.querySelector(".data-meta-project")?.innerHTML || "";
      const tools = hiddenData.querySelector(".data-meta-tools")?.innerHTML || "";
      const metaCat = hiddenData.querySelector(".data-meta-category")?.innerHTML || "";
      const goalsRaw = hiddenData.querySelector(".data-goals")?.innerHTML || "";

      // Split comma separated images
      const images = imageString.split(",").map(i => i.trim()).filter(Boolean);

      // Populate Modal details (re-injecting previously sanitized HTML)
      mCategory.innerHTML = category;
      mTitle.innerHTML = title;
      mDesc.innerHTML = description;

      // Setup Carousel Images
      carouselTrack.innerHTML = "";
      carouselIndicators.innerHTML = "";
      currentSlideIndex = 0;
      totalSlides = images.length;

      images.forEach((imgSrcRaw, idx) => {
        const imgSrc = sanitizeImgSrc(imgSrcRaw);
        if (!imgSrc) return;

        // Each slide: wrapper div with blurred bg + sharp foreground image
        const slide = document.createElement("div");
        slide.className = "carousel-slide";

        // Blurred background layer
        const bgImg = document.createElement("img");
        bgImg.className = "carousel-slide-bg";
        bgImg.src = imgSrc;
        bgImg.setAttribute("aria-hidden", "true");

        // Sharp foreground image
        const img = document.createElement("img");
        img.className = "modal-hero-img";
        img.src = imgSrc;
        img.alt = title.replace(/<[^>]*>?/gm, '') + " " + (idx + 1);

        slide.appendChild(bgImg);
        slide.appendChild(img);
        carouselTrack.appendChild(slide);

        if (totalSlides > 1) {
          const dot = document.createElement("span");
          dot.className = "carousel-dot";
          if (idx === 0) dot.classList.add("active");
          dot.addEventListener("click", () => {
            currentSlideIndex = idx;
            updateSlide();
          });
          carouselIndicators.appendChild(dot);
        }
      });

      if (totalSlides > 1) {
        carouselPrev.style.display = "flex";
        carouselNext.style.display = "flex";
        carouselIndicators.style.display = "flex";
      } else {
        carouselPrev.style.display = "none";
        carouselNext.style.display = "none";
        carouselIndicators.style.display = "none";
      }

      updateSlide();

      // Meta values
      metaRole.innerHTML = role || course || "";

      // Handle conditional labels for Subject/Client
      const clientLabel = modalOverlay.querySelector(".client-label");
      if (clientLabelValue) {
        clientLabel.innerHTML = clientLabelValue;
      }

      if (client) {
        metaClient.innerHTML = client;
      } else if (course) {
        metaClient.innerHTML = course;
      } else {
        metaClient.innerHTML = project || "Personal Project";
      }

      metaTools.innerHTML = tools;
      metaCategory.innerHTML = metaCat;

      // Build goal/tag badges
      goalBadgeContainer.innerHTML = "";
      const goals = goalsRaw.split(",").map(g => g.trim()).filter(Boolean);
      goals.forEach(goal => {
        const badge = document.createElement("span");
        badge.className = "retro-badge";
        // Special highlighting for UNSDG markers
        if (goal.includes("UNSDG 11")) {
          badge.className = "unsdg-badge goal-11";
        } else if (goal.includes("UNSDG 12")) {
          badge.className = "unsdg-badge goal-12";
        }
        badge.textContent = goal; // TextContent is XSS safe
        goalBadgeContainer.appendChild(badge);
      });

      // Open Modal
      modalOverlay.classList.add("open");
      document.body.style.overflow = "hidden"; // Disable background scrolling
    });
  });

  // Close Modal triggers
  const closeModal = () => {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = ""; // Enable scrolling
  };

  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close with Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open")) {
      closeModal();
    }
  });
}

// 5. Contact Form Validation and Success Interaction
function initContactForm() {
  const form = document.getElementById("contact-form");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent real browser page refresh

    // Form inputs validation
    const name = document.getElementById("form-name").value;
    const email = document.getElementById("form-email").value;
    const message = document.getElementById("form-message").value;

    if (!name || !email || !message) {
      alert("Lütfen bütün zorunlu alanları doldurun.");
      return;
    }

    // Prepare WhatsApp message
    const whatsappText = `İsim: ${name}\nE-posta: ${email}\nMesaj: ${message}`;
    const encodedText = encodeURIComponent(whatsappText);
    const phoneNum = (portfolioData && portfolioData.personal && portfolioData.personal.phone) 
      ? portfolioData.personal.phone.replace(/[^0-9+]/g, '') 
      : "+31625632446";
    const whatsappUrl = sanitizeUrl(`https://wa.me/${phoneNum}?text=${encodedText}`);

    // Open WhatsApp
    if (whatsappUrl) window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    form.reset();
  });
}
