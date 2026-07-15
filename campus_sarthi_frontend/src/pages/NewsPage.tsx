import { useEffect, useState } from 'react';
import { ExternalLink, Newspaper, Calendar, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { newsApi } from '../services/newsApi';
import type { NewsArticle } from '../types/news';

const ACCENT = '#22D3EE';

const TAGS = [
  { label: 'All',        value: 'All' },
  { label: 'Tech',       value: 'Tech' },
  { label: 'Placements', value: 'Placements' },
  { label: 'Industry',   value: 'Industry' },
  { label: 'Campus',     value: 'Campus' },
];

const tagStyle: Record<string, { bg: string; color: string }> = {
  Tech:       { bg: 'rgba(99,102,241,0.14)', color: '#818CF8' },
  Placements: { bg: 'rgba(16,185,129,0.14)', color: '#6EE7B7' },
  Industry:   { bg: 'rgba(245,158,11,0.14)', color: '#FCD34D' },
  Campus:     { bg: 'rgba(34,211,238,0.14)', color: '#67E8F9' },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');

  const fetchNews = (tag: string) => {
    setIsLoading(true);
    newsApi.getAll(tag !== 'All' ? tag : undefined)
      .then((res) => setNews(res.data))
      .catch(() => setNews([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchNews(activeTag); }, [activeTag]);

  const handleTagChange = (tag: string) => {
    if (tag === activeTag) return;
    setActiveTag(tag);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
        className="rounded-2xl p-5 mb-7"
        style={{ background: 'linear-gradient(135deg,rgba(34,211,238,0.1) 0%,rgba(34,211,238,0.03) 100%)', border: '1px solid rgba(34,211,238,0.18)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${ACCENT}20` }}>
              <Newspaper size={15} style={{ color: ACCENT }} />
            </div>
            <h1 className="text-lg font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>News &amp; Updates</h1>
          </div>
          <button onClick={() => fetchNews(activeTag)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: ACCENT, background: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}>
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
        <p className="text-xs mt-1" style={{ color: '#64748B' }}>
          Stay informed about placements, tech trends and campus events.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-7 overflow-x-auto" style={{ borderBottom: '1px solid #1E2A45' }}>
        {TAGS.map(t => (
          <button key={t.value} onClick={() => handleTagChange(t.value)}
            className="px-4 py-2.5 text-sm font-medium relative whitespace-nowrap flex-shrink-0 transition-colors duration-200"
            style={{ color: activeTag === t.value ? ACCENT : '#475569' }}>
            {t.label}
            {activeTag === t.value && (
              <motion.div layoutId="news-underline" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                style={{ background: ACCENT }} />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-3 animate-pulse" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
              <div className="h-3 rounded w-1/4" style={{ background: '#1E2A45' }} />
              <div className="h-4 rounded w-3/4" style={{ background: '#1E2A45' }} />
              <div className="h-3 rounded w-full" style={{ background: '#1A2236' }} />
              <div className="h-3 rounded w-2/3" style={{ background: '#1A2236' }} />
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
          {news.map((article) => {
            const ts = tagStyle[article.tag] || { bg: 'rgba(100,116,139,0.12)', color: '#94A3B8' };
            const articleUrl = article.url || '#';
            return (
              <motion.article key={article.id} variants={fadeUp} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
                className="rounded-2xl p-6" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${ACCENT}30`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2A45')}>
                {/* Meta row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.color }}>
                      {article.tag}
                    </span>
                    {article.source && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid #1E2A45' }}>
                        {article.source}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] flex items-center gap-1 whitespace-nowrap flex-shrink-0" style={{ color: '#334155' }}>
                    <Calendar size={11} />
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Recently'}
                  </span>
                </div>

                {/* Headline — always tied to article.title */}
                <h3 className="font-bold text-white text-sm mb-2 leading-snug">{article.title}</h3>

                {/* Description — always article.description */}
                <p className="text-xs leading-relaxed line-clamp-3 mb-4" style={{ color: '#64748B' }}>
                  {article.description}
                </p>

                {/* Read link — always article.url */}
                {articleUrl && articleUrl !== '#' ? (
                  <a href={articleUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity"
                    style={{ color: ACCENT }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.75')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                    Read Full Article <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#334155' }}>
                    No link available
                  </span>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="rounded-2xl p-12 text-center" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}20` }}>
            <Newspaper size={24} style={{ color: ACCENT }} />
          </div>
          <h3 className="font-bold text-white mb-2">No articles found</h3>
          <p className="text-sm" style={{ color: '#475569' }}>
            No news available for this category right now. Try a different filter or check back later.
          </p>
          <button onClick={() => setActiveTag('All')} className="mt-4 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            style={{ background: `${ACCENT}12`, color: ACCENT, border: `1px solid ${ACCENT}25` }}>
            Show All Articles
          </button>
        </motion.div>
      )}
    </div>
  );
}
