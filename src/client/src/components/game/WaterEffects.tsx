import React from 'react';
import { AdvancedWater, Rain } from '@jbcom/strata';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';

/**
 * Water Effects using @jbcom/strata AdvancedWater
 * Provides advanced water rendering with caustics, foam, and reflections
 */
export function WaterEffects(): React.JSX.Element | null {
  const { status } = useGameStore();
  const biome = useBiome();

  // Biome-specific water colors
  const waterColors: Record<string, string> = {
    'Forest Stream': '#1a4a6e',
    'Mountain Rapids': '#2668a0',
    'Canyon River': '#3a5a6e',
    'Crystal Falls': '#1a8a8a',
  };

  const waterColor = waterColors[biome.name] || '#1e40af';

  // Show rain in rapids biome
  const showRain = biome.name === 'Mountain Rapids';

  // Wave speed based on game state
  const waveSpeed = status === 'playing' ? 1.5 : 0.5;

  return (
    <group>
      <AdvancedWater
        position={[0, -0.3, -5]}
        size={[40, 60]}
        segments={64}
        color={waterColor}
        waveHeight={0.08}
        waveSpeed={waveSpeed}
        causticIntensity={0.3}
      />

      {/* Weather effects for rapids biome */}
      {showRain && (
        <Rain
          count={500}
          areaSize={40}
          height={20}
          intensity={0.6}
          dropLength={0.5}
        />
      )}
    </group>
  );
}
