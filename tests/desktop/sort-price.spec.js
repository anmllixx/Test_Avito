import { test, expect } from '@playwright/test';

test.describe('TC-002/003: Сортировка по цене (возрастание и убывание)', () => {
  
  const sortBySelect = (page) => page.locator('._filters__select_1iunh_21').nth(0);
  const orderSelect = (page) => page.locator('._filters__select_1iunh_21').nth(1);
  const priceLocator = (page) => page.locator('[class*="card__price"]');

  async function getPrices(page) {
    const texts = await priceLocator(page).allTextContents();
    return texts.map(t => parseInt(t.replace(/\D/g, '')));
  }

  test('Сортировка по возрастанию и убыванию должна работать корректно', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await priceLocator(page).first().waitFor({ state: 'visible', timeout: 10000 });
    
    await sortBySelect(page).selectOption({ value: 'price' });
    await orderSelect(page).selectOption({ value: 'asc' });
    await page.waitForTimeout(800);
    
    const pricesAsc = await getPrices(page);
    
    for (let i = 0; i < pricesAsc.length - 1; i++) {
      expect(pricesAsc[i]).toBeLessThanOrEqual(pricesAsc[i + 1]);
    }
    
    await orderSelect(page).selectOption({ value: 'desc' });
    await page.waitForTimeout(800);
    
    const pricesDesc = await getPrices(page);
    
    for (let i = 0; i < pricesDesc.length - 1; i++) {
      expect(pricesDesc[i]).toBeGreaterThanOrEqual(pricesDesc[i + 1]);
    }
  });
});