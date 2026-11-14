// src/pages/public/BlogListingPage.jsx
import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../../data/blogPosts';
import { FiClock, FiUser, FiCalendar, FiSearch, FiArrowRight, FiBookOpen } from 'react-icons/fi';

export default function BlogListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === 'all' || post.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const featuredPost = BLOG_POSTS[0];

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Cybreva Security & Anti-Fraud Blog',
    description: 'Expert research, actionable guides, and educational insights on scam prevention, phishing defense, and online threat intelligence.',
    url: 'https://cybreva.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Cybreva',
      url: 'https://cybreva.com',
      logo: 'https://cybreva.com/logo.png',
    },
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `https://cybreva.com/blog/${post.slug}`,
      datePublished: post.publishedDate,
      dateModified: post.modifiedDate,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
    })),
  };

  return (
    <MainLayout>
      <SEO
        title="Cybreva Blog — Scam Prevention, Phishing Defense & Web Safety Insights"
        description="Explore research-backed educational guides on spotting scam websites, identifying smishing, preventing payment fraud, and navigating online threats safely."
        canonical="https://cybreva.com/blog"
        keywords="scam prevention blog, phishing defense guides, online safety tips, cybersecurity education, cybreva research"
        schema={blogSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumbs items={[{ label: 'Security Blog', to: '/blog' }]} />

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <FiBookOpen size={13} />
            Security Research & Educational Library
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Knowledge for a Safer Internet
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Practical, evidence-based guides written by threat analysts to help you recognize modern scams, defend your personal data, and check before you trust.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-2 rounded-2xl p-4 sm:p-5 mb-12 border border-white/10 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search articles by topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
              {BLOG_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'all') {
                        searchParams.delete('category');
                      } else {
                        searchParams.set('category', cat.id);
                      }
                      setSearchParams(searchParams);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(6,182,212,0.2) 100%)',
                            border: '1px solid rgba(16,185,129,0.35)',
                          }
                        : { border: '1px solid rgba(255,255,255,0.06)' }
                    }
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Article (when in 'all' and no search) */}
        {activeCategory === 'all' && !searchQuery.trim() && featuredPost && (
          <div className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-1.5">
              <span>★</span> Featured Guide
            </h2>
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group glass-2 rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl block"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="capitalize px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    {featuredPost.category.replace('-', ' ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={12} /> {featuredPost.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} /> {featuredPost.publishedDate}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                  <FiUser className="text-cyan-400" size={13} />
                  <span>By <strong className="text-slate-200">{featuredPost.author.name}</strong> • {featuredPost.author.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm group-hover:translate-x-1 transition-transform self-end lg:self-center">
                <span>Read Full Guide</span>
                <FiArrowRight size={16} />
              </div>
            </Link>
          </div>
        )}

        {/* Article Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {activeCategory === 'all' ? 'All Published Guides' : `${BLOG_CATEGORIES.find(c => c.id === activeCategory)?.name || 'Articles'}`}
            </h2>
            <span className="text-xs text-slate-500">
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-slate-400">
              <p className="text-base font-medium text-white mb-2">No articles found</p>
              <p className="text-xs max-w-sm mx-auto mb-4">
                We couldn't find any articles matching your search query or selected filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="glass-2 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group shadow-md hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="capitalize px-2.5 py-0.5 rounded-full bg-white/5 text-cyan-400 font-medium border border-white/10">
                        {post.category.replace('-', ' ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={11} /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[150px]">{post.author.name}</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium group-hover:underline">
                      Read <FiArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
