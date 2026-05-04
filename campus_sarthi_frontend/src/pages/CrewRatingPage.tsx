import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, ArrowLeft, CheckCircle2, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { crewApi } from '../services/crewApi';
import type { CrewMember } from '../types/crew';

// Local interface for mock ratings
interface LocalRating {
  crewId: number;
  stars: number;
}

export default function CrewRatingPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [localRatings, setLocalRatings] = useState<LocalRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [selectedCrew, setSelectedCrew] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // UI State
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if they already rated this session
    if (localStorage.getItem('crew_rated_session')) {
      setHasSubmitted(true);
    }

    crewApi.getAllPublic()
      .then((res) => setCrew(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const isFormValid = name.trim() !== '' && year !== '' && branch.trim() !== '' && selectedCrew !== '' && rating > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || hasSubmitted) return;

    // Save to local mock state
    const newRating: LocalRating = {
      crewId: parseInt(selectedCrew),
      stars: rating,
    };
    setLocalRatings((prev) => [...prev, newRating]);

    // Mark session
    localStorage.setItem('crew_rated_session', 'true');
    setHasSubmitted(true);
    setShowSuccess(true);

    // Reset form
    setName('');
    setYear('');
    setBranch('');
    setSelectedCrew('');
    setRating(0);
    setComment('');

    // Hide success message after 4s
    setTimeout(() => setShowSuccess(false), 4000);
  };

  // Helper to calculate displayed rating (real + mock)
  const getDisplayStats = (member: CrewMember) => {
    const memberMockRatings = localRatings.filter((r) => r.crewId === member.id);
    if (memberMockRatings.length === 0) {
      return { avg: member.avg_rating, total: member.total_ratings };
    }
    
    const totalStars = (member.avg_rating * member.total_ratings) + memberMockRatings.reduce((sum, r) => sum + r.stars, 0);
    const totalCount = member.total_ratings + memberMockRatings.length;
    return {
      avg: totalStars / totalCount,
      total: totalCount
    };
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0B0B0B' }}>
      {/* Background glow effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.08) 0%, transparent 70%)' }} />
      
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors duration-200" style={{ color: '#6B7280' }} onMouseEnter={e => e.currentTarget.style.color = '#FFD700'} onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Rate Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>Crew</span>
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#9CA3AF' }}>
            Help us improve the placement experience by leaving anonymous feedback for your coordinators.
          </p>
        </div>

        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto rounded-3xl p-8 md:p-10 mb-16"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,215,0,0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
                <p style={{ color: '#9CA3AF' }}>Your feedback has been submitted successfully.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-6" exit={{ opacity: 0 }}>
                {hasSubmitted && (
                  <div className="p-4 rounded-xl mb-6 text-sm" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
                    You have already submitted a rating during this session.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>Full Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                      disabled={hasSubmitted}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>Year</label>
                    <select
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                      disabled={hasSubmitted}
                    >
                      <option value="" disabled style={{ color: '#6B7280', background: '#0B0B0B' }}>Select Year</option>
                      <option value="1st" style={{ background: '#0B0B0B' }}>1st Year</option>
                      <option value="2nd" style={{ background: '#0B0B0B' }}>2nd Year</option>
                      <option value="3rd" style={{ background: '#0B0B0B' }}>3rd Year</option>
                      <option value="4th" style={{ background: '#0B0B0B' }}>4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>Branch</label>
                    <input
                      type="text"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      placeholder="e.g. Computer Science"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                      disabled={hasSubmitted}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>Crew Member</label>
                    <select
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      value={selectedCrew}
                      onChange={(e) => setSelectedCrew(e.target.value)}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                      disabled={hasSubmitted || isLoading}
                    >
                      <option value="" disabled style={{ color: '#6B7280', background: '#0B0B0B' }}>
                        {isLoading ? 'Loading crew...' : 'Select Crew Member'}
                      </option>
                      {crew.map(member => (
                        <option key={member.id} value={member.id} style={{ background: '#0B0B0B' }}>
                          {member.user.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-3" style={{ color: '#9CA3AF' }}>Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        disabled={hasSubmitted}
                        className="p-1 transition-transform hover:scale-110 disabled:hover:scale-100"
                      >
                        <Star
                          size={28}
                          fill={star <= rating ? '#FFD700' : 'transparent'}
                          color={star <= rating ? '#FFD700' : '#4B5563'}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>Comment (Optional)</label>
                  <textarea
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    placeholder="Share your experience..."
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    disabled={hasSubmitted}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid || hasSubmitted}
                  whileHover={(!isFormValid || hasSubmitted) ? {} : { scale: 1.02 }}
                  whileTap={(!isFormValid || hasSubmitted) ? {} : { scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#0B0B0B',
                    boxShadow: (!isFormValid || hasSubmitted) ? 'none' : '0 0 20px rgba(255,215,0,0.3)',
                  }}
                >
                  Submit Rating
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Display Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 text-center">Crew Members</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl p-6 h-32 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          ) : crew.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...crew]
                .sort((a, b) => a.user.full_name.localeCompare(b.user.full_name))
                .map((member) => {
                  const stats = getDisplayStats(member);
                  
                  // Find max rating globally to highlight
                  const maxRating = Math.max(...crew.map(c => getDisplayStats(c).avg));
                  const isTopRated = stats.avg === maxRating && maxRating > 0;

                  return (
                    <motion.div
                      key={member.id}
                      whileHover={{ y: -4 }}
                      className="relative rounded-2xl p-6 flex flex-col items-center text-center transition-colors"
                      style={{
                        background: isTopRated ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.03)',
                        border: isTopRated ? '1px solid rgba(255,215,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isTopRated ? '0 0 24px rgba(255,215,0,0.25)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isTopRated) e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isTopRated) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }}
                    >
                      {isTopRated && (
                        <div
                          className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                          style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0B0B0B' }}
                          title="Highest Rated Crew Member"
                        >
                          <Crown size={16} />
                        </div>
                      )}
                      
                      <div className="w-16 h-16 rounded-full mb-4 overflow-hidden" style={{ border: isTopRated ? '2px solid #FFD700' : '1px solid rgba(255,215,0,0.2)' }}>
                        <img
                          src={member.user.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.full_name)}&background=FFD700&color=0B0B0B&size=128&bold=true`}
                          alt={member.user.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{member.user.full_name}</h3>
                      <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>{member.title}</p>
                      
                      <div className="flex items-center gap-1.5 mt-auto">
                        <Star size={16} fill="#FFD700" color="#FFD700" />
                        <span className="font-bold text-white">{stats.avg.toFixed(1)}</span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>({stats.total} reviews)</span>
                      </div>
                    </motion.div>
                  );
              })}
            </div>
          ) : (
            <div className="text-center py-12" style={{ color: '#6B7280' }}>
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No crew members found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
