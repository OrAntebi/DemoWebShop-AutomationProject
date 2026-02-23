function toNumber(value, fallbackValue) {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isFinite(parsed) ? parsed : fallbackValue;
}

const runtimeConfig = {
    locatorTimeout: toNumber(process.env.LOCATOR_TIMEOUT, 7000),
    retryAttempts: toNumber(process.env.RETRY_ATTEMPTS, 3),
    retryBaseDelay: toNumber(process.env.RETRY_BASE_DELAY, 1000),
};

export default runtimeConfig;
