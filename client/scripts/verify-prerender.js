// client/scripts/verify-prerender.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_ROUTES, getRouteSEO } from '../src/data/seoConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

let allPassed = true;
const results = [];

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  CYBREVA PRERENDERED HTML AUDIT — 20 PUBLIC ROUTES');
console.log('═══════════════════════════════════════════════════════════════════\n');

function unescapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

for (const route of PUBLIC_ROUTES) {
  const seo = getRouteSEO(route);
  const cleanPath = route === '/' ? 'index.html' : route.replace(/^\/+/, '') + '/index.html';
  const filePath = path.join(distDir, cleanPath);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${filePath}`);
    allPassed = false;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Title check
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].trim() : null;
  const actualTitle = unescapeHtml(rawTitle);
  const hasExpectedTitle = actualTitle === seo.title;

  // 2. Meta description check
  const descMatch = html.match(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i);
  const rawDesc = descMatch ? descMatch[1].trim() : null;
  const actualDesc = unescapeHtml(rawDesc);
  const hasExpectedDesc = actualDesc === seo.description;

  // 3. Canonical check
  const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([\s\S]*?)"\s*\/?>/i);
  const rawCanon = canonMatch ? canonMatch[1].trim() : null;
  const actualCanon = unescapeHtml(rawCanon);
  const hasExpectedCanon = actualCanon === seo.canonical;

  // 4. OG checks
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([\s\S]*?)"\s*\/?>/i);
  const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([\s\S]*?)"\s*\/?>/i);
  const ogUrlMatch = html.match(/<meta\s+property="og:url"\s+content="([\s\S]*?)"\s*\/?>/i);
  const ogTypeMatch = html.match(/<meta\s+property="og:type"\s+content="([\s\S]*?)"\s*\/?>/i);

  const ogTitle = unescapeHtml(ogTitleMatch ? ogTitleMatch[1].trim() : null);
  const ogDesc = unescapeHtml(ogDescMatch ? ogDescMatch[1].trim() : null);
  const ogUrl = unescapeHtml(ogUrlMatch ? ogUrlMatch[1].trim() : null);
  const ogType = unescapeHtml(ogTypeMatch ? ogTypeMatch[1].trim() : null);

  const hasExpectedOg =
    ogTitle === seo.title &&
    ogDesc === seo.description &&
    ogUrl === seo.canonical &&
    ogType === (seo.ogType || 'website');

  // 5. Body content check: extract full content between <div id="root"> and last </div> before </body>
  const rootIndex = html.indexOf('<div id="root">');
  const lastDivIndex = html.lastIndexOf('</div>');
  const bodyContent =
    rootIndex !== -1 && lastDivIndex > rootIndex
      ? html.slice(rootIndex + '<div id="root">'.length, lastDivIndex).trim()
      : '';
  const hasContent = bodyContent.length > 500;

  // 6. Homepage leakage check (if not homepage, must NOT have homepage canonical or title)
  let noHomepageLeak = true;
  if (route !== '/') {
    const homeSeo = getRouteSEO('/');
    if (actualCanon === homeSeo.canonical || actualTitle === homeSeo.title) {
      noHomepageLeak = false;
    }
  }

  const pass =
    hasExpectedTitle &&
    hasExpectedDesc &&
    hasExpectedCanon &&
    hasExpectedOg &&
    hasContent &&
    noHomepageLeak;

  if (!pass) allPassed = false;

  console.log(`[${pass ? '✅ PASS' : '❌ FAIL'}] ${route}`);
  console.log(`       Title: ${actualTitle}`);
  console.log(`       Canon: ${actualCanon}`);
  console.log(`       Desc:  ${actualDesc?.slice(0, 75)}...`);
  console.log(`       Body:  ${bodyContent.length} chars | OG: ${hasExpectedOg ? 'OK' : 'FAIL'} | Leak: ${noHomepageLeak ? 'CLEAN' : 'LEAKED'}\n`);

  results.push({
    route,
    pass,
    title: actualTitle,
    canonical: actualCanon,
    bodyLength: bodyContent.length,
  });
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log(`OVERALL RESULT: ${allPassed ? 'ALL 20 ROUTES PASSED VERIFICATION! 🚀' : 'FAILURES DETECTED!'}`);
console.log('═══════════════════════════════════════════════════════════════════');

if (!allPassed) {
  process.exit(1);
}
