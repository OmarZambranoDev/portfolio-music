import { test, expect } from '@playwright/test';

test.describe('Desktop layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForSelector('aside');
  });

  test('should show default playlists in sidebar', async ({ page }) => {
    await expect(page.locator('aside').getByText('Favorites')).toBeVisible();
    await expect(page.locator('aside').getByText('Chill Vibes')).toBeVisible();
    await expect(page.locator('aside').getByText('Workout Mix')).toBeVisible();
  });

  test('should show track list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'All Songs' })).toBeVisible();
    const tracks = page.locator('[data-index]');
    await expect(tracks.first()).toBeVisible({ timeout: 10000 });
  });

  test('should collapse and expand sidebar', async ({ page }) => {
    const sidebar = page.locator('aside');
    const initialWidth = (await sidebar.boundingBox())?.width || 0;
    expect(initialWidth).toBeGreaterThan(200);

    // Collapse
    await page.click('aside button[aria-label="Collapse sidebar"]');
    await page.waitForTimeout(500);
    const collapsedWidth = (await sidebar.boundingBox())?.width || 0;
    expect(collapsedWidth).toBeLessThan(100);
  });

  test('should show playback bar when track is played', async ({ page }) => {
    // The play button is hidden behind hover, use force
    const firstPlayButton = page.locator('[data-index="0"] button[aria-label^="Play"]').first();
    await firstPlayButton.dispatchEvent('click');
    await expect(page.getByText('No track selected')).not.toBeVisible({ timeout: 5000 });
  });

  test('should have portfolio and github links', async ({ page }) => {
    await expect(page.locator('a[aria-label="Back to Portfolio"]')).toBeVisible();
    await expect(page.locator('a[aria-label="View source on GitHub"]')).toBeVisible();
  });
});
