import { test, expect } from "../src/fixtures/test.fixture";
import { env } from "../src/config/environment";

test.describe("Login", () => {
  test("should sign in with a registered user and show authenticated account options", async ({
    homePage,
  }) => {
    const { username, password } = env.testUser;
    if (!username || !password)
      throw new Error("TEST_USERNAME and TEST_PASSWORD are required in .env");

    await test.step("1. Launch the Advantage Online Shopping application", async () => {
      await homePage.goto();
    });

    await test.step("2. Click the user/account icon", async () => {
      await homePage.openLoginPanel();
    });

    await test.step("3-5. Enter the registered username/password and click SIGN IN", async () => {
      await homePage.loginPanel.signIn(username, password);
    });

    await test.step("6-7. Wait for authenticated UI state and verify the username is displayed", async () => {
      // Auto-retrying Playwright assertion — no hard wait
      await homePage.header.expectSignedInAs(username);
    });

    await test.step("8. Verify My Account / My Orders options are available", async () => {
      await homePage.header.expectAccountOptionsAvailable();
    });
  });
});
