import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { audio } from '../../utils/audio';

/**
 * MainMenu Component - Branded game menu
 * Features otter mascot, themed UI, and playful personality
 * Shows over the 3D scene for visual appeal
 */

export function MainMenu(): React.JSX.Element {
  const { startGame, highScore } = useGameStore();

  const handleStartGame = (
    mode: 'classic' | 'time_trial' | 'zen' | 'daily_challenge'
  ): void => {
    audio.uiClick();
    startGame(mode);
  };

  return (
    <div
      id="startScreen"
      className="fixed inset-0 pointer-events-auto z-50 main-menu-gradient"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 space-y-4 splash-in overflow-y-auto max-h-[90vh] py-4">
        {/* Hero Section */}
        <div className="text-center py-2">
          <div className="text-5xl mb-2 otter-bounce">🦦</div>
          <h1 className="otter-title text-3xl md:text-4xl mb-2">
            Otter River Rush
          </h1>
          <p className="text-sm text-blue-300">
            Swipe or use arrow keys to dodge!
          </p>
          {highScore > 0 && (
            <p className="text-xs text-yellow-400 mt-1">
              Best Score: {highScore.toLocaleString()}
            </p>
          )}
        </div>

        {/* Primary Play Button */}
        <button
          id="classicButton"
          onClick={() => handleStartGame('classic')}
          className="otter-btn otter-btn-primary w-full text-xl py-4 font-bold"
        >
          Play Now
        </button>

        {/* Other Modes - Secondary */}
        <div className="grid grid-cols-3 gap-2">
          <button
            id="timeTrialButton"
            onClick={() => handleStartGame('time_trial')}
            className="otter-btn otter-btn-secondary py-3 text-sm flex flex-col gap-1"
          >
            <span className="text-lg">⏱️</span>
            <span>Time</span>
          </button>

          <button
            id="zenButton"
            onClick={() => handleStartGame('zen')}
            className="otter-btn otter-btn-secondary py-3 text-sm flex flex-col gap-1"
          >
            <span className="text-lg">🧘</span>
            <span>Zen</span>
          </button>

          <button
            id="dailyButton"
            onClick={() => handleStartGame('daily_challenge')}
            className="otter-btn otter-btn-secondary py-3 text-sm flex flex-col gap-1"
          >
            <span className="text-lg">🎲</span>
            <span>Daily</span>
          </button>
        </div>

        {/* Instructions hint */}
        <p className="text-center text-xs text-slate-400 pt-2">
          Collect coins, dodge rocks, survive as long as you can!
        </p>
      </div>
    </div>
  );
}
