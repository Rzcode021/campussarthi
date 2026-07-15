import { useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import CompanyCard from '../components/CompanyCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const ACCENT = '#3B82F6'; // Blue
const DOMAINS = ['All', 'CS', 'Cyber', 'Product', 'Sales'];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function CompaniesPage() {
  const allCompanies = useAppStore((state) => state.companies);
  const [activeDomain, setActiveDomain] = useState('All');
  const [search, setSearch] = useState('');

  const companies = allCompanies.filter(c => {
    const matchDomain = activeDomain === 'All' || c.domain === activeDomain;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch && c.status === 'approved';
  });
  const isLoading = false;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
        className="rounded-2xl p-5 mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          background: `linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)`,
          border: `1px solid rgba(59,130,246,0.2)`,
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${ACCENT}20` }}>
              <Building2 size={15} style={{ color: ACCENT }} />
            </div>
            <h1 className="text-lg font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>Companies</h1>
          </div>
          <p className="text-xs" style={{ color: '#64748B' }}>Explore available placement opportunities</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            type="text"
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${ACCENT}55`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>
      </motion.div>

      {/* Domain Tabs */}
      <div className="flex gap-1 mb-7" style={{ borderBottom: '1px solid #1E2A45' }}>
        {DOMAINS.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDomain(d)}
            className="px-4 py-2.5 text-sm font-medium relative whitespace-nowrap transition-colors duration-200"
            style={{ color: activeDomain === d ? ACCENT : '#475569' }}
          >
            {d}
            {activeDomain === d && (
              <motion.div
                layoutId="companies-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                style={{ background: ACCENT }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : companies.length > 0 ? (
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {companies.map((c) => (
            <motion.div key={c.id} variants={fadeUp}>
              <CompanyCard company={c as any} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState icon={<Building2 size={40} />} title="No companies found" subtitle="Try adjusting your search or domain filter." />
      )}
    </div>
  );
}
