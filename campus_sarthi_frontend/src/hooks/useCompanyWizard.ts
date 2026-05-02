import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export interface CompanyWizardData {
  id?: number;
  name: string;
  domain: 'CS' | 'Cyber' | 'Product' | 'Sales' | '';
  about: string;
  job_role: string;
  salary_lpa: string;
  eligibility_criteria: string;
  bond_details: string;
  joining_location: string;
  tentative_date: string;
  gd_questions: string[];
  interview_questions: string[];
  tech_requirements: string[];
  package_details: string;
  selection_rounds: string[];
}

const initialData: CompanyWizardData = {
  name: '',
  domain: '',
  about: '',
  job_role: '',
  salary_lpa: '',
  eligibility_criteria: '',
  bond_details: '',
  joining_location: '',
  tentative_date: '',
  gd_questions: [''],
  interview_questions: [''],
  tech_requirements: [],
  package_details: '',
  selection_rounds: [''],
};

export function useCompanyWizard(onSuccess?: () => void) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompanyWizardData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const { showToast } = useToast();

  const updateField = (field: keyof CompanyWizardData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addListItem = (field: 'gd_questions' | 'interview_questions' | 'selection_rounds') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field: 'gd_questions' | 'interview_questions' | 'selection_rounds', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (field: 'gd_questions' | 'interview_questions' | 'selection_rounds', index: number, value: string) => {
    setFormData(prev => {
      const newList = [...prev[field]];
      newList[index] = value;
      return { ...prev, [field]: newList };
    });
  };

  const addTechRequirement = (skill: string) => {
    if (skill && !formData.tech_requirements.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        tech_requirements: [...prev.tech_requirements, skill]
      }));
    }
  };

  const removeTechRequirement = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      tech_requirements: prev.tech_requirements.filter(s => s !== skill)
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Company name is required';
      if (!formData.domain) newErrors.domain = 'Domain is required';
      if (!formData.about) newErrors.about = 'About is required';
      if (!formData.job_role) newErrors.job_role = 'Job role is required';
      if (!formData.salary_lpa) newErrors.salary_lpa = 'Salary is required';
      if (!formData.eligibility_criteria) newErrors.eligibility_criteria = 'Eligibility is required';
      if (!formData.bond_details) newErrors.bond_details = 'Bond details required';
    } else if (step === 2) {
      if (!formData.gd_questions.some(q => q.trim())) newErrors.gd_questions = 'At least one GD question is required';
      if (!formData.interview_questions.some(q => q.trim())) newErrors.interview_questions = 'At least one Interview question is required';
    } else if (step === 3) {
      if (formData.tech_requirements.length === 0) newErrors.tech_requirements = 'At least one skill is required';
      if (!formData.package_details) newErrors.package_details = 'Package details are required';
      if (!formData.selection_rounds.some(r => r.trim())) newErrors.selection_rounds = 'At least one selection round is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const saveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const payload = { ...formData, id: draftId || formData.id };
      const res = await api.post('/api/admin/companies/draft/', payload);
      setDraftId(res.data.id);
      showToast('Draft saved successfully', 'success');
    } catch (err) {
      showToast('Failed to save draft', 'error');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const submitForm = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      showToast('Please fix validation errors in all steps', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/api/admin/companies/', formData);
      showToast(`${formData.name} submitted for approval`, 'success');
      if (onSuccess) onSuccess();
      return res.data;
    } catch (err: any) {
      if (err.response?.data?.step) {
        setCurrentStep(err.response.data.step);
        setErrors(err.response.data.errors);
      }
      showToast('Failed to submit company', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resumeDraft = (draftData: CompanyWizardData) => {
    setFormData(draftData);
    setDraftId(draftData.id || null);
    setCurrentStep(1);
  };

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isSavingDraft,
    updateField,
    addListItem,
    removeListItem,
    updateListItem,
    addTechRequirement,
    removeTechRequirement,
    goNext,
    goBack,
    saveDraft,
    submitForm,
    resumeDraft
  };
}
