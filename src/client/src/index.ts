/**
 * @jbcom/otter-river-rush
 * 
 * Fast-paced river racing game with procedural level generation.
 * Built with React Three Fiber and @jbcom/strata.
 * 
 * @example
 * ```tsx
 * import { OtterRiverRush } from '@jbcom/otter-river-rush';
 * 
 * <OtterRiverRush 
 *   width="100%" 
 *   height={600}
 *   onGameOver={(score) => console.log('Score:', score)}
 * />
 * ```
 */

// Main embeddable component
export { OtterRiverRush, type OtterRiverRushProps } from './OtterRiverRush';
export { OtterRiverRush as default } from './OtterRiverRush';

// Game state management
export { useGameStore } from './hooks/useGameStore';

// Audio controls
export { audio } from './utils/audio';

// Types
export type { GameState, GameStatus } from './types/game-types';
