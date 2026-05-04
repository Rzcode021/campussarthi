import React, { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, FileText, Library, Newspaper, Shirt,
  Star, ChevronRight, Download, ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companiesApi } from '../services/companiesApi';
import { studyMaterialsApi } from '../services/studyMaterialsApi';
import type { Company } from '../types/company';
import type { StudyMaterial } from '../types/studyMaterial';

/* ── Animation helper ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

/* ── Domain badge config ── */
const domainStyle: Record<string, { bg: string; color: string }> = {
  CS:      { bg: 'rgba(99,102,241,0.12)', color: '#818CF8' },
  Cyber:   { bg: 'rgba(239,68,68,0.12)',  color: '#FCA5A5' },
  Product: { bg: 'rgba(16,185,129,0.12)', color: '#6EE7B7' },
  Sales:   { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D' },
};

const fileTypeBadge: Record<string, { bg: string; color: string }> = {
  PDF:  { bg: 'rgba(239,68,68,0.12)',  color: '#FCA5A5' },
  DOC:  { bg: 'rgba(59,130,246,0.12)', color: '#93C5FD' },
  DOCX: { bg: 'rgba(59,130,246,0.12)', color: '#93C5FD' },
  PPT:  { bg: 'rgba(249,115,22,0.12)', color: '#FDB57C' },
  PPTX: { bg: 'rgba(249,115,22,0.12)', color: '#FDB57C' },
};

/* ── Stat Card ── */
const StatCard = memo(({
  label, value, icon, accent, delay,
}: {
  label: string; value: string; icon: React.ReactNode; accent: string; delay: number;
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={delay}
    whileHover={{ y: -3, scale: 1.01 }}
    transition={{ duration: 0.18 }}
    className="rounded-2xl p-5"
    style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
      style={{ background: accent + '18', border: `1px solid ${accent}30` }}
    >
      {icon}
    </div>
    <div className="text-2xl font-extrabold text-heading mb-0.5">{value}</div>
    <div className="text-xs font-medium" style={{ color: '#475569' }}>{label}</div>
  </motion.div>
));

/* ── Skeleton ── */
const Skeleton = memo(() => (
  <div className="flex items-center gap-4 px-5 py-4">
    <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ background: '#1E2A45' }} />
    <div className="flex-1 space-y-2">
      <div className="h-3 rounded w-1/3" style={{ background: '#1E2A45' }} />
      <div className="h-2 rounded w-1/4" style={{ background: '#1A2236' }} />
    </div>
  </div>
));

/* ── MAIN PAGE ── */
export default function DashboardPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([companiesApi.getAll(), studyMaterialsApi.getAll()])
      .then(([cRes, mRes]) => {
        setCompanies(cRes.data.slice(0, 4));
        setMaterials(mRes.data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const stats = [
    { label: 'Companies', value: '11', icon: <Building2 size={18} color="#818CF8" />, accent: '#6366F1', delay: 0.05 },
    { label: 'Study Materials', value: isLoading ? '—' : String(materials.length || '0'), icon: <FileText size={18} color="#6EE7B7" />, accent: '#10B981', delay: 0.1 },
    { label: 'Resources', value: '17', icon: <Library size={18} color="#FCD34D" />, accent: '#F59E0B', delay: 0.15 },
    { label: 'News Articles', value: '10', icon: <Newspaper size={18} color="#93C5FD" />, accent: '#3B82F6', delay: 0.2 },
  ];

  const quickLinks = [
    { label: 'Prep Resources', path: '/resources', icon: <Library size={15} />, desc: '17 curated resources', accent: '#F59E0B' },
    { label: 'Study Materials', path: '/study-materials', icon: <FileText size={15} />, desc: 'Downloadable PDFs & notes', accent: '#10B981' },
    { label: 'Attire Guide', path: '/attire', icon: <Shirt size={15} />, desc: 'Dress for success', accent: '#A855F7' },
    { label: 'Latest News', path: '/news', icon: <Newspaper size={15} />, desc: 'Campus placement updates', accent: '#3B82F6' },
    { label: 'Crew Rating', path: '/crew-rating', icon: <Star size={15} />, desc: 'Rate your coordinators', accent: '#F59E0B' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      {/* Greeting */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
        <h1 className="text-2xl font-extrabold text-heading">
          Good morning, <span style={{ color: '#818CF8' }}>{firstName}</span> 👋
        </h1>
        <p className="text-xs mt-1 font-medium" style={{ color: '#334155' }}>{today}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Companies */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={0.25}
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
        >
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1E2A45' }}>
            <h2 className="font-bold text-sm text-heading">Recently Added Companies</h2>
            <Link to="/companies" className="btn-ghost text-xs py-1 px-2">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
              : companies.map((c) => {
                  const ds = domainStyle[c.domain] || domainStyle.CS;
                  return (
                    <Link
                      key={c.id}
                      to={`/companies/${c.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 group"
                      style={{ borderBottom: '1px solid #1A2236' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: ds.bg, color: ds.color }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-heading truncate">{c.name}</p>
                        <p className="text-xs truncate" style={{ color: '#475569' }}>{c.job_role}</p>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: ds.bg, color: ds.color }}
                      >
                        {c.domain}
                      </span>
                      <ChevronRight size={14} style={{ color: '#334155' }} className="flex-shrink-0 group-hover:text-primary-dim transition-colors" />
                    </Link>
                  );
                })}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={0.3}
          className="rounded-2xl overflow-hidden"
          style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #1E2A45' }}>
            <h2 className="font-bold text-sm text-heading">Quick Access</h2>
          </div>
          <div>
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 group"
                style={{ borderBottom: '1px solid #1A2236' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: link.accent + '18', color: link.accent }}
                >
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-heading truncate">{link.label}</p>
                  <p className="text-[11px]" style={{ color: '#475569' }}>{link.desc}</p>
                </div>
                <ChevronRight size={13} style={{ color: '#334155' }} />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Study Materials Preview */}
      {materials.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.4}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-heading">Study Materials</h2>
            <Link to="/study-materials" className="btn-ghost text-xs py-1 px-2">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {materials.map((m) => {
              const ft = fileTypeBadge[m.file_type] || { bg: 'rgba(100,116,139,0.12)', color: '#94A3B8' };
              return (
                <motion.div
                  key={m.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-2xl p-5"
                  style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-lg"
                      style={{ background: ft.bg, color: ft.color }}
                    >
                      {m.file_type || 'FILE'}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(99,102,241,0.1)', color: '#818CF8' }}
                    >
                      {m.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-heading mb-1 line-clamp-2">{m.title}</h3>
                  <p className="text-xs mb-4 line-clamp-2" style={{ color: '#475569' }}>{m.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs flex items-center gap-1" style={{ color: '#475569' }}>
                      <Download size={11} /> {m.download_count} downloads
                    </span>
                    <Link to="/study-materials" className="btn-ghost text-xs py-0.5 px-2">View</Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
