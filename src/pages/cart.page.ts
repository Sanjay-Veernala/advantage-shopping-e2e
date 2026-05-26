import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly cartDropdown: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartDropdown = page.locator('#menuCart');
    this.checkoutButton = page.locator('#checkOutButton');
  }

  async openDropdown(): Promise<void> {
    await this.cartDropdown.click();
  }

  async expectItemCountAtLeast(count: number): Promise<void> {
    const cartCount = this.page.locator('.cart-count');
    await expect(cartCount).toHaveText(String(count), { timeout: 15_000 });
  }
}
