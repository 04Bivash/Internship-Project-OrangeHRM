const { test } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const loginTestData = require("../test_data/loginData.json");

let loginPage;

test.beforeEach("Navigate to OrangeHRM", async ({ page }) => {
  await page.goto("auth/login", { waitUntil: "domcontentloaded" });
  loginPage = new LoginPage(page);
});

test.describe("Testing Login Functionality of the Application", () => {
  test("should login successfully with valid credentials", async ({ page }) => {
    await loginPage.loginToApplication(
      loginTestData.validUser.username,
      loginTestData.validUser.password,
    );
  });
  test("should display an error message for an invalid password", async ({
    page,
  }) => {
    await loginPage.loginToApplication(
      loginTestData.invalidPassword.username,
      loginTestData.invalidPassword.password,
    );
  });
  test("should display an error message for an invalid username", async ({
    page,
  }) => {
    await loginPage.loginToApplication(
      loginTestData.invalidUsername.username,
      loginTestData.invalidUsername.password,
    );
  });
  test("should display a validation message when username field is empty ", async ({
    page,
  }) => {
    await loginPage.loginToApplication(
      loginTestData.missingUsername.username,
      loginTestData.missingUsername.password,
    );
  });
  test("should display a validation message when password field is empty", async ({
    page,
  }) => {
    await loginPage.loginToApplication(
      loginTestData.missingPassword.username,
      loginTestData.missingPassword.password,
    );
  });
  test("should display a validation message when both fields are empty", async ({
    page,
  }) => {
    await loginPage.loginToApplication(
      loginTestData.missingBothFields.username,
      loginTestData.missingBothFields.password,
    );
  });
});
