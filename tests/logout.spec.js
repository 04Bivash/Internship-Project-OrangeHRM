const { test } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { DashboardPage } = require("../pages/dashboardPage");
const loginTestData = require("../test_data/loginData.json");

let loginPage;
let dashboardPage;

test.describe("Testing the logout functionality of the application", () => {
  test("should logout from the application successfully", async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await page.goto("auth/login");
    await loginPage.loginToApplication(
      loginTestData.validUser.username,
      loginTestData.validUser.password,
    );
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.logoutFromApplication();
    await loginPage.verifyHeaderVisibility();
  });
});
