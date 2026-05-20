const http = require('http');
const fs = require('fs');
const path = require('path');

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

  if (reqPath === '/') {
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
