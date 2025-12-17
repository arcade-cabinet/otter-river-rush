import React from 'react';
import { Water } from '@jbcom/strata';
import { useGameStore } from '../../hooks/useGameStore';
import { useBiome } from '../../ecs/biome-system';

/**
 * River Component using @jbcom/strata Water
 * Provides animated water surface with reflections and flow
 */
export function River(): React.JSX.Element {
  const { status } = useGameStore();
  const biome = useBiome();

  // Biome-specific water colors
  const biomeWaterColors: Record<string, string> = {
    'Forest Stream': '#1e5a8a',
    'Mountain Rapids': '#2a6a9a',
    'Canyon River': '#3a7aaa',
    'Crystal Falls': '#1ecfcf',
  };

  const waterColor = biomeWaterColors[biome.name] || '#1e40af';

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
