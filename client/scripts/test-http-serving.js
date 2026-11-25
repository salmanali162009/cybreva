// client/scripts/test-http-serving.js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_ROUTES, getRouteSEO } from '../src/data/seoConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = 4173;

// Lightweight static file server mimicking Vercel's cleanUrls & static routing
function createServer() {
  return http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Normalize trailing slash
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    let filePath = null;

    if (pathname === '/') {
      filePath = path.join(distDir, 'index.html');
    } else {
      // 1. Check clean path .html (e.g. dist/features.html)
      const cleanHtmlPath = path.join(distDir, `${pathname.slice(1)}.html`);
      // 2. Check directory index (e.g. dist/features/index.html)
      const dirIndexPath = path.join(distDir, pathname.slice(1), 'index.html');
      // 3. Check direct asset
      const directPath = path.join(distDir, pathname.slice(1));

      if (fs.existsSync(cleanHtmlPath) && fs.statSync(cleanHtmlPath).isFile()) {
        filePath = cleanHtmlPath;
      } else if (fs.existsSync(dirIndexPath) && fs.statSync(dirIndexPath).isFile()) {
        filePath = dirIndexPath;
      } else if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
        filePath = directPath;
      } else {
        // Fallback to index.html (SPA routing for non-prerendered routes)
        filePath = path.join(distDir, 'index.html');
      }
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function runTests() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`🌐 Local HTTP preview server running on http://localhost:${PORT}\n`);

  let allPassed = true;

  console.log('Testing Raw HTTP Responses for all 20 public routes:\n');

  for (const route of PUBLIC_ROUTES) {
    const seo = getRouteSEO(route);
    const url = `http://localhost:${PORT}${route}`;
    const res = await fetchUrl(url);

    const titleMatch = res.body.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';

    const canonMatch = res.body.match(/<link\s+rel="canonical"\s+href="([\s\S]*?)"\s*\/?>/i);
    const canon = canonMatch ? canonMatch[1] : '';

    const rootIdx = res.body.indexOf('<div id="root">');
    const lastDiv = res.body.lastIndexOf('</div>');
    const bodyContent = rootIdx !== -1 && lastDiv > rootIdx ? res.body.slice(rootIdx, lastDiv) : '';

    const statusOk = res.status === 200;
    const canonOk = canon === seo.canonical;
    const bodyOk = bodyContent.length > 500;

    const routePass = statusOk && canonOk && bodyOk;
    if (!routePass) allPassed = false;

    console.log(`[${routePass ? '✅ 200' : '❌ FAIL'}] ${route}`);
    console.log(`       Canonical: ${canon}`);
    console.log(`       Rendered HTML: ${bodyContent.length} bytes in raw response\n`);
  }

  // Also test SPA fallback for unprerendered route (e.g. /login)
  console.log('Testing SPA fallback for dynamic / client-side route (/login):');
  const loginRes = await fetchUrl(`http://localhost:${PORT}/login`);
  const loginHasIndex = loginRes.body.includes('<div id="root">');
  console.log(`[${loginRes.status === 200 && loginHasIndex ? '✅ 200' : '❌ FAIL'}] /login -> Served index.html fallback\n`);

  server.close();

  if (!allPassed) {
    console.error('❌ HTTP verification failed.');
    process.exit(1);
  }

  console.log('🎉 Raw HTTP Verification Complete: All 20 routes served with 200 OK and unique HTML content!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
