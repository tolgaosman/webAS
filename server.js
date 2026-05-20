const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

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
