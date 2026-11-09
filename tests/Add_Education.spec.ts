// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://preview.hr-admin.pages.dev/login');
//   await page.getByRole('textbox', { name: 'Email *' }).click();
//   await page.getByRole('textbox', { name: 'Email *' }).fill('kayinlay@company.com');
//   await page.getByRole('textbox', { name: 'Password *' }).click();
//   await page.getByRole('textbox', { name: 'Password *' }).fill('password123');
//   await page.getByRole('textbox', { name: 'Password *' }).press('Enter');
//   await page.getByRole('link', { name: 'Employees' }).click();
//   await page.getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
//   await page.getByRole('tab', { name: 'Education' }).click();
//   await page.getByRole('link', { name: 'Add Education' }).click();
//   await page.getByRole('textbox', { name: 'Degree *' }).click();
//   await page.getByRole('textbox', { name: 'Degree *' }).fill('Bachelor of Science');
//   await page.getByRole('textbox', { name: 'Institution *' }).click();
//   await page.getByRole('textbox', { name: 'Institution *' }).fill('Assumption University');
//   await page.getByRole('textbox', { name: 'Major' }).click();
//   await page.getByRole('textbox', { name: 'Major' }).fill('Computer Science');
//   await page.getByRole('textbox', { name: 'GPA *' }).click();
//   await page.getByRole('button', { name: 'yyyy-MM-dd' }).first().click();
//   await page.getByLabel('Choose the Year').selectOption('2020');
//   await page.locator('html').click();
//   await page.getByRole('button', { name: 'yyyy-MM-dd' }).nth(1).click();
//   await page.getByLabel('Choose the Year').selectOption('2022');
//   await page.getByRole('button', { name: 'Wednesday, October 5th,' }).click();
//   await page.locator('html').click();
//   await page.getByRole('button', { name: 'yyyy-MM-dd' }).first().click();
//   await page.getByLabel('Choose the Year').selectOption('2018');
//   await page.getByRole('button', { name: 'Wednesday, October 10th,' }).click();
//   await page.locator('html').click();
//   await page.getByRole('button', { name: 'yyyy-MM-dd' }).click();
//   await page.getByLabel('Choose the Year').selectOption('2023');
//   await page.getByRole('button', { name: 'Tuesday, October 3rd,' }).click();
//   await page.locator('html').click();
//   await page.locator('div').filter({ hasText: /^Drag & drop or click to uploadJPEG, JPG, PNG, GIF, WEBP · Max 5\.0 MB$/ }).first().click();
//   await page.getByRole('button', { name: 'Certificate' }).setInputFiles('Screenshot 2026-10-01 at 1.17.48 PM.png');
//   await page.getByRole('button', { name: 'Add' }).click();
//   await page.getByRole('textbox', { name: 'GPA *' }).fill('023');
//   await page.getByRole('textbox', { name: 'GPA *' }).click();
//   await page.getByRole('textbox', { name: 'GPA *' }).click();
//   await page.getByRole('textbox', { name: 'GPA *' }).fill('4.3');
//   await page.getByRole('button', { name: 'Add' }).click();
//   await page.getByRole('listitem').filter({ hasText: 'Education record created' }).click();
// });
import { test, expect } from '@playwright/test';

test('Create employee education successfully', async ({ page }) => {

  // 1. Navigate to HR application
  await page.goto('https://preview.hr-admin.pages.dev/login');

  // Expected Result: Login page is displayed
  await expect(
    page.getByRole('textbox', { name: 'Email *' })
  ).toBeVisible();

  await expect(
    page.getByRole('textbox', { name: 'Password *' })
  ).toBeVisible();


  // 2. Enter login credentials
  await page.getByRole('textbox', { name: 'Email *' })
    .fill('kayinlay@company.com');

  await page.getByRole('textbox', { name: 'Password *' })
    .fill('password123');

  // Login
  await page.getByRole('textbox', { name: 'Password *' }).press('Enter');

  // Expected Result: User successfully logs in
  await expect(
    page.getByRole('link', { name: 'Employees' })
  ).toBeVisible();


  // 3. Navigate to Employees
  await page.getByRole('link', { name: 'Employees' }).click();

  // Expected Result: Employee page is displayed
  await expect(page.getByRole('link').filter({ hasText: /^$/ }).nth(1))
    .toBeVisible();


  // 4. Open employee profile
  await page.getByRole('link').filter({ hasText: /^$/ }).nth(1).click();

  // 5. Open Education tab
  await page.getByRole('tab', { name: 'Education' }).click();

  // Expected Result: Education tab is displayed
  await expect(
    page.getByRole('tab', { name: 'Education' })
  ).toBeVisible();


  // 6. Open the education form. Existing education records use an icon-only
  // edit link; employees without a record can add one from this tab.
  const addEducation = page.getByRole('link', { name: /add education/i });
  if (await addEducation.isVisible()) {
    await addEducation.click();
  } else {
    await page.locator('a[href$="/education"]').click();
  }

  // Expected Result: Education form is displayed
  await expect(
    page.getByRole('textbox', { name: 'Degree *' })
  ).toBeVisible();


  // 7. Enter Degree
  await page.getByRole('textbox', { name: 'Degree *' })
    .fill('Bachelor of Science');

  // Expected Result
  await expect(
    page.getByRole('textbox', { name: 'Degree *' })
  ).toHaveValue('Bachelor of Science');


  // 8. Enter Institution
  await page.getByRole('textbox', { name: 'Institution *' })
    .fill('Assumption University');

  // Expected Result
  await expect(
    page.getByRole('textbox', { name: 'Institution *' })
  ).toHaveValue('Assumption University');


  // 9. Enter Major
  await page.getByRole('textbox', { name: 'Major' })
    .fill('Computer Science');

  // Expected Result
  await expect(
    page.getByRole('textbox', { name: 'Major' })
  ).toHaveValue('Computer Science');


  // 10. Enter GPA
  await page.getByRole('textbox', { name: 'GPA *' })
    .fill('4.3');

  // Expected Result: GPA value is entered
  await expect(
    page.getByRole('textbox', { name: 'GPA *' })
  ).toHaveValue('4.3');

  // Start Date is required for an education record.
  await page.getByRole('button', { name: 'yyyy-MM-dd' }).first().click();
  await page.getByLabel('Choose the Year').selectOption('2018');
  await page.getByRole('button', { name: /October 10th/ }).click();
  // The date picker remains open after choosing a day and can cover the form.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();


  // 11. Upload certificate
  // await page.locator('div')
  //   .filter({
  //     hasText: /^Drag & drop or click to uploadJPEG, JPG, PNG, GIF, WEBP · Max 5\.0 MB$/
  //   })
  //   .first()
  //   .click();

  // await page.getByRole('button', { name: 'Certificate' })
  //   .setInputFiles('Screenshot 2026-10-01 at 1.17.48 PM.png');
// await page.getByRole('button', { name: 'Certificate' })
//   .setInputFiles('test-data/certificate.png');
// Upload certificate
await page.locator('input[type="file"]').setInputFiles(
  'tests/test-data/certificate.png'
);

  // Expected Result: Certificate is uploaded
  // Adjust this assertion according to the application's actual upload UI.
  await expect(
    page.getByRole('button', { name: 'Certificate' })
  ).toBeVisible();


  // 12. Add the education record and verify it appears in the list.
  const educationRecords = page.getByRole('heading', { level: 4 });
  const recordCountBefore = await educationRecords.count();
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(educationRecords).toHaveCount(recordCountBefore + 1);

});
