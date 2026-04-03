import { test, expect } from '@playwright/test';

test.describe('TC-001: Фильтр "Диапазон цен" (десктоп)', () => {
  
  const priceFrom = (page) => page.locator('input[placeholder="От"]');
  const priceTo = (page) => page.locator('input[placeholder="До"]');
  const cardPrice = (page) => page.locator('[class*="card__price"]');

  const parsePrice = (text) => parseInt(text.replace(/\D/g, ''));

  test('Фильтр должен показывать только объявления от 5000 до 30000 ₽', async ({ page }) => {
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await cardPrice(page).first().waitFor({ state: 'visible', timeout: 10000 });
    
    const pricesBefore = await cardPrice(page).allTextContents();
    
    const filtersBtn = page.locator('text=Фильтры, button:has-text("Фильтры")').first();
    if (await filtersBtn.isVisible()) {
      await filtersBtn.click();
      await page.waitForTimeout(300);
    }
    
    await priceFrom(page).fill('5000');
    await priceTo(page).fill('30000');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const pricesAfter = await cardPrice(page).allTextContents();
    const pricesNumeric = pricesAfter.map(parsePrice);
    
    expect(pricesNumeric.length, 'После фильтра не осталось объявлений').toBeGreaterThan(0);
    
    for (const price of pricesNumeric) {
      expect(price, `Цена ${price} ₽ меньше нижней границы 5000 ₽`).toBeGreaterThanOrEqual(5000);
    }
    
    for (const price of pricesNumeric) {
      expect(price, `Цена ${price} ₽ превышает верхнюю границу 30000 ₽ (БАГ: фильтр не работает)`).toBeLessThanOrEqual(30000);
    }
  });
});