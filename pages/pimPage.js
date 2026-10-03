const { expect } = require("@playwright/test");

class PimPage {
  constructor(page) {
    this.page = page;
    this.pimHeading = page.getByRole("heading", { name: "PIM" });
    this.addBtn = page.getByRole("button", { name: " Add " });
    this.searchResetBtn = page.getByRole("button", { name: " Reset " });
    this.searchBtn = page.getByRole("button", { name: " Search " });
    this.empNameSearchBar = page.locator(
      "//label[text()='Employee Name']/parent::div/following-sibling::div/div/div/input[@placeholder='Type for hints...']",
    );
    this.empIdSearhBar = page.locator(
      "//label[text()='Employee Id']/following::div//input[contains(@class,'oxd-input')]",
    );
    // this.editBtn = page.locator("//div[@class='card-item card-header-slot-content --right']/div/div/button/i[contains(@class,'pencil')]");
    this.deleteBtn = page.getByRole("button", { name: "Delete Selected" });
    this.confirmDeleteBtn = page.getByRole("button", { name: "Yes, Delete" });
    this.firstName = page.getByPlaceholder("First Name");
    this.middleName = page.getByPlaceholder("Middle Name");
    this.lastName = page.getByPlaceholder("Last Name");
    this.saveBtn = page.getByRole("button", { name: " Save " });
    this.jobTab = page.getByRole("link", { name: "Job" });
    this.jobTitleDropdown = page.locator(
      "//label[text()='Job Title']/parent::div/following-sibling::div//div[contains(@class,'oxd-select-text-input')]",
    );
    this.subUnitDropdown = page.locator(
      "//label[text()='Sub Unit']/parent::div/following-sibling::div//div[contains(@class,'oxd-select-text-input')]",
    );
    this.locationDropdown = page.locator(
      "//label[text()='Location']/parent::div/following-sibling::div//div[contains(@class,'oxd-select-text-input')]",
    );
    this.employmentStatusDropdown = page.locator(
      "//label[text()='Employment Status']/parent::div/following-sibling::div//div[contains(@class,'oxd-select-text-input')]",
    );
  }
  async verifyPimPageLoaded() {
    await expect(this.page).toHaveURL(/pim/);
    await expect(this.pimHeading).toBeVisible();
  }
  async addEmployee(firstName, middleName, lastName) {
    await this.addBtn.click();
    await this.firstName.pressSequentially(firstName, { delay: 50 });
    await this.middleName.pressSequentially(middleName, { delay: 50 });
    await this.lastName.pressSequentially(lastName, { delay: 50 });
    await this.saveBtn.click();
    await expect(this.page.getByText("Success", { exact: true })).toBeVisible();
  }

  async searchByName(firstName, middleName = "", lastName = "") {
    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(" ");

    await this.empNameSearchBar.fill(fullName);
    await this.searchBtn.click();

    await this.page.waitForTimeout(1000);
  }

  async verifyEmployeeName(firstName, middleName = "", lastName = "") {
    const employeeRow = this.page
      .getByRole("row")
      .filter({ hasText: firstName })
      .filter({ hasText: lastName });

    await expect(employeeRow).toHaveCount(1);
  }

  async searchById(employeeId) {
    await this.empIdSearhBar.pressSequentially(employeeId);
    await this.searchBtn.click();
  }

  async verifyEmployeeId(employeeId) {
    const empIdResult = await this.page.locator(
      `//div[text()='Id']/following::div[text()='${employeeId}']`,
    );
    await expect(empIdResult).toBeVisible();
  }

  async openEmployee(firstName, middleName = "", lastName = "") {
    const employeeRow = this.page
      .getByRole("row")
      .filter({ hasText: firstName })
      .filter({ hasText: lastName });
    await expect(employeeRow).toHaveCount(1);
    await employeeRow.click();
  }
  async clickJobTab() {
    await this.jobTab.click();
  }

  async updateJobDetails(jobTitle, subUnit, location, employmentStatus) {
    await this.jobTitleDropdown.click();
    await this.page.getByText(jobTitle, { exact: true }).click();
    await this.subUnitDropdown.click();
    await this.page.getByText(subUnit, { exact: true }).click();
    await this.locationDropdown.click();
    await this.page
      .getByRole("listbox")
      .getByText(location, { exact: true })
      .click();
    await this.employmentStatusDropdown.click();
    await this.page
      .getByRole("listbox")
      .getByText(employmentStatus, { exact: true })
      .click();
    await this.saveBtn.click();
    await expect(this.page.getByText("Success", { exact: true })).toBeVisible();
  }

  async verifyJobDetails(employeeId, jobTitle, subUnit, employmentStatus) {
    const employeeRow = this.page
      .getByRole("row")
      .filter({ hasText: employeeId });

    await expect(employeeRow).toHaveCount(1);
    await expect(employeeRow).toContainText(jobTitle);
    await expect(employeeRow).toContainText(subUnit);
    await expect(employeeRow).toContainText(employmentStatus);
  }

  async deleteEmployeeDetails(firstName, middleName = "", lastName = "") {
    const employeeRow = this.page
      .getByRole("row")
      .filter({ hasText: firstName })
      .filter({ hasText: lastName });

    await expect(employeeRow).toHaveCount(1);
    await employeeRow.locator(".oxd-checkbox-input").click();
    await this.deleteBtn.click();
    await expect(this.confirmDeleteBtn).toBeVisible({ timeout: 5000 });
    await this.confirmDeleteBtn.click();
  }

  async verifyEmployeeNotFound(firstName, middleName = "", lastName = "") {
    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(" ");

    const employeeRow = this.page
      .locator(".oxd-table-body .oxd-table-row")
      .filter({ hasText: fullName });

    await expect(employeeRow).toHaveCount(0);
  }
}
module.exports = { PimPage };
