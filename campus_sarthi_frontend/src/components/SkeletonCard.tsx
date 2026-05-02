import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white border border-border rounded-xl p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-border flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border rounded w-3/4" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-border rounded w-full" />
        <div className="h-3 bg-border rounded w-5/6" />
      </div>
      <div className="mt-4 h-8 bg-border rounded-lg w-1/3" />
    </div>
  );
}
