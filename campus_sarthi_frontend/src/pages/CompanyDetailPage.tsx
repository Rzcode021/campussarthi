import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Briefcase, MapPin, CalendarDays, Plus, FileText, Sparkles, CheckCircle2, MessageSquare, Code2, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { companiesApi } from '../services/companiesApi';
import { companyDocumentsApi } from '../services/companyDocumentsApi';
import type { Company, GroupedDocuments, CompanyDocument } from '../types/company';
import BookmarkButton from '../components/BookmarkButton';
import DocumentCard from '../components/DocumentCard';
import DocumentUploadModal from '../components/DocumentUploadModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ContributionModal from '../components/ContributionModal';
import { useAppStore } from '../store/useAppStore';

type Tab = 'about' | 'gd' | 'interview' | 'requirements' | 'process';

const DOMAIN_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  CS:      { bg: 'rgba(79,70,229,0.15)',  text: '#818CF8', glow: 'rgba(79,70,229,0.3)'  },
  Cyber:   { bg: 'rgba(220,38,38,0.15)',  text: '#FCA5A5', glow: 'rgba(220,38,38,0.3)'  },
  Product: { bg: 'rgba(5,150,105,0.15)',  text: '#6EE7B7', glow: 'rgba(5,150,105,0.3)'  },
  Sales:   { bg: 'rgba(217,119,6,0.15)',  text: '#FCD34D', glow: 'rgba(217,119,6,0.3)'  },
  default: { bg: 'rgba(100,116,139,0.15)', text: '#94A3B8', glow: 'rgba(100,116,139,0.3)' },
};

function getInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid #1E2A45' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(59,130,246,0.12)' }}>
        <span style={{ color: '#60A5FA' }}>{icon}</span>
      </div>
      <h3 className="font-bold text-white text-base">{title}</h3>
    </div>
  );
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('about');
  const [documents, setDocuments] = useState<GroupedDocuments>({});
  const [downloading, setDownloading] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const storeContributions = useAppStore(state => state.contributions);

  const fetchDocuments = () => {
    if (!id) return;
    companyDocumentsApi.getByCompany(parseInt(id))
      .then(res => setDocuments(res.data))
      .catch(() => setDocuments({}));
  };

  useEffect(() => {
    if (!id) return;
    companiesApi.getById(parseInt(id))
      .then((res) => {
        const c = res.data;
        if (!c) { setIsLoading(false); return; }
        const approvedForCompany = storeContributions.filter(
          con => con.companyId === c.id && con.status === 'approved'
        );
        approvedForCompany.forEach(con => {
          if (con.type === 'gd_questions') c.gd_questions = [...(c.gd_questions || []), con.content];
          if (con.type === 'interview_questions') c.interview_questions = [...(c.interview_questions || []), con.content];
          if (con.type === 'tech_requirements') c.tech_requirements = [...(c.tech_requirements || []), con.content];
        });
        setCompany(c as any);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    fetchDocuments();
  }, [id, storeContributions]);

  const handleDownload = async (doc: CompanyDocument) => {
    if (!id) return;
    setDownloading(doc.id);
    try {
      const res = await companyDocumentsApi.download(parseInt(id), doc.id);
      let downloadUrl = res.data.url;
      if (downloadUrl.includes('/upload/')) {
        const safeTitle = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_');
        downloadUrl = downloadUrl.replace('/upload/', `/upload/fl_attachment:${safeTitle}/`);
      }
      window.open(downloadUrl, '_blank');
    } catch {
      showToast('Download failed. Please try again.', 'error');
    } finally {
      setDownloading(null);
    }
  };

  const handleView = (doc: CompanyDocument) => {
    if (doc.file) window.open(doc.file, '_blank');
  };

  const getSectionKey = (t: Tab) => {
    const map: Record<Tab, string> = {
      about: 'about', gd: 'gd_questions', interview: 'interview_questions',
      requirements: 'requirements', process: 'selection_process',
    };
    return map[t];
  };

  if (isLoading) return (
    <div className="max-w-4xl mx-auto animate-pulse space-y-6">
      <div className="h-6 w-32 rounded" style={{ background: '#1E2A45' }} />
      <div className="h-48 rounded-2xl" style={{ background: '#141B2D', border: '1px solid #1E2A45' }} />
    </div>
  );

  if (!company) return (
    <div className="text-center py-20">
      <p className="text-lg mb-4" style={{ color: '#64748B' }}>Company not found.</p>
      <button onClick={() => navigate('/companies')} className="btn-primary px-6 py-2">
        ← Back to Companies
      </button>
    </div>
  );

  const domainStyle = DOMAIN_COLORS[company.domain] ?? DOMAIN_COLORS.default;
  const gdCount = (company.gd_questions ?? []).length;
  const interviewCount = (company.interview_questions ?? []).length;
  const processCount = (company.selection_rounds ?? []).length;
  const showLogo = company.logo && !logoError;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'about', label: 'About' },
    { id: 'gd', label: 'GD Topics', count: gdCount },
    { id: 'interview', label: 'Interview Qs', count: interviewCount },
    { id: 'requirements', label: 'Tech Stack' },
    { id: 'process', label: 'Process', count: processCount },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-6 transition-colors duration-200"
        style={{ color: '#64748B' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#94A3B8')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748B')}
      >
        <ArrowLeft size={16} /> Back to Companies
      </button>

      {/* ── Header Card ── */}
      <div
        className="rounded-2xl mb-6 overflow-hidden"
        style={{ background: '#141B2D', border: '1px solid #1E2A45', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${domainStyle.text}80, transparent)` }} />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Logo */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{
                background: showLogo ? '#FFFFFF' : domainStyle.bg,
                border: `1px solid ${showLogo ? '#E2E8F0' : domainStyle.text + '30'}`,
                boxShadow: `0 0 20px ${domainStyle.glow}`,
              }}
            >
              {showLogo ? (
                <img
                  src={company.logo!}
                  alt={`${company.name} logo`}
                  onError={() => setLogoError(true)}
                  style={{ maxWidth: '76%', maxHeight: '68px', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <span className="font-extrabold text-2xl" style={{ color: domainStyle.text }}>
                  {getInitials(company.name)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>{company.name}</h1>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: domainStyle.bg, color: domainStyle.text }}
                >
                  {company.domain}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: '#94A3B8' }}>
                  <Briefcase size={14} style={{ color: '#64748B' }} /> {company.job_role}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#6EE7B7' }}>
                  <IndianRupee size={14} /> {company.salary_lpa} LPA
                </span>
                {company.joining_location && (
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: '#94A3B8' }}>
                    <MapPin size={14} style={{ color: '#64748B' }} /> {company.joining_location}
                  </span>
                )}
                {company.tentative_date && (
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: '#94A3B8' }}>
                    <CalendarDays size={14} style={{ color: '#64748B' }} /> {company.tentative_date}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <BookmarkButton type="company" id={company.id} />
                <button
                  onClick={() => setIsContributionModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                  style={{ background: 'rgba(255,215,0,0.06)', color: '#FCD34D', border: '1px solid rgba(255,215,0,0.2)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,215,0,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,215,0,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <Sparkles size={15} /> Contribute
                </button>
                {(user?.role === 'crew' || user?.role === 'admin' || user?.is_staff) && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
                  >
                    <Plus size={15} /> Upload Doc
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-0.5 mb-6 overflow-x-auto" style={{ borderBottom: '1px solid #1E2A45' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-3 text-sm font-medium whitespace-nowrap relative transition-colors duration-200 flex-shrink-0 flex items-center gap-1.5"
            style={{ color: tab === t.id ? '#60A5FA' : '#64748B' }}
            onMouseEnter={(e) => { if (tab !== t.id) (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}
            onMouseLeave={(e) => { if (tab !== t.id) (e.currentTarget as HTMLElement).style.color = '#64748B'; }}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: tab === t.id ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)', color: tab === t.id ? '#93C5FD' : '#475569' }}
              >
                {t.count}
              </span>
            )}
            {tab === t.id && (
              <motion.div layoutId="detail-tab" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: '#3B82F6' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: '#141B2D', border: '1px solid #1E2A45' }}>

        {/* ABOUT */}
        {tab === 'about' && (
          <div className="space-y-6">
            <SectionHeading icon={<Briefcase size={16} />} title="About the Company" />
            <p className="text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>{company.about || 'No description available.'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="rounded-xl p-4" style={{ background: '#0F1623', border: '1px solid #1E2A45' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>Eligibility Criteria</p>
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{company.eligibility_criteria || 'Not specified'}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: '#0F1623', border: '1px solid #1E2A45' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>Bond Details</p>
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{company.bond_details || 'No bond'}</p>
              </div>
            </div>

            {company.package_details && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2A45' }}>
                <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: '#0F1623', borderBottom: '1px solid #1E2A45' }}>
                  <IndianRupee size={14} style={{ color: '#6EE7B7' }} />
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>Package Breakdown</p>
                </div>
                <pre className="px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap font-mono" style={{ color: '#A3E635', background: '#0D1420' }}>
                  {company.package_details}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* GD TOPICS */}
        {tab === 'gd' && (
          <div>
            <SectionHeading icon={<MessageSquare size={16} />} title="Group Discussion Topics" />
            {(company.gd_questions ?? []).length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#475569' }}>No GD topics available yet. Be the first to contribute!</p>
            ) : (
              <ol className="space-y-3">
                {(company.gd_questions ?? []).map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl group transition-all duration-150"
                    style={{ background: '#0F1623', border: '1px solid #1E2A45' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#263048')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#1E2A45')}
                  >
                    <span
                      className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8' }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm flex-1 leading-relaxed" style={{ color: '#CBD5E1' }}>{q}</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <BookmarkButton type="question" id={company.id * 1000 + i} />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* INTERVIEW Qs */}
        {tab === 'interview' && (
          <div>
            <SectionHeading icon={<MessageSquare size={16} />} title="Interview Questions" />
            {(company.interview_questions ?? []).length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#475569' }}>No interview questions available yet. Be the first to contribute!</p>
            ) : (
              <ol className="space-y-3">
                {(company.interview_questions ?? []).map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl group transition-all duration-150"
                    style={{ background: '#0F1623', border: '1px solid #1E2A45' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#263048')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#1E2A45')}
                  >
                    <span
                      className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399' }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm flex-1 leading-relaxed" style={{ color: '#CBD5E1' }}>{q}</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <BookmarkButton type="question" id={company.id * 10000 + i} />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* TECH REQUIREMENTS */}
        {tab === 'requirements' && (
          <div>
            <SectionHeading icon={<Code2 size={16} />} title="Technical Requirements" />
            {(company.tech_requirements ?? []).length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#475569' }}>No technical requirements listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {(company.tech_requirements ?? []).map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    <CheckCircle2 size={13} style={{ color: '#60A5FA' }} /> {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SELECTION PROCESS */}
        {tab === 'process' && (
          <div>
            <SectionHeading icon={<GitBranch size={16} />} title="Selection Process" />
            {(!company.selection_rounds || company.selection_rounds.length === 0) ? (
              <p className="text-sm text-center py-8" style={{ color: '#475569' }}>Selection process details not available.</p>
            ) : (
              <div className="relative pl-8">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-px" style={{ background: 'linear-gradient(to bottom, #3B82F6, #1E2A45)' }} />
                <div className="space-y-5">
                  {company.selection_rounds.map((round, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      {/* Dot */}
                      <div
                        className="absolute -left-5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: '#141B2D', border: '2px solid #3B82F6', zIndex: 1 }}
                      >
                        <span className="text-[8px] font-bold" style={{ color: '#60A5FA' }}>{i + 1}</span>
                      </div>
                      <div
                        className="flex-1 rounded-xl p-4"
                        style={{ background: '#0F1623', border: '1px solid #1E2A45' }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#3B82F6' }}>Round {i + 1}</p>
                        <h4 className="font-semibold text-sm" style={{ color: '#E2E8F0' }}>{round}</h4>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs font-medium" style={{ color: '#475569' }}>
                  * {company.selection_rounds.length} total selection round{company.selection_rounds.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Documents Section ── */}
        <div className="mt-10 pt-8" style={{ borderTop: '1px solid #1E2A45' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileText size={16} style={{ color: '#60A5FA' }} />
              <h3 className="font-bold text-white text-sm">Related Documents</h3>
            </div>
            {(user?.role === 'crew' || user?.role === 'admin' || user?.is_staff) && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Plus size={13} /> Upload
              </button>
            )}
          </div>

          {documents[getSectionKey(tab)] && documents[getSectionKey(tab)].length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents[getSectionKey(tab)].map(doc => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onDownload={handleDownload}
                  onView={handleView}
                  isDownloading={downloading === doc.id}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-10 rounded-2xl"
              style={{ background: '#0F1623', border: '1px dashed #263048' }}
            >
              <FileText size={28} className="mx-auto mb-2" style={{ color: '#334155' }} />
              <p className="text-sm" style={{ color: '#475569' }}>No documents attached to this section yet.</p>
            </div>
          )}
        </div>
      </div>

      {isUploadModalOpen && company && (
        <DocumentUploadModal
          companyId={company.id}
          companyName={company.name}
          initialSection={getSectionKey(tab)}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={fetchDocuments}
        />
      )}

      {isContributionModalOpen && company && (
        <ContributionModal
          companyId={company.id}
          companyName={company.name}
          onClose={() => setIsContributionModalOpen(false)}
        />
      )}
    </div>
  );
}
