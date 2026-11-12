#!/usr/bin/env node
/* Local preview: builds the site, serves dist/ on http://localhost:3000 and
   rebuilds whenever something in src/ changes. Zero dependencies.
     npm run dev          (or: node scripts/dev.js --port 4000)
   Form submissions are simulated locally (Netlify handles them in production). */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { build } = require('./build');

const DIST = path.join(__dirname, '..', 'dist');
const SRC = path.join(__dirname, '..', 'src');
const portArg = process.argv.indexOf('--port');
const PORT = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || 3000);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

// Gzip text responses like Netlify does, so local Lighthouse runs are realistic.
function send(res, status, file, req) {
  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const gzip = /text|javascript|json|xml|svg/.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', ...(gzip ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}) });
  const stream = fs.createReadStream(file);
  gzip ? stream.pipe(zlib.createGzip()).pipe(res) : stream.pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      const data = Object.fromEntries(new URLSearchParams(body));
      console.log('\n📨 Form submission (simulated locally):', data);
      if (data['bot-field']) console.log('   (honeypot filled: Netlify would discard this as spam)');
      if ((req.headers['content-type'] || '').includes('urlencoded') && req.headers['sec-fetch-mode'] === 'navigate') {
        res.writeHead(303, { Location: '/thank-you/' }); return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ok');
    });
    return;
  }
  let p = path.normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
  let file = path.join(DIST, p);
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  if (fs.existsSync(file)) return send(res, 200, file, req);
  send(res, 404, path.join(DIST, '404.html'), req);
});

(async () => {
  await build();
  server.listen(PORT, () => console.log(`\n▶ Preview running at http://localhost:${PORT}  (Ctrl+C to stop)\n`));
  let timer;
  fs.watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error('Build failed:', e.message)), 150);
  });
})();
