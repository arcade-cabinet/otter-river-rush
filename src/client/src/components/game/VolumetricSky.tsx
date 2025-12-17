/**
 * Volumetric Sky with Realistic Clouds
 * Uses @jbcom/strata for professional atmospheric rendering
 *
 * Performance targets:
 * - Phones: 60 FPS with reduced quality
 * - Tablets: 60 FPS with medium quality
 * - Desktop: 60 FPS with high quality
 */

import React from 'react';
import {
  ProceduralSky,
  VolumetricClouds,
  createTimeOfDay,
} from '@jbcom/strata';
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

  // Adjust coverage by biome
  const biomeCoverage: Record<string, number> = {
    forest: 0.3, // Light clouds
    mountain: 0.5, // More dramatic clouds
    canyon: 0.2, // Clear desert sky
    rapids: 0.6, // Stormy clouds
  };

  const finalCoverage = biomeCoverage[biome.name] || coverage;

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
