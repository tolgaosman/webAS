import type { PortfolioApiResponse } from "../types/api";
import type { LocalizedString } from "../i18n/types";

/**
 * Dev-only fixture for `npm run dev:mock` (§Faz 5-7, "verifiable here"
 * checklist) — lets the entire React UI be built and visually checked
 * without PHP/MySQL running. Derived from the real, un-escaped content
 * of the pre-rewrite portfolio-data.json plus
 * backend/database/seeders/StaticContentSeeder.php, so what you see in
 * mock mode is what the site looks like right after
 * `php artisan migrate --seed && php artisan portfolio:import`.
 */

const t = (tr: string): LocalizedString => ({ tr, en: "", nl: "" });

export const mockPortfolio: PortfolioApiResponse = {
  personal: {
    name: "Alara Soysan",
    email: "alarasoysan@gmail.com",
    phone: "+31625632446",
    instagram: "https://instagram.com/alarasysn",
    linkedin: "https://www.linkedin.com/in/alara-soysan-8a901a243/",
    cvUrl: t("alaraCV.pdf"),
    profileImage: "assets/images/ALARA.jpeg",
  },
  coreSkills: [
    { id: 1, title: t("Digital Content"), desc: t("Görsel ve video tasarımı, sosyal medya kampanyaları ve kreatif içerik planlaması.") },
    { id: 2, title: t("Structured Details"), desc: t("Analitik ve yapılandırılmış planlama, pazar araştırması ve veri odaklı kararlar.") },
    { id: 3, title: t("Website UX"), desc: t("Kullanıcı odaklı dijital arayüz tasarımı ve marka deneyimi geliştirme.") },
    { id: 4, title: t("Communication"), desc: t("Şeffaf ve etkili iletişim, işveren markası ve kurumsal iç iletişim.") },
    { id: 5, title: t("Adaptability"), desc: t("Değişen koşullara hızlı uyum, dinamik proje yönetimi ve esnek çözümler.") },
  ],
  projects: [
    {
      id: 1,
      title: t("de Schouw Branding Campaign"),
      category: t("SOCIAL MEDIA STRATEGY"),
      thumbnail: "assets/images/schouwKapak.jpeg",
      images: ["assets/images/schouwKapak.jpeg", "assets/images/social.jpeg", "assets/images/seo.jpeg"],
      description: t("Rotterdam'daki yerel bir topluluk merkezi için tasarlanan bütünleşik marka ve dijital pazarlama kampanyası. Dijital görünürlüğü artırmayı ve yerel etkileşimi güçlendirmeyi hedefler."),
      metaRole: t("Branding & Content Creator"),
      metaClientLabel: t("CLIENT / GROUP"),
      metaClient: t("de Schouw (Team Iron Man 4)"),
      metaTools: t("Canva, Photoshop, CapCut"),
      metaCategory: t("Digital Marketing & Branding"),
      goals: t("UNSDG 11, UNSDG 12"),
      achievements: [
        t("Canva ile tutarlı ve sürdürülebilir bir görsel tasarım sistemi kuruldu."),
        t("Yerel topluluğun sosyal medya etkileşim oranlarında %45 artış gözlemlendi."),
        t("SEO odaklı kopya yazımı ile dijital görünürlük ve erişim artırıldı."),
      ],
    },
    {
      id: 2,
      title: t("Nike Employer Brand"),
      category: t("EMPLOYER BRANDING"),
      thumbnail: "assets/images/project_nike.png",
      images: ["assets/images/project_nike.png", "assets/images/branding.jpeg"],
      description: t("Nike Turkey bünyesinde yürütülen işveren markası araştırması ve yetenek edinimi strateji sunumu. Yeni nesil aday deneyimini geliştirmeye odaklanır."),
      metaRole: t("Brand Consultant"),
      metaClientLabel: t("CLIENT / GROUP"),
      metaClient: t("Nike Turkey"),
      metaTools: t("Office 365, Canva, Illustrator"),
      metaCategory: t("Recruitment & Employer Branding"),
      goals: t("UNSDG 8, UNSDG 10"),
      achievements: [
        t("Genç yeteneklere yönelik işveren markası konumlandırma analizi gerçekleştirildi."),
        t("Aday başvuru süreçlerindeki sürtünmeyi azaltmak için UX iyileştirme önerileri sunuldu."),
        t("Sosyal medya üzerinden potansiyel aday erişimi için içerik şablonları tasarlandı."),
      ],
    },
    {
      id: 3,
      title: t("Student Yoga Studio"),
      category: t("CAMPUS ENGAGEMENT"),
      thumbnail: "assets/images/yogaProject/kapak.jpeg",
      images: [
        "assets/images/yogaProject/kapak.jpeg",
        "assets/images/yogaProject/anaSayfa.jpeg",
        "assets/images/yogaProject/aboutMe.jpeg",
        "assets/images/yogaProject/aciklama.jpeg",
        "assets/images/yogaProject/post.jpeg",
      ],
      description: t("Hogeschool Rotterdam kampüsünde öğrencilerin iyi olma hallerini (well-being) desteklemek için kurulan yoga stüdyosunun iletişim ve tanıtım projesi."),
      metaRole: t("Project Coordinator"),
      metaClientLabel: t("SPONSOR"),
      metaClient: t("Hogeschool Rotterdam"),
      metaTools: t("SPSS Tool, Office, Google Forms"),
      metaCategory: t("Well-being & Engagement"),
      goals: t("UNSDG 3, UNSDG 4"),
      achievements: [
        t("SPSS analizleri ile öğrenci stres düzeyleri ve yoga aktivitelerinin etkileri raporlandı."),
        t("Sosyal medya entegrasyonu ile haftalık katılım oranlarında %30 artış elde edildi."),
        t("Bilinçli detaylar ve sade estetik odaklı marka kimliği tasarlandı."),
      ],
    },
  ],
  education: [
    {
      id: 1,
      date: t("September 2025 - January 2026"),
      school: "Rotterdam Business School",
      degree: t("Digital Marketing Minor"),
      desc: t("Google Analytics veri analizi, SEO yazarlığı, e-posta pazarlama optimizasyonları ve dijital reklam stratejileri."),
    },
    {
      id: 2,
      date: t("September 2022 - Present"),
      school: "Hogeschool Rotterdam",
      degree: t("BSc International Business"),
      desc: t("Uzmanlık: Organisation & Change Management. Organizasyonel dönüşüm, stratejik planlama ve uluslararası kurumsal yönetim eğitimi."),
    },
  ],
  experience: [
    {
      id: 1,
      date: t("FEBRUARY 2026 - PRESENT"),
      role: t("HR & Branding Intern"),
      company: "Turkcell",
      accomplishments: [
        t("Designing social media visual and video content for employer branding projects using Canva and CapCut."),
        t("Coordination of internal communication and employee engagement activities."),
        t("Inter-team collaboration to maintain brand integrity across channels."),
      ],
    },
    {
      id: 2,
      date: t("FEBRUARY 2025 - FEBRUARY 2026"),
      role: t("Stock Filler"),
      company: "Albert Heijn",
      accomplishments: [
        t("Maintaining customer relationships and product flow in a dynamic store environment."),
        t("Time management and team coordination skills."),
      ],
    },
    {
      id: 3,
      date: t("2022"),
      role: t("Science Exhibitions Volunteer"),
      company: "Volunteer Work",
      accomplishments: [t("Setting up and presenting interactive science booths to visitors.")],
    },
  ],
  languages: [
    { id: 1, name: t("Türkçe (Native)"), stars: 5 },
    { id: 2, name: t("English (C2 Professional)"), stars: 4 },
    { id: 3, name: t("Nederlands (A2.2 Basic)"), stars: 3 },
  ],
  toolkit: [
    "Microsoft Office", "SPSS Tool", "Canva Visuals", "CapCut Editing", "Content Creation",
    "SEO Copywriting", "Google Analytics", "Email Marketing", "Communication", "Adaptability",
    "Collaboration", "Time Management",
  ].map((badge, i) => ({ id: i + 1, badge: t(badge) })),
  certificates: [
    { id: 1, title: t("E-posta Pazarlaması Sertifikası"), issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert1.jpeg", validity: t("Geçerlilik: Ocak 2026 - Şubat 2028"), desc: t("E-posta stratejisi oluşturma, segmentasyon, yüksek performanslı gönderimler ve optimizasyon süreçleri.") },
    { id: 2, title: t("Dijital Reklamcılık Sertifikası"), issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert2.jpeg", validity: t("Geçerlilik: Ocak 2026 - Şubat 2027"), desc: t("Dijital reklam kampanyaları, içerik stratejisi ve en iyi reklam yönetimi uygulamaları.") },
    { id: 3, title: t("Sosyal Medya Sertifikası"), issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert3.jpeg", validity: t("Geçerlilik: Aralık 2025 - Ocak 2028"), desc: t("Inbound sosyal medya stratejisi, içerik yönetimi, sosyal dinleme ve ROI ölçümleme teknikleri.") },
    { id: 4, title: t("Inbound Sertifikası"), issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert4.jpeg", validity: t("Geçerlilik: Ocak 2026 - Şubat 2028"), desc: t("Potansiyel müşterileri çekme, etkileşime geçme ve Inbound metodolojisine dayalı Flywheel iş modeli.") },
    { id: 5, title: t("Dijital Pazarlama Sertifikası"), issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert5.jpeg", validity: t("Geçerlilik: Aralık 2025 - Haziran 2027"), desc: t("SEO dostu içerik üretimi, web sitesi optimizasyonu ve bütünleşik dijital pazarlama stratejileri.") },
    { id: 6, title: t("Google Analytics Sertifikası"), issuer: "Google Academy", letter: "G", image: "assets/images/cert6.jpeg", validity: t("Geçerlilik: Aralık 2025 - Aralık 2026"), desc: t("Veri takibi, kanal performans ölçümleri, kullanıcı analizleri ve gösterge panoları kullanımı.") },
  ],
  bioParagraphs: [
    { id: 1, body: t("Merhaba, ben Alara. Rotterdam'da yaşayan; Hogeschool Rotterdam'da Uluslararası İşletme okuyan bir son sınıf öğrencisiyim. Dijital pazarlama, markalama ve örgütsel değişim yönetimi alanlarına odaklanıyorum.") },
    { id: 2, body: t("Aslen Kıbrıslıyım; şu anda Turkcell'de işveren markası, iç iletişim ve dijital içerik üretimi üzerine çalıştığım bir İK ve Marka stajı yapmaktayım. Hem görsel olarak çekici hem de stratejik olarak anlamlı projeler üretmek için yaratıcılık ile yapıyı bir araya getirmeyi seviyorum.") },
    { id: 3, body: t("Özellikle sade estetikten, düşünülmüş iletişimden ve tasarım yoluyla netlik yaratmaktan besleniyorum. İçerik, markalama veya dijital deneyimler üzerine çalışırken; dengeye, düzenli olmaya ve bilinçli detaylara değer veriyorum.") },
    { id: 4, body: t("Bu portfolyo; projelerimi, fikirlerimi, dijital çalışmalarımı ve görsel bakış açımı paylaştığım, yaratıcı ve profesyonel yolculuğumun bir yansımasıdır.") },
  ],
  hobbies: [
    { id: 1, icon: "🧘🏻‍♀️", label: { tr: "Yoga", en: "Yoga", nl: "Yoga" } },
    { id: 2, icon: "🍳", label: { tr: "Cooking", en: "Cooking", nl: "Cooking" } },
    { id: 3, icon: "🎤", label: { tr: "Singing", en: "Singing", nl: "Singing" } },
    { id: 4, icon: "📸", label: { tr: "Photography", en: "Photography", nl: "Photography" } },
    { id: 5, icon: "🎨", label: { tr: "Coloring", en: "Coloring", nl: "Coloring" } },
  ],
  specialties: [
    { id: 1, image: "assets/images/social.jpg", title: t("Sosyal İçerik"), desc: t("Görsel anlatı stratejileri, Instagram ızgara yerleşimleri ve estetik post tasarımları."), ctaLabel: t("projeleri gör"), ctaHref: "#portfolio" },
    { id: 2, image: "assets/images/seo.jpg", title: t("SEO & Dijital Reklam"), desc: t("Anahtar kelime stratejileri, Google Analytics entegrasyonu ve dijital kampanya kurulumu."), ctaLabel: t("sertifikaları gör"), ctaHref: "#certificates" },
    { id: 3, image: "assets/images/branding.jpg", title: t("İşveren Markası"), desc: t("Şirket içi marka algısının güçlendirilmesi ve employer branding içerik üretim süreçleri."), ctaLabel: t("özgeçmişi gör"), ctaHref: "#resume" },
  ],
  content: {
    "section.about.tag": t("Hakkımda"),
    "section.about.title": t("Netlik & Yapı"),
    "section.specialties.tag": t("Odak Alanları"),
    "section.specialties.title": t("Uzmanlık Alanlarım"),
    "section.portfolio.tag": t("Yaratıcı Çalışmalar"),
    "section.portfolio.title": t("Seçilmiş Kampanyalar"),
    "section.resume.tag": t("Kariyer Geçmişi"),
    "section.resume.title": t("Özgeçmiş & Yetenekler"),
    "section.certificates.tag": t("Referanslar"),
    "section.certificates.title": t("Sertifikalar"),
    "section.contact.tag": t("İletişime Geçin"),
    "section.contact.title": t("Bağlantı Kurun"),
    "hero.marketingLabel": t("Dijital Markalama Öğrencisi"),
    "hero.titleLine1": t("Pazarlama"),
    "hero.titleLine2": t("Portfolyosu"),
    "hero.bylineSuffix": t("Tarafından"),
    "hero.folderTab": t("Hoş Geldiniz"),
    "hero.intro": t("Rotterdam merkezli, Kıbrıs kökenli, Rotterdam İşletme Okulu Uluslararası İşletme 3. sınıf öğrencisiyim. Dijital pazarlama, işveren markası ve sakin estetik tasarımlar geliştiriyorum."),
    "hero.ctaPortfolio": t("Portfolyo"),
    "hero.ctaContact": t("İletişim"),
    "about.bioTab": t("Biografi"),
    "about.interestsTab": t("İlgi Alanları"),
    "about.interestsHeading": t("Hobiler & İlgi Alanları"),
    "about.skillsHeading": t("Temel Yetenekler"),
    "resume.educationTab": t("Eğitim"),
    "resume.experienceTab": t("Deneyim"),
    "resume.languagesTab": t("Languages"),
    "resume.languagesHeading": t("Dil Seviyeleri"),
    "resume.toolkitTab": t("Toolkit"),
    "resume.toolkitHeading": t("Beceriler & Araçlar"),
    "contact.location": t("Rotterdam, Hollanda"),
    "contact.formTitle": t("Merhaba Deyin!"),
    "footer.copy": t("© {year} {name}. Vintage Marketing Concept."),
  },
};
