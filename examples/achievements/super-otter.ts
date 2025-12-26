// NOTE: This is a reference example for custom achievements.
import { GameState } from '../../src/client/src/types/game-types';

/**
 * Example: Custom Achievement
 *
 * This example shows how to define a new achievement for Otter River Rush.
 * Achievements can use condition strings or functions for evaluation.
 */
export const SUPER_OTTER_ACHIEVEMENT = {
  id: 'super_otter',
  name: 'Super Otter',
  description:
    'Maintain maximum combo and stay airborne for 5 seconds simultaneously',
  icon: '🚀',
  requirement: 1,
  rarity: 'epic',

  // SECURE APPROACH: Use a function for condition checking
  check: (state: GameState & { currentAirTime: number }) =>
    state.combo >= 10 && state.currentAirTime >= 5,

  // LEGACY APPROACH: String-based condition (for reference with older systems)
  // NOTE: Avoid string evaluation for user-provided data.
  checkCondition: 'comboMultiplier >= 10 && currentAirTime >= 5',
};
