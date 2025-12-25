import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Atmosphere } from '@takram/three-atmosphere/r3f';
import { CloudLayer, Clouds } from '@takram/three-clouds/r3f';
import React from 'react';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';
import { useMobileConstraints } from '../../hooks/useMobileConstraints';

export function VisualEffects(): React.JSX.Element {
  const { status } = useGameStore();
  const biome = useBiome();
  const constraints = useMobileConstraints();

  const qualityPreset = constraints.isPhone
    ? 'low'
    : constraints.isTablet
      ? 'medium'
      : 'high';

  const coverage = biome.cloudCoverage;

  return (
    <Atmosphere>
      <EffectComposer enableNormalPass>
        <Clouds
          qualityPreset={qualityPreset}
          coverage={coverage}
          disableDefaultLayers
        >
          <CloudLayer
            channel="r"
            altitude={750}
            height={650}
            shadow={!constraints.isMobile}
          />
          <CloudLayer
            channel="g"
            altitude={1500}
            height={800}
            shadow={!constraints.isMobile}
          />
          <CloudLayer
            channel="b"
            altitude={5000}
            height={500}
            densityScale={0.003}
            shapeAmount={0.4}
            shapeDetailAmount={0}
            coverageFilterWidth={0.5}
          />
        </Clouds>
        <Bloom
          intensity={status === 'playing' ? 0.5 : 0.3}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
        />
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>
    </Atmosphere>
  );
}
