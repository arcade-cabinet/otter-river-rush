/**
 * Terrain with Strata Components
 * Uses @jbcom/strata for procedural terrain and vegetation
 * Replaces custom heightmap generation with strata's GPU-optimized system
 */

import { GrassInstances, RockInstances } from '@jbcom/strata';
import type React from 'react';
import { Suspense, useMemo } from 'react';
import { getBiomeConfig } from '../../config/biome-config';
import { useBiome } from '../../ecs/biome-system';
import { useMobileConstraints } from '../../hooks/useMobileConstraints';

// Terrain generation constants
const RIVER_WIDTH_THRESHOLD = 3; // Distance from center where river channel starts
const RIVER_CHANNEL_DEPTH = 0.05; // Depth multiplier for river channel
const BANK_ELEVATION = 0.2; // Elevation multiplier for banks
const BASE_HEIGHT_OFFSET = -0.6; // Base terrain height offset

/**
 * Simple heightmap function for terrain
 * Returns height at given x, z coordinates
 */
function getTerrainHeight(x: number, z: number): number {
  // Lower in center (river channel), higher at edges
  const distFromCenter = Math.abs(x);
  const riverChannel =
    distFromCenter < RIVER_WIDTH_THRESHOLD
      ? RIVER_CHANNEL_DEPTH
      : BANK_ELEVATION;
  // Simple noise-like variation
  const noise =
    Math.sin(x * 0.5) * 0.1 +
    Math.sin(z * 0.3) * 0.1 +
    Math.sin(x * z * 0.1) * 0.05;
  return noise * riverChannel + BASE_HEIGHT_OFFSET;
}

function TerrainMesh(): React.JSX.Element {
  const biome = useBiome();
  const constraints = useMobileConstraints();

  // Get biome config from centralized config (memoized to avoid recalculation)
  const biomeConfig = useMemo(
    () => getBiomeConfig(biome.name),
    [biome.name]
  );

  // Reduce vegetation density on mobile
  const grassCount = constraints.isPhone
    ? 500
    : constraints.isTablet
      ? 1000
      : 2000;
  const rockCount = constraints.isPhone ? 20 : constraints.isTablet ? 40 : 80;

  // Use centralized biome colors
  const grassColor = biomeConfig.grassColor;
  const groundColor = biomeConfig.groundColor;

  return (
    <group>
      {/* Ground plane for the terrain base */}
      <mesh
        position={[0, -0.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40, 32, 32]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Strata GPU-instanced grass - no biome filtering needed */}
      <GrassInstances
        count={grassCount}
        areaSize={40}
        heightFunc={getTerrainHeight}
        height={0.3}
        color={grassColor}
      />

      {/* Strata GPU-instanced rocks along riverbanks */}
      <RockInstances
        count={rockCount}
        areaSize={40}
        heightFunc={getTerrainHeight}
      />
    </group>
  );
}

export function Terrain(): React.JSX.Element {
  return (
    <Suspense fallback={null}>
      <TerrainMesh />
    </Suspense>
  );
}
