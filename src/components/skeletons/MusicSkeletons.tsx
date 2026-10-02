import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="flex-shrink-0 w-44 md:w-52 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse">
    <div className="aspect-square w-full rounded-xl bg-white/5 mb-3" />
    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
    <div className="h-3 bg-white/5 rounded w-1/2" />
  </div>
);

export const SongRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 px-3 py-2.5 rounded-xl bg-white/[0.02] animate-pulse">
    <div className="w-6 h-4 bg-white/5 rounded" />
    <div className="w-11 h-11 rounded-lg bg-white/10 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-white/10 rounded w-1/3" />
      <div className="h-3 bg-white/5 rounded w-1/4" />
    </div>
    <div className="w-12 h-3 bg-white/5 rounded hidden sm:block" />
  </div>
);

export const BannerSkeleton: React.FC = () => (
  <div className="w-full h-64 sm:h-80 rounded-3xl bg-white/[0.03] border border-white/5 animate-pulse p-8 flex items-end gap-6">
    <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl bg-white/10 flex-shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-white/10 rounded w-20" />
      <div className="h-8 bg-white/15 rounded w-2/3" />
      <div className="h-4 bg-white/5 rounded w-1/2" />
    </div>
  </div>
);
