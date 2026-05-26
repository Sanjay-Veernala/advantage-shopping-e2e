import { Locator, Page, expect } from '@playwright/test';

/** Top navigation: search, cart, and user account entry points. */
export class HeaderComponent {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartIcon: Locator;
  readonly userMenuIcon: Locator;
  readonly signedInUserLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search AdvantageOnlineShopping.com');
    this.searchButton = page.locator('#menuSearch');
    this.cartIcon = page.locator('#menuCart');
    this.userMenuIcon = page.locator('#menuUserLink');
    this.signedInUserLabel = page.locator('.hi-user').first();
  }

  async search(query: string): Promise<void> {
    await this.searchButton.click();
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async openUserMenu(): Promise<void> {
    await this.userMenuIcon.click();
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async expectSignedInAs(username: string): Promise<void> {
    await expect(this.signedInUserLabel).toContainText(username, { ignoreCase: true });
  }
}
