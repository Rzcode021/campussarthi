import React, { useEffect, useState } from 'react';
import { Users, MessageSquare } from 'lucide-react';
import { crewApi } from '../services/crewApi';
import type { CrewMember, CrewRating } from '../types/crew';
import StarRating from '../components/StarRating';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

export default function CrewRatingPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [myRatings, setMyRatings] = useState<Record<number, CrewRating>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [selected, setSelected] = useState<{ crewId: number; stars: number; comment: string } | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([crewApi.getAll(), crewApi.getMyRatings()])
      .then(([crewRes, ratingsRes]) => {
        setCrew(crewRes.data);
        setMyRatings(ratingsRes.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const startRating = (crewId: number) => {
    const existing = myRatings[crewId];
    setSelected({ crewId, stars: existing?.stars || 0, comment: existing?.comment || '' });
  };

  const submitRating = async () => {
    if (!selected || selected.stars === 0) {
      showToast('Please select a star rating.', 'error');
      return;
    }
    setSubmitting(selected.crewId);
    try {
      const res = await crewApi.submitRating(selected.crewId, {
        stars: selected.stars,
        comment: selected.comment,
      });
      setCrew((prev) => prev.map((c) => c.id === selected.crewId ? res.data : c));
      setMyRatings((prev) => ({
        ...prev,
        [selected.crewId]: { stars: selected.stars, comment: selected.comment, updated_at: new Date().toISOString() },
      }));
      setSelected(null);
      showToast('Rating submitted!', 'success');
    } catch {
      showToast('Failed to submit rating.', 'error');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Crew Rating</h1>
        <p className="text-sm text-muted mt-0.5">Rate your placement coordinators to help them improve</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-border" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-border rounded w-2/3" />
                  <div className="h-3 bg-border rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : crew.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crew.map((member) => {
            const myRating = myRatings[member.id];
            const isSelected = selected?.crewId === member.id;

            return (
              <div key={member.id} className="card p-6">
                {/* Member Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary-light text-primary font-bold text-lg flex items-center justify-center flex-shrink-0">
                    {member.user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-heading text-base">{member.user.full_name}</h3>
                    <p className="text-xs text-muted">{member.title}</p>
                    <p className="text-xs text-muted mt-0.5">{member.department}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-3">{member.bio}</p>

                {/* Overall Rating */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-surface rounded-lg border border-border">
                  <StarRating value={Math.round(member.avg_rating)} readonly size={16} />
                  <span className="text-sm font-medium text-body">{member.avg_rating.toFixed(1)}</span>
                  <span className="text-xs text-muted">({member.total_ratings} ratings)</span>
                </div>

                {/* My Rating */}
                {myRating && !isSelected && (
                  <div className="text-xs text-muted mb-3 flex items-center gap-2">
                    <StarRating value={myRating.stars} readonly size={13} />
                    <span>Your rating: {myRating.stars}/5</span>
                  </div>
                )}

                {/* Rating Form */}
                {isSelected ? (
                  <div className="space-y-3 border-t border-border pt-4">
                    <div>
                      <p className="text-xs font-medium text-body mb-2">Your Rating</p>
                      <StarRating
                        value={selected.stars}
                        onChange={(v) => setSelected({ ...selected, stars: v })}
                      />
                    </div>
                    <textarea
                      className="form-input text-xs resize-none"
                      rows={2}
                      placeholder="Optional: share your feedback..."
                      value={selected.comment}
                      onChange={(e) => setSelected({ ...selected, comment: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(null)} className="btn-secondary flex-1 text-xs py-1.5">Cancel</button>
                      <button
                        onClick={submitRating}
                        disabled={submitting === member.id}
                        className="btn-primary flex-1 text-xs py-1.5 flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        {submitting === member.id
                          ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : null}
                        Submit
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startRating(member.id)}
                    className="btn-ghost w-full text-xs flex items-center justify-center gap-1.5 py-2 border border-border hover:border-primary rounded-lg"
                  >
                    <MessageSquare size={13} />
                    {myRating ? 'Update Rating' : 'Rate this Crew Member'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={<Users size={48} />} title="No crew members" subtitle="Crew members will appear here once added." />
      )}
    </div>
  );
}
