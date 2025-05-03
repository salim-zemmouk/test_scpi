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
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
        reportDir: 'cypress/reports/html',
        overwrite: false,
        html: false,
        json: true
    }
});
