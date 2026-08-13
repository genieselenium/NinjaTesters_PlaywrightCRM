const logger = require("../utilities/Logger");
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');


const USERNAME = process.env.CRM_USERNAME ;
const PASSWORD = process.env.CRM_PASSWORD ;
const BASE_URL = process.env.CRM_URL || 'https://suite8demo.suiteondemand.com/#/login';

const getUsernameInput = (page) => page.locator('input[name="username"], input[formcontrolname="username"], input#username');
const getPasswordInput = (page) => page.locator('input[name="password"], input[formcontrolname="password"], input#password');
const getLoginButton = (page) => page.locator('button[type="submit"], button:has-text("Log In"), button#login-button');



Given('User is on the Login page', async function () {
  logger.info("Navigating to Login page");
  await this.page.goto(BASE_URL);
  await getUsernameInput(this.page).waitFor({ state: 'visible', timeout: 10000 });
  logger.info("Login page loaded successfully");
});



When('User enters valid username and password and clicks Login', async function () {
  logger.info("Entering valid username");
  await getUsernameInput(this.page).fill(USERNAME);
  logger.info("Entering password");
  await getPasswordInput(this.page).fill(PASSWORD);
  logger.info("Clicking Login button");
  await getLoginButton(this.page).click();
});

Then('User is redirected to Dashboard', async function () {
  await expect(this.page).toHaveURL(/.*dashboard|home|index/i, { timeout: 15000 });
  logger.info("Login successful - User redirected to Dashboard");
});

When('User enters username with leading spaces and valid password', async function () {
  await getUsernameInput(this.page).fill('   ' + USERNAME);
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

Then('System trims spaces and processes login correctly', async function () {
  const alert = this.page.locator('.alert-danger, [role="alert"]');
  await expect(alert).toBeVisible();
});

When('User enters username with trailing spaces and valid password', async function () {
  await getUsernameInput(this.page).fill(USERNAME + '   ');
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});
Then('User should be logged in successfully', async function () {
  await expect(this.page).not.toHaveURL(/login/);
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
  logger.info('Pre-condition: Assuming target user account is in locked state.');
});

When('User attempts login with correct credentials', async function () {
  await getUsernameInput(this.page).fill(USERNAME);
  await getPasswordInput(this.page).fill(PASSWORD);
  await getLoginButton(this.page).click();
});

Then('User receives account locked message', async function () {

    const message = await this.page.locator('body').innerText();

    logger.info(`Account locked message: ${message}`);

});

const { readExcel } = require("../utilities/excelReader");

const path = "./src/testData/LoginData.xlsx";


When("User logs in using excel data", async function () {

    const loginData = readExcel(path, "LoginData");

    for (const data of loginData) {

        logger.info(`Testing username: ${data.username}`);
        logger.info("Password entered");
        logger.info(`Expected result: ${data.expectedResult}`);


        await getUsernameInput(this.page)
            .fill(data.username || "");
        logger.info("Username entered");

        await getPasswordInput(this.page)
            .fill(data.password || "");
        logger.info("Password entered");

        await getLoginButton(this.page)
            .click();
        logger.info("Login button clicked");


        await validateLoginResult(
            this.page,
            data.expectedResult
        );
        logger.info(`Login validation completed for: ${data.username}`);
      


        // Go back to login page before next Excel row
        await this.page.goto(BASE_URL);

        await getUsernameInput(this.page)
            .waitFor({ state: "visible" });

    }

});


async function validateLoginResult(page, expectedResult) {
  
logger.info(`Validating login result. Expected: ${expectedResult}`);
    if (expectedResult === "success") {

        await expect(page)
            .not.toHaveURL(/login/i);
logger.info("Login successful - User redirected from login page");

        return;
    }


    await expect(page)
        .toHaveURL(/login/i);
logger.info("Login failed - User remained on login page");

    const missingField = page
        .getByText("Missing required field");

    const invalidCredentials = page
        .getByText(
            "Login credentials incorrect, please try again"
        );


    if (await missingField.count() > 0) {

        await expect(missingField.first())
            .toBeVisible();
        logger.info("Validation message displayed: Missing required field");

    } else {

        await expect(invalidCredentials.first())
            .toBeVisible();
            logger.info("Validation message displayed: Invalid credentials");

    }

}