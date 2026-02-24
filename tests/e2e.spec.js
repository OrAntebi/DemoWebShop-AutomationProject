import { test, expect } from '../fixtures/pageFixtures.js';
import testData from '../data/testData.json' assert { type: 'json' };

test.describe('Store Business Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  for (const scenario of testData.scenarios) {
    const { name, query, maxPrice, limit } = scenario;

    test(`${name}: customer buys within budget`, async ({ homePage, productPage, cartPage }) => {
      const eligibleProductUrls = await homePage.searchItemsByNameUnderPrice(query, maxPrice, limit);

      if (eligibleProductUrls.length === 0) {
        test.skip(true, `No eligible products were available for this business scenario (${name}).`);
        return;
      }

      const addedItemsCount = await productPage.addItemsToCart(eligibleProductUrls);
      const isCartTotalConsistent = await cartPage.isCartTotalMatchingItemsSubtotal();

      expect(addedItemsCount).toBeGreaterThan(0);
      expect(isCartTotalConsistent).toBe(true);
    });
  }
});
