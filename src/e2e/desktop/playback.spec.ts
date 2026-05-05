import { test, expect } from '@playwright/test';

test.describe('Playback', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForSelector('[data-index]');
  });

  test('should play and pause a track from the row', async ({ page }) => {
    // Click the first track's play button
    const firstPlayButton = page.locator('[data-index="0"] button[aria-label^="Play"]').first();
    await firstPlayButton.dispatchEvent('click');

    // Playback bar should show track info
    await expect(page.getByText('No track selected')).not.toBeVisible({ timeout: 5000 });

    // The play button in the playback bar should show Pause
    await expect(page.locator('button[aria-label="Pause"]')).toBeVisible();
  });

  test('should toggle play/pause from playback bar', async ({ page }) => {
    // Play first track
    const firstPlayButton = page.locator('[data-index="0"] button[aria-label^="Play"]').first();
    await firstPlayButton.dispatchEvent('click');

    // Click pause in playback bar
    await page.locator('button[aria-label="Pause"]').click();
    await expect(page.locator('button[aria-label="Play"]')).toBeVisible();

    // Click play
    await page.locator('button[aria-label="Play"]').click();
    await expect(page.locator('button[aria-label="Pause"]')).toBeVisible();
  });

  test('should skip to next and previous track', async ({ page }) => {
    // Play first track
    const firstPlayButton = page.locator('[data-index="0"] button[aria-label^="Play"]').first();
    await firstPlayButton.dispatchEvent('click');
    await page.waitForTimeout(500);

    // Click next
    await page.locator('button[aria-label="Next track"]').click();
    await page.waitForTimeout(300);

    // Click previous
    await page.locator('button[aria-label="Previous track"]').click();
    await page.waitForTimeout(300);
  });

  test('should mute and unmute volume', async ({ page }) => {
    // Play a track first so the playback bar is visible
    const firstPlayButton = page.locator('[data-index="0"] button[aria-label^="Play"]').first();
    await firstPlayButton.dispatchEvent('click');
    await expect(page.getByText('No track selected')).not.toBeVisible({ timeout: 5000 });

    // Now the mute button should be visible
    await page.locator('button[aria-label="Mute"]').click();
    await expect(page.locator('button[aria-label="Unmute"]')).toBeVisible();

    await page.locator('button[aria-label="Unmute"]').click();
    await expect(page.locator('button[aria-label="Mute"]')).toBeVisible();
  });
});
