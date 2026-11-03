const { expect } = require("@playwright/test");
class BuzzPage {
  constructor(page) {
    this.page = page;
    this.buzzHeading = page.getByRole("heading", { name: "Buzz" });
    this.postTextArea = page.getByPlaceholder("What's on your mind?");
    this.postBtn = page.getByRole("button", { name: "Post", exact: true });
    this.posts = page.locator(".orangehrm-buzz-post");
    this.mostRecentBtn = page.getByRole("button", {
      name: "Most Recent Posts",
    });
    this.sharePhotosBtn = page.getByRole("button", { name: "Share Photos" });
    this.photoDialog = page.getByRole("dialog");
    this.photoTextArea = this.photoDialog.getByPlaceholder(
      "What's on your mind?",
    );
    this.fileInput = this.photoDialog.locator('input[type="file"]');
    this.imgShareBtn = this.photoDialog.getByRole("button", {
      name: "Share",
      exact: true,
    });
    this.editPostOption = page
      .getByRole("listitem")
      .filter({ hasText: "Edit" });
    this.editTextArea = page.locator("textarea");
    this.saveEditBtn = page.getByRole("button", { name: "Save", exact: true });
    // this.menuBtn = page.locator("//div[contains(@class,'orangehrm-buzz-post-header-config')]//button");
    this.editBtn = page.getByText("Edit Post", { exact: true });
    this.deletebtn = page.getByText("Delete Post", { exact: true });
    this.confirmDeleteBtn = page.getByRole("button", { name: "Yes, Delete" });
    this.editDialog = page.getByRole("dialog");
    this.editTextArea = this.editDialog.locator("textarea");
    this.saveEditBtn = this.editDialog.getByRole("button", {
      name: "Post",
      exact: true,
    });
  }
  async verifyBuzzPageLoaded() {
    await expect(this.page).toHaveURL(/buzz/);
    await expect(this.buzzHeading).toBeVisible();
  }

  async createTextPost(message) {
    await this.postTextArea.fill(message);
    await this.postBtn.click();
  }

  async verifyTextPost(message) {
    await this.mostRecentBtn.click();
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }

  async createPhotoPost(message, imagePath) {
    await this.sharePhotosBtn.click();
    await this.photoTextArea.fill(message);
    await this.fileInput.setInputFiles(imagePath);
    await expect(this.imgShareBtn).toBeEnabled();
    await this.imgShareBtn.click();
  }

  async verifyPhotoPost(message) {
    await this.mostRecentBtn.click();
    const post = this.page.getByText(message, { exact: true });
    await expect(post).toBeVisible();
    await expect(
      post
        .locator("xpath=ancestor::div[contains(@class,'orangehrm-buzz-post')]")
        .locator("img"),
    ).toBeVisible();
  }

  async editTextPost(message, updatedMessage) {
    const menuBtn = this.page.locator(
      `//p[text()='${message}']/ancestor::div[contains(@class,'orangehrm-buzz-post-body')]/ancestor::div[contains(@class,'oxd-sheet oxd-sheet--rounded oxd-sheet--white orangehrm-buzz')]/div/div/div[contains(@class,'orangehrm-buzz-post-header-config')]//button`,
    );
    await menuBtn.click();
    await this.editBtn.click();
    await this.editTextArea.fill(updatedMessage);
    await this.saveEditBtn.click();
    await expect(
      this.page.getByText(updatedMessage, { exact: true }),
    ).toBeVisible();
  }

  async deleteTextPost(message) {
    const menuBtn = this.page.locator(
      `//p[text()='${message}']/ancestor::div[contains(@class,'orangehrm-buzz-post-body')]/ancestor::div[contains(@class,'oxd-sheet oxd-sheet--rounded oxd-sheet--white orangehrm-buzz')]/div/div/div[contains(@class,'orangehrm-buzz-post-header-config')]//button`,
    );
    await menuBtn.click();
    await this.deletebtn.click();
    await expect(this.confirmDeleteBtn).toBeVisible({ timeout: 30000 });
    await this.confirmDeleteBtn.click();
    await this.page.getByText("Successfully Deleted", { exact: true });
  }
}
module.exports = { BuzzPage };
