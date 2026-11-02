const { expect } = require("@playwright/test");

class AdminPage {
  constructor(page) {
    this.page = page;
    this.adminHeading = page.getByRole("heading", { name: "Admin" });
    this.addBtn = page.getByRole("button", { name: "Add" });
    this.username = page.locator(
      "//label[text()='Username']/parent::div/following-sibling::div/input",
    );
    this.userRole = page.locator(
      "//label[text()='User Role']/parent::div/following-sibling::div/div/div/div[@class='oxd-select-text-input']",
    );
    this.status = page.locator(
      "//label[text()='Status']/parent::div/following-sibling::div/div/div/div[@class='oxd-select-text-input']",
    );
    this.employeeName = page.locator(
      "//label[text()='Employee Name']/parent::div/following-sibling::div/div/div/input",
    );
    this.password = page.locator(
      "//label[text()='Password']/parent::div/following-sibling::div/input",
    );
    this.cPassword = page.locator(
      "//label[text()='Confirm Password']/parent::div/following-sibling::div/input",
    );
    this.saveBtn = page.getByRole("button", { name: "Save" });
    this.searchUsername = page.locator(
      "//label[text()='Username']/parent::div/following-sibling::div/input",
    );
    this.searchBtn = page.getByRole("button", { name: "Search" });
    this.confirmDeleteBtn = page.getByRole("button", { name: "Yes, Delete" });
  }

  async verifyAdminPageLoaded() {
    await expect(this.page).toHaveURL(/admin/);
    await expect(this.adminHeading).toBeVisible();
  }

  async addUser(userRole, employeeName, status, username, password, cPassword) {
    await this.addBtn.click();
    await this.userRole.click();
    await this.page.getByText(userRole, { exact: true }).click();
    await this.employeeName.fill(employeeName);
    await this.page.getByText(employeeName, { exact: true }).click();
    await this.status.click();
    await this.page.getByText(status, { exact: true }).click();
    await this.username.fill(username);
    await this.password.fill(password);
    await this.cPassword.fill(cPassword);
    await this.saveBtn.click();
  }
  async verifyEmployeeAdded() {
    await expect(this.page.getByText("Success", { exact: true })).toBeVisible();
  }
  async searchUser(username) {
    await this.searchUsername.fill(username);
    await this.searchBtn.click();
  }

  async verifyUserDetails(username, userRole, status) {
    const userRow = this.page
      .getByRole("row")
      .filter({ hasText: username })
      .filter({ hasText: userRole })
      .filter({ hasText: status });

    await expect(userRow).toHaveCount(1);
    await expect(userRow).toBeVisible();
    await expect(userRow).toContainText(username);
    await expect(userRow).toContainText(userRole);
    await expect(userRow).toContainText(status);
  }

  async editUser(username, updateItem) {
    const userRow = this.page.getByRole("row").filter({ hasText: username });
    await userRow.getByRole("button").last().click();
    await this.status.click();
    await this.page.getByText(updateItem, { exact: true }).click();
    await this.saveBtn.click();
  }

  async deleteUser(username) {
    const userRow = this.page.getByRole("row").filter({ hasText: username });
    await userRow.getByRole("button").first().click();
    await expect(this.confirmDeleteBtn).toBeVisible({ timeout: 30000 });
    await this.confirmDeleteBtn.click();
  }

  async verifyUserNotFound(username) {
    const userRow = this.page.getByRole("row").filter({ hasText: username });
    await expect(userRow).toHaveCount(0);
  }
}

module.exports = { AdminPage };
