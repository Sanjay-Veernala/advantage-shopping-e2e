import { test, expect } from "../src/fixtures/test.fixture";
import { env } from "../src/config/environment";

const SEARCH_PRODUCT_NAME = "HP Roar Plus Wireless Speaker";

test.describe("Search", () => {
  test("should search for a product and add the matching result to the cart", async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    const { username, password } = env.testUser;
    if (!username || !password)
      throw new Error("TEST_USERNAME and TEST_PASSWORD are required in .env");

    await test.step("1. Login using the configured test user", async () => {
      await homePage.goto();
      await homePage.openLoginPanel();
      await homePage.loginPanel.signIn(username, password);
      await homePage.header.expectSignedInAs(username);
      await cartPage.clearCart();
    });

    await test.step("2-4. Locate the search field/icon, enter the product name, and submit", async () => {
      await homePage.header.search(SEARCH_PRODUCT_NAME);
    });

    await test.step("5. Verify the result list contains the searched product", async () => {
      await homePage.expectSearchResultsFor(SEARCH_PRODUCT_NAME);
      await homePage.expectSearchResultsContainProduct(SEARCH_PRODUCT_NAME);
    });

    await test.step("6. Open the matching product", async () => {
      await homePage.openSearchResultByNameOrFirst(SEARCH_PRODUCT_NAME);
      await expect(productPage.productName).toBeVisible();
    });

    let productName = "";
    await test.step("7. Verify the product name matches the selected test data", async () => {
      productName = await productPage.getProductName();
      expect(productName.toLowerCase()).toContain(
        SEARCH_PRODUCT_NAME.toLowerCase(),
      );
    });

    await test.step("8. Verify product price and availability are displayed", async () => {
      await productPage.expectPriceVisible();
      await productPage.expectAvailable();
    });

    await test.step("9. Select the required product color option", async () => {
      await productPage.selectFirstAvailableColor();
    });

    await test.step("10. Set quantity to 1 and click ADD TO CART", async () => {
      await productPage.setQuantity(1);
      await productPage.addToCart();
    });

    await test.step("11. Open the cart and verify the product", async () => {
      await homePage.header.openCart();
      await cartPage.expectProductInCartWithQuantity(productName, 1);
    });
  });
});
