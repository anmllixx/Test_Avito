import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  reporter: [
    ['html', { 
      outputFolder: 'playwright-report', 
      open: 'always'
    }],
    ['list']
  ],

  use: {
    baseURL: 'https://cerulean-praline-8e5aa6.netlify.app/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    
    {
      name: 'Pixel 7',
      testMatch: 'tests/mobile/**/*.spec.js',
      use: {
        ...devices['Pixel 7'],
        locale: 'ru-RU',
      },
    },

    {
      name: 'Desktop Chrome',
      testMatch: 'tests/desktop/**/*.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'ru-RU',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});