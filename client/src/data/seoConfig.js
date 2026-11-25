// src/data/seoConfig.js
import { BLOG_POSTS } from './blogPosts.js';

export const BASE_URL = 'https://cybreva.vercel.app';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.png`;

export const PUBLIC_ROUTES = [
  '/',
  '/features',
  '/about',
  '/pricing',
  '/contact',
  '/scanners/message',
  '/scanners/email',
  '/scanners/website',
  '/ai-assistant',
  '/blog',
  '/blog/how-to-identify-a-scam-website',
  '/blog/how-to-recognize-phishing-emails',
  '/blog/common-online-payment-scams',
  '/blog/how-to-identify-fake-messages',
  '/blog/what-is-website-risk-analysis',
  '/blog/how-to-stay-safe-from-otp-scams',
  '/blog/ai-scam-detection-benefits-and-limitations',
  '/blog/how-to-verify-a-suspicious-link',
  '/privacy',
  '/terms',
];

export const STATIC_ROUTE_SEO = {
  '/': {
    title: 'Cybreva — AI-Powered Online Safety & Scam Detection',
    description: 'Verify suspicious text messages, emails, and website links before you trust. Real-time scam detection powered by AI and global threat intelligence.',
    canonical: `${BASE_URL}/`,
    keywords: 'scam checker, phishing detector, safe browsing, url safety check, sms scam detection, ai security, online threat intelligence',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/features': {
    title: 'Cybreva Security Features — Message, Email & Website Scanners',
    description: "Explore Cybreva's suite of AI and threat intelligence tools: Message Scam Checker, Email Phishing Analyzer, Website Safety Checker, and AI Security Assistant.",
    canonical: `${BASE_URL}/features`,
    keywords: 'scam detection tools, website safety checker, phishing email analyzer, message scam detection, ai security assistant',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/about': {
    title: 'About Cybreva — AI Online Safety & Threat Intelligence',
    description: 'Learn about Cybreva mission to protect internet users from scams, phishing, and online fraud through transparent AI analysis and global threat feeds.',
    canonical: `${BASE_URL}/about`,
    keywords: 'about cybreva, online safety company, cyber scam prevention, ai threat intelligence, safe browsing organization',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/pricing': {
    title: 'Cybreva Pricing — Transparent & Free Online Safety Plans',
    description: 'Explore Cybreva pricing. Start free with full message, email, and website scam detection tools. No credit card required, no artificial hidden fees.',
    canonical: `${BASE_URL}/pricing`,
    keywords: 'cybreva pricing, free scam checker, free phishing scanner, safe browsing tools pricing, free cybersecurity tools',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/contact': {
    title: 'Contact Cybreva — Support, Security Feedback & Threat Reporting',
    description: 'Connect with the Cybreva security and research team. Report suspected scam campaigns, request support, or inquire about threat intelligence integrations.',
    canonical: `${BASE_URL}/contact`,
    keywords: 'contact cybreva, report scam website, cybersecurity support, threat intelligence inquiries',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/scanners/message': {
    title: 'AI Message Scam Checker | Free SMS & Smishing Detector — Cybreva',
    description: 'Scan SMS, WhatsApp, and chat messages for smishing, fake bank alerts, impersonation, and fraudulent links with Cybreva real-time AI security scanner.',
    canonical: `${BASE_URL}/scanners/message`,
    keywords: 'message scam checker, smishing detector, fake sms detector, whatsapp scam checker, text message fraud, ai scam detection',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/scanners/email': {
    title: 'Phishing Email Checker | AI Email Scam Detector — Cybreva',
    description: 'Detect phishing emails, spoofed sender domains, malicious attachments, and credential harvesting schemes with Cybreva AI-powered email threat analyzer.',
    canonical: `${BASE_URL}/scanners/email`,
    keywords: 'phishing email checker, email scam detector, spoofed email analyzer, credential harvesting, business email compromise, ai email security',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/scanners/website': {
    title: 'Website Safety Checker | Malicious URL & Scam Scanner — Cybreva',
    description: 'Verify website safety and detect malware, typosquatting, fraudulent e-commerce stores, and phishing domains with real-time Google Web Risk and AI scanning.',
    canonical: `${BASE_URL}/scanners/website`,
    keywords: 'website safety checker, check url safety, scam website scanner, phishing link detector, malware website check, safe browsing scanner',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/ai-assistant': {
    title: 'AI Security Assistant | Interactive Cyber Threat Advice — Cybreva',
    description: 'Ask Cybreva AI anything about online scams, suspicious files, credential safety, and incident recovery with real-time security guidance and best practices.',
    canonical: `${BASE_URL}/ai-assistant`,
    keywords: 'ai security assistant, cyber threat advisor, online scam questions, incident recovery ai, cybersecurity consultation, fraud detection assistant',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/blog': {
    title: 'Cybreva Blog — Scam Prevention, Phishing Defense & Web Safety Insights',
    description: 'Explore research-backed educational guides on spotting scam websites, identifying smishing, preventing payment fraud, and navigating online threats safely.',
    canonical: `${BASE_URL}/blog`,
    keywords: 'scam prevention blog, phishing defense guides, online safety tips, cybersecurity education, cybreva research',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/privacy': {
    title: 'Privacy Policy — Cybreva Data Handling & Protection',
    description: 'Read Cybreva privacy policy: transparent data practices, TLS encryption, HTTP-only authentication, and our strict zero-data-selling guarantee.',
    canonical: `${BASE_URL}/privacy`,
    keywords: 'cybreva privacy policy, data protection, secure scam scanning, user privacy cybersecurity',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  '/terms': {
    title: 'Terms of Service — Cybreva Online Safety Platform',
    description: 'Review Cybreva terms of service: acceptable use policies, disclaimer of warranties, non-guarantee notices, and user responsibilities.',
    canonical: `${BASE_URL}/terms`,
    keywords: 'cybreva terms of service, user agreement, acceptable use policy, security disclaimer',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
};

/**
 * Returns complete SEO metadata for any route path (static or dynamic).
 */
export function getRouteSEO(pathname) {
  // Normalize trailing slash (except root)
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  // 1. Check direct match in static routes
  if (STATIC_ROUTE_SEO[cleanPath]) {
    return STATIC_ROUTE_SEO[cleanPath];
  }

  // 2. Check blog post route
  if (cleanPath.startsWith('/blog/')) {
    const slug = cleanPath.replace('/blog/', '');
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (post) {
      const title = post.seoTitle || `${post.title} | Cybreva`;
      return {
        title,
        description: post.description,
        canonical: `${BASE_URL}/blog/${post.slug}`,
        keywords: post.keywords,
        ogType: 'article',
        ogImage: DEFAULT_OG_IMAGE,
        robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          url: `${BASE_URL}/blog/${post.slug}`,
          datePublished: post.publishedDate,
          dateModified: post.modifiedDate,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/blog/${post.slug}`,
          },
          author: {
            '@type': 'Person',
            name: post.author?.name || 'Alexander Reed',
            jobTitle: post.author?.role || 'Security Research Lead',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Cybreva',
            url: BASE_URL,
            logo: {
              '@type': 'ImageObject',
              url: DEFAULT_OG_IMAGE,
            },
          },
          keywords: post.keywords,
        },
      };
    }
  }

  // 3. Fallback for unlisted / private routes
  return {
    title: 'Cybreva — Check Before You Trust | AI Scam & Threat Detection',
    description: 'Check Before You Trust. Cybreva uses AI and real-time threat intelligence to protect you against scam messages, phishing emails, and malicious websites.',
    canonical: `${BASE_URL}${cleanPath}`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: 'noindex, nofollow',
  };
}
