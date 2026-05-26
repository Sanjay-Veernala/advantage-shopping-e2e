import { test } from '../../src/fixtures/test.fixture';
import users from '../../test-data/users.json';

test.describe('Shopping cart', () => {
  test('should add a popular product to the cart', async ({
    homePage,
    productPage,
    cartPage,
    registrationPage,
    newUser,
  }) => {
    await homePage.goto();
    await homePage.goToRegistration();
    await registrationPage.register(newUser);

    await homePage.openPopularItems();
    await homePage.openProductDetails(users.sampleProduct);

    await productPage.expectProductName(users.sampleProduct);
    await productPage.addToCart();
    await cartPage.expectItemCountAtLeast(1);
  });
});
