import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly productName: Locator;
  readonly addToCartButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('[data-ng-bind="product.productName"]');
    this.addToCartButton = page.locator('[data-ng-click="addProductToCart()"]');
    this.successToast = page.getByText('Product Added Successfully', { exact: false });
  }

  protected override async waitForReady(): Promise<void> {
    await expect(this.productName).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async expectProductName(name: string): Promise<void> {
    await expect(this.productName).toContainText(name, { ignoreCase: true });
  }
}
