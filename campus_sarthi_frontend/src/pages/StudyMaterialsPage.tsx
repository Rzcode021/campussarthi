import { useEffect, useState } from 'react';
import { Download, FileText, Eye } from 'lucide-react';
import { studyMaterialsApi } from '../services/studyMaterialsApi';
import type { StudyMaterial } from '../types/studyMaterial';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['All', 'Aptitude', 'Technical', 'HR Interview', 'GD Preparation', 'Resume', 'Domain Specific'];

const fileTypeColors: Record<string, string> = {
  PDF: 'bg-red-100 text-red-700',
  DOC: 'bg-blue-100 text-blue-700',
  DOCX: 'bg-blue-100 text-blue-700',
  PPT: 'bg-orange-100 text-orange-700',
  PPTX: 'bg-orange-100 text-orange-700',
};

const catColors: Record<string, string> = {
  Aptitude: 'bg-yellow-50 text-warning',
  Technical: 'bg-primary-light text-primary',
  'HR Interview': 'bg-green-50 text-success',
  'GD Preparation': 'bg-purple-50 text-purple-600',
  Resume: 'bg-red-50 text-danger',
  'Domain Specific': 'bg-blue-50 text-info',
};

export default function StudyMaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [downloading, setDownloading] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    studyMaterialsApi.getAll(activeCategory !== 'All' ? activeCategory : undefined)
      .then((res) => setMaterials(res.data))
      .catch(() => setMaterials([]))
      .finally(() => setIsLoading(false));
  }, [activeCategory]);

  const handleDownload = async (material: StudyMaterial) => {
    setDownloading(material.id);
    try {
      const res = await studyMaterialsApi.download(material.id);
      let downloadUrl = res.data.url;
      if (downloadUrl.includes('/upload/')) {
        const safeTitle = material.title.replace(/[^a-zA-Z0-9_-]/g, '_');
        downloadUrl = downloadUrl.replace('/upload/', `/upload/fl_attachment:${safeTitle}/`);
      }
      window.open(downloadUrl, '_blank');
      showToast('Download started!', 'success');
    } catch {
      showToast('Download failed. Try again.', 'error');
    } finally {
      setDownloading(null);
    }
  };

  const handleView = (material: StudyMaterial) => {
    window.open(material.file, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Study Materials</h1>
        <p className="text-sm text-muted mt-0.5">Approved resources to help you prepare for placements</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
              activeCategory === cat ? 'text-primary' : 'text-muted hover:text-body'
            }`}
          >
            {cat}
            {activeCategory === cat && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m) => (
            <div key={m.id} className="card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded ${fileTypeColors[m.file_type] || 'bg-surface text-muted'}`}>
                  {m.file_type || 'FILE'}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColors[m.category] || 'bg-surface text-muted'}`}>
                  {m.category}
                </span>
              </div>
              <h3 className="font-semibold text-heading text-sm mb-2 line-clamp-2">{m.title}</h3>
              <p className="text-xs text-muted leading-relaxed mb-4 flex-1 line-clamp-3">{m.description}</p>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                <span className="text-xs text-muted flex items-center gap-1">
                  <Download size={11} /> {m.download_count} downloads
                  {m.file_size && <span className="ml-1">· {m.file_size}</span>}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(m)}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                  >
                    <Eye size={12} /> View
                  </button>
                  <button
                    onClick={() => handleDownload(m)}
                    disabled={downloading === m.id}
                    className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {downloading === m.id ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download size={12} />
                    )}
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText size={48} />}
          title="No materials yet"
          subtitle="Study materials approved by the placement team will appear here."
        />
      )}
    </div>
  );
}
