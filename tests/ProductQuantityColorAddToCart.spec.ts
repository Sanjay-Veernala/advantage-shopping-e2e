import { test, expect } from "../src/fixtures/test.fixture";
import { env } from "../src/config/environment";

const PRODUCT_NAME = "HP Roar Plus Wireless Speaker";

test.describe("Product details", () => {
  test("should update quantity, select a color and add the product to the cart", async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    const { username, password } = env.testUser;
    if (!username || !password)
      throw new Error("TEST_USERNAME and TEST_PASSWORD are required in .env");

    await test.step("1. Login to the application", async () => {
      await homePage.goto();
      await homePage.openLoginPanel();
      await homePage.loginPanel.signIn(username, password);
      await homePage.header.expectSignedInAs(username);
      await cartPage.clearCart();
    });

    await test.step("2. Open the selected product details page", async () => {
      await homePage.openSpeakersCategory();
      await homePage.openCategoryProductByName(PRODUCT_NAME);
      await productPage.expectProductName(PRODUCT_NAME);
    });

    let productName = "";
    await test.step("3. Verify product name, image, description and price", async () => {
      productName = await productPage.getProductName();
      expect(productName.length).toBeGreaterThan(0);
      await productPage.expectProductImageVisible();
      await productPage.expectDescriptionVisible();
      await productPage.expectPriceVisible();
    });

    await test.step("4. Verify color/option controls are displayed when supported", async () => {
      await productPage.expectColorOptionsVisibleIfSupported();
    });

    let selectedColor = "";
    await test.step("5. Select one available color/option", async () => {
      selectedColor = await productPage.selectFirstAvailableColor();
    });

    await test.step("6. Set the quantity to 2", async () => {
      await productPage.setQuantity(2);
    });

    let unitPrice = NaN;
    await test.step("7. Verify the displayed price/total reflects the selected quantity when the UI provides a total", async () => {
      unitPrice = await productPage.getUnitPriceValue();
      // This product page only shows the unit price (no live running total); the total is
      // verified against quantity on the cart page in step 10, where the UI does provide one.
      await productPage.expectPriceVisible();
    });

    await test.step("8. Click ADD TO CART", async () => {
      await productPage.addToCart();
    });

    await test.step("9. Open the cart", async () => {
      await homePage.header.openCart();
    });

    await test.step("10. Verify product name, selected option/color and quantity 2", async () => {
      await cartPage.expectProductInCartWithQuantityAndColor(
        productName,
        2,
        selectedColor,
      );
      if (!Number.isNaN(unitPrice)) {
        const total = await cartPage.getCartTotalValue();
        expect(total).toBeCloseTo(unitPrice * 2, 2);
      }
    });
  });
});
