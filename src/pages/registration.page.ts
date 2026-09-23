import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import type { NewUser } from "../utils/data-generator";

export class RegistrationPage extends BasePage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly countrySelect: Locator;
  readonly cityInput: Locator;
  readonly addressInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly agreeTermsLabel: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    super(page, "/");
    this.usernameInput = page.locator('input[name="usernameRegisterPage"]');
    this.emailInput = page.locator('input[name="emailRegisterPage"]');
    this.passwordInput = page.locator('input[name="passwordRegisterPage"]');
    this.confirmPasswordInput = page.locator(
      'input[name="confirm_passwordRegisterPage"]',
    );
    this.firstNameInput = page.locator('input[name="first_nameRegisterPage"]');
    this.lastNameInput = page.locator('input[name="last_nameRegisterPage"]');
    this.phoneInput = page.locator('input[name="phone_numberRegisterPage"]');
    this.countrySelect = page.locator(
      'select[name="countryListboxRegisterPage"]',
    );
    this.cityInput = page.locator('input[name="cityRegisterPage"]');
    this.addressInput = page.locator('input[name="addressRegisterPage"]');
    this.stateInput = page.locator(
      'input[name="state_/_province_/_regionRegisterPage"]',
    );
    this.postalCodeInput = page.locator(
      'input[name="postal_codeRegisterPage"]',
    );
    this.agreeTermsLabel = page.locator("label.checkboxText");
    this.registerButton = page.locator("#register_btn");
  }

  protected override async waitForReady(): Promise<void> {
    await expect(this.page).toHaveURL(/register/i);
    await expect(this.registerButton).toBeVisible();
  }

  async register(user: NewUser): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.phoneInput.fill(user.phone);
    await this.countrySelect.selectOption({ label: user.country });
    await this.cityInput.fill(user.city);
    await this.addressInput.fill(user.address);
    await this.stateInput.fill(user.state);
    await this.postalCodeInput.fill(user.postalCode);
    await this.agreeTermsLabel.click();
    await this.registerButton.click();
    // UI-state assertion instead of a hard wait — confirms registration finished
    await expect(this.page.locator(".hi-user").first()).toContainText(
      user.username,
      {
        timeout: 20_000,
      },
    );
  }
}
