import { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, FileText, Library, Newspaper, Shirt, Star, ChevronRight, Download, ArrowUpRight, Bookmark, Calendar, Zap, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companiesApi } from '../services/companiesApi';
import { studyMaterialsApi } from '../services/studyMaterialsApi';
import type { Company } from '../types/company';
import type { StudyMaterial } from '../types/studyMaterial';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};
const domainStyle: Record<string, { bg: string; color: string }> = {
  CS: { bg: 'rgba(99,102,241,0.14)', color: '#818CF8' }, Cyber: { bg: 'rgba(239,68,68,0.14)', color: '#FCA5A5' },
  Product: { bg: 'rgba(16,185,129,0.14)', color: '#6EE7B7' }, Sales: { bg: 'rgba(245,158,11,0.14)', color: '#FCD34D' },
};
const fileTypeBadge: Record<string, { bg: string; color: string }> = {
  PDF: { bg: 'rgba(239,68,68,0.12)', color: '#FCA5A5' }, DOC: { bg: 'rgba(59,130,246,0.12)', color: '#93C5FD' },
  DOCX: { bg: 'rgba(59,130,246,0.12)', color: '#93C5FD' }, PPT: { bg: 'rgba(249,115,22,0.12)', color: '#FDB57C' },
  PPTX: { bg: 'rgba(249,115,22,0.12)', color: '#FDB57C' },
};
const Skeleton = memo(() => (
  <div className="flex items-center gap-4 px-5 py-4">
    <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ background: '#1E2A45' }} />
    <div className="flex-1 space-y-2">
      <div className="h-3 rounded w-1/3" style={{ background: '#1E2A45' }} />
      <div className="h-2 rounded w-1/4" style={{ background: '#1A2236' }} />
    </div>
  </div>
));
function getGreeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; }

export default function DashboardPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([companiesApi.getAll(), studyMaterialsApi.getAll()])
      .then(([cRes, mRes]) => { setCompanies(cRes.data.slice(0, 5) as any); setMaterials(mRes.data.slice(0, 3)); })
      .catch(() => {}).finally(() => setIsLoading(false));
  }, []);
  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const readiness = 68;
  const quickActions = [
    { label: 'Companies', path: '/companies', icon: <Building2 size={16} />, accent: '#818CF8' },
    { label: 'Materials', path: '/study-materials', icon: <FileText size={16} />, accent: '#6EE7B7' },
    { label: 'Resources', path: '/resources', icon: <Library size={16} />, accent: '#FCD34D' },
    { label: 'News', path: '/news', icon: <Newspaper size={16} />, accent: '#67E8F9' },
    { label: 'Events', path: '/events', icon: <Calendar size={16} />, accent: '#60A5FA' },
    { label: 'Bookmarks', path: '/bookmarks', icon: <Bookmark size={16} />, accent: '#F472B6' },
    { label: 'Attire', path: '/attire', icon: <Shirt size={16} />, accent: '#A78BFA' },
    { label: 'Ratings', path: '/crew-rating', icon: <Star size={16} />, accent: '#FBBF24' },
  ];
  const stats = [
    { label: 'Companies', value: String(companies.length || '—'), icon: <Building2 size={18} color="#818CF8" />, accent: '#6366F1' },
    { label: 'Study Materials', value: isLoading ? '—' : String(materials.length || 0), icon: <FileText size={18} color="#6EE7B7" />, accent: '#10B981' },
    { label: 'Resources', value: '17', icon: <Library size={18} color="#FCD34D" />, accent: '#F59E0B' },
    { label: 'News Articles', value: '10', icon: <Newspaper size={18} color="#93C5FD" />, accent: '#3B82F6' },
  ];
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
        className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg,#0F1B35 0%,#1a2847 60%,#0A1020 100%)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#334155' }}>{today}</p>
            <h1 className="text-2xl font-extrabold text-white" style={{ letterSpacing: '-0.03em' }}>
              {getGreeting()}, <span style={{ color: '#818CF8' }}>{firstName}</span> 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: '#475569' }}>{user?.branch ? `${user.branch} · ` : ''}Your placement journey continues.</p>
          </div>
          <div className="flex-shrink-0 rounded-2xl px-6 py-4 text-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#818CF8' }}>Readiness Score</p>
            <div className="text-4xl font-extrabold text-white" style={{ letterSpacing: '-0.04em' }}>{readiness}<span className="text-lg text-indigo-400">%</span></div>
            <div className="mt-2 h-1.5 rounded-full w-32 mx-auto" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: `${readiness}%`, background: 'linear-gradient(90deg,#6366F1,#818CF8)' }} />
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: '#334155' }}>Keep improving!</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="show" custom={0.05 + i * 0.05}
            whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
            className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: s.accent + '18', border: `1px solid ${s.accent}30` }}>{s.icon}</div>
            <div className="text-2xl font-extrabold text-white mb-0.5" style={{ letterSpacing: '-0.03em' }}>{s.value}</div>
            <div className="text-xs font-medium" style={{ color: '#475569' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.2}
        className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
        <div className="flex items-center gap-2 mb-4"><Zap size={14} color="#FBBF24" /><h2 className="font-bold text-sm text-white">Quick Access</h2></div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {quickActions.map(qa => (
            <Link key={qa.path} to={qa.path}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2A45' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${qa.accent}12`; (e.currentTarget as HTMLElement).style.borderColor = `${qa.accent}30`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.borderColor = '#1E2A45'; }}>
              <span style={{ color: qa.accent }}>{qa.icon}</span>
              <span className="text-[10px] font-medium text-center" style={{ color: '#64748B' }}>{qa.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Companies + Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.25}
          className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1E2A45' }}>
            <div className="flex items-center gap-2"><Building2 size={14} color="#818CF8" /><h2 className="font-bold text-sm text-white">Upcoming Companies</h2></div>
            <Link to="/companies" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#475569' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#818CF8')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#475569')}>View all <ArrowUpRight size={11} /></Link>
          </div>
          <div>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />) :
              companies.map((c, idx) => {
                const ds = domainStyle[c.domain] || domainStyle.CS;
                return (
                  <Link key={c.id} to={`/companies/${c.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150"
                    style={{ borderBottom: idx < companies.length - 1 ? '1px solid #1A2236' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: ds.bg, color: ds.color }}>{c.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate">{c.name}</p>
                      <p className="text-xs truncate" style={{ color: '#475569' }}>{c.job_role}</p>
                    </div>
                    {(c as any).salary_lpa && <span className="text-xs font-bold flex-shrink-0" style={{ color: '#6EE7B7' }}>₹{(c as any).salary_lpa} LPA</span>}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: ds.bg, color: ds.color }}>{c.domain}</span>
                    <ChevronRight size={13} style={{ color: '#334155' }} />
                  </Link>
                );
              })}
          </div>
        </motion.div>

        {/* Placement Journey */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.3}
          className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
          <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid #1E2A45' }}>
            <TrendingUp size={14} color="#6EE7B7" /><h2 className="font-bold text-sm text-white">Placement Journey</h2>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Companies Explored', value: String(companies.length || 0), icon: <Building2 size={13} />, color: '#818CF8' },
              { label: 'Resources Saved',    value: '—', icon: <Bookmark size={13} />, color: '#F472B6' },
              { label: 'Events Attended',    value: '—', icon: <Calendar size={13} />, color: '#60A5FA' },
              { label: 'Materials Viewed',   value: String(materials.length || 0), icon: <FileText size={13} />, color: '#6EE7B7' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1A2236' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px]" style={{ color: '#475569' }}>{item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1E2A45' }}>
            <div className="flex items-center gap-2 mb-2.5"><Target size={11} color="#FBBF24" /><p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Next Steps</p></div>
            {[
              { text: 'Complete your profile', done: !!user?.branch },
              { text: 'Explore companies',     done: companies.length > 0 },
              { text: 'Download a material',   done: materials.length > 0 },
            ].map(step => (
              <div key={step.text} className="flex items-center gap-2 mb-1.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: step.done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${step.done ? '#10B981' : '#1E2A45'}` }}>
                  {step.done && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />}
                </div>
                <p className="text-[11px]" style={{ color: step.done ? '#64748B' : '#94A3B8', textDecoration: step.done ? 'line-through' : 'none' }}>{step.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Study Materials */}
      {materials.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.4}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><FileText size={14} color="#6EE7B7" /><h2 className="font-bold text-sm text-white">Recent Study Materials</h2></div>
            <Link to="/study-materials" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#475569' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#6EE7B7')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#475569')}>View all <ArrowUpRight size={11} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {materials.map(m => {
              const ft = fileTypeBadge[m.file_type] || { bg: 'rgba(100,116,139,0.12)', color: '#94A3B8' };
              return (
                <motion.div key={m.id} whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
                  className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: ft.bg, color: ft.color }}>{m.file_type || 'FILE'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(99,102,241,0.1)', color: '#818CF8' }}>{m.category}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-1 line-clamp-2">{m.title}</h3>
                  <p className="text-xs mb-4 line-clamp-2" style={{ color: '#475569' }}>{m.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs flex items-center gap-1" style={{ color: '#334155' }}><Download size={11} /> {m.download_count} downloads</span>
                    <Link to="/study-materials" className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ color: '#818CF8', background: 'rgba(99,102,241,0.08)' }}>View</Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* News Teaser */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.5}
        className="rounded-2xl p-5" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Newspaper size={14} color="#67E8F9" /><h2 className="font-bold text-sm text-white">Latest News</h2></div>
          <Link to="/news" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#475569' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#67E8F9')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#475569')}>View all <ArrowUpRight size={11} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tag: 'Placements', title: 'TCS announces 40,000 campus hiring for 2025 batch', time: '2h ago' },
            { tag: 'Tech', title: 'Google expands AI internship to tier-2 colleges', time: '5h ago' },
            { tag: 'Industry', title: 'Infosys, Wipro raise fresher salary to ₹4.5 LPA', time: '1d ago' },
          ].map((n, i) => (
            <Link key={i} to="/news"
              className="block p-3.5 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1A2236' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,211,238,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.borderColor = '#1A2236'; }}>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: 'rgba(34,211,238,0.12)', color: '#67E8F9' }}>{n.tag}</span>
              <p className="text-xs font-semibold text-white leading-relaxed mb-1 line-clamp-2">{n.title}</p>
              <p className="text-[10px]" style={{ color: '#334155' }}>{n.time}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
