import { AdvancedWater, Rain } from '@jbcom/strata';
import type React from 'react';
import { useMemo } from 'react';
import { getBiomeConfig } from '../../config/biome-config';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';
import { useMobileConstraints } from '../../hooks/useMobileConstraints';

// Performance constants for water rendering
const WATER_SEGMENTS = {
  phone: 32, // Reduced for low-end mobile
  tablet: 48, // Medium quality for tablets
  desktop: 64, // Full quality for desktop
} as const;

/**
 * Water Effects using @jbcom/strata AdvancedWater
 * Provides advanced water rendering with caustics, foam, and reflections
 * Performance optimized for mobile devices
 */
export function WaterEffects(): React.JSX.Element | null {
  const { status } = useGameStore();
  const biome = useBiome();
  const constraints = useMobileConstraints();

  // Get biome config from centralized config (memoized to avoid recalculation)
  const biomeConfig = useMemo(
    () => getBiomeConfig(biome.name),
    [biome.name]
  );
  const waterColor = biomeConfig.deepWaterColor;
  const showRain = biomeConfig.hasRain;
  const rainIntensity = biomeConfig.rainIntensity;

  // Wave speed based on game state
  const waveSpeed = status === 'playing' ? 1.5 : 0.5;

  // Reduce water segments on mobile for performance
  const waterSegments = constraints.isPhone
    ? WATER_SEGMENTS.phone
    : constraints.isTablet
      ? WATER_SEGMENTS.tablet
      : WATER_SEGMENTS.desktop;

  return (
    <group>
      <AdvancedWater
        position={[0, -0.3, -5]}
        size={[40, 60]}
        segments={waterSegments}
        color={waterColor}
        waveHeight={0.08}
        waveSpeed={waveSpeed}
        causticIntensity={0.3}
      />

      {/* Weather effects based on biome config */}
      {showRain && (
        <Rain
          count={500}
          areaSize={40}
          height={20}
          intensity={rainIntensity}
          dropLength={0.5}
        />
      )}
    </group>
  );
}
