/**
 * Volumetric Sky with Realistic Clouds
 * Uses @jbcom/strata for professional atmospheric rendering
 *
 * Performance targets:
 * - Phones: 60 FPS with reduced quality
 * - Tablets: 60 FPS with medium quality
 * - Desktop: 60 FPS with high quality
 */

import {
  createTimeOfDay,
  ProceduralSky,
  VolumetricClouds,
} from '@jbcom/strata';
import type React from 'react';
import { useMemo } from 'react';
import { getBiomeConfig } from '../../config/biome-config';
import { useBiome } from '../../ecs/biome-system';
import { useMobileConstraints } from '../../hooks/useMobileConstraints';

interface VolumetricSkyProps {
  timeOfDay?: number; // 0-24 (for future day/night cycle)
  coverage?: number; // 0-1 cloud coverage
}

export function VolumetricSky({
  timeOfDay = 12,
  coverage = 0.4,
}: VolumetricSkyProps): React.JSX.Element {
  const constraints = useMobileConstraints();
  const biome = useBiome();

  // Get biome config from centralized config (memoized to avoid recalculation)
  const biomeConfig = useMemo(() => getBiomeConfig(biome.name), [biome.name]);
  const finalCoverage = biomeConfig.cloudCoverage || coverage;

  // Reduce quality on mobile for performance
  const cloudSteps = constraints.isPhone ? 16 : constraints.isTablet ? 32 : 64;

  // Create time of day settings from hour
  const timeOfDayState = createTimeOfDay(timeOfDay);

  return (
    <>
      {/* Strata ProceduralSky - dynamic sky with sun position */}
      <ProceduralSky timeOfDay={timeOfDayState} />

      {/* Strata VolumetricClouds - raymarched volumetric clouds */}
      <VolumetricClouds
        cloudBase={500}
        cloudHeight={2000}
        coverage={finalCoverage}
        density={0.5}
        windSpeed={0.3}
        windDirection={[1, 0.2]}
        steps={cloudSteps}
      />
    </>
  );
}
