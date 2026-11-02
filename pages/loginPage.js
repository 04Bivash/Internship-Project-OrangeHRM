const { expect } = require("@playwright/test");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByPlaceholder("Username");
    this.password = page.getByPlaceholder("Password");
    this.loginBtn = page.getByRole("button", { name: "Login" });
    this.usernameRequired = page.locator(
      "//label[text()='Username']/ancestor::div[contains(@class,'oxd-input-group')]//span",
    );
    this.passwordRequired = page.locator(
      "//label[text() = 'Password']/ancestor::div[contains(@class,'oxd-input-group')]//span",
    );
    this.invalidCredentialsErrorMsg = page.locator(
      "//p[text()='Invalid credentials']",
    );
    this.header = page.locator("//h5[text()='Login']");
    this.accountDisabledMsg = page.locator("//p[text()='Account disabled']");
  }
  async loginToApplication(username, password) {
    await this.username.pressSequentially(username, { delay: 50 });
    await this.password.pressSequentially(password, { delay: 50 });
    await this.loginBtn.click();
  }
  async verifyUsernameRequired() {
    await expect(this.usernameRequired).toBeVisible();
  }
  async verifyPasswordRequired() {
    await expect(this.passwordRequired).toBeVisible();
  }
  async verifyBothFieldsRequired() {
    await expect(this.usernameRequired).toBeVisible();
    await expect(this.passwordRequired).toBeVisible();
  }
  async verifyInvalidCredentialsMessage() {
    await expect(this.invalidCredentialsErrorMsg).toBeVisible();
  }
  async verifyAccountDisabledMessage() {
    await expect(this.accountDisabledMsg).toBeVisible();
  }
  async verifyHeaderVisibility() {
    await expect(this.header).toBeVisible();
  }
}

module.exports = { LoginPage };
