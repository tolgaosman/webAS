// Project Data for Modal Dynamic Rendering
const projectData = {
  1: {
    title: "Long-Term Campaign (de Schouw)",
    category: "Social Media Branding",
    tagline: "Cultural Storytelling on Instagram",
    image: "assets/images/project_campaign.png",
    description: `
      <p>This project showcases a long-term social media branding campaign developed for <strong>de Schouw</strong>. The campaign focused on cultural storytelling, utilizing creative visuals and engaging narratives on Instagram to strengthen brand affinity and community engagement.</p>
      <p><strong>Key Achievements:</strong></p>
      <ul>
        <li>Designed a cohesive visual grid system utilizing Canva and custom design structures.</li>
        <li>Wrote persuasive, story-driven captions that raised post interactions by 35%.</li>
        <li>Formulated team strategies ("Team Iron Man 4") to ensure consistent content scheduling and high aesthetic quality.</li>
      </ul>
      <p>The campaign successfully transformed the client's digital presence into a structured, visually calm, and structured space, reflecting modern layout design principles.</p>
    `,
    meta: {
      role: "Branding & Content Creator",
      client: "de Schouw (Team Iron Man 4)",
      tools: "Canva, Figma, CapCut, Instagram Insights",
      category: "Social Media Strategy"
    },
    goals: ["Instagram Grid Layout", "Storytelling Copywriting", "Engagement Optimization"]
  },
  2: {
    title: "Move to Zero (Bloom Over Doom)",
    category: "Sustainable Marketing",
    tagline: "Nike-Inspired Ecological Campaign",
    image: "assets/images/project_nike.png",
    description: `
      <p><strong>Move to Zero (Bloom Over Doom)</strong> is a comprehensive mock digital marketing campaign aligned with Nike's circular design principles and global sustainability mission.</p>
      <p>The campaign structure is directly mapped to the United Nations Sustainable Development Goals:</p>
      <ul>
        <li><strong>UNSDG Goal 11 (Sustainable Cities and Communities):</strong> Promoted circular fashion solutions that minimize urban textile wastes.</li>
        <li><strong>UNSDG Goal 12 (Responsible Consumption and Production):</strong> Educated consumers on product lifecycle, return-to-store recycling schemes, and durable apparel care.</li>
      </ul>
      <p>The strategy incorporated digital advertising mockups, visual storytelling, and a structured email nurturing plan to guide consumers from "eco-anxiety" (Doom) to "active green solutions" (Bloom).</p>
    `,
    meta: {
      role: "Campaign Strategist / SEO Specialist",
      course: "Digital Marketing Minor (RBS)",
      tools: "Adobe Photoshop, Mailchimp, SEO Keywords, Hubspot",
      category: "UNSDG Alignments"
    },
    goals: ["UNSDG 11", "UNSDG 12", "Email Marketing & SEO"]
  },
  3: {
    title: "The Yoga Project",
    category: "Visual Identity Design",
    tagline: "Mindfulness and Wellness Branding",
    image: "assets/images/project_yoga.png",
    description: `
      <p>A branding and visual design exploration focused on capturing the essence of yoga: balance, mindfulness, and visual serenity. The project highlights how color psychology and minimalist layouts can communicate calm and stress reduction.</p>
      <p><strong>Core Deliverables:</strong></p>
      <ul>
        <li>Developed a soft, calm visual identity using muted plum, lavender, and warm cream palettes.</li>
        <li>Created modern, minimalist social media assets and logo variants.</li>
        <li>Engineered layout designs focusing on high readability, generous white space, and clear focal points.</li>
      </ul>
      <p>This creative portfolio asset reflects Alara's commitment to structured details, aesthetics, and thoughtful, clear layouts in design work.</p>
    `,
    meta: {
      role: "Visual Designer",
      project: "Personal Branding Concept",
      tools: "Adobe Illustrator, Pinterest Curation, Graphic Design",
      category: "Aesthetics & Calm Layouts"
    },
    goals: ["Visual Serenity", "Color Psychology", "Minimalist Design Guidelines"]
  }
};

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
  const mImage = modalOverlay.querySelector(".modal-hero-img");
  const mDesc = modalOverlay.querySelector(".modal-desc-text");
  
  const metaRole = modalOverlay.querySelector(".meta-role");
  const metaClient = modalOverlay.querySelector(".meta-client");
  const metaTools = modalOverlay.querySelector(".meta-tools");
  const metaCategory = modalOverlay.querySelector(".meta-category");
  const goalBadgeContainer = modalOverlay.querySelector(".modal-goal-badges");

  portfolioCards.forEach(card => {
    card.addEventListener("click", () => {
      const projId = card.getAttribute("data-project-id");
      const data = projectData[projId];

      if (!data) return;

      // Populate Modal details
      mCategory.textContent = data.category;
      mTitle.textContent = data.title;
      mImage.src = data.image;
      mImage.alt = data.title;
      mDesc.innerHTML = data.description;

      // Meta values
      metaRole.textContent = data.meta.role || data.meta.course || "";
      
      // Handle conditional labels for Subject/Client
      const clientLabel = modalOverlay.querySelector(".client-label");
      if (data.meta.client) {
        clientLabel.textContent = "Client / Group";
        metaClient.textContent = data.meta.client;
      } else if (data.meta.course) {
        clientLabel.textContent = "Course Context";
        metaClient.textContent = data.meta.course;
      } else {
        clientLabel.textContent = "Project Type";
        metaClient.textContent = data.meta.project || "Personal Project";
      }

      metaTools.textContent = data.meta.tools;
      metaCategory.textContent = data.meta.category;

      // Build goal/tag badges
      goalBadgeContainer.innerHTML = "";
      data.goals.forEach(goal => {
        const badge = document.createElement("span");
        badge.className = "retro-badge";
        // Special highlighting for UNSDG markers
        if (goal.includes("UNSDG 11")) {
          badge.className = "unsdg-badge goal-11";
        } else if (goal.includes("UNSDG 12")) {
          badge.className = "unsdg-badge goal-12";
        }
        badge.textContent = goal;
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
    const whatsappUrl = `https://wa.me/3125632446?text=${encodedText}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    form.reset();
  });
}
