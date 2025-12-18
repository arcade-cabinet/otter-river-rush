import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameSettingsProvider } from './contexts/GameSettingsContext';
import './style.css';

/**
 * Main entry point - React Three Fiber game
 */

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure index.html has <div id="app"></div>'
  );
}

const root = createRoot(rootElement);

// In dev mode, show debug stats
const showStats = import.meta.env.DEV;

root.render(
  <StrictMode>
    <ErrorBoundary>
      <GameSettingsProvider settings={{ showStats }}>
        <App />
      </GameSettingsProvider>
    </ErrorBoundary>
  </StrictMode>
);

// Development mode helpers
console.warn('🦦 Otter River Rush - React Three Fiber Edition');
console.warn('📊 Development Mode Active');
console.warn(
  '🎮 Game State: window.__gameStore | Debug Tools: window.__debugTools'
);

// Extend Window interface for game debugging
declare global {
  interface Window {
    __gameStore?: typeof import('./hooks/useGameStore').useGameStore;
    __debugTools?: typeof import('./utils/debug-tools').debugTools;
  }
}

// Expose game store and debug tools for debugging (always, for E2E tests)
import('./hooks/useGameStore').then(({ useGameStore }) => {
  window.__gameStore = useGameStore;
});

// Load debug tools
import('./utils/debug-tools').then(({ debugTools }) => {
  window.__debugTools = debugTools;
});

// Preload audio
import('./utils/audio').then(({ audio }) => {
  audio.preload();
  // Unlock on first user interaction
  const unlockAudio = () => {
    audio.init();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });
});
