import { test, expect } from '@playwright/test';

test.describe('Mobile layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForSelector('nav');
  });

  test('should show bottom navigation', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Library' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible();
  });

  test('should show library home with playlists', async ({ page }) => {
    await expect(page.getByText('Favorites')).toBeVisible();
    await expect(page.getByText('Chill Vibes')).toBeVisible();
    await expect(page.getByText('Workout Mix')).toBeVisible();
  });

  test('should navigate to search and profile tabs', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByPlaceholder('Search tracks, playlists, or artists...')).toBeVisible();

    await page.getByRole('button', { name: 'Profile' }).click();
    await expect(page.getByText(`Omar's Portfolio`)).toBeVisible();
  });
});
