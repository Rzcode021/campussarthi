import { useEffect, useState } from 'react';
import { ExternalLink, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import { resourcesApi } from '../services/resourcesApi';
import type { Resource } from '../types/resource';
import EmptyState from '../components/EmptyState';

const ACCENT = '#A855F7'; // Purple
type Category = 'DSA' | 'Python' | 'Interview Prep' | 'Aptitude';
const TABS: Category[] = ['DSA', 'Python', 'Interview Prep', 'Aptitude'];

const diffStyle: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: 'rgba(16,185,129,0.12)', color: '#6EE7B7' },
  Intermediate: { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D' },
  Advanced:     { bg: 'rgba(239,68,68,0.12)',  color: '#FCA5A5' },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
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
      {/* Page header strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
        className="rounded-2xl p-5 mb-7"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.04) 100%)',
          border: '1px solid rgba(168,85,247,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${ACCENT}20` }}>
            <Library size={15} style={{ color: ACCENT }} />
          </div>
          <h1 className="text-lg font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>Preparation Resources</h1>
        </div>
        <p className="text-xs" style={{ color: '#64748B' }}>Curated materials to help you crack interviews</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-7" style={{ borderBottom: '1px solid #1E2A45' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="px-4 py-2.5 text-sm font-medium relative whitespace-nowrap transition-colors duration-200"
            style={{ color: activeTab === t ? ACCENT : '#475569' }}
          >
            {t}
            {activeTab === t && (
              <motion.div layoutId="resources-tab" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: ACCENT }} />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-3" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
              <div className="h-4 rounded w-3/4" style={{ background: '#1E2A45' }} />
              <div className="h-3 rounded w-full" style={{ background: '#1A2236' }} />
              <div className="h-3 rounded w-5/6" style={{ background: '#1A2236' }} />
            </div>
          ))}
        </div>
      ) : resources.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r) => {
            const ds = diffStyle[r.difficulty] || { bg: 'rgba(100,116,139,0.12)', color: '#94A3B8' };
            return (
              <motion.div
                key={r.id}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl p-6 flex flex-col"
                style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${ACCENT}33`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E2A45')}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: ds.bg, color: ds.color }}>
                    {r.difficulty}
                  </span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#475569' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = ACCENT)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#475569')}>
                    <ExternalLink size={14} />
                  </a>
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{r.title}</h3>
                <p className="text-xs leading-relaxed flex-1 line-clamp-3 mb-4" style={{ color: '#475569' }}>{r.description}</p>
                <a
                  href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{ background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}25` }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = `${ACCENT}25`)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = `${ACCENT}15`)}
                >
                  Open Resource <ExternalLink size={11} />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <EmptyState icon={<Library size={40} />} title="No resources available" subtitle="Resources for this category will be added soon." />
      )}
    </div>
  );
}
