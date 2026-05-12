'use client';

import React from 'react';

interface ProgressIndicatorProps {
  stage: number;
}

const STAGES = [
  'Gathering symptoms',
  'Understanding context',
  'Analysing',
  'Advice ready'
];

export default function ProgressIndicator({ stage }: ProgressIndicatorProps) {
  // stage is 1-indexed from backend
  const progress = Math.min((stage / 4) * 100, 100);
  const currentLabel = STAGES[Math.max(0, stage - 1)];

  return (
    <div className="w-full px-4 pt-2 pb-1 bg-[#F9F8F6]/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
          {currentLabel}
        </span>
        <span className="text-[10px] font-bold text-emerald-800 tracking-wider">
          {stage}/4
        </span>
      </div>
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
