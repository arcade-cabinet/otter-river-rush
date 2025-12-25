import React, { lazy, Suspense } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { ErrorBoundary } from './ErrorBoundary';

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

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <ErrorBoundary
        fallback={
          <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-white p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-4">
              We're having trouble loading the game. This might be due to a poor
              network connection.
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
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-white">
              Loading...
            </div>
          }
        >
          {status !== 'menu' && <GameCanvas showStats={import.meta.env.DEV} />}

          {status === 'menu' && <MainMenu />}
          {(status === 'playing' || status === 'paused') && <GameHUD />}
          {status === 'game_over' && <GameOver />}

          {status === 'paused' && (
            <div
              id="pauseScreen"
              className="fixed inset-0 flex items-center justify-center pointer-events-auto game-bg-overlay z-50"
            >
              <div className="otter-panel w-full max-w-sm splash-in">
                <h2 className="otter-subtitle text-center mb-6">⏸️ Paused</h2>
                <div className="space-y-3">
                  <button
                    id="resumeButton"
                    onClick={() => useGameStore.getState().resumeGame()}
                    className="otter-btn otter-btn-primary w-full"
                  >
                    ▶️ Resume
                  </button>
                  <button
                    id="quitButton"
                    onClick={() => useGameStore.getState().returnToMenu()}
                    className="otter-btn otter-btn-secondary w-full"
                  >
                    🏠 River Bank
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
