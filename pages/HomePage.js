import BasePage from './BasePage.js';
import SearchResultsPage from './SearchResultsPage.js';
import locators from './locators/homeLocators.js';

export default class HomePage extends BasePage {
    constructor(page) {
        super(page, 'HomePage');
        this.locators = locators;
    }

    async searchItemsByNameUnderPrice(query, maxPrice, limit = 5) {
        await this.search(query);
        const searchResultsPage = new SearchResultsPage(this.page);
        await searchResultsPage.applyPriceFilter(maxPrice);
        const urls = await searchResultsPage.collectItemsUnderPrice(maxPrice, limit);
        return urls;
    }

    async search(query) {
        await this.safeFill(this.locators.searchInput, query);
        await this.safeClick(this.locators.searchButton);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async goToSignIn() {
        await this.safeClick(this.locators.signInLink);
    }
}
