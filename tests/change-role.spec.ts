import { test, expect, Page } from "@playwright/test";

const LOGIN_EMAIL = "khin.mya@ggg.com";
const LOGIN_PASSWORD = "password123";

async function loginAsHRManager(page: Page) {
  await page.goto("https://preview.hr-admin.pages.dev/login");

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().includes("/auth/login")
  );

  await page
    .getByRole("textbox", { name: "Email *" })
    .fill(LOGIN_EMAIL);

  await page
    .getByRole("textbox", { name: "Password *" })
    .fill(LOGIN_PASSWORD);

  await page.getByRole("button", { name: "Login" }).click();

  const loginResponse = await loginResponsePromise;

  expect(loginResponse.ok()).toBeTruthy();

  const responseBody = await loginResponse.json();

  expect(responseBody.accessToken).toBeTruthy();
  expect(typeof responseBody.accessToken).toBe("string");

  expect(responseBody.refreshToken).toBeTruthy();
  expect(typeof responseBody.refreshToken).toBe("string");

  /*
   * IMPORTANT:
   * Wait until the frontend has processed the login.
   */
  await expect(page).not.toHaveURL(/\/login/, {
    timeout: 10000,
  });

  // A redirect can leave /login before the authenticated app shell is ready.
  // Wait for its navigation before starting the employee workflow.
  await expect(page.getByRole("link", { name: "Employees", exact: true }))
    .toBeVisible({ timeout: 20000 });

  console.log("Logged in. Current URL:", page.url());

  return responseBody;
}

async function goToEmployees(page: Page) {
  await expect(page).not.toHaveURL(/\/login/);

  const employeesLink = page.getByRole("link", {
    name: "Employees",
  });

  await expect(employeesLink).toBeVisible({
    timeout: 10000,
  });

  await employeesLink.click();

  await expect(page).toHaveURL(/\/employees/, {
    timeout: 10000,
  });
}

async function selectGenius(page: Page) {
  // Genius is a Business Unit option; the Departments filter is a separate
  // multi-select on the Employees page.
  const employeeSelector = page.getByRole("combobox", {
    name: /Business Units$/,
  });
  await expect(employeeSelector).toBeVisible({ timeout: 15000 });
  await employeeSelector.click();

  const searchInput = page.getByRole("combobox", {
    name: "Search through available",
  });
  await expect(searchInput).toBeVisible();
  await searchInput.fill("Genius");

  const suggestions = page.getByRole("listbox", { name: "Suggestions" });
  await expect(suggestions).toBeVisible();

  const geniusOption = suggestions.getByText(/Genius/i).first();
  await expect(geniusOption).toBeVisible();
  await geniusOption.click();
  await page.keyboard.press("Escape");
}

async function openGeniusEmployee(page: Page) {
  await selectGenius(page);

  const employeeRow = page
    .getByRole("row")
    .filter({ hasText: "Lin Let Lwin" });
  await expect(employeeRow).toBeVisible({ timeout: 10000 });

  // Open the employee record through its row action link.
  const employeeLink = employeeRow.getByRole("link");
  await expect(employeeLink).toBeVisible();
  await employeeLink.click();

  const continuousOnboarding = page.getByRole("link", {
    name: "Continuous onboarding",
  });
  await expect(continuousOnboarding).toBeVisible({ timeout: 10000 });
  await continuousOnboarding.click();

  const preferredNameInput = page.getByRole("textbox", {
    name: "Preferred Name",
  });
  await expect(preferredNameInput).toBeVisible({ timeout: 10000 });
  await preferredNameInput.fill("LinLet");
}

test.describe("Employee Management - HR Manager", () => {
  // All tests use the same remote HR account; avoid overlapping logins.
  test.describe.configure({ mode: "serial" });

  test("should login successfully as HR Manager", async ({ page }) => {
    await loginAsHRManager(page);
  });

  test("should select Genius and verify Employee Code starts with GTE", async ({
    page,
  }) => {
    await loginAsHRManager(page);
    await goToEmployees(page);

    await selectGenius(page);

    /*
     * Employee codes look like:
     *
     * GTE1200040
     * GTE1200039
     * GTE1500001
     */
    const employeeCodeLocator = page.getByText(/GTE\d+/).first();

    await expect(employeeCodeLocator).toBeVisible();

    const employeeCode = (await employeeCodeLocator.textContent())
      ?.match(/GTE\d+/)?.[0]
      ?.trim();

    console.log("Employee Code:", employeeCode);

    expect(employeeCode).toBeTruthy();
    expect(employeeCode).toMatch(/^GTE\d+$/);
  });

  test("should open Edit Employee and get success response", async ({
    page,
  }) => {
    await loginAsHRManager(page);
    await goToEmployees(page);

    /*
     * Go through the complete employee selection flow.
     */
    await openGeniusEmployee(page);

    /*
     * Now Edit Employee should exist.
     */
    const editEmployeeButton = page.getByRole("button", {
      name: "Edit employee",
    });

    await expect(editEmployeeButton).toBeVisible({
      timeout: 10000,
    });

    /*
     * IMPORTANT:
     *
     * Start listening BEFORE clicking.
     *
     * We don't assume GET here yet.
     */
    const employeeResponsePromise = page.waitForResponse((response) =>
      response.url().includes("/employees"),
    );

    await editEmployeeButton.click();

    const employeeResponse = await employeeResponsePromise;

    /*
     * HTTP status
     */
    expect(employeeResponse.ok()).toBeTruthy();

    /*
     * URL must contain /employees
     */
    expect(employeeResponse.url()).toContain("/employees");

    console.log("Employee API URL:", employeeResponse.url());
    console.log("Employee API status:", employeeResponse.status());

    /*
     * Response body
     */
    const responseBody = await employeeResponse.json();

    console.log("Employee API response:", responseBody);

    /*
     * Verify message
     */
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toBe("Employee updated successfully");
  });
});
