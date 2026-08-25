import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

/** Order Payment page: shipping details step, payment method step, and order summary panel. */
export class CheckoutPage extends BasePage {
  readonly orderPaymentHeading: Locator;
  readonly shippingDetailsSection: Locator;
  readonly nextButton: Locator;
  readonly paymentMethodText: Locator;
  readonly orderSummaryHeading: Locator;
  readonly shippingCostText: Locator;
  readonly orderTotalText: Locator;
  readonly orderSummaryLinePrices: Locator;

  constructor(page: Page) {
    super(page, "/orderPayment");
    this.orderPaymentHeading = page.getByRole("heading", {
      name: "ORDER PAYMENT",
    });
    this.shippingDetailsSection = page
      .locator("article")
      .filter({
        has: page.locator('button[data-ng-click="shippingDetails_next()"]'),
      })
      .first();
    this.nextButton = page
      .locator('button[data-ng-click="shippingDetails_next()"]:visible')
      .first();
    this.paymentMethodText = page.getByText("Choose payment method below");
    this.orderSummaryHeading = page
      .locator("#userCart")
      .getByRole("heading", { name: "ORDER SUMMARY" });
    this.shippingCostText = page.locator("#shippingCost");
    this.orderTotalText = page.locator("#userCart .totalValue");
    this.orderSummaryLinePrices = page.locator(
      "#userCart table tr td:last-child p",
    );
  }

  protected override async waitForReady(): Promise<void> {
    await expect(this.orderPaymentHeading).toBeVisible();
  }

  async expectShippingDetailsVisible(): Promise<void> {
    await expect(this.shippingDetailsSection).toBeVisible({ timeout: 30_000 });
    await expect(this.nextButton).toBeVisible({ timeout: 30_000 });
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  async expectPaymentSummaryVisible(): Promise<void> {
    await expect(this.paymentMethodText).toBeVisible({ timeout: 30_000 });
    await expect(this.orderSummaryHeading).toBeVisible({ timeout: 30_000 });
    await expect(this.orderTotalText).toBeVisible({ timeout: 30_000 });
  }

  async getShippingCostValue(): Promise<number> {
    await expect(this.shippingCostText).toBeVisible({ timeout: 30_000 });
    const text = (await this.shippingCostText.textContent()) ?? "";
    const value = parseFloat(text.replace(/[^0-9.]/g, ""));
    expect(Number.isFinite(value)).toBe(true);
    return value;
  }

  async getOrderTotalValue(): Promise<number> {
    await expect(this.orderTotalText).toBeVisible({ timeout: 30_000 });
    const text = (await this.orderTotalText.textContent()) ?? "";
    const value = parseFloat(text.replace(/[^0-9.]/g, ""));
    expect(Number.isFinite(value)).toBe(true);
    return value;
  }

  async getOrderSummarySubtotal(): Promise<number> {
    await expect(this.orderSummaryLinePrices.first()).toBeVisible({
      timeout: 30_000,
    });
    const count = await this.orderSummaryLinePrices.count();
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const text =
        (await this.orderSummaryLinePrices.nth(i).textContent()) ?? "";
      sum += parseFloat(text.replace(/[^0-9.]/g, ""));
    }
    expect(Number.isFinite(sum)).toBe(true);
    expect(sum).toBeGreaterThan(0);
    return sum;
  }
}
