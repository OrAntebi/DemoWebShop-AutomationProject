import BasePage from './BasePage.js';
import { extractNumber, normalizeStoreItemUrl } from '../utils/parsers.js';
import locators from './locators/searchResultsLocators.js';

export default class SearchResultsPage extends BasePage {
    constructor(page) {
        super(page, 'SearchResults');
        this.locators = locators;
    }

    async applyPriceFilter(maximumPrice) {
        try {
            const advancedSearchElement = await this.find(this.locators.advancedSearchCheckbox);
            const advancedSearchChecked = await advancedSearchElement.isChecked();
            if (!advancedSearchChecked) {
                await advancedSearchElement.check();
            }

            await this.fill(this.locators.priceMinInput, '0');
            await this.fill(this.locators.priceMaxInput, String(maximumPrice));
            await this.click(this.locators.priceSubmitButton);

            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForTimeout(500);
            return true;
        } catch {
            return false;
        }
    }

    async collectItemsUnderPrice(maximumPrice, limit) {
        const collectedUrls = [];
        let hasNextPage = true;
        const maxPagesToScan = 8;
        let currentPage = 0;
        const productItemsXPath = 'xpath=//div[contains(@class,"product-item")]';
        const priceXPath = 'xpath=.//*[contains(@class,"actual-price") or contains(@class,"product-price") or contains(@class,"price")]';
        const linkXPath = 'xpath=.//h2[contains(@class,"product-title")]//a | .//div[contains(@class,"details")]//a';

        while (collectedUrls.length < limit && hasNextPage && currentPage < maxPagesToScan) {
            currentPage++;
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForTimeout(700);

            const resultItems = this.page.locator(productItemsXPath);
            const itemCount = await resultItems.count();

            for (let index = 0; index < itemCount && collectedUrls.length < limit; index++) {
                try {
                    const currentItem = resultItems.nth(index);

                    const priceElements = currentItem.locator(priceXPath);
                    const priceCount = await priceElements.count();
                    if (priceCount === 0) continue;

                    const priceText = await priceElements.first().textContent({ timeout: 2000 });
                    const parsedPrice = extractNumber(priceText);
                    if (parsedPrice === null || parsedPrice > maximumPrice) continue;

                    const itemLink = currentItem.locator(linkXPath).first();
                    const rawItemUrl = await itemLink.getAttribute('href', { timeout: 2000 });
                    const validItemUrl = normalizeStoreItemUrl(rawItemUrl);

                    if (validItemUrl && !collectedUrls.includes(validItemUrl)) {
                        collectedUrls.push(validItemUrl);
                    }
                } catch {
                    continue;
                }
            }

            if (itemCount === 0) {
                break;
            }

            hasNextPage = collectedUrls.length < limit ? await this.goToNextPage() : false;
        }
        return collectedUrls;
    }

    async goToNextPage() {
        try {
            const nextButton = await this.find(this.locators.nextPageButton);
            await nextButton.click();
            await this.page.waitForLoadState('domcontentloaded');
            return true;
        } catch {
            return false;
        }
    }
}
