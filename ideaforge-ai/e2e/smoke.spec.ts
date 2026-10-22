import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/IdeaForge/);
  await expect(page.locator("nav")).toBeVisible();
});

test("register and login flow", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  await page.goto("/register");
  await page.fill('input[type="text"]', "E2E User");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', "TestPass123!");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard**", { timeout: 10000 });

  await page.goto("/login");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', "TestPass123!");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard**", { timeout: 10000 });
});

test("no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});
