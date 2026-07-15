import { Download, FileText, FileCode, FileImage, FileAudio, FileVideo, Eye } from 'lucide-react';
import type { CompanyDocument } from '../types/company';

const fileTypeColors: Record<string, string> = {
  PDF: 'bg-red-100 text-red-700',
  DOC: 'bg-blue-100 text-blue-700',
  DOCX: 'bg-blue-100 text-blue-700',
  PPT: 'bg-orange-100 text-orange-700',
  PPTX: 'bg-orange-100 text-orange-700',
  XLS: 'bg-green-100 text-green-700',
  XLSX: 'bg-green-100 text-green-700',
};

const getFileIcon = (type: string) => {
  const t = type.toUpperCase();
  if (['PDF', 'DOC', 'DOCX', 'TXT'].includes(t)) return <FileText size={16} />;
  if (['XLS', 'XLSX', 'CSV'].includes(t)) return <FileCode size={16} />;
  if (['JPG', 'JPEG', 'PNG', 'SVG', 'WEBP'].includes(t)) return <FileImage size={16} />;
  if (['MP3', 'WAV'].includes(t)) return <FileAudio size={16} />;
  if (['MP4', 'MOV', 'AVI'].includes(t)) return <FileVideo size={16} />;
  return <FileText size={16} />;
};

interface DocumentCardProps {
  doc: CompanyDocument;
  onDownload: (doc: CompanyDocument) => void;
  onView: (doc: CompanyDocument) => void;
  isDownloading?: boolean;
}

export default function DocumentCard({ doc, onDownload, onView, isDownloading }: DocumentCardProps) {
  return (
    <div className="card p-4 hover:shadow-lg transition-all border border-border/40 group">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${fileTypeColors[doc.file_type] || 'bg-surface text-muted'}`}>
          {doc.file_type}
        </span>
        <span className="text-[10px] text-muted font-medium">
          {new Date(doc.created_at).toLocaleDateString()}
        </span>
      </div>
      
      <div className="flex gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${fileTypeColors[doc.file_type] || 'bg-surface text-muted'} bg-opacity-20`}>
          {getFileIcon(doc.file_type)}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-heading truncate group-hover:text-primary transition-colors">
            {doc.title}
          </h4>
          {doc.description && (
            <p className="text-xs text-muted line-clamp-1 mt-0.5">
              {doc.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <span className="text-[10px] text-muted flex items-center gap-1">
          <Download size={10} /> {doc.download_count} · {doc.file_size}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onView(doc)}
            className="p-1.5 rounded-lg bg-surface hover:bg-primary-light hover:text-primary text-muted transition-colors"
            title="View"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onDownload(doc)}
            disabled={isDownloading}
            className="p-1.5 rounded-lg bg-surface hover:bg-primary-light hover:text-primary text-muted transition-colors disabled:opacity-50"
            title="Download"
          >
            {isDownloading ? (
              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
