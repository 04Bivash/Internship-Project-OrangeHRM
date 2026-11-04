const { test } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { DashboardPage } = require("../pages/dashboardPage");
const { BuzzPage } = require("../pages/buzzPage");
const loginTestData = require("../test_data/loginData.json");
const { syncBuiltinESMExports } = require("node:module");
let loginPage;
let dashboarPage;
let buzzPage;

test.beforeEach(
  "Navigate to OrangeHRM, login using valid credentials and go to Buzz Page",
  async ({ page }) => {
    await page.goto("auth/login", { waitUntil: "domcontentloaded" });
    loginPage = new LoginPage(page);
    dashboarPage = new DashboardPage(page);
    buzzPage = new BuzzPage(page);
    await loginPage.loginToApplication(
      loginTestData.essUser1.username,
      loginTestData.essUser1.password,
    );
    await dashboarPage.verifyDashboardLoaded();
    await dashboarPage.clickBuzz();
  },
);

test.describe("Testing the functionality and features of the Buzz Page", () => {
  test("should navigate to Buzz page from the dashboard", async ({ page }) => {
    await buzzPage.verifyBuzzPageLoaded();
  });
  test("should successfully create a text post", async ({ page }) => {
    const message = `Post ${Date.now()}`;
    await buzzPage.createTextPost(message);
    await buzzPage.verifyTextPost(message);
  });
  test("should create a photo post", async ({ page }) => {
    const message = `Photo Post ${Date.now()}`;
    await buzzPage.createPhotoPost(message, "test_data/images/cover.png");
    await buzzPage.verifyPhotoPost(message);
  });
  test("should edit an existing post", async ({ page }) => {
    const message = `Test Post ${Date.now()}`;
    const updatedMessage = `Updated Post ${Date.now()}`;
    await buzzPage.createTextPost(message);
    await buzzPage.verifyTextPost(message);
    await buzzPage.editTextPost(message, updatedMessage);
    await buzzPage.verifyTextPost(updatedMessage);
  });
  test("should successfully delete a post", async ({ page }) => {
    const message = `Delete Message ${Date.now()}`;
    await buzzPage.createTextPost(message);
    await buzzPage.verifyTextPost(message);
    await buzzPage.deleteTextPost(message);
  });
  test("should successfully like a post", async ({ page }) => {
    const message = `Like this post ${Date.now()}`;
    await buzzPage.createTextPost(message);
    await buzzPage.verifyTextPost(message);
    await dashboarPage.logoutFromApplication();
    await loginPage.loginToApplication(
      loginTestData.essUser2.username,
      loginTestData.essUser2.password,
    );
    await dashboarPage.verifyDashboardLoaded();
    await dashboarPage.clickBuzz();
    await buzzPage.verifyTextPost(message);
    await buzzPage.likePost(message);
  });
  test("should successfully unlike a post", async ({ page }) => {
    const message = `Unlike this post ${Date.now()}`;
    await buzzPage.createTextPost(message);
    await buzzPage.verifyTextPost(message);
    await dashboarPage.logoutFromApplication();
    await loginPage.loginToApplication(
      loginTestData.essUser2.username,
      loginTestData.essUser2.password,
    );
    await dashboarPage.verifyDashboardLoaded();
    await dashboarPage.clickBuzz();
    await buzzPage.verifyTextPost(message);
    await buzzPage.likePost(message);
    await buzzPage.unlikePost(message);
  });
  test.only("should successfully comment on a post", async ({ page }) => {
    const message = `Comment on this post ${Date.now()}`;
    await buzzPage.createTextPost(message);
    await buzzPage.verifyTextPost(message);
    await dashboarPage.logoutFromApplication();
    await loginPage.loginToApplication(
      loginTestData.essUser2.username,
      loginTestData.essUser2.password,
    );
    await dashboarPage.verifyDashboardLoaded();
    await dashboarPage.clickBuzz();
    await buzzPage.verifyTextPost(message);
    await buzzPage.commentOnPost(message, "Nice Post");
  });
});
