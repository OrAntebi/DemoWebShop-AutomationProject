import runtimeConfig from '../config/runtimeConfig.js';

export async function executeWithRetry(
    action,
    attempts = runtimeConfig.retryAttempts,
    baseDelay = runtimeConfig.retryBaseDelay,
) {

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await action();
            
        } catch (error) {
            if (attempt === attempts) throw error;

            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}