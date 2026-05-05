import { test, expect } from '@playwright/test';

test.describe('Playlists', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForSelector('aside');
  });

  test('should create a new playlist', async ({ page }) => {
    // Click create playlist button
    await page.locator('button[aria-label="Create playlist"]').first().click();

    // Fill in name
    await page.fill('input[placeholder="My Playlist"]', 'E2E Test Playlist');

    // Click create
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify playlist appears
    await expect(page.locator('aside').getByText('E2E Test Playlist')).toBeVisible();
  });

  test('should rename a playlist', async ({ page }) => {
    // Open a default playlist (Favorites)
    await page.locator('aside').getByText('Favorites').click();
    await page.waitForTimeout(300);

    // Click rename button
    await page.locator('button[aria-label^="Rename playlist"]').click();

    // Fill in new name
    const input = page.locator('input#rename-playlist-name');
    await input.clear();
    await input.fill('Renamed Playlist');

    // Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify rename
    await expect(page.locator('aside').getByText('Renamed Playlist')).toBeVisible();
  });

  test('should delete a user-created playlist', async ({ page }) => {
    // Create a playlist to delete
    await page.locator('button[aria-label="Create playlist"]').first().click();
    await page.fill('input[placeholder="My Playlist"]', 'To Delete');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(300);

    // Open the playlist
    await page.locator('aside').getByText('To Delete').click();
    await page.waitForTimeout(300);

    // Delete
    await page.locator('button[aria-label^="Delete playlist"]').click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Verify deleted
    await expect(page.locator('aside').getByText('To Delete')).not.toBeVisible();
  });
});
