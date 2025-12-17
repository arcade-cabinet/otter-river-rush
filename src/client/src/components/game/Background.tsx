import React from 'react';
import { ProceduralSky, createTimeOfDay } from '@jbcom/strata';

/**
 * Background Component using @jbcom/strata
 * Provides procedural sky background for the game
 */
export function Background(): React.JSX.Element {
  // Create noon time of day settings
  const timeOfDay = createTimeOfDay(12);

  return <ProceduralSky timeOfDay={timeOfDay} />;
}
