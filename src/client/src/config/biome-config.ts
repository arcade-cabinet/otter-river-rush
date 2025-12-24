/**
 * Biome-specific configuration for Otter River Rush
 */

export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog' | 'storm';

export interface BiomeConfig {
  id: string;
  name: string;
  waterColor: string;
  fogColor: string;
  ambient: number;
  cloudCoverage: number;
  weather: WeatherType;
  groundTexture: string;
}

export const BIOMES: BiomeConfig[] = [
  {
    id: 'forest',
    name: 'Forest Stream',
    waterColor: '#1e40af', // Deep blue
    fogColor: '#0f172a', // Slate 900
    ambient: 0.9,
    cloudCoverage: 0.3,
    weather: 'clear',
    groundTexture: 'Grass001',
  },
  {
    id: 'mountain',
    name: 'Mountain Rapids',
    waterColor: '#0c4a6e', // Sky 900
    fogColor: '#1e3a8a', // Blue 900
    ambient: 1.0,
    cloudCoverage: 0.5,
    weather: 'storm', // Includes rain effects
    groundTexture: 'Rock024',
  },
  {
    id: 'canyon',
    name: 'Canyon River',
    waterColor: '#78350f', // Amber 900
    fogColor: '#451a03', // Amber 950
    ambient: 0.8,
    cloudCoverage: 0.2,
    weather: 'clear',
    groundTexture: 'Ground037',
  },
  {
    id: 'crystal',
    name: 'Crystal Falls',
    waterColor: '#701a75', // Fuchsia 900
    fogColor: '#3b0764', // Purple 950
    ambient: 1.1,
    cloudCoverage: 0.6,
    weather: 'snow', // Sparkly crystal effects
    groundTexture: 'Rock022',
  },
];
