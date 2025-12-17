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

  // Biome-specific ambient sounds
  const biomeAmbient: Record<string, string> = {
    'Forest Stream': 'forest',
    'Mountain Rapids': 'mountain',
    'Canyon River': 'desert',
    'Crystal Falls': 'waterfall',
  };

  const ambientType = biomeAmbient[biome.name] || 'forest';
  const isPlaying = status === 'playing';
  const isRapids = biome.name === 'Mountain Rapids';

  return (
    <AudioProvider>
      <AudioListener />

      {/* Ambient background sounds based on biome */}
      {isPlaying && (
        <AmbientAudio
          url={`/audio/ambient/${ambientType}.ogg`}
          volume={0.3}
          loop
          autoplay
        />
      )}

      {/* Weather audio for rapids biome */}
      {isPlaying && isRapids && (
        <WeatherAudio
          rainUrl="/audio/sfx/rain-loop.ogg"
          windUrl="/audio/sfx/wind-loop.ogg"
          thunderUrl="/audio/sfx/thunder.ogg"
          rainIntensity={0.6}
          windIntensity={0.4}
          thunderActive={false}
        />
      )}

      {children}
    </AudioProvider>
  );
}

export default AudioEnvironment;
