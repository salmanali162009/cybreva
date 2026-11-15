// src/components/common/SEO.jsx
import { useEffect } from 'react';

/**
 * Lightweight, zero-dependency Head & Meta management component.
 * Sets document title, canonical link, meta tags, and JSON-LD structured schemas.
 */
export default function SEO({
  title,
  description,
  canonical,
  keywords,
  ogType = 'website',
  ogImage = 'https://cybreva.vercel.app/logo.png',
  schema,
  noindex = false,
  publishedTime,
  modifiedTime,
  author = 'Cybreva Security Team',
}) {
  useEffect(() => {
    // 1. Title
    const formattedTitle = title
      ? title.includes('Cybreva')
        ? title
        : `${title} | Cybreva`
      : 'Cybreva — Check Before You Trust | AI Scam & Threat Detection';
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attribute, value, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description || 'Cybreva is an AI-powered scam detection and threat intelligence platform. Verify messages, emails, and websites before you click or trust.');
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'author', author);

    // Robots meta directive
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // 3. Canonical Link
    const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://cybreva.vercel.app');
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Open Graph Meta Tags
    setMetaTag('property', 'og:site_name', 'Cybreva');
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:alt', 'Cybreva Logo - AI Scam Detection Platform');

    if (publishedTime) {
      setMetaTag('property', 'article:published_time', publishedTime);
    }
    if (modifiedTime) {
      setMetaTag('property', 'article:modified_time', modifiedTime);
    }

    // 5. Twitter / X Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data Script
    const existingScript = document.getElementById('cybreva-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'cybreva-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const scriptClean = document.getElementById('cybreva-jsonld');
      if (scriptClean) {
        scriptClean.remove();
      }
    };
  }, [
    title,
    description,
    canonical,
    keywords,
    ogType,
    ogImage,
    schema,
    noindex,
    publishedTime,
    modifiedTime,
    author,
  ]);

  return null;
}
