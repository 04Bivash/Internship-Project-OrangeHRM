const { expect } = require("@playwright/test");

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.profilePic = page.locator(".oxd-userdropdown-img");
    this.timeAtWorkLabel = page.getByText("Time at Work");
    this.myActionsLabel = page.getByText("My Actions");
    this.quickLaunchLabel = page.getByText("Quick Launch");
    this.buzzLatestPostsLabel = page.getByText("Buzz Latest Posts");
    this.employeesOnLeaveTodayLabel = page.getByText(
      "Employees on Leave Today",
    );
    this.employeeDistributionBySubUnit = page.getByText(
      "Employee Distribution by Sub Unit",
    );
    this.employeeDistributionByLocation = page.getByText(
      "Employee Distribution by Location",
    );
    this.adminLink = page.getByRole("link", { name: "Admin" });
    this.pimLink = page.getByRole("link", { name: "PIM" });
    this.leaveLink = page.getByRole("link", { name: "Leave" });
    this.buzzLink = page.getByRole("link", { name: "Buzz" });
    this.logoutBtn = page.locator("//a[text()='Logout']");
  }
  async verifyDashboardLoaded() {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.profilePic).toBeVisible();
  }
  async verifyWidgetsLoaded() {
    await expect(this.timeAtWorkLabel).toBeVisible();
    await expect(this.myActionsLabel).toBeVisible();
    await expect(this.quickLaunchLabel).toBeVisible();
    await expect(this.buzzLatestPostsLabel).toBeVisible();
    await expect(this.employeesOnLeaveTodayLabel).toBeVisible();
    await expect(this.employeeDistributionBySubUnit).toBeVisible();
    await expect(this.employeeDistributionByLocation).toBeVisible();
  }
  async verifySidebarItems() {
    await expect(this.adminLink).toBeVisible();
    await expect(this.pimLink).toBeVisible();
    await expect(this.leaveLink).toBeVisible();
    await expect(this.buzzLink).toBeVisible();
  }
  async logoutFromApplication() {
    await this.profilePic.click();
    await this.logoutBtn.click();
  }
}
module.exports = { DashboardPage };
