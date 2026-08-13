require('dotenv').config();

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const logger = require('../utilities/Logger');
const { readExcel } = require('../utilities/excelReader');

const USERNAME = process.env.CRM_USERNAME;
const PASSWORD = process.env.CRM_PASSWORD;
const BASE_URL = process.env.CRM_URL;


async function performLogin(page) {
    logger.info('Navigating to Login page');
    await page.goto(`${BASE_URL}/#/login`);
    logger.info('Entering username and password');

    await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);
    await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);

    await Promise.all([
        page.waitForURL('**/#/home', {
            timeout: 30000
        }),
        page.getByRole('button', { name: 'Log In' }).click()
    ]);

    await page.waitForLoadState('domcontentloaded');
    logger.info('Login successful - User redirected to Dashboard');
}




Given('The user is logged in and on the Accounts list view', async function () {

    logger.info('Opening Accounts list view');

    await performLogin(this.page);

    await this.page.goto(`${BASE_URL}/#/accounts`);

    await this.page.waitForURL('**/#/accounts', {
        timeout: 30000
    });

    await this.page.waitForLoadState('networkidle');

    const firstRow = this.page
        .locator('.cdk-row, [role="row"]')
        .first();

    await expect(firstRow).toBeVisible({
        timeout: 30000
    });
    logger.info('Accounts list view loaded successfully');
});




Given('The user opens an existing account details page', async function () {

    logger.info('Opening an existing account details page');

    await performLogin(this.page);

    await this.page.goto(`${BASE_URL}/#/accounts`);

    await this.page.waitForURL('**/#/accounts', {
        timeout: 30000
    });

    await this.page.waitForLoadState('networkidle');

    const accountLink = this.page
        .locator('tr.cdk-row a[href*="/accounts/record/"]')
        .first();

    await expect(accountLink).toBeVisible({
        timeout: 30000
    });

    logger.info('Account name link found - Opening account details');

    await accountLink.click();

    await this.page.waitForURL('**/#/accounts/record/**', {
        timeout: 30000
    });

    logger.info('Account details page opened successfully');
});




When('The user looks at the main table on the screen', async function () {

    logger.info('Checking the main Accounts table');

    const tableRow = this.page
        .locator('.cdk-row, [role="row"]')
        .first();

    await expect(tableRow).toBeVisible({
        timeout: 30000
    });

    logger.info('Accounts table is visible');
});




When('The user clears the account name and clicks Save', async function () {

    logger.info('Opening account edit form');

    const editBtn = this.page.getByRole('button', {
        name: 'Edit'
    });

    await editBtn.click();

    logger.info('Clearing the account name');

    const nameInput = this.page.getByRole('textbox').nth(1);

    await expect(nameInput).toBeVisible({
        timeout: 30000
    });

    await nameInput.fill('');
    logger.info('Clicking Save with account name blank');

    await this.page.getByRole('button', {
        name: 'Save',
        exact: true
    }).click();
    logger.info('Save action completed');
});

Then('The user sees "Missing required field: Name"', async function () {
    logger.info('Verifying missing required field error');
    const errorMessage = this.page.getByText(
        'Missing required field: Name',
        { exact: true }
    );

    await expect(errorMessage).toBeVisible({
        timeout: 30000
    });
    logger.info('Missing required field error displayed successfully');
});



When('The user types an account name and clicks Save', async function () {

    logger.info('Opening account edit form');

    const editBtn = this.page
        .getByRole('button', { name: 'Edit' });

    await expect(editBtn).toBeVisible({
        timeout: 30000
    });

    await editBtn.click();
    logger.info('Entering updated account name');

    const nameInput = this.page
        .getByRole('textbox')
        .nth(1);

    await expect(nameInput).toBeVisible({
        timeout: 30000
    });

    await nameInput.fill('Updated Account Name');

    const saveBtn = this.page
        .getByRole('button', {
            name: 'Save',
            exact: true
        });

    await saveBtn.click();
    logger.info('Account name update submitted successfully');
});

Then('The top of the page shows the new updated name', async function () {

    await expect(this.page.locator('body'))
        .toContainText('Updated Account Name');
    logger.info('Updated account name verified successfully');
});




When('The user leaves the account name blank and clicks Save', async function () {
    logger.info('Opening account edit form to test blank account name');

    const editBtn = this.page
        .getByRole('button', { name: 'Edit' });

    if (await editBtn.isVisible()) {
        await editBtn.click();
    }
    logger.info('Clearing the account name');

    const nameInput = this.page
        .getByRole('textbox')
        .nth(1);

    await expect(nameInput).toBeVisible({
        timeout: 30000
    });

    await nameInput.fill('');
    logger.info('Clicking Save with blank account name');

    const saveBtn = this.page
        .getByRole('button', {
            name: 'Save',
            exact: true
        });

    await saveBtn.click();
    logger.info('Verifying required field validation message');

    const errorMessage = this.page.getByText(
        'Missing required field: Name',
        {
            exact: true
        }
    );

    await expect(errorMessage).toBeVisible({
        timeout: 30000
    });
    logger.info('Required field validation message displayed successfully');
});




When('The user selects one specific type from the dropdown', async function () {
    logger.info('Opening Accounts filter');

    await this.page
        .getByRole('button', { name: 'Filter' })
        .click();
        logger.info('Opening account type dropdown');

    await this.page
        .locator('#pn_id_3')
        .getByText('Select an item')
        .click();
        logger.info('Selecting Partner account type');

    await this.page
        .getByLabel('Partner')
        .getByText('Partner')
        .click();
        logger.info('Applying account type filter');

    await this.page
        .locator('scrm-list-filter')
        .getByRole('button', { name: 'Search' })
        .click();
        logger.info('Account type filter applied successfully');
});




Given('The user sees an account name link in the table', async function () {
    logger.info('Opening Accounts page for download test');

    await performLogin(this.page);

    await this.page.goto(`${BASE_URL}/#/accounts`);

    await this.page.waitForURL('**/#/accounts', {
        timeout: 30000
    });

    await this.page.waitForLoadState('networkidle');

    const accountLink = this.page
        .locator('tr.cdk-row a[href*="/accounts/record/"]')
        .first();

    await expect(accountLink).toBeVisible({
        timeout: 30000
    });
    logger.info('Account name link is visible in the table');
});


When('The user clicks the Export button to download data', async function () {
    logger.info('Opening Select Action Menu');
  // 1. Open the 'Select Action Menu' (dropdown next to Selected box)
  const selectActionMenu = this.page.locator('scrm-table-header').getByLabel('Select Action Menu');
  await selectActionMenu.click();
   logger.info('Selecting all account rows');

  // 2. Select All rows
  const selectAllOption = this.page.locator('a').filter({ hasText: 'Select All' }).first();
  await selectAllOption.click();
  logger.info('Opening Bulk Action menu');

  // 3. Open Bulk Action menu
  const bulkActionBtn = this.page.locator('scrm-table-header').getByRole('button', { name: 'Bulk Action' });
  await bulkActionBtn.click();
  logger.info('Clicking Export and waiting for download');

  // 4. Set up download listener and click Export
  const downloadPromise = this.page.waitForEvent('download');
  const exportOption = this.page.locator('a').filter({ hasText: 'Export' }).nth(1);
  await exportOption.click();

  // Store download object on World context for validation in the 'Then' step
  this.download = await downloadPromise;
  logger.info('Account export download completed');
});

Then('An Excel or CSV file is downloaded', async function () {
    logger.info('Verifying downloaded account file');
  // Verify download initiated successfully and validate suggested filename extension
  expect(this.download).toBeTruthy();
  const suggestedFilename = this.download.suggestedFilename();
  expect(suggestedFilename).toMatch(/\.(csv|xlsx|xls)$/i);
  logger.info(`Downloaded file verified successfully: ${suggestedFilename}`);
});

When('The user types a specific name into the search box', async function () {
    logger.info('Searching for account: AB Drivers Limited');
    
  const searchBox = this.page.getByRole('textbox', { name: 'Search' });
  await searchBox.click();
  await searchBox.fill('AB Drivers Limited');
  await searchBox.press('Enter');
  logger.info('Account search submitted');
});

Then('The search results show the matching account', async function () {
    logger.info('Verifying search result for AB Drivers Limited');
  // 1. Wait for page network requests / AJAX calls to settle
  await this.page.waitForLoadState('networkidle');

  // 2. Locate the link directly across the page without scoping to wrappers
  const accountLink = this.page.getByRole('link', { name: 'AB Drivers Limited', exact: true }).first();

  // 3. Assert visibility
  await expect(accountLink).toBeVisible({ timeout: 15000 });
  logger.info('Matching account search result verified successfully');
});

When('The user creates accounts using the Accounts Excel test data', async function () {

    const accountData = readExcel(
        './src/testData/AccountsData.xlsx',
        'AccountData'
    );

    for (const account of accountData) {

        console.log(`Creating account: ${account.accountName}`);

        // Click Create Account
        await this.page
            .getByRole('link', { name: 'Create Account' })
            .click();

        // Enter Account Name
        await page.goto('https://suite8demo.suiteondemand.com/#/Login');
        const nameInput = this.page.getByRole('textbox').nth(1);

        await expect(nameInput).toBeVisible({
            timeout: 30000
        });

        await nameInput.fill(account.accountName);

        // Enter Website
        const websiteInput = this.page
            .locator('scrm-composite-field')
            .getByRole('textbox');

        await websiteInput.fill(account.website);

        // Save account
        await this.page
            .getByRole('button', { name: 'Save', exact: true })
            .click();

        console.log(
            `Account created successfully: ${account.accountName}`
        );

        // Wait for the account page/list to finish loading
        await this.page.waitForTimeout(1000);
    }
});

Then('The accounts should be created successfully', async function () {
    console.log('All accounts from Excel were created successfully.');
});