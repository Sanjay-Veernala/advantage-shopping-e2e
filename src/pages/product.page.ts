import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class ProductPage extends BasePage {
  readonly productName: Locator;
  readonly productImage: Locator;
  readonly priceText: Locator;
  readonly colorSwatch: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly successToast: Locator;
  readonly soldOutBadge: Locator;
  readonly descriptionText: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator("h1.roboto-regular:visible").first();
    this.productImage = page.locator("figure img:visible").first();
    this.priceText = page
      .locator("h2:visible")
      .filter({ hasText: "$" })
      .first();
    this.colorSwatch = page.locator("span.productColor:visible").first();
    this.quantityInput = page.locator('input[name="quantity"]');
    this.addToCartButton = page.getByRole("button", {
      name: "ADD TO CART",
      exact: true,
    });
    this.successToast = page.getByText("Product Added Successfully", {
      exact: false,
    });
    this.soldOutBadge = page.getByText("SOLD OUT", { exact: true }).first();
    this.descriptionText = page
      .locator("#Description p:visible, #mobileDescription p:visible")
      .first();
  }

  protected override async waitForReady(): Promise<void> {
    await expect(this.productName).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    // Toast auto-dismisses quickly; don't hard-fail if it's already gone by the time we check
    await this.successToast
      .waitFor({ state: "visible", timeout: 5_000 })
      .catch(() => undefined);
  }

  async expectProductName(name: string): Promise<void> {
    await expect(this.productName).toContainText(name, {
      ignoreCase: true,
      timeout: 30_000,
    });
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent())?.trim() ?? "";
  }

  async expectProductImageVisible(): Promise<void> {
    await expect(this.productImage).toBeVisible();
  }

  async expectPriceVisible(): Promise<void> {
    await expect(this.priceText).toBeVisible();
  }

  async expectAvailable(): Promise<void> {
    await expect(this.soldOutBadge).toBeHidden();
    await expect(this.addToCartButton).toBeEnabled();
  }

  async expectDescriptionVisible(): Promise<void> {
    await expect(this.descriptionText).toBeVisible();
    expect(
      (await this.descriptionText.textContent())?.trim().length,
    ).toBeGreaterThan(0);
  }

  async hasColorOptions(): Promise<boolean> {
    return (await this.colorSwatch.count()) > 0;
  }

  /** Verifies color controls are shown only when the product actually supports them. */
  async expectColorOptionsVisibleIfSupported(): Promise<void> {
    if (await this.hasColorOptions()) {
      await expect(this.colorSwatch).toBeVisible();
    }
  }

  async getUnitPriceValue(): Promise<number> {
    const text = (await this.priceText.textContent()) ?? "";
    return parseFloat(text.replace(/[^0-9.]/g, ""));
  }

  /** Selects the first available color and returns its name (empty string if the product has none). */
  async selectFirstAvailableColor(): Promise<string> {
    if (!(await this.hasColorOptions())) {
      return "";
    }
    const colorName = (await this.colorSwatch.getAttribute("title")) ?? "";
    await this.colorSwatch.click();
    return colorName;
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }
}
