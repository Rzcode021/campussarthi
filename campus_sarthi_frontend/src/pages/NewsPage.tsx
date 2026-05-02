import React, { useEffect, useState } from 'react';
import { ExternalLink, Newspaper, Calendar } from 'lucide-react';
import { newsApi } from '../services/newsApi';
import type { NewsArticle } from '../types/news';
import EmptyState from '../components/EmptyState';

const TAGS = ['All', 'Tech', 'Placements', 'Industry', 'Campus'];

const tagColors: Record<string, string> = {
  Tech: 'bg-primary-light text-primary',
  Placements: 'bg-green-50 text-success',
  Industry: 'bg-yellow-50 text-warning',
  Campus: 'bg-blue-50 text-info',
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    newsApi.getAll(activeTag !== 'All' ? activeTag : undefined)
      .then((res) => setNews(res.data))
      .catch(() => setNews([]))
      .finally(() => setIsLoading(false));
  }, [activeTag]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">News & Updates</h1>
        <p className="text-sm text-muted mt-0.5">Stay informed about placements, tech trends, and campus events</p>
      </div>

      <div className="flex gap-1 border-b border-border mb-8">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTag(t)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTag === t ? 'text-primary' : 'text-muted hover:text-body'
            }`}
          >
            {t}
            {activeTag === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-3">
              <div className="h-3 bg-border rounded w-1/4" />
              <div className="h-4 bg-border rounded w-3/4" />
              <div className="h-3 bg-border rounded w-full" />
              <div className="h-3 bg-border rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="space-y-5">
          {news.map((article) => (
            <div key={article.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${tagColors[article.tag] || 'bg-surface text-muted'}`}>
                    {article.tag}
                  </span>
                  {article.source && (
                    <span className="text-xs text-muted bg-surface border border-border px-2 py-0.5 rounded">
                      {article.source}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                  <Calendar size={12} />
                  {new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h3 className="font-semibold text-heading text-base mb-2">{article.title}</h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-4">{article.description}</p>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                >
                  Read Full Article <ExternalLink size={13} />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Newspaper size={48} />} title="No news available" subtitle="There are no articles for this category right now." />
      )}
    </div>
  );
}
