import BasePage from './BasePage.js';
import { parseAmount } from '../utils/parsers.js';
import locators from './locators/cartLocators.js';

export default class CartPage extends BasePage {
    constructor(page) {
        super(page, 'CartPage');
        this.locators = locators;
    }

    async open() {
        await this.safeClick(this.locators.cartLink);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getTotal() {
        try {
            const totalText = await this.getText(this.locators.cartTotalLabel);
            const cartTotal = parseAmount(totalText);
            if (!Number.isNaN(cartTotal)) {
                return cartTotal;
            }
        } catch {
        }
        return 0;
    }

    async getItemsSubtotal() {
        try {
            for (const subtotalLocator of this.locators.cartItemSubtotalLabels) {
                const subtotalElements = this.page.locator(subtotalLocator);
                const subtotalCount = await subtotalElements.count();

                if (subtotalCount === 0) {
                    continue;
                }

                let subtotalSum = 0;

                for (let index = 0; index < subtotalCount; index++) {
                    const subtotalText = (await subtotalElements.nth(index).textContent())?.trim() || '';
                    const parsedSubtotal = parseAmount(subtotalText);
                    if (!Number.isNaN(parsedSubtotal)) {
                        subtotalSum += parsedSubtotal;
                    }
                }

                if (subtotalSum > 0) {
                    return subtotalSum;
                }
            }
        } catch {
        }
        return 0;
    }

    async isCartTotalMatchingItemsSubtotal() {
        await this.open();
        const itemsSubtotal = await this.getItemsSubtotal();
        const cartTotal = await this.getTotal();
        const cartTotalCents = Math.round(cartTotal * 100);
        const itemsSubtotalCents = Math.round(itemsSubtotal * 100);

        return cartTotalCents === itemsSubtotalCents;
    }
}
