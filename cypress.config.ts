import { defineConfig } from "cypress";

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.spinbet.com/en-nz',
    pageLoadTimeout: 30000,
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});