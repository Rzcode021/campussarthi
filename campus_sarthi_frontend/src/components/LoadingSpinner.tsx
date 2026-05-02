import React from 'react';

const LoadingSpinner: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-surface border-t-primary rounded-full animate-spin"></div>
      <p className="text-muted font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
