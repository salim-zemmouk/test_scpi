require('dotenv').config();
const { defineConfig } = require("cypress");
const cypress = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.USERNAME = process.env.USERNAME;
      config.env.PASSWORD = process.env.PASSWORD;
      return config;
    },
  },
});
