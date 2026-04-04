import React from "react";

/**
 * @component LoadingPulse
 * @description A subtle pulse animation to indicate data loading.
 */
export default function LoadingPulse() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-background-alt border border-slate-700/30 rounded-2xl p-6 opacity-60 animate-pulse">
          <div className="h-8 w-24 bg-slate-700/50 rounded mb-4" />
          <div className="h-5 w-48 bg-slate-700/50 rounded mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-800/30">
            {[1, 2, 3].map((j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-12 bg-slate-700/50 rounded" />
                <div className="h-4 w-24 bg-slate-700/50 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
