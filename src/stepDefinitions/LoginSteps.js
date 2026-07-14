// src/stepDefinitions/LoginSteps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// 1. Navigation / Background Steps
Given('User is on the login page', async function () {
  // Always use "this.page" inside async function() to access Playwright's page context
  await this.page.goto('https://suite8demo.suiteondemand.com/#/home');
});

Given('User navigates to the application URL', async function () {
  await this.page.goto('https://suite8demo.suiteondemand.com/#/home');
});

Given('User opens the application in a supported browser', async function () {
  await this.page.goto('https://suite8demo.suiteondemand.com/#/home');
});

// 2. Setup / Precondition Steps (Givens)
Given('User has valid credentials', async function () {
  this.username = 'will'; 
  this.password = 'will';
});

Given('User has a username containing leading spaces', async function () {
  this.username = '  will';
  this.password = 'will';
});

Given('User has a username containing trailing spaces', async function () {
  this.username = 'will  ';
  this.password = 'will';
});

Given('User has a username in a different letter case', async function () {
  this.username = 'WILL';
  this.password = 'will';
});

Given('User has copied valid credentials', async function () {
  this.username = 'will';
  this.password = 'will';
});

Given('User has entered valid credentials', async function () {
  // Type them ahead of time for Enter-key test
  await this.page.locator('#username_id').fill('will'); // Replace #username_id with your actual UI selector
  await this.page.locator('#password_id').fill('will'); // Replace #password_id with your actual UI selector
});

Given('User is logged into the application', async function () {
  await this.page.goto('https://suite8demo.suiteondemand.com/#/home');
  // Add your quick login sequence here if needed
});

// 3. Action Steps (Whens)
When('User enters valid credentials and clicks the login button', async function () {
  await this.page.locator('#username_id').fill(this.username);
  await this.page.locator('#password_id').fill(this.password);
  await this.page.locator('#login_button_id').click(); // Replace #login_button_id with your actual UI selector
});

When('User enters the username with leading spaces, a valid password, and clicks the login button', async function () {
  await this.page.locator('#username_id').fill(this.username);
  await this.page.locator('#password_id').fill(this.password);
  await this.page.locator('#login_button_id').click();
});

When('User enters the username with trailing spaces, a valid password, and clicks the login button', async function () {
  await this.page.locator('#username_id').fill(this.username);
  await this.page.locator('#password_id').fill(this.password);
  await this.page.locator('#login_button_id').click();
});

When('User enters the username in a different letter case with a valid password', async function () {
  await this.page.locator('#username_id').fill(this.username);
  await this.page.locator('#password_id').fill(this.password);
  await this.page.locator('#login_button_id').click();
});

When('User pastes the credentials into the username and password fields and clicks the login button', async function () {
  await this.page.locator('#username_id').fill(this.username);
  await this.page.locator('#password_id').fill(this.password);
  await this.page.locator('#login_button_id').click();
});

When('User presses the Enter key', async function () {
  await this.page.keyboard.press('Enter');
});

// 4. Assertions (Thens)
Then('User is redirected to the dashboard', async function () {
  // Replace with your application's dashboard URL pattern or unique locator check
  await expect(this.page).toHaveURL(/.*dashboard/); 
});

Then('Login page is displayed successfully', async function () {
  const loginButton = this.page.locator('#login_button_id');
  await expect(loginButton).toBeVisible();
});

Then('System trims the leading spaces and redirects the user to the dashboard', async function () {
  await expect(this.page).toHaveURL(/.*dashboard/);
});

Then('System trims the trailing spaces and redirects the user to the dashboard', async function () {
  await expect(this.page).toHaveURL(/.*dashboard/);
});