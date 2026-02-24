import { defineConfig, devices } from '@playwright/test';

const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const reportsRoot = `reports/${runId}`;

export default defineConfig({
    testDir: './tests',
    timeout: 60000,
    retries: 2,
    fullyParallel: true,
    workers: 3,

    reporter: [
        ['list'],
        ['html', { outputFolder: `${reportsRoot}/html`, open: 'never' }],
    ],

    use: {
        baseURL: 'https://demowebshop.tricentis.com',
        actionTimeout: 15000,
        ignoreHTTPSErrors: true,
        trace: 'retain-on-failure',
        screenshot: 'retain-on-failure',
        video: 'retain-on-failure',
        headless: true,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'edge',
            use: { ...devices['Desktop Edge'], channel: 'msedge' },
        },
    ],

    outputDir: `${reportsRoot}/test-results`,
});
