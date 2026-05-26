import { Page } from '@playwright/test';
import { HomePage } from './home.page';

/** Login flows composed from home + header login panel. */
export class LoginPage {
  readonly home: HomePage;

  constructor(page: Page) {
    this.home = new HomePage(page);
  }

  async open(): Promise<void> {
    await this.home.goto();
    await this.home.openLoginPanel();
  }

  async login(username: string, password: string): Promise<void> {
    await this.home.loginPanel.signIn(username, password);
  }

  async loginAndExpectSignedIn(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.home.header.expectSignedInAs(username);
  }
}
