import { test } from '../fixtures/pageFixtures.js';
import testData from '../data/testData.json' assert { type: 'json' };

test.describe('Store Login Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
    });

    test('Login flow', async ({ homePage, loginPage }) => {
        const { username, password } = testData.login;
        test.skip(!username, 'No credentials provided');

        await homePage.goToSignIn();
        await loginPage.login(username, password);
    });
});
