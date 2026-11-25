// client/scripts/prerender.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const templatePath = path.resolve(distDir, 'index.html');
const serverEntryPath = path.resolve(distDir, 'server', 'entry-server.js');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setTitle(html, title) {
  const regex = /<title>[\s\S]*?<\/title>/i;
  const newTag = `<title>${escapeHtml(title)}</title>`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function setCanonical(html, canonicalUrl) {
  const regex = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  const newTag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function setMeta(html, attrName, attrValue, content) {
  if (!content) return html;
  const regex = new RegExp(`<meta\\s+${attrName}="${attrValue}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  const newTag = `<meta ${attrName}="${attrValue}" content="${escapeHtml(content)}" />`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function setJsonLd(html, schema) {
  if (!schema) return html;
  const cleanHtml = html.replace(/<script\s+id="cybreva-jsonld"[\s\S]*?<\/script>/i, '');
  const scriptTag = `    <script type="application/ld+json" id="cybreva-jsonld">\n${JSON.stringify(schema, null, 2)}\n    </script>\n  `;
  return cleanHtml.replace('</head>', `${scriptTag}</head>`);
}

async function prerender() {
  console.log('🚀 Starting Cybreva Static Route Prerendering...');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Client template not found at ${templatePath}. Run "vite build" first.`);
  }

  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`Server entry not found at ${serverEntryPath}. Run "vite build --ssr src/entry-server.jsx --outDir dist/server" first.`);
  }

  const rawTemplate = fs.readFileSync(templatePath, 'utf8');
  const { render } = await import(`file://${serverEntryPath}`);
  const { PUBLIC_ROUTES, getRouteSEO } = await import('../src/data/seoConfig.js');

  console.log(`📄 Found ${PUBLIC_ROUTES.length} public routes to prerender.\n`);

  const results = [];

  for (const route of PUBLIC_ROUTES) {
    const seo = getRouteSEO(route);
    const { html: renderedBody } = render(route);

    let pageHtml = rawTemplate;

    // 1. Title
    pageHtml = setTitle(pageHtml, seo.title);

    // 2. Canonical
    pageHtml = setCanonical(pageHtml, seo.canonical);

    // 3. Meta description
    pageHtml = setMeta(pageHtml, 'name', 'description', seo.description);

    // 4. Meta keywords
    if (seo.keywords) {
      pageHtml = setMeta(pageHtml, 'name', 'keywords', seo.keywords);
    }

    // 5. Robots directive
    pageHtml = setMeta(
      pageHtml,
      'name',
      'robots',
      seo.robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );

    // 6. Open Graph
    pageHtml = setMeta(pageHtml, 'property', 'og:site_name', 'Cybreva');
    pageHtml = setMeta(pageHtml, 'property', 'og:type', seo.ogType || 'website');
    pageHtml = setMeta(pageHtml, 'property', 'og:title', seo.title);
    pageHtml = setMeta(pageHtml, 'property', 'og:description', seo.description);
    pageHtml = setMeta(pageHtml, 'property', 'og:url', seo.canonical);
    pageHtml = setMeta(pageHtml, 'property', 'og:image', seo.ogImage || 'https://cybreva.vercel.app/logo.png');

    // 7. Twitter Card
    pageHtml = setMeta(pageHtml, 'name', 'twitter:card', 'summary_large_image');
    pageHtml = setMeta(pageHtml, 'name', 'twitter:title', seo.title);
    pageHtml = setMeta(pageHtml, 'name', 'twitter:description', seo.description);
    pageHtml = setMeta(pageHtml, 'name', 'twitter:image', seo.ogImage || 'https://cybreva.vercel.app/logo.png');

    // 8. JSON-LD Structured Data
    if (seo.schema) {
      pageHtml = setJsonLd(pageHtml, seo.schema);
    }

    // 9. Page body into #root
    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${renderedBody}</div>`);

    // 10. Write files
    if (route === '/') {
      fs.writeFileSync(templatePath, pageHtml, 'utf8');
      results.push({ route, file: 'dist/index.html', length: pageHtml.length });
    } else {
      const cleanPath = route.replace(/^\/+/, '').replace(/\/+$/, '');
      const routeDir = path.resolve(distDir, cleanPath);
      fs.mkdirSync(routeDir, { recursive: true });

      // Write directory index.html
      const indexPath = path.resolve(routeDir, 'index.html');
      fs.writeFileSync(indexPath, pageHtml, 'utf8');

      // Also write clean path file (e.g. dist/features.html) for maximum static server compatibility
      const cleanFilePath = path.resolve(distDir, `${cleanPath}.html`);
      const cleanFileDir = path.dirname(cleanFilePath);
      if (!fs.existsSync(cleanFileDir)) {
        fs.mkdirSync(cleanFileDir, { recursive: true });
      }
      fs.writeFileSync(cleanFilePath, pageHtml, 'utf8');

      results.push({
        route,
        file: `dist/${cleanPath}/index.html & .html`,
        length: pageHtml.length,
      });
    }

    console.log(`  ✅ [${route}] -> Title: "${seo.title.slice(0, 45)}..." (${renderedBody.length} chars rendered)`);
  }

  // Clean up server build folder after prerendering
  const serverDir = path.resolve(distDir, 'server');
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
    console.log('\n🧹 Cleaned up temporary SSR build directory (dist/server).');
  }

  console.log(`\n🎉 Prerendering complete! Successfully generated ${results.length} static HTML pages.\n`);
}

prerender().catch((err) => {
  console.error('❌ Prerendering failed:', err);
  process.exit(1);
});
