/**
 * Audio System - Howler.js integration with Kenney sounds
 * Mobile-optimized with user interaction unlock
 */

import { Howl } from 'howler';

// Sound effect registry
const sounds: Record<string, Howl> = {};
// Ambient loop registry
const ambients: Record<string, Howl> = {};

// Audio enabled state (user must interact first for mobile)
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

  try {
    // Unlock audio context on mobile (required by iOS/Android)
    const unlockAudio = new Howl({
      src: [getAudioPath('audio/sfx/ui-click.ogg')],
      volume: 0,
      onloaderror: (_id, error) => {
        console.warn('Audio unlock failed to load:', error);
      },
      onplayerror: (_id, error) => {
        console.warn('Audio unlock failed to play:', error);
      },
    });
    unlockAudio.play();
    unlockAudio.unload();

    audioUnlocked = true;
  } catch (error) {
    console.warn('Failed to initialize audio system:', error);
    // Still mark as unlocked to prevent repeated attempts
    audioUnlocked = true;
  }
}

/**
 * Load a sound effect
 */
function loadSound(id: string, src: string, volume = 1.0): Howl {
  if (sounds[id]) return sounds[id];

  const sound = new Howl({
    src: [src],
    volume,
    preload: true,
    onloaderror: (_soundId, error) => {
      console.warn(`Failed to load sound "${id}":`, error);
    },
  });

  sounds[id] = sound;
  return sound;
}

/**
 * Load an ambient loop
 */
function loadAmbient(id: string, src: string, volume = 0.5): Howl {
  if (ambients[id]) return ambients[id];

  const sound = new Howl({
    src: [src],
    volume,
    loop: true,
    preload: true,
    onloaderror: (_soundId, error) => {
      console.warn(`Failed to load ambient sound "${id}":`, error);
    },
  });

  ambients[id] = sound;
  return sound;
}

/**
 * Play a sound effect
 */
export function playSound(id: string) {
  if (!audioEnabled || !audioUnlocked) return;

  const sound = sounds[id];
  if (sound) {
    sound.play();
  }
}

/**
 * Play an ambient loop
 */
export function playAmbient(id: string, fade = 1000) {
  if (!audioEnabled || !audioUnlocked) return;

  const sound = ambients[id];
  if (sound) {
    if (!sound.playing()) {
      sound.play();
      sound.fade(0, sound.volume(), fade);
    }
  }
}

/**
 * Stop an ambient loop
 */
export function stopAmbient(id: string, fade = 1000) {
  const sound = ambients[id];
  if (sound && sound.playing()) {
    sound.fade(sound.volume(), 0, fade);
    setTimeout(() => {
      if (sound.playing()) {
        sound.stop();
      }
    }, fade);
  }
}

/**
 * Stop all ambient loops
 */
export function stopAllAmbient(fade = 1000) {
  Object.keys(ambients).forEach((id) => stopAmbient(id, fade));
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
 * Preload all game sounds
 */
export function preloadSounds() {
  // UI sounds
  loadSound('ui-click', getAudioPath('audio/sfx/ui-click.ogg'), 0.5);

  // Gameplay sounds
  loadSound('jump', getAudioPath('audio/sfx/jump.ogg'), 0.6);
  loadSound('dodge', getAudioPath('audio/sfx/woosh4.ogg'), 0.4);
  loadSound('collect-coin', getAudioPath('audio/sfx/collect-coin.ogg'), 0.7);
  loadSound('collect-gem', getAudioPath('audio/sfx/collect-gem.ogg'), 0.8);
  loadSound('hit', getAudioPath('audio/sfx/hit.ogg'), 0.9);

  // Ambient sounds
  loadAmbient('ambient-forest', getAudioPath('audio/ambient/forest.ogg'), 0.4);
  loadAmbient(
    'ambient-mountain',
    getAudioPath('audio/ambient/mountain.ogg'),
    0.4
  );
  loadAmbient('ambient-desert', getAudioPath('audio/ambient/desert.ogg'), 0.4);
  loadAmbient(
    'ambient-waterfall',
    getAudioPath('audio/ambient/waterfall.ogg'),
    0.5
  );

  // Weather sounds
  loadAmbient('weather-rain', getAudioPath('audio/sfx/rain-loop.ogg'), 0.3);
  loadAmbient('weather-wind', getAudioPath('audio/sfx/wind-loop.ogg'), 0.2);
  loadSound('weather-thunder', getAudioPath('audio/sfx/thunder.ogg'), 0.6);
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

  // Ambient & Weather
  playAmbient,
  stopAmbient,
  stopAllAmbient,
  playWeather: (id: string) => playAmbient(`weather-${id}`),
  stopWeather: (id: string) => stopAmbient(`weather-${id}`),
  thunder: () => playSound('weather-thunder'),

  // System
  init: initAudio,
  preload: preloadSounds,
  setVolume,
  setEnabled: setAudioEnabled,
};
