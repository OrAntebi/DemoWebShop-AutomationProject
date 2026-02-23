import { test as baseTest } from '@playwright/test';
import HomePage from '../pages/HomePage.js';
import ProductPage from '../pages/ProductPage.js';
import CartPage from '../pages/CartPage.js';
import LoginPage from '../pages/LoginPage.js';

const test = baseTest.extend({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    productPage: async ({ page }, use) => {
        const productPage = new ProductPage(page);
        await use(productPage);
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
});

export { test };
export { expect } from '@playwright/test';
