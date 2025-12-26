import { PerspectiveCamera, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef } from 'react';
import { VISUAL } from '../../config/visual-constants';
import { AchievementSystem } from '../../ecs/achievement-system';
import { BiomeSystem } from '../../ecs/biome-system';
import { CameraSystem } from '../../ecs/camera-system';
import { ComboSystem } from '../../ecs/combo-system';
import { DifficultySystem } from '../../ecs/difficulty-system';
import { EnemySystem } from '../../ecs/enemy-system';
import { InputSystem } from '../../ecs/input-system';
import { LeaderboardSystem } from '../../ecs/leaderboard-system';
import { MagnetSystem } from '../../ecs/magnet-system';
import { NearMissSystem } from '../../ecs/near-miss-system';
import { PowerUpSystem } from '../../ecs/power-up-system';
import { QuestSystem } from '../../ecs/quest-system';
import { ScoreSystem } from '../../ecs/score-system';
import { ShieldEffectSystem } from '../../ecs/shield-effect-system';
import { GameSystems } from '../../ecs/systems';
import { TouchInputSystem } from '../../ecs/touch-input-system';
import { WeatherSystem } from '../../ecs/weather-system';
import { queries, spawn } from '../../ecs/world';
import { useGameStore } from '../../hooks/useGameStore';
import { useMobileConstraints } from '../../hooks/useMobileConstraints';
import { AudioEnvironment } from './AudioEnvironment';
import { EntityRenderer } from './EntityRenderer';
import { LaneMarkers } from './LaneMarkers';
import { River } from './River';
import { Skybox } from './Skybox';
import { VisualEffects } from './VisualEffects';

interface GameCanvasProps {
  showStats?: boolean;
}

export function GameCanvas({
  showStats = false,
}: GameCanvasProps): React.JSX.Element {
  const { status } = useGameStore();
  const constraints = useMobileConstraints();
  const canvasRef = useRef<HTMLDivElement>(null);
  const playerSpawnedRef = useRef(false);

  // Initialize player immediately when game transitions to playing
  useEffect(() => {
    if (status === 'playing' && !playerSpawnedRef.current) {
      // Spawn player if one doesn't exist
      if (queries.player.entities.length === 0) {
        spawn.otter(0);
      }
      playerSpawnedRef.current = true; // Mark as spawned to prevent repeated spawn attempts
    }

    // Reset flag when returning to menu or game over (to allow direct restart)
    if (status === 'menu' || status === 'game_over') {
      playerSpawnedRef.current = false;
    }
  }, [status]);

  // Responsive canvas sizing - use full viewport via CSS class for dvh support
  const canvasStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
  };

  // Only render game systems when playing
  const isActive = status === 'playing' || status === 'paused';

  return (
    <div
      ref={canvasRef}
      className="game-canvas-container fixed inset-0 z-0"
      style={canvasStyle}
    >
      <Canvas
        className="w-full h-full"
        gl={{
          antialias: !constraints.isMobile, // Disable AA on mobile for performance
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={constraints.pixelRatio}
        frameloop={isActive ? 'always' : 'demand'} // Only animate when playing
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 3, 6]}
          fov={constraints.isPhone ? 60 : 50} // Wider FOV on phones
          near={0.1}
          far={100}
        />

        <ambientLight
          intensity={VISUAL.lighting.ambient.intensity}
          color={VISUAL.lighting.ambient.color}
        />
        <directionalLight
          position={VISUAL.lighting.directional.main.position}
          intensity={VISUAL.lighting.directional.main.intensity}
        />
        <directionalLight
          position={VISUAL.lighting.directional.fill.position}
          intensity={VISUAL.lighting.directional.fill.intensity}
        />

        <Suspense fallback={null}>
          {/* Environment always renders for visual backdrop */}
          <Skybox />
          <River />
          <LaneMarkers />
          <fog
            attach="fog"
            args={[VISUAL.fog.color, VISUAL.fog.near, VISUAL.fog.far]}
          />

          {/* Game entities only render when active */}
          {isActive && <EntityRenderer />}

          {/* Systems only run when actively playing */}
          {isActive && (
            <>
              <GameSystems />
              <InputSystem />
              <TouchInputSystem />
              <CameraSystem />
              <ScoreSystem />
              <PowerUpSystem />
              <BiomeSystem />
              <DifficultySystem />
              <AchievementSystem />
              <ComboSystem />
              <MagnetSystem />
              <NearMissSystem />
              <ShieldEffectSystem />
              <WeatherSystem />
              <QuestSystem />
              <LeaderboardSystem />
              <EnemySystem />
            </>
          )}
        </Suspense>

        <AudioEnvironment />
        <VisualEffects />
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
}
