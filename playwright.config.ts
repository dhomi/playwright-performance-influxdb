import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';


const gitlabArtifactsUrl = !!process.env.CI ? `${process.env.CI_PROJECT_URL}/-/jobs/${process.env.CI_JOB_ID}/artifacts/raw/playwright-report/data/` : "";
const gitlabReporter = [['junit', { outputFile: 'junit-results.xml' }], ['html', { open: 'never', attachmentsBaseURL: gitlabArtifactsUrl }]];
const desktopReporter = [['html', { open: 'always' }]];

const testDir = defineBddConfig({
  importTestFrom: 'steps/fixtures.ts',
  paths: ['./features'],
  require: ['./steps/*.ts'],
  quotes: 'backtick',
  featuresRoot: './features',
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir,
  snapshotDir: process.env.CI ? './snapshots' : './snapshots/localhost' ,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? gitlabReporter : desktopReporter,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Run tests within files in parallel */
  fullyParallel: false,
  /* Do not retry to surface test issues early */
  retries: process.env.CI ? 1 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Playwright enforces a timeout for each test, 30 seconds by default. Time spent by the test function, fixtures, beforeEach and afterEach hooks is included in the test timeout */
  timeout: 75 * 1000,
  expect: {
    timeout: 75 * 1000
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* run headless when running in GitLab */
    headless: !!process.env.CI,
    /* Timeout for each Playwright action in milliseconds. Defaults to 0 (no timeout). Learn more about timeouts and how to set them for a single test. */
    actionTimeout: 0,
    /* Timeout for each navigation action in milliseconds. Defaults to 0 (no timeout). */
    navigationTimeout: 0,
    screenshot: 'only-on-failure',
    video: 'on',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Base URL to use in actions like `await page.goto('/')`. */
    //baseURL: `https://${process.env.DEPLOYMENT}.omgevingswet.overheid.nl`,
    baseURL: 'https://omgevingswet.overheid.nl',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
        // ,viewport: { width: 1280, height: 1024 }
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     launchOptions: {
    //       firefoxUserPrefs: { 'layers.acceleration.force-enabled': true },
    //     },
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
