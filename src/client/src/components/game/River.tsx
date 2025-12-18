import { Water } from '@jbcom/strata';
import type React from 'react';
import { useMemo } from 'react';
import { getBiomeConfig } from '../../config/biome-config';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';

/**
 * River Component using @jbcom/strata Water
 * Provides animated water surface with reflections and flow
 */
export function River(): React.JSX.Element {
  const { status } = useGameStore();
  const biome = useBiome();

  // Get biome config from centralized config (memoized to avoid recalculation)
  const biomeConfig = useMemo(() => getBiomeConfig(biome.name), [biome.name]);
  const waterColor = biomeConfig.waterColor;

  // Wave speed based on game state
  const waveSpeed = status === 'playing' ? 1.0 : 0.3;

  return (
    <Water
      position={[0, -0.1, -5]}
      size={40}
      segments={64}
      color={waterColor}
      waveSpeed={waveSpeed}
      waveHeight={0.05}
      opacity={0.9}
    />
  );
}
