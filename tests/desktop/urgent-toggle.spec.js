import { test, expect } from '@playwright/test';

test.describe('TC-005: Тогл "Только срочные"', () => {
  
  const cards = (page) => page.locator('[class*="card"]').filter({ visible: true });
  const urgentBadge = (page) => page.locator('._card__priority_15fhn_172');
  
  const urgentToggle = (page) => 
    page.locator('[class*="urgentToggle__label"]').filter({ hasText: /срочн/i });

  test('Тогл должен показывать только срочные объявления', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await cards(page).first().waitFor({ state: 'visible', timeout: 10000 });
    
    const totalCount = await cards(page).count();
    const urgentCount = await urgentBadge(page).count();
    
    await urgentToggle(page).waitFor({ state: 'visible', timeout: 10000 });
    await urgentToggle(page).click();
    await page.waitForTimeout(600);
    
    const filteredCount = await cards(page).count();
    
    expect(filteredCount).toBeLessThanOrEqual(totalCount);
    
    if (urgentCount > 0 && filteredCount > 0) {
      for (let i = 0; i < Math.min(filteredCount, 5); i++) {
        await expect(cards(page).nth(i).locator('._card__priority_15fhn_172')).toBeVisible();
      }
    }
  });
});