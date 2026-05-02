import React, { useEffect, useState } from 'react';
import { FileText, Building2, Download, Clock, CheckCircle2, XCircle, Info, Eye } from 'lucide-react';
import { studyMaterialsApi } from '../services/studyMaterialsApi';
import { companyDocumentsApi } from '../services/companyDocumentsApi';
import type { StudyMaterial } from '../types/studyMaterial';
import type { AdminCompanyDocument } from '../types/company';
import { useToast } from '../context/ToastContext';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

type UploadTab = 'materials' | 'documents';

export default function MyUploadsPage() {
  const [activeTab, setActiveTab] = useState<UploadTab>('materials');
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [docs, setDocs] = useState<AdminCompanyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'materials') {
        const res = await studyMaterialsApi.getMyMaterials();
        setMaterials(res.data);
      } else {
        const res = await companyDocumentsApi.getMyDocuments();
        setDocs(res.data);
      }
    } catch {
      showToast('Failed to load your uploads.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (url: string) => {
    if (url) window.open(url, '_blank');
  };

  const handleDownload = (url: string, title: string) => {
    if (!url) return;
    let downloadUrl = url;
    if (downloadUrl.includes('/upload/')) {
      const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
      downloadUrl = downloadUrl.replace('/upload/', `/upload/fl_attachment:${safeTitle}/`);
    }
    window.open(downloadUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider"><CheckCircle2 size={10} /> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-danger bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider"><XCircle size={10} /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 text-[10px] font-bold text-warning bg-yellow-50 px-2 py-0.5 rounded-full uppercase tracking-wider"><Clock size={10} /> Pending</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">My Uploads</h1>
        <p className="text-sm text-muted mt-0.5">Track and manage the resources you've shared with students</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {[
          { id: 'materials', label: 'Study Materials', icon: <FileText size={18} /> },
          { id: 'documents', label: 'Company Documents', icon: <Building2 size={18} /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as UploadTab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === t.id 
                ? 'bg-white text-primary shadow-lg shadow-primary/5 border border-primary/10' 
                : 'text-muted hover:text-heading hover:bg-white/50'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : activeTab === 'materials' ? (
        materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m) => (
              <div key={m.id} className="card p-6 flex flex-col border border-border/40 hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(m.status)}
                  <span className="text-[10px] font-bold text-muted bg-surface px-2 py-0.5 rounded uppercase">{m.file_type}</span>
                </div>
                <h3 className="font-bold text-heading text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{m.title}</h3>
                <p className="text-xs text-muted leading-relaxed mb-4 flex-1 line-clamp-3">{m.description}</p>
                
                {m.status === 'rejected' && m.rejection_reason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-xl flex items-start gap-2 border border-red-100">
                    <Info size={14} className="text-danger shrink-0 mt-0.5" />
                    <p className="text-[11px] text-danger italic leading-tight">
                      Reason: {m.rejection_reason}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(m.file)}
                      className="p-1.5 rounded-lg bg-surface hover:bg-primary-light hover:text-primary text-muted transition-colors"
                      title="View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDownload(m.file, m.title)}
                      className="p-1.5 rounded-lg bg-surface hover:bg-primary-light hover:text-primary text-muted transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{m.category}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText size={48} />}
            title="No study materials"
            subtitle="You haven't uploaded any study materials yet. Head to the Admin Panel to upload."
          />
        )
      ) : (
        docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((d) => (
              <div key={d.id} className="card p-6 flex flex-col border border-border/40 hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(d.status)}
                  <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded uppercase">{d.file_type}</span>
                </div>
                <div className="mb-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{d.company_name}</span>
                </div>
                <h3 className="font-bold text-heading text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{d.title}</h3>
                <p className="text-xs text-muted leading-relaxed mb-4 flex-1 line-clamp-3">{d.description}</p>

                {d.status === 'rejected' && d.rejection_reason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-xl flex items-start gap-2 border border-red-100">
                    <Info size={14} className="text-danger shrink-0 mt-0.5" />
                    <p className="text-[11px] text-danger italic leading-tight">
                      Reason: {d.rejection_reason}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(d.file)}
                      className="p-1.5 rounded-lg bg-surface hover:bg-primary-light hover:text-primary text-muted transition-colors"
                      title="View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDownload(d.file, d.title)}
                      className="p-1.5 rounded-lg bg-surface hover:bg-primary-light hover:text-primary text-muted transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{d.section.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Building2 size={48} />}
            title="No company documents"
            subtitle="You haven't uploaded any documents to company pages yet. Visit a company detail page to upload."
          />
        )
      )}
    </div>
  );
}
