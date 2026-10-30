const { test } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { DashboardPage } = require("../pages/dashboardPage");
const { PimPage } = require("../pages/pimPage");
const { AdminPage } = require("../pages/adminPage");
const loginTestData = require("../test_data/loginData.json");
const empData = require("../test_data/employees.json");
const { generateUniqueUsername } = require("../utils/generateUniqueUsername");

let loginPage;
let dashboardPage;
let pimPage;
let adminPage;

test.beforeEach(
  "Navigate to OrangeHRM, login using valid credentials",
  async ({ page }) => {
    await page.goto("auth/login", { waitUntil: "domcontentloaded" });
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    pimPage = new PimPage(page);
    adminPage = new AdminPage(page);

    await loginPage.loginToApplication(
      loginTestData.validUser.username,
      loginTestData.validUser.password,
    );
  },
);

test.describe("Testing the functionality and features of the Admin Page", () => {
  test("should navigate to the Admin page from the dashboard", async ({
    page,
  }) => {
    await dashboardPage.clickAdmin();
    await adminPage.verifyAdminPageLoaded();
  });

  test("should perform CRUD operation on a system user", async ({ page }) => {
    await dashboardPage.clickPim();
    await pimPage.addEmployee(
      empData.createEmployee.firstName,
      empData.createEmployee.middleName,
      empData.createEmployee.lastName,
    );
    await dashboardPage.clickPim();
    await pimPage.searchByName(
      empData.createEmployee.firstName,
      empData.createEmployee.middleName,
      empData.createEmployee.lastName,
    );

    await pimPage.verifyEmployeeName(
      empData.createEmployee.firstName,
      empData.createEmployee.middleName,
      empData.createEmployee.lastName,
    );
    await dashboardPage.clickAdmin();
    const username = generateUniqueUsername(
      empData.createEmployee.user.username,
    );
    const employeeName = [
      empData.createEmployee.firstName,
      empData.createEmployee.middleName,
      empData.createEmployee.lastName,
    ].join(" ");
    await adminPage.addUser(
      empData.createEmployee.user.userRole,
      employeeName,
      empData.createEmployee.user.status,
      username,
      empData.createEmployee.user.password,
      empData.createEmployee.user.password,
    );
    await adminPage.verifyEmployeeAdded();
    await adminPage.searchEmployee(username);
  });
});
