import { useFrame } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import { BIOMES } from '../config/biome-config';
import { useGameStore } from '../hooks/useGameStore';

export function BiomeSystem() {
  const { status, forcedBiome } = useGameStore();
  const randomizedOrder = useMemo(() => {
    // If a biome is forced, we don't need to randomize, but keep it for consistency
    return BIOMES.slice().sort(() => 0.5 - Math.random());
  }, []);
  const [currentBiome, setCurrentBiome] = useState(0);
  const [transitionTimer, setTransitionTimer] = useState(0);

  useFrame((state, dt) => {
    if (status !== 'playing') return;

    const distance = useGameStore.getState().distance;

    // Use forced biome if available
    let newBiomeIdx = currentBiome;
    if (forcedBiome) {
      const idx = BIOMES.findIndex((b) => b.id === forcedBiome);
      if (idx !== -1) {
        newBiomeIdx = idx;
        // When forced, we use the BIOMES array directly, not randomizedOrder
      }
    } else {
      // Change biome every 500m
      newBiomeIdx = Math.floor(distance / 500) % randomizedOrder.length;
    }

    if (newBiomeIdx !== currentBiome) {
      setCurrentBiome(newBiomeIdx);
      setTransitionTimer(3); // 3 second transition notification
    }

    if (transitionTimer > 0) {
      setTransitionTimer(transitionTimer - dt);
    }
  });

  return null;
}

export function useBiome() {
  const distance = useGameStore((state) => state.distance);
  const forcedBiome = useGameStore((state) => state.forcedBiome);

  const order = useMemo(
    () => BIOMES.slice().sort(() => 0.5 - Math.random()),
    []
  );

  if (forcedBiome) {
    const biome = BIOMES.find((b) => b.id === forcedBiome);
    if (biome) return biome;
  }

  const biomeIndex = Math.floor(distance / 500) % order.length;
  return order[biomeIndex];
}
