import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e-tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* In CI, the JUnit results are additionally stored, so CircleCI shows failed and flaky tests,
     and the user manual is generated from the tests tagged with @doc */
  reporter: process.env.CI
    ? [
        ['html'],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['./e2e-tests/shared/user-manual/reporter.ts', { outputDir: 'user-manual' }],
      ]
    : 'html',
  /* Snapshots (e.g. of generated PDFs) are stored next to the tests, separately per platform */
  snapshotPathTemplate: '{testDir}/{testFileDir}/snapshots/{arg}{-snapshotSuffix}{ext}',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: '01_create_applications',
      testMatch: '01_create_applications.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '02_check_applications',
      testMatch: '02_check_applications.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '03_delete_applications',
      testMatch: '03_delete_applications.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'nuernberg',
      testDir: './e2e-tests/nuernberg',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'koblenz',
      testDir: './e2e-tests/koblenz',
      use: { ...devices['Desktop Chrome'] },
    },

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

  /* Run your local dev server before starting the tests, not needed for CI */
  webServer: [
    ...(process.env.CI
      ? []
      : [
          {
            command: 'docker compose -p entitlementcard up',
            name: 'Running docker container',
            reuseExistingServer: true,
            stdout: 'ignore' as const,
            stderr: 'ignore' as const,
          },
          {
            command: 'podman compose -p entitlementcard up',
            name: 'Running podman container',
            reuseExistingServer: true,
            stdout: 'ignore' as const,
            stderr: 'ignore' as const,
          },
          {
            command: 'npx vite',
            name: 'Administration',
            url: 'http://localhost:3000',
            reuseExistingServer: true,
            stdout: 'ignore' as const,
            stderr: 'ignore' as const,
          },
        ]),
    {
      command: './run-backend.sh',
      env: {
        JWT_SECRET: 'HelloWorld',
        KOBLENZ_PEPPER: '123456789ABC',
      },
      timeout: 120 * 1000,
      port: 8000,
      stdout: 'ignore',
      stderr: 'ignore',
      reuseExistingServer: true,
    },
  ],
})
