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

    async assertCartTotalNotExceeds(budgetPerItem, itemsCount) {
        const maximumAllowedTotal = budgetPerItem * itemsCount;

        await this.open();
        const cartTotal = await this.getTotal();

        if (cartTotal > maximumAllowedTotal) {
            throw new Error(
                `Cart total ${cartTotal} exceeds budget ${maximumAllowedTotal} (${budgetPerItem} x ${itemsCount})`
            );
        }
    }
}
