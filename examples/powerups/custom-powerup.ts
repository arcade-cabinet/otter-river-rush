// NOTE: This is a reference example for custom power-ups.
import { Entity } from '../../src/client/src/ecs/world';

/**
 * Example: Custom Power-Up
 *
 * This example shows how to define a new power-up for Otter River Rush.
 * Power-ups are entities that provide temporary benefits to the player.
 */
export const SUPER_SPEED_POWERUP: Partial<Entity> = {
  id: 'super-speed-example',
  name: 'Super Speed',
  description:
    'Gives Rusty a massive speed boost and invincibility for a short duration.',
  // ... more properties ...
  powerUp: {
    type: 'multiplier', // Reusing multiplier for speed in this example
    duration: 5,
  },
  invincible: true,
  model: {
    url: 'models/powerup-lightning.glb',
    scale: 1.5,
  },
};
