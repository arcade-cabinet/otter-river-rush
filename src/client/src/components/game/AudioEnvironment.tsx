/**
 * Audio Environment using @jbcom/strata
 * Provides ambient audio, positional sounds, and weather audio
 */

import React from 'react';
import {
  AudioProvider,
  AudioListener,
  AmbientAudio,
  WeatherAudio,
} from '@jbcom/strata';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';
import { getBiomeConfig } from '../../config/biome-config';

interface AudioEnvironmentProps {
  children: React.ReactNode;
}

/**
 * Audio Environment wrapper component
 * Wraps game content with strata's audio context
 */
export function AudioEnvironment({
  children,
}: AudioEnvironmentProps): React.JSX.Element {
  const { status } = useGameStore();
  const biome = useBiome();

  // Get biome config from centralized config
  const biomeConfig = getBiomeConfig(biome.name);
  const ambientType = biomeConfig.ambientType;
  const isPlaying = status === 'playing';
  const hasRain = biomeConfig.hasRain;
  const rainIntensity = biomeConfig.rainIntensity;

  return (
    <AudioProvider>
      <AudioListener />

      {/* Ambient background sounds based on biome
          Expected asset structure:
          - Ambient audio files: /public/audio/ambient/${ambientType}.ogg
            where ambientType is from biomeConfig (e.g., "forest", "mountain", "desert", "waterfall")
          - Weather SFX: /public/audio/sfx/rain-loop.ogg, wind-loop.ogg, thunder.ogg
       */}
      {isPlaying && (
        <AmbientAudio
          url={`/audio/ambient/${ambientType}.ogg`}
          volume={0.3}
          loop
          autoplay
        />
      )}

      {/* Weather audio based on biome config */}
      {isPlaying && hasRain && (
        <WeatherAudio
          rainUrl="/audio/sfx/rain-loop.ogg"
          windUrl="/audio/sfx/wind-loop.ogg"
          thunderUrl="/audio/sfx/thunder.ogg"
          rainIntensity={rainIntensity}
          windIntensity={rainIntensity * 0.6}
          thunderActive={false}
        />
      )}

      {children}
    </AudioProvider>
  );
}

export default AudioEnvironment;
