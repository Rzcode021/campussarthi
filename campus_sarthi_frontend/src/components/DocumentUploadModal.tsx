import React, { useState } from 'react';
import { X, Upload, File, AlertCircle } from 'lucide-react';
import { companyDocumentsApi } from '../services/companyDocumentsApi';
import { useToast } from '../context/ToastContext';

interface DocumentUploadModalProps {
  companyId: number;
  companyName: string;
  onClose: () => void;
  onSuccess: () => void;
  initialSection?: string;
}

const SECTIONS = [
  { value: 'about', label: 'About' },
  { value: 'gd_questions', label: 'GD Questions' },
  { value: 'interview_questions', label: 'Interview Questions' },
  { value: 'requirements', label: 'Requirements' },
  { value: 'selection_process', label: 'Selection Process' },
];

export default function DocumentUploadModal({
  companyId,
  companyName,
  onClose,
  onSuccess,
  initialSection
}: DocumentUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    section: initialSection || 'about',
  });
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 25 * 1024 * 1024) {
        showToast('File size must be under 25MB', 'error');
        return;
      }
      setFile(selectedFile);
      // Auto-fill title if empty
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: selectedFile.name.split('.')[0] }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a file', 'error');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('section', formData.section);
    // NOTE: 'company' is NOT sent — backend extracts from URL /{company_id}/documents/upload/

    setIsUploading(true);
    try {
      await companyDocumentsApi.upload(companyId, data);
      showToast('Document uploaded successfully! Awaiting admin approval.', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to upload document';
      showToast(errorMsg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface/50">
          <div>
            <h3 className="font-bold text-heading">Upload Document</h3>
            <p className="text-xs text-muted">Adding to {companyName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors text-muted">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {/* File Drop/Input */}
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all text-center ${
                file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-surface'
              }`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="flex flex-col items-center">
                {file ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-3">
                      <File size={24} />
                    </div>
                    <p className="text-sm font-semibold text-heading truncate max-w-full px-4">{file.name}</p>
                    <p className="text-xs text-muted mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-surface text-muted flex items-center justify-center mb-3">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-semibold text-heading">Click or drag to upload</p>
                    <p className="text-xs text-muted mt-1">PDF, Word, PPT or Excel up to 25MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Document Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. GD Preparation Guide"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Section */}
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Target Section</label>
                <select
                  className="form-input"
                  value={formData.section}
                  onChange={e => setFormData({ ...formData, section: e.target.value })}
                  required
                >
                  {SECTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Description (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Short summary..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] btn-primary flex items-center justify-center gap-2"
              disabled={isUploading || !file}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Submit Document
                </>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-700 text-[11px] leading-relaxed">
            <AlertCircle size={14} className="shrink-0" />
            <span>Documents uploaded by crew members require admin verification before becoming visible to students.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
