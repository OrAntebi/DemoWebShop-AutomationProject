import BasePage from './BasePage.js';
import locators from './locators/loginLocators.js';

export default class LoginPage extends BasePage {
    constructor(page) {
        super(page, 'LoginPage');
        this.locators = locators;
    }

    async login(username, password) {
        await this.safeFill(this.locators.usernameInput, username);
        await this.safeFill(this.locators.passwordInput, password);
        await this.safeClick(this.locators.signInButton);
        await this.page.waitForLoadState('domcontentloaded');
    }
}
