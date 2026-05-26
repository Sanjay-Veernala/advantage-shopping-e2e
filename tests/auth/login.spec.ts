import { test } from '../../src/fixtures/test.fixture';
import { hasStoredTestUser } from '../../src/config/environment';

test.describe('Login', () => {
  test.skip(!hasStoredTestUser(), 'Set TEST_USERNAME, TEST_PASSWORD, and TEST_EMAIL in .env');

  test('should sign in with credentials from environment', async ({
    loginPage,
  }) => {
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;
    await loginPage.open();
    await loginPage.loginAndExpectSignedIn(username, password);
  });
});

test.describe('Login after registration', () => {
  test('should sign in with a newly registered user', async ({
    homePage,
    loginPage,
    registrationPage,
    newUser,
  }) => {
    await homePage.goto();
    await homePage.goToRegistration();
    await registrationPage.register(newUser);

    await homePage.header.openUserMenu();
    await homePage.page.getByRole('link', { name: 'Sign out' }).click();

    await loginPage.open();
    await loginPage.loginAndExpectSignedIn(newUser.username, newUser.password);
  });
});
