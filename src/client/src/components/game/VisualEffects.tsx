import { CloudSky, EnhancedFog } from '@jbcom/strata';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import type React from 'react';
import { useMemo } from 'react';
import { getBiomeConfig } from '../../config/biome-config';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';

/**
 * Visual Effects using @jbcom/strata
 * Replaces @takram/three-clouds with strata's CloudSky component
 */
export function VisualEffects(): React.JSX.Element {
  const { status } = useGameStore();
  const biome = useBiome();

  // Get biome config from centralized config (memoized to avoid recalculation)
  const biomeConfig = useMemo(() => getBiomeConfig(biome.name), [biome.name]);
  const coverage = biomeConfig.cloudCoverage;

  return (
    <>
      {/* Strata CloudSky - multi-layer volumetric clouds */}
      <CloudSky
        layers={[
          // Low altitude clouds (cumulus)
          { altitude: 750, density: 0.6, coverage: coverage * 0.8 },
          // Mid altitude clouds
          { altitude: 1500, density: 0.4, coverage: coverage },
          // High altitude clouds (cirrus)
          { altitude: 5000, density: 0.2, coverage: coverage * 0.5 },
        ]}
        windSpeed={0.5}
        windDirection={[1, 0]}
        sunAngle={45}
        adaptToTimeOfDay={false}
      />

      {/* Strata EnhancedFog for atmospheric depth */}
      <EnhancedFog
        color={biomeConfig.fogColor}
        near={10}
        far={100}
        density={0.02}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={status === 'playing' ? 0.5 : 0.3}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
        />
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>
    </>
  );
}
