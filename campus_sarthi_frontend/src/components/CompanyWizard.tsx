import React, { useState } from 'react';
import { X, Check, ArrowLeft, ArrowRight, Trash2, Plus } from 'lucide-react';
import { useCompanyWizard } from '../hooks/useCompanyWizard';
import { getDomainColor, getCompanyInitial } from '../utils/companyAvatar';

interface CompanyWizardProps {
  onClose: () => void;
  onSuccess: () => void;
  initialDraftData?: any;
}

const domains = [
  { id: 'CS', name: 'Computer Science', desc: 'Software, IT services', icon: '💻' },
  { id: 'Cyber', name: 'Cybersecurity', desc: 'Security, networking', icon: '🔒' },
  { id: 'Product', name: 'Product', desc: 'SaaS, tech products', icon: '📦' },
  { id: 'Sales', name: 'Sales', desc: 'Business development', icon: '💼' },
];

const presetRounds = [
  'Aptitude Test', 'Technical Round', 'Coding Test', 
  'Group Discussion', 'HR Interview', 'Manager Round'
];

export default function CompanyWizard({ onClose, onSuccess, initialDraftData }: CompanyWizardProps) {
  const wizard = useCompanyWizard(onSuccess);
  const [techInput, setTechInput] = useState('');

  // Resume draft if provided
  React.useEffect(() => {
    if (initialDraftData) {
      wizard.resumeDraft(initialDraftData);
    }
  }, [initialDraftData]);

  const { formData, currentStep, errors, isSubmitting, isSavingDraft } = wizard;

  const handleClose = () => {
    if (formData.name && !confirm('Are you sure you want to close? Unsaved changes will be lost.')) return;
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-2">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getDomainColor(formData.domain)}`}>
          {getCompanyInitial(formData.name)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-heading">Company Information</h3>
          <p className="text-sm text-muted">Enter the core details about this company</p>
        </div>
      </div>

      <div>
        <label className="form-label">Company Name</label>
        <input
          type="text"
          className={`form-input ${errors.name ? 'border-red-500' : ''}`}
          placeholder="e.g. Tata Consultancy Services"
          value={formData.name}
          onChange={(e) => wizard.updateField('name', e.target.value)}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="form-label">Domain</label>
        <div className="grid grid-cols-2 gap-4">
          {domains.map((d) => (
            <div
              key={d.id}
              onClick={() => wizard.updateField('domain', d.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                formData.domain === d.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-surface hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-1">{d.icon}</div>
              <div className="font-semibold text-heading text-sm">{d.name}</div>
              <div className="text-xs text-muted">{d.desc}</div>
              {formData.domain === d.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.domain && <p className="text-xs text-red-500 mt-1">{errors.domain}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="form-label mb-0">About Company</label>
          <span className="text-xs text-muted">{formData.about.length} / 500</span>
        </div>
        <textarea
          className={`form-input min-h-[120px] ${errors.about ? 'border-red-500' : ''}`}
          placeholder="Describe what the company does..."
          maxLength={500}
          value={formData.about}
          onChange={(e) => wizard.updateField('about', e.target.value)}
        />
        {errors.about && <p className="text-xs text-red-500 mt-1">{errors.about}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Job Role</label>
          <input
            type="text"
            className={`form-input ${errors.job_role ? 'border-red-500' : ''}`}
            placeholder="e.g. Software Engineer"
            value={formData.job_role}
            onChange={(e) => wizard.updateField('job_role', e.target.value)}
          />
          {errors.job_role && <p className="text-xs text-red-500 mt-1">{errors.job_role}</p>}
        </div>
        <div>
          <label className="form-label">Salary (LPA)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
            <input
              type="number"
              className={`form-input pl-7 pr-12 ${errors.salary_lpa ? 'border-red-500' : ''}`}
              placeholder="6.5"
              value={formData.salary_lpa}
              onChange={(e) => wizard.updateField('salary_lpa', e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-semibold">LPA</span>
          </div>
          {errors.salary_lpa && <p className="text-xs text-red-500 mt-1">{errors.salary_lpa}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Eligibility Criteria</label>
        <textarea
          className={`form-input min-h-[80px] ${errors.eligibility_criteria ? 'border-red-500' : ''}`}
          placeholder="e.g. 60% throughout, No active backlogs..."
          value={formData.eligibility_criteria}
          onChange={(e) => wizard.updateField('eligibility_criteria', e.target.value)}
        />
        {errors.eligibility_criteria && <p className="text-xs text-red-500 mt-1">{errors.eligibility_criteria}</p>}
      </div>

      <div>
        <label className="form-label">Bond Details</label>
        <input
          type="text"
          className={`form-input ${errors.bond_details ? 'border-red-500' : ''}`}
          placeholder="e.g. No Bond / 2 Year Service Bond"
          value={formData.bond_details}
          onChange={(e) => wizard.updateField('bond_details', e.target.value)}
        />
        {errors.bond_details && <p className="text-xs text-red-500 mt-1">{errors.bond_details}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Joining Location</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Pune / Bangalore"
            value={formData.joining_location}
            onChange={(e) => wizard.updateField('joining_location', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Tentative Date</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. March 2025"
            value={formData.tentative_date}
            onChange={(e) => wizard.updateField('tentative_date', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getDomainColor(formData.domain)}`}>
          {getCompanyInitial(formData.name)}
        </div>
        <div>
          <div className="font-bold text-heading">{formData.name}</div>
          <div className="text-xs text-muted">{formData.job_role}</div>
        </div>
      </div>

      <section>
        <div className="mb-4">
          <h3 className="font-bold text-heading">Group Discussion Questions</h3>
          <p className="text-xs text-muted">Questions asked in the GD/PI round</p>
        </div>
        <div className="space-y-3">
          {formData.gd_questions.map((q, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                {i + 1}
              </div>
              <input
                type="text"
                className="form-input flex-1"
                placeholder="Type a GD question..."
                value={q}
                onChange={(e) => wizard.updateListItem('gd_questions', i, e.target.value)}
              />
              {formData.gd_questions.length > 1 && (
                <button 
                  onClick={() => wizard.removeListItem('gd_questions', i)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {formData.gd_questions.length < 20 && (
            <button
              onClick={() => wizard.addListItem('gd_questions')}
              className="w-full py-2 border-2 border-dashed border-border rounded-xl text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add GD Question
            </button>
          )}
        </div>
        {errors.gd_questions && <p className="text-xs text-red-500 mt-2">{errors.gd_questions}</p>}
      </section>

      <section>
        <div className="mb-4">
          <h3 className="font-bold text-heading">Interview Questions</h3>
          <p className="text-xs text-muted">Technical and HR questions from interview rounds</p>
        </div>
        <div className="space-y-3">
          {formData.interview_questions.map((q, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                {i + 1}
              </div>
              <input
                type="text"
                className="form-input flex-1"
                placeholder="Type an interview question..."
                value={q}
                onChange={(e) => wizard.updateListItem('interview_questions', i, e.target.value)}
              />
              {formData.interview_questions.length > 1 && (
                <button 
                  onClick={() => wizard.removeListItem('interview_questions', i)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {formData.interview_questions.length < 30 && (
            <button
              onClick={() => wizard.addListItem('interview_questions')}
              className="w-full py-2 border-2 border-dashed border-border rounded-xl text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Interview Question
            </button>
          )}
        </div>
        {errors.interview_questions && <p className="text-xs text-red-500 mt-2">{errors.interview_questions}</p>}
      </section>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getDomainColor(formData.domain)}`}>
          {getCompanyInitial(formData.name)}
        </div>
        <div className="font-bold text-heading">{formData.name}</div>
      </div>

      <section>
        <label className="form-label">Required Skills & Technologies</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="e.g. Python, React, SQL..."
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                wizard.addTechRequirement(techInput);
                setTechInput('');
              }
            }}
          />
          <button
            onClick={() => {
              wizard.addTechRequirement(techInput);
              setTechInput('');
            }}
            className="btn btn-secondary px-4"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tech_requirements.map((skill) => (
            <span key={skill} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-primary/20">
              {skill}
              <button onClick={() => wizard.removeTechRequirement(skill)} className="hover:text-danger">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {formData.tech_requirements.length === 0 && (
            <div className="text-sm text-muted italic">No skills added yet</div>
          )}
        </div>
        {errors.tech_requirements && <p className="text-xs text-red-500 mt-2">{errors.tech_requirements}</p>}
      </section>

      <section>
        <label className="form-label">Package Breakdown</label>
        <textarea
          className={`form-input min-h-[100px] font-mono text-sm ${errors.package_details ? 'border-red-500' : ''}`}
          placeholder="e.g. CTC: 4.5 LPA\nTake Home: ~32,000/month..."
          value={formData.package_details}
          onChange={(e) => wizard.updateField('package_details', e.target.value)}
        />
        {errors.package_details && <p className="text-xs text-red-500 mt-1">{errors.package_details}</p>}
      </section>

      <section>
        <div className="mb-4">
          <h3 className="font-bold text-heading">Selection Process</h3>
          <p className="text-xs text-muted">Add each round in order</p>
        </div>
        <div className="space-y-3">
          {formData.selection_rounds.map((r, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface border border-border text-muted text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                {i + 1}
              </div>
              <input
                type="text"
                className="form-input flex-1"
                placeholder="e.g. Online Aptitude Test"
                value={r}
                onChange={(e) => wizard.updateListItem('selection_rounds', i, e.target.value)}
              />
              <button 
                onClick={() => wizard.removeListItem('selection_rounds', i)}
                className="p-2 text-danger hover:bg-danger/10 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          <div className="space-y-3">
            <button
              onClick={() => wizard.addListItem('selection_rounds')}
              className="w-full py-2 border-2 border-dashed border-border rounded-xl text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Round
            </button>
            
            <div className="flex flex-wrap gap-2">
              {presetRounds.map((round) => (
                <button
                  key={round}
                  onClick={() => {
                    const newList = [...formData.selection_rounds.filter(r => r.trim()), round];
                    wizard.updateField('selection_rounds', newList);
                  }}
                  disabled={formData.selection_rounds.includes(round)}
                  className="px-3 py-1 rounded-full border border-border text-[10px] uppercase tracking-wider font-bold text-muted hover:border-primary hover:text-primary disabled:opacity-50 disabled:bg-surface transition-colors"
                >
                  + {round}
                </button>
              ))}
            </div>
          </div>
        </div>
        {errors.selection_rounds && <p className="text-xs text-red-500 mt-2">{errors.selection_rounds}</p>}
      </section>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-heading">Add New Company</h2>
            <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-heading">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="px-12 pb-6 relative">
            <div className="absolute top-4 left-16 right-16 h-0.5 bg-border -z-0">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
              />
            </div>
            
            <div className="flex justify-between relative z-10">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-primary border-primary text-white' :
                    currentStep === step ? 'bg-surface border-primary text-primary' :
                    'bg-surface border-border text-muted'
                  }`}>
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    currentStep === step ? 'text-primary' : 'text-muted'
                  }`}>
                    Step {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-border px-8 py-4 flex items-center justify-between">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button 
                onClick={wizard.goBack}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={wizard.saveDraft}
              disabled={isSavingDraft || !formData.name}
              className="text-primary text-sm font-semibold hover:underline disabled:opacity-50"
            >
              {isSavingDraft ? 'Saving...' : 'Save as Draft'}
            </button>
            
            {currentStep < 3 ? (
              <button 
                onClick={wizard.goNext}
                className="btn-primary flex items-center gap-2 px-8"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={wizard.submitForm}
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 px-8"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit for Approval'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
