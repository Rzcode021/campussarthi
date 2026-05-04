export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 animate-pulse"
      style={{ background: '#141B2D', border: '1px solid #1E2A45' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl flex-shrink-0" style={{ background: '#1E2A45' }} />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 rounded w-3/4" style={{ background: '#1E2A45' }} />
          <div className="h-2.5 rounded w-1/2" style={{ background: '#1A2236' }} />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-2.5 rounded w-full" style={{ background: '#1A2236' }} />
        <div className="h-2.5 rounded w-5/6" style={{ background: '#1A2236' }} />
      </div>
      <div className="h-7 rounded-xl w-1/3" style={{ background: '#1E2A45' }} />
    </div>
  );
}
