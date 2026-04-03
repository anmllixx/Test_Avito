import { test, expect } from '@playwright/test';

test.describe('Переключение темы на мобильной версии', () => {
  
  const themeToggle = (page) => page.locator('._themeToggle_127us_1');
  
  const isDarkTheme = (page) => 
    page.locator('button[aria-label="Switch to light theme"]');
  
  const isLightTheme = (page) => 
    page.locator('button[aria-label="Switch to dark theme"]');

  test('TC-009: Переключение на тёмную тему', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const toggle = themeToggle(page);
    
    await toggle.waitFor({ state: 'visible', timeout: 10000 });
    await toggle.click();
    
    await expect(isDarkTheme(page)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('._icon--dark_127us_31')).toBeVisible();
  });
  
  test('TC-010: Переключение на светлую тему', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const toggle = themeToggle(page);
    
    await toggle.click();
    await expect(isDarkTheme(page)).toBeVisible();
    
    await toggle.click();
    await expect(isLightTheme(page)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('._icon--light_127us_28')).toBeVisible();
  });
});