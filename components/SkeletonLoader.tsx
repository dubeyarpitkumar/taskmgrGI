import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-card/50 p-5 rounded-xl shadow-lg border border-border/50 animate-pulse">
      <div className="h-4 bg-secondary rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-secondary rounded w-full mb-2"></div>
      <div className="h-3 bg-secondary rounded w-full mb-2"></div>
      <div className="h-3 bg-secondary rounded w-1/2 mb-4"></div>
      <div className="flex items-center justify-between mt-4 border-t border-border pt-3">
        <div className="h-3 bg-secondary rounded w-1/4"></div>
        <div className="w-8 h-8 bg-secondary rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
