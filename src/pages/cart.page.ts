import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
  readonly cartDropdown: Locator;
  readonly checkoutButton: Locator;
  readonly totalRow: Locator;
  readonly continueShoppingLink: Locator;
  readonly homeBreadcrumbLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cartDropdown = page.locator("#menuCart");
    this.checkoutButton = page.locator("#checkOutButton");
    this.totalRow = page
      .locator("#shoppingCart tr")
      .filter({ hasText: "TOTAL" })
      .first();
    this.continueShoppingLink = page.getByRole("link", {
      name: "CONTINUE SHOPPING",
      exact: true,
    });
    this.homeBreadcrumbLink = page.getByRole("link", {
      name: "HOME/",
      exact: true,
    });
  }

  async openDropdown(): Promise<void> {
    await this.cartDropdown.click();
  }

  async clearCart(): Promise<void> {
    await this.page.goto("/#/shoppingCart", { waitUntil: "domcontentloaded" });
    const rows = this.page.locator("#shoppingCart tr[ng-repeat]");
    await expect(
      this.page.getByRole("heading", { name: /SHOPPING CART/ }),
    ).toBeVisible();
    await rows
      .first()
      .waitFor({ state: "visible", timeout: 10_000 })
      .catch(() => undefined);
    const removeLinks = rows.locator("a.remove");
    while (await removeLinks.count()) {
      const countBeforeRemove = await rows.count();
      await removeLinks.first().click({ force: true });
      await expect(rows).toHaveCount(countBeforeRemove - 1, {
        timeout: 10_000,
      });
    }
    await expect(rows).toHaveCount(0, { timeout: 10_000 });
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  async continueShopping(): Promise<void> {
    // The "CONTINUE SHOPPING" link is only rendered visible in some checkout states.
    // A hard page.goto() would reload the SPA and wipe its in-memory cart state, so
    // use the in-app "HOME/" breadcrumb link instead — a pure client-side route change.
    await this.homeBreadcrumbLink.click();
  }

  async expectItemCountAtLeast(count: number): Promise<void> {
    const cartCount = this.page.locator(".cart-count");
    await expect(cartCount).toHaveText(String(count), { timeout: 15_000 });
  }

  cartRowByName(productName: string): Locator {
    return this.page
      .locator("#shoppingCart tr:visible")
      .filter({ hasText: productName });
  }

  async expectProductInCartWithQuantity(
    productName: string,
    quantity: number,
  ): Promise<void> {
    const row = this.cartRowByName(productName);
    await expect(row).toBeVisible();
    const quantityLabel = row.locator("label").filter({ hasText: /^\d+$/ });
    await expect(quantityLabel).toHaveText(String(quantity));
  }

  async expectProductInCartWithQuantityAndColor(
    productName: string,
    quantity: number,
    color: string,
  ): Promise<void> {
    await this.expectProductInCartWithQuantity(productName, quantity);
    if (color) {
      // Color is only reliably exposed via the swatch's title attribute, not always as visible text
      const swatch = this.cartRowByName(productName)
        .locator(".productColor")
        .first();
      await expect(swatch).toHaveAttribute(
        "title",
        new RegExp(`^${color}$`, "i"),
      );
    }
  }

  /** Navigates back to the product page (edit mode) to change the quantity of a line already in the cart. */
  async openEditForProduct(productName: string): Promise<void> {
    await this.cartRowByName(productName).locator("a.edit").click();
  }

  async getLineTotalForProduct(productName: string): Promise<number> {
    const text = (await this.cartRowByName(productName).textContent()) ?? "";
    const matches = text.match(/\$[\d,.]+/g) ?? [];
    const last = matches[matches.length - 1];
    return last ? parseFloat(last.replace(/[^0-9.]/g, "")) : NaN;
  }

  async getCartTotalValue(): Promise<number> {
    const text = (await this.totalRow.textContent()) ?? "";
    const match = text.match(/\$[\d,.]+/);
    return match ? parseFloat(match[0].replace(/[^0-9.]/g, "")) : NaN;
  }
}
