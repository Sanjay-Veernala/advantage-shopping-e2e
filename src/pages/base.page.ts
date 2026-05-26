import { Locator, Page, expect } from '@playwright/test';

/**
 * Base page: shared navigation helpers and loading guards.
 * Feature pages extend this and expose user-facing actions only.
 */
export abstract class BasePage {
  readonly page: Page;
  protected readonly path: string;

  constructor(page: Page, path = '/') {
    this.page = page;
    this.path = path;
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitForReady();
  }

  /** Override when a page has a specific ready signal. */
  protected async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async expectUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
}
