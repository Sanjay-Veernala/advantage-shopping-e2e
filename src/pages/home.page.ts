import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { HeaderComponent } from "./components/header.component";
import { LoginPanelComponent } from "./components/login-panel.component";

export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly loginPanel: LoginPanelComponent;
  readonly popularItemsLink: Locator;
  readonly searchResultsHeading: Locator;
  readonly speakersCategoryLink: Locator;

  constructor(page: Page) {
    super(page, "/");
    this.header = new HeaderComponent(page);
    this.loginPanel = new LoginPanelComponent(page);
    this.popularItemsLink = page.getByRole("link", { name: "POPULAR ITEMS" });
    this.searchResultsHeading = page.locator("#searchResultLabel");
    this.speakersCategoryLink = page.getByRole("link", {
      name: "SpeakersCategory",
      exact: true,
    });
  }

  /** Opens the header user menu and waits for the sign-in mini panel. */
  async openLoginPanel(): Promise<void> {
    await this.header.openUserMenu();
    await this.loginPanel.expectVisible();
  }

  async goToRegistration(): Promise<void> {
    await this.openLoginPanel();
    await this.loginPanel.goToRegistration();
  }

  async openPopularItems(): Promise<void> {
    await this.popularItemsLink.click();
    await expect(
      this.page.getByRole("heading", { name: "POPULAR ITEMS" }),
    ).toBeVisible();
  }

  async openSpeakersCategory(): Promise<void> {
    await this.speakersCategoryLink.click();
    await expect(this.page).toHaveURL(/category\/Speakers/i);
  }

  async expectSearchResultsFor(query: string): Promise<void> {
    await expect(this.searchResultsHeading).toContainText(query, {
      ignoreCase: true,
    });
  }

  /** Product grid links shared by category and search-result pages (scoped to exclude unrelated "recently viewed"/compare widgets that reuse the .productName class). */
  private productGridLinks(): Locator {
    return this.page.locator(".category-type-products a.productName");
  }

  async expectProductsListed(minCount = 1): Promise<void> {
    const links = this.productGridLinks();
    await expect(links.first()).toBeVisible();
    expect(await links.count()).toBeGreaterThanOrEqual(minCount);
  }

  /** Verifies the search results grid contains a product matching the given name (falls back to any result). */
  async expectSearchResultsContainProduct(productName: string): Promise<void> {
    const links = this.productGridLinks();
    await expect(links.first()).toBeVisible();
    const named = links.filter({ hasText: productName });
    expect(await named.count()).toBeGreaterThan(0);
  }

  /** Opens a search-result product by name, falling back to the first listed result if unavailable. */
  async openSearchResultByNameOrFirst(productName: string): Promise<void> {
    const links = this.productGridLinks();
    const named = links.filter({ hasText: productName }).first();
    if (await named.count()) {
      await named.click();
    } else {
      await links.first().click();
    }
    await expect(this.page).toHaveURL(/product\//i);
  }

  /** Opens a category-grid product by name, guaranteed to differ from excludeName even when falling back. */
  async openCategoryProductByNameOrFirstExcluding(
    productName: string,
    excludeName: string,
  ): Promise<void> {
    const candidates = this.productGridLinks().filter({
      hasNotText: excludeName,
    });
    const named = candidates.filter({ hasText: productName }).first();
    if (await named.count()) {
      await named.click();
    } else {
      await candidates.first().click();
    }
    await expect(this.page).toHaveURL(/product\//i);
  }

  productCardByName(productName: string): Locator {
    return this.page
      .locator(".productName")
      .filter({ hasText: productName })
      .first();
  }

  async openProductDetails(productName: string): Promise<void> {
    const card = this.productCardByName(productName);
    await card
      .locator("..")
      .getByRole("link", { name: "View Details" })
      .click();
  }

  /** Opens a category-grid product by name, falling back to the first listed product if unavailable. */
  async openCategoryProductByNameOrFirst(productName: string): Promise<void> {
    const links = this.productGridLinks();
    const named = links.filter({ hasText: productName }).first();
    if (await named.count()) {
      await expect(named).toBeVisible({ timeout: 30_000 });
      await named.click();
    } else {
      await links.first().click();
    }
    await expect(this.page).toHaveURL(/product\//i);
  }

  async openCategoryProductByName(productName: string): Promise<void> {
    const product = this.productGridLinks()
      .filter({ hasText: productName })
      .first();
    await expect(product).toBeVisible({ timeout: 30_000 });
    await product.click();
    await expect(this.page).toHaveURL(/product\//i);
  }
}
