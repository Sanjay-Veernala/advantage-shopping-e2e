import { test, expect } from "../src/fixtures/test.fixture";
import { env } from "../src/config/environment";

const SPEAKER_NAME = "HP Roar Plus Wireless Speaker";

test.describe("Shopping cart", () => {
  test("should add a speaker to the cart with a selected color and quantity 1", async ({
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

    await test.step("2. Open the Speakers category", async () => {
      await homePage.openSpeakersCategory();
    });

    await test.step("3. Verify that speaker products are listed", async () => {
      await homePage.expectProductsListed();
    });

    await test.step("4. Select HP Roar Plus Wireless Speaker (or an available fallback)", async () => {
      await homePage.openCategoryProductByNameOrFirst(SPEAKER_NAME);
      await expect(productPage.productName).toBeVisible();
    });

    let productName = "";
    await test.step("5. Verify the product name and product image", async () => {
      productName = await productPage.getProductName();
      expect(productName.length).toBeGreaterThan(0);
      await productPage.expectProductImageVisible();
    });

    await test.step("6. Verify the displayed product price", async () => {
      await productPage.expectPriceVisible();
    });

    await test.step("7. Select one available product color", async () => {
      await productPage.selectFirstAvailableColor();
    });

    await test.step("8. Set quantity to 1", async () => {
      await productPage.setQuantity(1);
    });

    await test.step("9. Click ADD TO CART", async () => {
      await productPage.addToCart();
    });

    await test.step("10. Open the cart", async () => {
      await homePage.header.openCart();
    });

    await test.step("11. Verify the selected speaker is in the cart with quantity 1", async () => {
      await cartPage.expectProductInCartWithQuantity(productName, 1);
    });
  });
});
