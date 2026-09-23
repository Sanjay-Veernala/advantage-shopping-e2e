import { test, expect } from "../src/fixtures/test.fixture";

test.describe("Registration", () => {
  test("should create a new account with full personal and address details", async ({
    homePage,
    registrationPage,
    newUser,
  }) => {
    await test.step("Launch the Advantage Online Shopping application", async () => {
      await homePage.goto();
    });

    await test.step("Open the user menu and go to CREATE NEW ACCOUNT", async () => {
      await homePage.goToRegistration();
    });

    await test.step("Fill account, personal, and address details and register", async () => {
      // register() fills every field (account/personal/address) and submits the form
      await registrationPage.register(newUser);
    });

    await test.step("Verify registration finished via signed-in state (no hard wait)", async () => {
      await homePage.header.expectSignedInAs(newUser.username);
    });
  });
});
