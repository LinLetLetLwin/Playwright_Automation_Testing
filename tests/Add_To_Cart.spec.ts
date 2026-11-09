// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://www.saucedemo.com/');
//   await page.locator('[data-test="username"]').click();
//   await page.locator('[data-test="username"]').fill('standard_user');
//   await page.locator('[data-test="password"]').click();
//   await page.locator('[data-test="password"]').fill('secret_sauce');
//   await page.locator('[data-test="password"]').press('Enter');
//   await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
//   await page.locator('[data-test="inventory-item-description"]').first().click();
//   await page.locator('[data-test="shopping-cart-link"]').click();
//   await page.getByText('Sauce Labs Backpackcarry.').click();
// });


 import { test, expect } from '@playwright/test';

test('Should successfully log in and add an item to the cart', async ({ page }) => {

  // 1. Navigate to SauceDemo
  await page.goto('https://www.saucedemo.com/');

  // Expected Result: Login page is displayed
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();

  // 2. Enter login credentials
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');

  // 3. Click Login
  await page.locator('[data-test="login-button"]').click();

  // Expected Result: User successfully logs in
  await expect(page).toHaveURL(/inventory.html/);

  // Expected Result: Products page is displayed
  const productsHeader = page.locator('.title');
  await expect(productsHeader).toBeVisible();
  await expect(productsHeader).toHaveText('Products');

  // 4. Add Sauce Labs Backpack to cart
  await page
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();

  // Expected Result: Cart badge shows 1 item
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // 5. Navigate to shopping cart
  await page.locator('.shopping_cart_link').click();

  // Expected Result: Cart page is displayed
  await expect(page).toHaveURL(/cart.html/);

  // 6. Verify Sauce Labs Backpack is in the cart
  const cartItem = page.locator('.cart_item [data-test="inventory-item-name"]');
  await expect(cartItem).toHaveText('Sauce Labs Backpack');

  // 7. Verify quantity is 1
  const cartQuantity = page.locator('.cart_quantity');
  await expect(cartQuantity).toHaveText('1');

});
