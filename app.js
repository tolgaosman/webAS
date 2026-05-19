// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initScrollAnimations();
  initPortfolioModal();
  initContactForm();
});

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

  // Sticky header background addition on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

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

      // Read from DOM to support translation
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

      // Populate Modal details
      mCategory.innerHTML = category;
      mTitle.innerHTML = title;
      mDesc.innerHTML = description;

      // Setup Carousel Images
      carouselTrack.innerHTML = "";
      carouselIndicators.innerHTML = "";
      currentSlideIndex = 0;
      totalSlides = images.length;

      images.forEach((imgSrc, idx) => {
        const img = document.createElement("img");
        img.className = "modal-hero-img";
        img.src = imgSrc;
        img.alt = title.replace(/<[^>]*>?/gm, '') + " " + (idx + 1);
        carouselTrack.appendChild(img);

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
        badge.innerHTML = goal;
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
    const whatsappUrl = `https://wa.me/+31667924317?text=${encodedText}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    form.reset();
  });
}
