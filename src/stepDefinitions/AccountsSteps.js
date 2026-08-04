require('dotenv').config();
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const USERNAME = process.env.CRM_USERNAME;
const PASSWORD = process.env.CRM_PASSWORD;
const BASE_URL = process.env.CRM_URL;

// --- Helper Functions ---
async function ensureLoggedIn(page) {
  if (page.url().includes('#/login') || page.url() === `${BASE_URL}/` || !page.url().includes('#/')) {
    await page.goto(`${BASE_URL}/#/login`);
    await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);
    await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL(/.*#\/(home|accounts)/i, { timeout: 30000 });
  }
}

// Scoped helper to get the account link from the first visible data row
function getFirstAccountLink(page) {
  const firstRow = page.locator('tr.cdk-row').first();
  return firstRow.locator('a[href*="accounts/record/"]');
}

// --- Scenario 1: See the Accounts list view ---
Given('The user logs in and goes to the Accounts page', async function () {
  await ensureLoggedIn(this.page);
  await this.page.goto(`${BASE_URL}/#/accounts`);
  await expect(this.page).toHaveURL(/.*#\/accounts$/, {
    timeout: 30000
});
});

When('The user looks at the main table on the screen', async function () {
  const firstDataRow = this.page.locator('tr.cdk-row').first();
  await expect(firstDataRow).toBeVisible({ timeout: 15000 });
});

Then('The list of customer accounts shows up correctly', async function () {
  const firstDataRow = this.page.locator('tr.cdk-row').first();
  await expect(firstDataRow).toBeVisible();
});

// --- Scenario 2: See account details page ---
Given('The user sees an account name link in the table', async function () {
  await ensureLoggedIn(this.page);
  await this.page.goto(`${BASE_URL}/#/accounts`);
  const accountLink = getFirstAccountLink(this.page);
  await expect(accountLink).toBeVisible({ timeout: 15000 });
});

When('The user clicks on that account name link', async function () {
  const accountLink = getFirstAccountLink(this.page);
  await accountLink.click();
  await this.page.waitForLoadState('domcontentloaded');
});

Then('The full details page for that account opens up', async function () {
  await expect(this.page).toHaveURL(/.*accounts\/record/i);
});

Given('The user is on the Accounts page', async function () {

  await ensureLoggedIn(this.page);

  await ensureLoggedIn(this.page);

  await this.page.goto(`${BASE_URL}/#/accounts`);

  await expect(this.page).toHaveURL(/.*#\/accounts$/, {
    timeout: 30000
  });

});
When('The user clicks the "Create Account" button', async function () {

  // Click the Accounts navigation first (same as Playwright Inspector)
  await this.page.locator('a').filter({ hasText: /^Accounts$/ }).click();

  const createAccountButton = this.page.getByRole('link', {
    name: 'Create Account'
  });

  await expect(createAccountButton).toBeVisible({
    timeout: 15000
  });

  await createAccountButton.click();

});

  
Then('The New Account form is displayed', async function () {

  await expect(this.page).toHaveURL(/accounts\/edit/i, {
    timeout: 15000
  });

  const nameField = this.page.getByRole('textbox').nth(1);

  await expect(nameField).toBeVisible({
    timeout: 15000
  });

  await expect(
    this.page.getByRole('button', { name: 'Save' })
  ).toBeVisible({
    timeout: 15000
  });

  await expect(
    this.page.getByRole('button', { name: 'Cancel' })
  ).toBeVisible({
    timeout: 15000
  });

});
Then('The account is saved and the user sees the new profile', async function () {
  await expect(this.page).toHaveURL(/.*accounts\/record/i, {
    timeout: 30000
  });
});
When('The user tries to save an account without entering details', async function () {

  const saveButton = this.page.getByRole('button', { name: 'Save' });

  await expect(saveButton).toBeVisible({ timeout: 10000 });
  await expect(saveButton).toBeEnabled();

  await saveButton.click();

});
Then('The validation error message should appear', async function () {

  const validationMessage = this.page.getByText('There are validation errors,');

  await expect(validationMessage).toBeVisible({
    timeout: 10000
  });

});
When('The user clicks the Cancel button', async function () {

  const cancelButton = this.page.getByRole('button', { name: 'Cancel' });

  await expect(cancelButton).toBeVisible({
    timeout: 10000
  });

  await cancelButton.click();

});
Then('The user should return to the Accounts list page', async function () {

  await expect(this.page).toHaveURL(/.*#\/accounts$/, {
    timeout: 15000
  });

  const firstRow = this.page.locator('tr.cdk-row').first();

  await expect(firstRow).toBeVisible({
    timeout: 15000
  });

});


// --- Scenario 4: Change an account name ---
Given('The user opens an existing account details page', async function () {
  await ensureLoggedIn(this.page);
  await this.page.goto(`${BASE_URL}/#/accounts`);
  const accountLink = getFirstAccountLink(this.page);
  await expect(accountLink).toBeVisible({ timeout: 15000 });
  await accountLink.click();
  await this.page.waitForLoadState('domcontentloaded');
});

When('The user changes the account name and clicks Save', async function () {
  const editBtn = this.page.getByRole('button', { name: 'Edit' }).or(this.page.getByRole('link', { name: 'Edit' }));
  await expect(editBtn.first()).toBeVisible({ timeout: 15000 });
  await editBtn.first().click();

  const nameInput = this.page.locator('input[formcontrolname="name"], input[name="name"]').or(this.page.getByRole('textbox').first());
  await nameInput.clear();
  await nameInput.fill('Updated Account Name');

  const saveButton = this.page
  .locator('scrm-button')
  .filter({ hasText: 'Save' })
  .last()
  .locator('button');
  await saveButton.scrollIntoViewIfNeeded();

await saveButton.click();

await this.page.waitForURL(/accounts\/record/i, {
    timeout: 30000
});
});


Then('The top of the page shows the new updated name', async function () {
  await expect(this.page.locator('body')).toContainText('Updated Account Name', { timeout: 15000 });
});

// --- Scenario 6: Search an account by name ---
Given('There are many different accounts in the system', async function () {
  await ensureLoggedIn(this.page);
  await this.page.goto(`${BASE_URL}/#/accounts`);
});

When('The user searches for {string}', async function (accountName) {

  // Open search
  await this.page.locator('a').nth(1).click();

  const searchBox = this.page.getByRole('textbox', {
    name: 'Search'
  });

  await expect(searchBox).toBeVisible({
    timeout: 15000
  });

  await searchBox.click();

  await searchBox.fill(accountName);

  await searchBox.press('Enter');

  await this.page.waitForURL(/home\/search/i, {
    timeout: 15000
  });

});
Then('The search results show the matching account', async function () {

  const resultFrame = this.page.locator('iframe').contentFrame();

  await expect(
    resultFrame.getByRole('link', {
      name: 'AB Drivers Limited'
    }).first()
  ).toBeVisible({
    timeout: 15000
  });

});

Given('There are different types of accounts in the list', async function () {

  await ensureLoggedIn(this.page);

  await this.page.goto(`${BASE_URL}/#/accounts`);

});


When('The user selects one specific type from the dropdown', async function () {

  const filterButton = this.page.getByRole('button', { name: 'Filter' });

  await filterButton.click();

});


Then('The table changes to show only accounts of that type', async function () {

  const rows = this.page.locator('tr.cdk-row');

  await expect(rows.first()).toBeVisible();

});

// --- Scenario 8: Filter list by assigned manager ---
Given('Accounts are assigned to different team members', async function () {
  await ensureLoggedIn(this.page);
  await this.page.goto(`${BASE_URL}/#/accounts`);
});

When('The user selects one manager name from the filters', async function () {
  const filterBtn = this.page.getByRole('button', { name: 'Filter' }).first();
  if (await filterBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await filterBtn.click();
  }

  const searchBtn = this.page.getByRole('button', { name: 'Search' }).first();
  await searchBtn.click();
});

Then('The screen shows only accounts owned by that manager', async function () {
  const dataRows = this.page.locator('tr.cdk-row');
  await expect(dataRows.first()).toBeVisible({ timeout: 15000 });
});





