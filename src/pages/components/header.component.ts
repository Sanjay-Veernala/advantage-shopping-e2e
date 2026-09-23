import { Locator, Page, expect } from "@playwright/test";

/** Top navigation: search, cart, and user account entry points. */
export class HeaderComponent {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartIcon: Locator;
  readonly userMenuIcon: Locator;
  readonly signedInUserLabel: Locator;
  readonly myAccountOption: Locator;
  readonly myOrdersOption: Locator;
  readonly signOutOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(
      "Search AdvantageOnlineShopping.com",
    );
    this.searchButton = page.locator("#menuSearch:visible").first();
    this.cartIcon = page.locator("#menuCart:visible").first();
    this.userMenuIcon = page.locator("#menuUserLink");
    this.signedInUserLabel = page.locator(".hi-user:visible").first();
    this.myAccountOption = page
      .locator("a:visible, label.option:visible")
      .filter({ hasText: "My account" })
      .first();
    this.myOrdersOption = page
      .locator("a:visible, label.option:visible")
      .filter({ hasText: "My orders" })
      .first();
    this.signOutOption = page
      .locator("a:visible, label.option:visible")
      .filter({ hasText: "Sign out" })
      .first();
  }

  async search(query: string): Promise<void> {
    await this.searchButton.click();
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }

  async openUserMenu(): Promise<void> {
    await this.userMenuIcon.click();
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async expectSignedInAs(username: string): Promise<void> {
    await expect(this.signedInUserLabel).toContainText(username, {
      ignoreCase: true,
      timeout: 30_000,
    });
  }

  /** Opens the account dropdown and verifies My Account / My Orders are available. */
  async expectAccountOptionsAvailable(): Promise<void> {
    await this.openUserMenu();
    await expect(this.myAccountOption).toBeVisible();
    await expect(this.myOrdersOption).toBeVisible();
  }

  async signOut(): Promise<void> {
    await this.openUserMenu();
    await this.signOutOption.click();
  }
}
