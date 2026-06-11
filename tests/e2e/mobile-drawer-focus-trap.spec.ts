import { expect, test } from "@playwright/test";

test.describe("mobile drawer accessibility", () => {
  test("keeps keyboard focus trapped inside drawer until closed", async ({ page }) => {
    await page.goto("/home");

    const menuToggle = page.locator("button.mobile-dock-menu");
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();

    const drawer = page.locator("#primary-sidebar");
    await expect(drawer).toBeVisible();

    const closeButton = drawer.getByRole("button", { name: /close side menu/i });
    await expect(closeButton).toBeFocused();

    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press("Tab");
      const focusedInside = await drawer.evaluate((element) => {
        const active = document.activeElement;
        return active instanceof HTMLElement ? element.contains(active) : false;
      });
      expect(focusedInside).toBeTruthy();
    }

    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press("Shift+Tab");
      const focusedInside = await drawer.evaluate((element) => {
        const active = document.activeElement;
        return active instanceof HTMLElement ? element.contains(active) : false;
      });
      expect(focusedInside).toBeTruthy();
    }

    await page.keyboard.press("Escape");
    await expect(drawer).not.toHaveClass(/mobile-open/);
    await expect(page.locator("button.sidebar-toggle")).toBeFocused();
  });
});
