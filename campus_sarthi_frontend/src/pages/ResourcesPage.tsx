import React, { useEffect, useState } from 'react';
import { ExternalLink, Library } from 'lucide-react';
import { resourcesApi } from '../services/resourcesApi';
import type { Resource } from '../types/resource';
import EmptyState from '../components/EmptyState';

type Category = 'DSA' | 'Python' | 'Interview Prep' | 'Aptitude';
const TABS: Category[] = ['DSA', 'Python', 'Interview Prep', 'Aptitude'];

const diffColors: Record<string, string> = {
  Beginner: 'badge-approved',
  Intermediate: 'badge-pending',
  Advanced: 'badge-rejected',
};

export default function ResourcesPage() {
  const [grouped, setGrouped] = useState<Record<string, Resource[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category>('DSA');

  useEffect(() => {
    resourcesApi.getAll()
      .then((res) => setGrouped(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const resources = grouped[activeTab] || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Preparation Resources</h1>
        <p className="text-sm text-muted mt-0.5">Curated materials to help you crack interviews</p>
      </div>

      <div className="flex gap-1 border-b border-border mb-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === t ? 'text-primary' : 'text-muted hover:text-body'
            }`}
          >
            {t}
            {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-3">
              <div className="h-4 bg-border rounded w-3/4" />
              <div className="h-3 bg-border rounded w-full" />
              <div className="h-3 bg-border rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r) => (
            <div key={r.id} className="card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${diffColors[r.difficulty]}`}>
                  {r.difficulty}
                </span>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
                  <ExternalLink size={14} />
                </a>
              </div>
              <h3 className="font-semibold text-heading text-sm mb-2">{r.title}</h3>
              <p className="text-xs text-muted leading-relaxed flex-1 line-clamp-3 mb-4">{r.description}</p>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 flex items-center justify-center gap-1.5 border border-border hover:border-primary rounded-lg"
              >
                Open Resource <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Library size={48} />} title="No resources available" subtitle="Resources for this category will be added soon." />
      )}
    </div>
  );
}
