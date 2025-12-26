import { describe, expect, it, beforeEach } from 'vitest';
import { useGameStore } from '../../src/hooks/useGameStore';

describe('Game Store (Zustand)', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('should have initial state', () => {
    const state = useGameStore.getState();
    expect(state.status).toBe('menu');
    expect(state.score).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.powerUps.shield).toBe(false);
  });

  it('should start game correctly', () => {
    useGameStore.getState().startGame('classic');
    const state = useGameStore.getState();
    expect(state.status).toBe('playing');
    expect(state.mode).toBe('classic');
  });

  it('should update score and distance', () => {
    useGameStore.getState().updateScore(100);
    useGameStore.getState().updateDistance(50);
    const state = useGameStore.getState();
    expect(state.score).toBe(100);
    expect(state.distance).toBe(50);
  });

  it('should collect coins and update score', () => {
    useGameStore.getState().collectCoin(5);
    const state = useGameStore.getState();
    expect(state.coins).toBe(5);
    expect(state.score).toBe(50); // 5 * 10
  });

  it('should handle game over when lives reach zero', () => {
    useGameStore.getState().loseLife();
    useGameStore.getState().loseLife();
    useGameStore.getState().loseLife();
    const state = useGameStore.getState();
    expect(state.lives).toBe(0);
    expect(state.status).toBe('game_over');
  });

  it('should track high score', () => {
    useGameStore.getState().updateScore(1000);
    useGameStore.getState().endGame();
    expect(useGameStore.getState().highScore).toBe(1000);

    useGameStore.getState().startGame('classic');
    useGameStore.getState().updateScore(500);
    useGameStore.getState().endGame();
    expect(useGameStore.getState().highScore).toBe(1000); // Should keep the higher one
  });
});
