import { expect, test } from '@playwright/test';
import { TEST_CONFIG } from '../test-config';

test.describe('Biome Visual Regression @visual', () => {
  test.setTimeout(90000); // Increase timeout for slow WebGL rendering

  const biomes = [
    { id: 'forest', name: 'Forest Stream' },
    { id: 'mountain', name: 'Mountain Rapids' },
    { id: 'canyon', name: 'Canyon River' },
    { id: 'crystal', name: 'Crystal Falls' },
  ];

  for (const biome of biomes) {
    test(`Biome: ${biome.name} renders correctly`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for game store to be available
      await page.waitForFunction(
        () => (window as any).__gameStore !== undefined,
        { timeout: 10000 }
      );

      // Force the biome
      await page.evaluate((biomeId) => {
        const store = (window as any).__gameStore;
        store.getState().setForcedBiome(biomeId);
        store.getState().startGame('classic');
      }, biome.id);

      // Wait for game to start and rendering to stabilize
      await expect(page.locator('[data-testid="score"]')).toBeVisible({
        timeout: 15000,
      });

      // Wait extra time for volumetric clouds and water to settle
      await page.waitForTimeout(3000);

      // Pause the game to get a stable screenshot
      await page.evaluate(() => {
        const store = (window as any).__gameStore;
        store.getState().pauseGame();
      });

      // Take screenshot and compare
      await expect(page).toHaveScreenshot(`biome-${biome.id}.png`, {
        maxDiffPixels: 50000, // Higher tolerance for stable screenshot generation
        animations: 'disabled',
        fullPage: true,
        timeout: 45000,
      });
    });
  }
});
