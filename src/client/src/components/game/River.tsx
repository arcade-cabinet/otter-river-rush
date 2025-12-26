import { AdvancedWater } from '@jbcom/strata';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useGameStore } from '../../hooks/useGameStore';

export function River() {
  const meshRef = useRef<Mesh>(null);
  const { status } = useGameStore();

  return (
    <AdvancedWater
      // biome-ignore lint/suspicious/noExplicitAny: bypass three types version mismatch
      ref={meshRef as any}
      size={[20, 30]}
      position={[0, 0, -1]}
      color="#1e40af"
      deepColor="#1e3a8a"
      foamColor="#ffffff"
      causticIntensity={0.2}
      waveHeight={0.1}
      waveSpeed={status === 'playing' ? 1.5 : 0}
    />
  );
}
