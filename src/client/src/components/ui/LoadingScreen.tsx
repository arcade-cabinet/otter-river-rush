import React from 'react';

interface LoadingScreenProps {
  progress: number;
}

/**
 * LoadingScreen Component
 * Displays a progress bar and animated otter mascot during initial load
 */
export function LoadingScreen({
  progress,
}: LoadingScreenProps): React.JSX.Element {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 z-[100]">
      <div className="text-center space-y-4 px-6">
        <div className="text-6xl mb-4 otter-bounce">🦦</div>
        <h1 className="otter-title text-2xl md:text-3xl">Otter River Rush</h1>
        <div className="w-64 max-w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-blue-300 text-sm">
          {progress < 100 ? 'Preparing the river...' : 'Ready to splash!'}
        </p>
      </div>
    </div>
  );
}
