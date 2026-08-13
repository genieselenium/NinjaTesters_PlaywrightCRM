// src/stepDefinitions/hooks.js
const { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
require('dotenv').config();


// Set global timeout (60 seconds) for Playwright steps
setDefaultTimeout(60 * 1000);

let browser;

const browserName = process.env.BROWSER || "chromium";

// 1. Launch browser ONCE before all tests run
BeforeAll(async function () {

  if (browserName === "firefox") {

    browser = await firefox.launch({
      headless: false,
      slowMo: 100
    });

    } else if (browserName === "webkit") { 
      browser = await webkit.launch({ headless: false, slowMo: 100 });

  } else {

    browser = await chromium.launch({
      headless: false,
      slowMo: 100
    });

  }

});


// 2. Create a fresh context & page before EACH scenario
Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

// 3. Attach screenshot if scenario fails, then clean up context/page
After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }

  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
});

// 4. Close browser after ALL tests finish
AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});