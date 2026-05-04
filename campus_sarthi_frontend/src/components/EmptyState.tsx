interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4" style={{ color: '#1E2A45' }}>{icon}</div>
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs max-w-xs" style={{ color: '#475569' }}>{subtitle}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
