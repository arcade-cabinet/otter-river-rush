/**
 * Otter River Rush - Embeddable Game Component
 *
 * This component can be imported and embedded in other React applications.
 * Uses @jbcom/strata for unified 3D graphics.
 *
 * @example
 * ```tsx
 * import { OtterRiverRush } from '@jbcom/otter-river-rush';
 *
 * function App() {
 *   return (
 *     <OtterRiverRush
 *       width="100%"
 *       height={600}
 *       onGameOver={(score) => console.log('Game over:', score)}
 *     />
 *   );
 * }
 * ```
 */

import React, { useEffect, useMemo } from 'react';
import { App } from './components/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameSettingsProvider } from './contexts/GameSettingsContext';
import { useGameStore } from './hooks/useGameStore';
import { audio } from './utils/audio';
import './style.css';

export interface OtterRiverRushProps {
  /** Width of the game container (CSS value or number for pixels) */
  width?: string | number;
  /** Height of the game container (CSS value or number for pixels) */
  height?: string | number;
  /** Callback when game ends */
  onGameOver?: (score: number) => void;
  /** Callback when score changes */
  onScoreChange?: (score: number) => void;
  /** Show debug stats overlay */
  showStats?: boolean;
  /** Initial audio volume (0-1) */
  volume?: number;
  /** Custom class name for container */
  className?: string;
}

/**
 * Otter River Rush - Embeddable React Component
 *
 * A complete endless runner game built with React Three Fiber and @jbcom/strata.
 */
export function OtterRiverRush({
  width = '100%',
  height = '100vh',
  onGameOver,
  onScoreChange,
  showStats = false,
  volume = 0.7,
  className = '',
}: OtterRiverRushProps): React.JSX.Element {
  // Memoize settings to avoid unnecessary re-renders
  const gameSettings = useMemo(() => ({ showStats }), [showStats]);
  // Initialize audio on mount
  useEffect(() => {
    audio.preload();
    audio.setVolume(volume);
  }, [volume]);

  // Subscribe to game events
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      // Game over callback
      if (state.status === 'game_over' && prevState.status !== 'game_over') {
        onGameOver?.(state.score);
      }

      // Score change callback
      if (state.score !== prevState.score) {
        onScoreChange?.(state.score);
      }
    });

    return unsubscribe;
  }, [onGameOver, onScoreChange]);

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <ErrorBoundary>
      <GameSettingsProvider settings={gameSettings}>
        <div
          className={`otter-river-rush-container ${className}`}
          style={containerStyle}
          onClick={() => audio.init()}
        >
          <App />
        </div>
      </GameSettingsProvider>
    </ErrorBoundary>
  );
}

// Re-export types
export type { GameState, GameStatus } from './types/game-types';

// Export store for advanced usage
export { useGameStore } from './hooks/useGameStore';

// Export audio controls
export { audio } from './utils/audio';

export default OtterRiverRush;
