import Logger from '../utils/Logger.js';
import { executeWithRetry } from '../utils/retry.js';
import runtimeConfig from '../config/runtimeConfig.js';

export default class BasePage {
    constructor(page, pageName = 'BasePage') {
        this.page = page;
        this.logger = new Logger(pageName);
    }

    async find(locators) {
        const timeout = runtimeConfig.locatorTimeout;

        for (let index = 0; index < locators.length; index++) {
            try {
                const element = this.page.locator(locators[index]).first();
                await element.waitFor({ state: 'visible', timeout });
                this.logger.info(`Locator OK [${index + 1}/${locators.length}]: ${locators[index]}`);
                return element;
            } catch (error) {
                this.logger.warn(`Locator FAIL [${index + 1}/${locators.length}]: ${locators[index]} - ${error.message.split('\n')[0]}`);
            }
        }

        this.logger.error(`All locators failed: ${JSON.stringify(locators)}`);
        throw new Error(`All locators failed: ${JSON.stringify(locators)}`);
    }

    async click(locators) {
        const element = await this.find(locators);
        await element.click();
        return element;
    }

    async fill(locators, value) {
        const element = await this.find(locators);
        await element.fill(value);
        return element;
    }

    async getText(locators) {
        const element = await this.find(locators);
        return (await element.textContent()).trim();
    }

    async safeClick(locators) {
        return executeWithRetry(async () => this.click(locators));
    }

    async safeFill(locators, value) {
        return executeWithRetry(async () => this.fill(locators, value));
    }
}
