/**
 * Example: Custom Achievement
 * 
 * This example shows how to define a new achievement for Otter River Rush.
 * Achievements use a condition string that is evaluated against the game state.
 */
export const SUPER_OTTER_ACHIEVEMENT = {
  id: 'super_otter',
  name: 'Super Otter',
  description: 'Maintain maximum combo and stay airborne for 5 seconds simultaneously',
  icon: '🚀',
  requirement: 1,
  rarity: 'epic',
  // Conditions can use logical operators and game state variables
  checkCondition: 'comboMultiplier >= 10 && currentAirTime >= 5',
};
