import { test, expect } from '@playwright/test';

test('submit attendance export job', async ({ page }) => {
  // The navigation retry window is longer than Playwright's 30-second default.
  test.setTimeout(150_000);

  await expect(async () => {
    const response = await page.goto('https://preview.hr-admin.pages.dev/login', {
      waitUntil: 'domcontentloaded',
      timeout: 10_000,
    });
    expect(response?.ok()).toBe(true);
  }).toPass({ timeout: 60_000, intervals: [1_000, 2_000, 5_000] });

  await expect(page.getByRole('textbox', { name: 'Email *' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email *' }).fill('kayinlay@company.com');
  await page.getByRole('textbox', { name: 'Password *' }).fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('button', { name: 'Attendance' })).toBeVisible();

  await page.getByRole('button', { name: 'Attendance' }).click();
  await expect(page.getByRole('link', { name: 'Request', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Request', exact: true }).click();

  await page.getByRole('button', { name: 'Export' }).click();
  const exportDialog = page.getByRole('dialog');
  await expect(exportDialog.getByRole('heading', { name: 'Attendance Export' })).toBeVisible();

  // The dialog defaults to the current month. Business Unit is optional, so
  // leave it unfiltered to export attendance for all units.
  const exportAccepted = page.waitForResponse((response) =>
    response.url().endsWith('/attendance/exports') &&
    response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Confirm' }).click();

  const response = await exportAccepted;
  expect(response.status()).toBe(201);

  const exportJob = await response.json();
  expect(exportJob.jobId).toBeTruthy();
  expect(exportJob.status).toBe('QUEUED');
});
