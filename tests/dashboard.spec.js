const { test } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { DashboardPage } = require("../pages/dashboardPage");
const loginTestData = require("../test_data/loginData.json");

let loginPage;
let dashboardPage;

test.beforeEach("Navitate to OrangeHRM Dashboard", async ({ page }) => {
  await page.goto("auth/login");
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.loginToApplication(
    loginTestData.validUser.username,
    loginTestData.validUser.password,
  );
});

test.describe("Testing Dashboard Features", () => {
  test("should display the dashboard after successfull login", async ({
    page,
  }) => {
    await dashboardPage.verifyDashboardLoaded();
  });

  test("should load the widges/cards in the dashboard page", async ({
    page,
  }) => {
    await dashboardPage.verifyWidgetsLoaded();
  });

  test("should render the sidebar items", async ({ page }) => {
    await dashboardPage.verifySidebarItems();
  });
});
