import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Upload, FileText, AlertCircle, ChevronDown } from 'lucide-react';
import { companiesApi } from '../services/companiesApi';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  companyId: number;
  companyName: string;
  onClose: () => void;
}

const CONTRIBUTION_TYPES = [
  { id: 'interview_questions', label: 'Interview Questions', icon: '💬', desc: 'Real questions asked in interviews' },
  { id: 'gd_questions',        label: 'GD Questions',        icon: '🎤', desc: 'Group discussion topics & themes' },
  { id: 'tech_requirements',   label: 'Technical Questions',  icon: '⚙️', desc: 'Technical / coding round questions' },
  { id: 'hr_questions',        label: 'HR Questions',         icon: '👔', desc: 'HR round questions & answers' },
  { id: 'selection_process',   label: 'Selection Process',    icon: '🗺️', desc: 'Round-wise process flow' },
  { id: 'notes',               label: 'Notes',                icon: '📝', desc: 'Preparation notes & summaries' },
  { id: 'preparation_tips',    label: 'Preparation Tips',     icon: '💡', desc: 'Tips & strategies for this company' },
  { id: 'job_profile',         label: 'Job Profile',          icon: '📋', desc: 'Role details and responsibilities' },
  { id: 'package_info',        label: 'Package Info',         icon: '💰', desc: 'CTC, stipend, and bonus details' },
];

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg';

export default function ContributionModal({ companyId, companyName, onClose }: Props) {
  const [type, setType]               = useState('interview_questions');
  const [content, setContent]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [dragActive, setDragActive]   = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [errors, setErrors]           = useState<{ content?: string }>({});
  const [typeOpen, setTypeOpen]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  const selectedType = CONTRIBUTION_TYPES.find((t) => t.id === type) ?? CONTRIBUTION_TYPES[0];

  const validate = () => {
    const e: { content?: string } = {};
    if (!content.trim()) e.content = 'Please enter your contribution content.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await companiesApi.submitContribution({
        company:           companyId,
        company_name:      companyName,
        contribution_type: type,
        content:           content.trim(),
        submitted_by:      user?.full_name || user?.email || 'Anonymous',
      });
      setSubmitted(true);
    } catch {
      showToast('Failed to submit contribution.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFile = (file: File) => setAttachedFile(file);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  /* ── Shared input styles ── */
  const inputBase: React.CSSProperties = {
    width: '100%',
    borderRadius: '12px',
    border: '1.5px solid #E5E7EB',
    background: '#F9FAFB',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
  };
  const onFocusStyle = (e: React.FocusEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#3B82F6';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
    e.currentTarget.style.background = '#fff';
  };
  const onBlurStyle = (e: React.FocusEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#E5E7EB';
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.background = '#F9FAFB';
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full overflow-hidden"
        style={{
          maxWidth: '680px',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.06)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── Success State ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center px-10 py-16"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 0 32px rgba(16,185,129,0.3)' }}
              >
                <CheckCircle size={36} color="#fff" />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#111827', letterSpacing: '-0.02em' }}>
                Contribution Submitted!
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: '#6B7280' }}>
                Your contribution has been submitted successfully and sent for admin approval. It will appear once reviewed.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: '#fff', boxShadow: '0 4px 16px rgba(59,130,246,0.35)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(59,130,246,0.4)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(59,130,246,0.35)'; }}
              >
                Done
              </button>
            </motion.div>
          ) : (
            /* ── Form State ── */
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>

              {/* Header */}
              <div className="px-8 pt-7 pb-6 flex-shrink-0" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '1px solid #C7D2FE' }}
                    >
                      <span style={{ fontSize: '20px' }}>✍️</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: '#111827', letterSpacing: '-0.02em' }}>
                        Contribute Content
                      </h2>
                      <p className="text-xs mt-1 leading-relaxed max-w-sm" style={{ color: '#6B7280' }}>
                        Help future students by sharing placement experiences for <span className="font-semibold" style={{ color: '#374151' }}>{companyName}</span>.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150"
                    style={{ background: '#F3F4F6', color: '#6B7280' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#E5E7EB'; (e.currentTarget as HTMLElement).style.color = '#111827'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Scrollable Form */}
              <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1 }}>
                <div className="px-8 py-6 space-y-6">

                  {/* ── Contribution Type ── */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                      Contribution Type <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    {/* Custom dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setTypeOpen(!typeOpen)}
                        className="w-full flex items-center justify-between text-left transition-all duration-180"
                        style={{
                          ...inputBase,
                          padding: '12px 16px',
                          cursor: 'pointer',
                          border: typeOpen ? '1.5px solid #3B82F6' : '1.5px solid #E5E7EB',
                          boxShadow: typeOpen ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
                          background: typeOpen ? '#fff' : '#F9FAFB',
                        }}
                      >
                        <span className="flex items-center gap-2.5">
                          <span style={{ fontSize: '16px' }}>{selectedType.icon}</span>
                          <span className="font-medium" style={{ color: '#111827' }}>{selectedType.label}</span>
                        </span>
                        <ChevronDown
                          size={16}
                          style={{ color: '#9CA3AF', transform: typeOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                        />
                      </button>
                      <AnimatePresence>
                        {typeOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 z-50 mt-1.5 rounded-2xl overflow-hidden"
                            style={{ background: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,0.14)', border: '1px solid #E5E7EB' }}
                          >
                            {CONTRIBUTION_TYPES.map((t) => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => { setType(t.id); setTypeOpen(false); }}
                                className="w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-100"
                                style={{
                                  background: type === t.id ? '#EEF2FF' : 'transparent',
                                  borderBottom: '1px solid #F9FAFB',
                                }}
                                onMouseEnter={(e) => { if (type !== t.id) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
                                onMouseLeave={(e) => { if (type !== t.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                              >
                                <span style={{ fontSize: '16px', marginTop: '1px' }}>{t.icon}</span>
                                <div>
                                  <p className="text-sm font-semibold" style={{ color: type === t.id ? '#4F46E5' : '#111827' }}>{t.label}</p>
                                  <p className="text-xs" style={{ color: '#9CA3AF' }}>{t.desc}</p>
                                </div>
                                {type === t.id && <CheckCircle size={15} style={{ color: '#4F46E5', marginLeft: 'auto', marginTop: '3px', flexShrink: 0 }} />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* ── Content ── */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                      Your Content <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <textarea
                      style={{
                        ...inputBase,
                        minHeight: '200px',
                        resize: 'vertical',
                        lineHeight: '1.6',
                        fontFamily: 'inherit',
                        borderColor: errors.content ? '#EF4444' : '#E5E7EB',
                        boxShadow: errors.content ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
                      }}
                      placeholder={
                        type === 'interview_questions'
                          ? 'e.g.\n1. What is the difference between SQL and NoSQL?\n2. Explain the CAP theorem.\n3. Design a URL shortener system.'
                          : type === 'gd_questions'
                          ? 'e.g.\n• Impact of AI on the Job Market\n• Work from Home vs Office'
                          : type === 'selection_process'
                          ? 'e.g.\nRound 1: Online Aptitude Test (90 min)\nRound 2: Technical Interview\nRound 3: HR Interview'
                          : 'Share your experience, insights, or preparation tips...'
                      }
                      value={content}
                      onChange={(e) => { setContent(e.target.value); if (errors.content) setErrors({}); }}
                      onFocus={onFocusStyle}
                      onBlur={onBlurStyle}
                    />
                    {errors.content && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: '#EF4444' }}>
                        <AlertCircle size={12} /> {errors.content}
                      </motion.p>
                    )}
                  </div>

                  {/* ── Attachments ── */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                      Attachment <span className="font-normal" style={{ color: '#9CA3AF' }}>(optional)</span>
                    </label>
                    <div
                      className="relative rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer"
                      style={{
                        border: `2px dashed ${dragActive ? '#3B82F6' : attachedFile ? '#10B981' : '#D1D5DB'}`,
                        background: dragActive ? 'rgba(59,130,246,0.04)' : attachedFile ? 'rgba(16,185,129,0.04)' : '#FAFAFA',
                        padding: '28px 20px',
                        minHeight: '110px',
                      }}
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept={ACCEPTED_TYPES}
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      />
                      {attachedFile ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                            <FileText size={20} style={{ color: '#10B981' }} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold" style={{ color: '#111827' }}>{attachedFile.name}</p>
                            <p className="text-xs" style={{ color: '#6B7280' }}>
                              {(attachedFile.size / 1024).toFixed(1)} KB •{' '}
                              <span
                                className="font-medium cursor-pointer"
                                style={{ color: '#EF4444' }}
                                onClick={(e) => { e.stopPropagation(); setAttachedFile(null); }}
                              >
                                Remove
                              </span>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                            style={{ background: dragActive ? 'rgba(59,130,246,0.1)' : '#F3F4F6' }}
                          >
                            <Upload size={18} style={{ color: dragActive ? '#3B82F6' : '#9CA3AF' }} />
                          </div>
                          <p className="text-sm font-medium" style={{ color: '#374151' }}>
                            Drag & drop or <span style={{ color: '#3B82F6' }}>browse</span>
                          </p>
                          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>PDF, DOCX, PPT, PNG, JPG</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Review Notice ── */}
                  <div
                    className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
                  >
                    <AlertCircle size={15} style={{ color: '#F97316', marginTop: '1px', flexShrink: 0 }} />
                    <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
                      Contributions are reviewed by the admin team before becoming visible to all users. Please ensure your content is accurate and helpful.
                    </p>
                  </div>
                </div>

                {/* ── Footer Buttons ── */}
                <div className="px-8 pb-7 pt-2 flex items-center gap-3 flex-shrink-0" style={{ borderTop: '1px solid #F3F4F6' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-180"
                    style={{ background: '#F3F4F6', color: '#374151', border: '1.5px solid #E5E7EB' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#E5E7EB'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                    }}
                    onMouseEnter={(e) => { if (!isSubmitting) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(59,130,246,0.45)'; } }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(59,130,246,0.35)'; }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <><Send size={15} /> Submit for Approval</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
