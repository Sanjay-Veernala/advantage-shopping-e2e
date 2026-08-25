import { test, expect } from "../src/fixtures/test.fixture";
import { env } from "../src/config/environment";

const PRODUCT_1_NAME = "HP Roar Plus Wireless Speaker";
const PRODUCT_2_NAME = "HP Roar Wireless Speaker";

test.describe("Cart", () => {
  test("should track quantity changes and multiple products with a consistent total", async ({
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

    let product1Name = "";
    let unitPrice1 = NaN;
    await test.step("2. Open Product 1 and add it to the cart with quantity 1", async () => {
      await homePage.openSpeakersCategory();
      await homePage.openCategoryProductByNameOrFirst(PRODUCT_1_NAME);
      await expect(productPage.productName).toBeVisible();
      product1Name = await productPage.getProductName();
      unitPrice1 = await productPage.getUnitPriceValue();
      await productPage.setQuantity(1);
      await productPage.addToCart();
    });

    await test.step("3. Open the cart", async () => {
      await homePage.header.openCart();
    });

    await test.step("4. Verify Product 1, quantity 1 and displayed price", async () => {
      await cartPage.expectProductInCartWithQuantity(product1Name, 1);
      const lineTotal = await cartPage.getLineTotalForProduct(product1Name);
      expect(lineTotal).toBeCloseTo(unitPrice1, 2);
    });

    await test.step("5. Increase Product 1 quantity from 1 to 2", async () => {
      await cartPage.openEditForProduct(product1Name);
      await productPage.setQuantity(2);
      await productPage.addToCart();
    });

    await test.step("6. Verify the line total/cart total is recalculated", async () => {
      await cartPage.expectProductInCartWithQuantity(product1Name, 2);
      const lineTotal = await cartPage.getLineTotalForProduct(product1Name);
      expect(lineTotal).toBeCloseTo(unitPrice1 * 2, 2);
      const cartTotal = await cartPage.getCartTotalValue();
      expect(cartTotal).toBeCloseTo(unitPrice1 * 2, 2);
    });

    let product2Name = "";
    await test.step("7. Continue shopping and open Product 2", async () => {
      await cartPage.continueShopping();
      await homePage.openSpeakersCategory();
      await homePage.openCategoryProductByNameOrFirstExcluding(
        PRODUCT_2_NAME,
        product1Name,
      );
      await expect(productPage.productName).toBeVisible();
      product2Name = await productPage.getProductName();
      // Guard against the fallback picking the same product already in the cart
      expect(product2Name.toLowerCase()).not.toBe(product1Name.toLowerCase());
    });

    await test.step("8. Add Product 2 to the cart", async () => {
      await productPage.setQuantity(1);
      await productPage.addToCart();
    });

    await test.step("9. Open the cart again", async () => {
      await homePage.header.openCart();
    });

    await test.step("10. Verify Product 1 quantity 2 and Product 2 quantity 1", async () => {
      await cartPage.expectProductInCartWithQuantity(product1Name, 2);
      await cartPage.expectProductInCartWithQuantity(product2Name, 1);
    });

    await test.step("11. Verify the final cart total is consistent with the cart contents", async () => {
      const line1Total = await cartPage.getLineTotalForProduct(product1Name);
      const line2Total = await cartPage.getLineTotalForProduct(product2Name);
      const cartTotal = await cartPage.getCartTotalValue();
      expect(cartTotal).toBeCloseTo(line1Total + line2Total, 2);
    });
  });
});
