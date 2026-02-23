import { defineConfig, devices } from '@playwright/test';

const runId = process.env.RUN_ID || new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const reportsRoot = `${process.env.REPORTS_DIR || 'reports'}/${runId}`;
const remoteEndpoint = process.env.GRID_URL || process.env.PW_WS_ENDPOINT;
const workerCount = Number.parseInt(process.env.WORKERS || '3', 10);
const retryCount = Number.parseInt(process.env.RETRIES || '2', 10);
const testTimeout = Number.parseInt(process.env.TIMEOUT || '60000', 10);
const actionTimeout = Number.parseInt(process.env.ACTION_TIMEOUT || '15000', 10);
const isHeadless = (process.env.HEADLESS || 'false').toLowerCase() === 'true';
const browserList = (process.env.BROWSERS || 'chromium').split(',').map(name => name.trim().toLowerCase()).filter(Boolean);

const projectMap = {
    chromium: {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
    },
    firefox: {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
    },
    webkit: {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
    },
    edge: {
        name: 'edge',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
};

const projects = browserList
    .map(browserName => projectMap[browserName])
    .filter(Boolean);

export default defineConfig({
    testDir: './tests',
    timeout: testTimeout,
    retries: retryCount,
    fullyParallel: true,
    workers: workerCount,

    reporter: [
        ['list'],
        ['html', { outputFolder: `${reportsRoot}/html`, open: 'never' }],
        ['junit', { outputFile: `${reportsRoot}/junit.xml` }],
    ],

    use: {
        baseURL: process.env.BASE_URL || 'https://demowebshop.tricentis.com',
        actionTimeout,
        ignoreHTTPSErrors: true,
        screenshot: 'on',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        headless: isHeadless,
        ...(remoteEndpoint ? { connectOptions: { wsEndpoint: remoteEndpoint } } : {}),
    },

    projects: projects.length > 0 ? projects : [projectMap.chromium],

    outputDir: `${reportsRoot}/test-results`,
});
