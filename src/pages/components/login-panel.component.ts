import { Locator, Page, expect } from "@playwright/test";

/** Login mini-panel in the header (username / password / sign in). */
export class LoginPanelComponent {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly createAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.signInButton = page.locator("#sign_in_btn");
    this.createAccountLink = page.locator(
      '[data-ng-click="createNewAccount()"]',
    );
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async goToRegistration(): Promise<void> {
    await this.createAccountLink.click();
    await expect(this.page).toHaveURL(/register/i);
  }

  async expectVisible(): Promise<void> {
    await expect(this.signInButton).toBeVisible();
  }
}
