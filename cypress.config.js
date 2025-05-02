require('dotenv').config();
const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // Injecte les variables d'environnement
            config.env.USERNAME = process.env.USERNAME;
            config.env.PASSWORD = process.env.PASSWORD;

            // Ajoute le plugin du reporter
            require('cypress-mochawesome-reporter/plugin')(on);

            return config;
        },
        specPattern: 'cypress/e2e/**/*.cy.js',
        supportFile: 'cypress/support/e2e.js'
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
        reportDir: 'cypress/reports/html',
        overwrite: false,
        html: true,
        json: true
    }
});