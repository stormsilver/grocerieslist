import { defineConfig, devices } from '@playwright/test';

const port = 3100;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command:
      'bun run build && bun run build:css && RAILS_ENV=test bin/rails db:prepare && RAILS_ENV=test bin/rails runner e2e/prepare_database.rb && RAILS_ENV=test bin/rails server -b 127.0.0.1 -p 3100',
    url: `http://127.0.0.1:${port}/up`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: { RAILS_ENV: 'test' },
  },
});
