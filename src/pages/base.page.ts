import { Locator, Page, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

/**
 * Base page: shared navigation helpers and loading guards.
 * Feature pages extend this and expose user-facing actions only.
 */
export abstract class BasePage {
  readonly page: Page;
  protected readonly path: string;

  constructor(page: Page, path = "/") {
    this.page = page;
    this.path = path;
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: "domcontentloaded" });
    await this.waitForReady();
  }

  /** Override when a page has a specific ready signal. */
  protected async waitForReady(): Promise<void> {
    await this.page.waitForLoadState("networkidle").catch(() => undefined);
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async expectUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }

  /** Click an element and wait for the resulting navigation to settle. */
  async clickAndWait(locator: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState("domcontentloaded"),
      locator.click(),
    ]);
  }

  async clearAndFill(locator: Locator, text: string): Promise<void> {
    await locator.clear();
    await locator.fill(text);
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? "";
  }

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  async waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout });
  }

  getUrl(): string {
    return this.page.url();
  }

  /** Save a full-page screenshot for debugging a failing step. */
  async debugScreenshot(stepName: string): Promise<string> {
    const dir = path.resolve("test-results", "debug-screenshots");
    fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.join(dir, `${stepName}_${ts}.png`);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }
}
