// src/pages/public/BlogPostPage.jsx
import { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import MarkdownRenderer from '../../components/ai/MarkdownRenderer';
import { BLOG_POSTS } from '../../data/blogPosts';
import {
  FiClock,
  FiCalendar,
  FiUser,
  FiShare2,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiShield,
  FiList,
  FiExternalLink,
} from 'react-icons/fi';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);

  const post = useMemo(() => {
    return BLOG_POSTS.find((p) => p.slug === slug);
  }, [slug]);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  // Related articles in same category or adjacent
  const relatedPosts = useMemo(() => {
    return BLOG_POSTS.filter((p) => p.slug !== post.slug)
      .slice(0, 3);
  }, [post.slug]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User dismissed
    }
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `https://cybreva.com/blog/${post.slug}`,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://cybreva.com/blog/${post.slug}`,
    },
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cybreva',
      url: 'https://cybreva.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cybreva.com/logo.png',
      },
    },
    keywords: post.keywords,
  };

  const breadcrumbItems = [
    { label: 'Blog', to: '/blog' },
    { label: post.category.replace('-', ' '), to: `/blog?category=${post.category}` },
    { label: post.title },
  ];

  return (
    <MainLayout>
      <SEO
        title={post.seoTitle}
        description={post.description}
        canonical={`https://cybreva.com/blog/${post.slug}`}
        keywords={post.keywords}
        ogType="article"
        publishedTime={post.publishedDate}
        modifiedTime={post.modifiedDate}
        author={post.author.name}
        schema={articleSchema}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Article Header */}
        <header className="mb-12 border-b border-white/10 pb-10">
          <div className="flex items-center gap-3 text-xs mb-4">
            <Link
              to={`/blog?category=${post.category}`}
              className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors uppercase tracking-wider text-[11px]"
            >
              {post.category.replace('-', ' ')}
            </Link>
            <span className="flex items-center gap-1 text-slate-400">
              <FiClock size={12} /> {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <FiCalendar size={12} /> Published: {post.publishedDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-6">
            {post.excerpt}
          </p>

          {/* Author & Share Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{post.author.name}</p>
                <p className="text-slate-400 text-xs">{post.author.role}</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Share article"
            >
              {copied ? (
                <>
                  <FiCheck className="text-emerald-400" size={14} />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <FiShare2 size={14} />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content Layout with Sidebar TOC */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Body */}
          <div className="lg:col-span-3 space-y-6">
            {/* Table of Contents for Mobile */}
            {post.tableOfContents && post.tableOfContents.length > 0 && (
              <div className="lg:hidden glass-2 rounded-2xl p-5 mb-8 border border-white/10">
                <div className="flex items-center gap-2 font-semibold text-white text-sm mb-3">
                  <FiList className="text-emerald-400" />
                  <span>Table of Contents</span>
                </div>
                <ul className="space-y-2 text-xs">
                  {post.tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-slate-400 hover:text-emerald-400 transition-colors block py-0.5"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Markdown Article Body */}
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Security Verification Callout Card */}
            <div
              className="my-10 p-6 rounded-2xl border border-emerald-500/30 shadow-xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)',
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0">
                  <FiShield className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1.5">
                    Suspect you are looking at a scam right now?
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Never interact, click, or send money blindly. Run the suspicious text, email sender, or website URL through Cybreva's free real-time scanners before you decide.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <Link
                      to="/scanners/website"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                    >
                      Scan a Website <FiExternalLink size={11} />
                    </Link>
                    <Link
                      to="/scanners/message"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 transition-colors"
                    >
                      Check a Message
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial and E-E-A-T Disclaimer */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-slate-400 space-y-1.5">
              <p>
                <strong className="text-slate-300">Editorial & Review Integrity: </strong>
                All Cybreva guides are authored or peer-reviewed by cybersecurity professionals. While we strive for thoroughness, attackers continuously evolve their techniques. No single guide can substitute for independent critical judgment.
              </p>
              <p className="text-[11px] text-slate-500">
                Last updated on {post.modifiedDate}. Feedback or inquiries? Contact our security editorial team at <a href="mailto:contact@cybreva.com" className="text-emerald-400 underline">contact@cybreva.com</a>.
              </p>
            </div>
          </div>

          {/* Desktop Sticky Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 glass-2 rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-white text-xs uppercase tracking-wider">
                <FiList className="text-emerald-400" />
                <span>On This Page</span>
              </div>
              {post.tableOfContents && (
                <nav>
                  <ul className="space-y-2 text-xs">
                    {post.tableOfContents.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-slate-400 hover:text-emerald-400 transition-colors block py-0.5 leading-snug"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className="pt-4 border-t border-white/10">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
                >
                  <FiArrowLeft size={12} />
                  <span>Back to all guides</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles Footer */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Related Security Articles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.slug}
                to={`/blog/${rel.slug}`}
                className="glass-2 rounded-2xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider">
                    {rel.category.replace('-', ' ')}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <span>{rel.readTime}</span>
                  <span className="text-emerald-400 flex items-center gap-1 group-hover:underline">
                    Read <FiArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
