/**
 * Audio System - Howler.js integration with Kenney sounds
 * Mobile-optimized with user interaction unlock
 */

import { Howl, Howler } from 'howler';

// Sound ID type for type safety
export type SoundId =
  | 'ui-click'
  | 'jump'
  | 'dodge'
  | 'collect-coin'
  | 'collect-gem'
  | 'hit';

/**
 * Audio file path type for type-safe audio file references.
 * All audio files should be in .ogg format for best browser compatibility.
 */
export type AudioFilePath =
  `audio/${'sfx' | 'ambient' | 'music'}/${string}.ogg`;

/**
 * Sound configuration with typed path
 */
interface SoundConfig {
  id: SoundId;
  path: AudioFilePath;
  volume: number;
}

/**
 * Predefined sound configurations for the game
 */
const SOUND_CONFIGS: SoundConfig[] = [
  { id: 'ui-click', path: 'audio/sfx/ui-click.ogg', volume: 0.5 },
  { id: 'jump', path: 'audio/sfx/jump.ogg', volume: 0.6 },
  { id: 'dodge', path: 'audio/sfx/woosh4.ogg', volume: 0.4 },
  { id: 'collect-coin', path: 'audio/sfx/collect-coin.ogg', volume: 0.7 },
  { id: 'collect-gem', path: 'audio/sfx/collect-gem.ogg', volume: 0.8 },
  { id: 'hit', path: 'audio/sfx/hit.ogg', volume: 0.9 },
];

// Sound effect registry
const sounds: Record<SoundId, Howl> = {} as Record<SoundId, Howl>;

// Audio state - user must interact first for mobile unlock
let audioEnabled = true;
let audioUnlocked = false;

/**
 * Get audio path with base URL
 */
function getAudioPath(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}${path}`.replace(/\/+/g, '/');
}

/**
 * Initialize audio system
 * Call on first user interaction to unlock audio on mobile
 */
export function initAudio() {
  if (audioUnlocked) return;

  // Unlock audio context on mobile (required by iOS/Android)
  const unlockAudio = new Howl({
    src: [getAudioPath('audio/sfx/ui-click.ogg')],
    volume: 0,
  });
  unlockAudio.play();
  unlockAudio.unload();

  audioUnlocked = true;
  console.info('🔊 Audio system unlocked');
}

/**
 * Load a sound effect
 */
function loadSound(id: SoundId, src: string, volume = 1.0): Howl {
  if (sounds[id]) return sounds[id];

  const sound = new Howl({
    src: [src],
    volume,
    preload: true,
  });

  sounds[id] = sound;
  return sound;
}

/**
 * Play a sound effect
 */
export function playSound(id: SoundId) {
  if (!audioEnabled || !audioUnlocked) return;

  const sound = sounds[id];
  if (sound) {
    sound.play();
  }
}

/**
 * Set master volume
 */
export function setVolume(volume: number) {
  Howler.volume(Math.max(0, Math.min(1, volume)));
}

/**
 * Enable/disable audio
 */
export function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled;
  if (!enabled) {
    Howler.mute(true);
  } else {
    Howler.mute(false);
  }
}

/**
 * Preload all game sounds using typed configurations
 */
export function preloadSounds() {
  // Load all sounds from typed configuration
  for (const config of SOUND_CONFIGS) {
    loadSound(config.id, getAudioPath(config.path), config.volume);
  }

  console.info('🎵 Sound effects preloaded');
}

/**
 * Cleanup all audio resources
 * Call on component unmount to prevent memory leaks
 */
export function cleanupAudio() {
  // Unload all sounds to free memory
  Object.values(sounds).forEach((sound) => {
    sound.unload();
  });

  // Clear the sounds registry
  Object.keys(sounds).forEach((key) => {
    delete sounds[key];
  });

  // Reset state
  audioUnlocked = false;

  console.info('🔇 Audio system cleaned up');
}

/**
 * Game audio actions
 */
export const audio = {
  // UI
  uiClick: () => playSound('ui-click'),

  // Gameplay
  jump: () => playSound('jump'),
  dodge: () => playSound('dodge'),
  collectCoin: () => playSound('collect-coin'),
  collectGem: () => playSound('collect-gem'),
  hit: () => playSound('hit'),

  // System
  init: initAudio,
  preload: preloadSounds,
  setVolume,
  setEnabled: setAudioEnabled,
  cleanup: cleanupAudio,
};
