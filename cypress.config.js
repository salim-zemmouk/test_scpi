require('dotenv').config();
const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL,
        setupNodeEvents(on, config) {
            config.env.CYPRESS_USERNAME = process.env.CYPRESS_USERNAME;
            config.env.CYPRESS_PASSWORD = process.env.CYPRESS_PASSWORD;
            config.env.CYPRESS_BASE_URL = process.env.CYPRESS_BASE_URL;
            require('cypress-mochawesome-reporter/plugin')(on);
            return config;
        },
        viewportWidth: 1600,
        viewportHeight: 924,
        specPattern: 'cypress/e2e/**/*.cy.js',
        supportFile: 'cypress/support/e2e.js'
    },
    reporter: 'mochawesome',
    reporterOptions: {
        charts: true,
        reportPageTitle: 'Rapport de tests SCPI',
        embeddedScreenshots: true,
        inlineAssets: true,
        saveAllAttempts: false,
        reportDir: 'cypress/reports',
        overwrite: false,
        html: true,
        json: true,
    },
});
