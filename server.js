const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Default seed data ────────────────────────────────────────────────────────
// portfolio-data.json is gitignored so that admin edits are never overwritten
// by code pushes. On a fresh deploy the file won't exist, so we seed it here.
const DATA_FILE = path.join(__dirname, 'portfolio-data.json');

const DEFAULT_PORTFOLIO_DATA = {
  personal: {
    name: "Alara Soysan",
    email: "alarasoysan@gmail.com",
    phone: "+31625632446",
    instagram: "https://instagram.com/alarasysn",
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
      description: "Rotterdam'daki yerel bir topluluk merkezi için tasarlanan bütünleşik marka ve dijital pazarlama kampanyası.",
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
      description: "Nike Turkey bünyesinde yürütülen işveren markası araştırması ve yetenek edinimi strateji sunumu.",
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
      description: "Hogeschool Rotterdam kampüsünde öğrencilerin iyi olma hallerini desteklemek için kurulan yoga stüdyosunun iletişim ve tanıtım projesi.",
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
      date: "September 2025 - January 2026",
      school: "Rotterdam Business School",
      degree: "Digital Marketing Minor",
      desc: "Google Analytics veri analizi, SEO yazarlığı, e-posta pazarlama optimizasyonları ve dijital reklam stratejileri."
    },
    {
      date: "September 2022 - Present",
      school: "Hogeschool Rotterdam",
      degree: "BSc International Business",
      desc: "Uzmanlık: Organisation & Change Management."
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
    "Microsoft Office", "SPSS Tool", "Canva Visuals", "CapCut Editing",
    "Content Creation", "SEO Copywriting", "Google Analytics", "Email Marketing",
    "Communication", "Adaptability", "Collaboration", "Time Management"
  ],
  certificates: [
    { id: "cert-1", title: "E-posta Pazarlaması Sertifikası", issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert1.jpeg", validity: "Geçerlilik: Ocak 2026 - Şubat 2028", desc: "E-posta stratejisi oluşturma, segmentasyon, yüksek performanslı gönderimler ve optimizasyon süreçleri." },
    { id: "cert-2", title: "Dijital Reklamcılık Sertifikası", issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert2.jpeg", validity: "Geçerlilik: Ocak 2026 - Şubat 2027", desc: "Dijital reklam kampanyaları, içerik stratejisi ve en iyi reklam yönetimi uygulamaları." },
    { id: "cert-3", title: "Sosyal Medya Sertifikası", issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert3.jpeg", validity: "Geçerlilik: Aralık 2025 - Ocak 2028", desc: "Inbound sosyal medya stratejisi, içerik yönetimi, sosyal dinleme ve ROI ölçümleme teknikleri." },
    { id: "cert-4", title: "Inbound Sertifikası", issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert4.jpeg", validity: "Geçerlilik: Ocak 2026 - Şubat 2028", desc: "Potansiyel müşterileri çekme, etkileşime geçme ve Inbound metodolojisine dayalı Flywheel iş modeli." },
    { id: "cert-5", title: "Dijital Pazarlama Sertifikası", issuer: "HubSpot Academy", letter: "H", image: "assets/images/cert5.jpeg", validity: "Geçerlilik: Aralık 2025 - Haziran 2027", desc: "SEO dostu içerik üretimi, web sitesi optimizasyonu ve bütünleşik dijital pazarlama stratejileri." },
    { id: "cert-6", title: "Google Analytics Sertifikası", issuer: "Google Academy", letter: "G", image: "assets/images/cert6.jpeg", validity: "Geçerlilik: Aralık 2025 - Aralık 2026", desc: "Veri takibi, kanal performans ölçümleri, kullanıcı analizleri ve gösterge panoları kullanımı." }
  ]
};

// Seed the data file if it doesn't exist (fresh deploy)
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_PORTFOLIO_DATA, null, 2), 'utf8');
  console.log('portfolio-data.json not found — seeded from defaults.');
} else {
  console.log('portfolio-data.json found — using existing data.');
}
// ─────────────────────────────────────────────────────────────────────────────

// Helper to push updates to GitHub repository to prevent data loss on ephemeral servers like Render
function saveToGitHub(filePath, fileContent, isBase64 = false) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'tolgaosman';
  const repo = process.env.GITHUB_REPO || 'webAS';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) {
    console.warn("GITHUB_TOKEN not configured. Skipping GitHub backup.");
    return;
  }

  // Helper to make https requests using standard library
  function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body });
        });
      });
      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  }

  // Step 1: Get SHA of existing file if it exists
  const getOptions = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
    method: 'GET',
    headers: {
      'User-Agent': 'NodeJS-Server',
      'Authorization': `token ${token}`
    }
  };

  makeRequest(getOptions)
    .then(({ statusCode, body }) => {
      let sha = undefined;
      if (statusCode === 200) {
        try {
          const fileInfo = JSON.parse(body);
          sha = fileInfo.sha;
        } catch (e) {
          console.error("Error parsing file info from GitHub:", e);
        }
      }

      // Step 2: Upload / update file contents
      const contentBase64 = isBase64 ? fileContent : Buffer.from(fileContent).toString('base64');
      const putData = JSON.stringify({
        message: `chore: update ${filePath} via admin panel [skip ci]`,
        content: contentBase64,
        sha: sha,
        branch: branch
      });

      const putOptions = {
        hostname: 'api.github.com',
        path: `/repos/${owner}/${repo}/contents/${filePath}`,
        method: 'PUT',
        headers: {
          'User-Agent': 'NodeJS-Server',
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(putData)
        }
      };

      return makeRequest(putOptions, putData);
    })
    .then(({ statusCode, body }) => {
      if (statusCode === 200 || statusCode === 201) {
        console.log(`Successfully committed ${filePath} to GitHub repository.`);
      } else {
        console.error(`Failed to commit ${filePath} to GitHub repository. Status: ${statusCode}, Body: ${body}`);
      }
    })
    .catch((err) => {
      console.error(`Error saving ${filePath} to GitHub:`, err);
    });
}

const PORT = process.env.PORT || 8081;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

http.createServer((req, res) => {
  // CORS – allow the main portfolio site to read data from this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Normalize request url and remove query params
  let reqPath = req.url.split('?')[0];

  // API Endpoints
  if (req.method === 'POST' && reqPath === '/api/save-portfolio-data') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        fs.writeFile(path.join(__dirname, 'portfolio-data.json'), JSON.stringify(data, null, 2), 'utf8', (err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to write portfolio data: ' + err.message }));
          } else {
            // Backup to GitHub in the background
            saveToGitHub('portfolio-data.json', JSON.stringify(data, null, 2));

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          }
        });
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON data: ' + e.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && reqPath === '/api/upload') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { filename, fileData } = payload;
        
        if (!filename || !fileData) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing filename or fileData' }));
          return;
        }

        const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.svg'];
        const ext = path.extname(filename).toLowerCase();
        if (!allowedExts.includes(ext)) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'File type not allowed' }));
          return;
        }

        const uploadDir = path.join(__dirname, 'assets', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFilename = `${Date.now()}_${safeFilename}`;
        const targetPath = path.join(uploadDir, uniqueFilename);

        const base64Data = fileData.replace(/^data:.*;base64,/, "");
        
        fs.writeFile(targetPath, base64Data, 'base64', (err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to save file: ' + err.message }));
          } else {
            // Backup the uploaded file to GitHub in the background
            saveToGitHub(`assets/uploads/${uniqueFilename}`, base64Data, true);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: true, 
              url: `assets/uploads/${uniqueFilename}` 
            }));
          }
        });
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON request: ' + e.message }));
      }
    });
    return;
  }

  if (reqPath === '/' || reqPath === '/login' || reqPath === '/login/' || reqPath === '/admin_panel' || reqPath === '/admin_panel/') {
    reqPath = '/admin.html';
  }
  
  const filePath = path.join(__dirname, reqPath);
  
  // Prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File Not Found');
      } else {
        res.statusCode = 500;
        res.end('Internal Server Error: ' + err.code);
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      res.end(data);
    }
  });
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
