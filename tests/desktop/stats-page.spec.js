import { test, expect } from '@playwright/test';

test.describe('TC-006, TC-007, TC-008: Страница статистики', () => {

  const statsLink = (page) => page.locator('a[href="/stats"]');
  const pauseBtn = (page) => page.locator('button[aria-label="Отключить автообновление"]');
  const startBtn = (page) => page.locator('button[aria-label="Включить автообновление"]');
  const refreshBtn = (page) => page.locator('button[aria-label="Обновить сейчас"]');
  
  const progressBar = (page) => page.locator('[class*="progressBar"]');
  const progressFill = (page) => page.locator('[class*="progressFill"]');
  const disabledMessage = (page) => page.locator('[class*="disabled"]');

  async function getProgressWidth(page) {
    const fill = progressFill(page);
    if (await fill.count() === 0) return 0;
    
    await fill.waitFor({ state: 'visible', timeout: 5000 });
    const style = await fill.getAttribute('style');
    const match = style?.match(/width:\s*([\d.]+)%/);
    return match ? parseFloat(match[1]) : 0;
  }

  async function navigateToStats(page) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await statsLink(page).waitFor({ state: 'visible', timeout: 10000 });
    await statsLink(page).click();
    await page.waitForLoadState('networkidle');
    await progressBar(page).waitFor({ state: 'visible', timeout: 10000 });
  }

  test('TC-006: Кнопка "Обновить" должна обновлять статистику', async ({ page }) => {
    await navigateToStats(page);
    
    await expect(async () => {
      const width = await getProgressWidth(page);
      expect(width).toBeGreaterThan(0.1);
    }).toPass({ timeout: 5000, intervals: [500, 1000, 1500] });
    
    const widthBefore = await getProgressWidth(page);
    
    await refreshBtn(page).click();
    
    await expect(async () => {
      const width = await getProgressWidth(page);
      expect(width).toBeLessThan(widthBefore);
    }).toPass({ timeout: 3000, intervals: [300, 600, 1000] });
  });

  test('TC-007/TC-008: Пауза таймера и попытка возобновления', async ({ page }) => {
    await navigateToStats(page);
    
    await expect(async () => {
      const w = await getProgressWidth(page);
      expect(w).toBeGreaterThan(0.1);
    }).toPass({ timeout: 5000 });
    
    const progressStart = await getProgressWidth(page);
    await page.waitForTimeout(2000);
    const progressAfterWait = await getProgressWidth(page);
    
    expect(progressAfterWait, 'Таймер не тикает в обычном режиме')
      .toBeGreaterThan(progressStart);
    
    await pauseBtn(page).click();
    await page.waitForTimeout(500);
    
    await expect(disabledMessage(page)).toBeVisible({ timeout: 5000 });
    await expect(progressBar(page)).toBeHidden({ timeout: 5000 });
    
    await startBtn(page).click();
    await page.waitForTimeout(500);
    
    await expect(disabledMessage(page)).toBeHidden({ timeout: 5000 });
    await expect(progressBar(page)).toBeVisible({ timeout: 5000 });
    
    await expect(async () => {
      const w = await getProgressWidth(page);
      expect(w).toBeGreaterThan(0.1);
    }).toPass({ timeout: 5000 });
    
    const progressResumed = await getProgressWidth(page);
    
    expect(progressResumed, 'БАГ: Кнопка Старт не запустила таймер')
      .toBeGreaterThan(0);
  });
});