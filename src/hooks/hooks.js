// src/stepDefinitions/hooks.js
const { Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

Before(async function () {
  // 1. Launch the browser instance
  this.browser = await chromium.launch({ headless: false }); // set to true if you don't want to see the browser pop up
  
  // 2. Create an isolated browser context
  this.context = await this.browser.newContext();
  
  // 3. Open a fresh page and attach it directly to Cucumber's World context ("this")
  this.page = await this.context.newPage();
});

After(async function () {
  // Clean up and close everything down after each scenario runs
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});