import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-background border border-border rounded-lg p-4 flex items-center justify-between w-full animate-pulse">
        <div className="flex items-start gap-4 flex-1">
            <div className="w-6 h-6 flex-shrink-0 mt-0.5 rounded-full bg-secondary"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary rounded w-3/4"></div>
                <div className="h-3 bg-secondary rounded w-1/2"></div>
            </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
            <div className="h-8 w-8 bg-secondary rounded-md"></div>
            <div className="h-8 w-8 bg-secondary rounded-md"></div>
            <div className="h-8 w-8 bg-secondary rounded-md"></div>
        </div>
    </div>
  );
};

export default SkeletonLoader;