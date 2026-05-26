import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('Registration', () => {
  test('should register a new user and show signed-in state', async ({
    homePage,
    registrationPage,
    newUser,
  }) => {
    await homePage.goto();
    await homePage.goToRegistration();
    await registrationPage.register(newUser);
  });
});
