import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Briefcase, Plus, FileText } from 'lucide-react';
import { companiesApi } from '../services/companiesApi';
import { companyDocumentsApi } from '../services/companyDocumentsApi';
import type { Company, GroupedDocuments, CompanyDocument } from '../types/company';
import BookmarkButton from '../components/BookmarkButton';
import DocumentCard from '../components/DocumentCard';
import DocumentUploadModal from '../components/DocumentUploadModal';
import { getDomainColor, getCompanyInitial } from '../utils/companyAvatar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

type Tab = 'about' | 'gd' | 'interview' | 'requirements' | 'process';

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('about');
  const [documents, setDocuments] = useState<GroupedDocuments>({});
  const [downloading, setDownloading] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchDocuments = () => {
    if (!id) return;
    companyDocumentsApi.getByCompany(parseInt(id))
      .then(res => setDocuments(res.data))
      .catch(() => setDocuments({}));
  };

  useEffect(() => {
    if (!id) return;
    companiesApi.getById(parseInt(id))
      .then((res) => setCompany(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
      
    fetchDocuments();
  }, [id]);

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
    if (doc.file) {
      window.open(doc.file, '_blank');
    }
  };

  const getSectionKey = (t: Tab) => {
    const map: Record<Tab, string> = {
      about: 'about',
      gd: 'gd_questions',
      interview: 'interview_questions',
      requirements: 'requirements',
      process: 'selection_process',
    };
    return map[t];
  };

  if (isLoading) return (
    <div className="max-w-4xl mx-auto animate-pulse space-y-6">
      <div className="h-6 w-32 bg-border rounded" />
      <div className="card p-8 h-40 bg-border rounded-xl" />
    </div>
  );
  if (!company) return <div className="text-center py-20 text-muted">Company not found.</div>;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'about', label: 'About' },
    { id: 'gd', label: `GD (${company.gd_questions.length})` },
    { id: 'interview', label: `Interview (${company.interview_questions.length})` },
    { id: 'requirements', label: 'Requirements' },
    { id: 'process', label: `Process (${company.selection_rounds?.length || 0})` },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted hover:text-body text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Companies
      </button>

      {/* Header */}
      <div className="card p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className={`w-16 h-16 rounded-2xl ${getDomainColor(company.domain)} text-white font-bold text-2xl flex items-center justify-center flex-shrink-0`}>
            {getCompanyInitial(company.name)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-heading">{company.name}</h1>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDomainColor(company.domain)}`}>
                {company.domain}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5"><Briefcase size={14} />{company.job_role}</span>
              <span className="flex items-center gap-1.5 text-success font-medium">
                <IndianRupee size={14} />{company.salary_lpa} LPA
              </span>
              {company.joining_location && (
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Location:</span> {company.joining_location}
                </span>
              )}
              {company.tentative_date && (
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Tentative:</span> {company.tentative_date}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookmarkButton type="company" id={company.id} />
            {(user?.role === 'crew' || user?.role === 'admin' || user?.is_staff) && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
              >
                <Plus size={16} /> Upload Document
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
              tab === t.id ? 'text-primary' : 'text-muted hover:text-body'
            }`}
          >
            {t.label}
            {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card p-8">
        {tab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-heading mb-3">About the Company</h3>
              <p className="text-sm text-body leading-relaxed">{company.about}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <h4 className="font-semibold text-heading text-sm mb-2">Eligibility Criteria</h4>
                <p className="text-sm text-muted leading-relaxed">{company.eligibility_criteria}</p>
              </div>
              <div>
                <h4 className="font-semibold text-heading text-sm mb-2">Bond Details</h4>
                <p className="text-sm text-muted">{company.bond_details}</p>
              </div>
            </div>
            {company.package_details && (
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-heading text-sm mb-3">Package Breakdown</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm whitespace-pre-wrap text-slate-700">
                  {company.package_details}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'gd' && (
          <div>
            <h3 className="font-semibold text-heading mb-5">Group Discussion Topics</h3>
            <ol className="space-y-3">
              {company.gd_questions.map((q, i) => (
                <li key={i} className="flex items-start gap-4 p-4 bg-surface rounded-xl border border-border group">
                  <span className="w-7 h-7 rounded-full bg-primary-light text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-body flex-1">{q}</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookmarkButton type="question" id={company.id * 1000 + i} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {tab === 'interview' && (
          <div>
            <h3 className="font-semibold text-heading mb-5">Interview Questions</h3>
            <ol className="space-y-3">
              {company.interview_questions.map((q, i) => (
                <li key={i} className="flex items-start gap-4 p-4 bg-surface rounded-xl border border-border group">
                  <span className="w-7 h-7 rounded-full bg-green-50 text-success text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-body flex-1">{q}</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookmarkButton type="question" id={company.id * 10000 + i} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {tab === 'requirements' && (
          <div>
            <h3 className="font-semibold text-heading mb-5">Technical Requirements</h3>
            <div className="flex flex-wrap gap-3">
              {company.tech_requirements.map((tech) => (
                <span key={tech} className="bg-primary-light text-primary text-sm font-medium px-4 py-2 rounded-lg border border-indigo-100">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === 'process' && (
          <div>
            <h3 className="font-semibold text-heading mb-6">Selection Process</h3>
            <div className="space-y-0 pl-4 border-l-2 border-indigo-50 ml-2">
              {company.selection_rounds?.map((round, i) => (
                <div key={i} className="relative pb-8 last:pb-0">
                  <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                  <div className="bg-white p-4 rounded-xl border border-border shadow-sm ml-4">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Round {i + 1}</span>
                    <h4 className="font-bold text-heading mt-0.5">{round}</h4>
                  </div>
                </div>
              ))}
              {(!company.selection_rounds || company.selection_rounds.length === 0) && (
                <div className="text-sm text-muted italic">Selection process details not available.</div>
              )}
            </div>
            {(company.selection_rounds?.length ?? 0) > 0 && (
              <div className="mt-8 pt-4 border-t border-border text-xs text-muted font-medium italic">
                * Total of {company.selection_rounds?.length} selection rounds
              </div>
            )}
          </div>
        )}

        {/* Common Document Section for all tabs */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              <h3 className="font-semibold text-heading">Related Documents</h3>
            </div>
            {(user?.role === 'crew' || user?.role === 'admin' || user?.is_staff) && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-2"
              >
                <Plus size={14} /> Upload Doc
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
            <div className="text-center py-8 bg-surface/50 rounded-2xl border border-dashed border-border">
              <p className="text-sm text-muted">No documents attached to this section yet.</p>
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
    </div>
  );
}
