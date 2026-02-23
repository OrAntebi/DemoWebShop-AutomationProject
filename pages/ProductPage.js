import BasePage from './BasePage.js';
import locators from './locators/productLocators.js';

export default class ProductPage extends BasePage {
    constructor(page) {
        super(page, 'ProductPage');
        this.locators = locators;
    }

    async selectVariants() {
        try {
            await this.pickRandomDropdowns();
            await this.pickRandomRadios();
            await this.pickRandomCheckboxes();
            await this.fillTextInputs();
        } catch {
        }
    }

    async pickRandomDropdowns() {
        const selects = this.page.locator('select:not([disabled])');
        const count = await selects.count();
        for (let i = 0; i < count; i++) {
            const options = selects.nth(i).locator('option:not([disabled]):not([value=""])');
            const optionCount = await options.count();
            if (optionCount === 0) continue;
            const value = await options.nth(Math.floor(Math.random() * optionCount)).getAttribute('value');
            if (value) await selects.nth(i).selectOption(value);
        }
    }

    async pickRandomRadios() {
        const radios = this.page.locator('input[type="radio"]:not([disabled])');
        const count = await radios.count();
        const groups = {};
        for (let i = 0; i < count; i++) {
            const name = await radios.nth(i).getAttribute('name');
            if (!name) continue;
            if (!groups[name]) groups[name] = [];
            groups[name].push(radios.nth(i));
        }
        for (const group of Object.values(groups)) {
            await group[Math.floor(Math.random() * group.length)].check();
        }
    }

    async pickRandomCheckboxes() {
        const checkboxes = this.page.locator('input[type="checkbox"]:not([disabled])');
        const count = await checkboxes.count();
        for (let i = 0; i < count; i++) {
            const isChecked = await checkboxes.nth(i).isChecked();
            if (!isChecked && Math.random() > 0.5) await checkboxes.nth(i).check();
        }
    }

    async fillTextInputs() {
        const inputs = this.page.locator('.attributes input[type="text"]:not([disabled])');
        const inputCount = await inputs.count();
        for (let i = 0; i < inputCount; i++) await inputs.nth(i).fill('Custom Text');

        const textAreas = this.page.locator('.attributes textarea:not([disabled])');
        const textAreaCount = await textAreas.count();
        for (let i = 0; i < textAreaCount; i++) await textAreas.nth(i).fill('Custom Text');
    }

    async addToCart() {
        await this.selectVariants();

        try {
            await this.click(this.locators.addToCartButton, { timeout: 5000 });
            await this.page.waitForLoadState('domcontentloaded').catch(() => { });
            await this.page.waitForTimeout(2000);
            return true;
        } catch {
            return false;
        }
    }

    async addItemsToCart(urls) {
        let addedItemsCount = 0;
        const searchPageUrl = this.page.url();

        for (let itemIndex = 0; itemIndex < urls.length; itemIndex++) {
            try {
                await this.page.goto(urls[itemIndex], { waitUntil: 'domcontentloaded', timeout: 30000 });
                const added = await this.addToCart();
                if (added) {
                    addedItemsCount++;
                }
            } catch {
            } finally {
                await this.page.goto(searchPageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => { });
            }
        }
        return addedItemsCount;
    }
}
