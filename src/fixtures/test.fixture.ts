import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { RegistrationPage } from '../pages/registration.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { buildNewUser, type NewUser } from '../utils/data-generator';

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  productPage: ProductPage;
  cartPage: CartPage;
  newUser: NewUser;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  newUser: async ({}, use) => {
    await use(buildNewUser());
  },
});

export { expect } from '@playwright/test';
