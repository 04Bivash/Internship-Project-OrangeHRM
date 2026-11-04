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
    this.editBtn = page.getByText("Edit Post", { exact: true });
    this.deletebtn = page.getByText("Delete Post", { exact: true });
    this.confirmDeleteBtn = page.getByRole("button", { name: "Yes, Delete" });
    this.editDialog = page.getByRole("dialog");
    this.editTextArea = this.editDialog.locator("textarea");
    this.saveEditBtn = this.editDialog.getByRole("button", {
      name: "Post",
      exact: true,
    });
    this.commentBtn = page.locator("button:has(.bi-chat-text-fill)");
    this.commentInput = page.getByPlaceholder("Write a comment...");
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

  async getLikeCount(post) {
    const likeCount = post
      .locator(".orangehrm-buzz-stats-row")
      .filter({ hasText: /Likes?/ })
      .locator("p");

    return parseInt(await likeCount.textContent(), 10);
  }

  async likePost(message) {
    const post = this.page.locator(
      `//p[text()='${message}']/ancestor::div[contains(@class,'orangehrm-buzz-post-body')]/ancestor::div[contains(@class,'oxd-sheet oxd-sheet--rounded oxd-sheet--white orangehrm-buzz')]`,
    );
    const likeBtn = post.locator("#heart-svg");
    const currentCount = await this.getLikeCount(post);
    await likeBtn.click();
    const expectedCount = currentCount + 1;
    const expectedText = `${expectedCount} Like${expectedCount === 1 ? "" : "s"}`;
    const likeCount = post
      .locator(".orangehrm-buzz-stats-row")
      .filter({ hasText: /Likes?/ })
      .locator("p");

    await expect(likeCount).toHaveText(expectedText);
  }

  async unlikePost(message) {
    const post = this.page.locator(
      `//p[text()='${message}']/ancestor::div[contains(@class,'orangehrm-buzz-post-body')]/ancestor::div[contains(@class,'oxd-sheet oxd-sheet--rounded oxd-sheet--white orangehrm-buzz')]`,
    );
    const likeBtn = post.locator("#heart-svg");
    const currentCount = await this.getLikeCount(post);
    await likeBtn.click();
    const expectedCount = currentCount - 1;
    const expectedText = `${expectedCount} Like${expectedCount === 1 ? "" : "s"}`;
    const likeCount = post
      .locator(".orangehrm-buzz-stats-row")
      .filter({ hasText: /Likes?/ })
      .locator("p");
    await expect(likeCount).toHaveText(expectedText);
  }

  async commentOnPost(message, comment) {
    const post = this.page.locator(
      `//p[text()='${message}']/ancestor::div[contains(@class,'orangehrm-buzz-post-body')]/ancestor::div[contains(@class,'oxd-sheet oxd-sheet--rounded oxd-sheet--white orangehrm-buzz')]`,
    );
    const commentCount = post
      .locator(".orangehrm-buzz-stats-row")
      .filter({ hasText: /Comments?/ })
      .getByText(/^\d+ Comments?$/);
    const currentCount = parseInt(await commentCount.textContent(), 10);
    await post.locator("button:has(.bi-chat-text-fill)").click();
    const commentInput = post.getByPlaceholder("Write your comment...");
    await commentInput.fill(comment);
    await commentInput.press("Enter");
    await expect(post.getByText(comment, { exact: true })).toBeVisible();
    const expectedCount = currentCount + 1;
    const expectedText = `${expectedCount} Comment${expectedCount === 1 ? "" : "s"}`;
    await expect(commentCount).toHaveText(expectedText);
  }
}
module.exports = { BuzzPage };
