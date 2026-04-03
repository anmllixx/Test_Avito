import { test, expect } from '@playwright/test';

test.describe('TC-004: Фильтр "Категория"', () => {
  
  const cards = (page) => page.locator('[class*="card"]').filter({ visible: true });
  const cardCategory = (page) => page.locator('[class*="card__category"]');
  
  const categorySelect = (page) => 
    page.locator('select').filter({ has: page.locator('option[value="2"]') });

  test('Фильтр должен показывать только объявления выбранной категории', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await cards(page).first().waitFor({ state: 'visible', timeout: 10000 });
    
    const initialCount = await cards(page).count();
    
    await categorySelect(page).selectOption({ value: '2' });
    await page.waitForTimeout(600);
    
    const selectedValue = await categorySelect(page).inputValue();
    expect(selectedValue).toBe('2');
    
    const filteredCount = await cards(page).count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    if (filteredCount > 0) {
      const expectedCategory = await cardCategory(page).first().textContent();
      const checksCount = Math.min(filteredCount, 5);
      for (let i = 0; i < checksCount; i++) {
        const cardCat = await cardCategory(page).nth(i).textContent();
        expect(cardCat?.trim()).toBe(expectedCategory?.trim());
      }
    }
  });
});