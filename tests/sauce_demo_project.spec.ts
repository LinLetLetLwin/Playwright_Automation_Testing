// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://www.saucedemo.com/');
//   await page.locator('[data-test="username"]').click();
//   await page.locator('[data-test="username"]').fill('standard_user');
//   await page.locator('[data-test="password"]').click();
//   await page.locator('[data-test="password"]').fill('secret_sauce');
//   await page.locator('[data-test="login-button"]').click();
//   await page.getByRole('button', { name: 'Open Menu' }).click();
//   await page.locator('[data-test="logout-sidebar-link"]').click();
// });

import { test, expect } from '@playwright/test';

test('Login successfully with valid credentials', async ({ page }) => {

  // Open SauceDemo
  await page.goto('https://www.saucedemo.com/');

  // Enter username
  await page.locator('[data-test="username"]').fill('standard_user');

  // Enter password
  await page.locator('[data-test="password"]').fill('secret_sauce');

  // Click Login
  await page.locator('[data-test="login-button"]').click();

  // Expected Result 1: User is redirected to Products page
  await expect(page).toHaveURL(/inventory.html/);

  // Expected Result 2: Products title is displayed
  await expect(page.getByText('Products')).toBeVisible();

});


