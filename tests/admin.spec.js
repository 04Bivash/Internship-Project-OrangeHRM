const { test } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { DashboardPage } = require("../pages/dashboardPage");
const { PimPage } = require("../pages/pimPage");
const { AdminPage } = require("../pages/adminPage");
const loginTestData = require("../test_data/loginData.json");
const empData = require("../test_data/employees.json");

let loginPage;
let dashboardPage;
let pimPage;
let adminPage;

test.beforeEach(
  "Navigate to OrangeHRM, login using valid credentials and go to Admin Page",
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

  test("should create a system user for an existing employee", async ({
    page,
  }) => {
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
    await adminPage.addUser(
      empData.createUser.userRole,
      empData.createUser.employeeName,
      empData.createUser.status,
      empData.createUser.username,
      empData.createUser.password,
      empData.createUser.password,
    );
    await adminPage.verifyEmployeeAdded();
  });
});
