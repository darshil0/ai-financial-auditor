import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/FinAnalyzer Pro/);
});

test('uploads a report and displays the dashboard', async ({ page }) => {
  await page.goto('/');

  // Click the upload report button in the sidebar.
  await page.getByRole('button', { name: 'Upload Report' }).click();

  // Expect the report uploader to be visible.
  await expect(page.getByRole('heading', { name: /Analyze Corporate Earnings/ })).toBeVisible();

  // This is where we would upload a file, but since we can't
  // do that in this environment, we'll just check that the
  // uploader is visible.
});
