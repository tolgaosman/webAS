import type { UiDict } from "../types";

// Source: frontend/index.html nav (Ana Sayfa/Hakkımda/...) and the
// legacy inline Google Translate script's langLabels.tr table (both
// recovered from git history — see migration plan §Faz 5-7).
const tr: UiDict = {
  nav: {
    home: "Ana Sayfa",
    about: "Hakkımda",
    specialties: "Uzmanlık Alanları",
    portfolio: "Portfolyo",
    resume: "Özgeçmiş",
    certificates: "Sertifikalar",
    contact: "İletişim",
  },
  langNames: { tr: "Türkçe", en: "İngilizce", nl: "Flemenkçe" },
  portfolio: {
    viewDetails: "Detayları Gör",
    keyAchievements: "Öne Çıkan Kazanımlar",
  },
  modal: {
    role: "Rol / Kapsam",
    client: "Müşteri / Grup",
    tools: "Temel Araçlar",
    focus: "Odak Noktası",
    achievements: "Kazanımlar",
    personalProject: "Kişisel Proje",
  },
  contact: {
    nameLabel: "Adınız Soyadınız *",
    namePlaceholder: "Alara Soysan",
    emailLabel: "E-Posta *",
    emailPlaceholder: "alarasoysan@gmail.com",
    messageLabel: "Mesajınız *",
    messagePlaceholder: "Mesajınızı buraya yazabilirsiniz...",
    submit: "WhatsApp'tan Ulaşın",
    validationAlert: "Lütfen bütün zorunlu alanları doldurun.",
    emailChannelLabel: "E-Posta Gönder",
    locationLabel: "Konum",
    instagramLabel: "Instagram",
    linkedinLabel: "LinkedIn",
    pile1Caption: "Mindfulness",
    pile2Caption: "Konuşalım!",
  },
  resume: {
    openResume: "Open Resume",
    downloadResume: "Download Resume",
  },
};

export default tr;
