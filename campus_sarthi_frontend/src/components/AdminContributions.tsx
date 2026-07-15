import { useEffect, useState, useCallback } from 'react';
import { Check, X, Building2, Sparkles, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';
import { useAppStore } from '../store/useAppStore';

interface Contribution {
  id: number;
  company_name: string;
  contributor_name: string;
  contribution_type: string;
  content: string;
  status: string;
  created_at: string;
}

const POLL_INTERVAL = 15_000; // 15 seconds

export default function AdminContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Also subscribe to store contributions for instant updates when user submits
  const storeContributions = useAppStore(state => state.contributions);

  const fetchContributions = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await adminApi.getContributions();
      setContributions(res.data as any);
    } catch {
      if (!silent) showToast('Failed to fetch contributions', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchContributions();
    // Poll every 15s for realtime updates
    const interval = setInterval(() => fetchContributions(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchContributions]);

  // Re-fetch when store contributions change (immediate sync after user submits)
  useEffect(() => {
    fetchContributions(true);
  }, [storeContributions.length, fetchContributions]);

  const handleApprove = async (id: number) => {
    try {
      await adminApi.approveContribution(id);
      showToast('Contribution approved and merged!', 'success');
      setContributions(prev => prev.filter(c => c.id !== id));
    } catch {
      showToast('Approval failed', 'error');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminApi.rejectContribution(id);
      showToast('Contribution rejected', 'info');
      setContributions(prev => prev.filter(c => c.id !== id));
    } catch {
      showToast('Rejection failed', 'error');
    }
  };

  if (isLoading) return <div className="py-12 text-center text-muted">Loading contributions...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-heading text-lg flex items-center gap-2">
          <Sparkles size={20} className="text-amber-500" />
          Pending Content Contributions
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchContributions()}
            title="Refresh"
            className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 transition-all"
          >
            <RefreshCw size={14} />
          </button>
          <span className="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100">
            {contributions.length} Pending Review
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {contributions.map((c) => (
          <div key={c.id} className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-sm">{c.company_name}</h3>
                  <p className="text-[11px] text-muted">By {c.contributor_name} · {new Date(c.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                {c.contribution_type.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="p-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-body whitespace-pre-wrap font-mono mb-6">
                {c.content}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle size={14} />
                  <span className="text-[11px] font-medium">Review carefully before merging into official data.</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(c.id)}
                    className="btn-danger py-2 px-4 text-xs flex items-center gap-1.5"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(c.id)}
                    className="bg-success text-white py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                  >
                    <Check size={14} /> Approve & Merge
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {contributions.length === 0 && (
          <div className="py-20 text-center text-muted card border-dashed">
            <Info size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm font-medium">No pending contributions at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
