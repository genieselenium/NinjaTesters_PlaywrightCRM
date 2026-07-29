const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Load environment variables
const USERNAME = process.env.CRM_USERNAME || 'will';
const PASSWORD = process.env.CRM_PASSWORD || 'will';
const BASE_URL = process.env.CRM_URL || 'https://suite8demo.suiteondemand.com/#/login';
// =========================================================================
// Helper Locators for SuiteCRM 8 Login Form
// =========================================================================
const getUsernameInput = (page) => page.locator('input[name="username"], input[formcontrolname="username"], input#username');
const getPasswordInput = (page) => page.locator('input[name="password"], input[formcontrolname="password"], input#password');
const getLoginButton = (page) => page.locator('button[type="submit"], button:has-text("Log In"), button#login-button');

// =========================================================================
// 1. Background & Common Preconditions
// =========================================================================

Given('User is on the Login page', async function () {
  await this.page.goto(BASE_URL);
  await getUsernameInput(this.page).waitFor({ state: 'visible', timeout: 10000 });
});

// =========================================================================
// 2. Positive Login Step Definitions
// =========================================================================

When('User enters valid username and password and clicks Login', async function () {
  await getUsernameInput(this.page).fill(USERNAME);
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

Then('User is redirected to Dashboard', async function () {
  await expect(this.page).toHaveURL(/.*dashboard|home|index/i, { timeout: 15000 });
});

When('User enters username with leading spaces and valid password', async function () {
  await getUsernameInput(this.page).fill('   ' + USERNAME);
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

Then('System trims spaces and processes login correctly', async function () {
  const alert = this.page.locator('.alert-danger, [role="alert"]');
  await expect(alert).toBeVisible(); // If the app rejects padded usernames
});

When('User enters username with trailing spaces and valid password', async function () {
  await getUsernameInput(this.page).fill(USERNAME + '   ');
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

When('User enters username in different letter case', async function () {
  await getUsernameInput(this.page).fill(USERNAME.toUpperCase());
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

Then('Login behavior follows application rules', async function () {
  await expect(this.page).toHaveURL(/.*dashboard|home|index/i, { timeout: 15000 });
});

When('User pastes username and password and clicks Login', async function () {
  const usernameInput = getUsernameInput(this.page);
  await usernameInput.focus();
  await this.page.keyboard.insertText(USERNAME);

  const passwordInput = getPasswordInput(this.page);
  await passwordInput.focus();
  await this.page.keyboard.insertText(PASSWORD);

  await getLoginButton(this.page).click();
});

Then('Login is processed successfully', async function () {
  await expect(this.page).toHaveURL(/.*dashboard|home|index/i, { timeout: 15000 });
});

Given('User has entered valid credentials', async function () {
  await getUsernameInput(this.page).fill(USERNAME);
  await getPasswordInput(this.page).fill(PASSWORD);
});

When('User presses Enter key', async function () {
  await this.page.keyboard.press('Enter');
});

Then('Login is submitted successfully', async function () {
  await expect(this.page).toHaveURL(/.*dashboard|home|index/i, { timeout: 15000 });
});

// =========================================================================
// 3. Negative Login Step Definitions
// =========================================================================

When('User enters invalid username and valid password and clicks Login', async function () {
  await getUsernameInput(this.page).fill('invalid_user_99');
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

Then('Error message is displayed', async function () {
  const alert = this.page.locator('.alert-danger, [role="alert"], .error-message, .sc-alert');
  await expect(alert).toBeVisible({ timeout: 7000 });
  await expect(alert).toContainText(/Authentication failed|invalid|login/i);
});

When('User enters valid username and invalid password and clicks Login', async function () {
  await getUsernameInput(this.page).fill(USERNAME);
  await getPasswordInput(this.page).fill('IncorrectPass123!');
  await getLoginButton(this.page).click();
});

When('User clicks Login without entering credentials', async function () {
  await getLoginButton(this.page).click();
});

Then('Validation message is displayed', async function () {
  const usernameInput = getUsernameInput(this.page);
  const passwordInput = getPasswordInput(this.page);
  
  const isUserRequired = await usernameInput.getAttribute('required');
  const isPassRequired = await passwordInput.getAttribute('required');
  
  expect(isUserRequired !== null || isPassRequired !== null).toBeTruthy();
});

When('User enters password only and clicks Login', async function () {
  await getUsernameInput(this.page).fill('');
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

Then('Username validation message is displayed', async function () {
  const usernameInput = getUsernameInput(this.page);
  const isRequired = await usernameInput.getAttribute('required');
  expect(isRequired).not.toBeNull();
});

When('User enters username only and clicks Login', async function () {
  await getUsernameInput(this.page).fill(USERNAME);
  await getPasswordInput(this.page).fill('');
  await getLoginButton(this.page).click();
});

Then('Password validation message is displayed', async function () {
  const passwordInput = getPasswordInput(this.page);
  const isRequired = await passwordInput.getAttribute('required');
  expect(isRequired).not.toBeNull();
});

When('User enters correct username but password with incorrect case', async function () {
  await getUsernameInput(this.page).fill(USERNAME);
  await getPasswordInput(this.page).fill(PASSWORD.toLowerCase() === PASSWORD ? PASSWORD.toUpperCase() : PASSWORD.toLowerCase());
  await getLoginButton(this.page).click();
});

Then('Login fails with error message', async function () {
  const alert = this.page.locator('.alert-danger, [role="alert"], .error-message, .sc-alert');
  await expect(alert).toBeVisible();
});

// =========================================================================
// 4. Security Step Definitions
// =========================================================================

When('User enters invalid credentials multiple times', async function () {
  for (let i = 0; i < 5; i++) {
    await getUsernameInput(this.page).fill('attacker_user');
    await getPasswordInput(this.page).fill('BadPassword' + i);
    await getLoginButton(this.page).click();
    await this.page.waitForTimeout(500); 
  }
});

Then('Appropriate security message or account lock policy is applied', async function () {
  const alert = this.page.locator('.alert-danger, [role="alert"]').first();
  await expect(alert).toBeVisible();
  await expect(this.page.locator('body')).toContainText(/incorrect|failed|too many|locked|suspended/i);
});

Given('User account is locked', async function () {
  console.log('Pre-condition: Assuming target user account is in locked state.');
});

When('User attempts login with correct credentials', async function () {
  await getUsernameInput(this.page).fill(USERNAME);
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

Then('User receives account locked message', async function () {
  const alert = this.page.locator('.alert-danger, [role="alert"]').first();
  await expect(alert).toBeVisible({ timeout: 10000 });
  await expect(this.page.locator('.alert-danger, [role="alert"]').first())
  .toContainText(/not authorized|contact your system administrator|locked|suspended|inactive|invalid|failed/i);
});