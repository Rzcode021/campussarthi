import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-border mb-4">{icon}</div>
      <h3 className="text-base font-medium text-body mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-xs">{subtitle}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
