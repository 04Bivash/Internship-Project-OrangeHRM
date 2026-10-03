const { test } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { DashboardPage } = require("../pages/dashboardPage");
const { PimPage } = require("../pages/pimPage");
const loginTestData = require("../test_data/loginData.json");
const empData = require("../test_data/employees.json");

let loginPage;
let dashboardPage;
let pimPage;

test.beforeEach(
  "Navigate to OrangeHRM, login using valid credentials and go to PIM page",
  async ({ page }) => {
    await page.goto("auth/login", { waitUntil: "domcontentloaded" });
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    pimPage = new PimPage(page);
    await loginPage.loginToApplication(
      loginTestData.validUser.username,
      loginTestData.validUser.password,
    );
    await dashboardPage.clickPim();
  },
);

test.describe("Testing the functionality of the PIM page", () => {
  test("should navigate to PIM page from the dashboard", async ({ page }) => {
    await pimPage.verifyPimPageLoaded();
  });
  test("should successfully create and delete an employee", async ({
    page,
  }) => {
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

    await pimPage.deleteEmployeeDetails(
      empData.createEmployee.firstName,
      empData.createEmployee.middleName,
      empData.createEmployee.lastName,
    );
    await pimPage.searchByName(
      empData.createEmployee.firstName,
      empData.createEmployee.middleName,
      empData.createEmployee.lastName,
    );
    await pimPage.verifyEmployeeNotFound(
      empData.createEmployee.firstName,
      empData.createEmployee.middleName,
      empData.createEmployee.lastName,
    );
  });

  test("should successfully search employee by name", async ({ page }) => {
    await pimPage.searchByName(
      empData.existingEmployee.firstName,
      empData.existingEmployee.middleName,
      empData.existingEmployee.lastName,
    );
    await pimPage.verifyEmployeeName(
      empData.existingEmployee.firstName,
      empData.existingEmployee.middleName,
      empData.existingEmployee.lastName,
    );
  });

  test("should successfully search employee by id", async ({ page }) => {
    await pimPage.searchById(empData.existingEmployee.employeeId);
    await pimPage.verifyEmployeeId(empData.existingEmployee.employeeId);
  });

  test("should successfully update employee job details", async ({ page }) => {
    test.setTimeout(60000);
    await pimPage.searchById(empData.existingEmployee.employeeId);
    await pimPage.verifyEmployeeId(empData.existingEmployee.employeeId);
    await pimPage.openEmployee(
      empData.existingEmployee.firstName,
      empData.existingEmployee.middleName,
      empData.existingEmployee.lastName,
    );
    await pimPage.clickJobTab();
    try {
      await pimPage.updateJobDetails(
        empData.updateJobDetails.updated.jobTitle,
        empData.updateJobDetails.updated.subUnit,
        empData.updateJobDetails.updated.location,
        empData.updateJobDetails.updated.employmentStatus,
      );
      await dashboardPage.clickPim();
      await pimPage.searchById(empData.existingEmployee.employeeId);
      await pimPage.verifyEmployeeId(empData.existingEmployee.employeeId);
      await pimPage.verifyJobDetails(
        empData.existingEmployee.employeeId,
        empData.updateJobDetails.updated.jobTitle,
        empData.updateJobDetails.updated.subUnit,
        empData.updateJobDetails.updated.employmentStatus,
      );
    } finally {
      await pimPage.openEmployee(
        empData.existingEmployee.firstName,
        empData.existingEmployee.middleName,
        empData.existingEmployee.lastName,
      );
      await pimPage.clickJobTab();
      await pimPage.updateJobDetails(
        empData.updateJobDetails.original.jobTitle,
        empData.updateJobDetails.original.subUnit,
        empData.updateJobDetails.original.location,
        empData.updateJobDetails.original.employmentStatus,
      );
    }
  });
});
