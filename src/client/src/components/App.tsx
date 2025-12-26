import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingScreen } from './ui/LoadingScreen';

// Constants for loading simulation
const LOAD_INTERVAL_MS = 100;
const MIN_INCREMENT = 20;
const MAX_RANDOM_INCREMENT = 10;
const READY_DELAY_MS = 200;
// Lazy load game and UI components for better bundle splitting
const GameCanvas = lazy(() =>
  import('./game/GameCanvas').then((m) => ({ default: m.GameCanvas }))
);
const GameHUD = lazy(() =>
  import('./ui/GameHUD').then((m) => ({ default: m.GameHUD }))
);
const GameOver = lazy(() =>
  import('./ui/GameOver').then((m) => ({ default: m.GameOver }))
);
const MainMenu = lazy(() =>
  import('./ui/MainMenu').then((m) => ({ default: m.MainMenu }))
);

export function App(): React.JSX.Element {
  const { status } = useGameStore();
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Simulate initial load progress and mark ready after a brief initialization
  useEffect(() => {
    let progress = 0;
    let isMounted = true;
    let readyTimeout: NodeJS.Timeout;

    const interval = setInterval(() => {
      // Use smoother progress increments
      progress += MIN_INCREMENT + Math.random() * MAX_RANDOM_INCREMENT;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Small delay to ensure everything is mounted before hiding loading screen
        if (isMounted) {
          readyTimeout = setTimeout(() => {
            if (isMounted) {
              setIsReady(true);
            }
          }, READY_DELAY_MS);
        }
      }

      if (isMounted) {
        setLoadProgress(Math.min(progress, 100));
      }
    }, LOAD_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (readyTimeout) {
        clearTimeout(readyTimeout);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <ErrorBoundary
        fallback={
          <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="text-6xl mb-4">🦦</div>
            <h2 className="text-2xl font-bold mb-4">⚠️ Game Error</h2>
            <p className="mb-4 text-slate-300 max-w-md">
              Something went wrong! We're having trouble loading the game. This
              might be due to a poor network connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="otter-btn otter-btn-primary"
            >
              Reload Page
            </button>
          </div>
        }
      >
        {!isReady && <LoadingScreen progress={loadProgress} />}
        <Suspense fallback={<LoadingScreen progress={loadProgress} />}>
          {/* Always render GameCanvas for instant scene readiness */}
          <GameCanvas showStats={import.meta.env.DEV} />

          {/* UI overlays */}
          {isReady && status === 'menu' && <MainMenu />}
          {(status === 'playing' || status === 'paused') && <GameHUD />}
          {status === 'game_over' && <GameOver />}

          {status === 'paused' && (
            <div
              id="pauseScreen"
              className="fixed inset-0 flex items-center justify-center pointer-events-auto game-bg-overlay z-50"
            >
              <div className="otter-panel w-full max-w-sm mx-4 splash-in">
                <h2 className="otter-subtitle text-center mb-6">Paused</h2>
                <div className="space-y-3">
                  <button
                    id="resumeButton"
                    onClick={() => useGameStore.getState().resumeGame()}
                    className="otter-btn otter-btn-primary w-full"
                  >
                    Resume
                  </button>
                  <button
                    id="quitButton"
                    onClick={() => useGameStore.getState().returnToMenu()}
                    className="otter-btn otter-btn-secondary w-full"
                  >
                    River Bank
                  </button>
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
