import React, { useEffect, useRef } from 'react';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';
import { audio } from '../../utils/audio';

/**
 * AudioEnvironment component
 * Manages ambient loops and weather SFX based on game state
 */
export function AudioEnvironment(): React.JSX.Element {
  const biome = useBiome();
  const { status, distance } = useGameStore();
  
  // Determine weather based on distance (matches WeatherSystem logic)
  const getWeatherType = (dist: number) => {
    const segment = Math.floor(dist / 1000) % 4;
    switch (segment) {
      case 0: return 'clear';
      case 1: return 'fog';
      case 2: return 'rain'; // Changed from clear to rain for better audio variety
      case 3: return 'storm'; // Changed from snow to storm for better audio variety
      default: return 'clear';
    }
  };

  const weather = getWeatherType(distance);
  const lastBiomeRef = useRef<string>('');
  const lastWeatherRef = useRef<string>('');
  const thunderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Biome Ambience
  useEffect(() => {
    if (status !== 'playing') {
      audio.stopAllAmbient();
      lastBiomeRef.current = '';
      lastWeatherRef.current = '';
      if (thunderTimeoutRef.current) {
        clearTimeout(thunderTimeoutRef.current);
      }
      return;
    }

    if (biome.name !== lastBiomeRef.current) {
      // Transition biome audio
      if (lastBiomeRef.current) {
        audio.stopAmbient(getAmbientId(lastBiomeRef.current));
      }
      
      audio.playAmbient(getAmbientId(biome.name));
      lastBiomeRef.current = biome.name;
    }
  }, [biome.name, status]);

  // Handle Weather SFX
  useEffect(() => {
    if (status !== 'playing') return;

    if (weather !== lastWeatherRef.current) {
      // Stop previous weather loops
      if (lastWeatherRef.current === 'rain' || lastWeatherRef.current === 'storm') {
        audio.stopWeather('rain');
      }
      if (lastWeatherRef.current === 'fog' || lastWeatherRef.current === 'storm') {
        audio.stopWeather('wind');
      }

      // Start new weather loops
      if (weather === 'rain' || weather === 'storm') {
        audio.playWeather('rain');
      }
      if (weather === 'fog' || weather === 'storm') {
        audio.playWeather('wind');
      }
      
      lastWeatherRef.current = weather;
    }
  }, [weather, status]);

  // Handle Thunder SFX for Storms
  useEffect(() => {
    if (status === 'playing' && weather === 'storm') {
      const scheduleThunder = () => {
        const delay = 5000 + Math.random() * 15000;
        thunderTimeoutRef.current = setTimeout(() => {
          audio.thunder();
          scheduleThunder();
        }, delay);
      };
      
      scheduleThunder();
    } else if (thunderTimeoutRef.current) {
      clearTimeout(thunderTimeoutRef.current);
    }

    return () => {
      if (thunderTimeoutRef.current) {
        clearTimeout(thunderTimeoutRef.current);
      }
    };
  }, [weather, status]);

  // Helper to map biome name to ambient ID
  function getAmbientId(biomeName: string): string {
    switch (biomeName) {
      case 'Forest Stream': return 'ambient-forest';
      case 'Mountain Rapids': return 'ambient-mountain';
      case 'Canyon River': return 'ambient-desert';
      case 'Crystal Falls': return 'ambient-waterfall';
      default: return 'ambient-forest';
    }
  }

  return <></>;
}
