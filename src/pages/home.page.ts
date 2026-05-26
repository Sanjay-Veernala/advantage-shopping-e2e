import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { LoginPanelComponent } from './components/login-panel.component';

export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly loginPanel: LoginPanelComponent;
  readonly popularItemsLink: Locator;
  readonly searchResultsHeading: Locator;

  constructor(page: Page) {
    super(page, '/');
    this.header = new HeaderComponent(page);
    this.loginPanel = new LoginPanelComponent(page);
    this.popularItemsLink = page.getByRole('link', { name: 'POPULAR ITEMS' });
    this.searchResultsHeading = page.locator('#searchResultLabel');
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
    await expect(this.page.getByRole('heading', { name: 'POPULAR ITEMS' })).toBeVisible();
  }

  async expectSearchResultsFor(query: string): Promise<void> {
    await expect(this.searchResultsHeading).toContainText(query, { ignoreCase: true });
  }

  productCardByName(productName: string): Locator {
    return this.page
      .locator('.productName')
      .filter({ hasText: productName })
      .first();
  }

  async openProductDetails(productName: string): Promise<void> {
    const card = this.productCardByName(productName);
    await card.locator('..').getByRole('link', { name: 'View Details' }).click();
  }
}
