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

import type React from 'react';
import { useEffect, useMemo } from 'react';
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
  /** Callback when audio initialization fails (for error handling in consuming apps) */
  onAudioError?: (error: Error) => void;
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
  onAudioError,
  showStats = false,
  volume = 0.7,
  className = '',
}: OtterRiverRushProps): React.JSX.Element {
  // Memoize settings to avoid unnecessary re-renders
  const gameSettings = useMemo(() => ({ showStats }), [showStats]);
  // Initialize audio on mount with proper cleanup to prevent memory leaks
  // Split into two effects: one for initialization/cleanup, one for volume changes
  useEffect(() => {
    audio.preload();

    // Cleanup audio resources on unmount to prevent memory leaks
    // This is important for embedded components that may mount/unmount multiple times
    return () => {
      audio.cleanup();
    };
  }, []); // Empty deps - only run on mount/unmount

  // Handle volume changes separately to avoid unnecessary cleanup
  useEffect(() => {
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

  /**
   * Safely initialize audio on user interaction.
   * Wrapped in try-catch to prevent silent failures in embedded contexts.
   * Calls onAudioError callback if provided to notify consuming apps.
   */
  const handleAudioInit = () => {
    try {
      audio.init();
    } catch (error) {
      const audioError =
        error instanceof Error ? error : new Error(String(error));
      console.warn('[OtterRiverRush] Audio initialization failed:', audioError);
      onAudioError?.(audioError);
    }
  };

  return (
    <ErrorBoundary>
      <GameSettingsProvider settings={gameSettings}>
        <div
          className={`otter-river-rush-container ${className}`}
          style={containerStyle}
          onClick={handleAudioInit}
        >
          <App />
        </div>
      </GameSettingsProvider>
    </ErrorBoundary>
  );
}

// Export store for advanced usage
export { useGameStore } from './hooks/useGameStore';
// Re-export types
export type { GameState, GameStatus } from './types/game-types';

// Export audio controls
export { audio } from './utils/audio';

export default OtterRiverRush;
