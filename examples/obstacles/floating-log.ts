import { EnemyDefinition } from '../../src/client/src/game/data/enemy-definitions';

/**
 * Example: Custom Floating Log Obstacle
 * 
 * This example shows how to define a new obstacle for the Otter River Rush game.
 * Obstacles are defined as 'enemies' with specific behaviors and stats.
 */
export const FLOATING_LOG: EnemyDefinition = {
  id: 'floating-log-example',
  name: 'Mossy Floating Log',
  description: 'A heavy, mossy log that floats slowly downstream. It is easy to spot but hard to move.',
  behaviors: {
    primary: 'Wander',
    secondary: 'ObstacleAvoidance',
  },
  stats: {
    speed: 0.8,
    health: 10, // Very durable
    aggression: 0,
  },
  spawn: {
    minDistance: 15,
    maxDistance: 60,
    minDifficulty: 0,
    weight: 15, // Common obstacle
  },
  scoring: {
    points: 5,
    bonusMultiplier: 1.0,
  },
  abilities: {
    pattern: 'steady_drift',
    cooldown: 0,
  },
  visual: {
    size: 2.2,
    color: '#4A5D23', // Mossy green-brown
    animationSpeed: 0.2,
  },
};
