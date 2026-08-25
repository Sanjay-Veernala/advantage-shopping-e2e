import { test, expect } from "../src/fixtures/test.fixture";
import { env } from "../src/config/environment";

const PRODUCT_NAME = "HP Roar Plus Wireless Speaker";

test.describe("Checkout", () => {
  test("should verify shipping and order summary before payment", async ({
    homePage,
    productPage,
    cartPage,
    checkoutPage,
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

    let productName = "";
    await test.step("2. Select an available product and add it to the cart", async () => {
      await homePage.openSpeakersCategory();
      await homePage.openCategoryProductByNameOrFirst(PRODUCT_NAME);
      await expect(productPage.productName).toBeVisible();
      productName = await productPage.getProductName();
      await productPage.setQuantity(1);
      await productPage.addToCart();
    });

    await test.step("3. Open the cart using the cart icon", async () => {
      await homePage.header.openCart();
    });

    let cartTotalBeforeCheckout = NaN;
    await test.step("4. Verify product name, quantity and price", async () => {
      await cartPage.expectProductInCartWithQuantity(productName, 1);
      const lineTotal = await cartPage.getLineTotalForProduct(productName);
      expect(lineTotal).toBeGreaterThan(0);
      cartTotalBeforeCheckout = await cartPage.getCartTotalValue();
    });

    await test.step("5. Click CHECKOUT", async () => {
      await cartPage.checkoutButton.click();
    });

    await test.step("6. Verify the shipping details section is displayed", async () => {
      await expect(checkoutPage.orderPaymentHeading).toBeVisible();
      await checkoutPage.expectShippingDetailsVisible();
    });

    await test.step("7. Review the pre-populated shipping information", async () => {
      // Shipping details are pre-filled from registration; just confirm content is present
      const text =
        (await checkoutPage.shippingDetailsSection.textContent()) ?? "";
      expect(text).toMatch(/shipping details/i);
      expect(text.trim().length).toBeGreaterThan(20);
    });

    await test.step("8. Click NEXT", async () => {
      await checkoutPage.clickNext();
    });

    await test.step("9. Verify the order/payment summary before payment", async () => {
      await checkoutPage.expectPaymentSummaryVisible();
    });

    await test.step("10. Verify the order total matches the cart total before payment", async () => {
      const subtotal = await checkoutPage.getOrderSummarySubtotal();
      expect(subtotal).toBeCloseTo(cartTotalBeforeCheckout, 2);

      const shipping = await checkoutPage.getShippingCostValue();
      const orderTotal = await checkoutPage.getOrderTotalValue();
      expect(orderTotal).toBeCloseTo(subtotal + shipping, 2);
    });
  });
});
