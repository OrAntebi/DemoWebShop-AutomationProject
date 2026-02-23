import { test, expect } from '../fixtures/pageFixtures.js';
import testData from '../data/testData.json' assert { type: 'json' };

test.describe('Store E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  for (const scenario of testData.scenarios) {
    test(`${scenario.name}: search, cart, verify`, async ({ homePage, productPage, cartPage }) => {
      const urls = await homePage.searchItemsByNameUnderPrice(
        scenario.query,
        scenario.maxPrice,
        scenario.limit,
      );

      if (urls.length === 0) {
        test.skip(true, `No items found for "${scenario.query}" under ${scenario.maxPrice}`);
        return;
      }

      const addedCount = await productPage.addItemsToCart(urls);
      expect(addedCount).toBeGreaterThan(0);

      await cartPage.assertCartTotalNotExceeds(scenario.maxPrice, addedCount);
    });
  }
});
