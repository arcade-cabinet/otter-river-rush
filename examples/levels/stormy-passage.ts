/**
 * Example: Custom Level Pattern
 * 
 * This example shows how to create a custom level segment with a specific
 * sequence of obstacles and enemy spawn rules.
 */
export const STORMY_PASSAGE = {
  id: 'stormy_passage_example',
  name: 'Stormy Passage',
  description: 'A treacherous segment with falling debris and frequent lightning strikes.',
  difficulty: 8,
  duration: 12000, // 12 seconds
  obstacles: [
    { time: 0, lane: 0, type: 'boulder' },
    { time: 500, lane: 2, type: 'boulder' },
    { time: 1500, lane: 1, type: 'rock' },
    { time: 3000, lane: 0, type: 'log' },
    { time: 3000, lane: 1, type: 'log' },
    { time: 4500, lane: 2, type: 'boulder' },
    { time: 6000, lane: 0, type: 'rock' },
    { time: 6000, lane: 1, type: 'rock' },
    { time: 6000, lane: 2, type: 'rock' }, // Wall of rocks!
    { time: 8000, lane: 1, type: 'branch' },
    { time: 9500, lane: 0, type: 'boulder' },
    { time: 11000, lane: 2, type: 'log' },
  ],
  recommendedBiome: 'storm',
  enemySpawnRules: {
    enabled: true,
    frequency: 1500, // Frequent spawns
    types: ['lightning', 'debris'],
  },
};
