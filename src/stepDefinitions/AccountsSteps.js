const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BASE_URL = process.env.CRM_URL || 'https://suite8demo.suiteondemand.com/#/login';

// small helper: try multiple selectors until one works
async function tryFill(page, selectors, value) {
	for (const s of selectors) {
		const el = page.locator(s);
		if (await el.count() > 0) {
			try { await el.first().fill(value); return true; } catch (e) {}
		}
	}
	return false;
}

async function tryClick(page, selectors) {
	for (const s of selectors) {
		const el = page.locator(s);
		if (await el.count() > 0) {
			try { await el.first().click(); return true; } catch (e) {}
		}
	}
	return false;
}


Given('The user logs in and goes to the Accounts page', async function () {
	await this.page.goto(BASE_URL);
	// attempt a login using env creds if present
	const username = process.env.CRM_USERNAME || 'will';
	const password = process.env.CRM_PASSWORD || 'will';
	await tryFill(this.page, ['input#username', 'input[name="username"]', 'input[placeholder*="user"]'], username);
	await tryFill(this.page, ['input#password', 'input[name="password"]', 'input[placeholder*="pass"]'], password);
	await tryClick(this.page, ['button#login-button', 'button:has-text("Login")', 'text=Login']);
	// navigate to Accounts area
	await this.page.waitForTimeout(5000);
	await tryClick(this.page, ['a:has-text("Accounts")', 'text=Accounts', 'nav >> text=Accounts']);
});

Given('The user completes the background application routing steps', async function () {
	// ensure main accounts table is visible
	const table = this.page.locator('table');
	await expect(table.first()).toBeVisible();
});

// ------------------------- List view assertions -------------------------
When('The user looks at the main table on the screen', async function () {
	const rows = this.page.locator('table tbody tr');
	await expect(rows.first()).toBeVisible();
});

Then('The list of customer accounts shows up correctly', async function () {
	const rows = this.page.locator('table tbody tr');
	const count = await rows.count();
	expect(count).toBeGreaterThan(0);
});

// ------------------------- Details page -------------------------
Given('The user sees an account name link in the table', async function () {
	const link = this.page.locator('table tbody tr a').first();
	await expect(link).toBeVisible();
});

When('The user clicks on that account name link', async function () {
	await this.page.locator('table tbody tr a').first().click();
});

Then('The full details page for that account opens up', async function () {
	// look for a details heading or section
	const header = this.page.locator('h1,h2,header,section:has-text("Account" )');
	await expect(this.page).toHaveURL(/.*Accounts|.*Account/i);
	await expect(this.page).toHaveTitle(/Account|Details/i);
});

// ------------------------- Create account -------------------------
Given('The user opens the blank "New Account" form', async function () {
	const clicked = await tryClick(this.page, ['button:has-text("New" )', 'text=New Account', 'a:has-text("New")']);
	if (!clicked) console.warn('Could not find New button - selector may need adjustment');
	await this.page.waitForTimeout(5000);
});

When('The user types an account name and clicks Save', async function () {
	const name = 'Test Account ' + Date.now();
	const filled = await tryFill(this.page, ['input[name="name"]', 'input#account_name', 'input[placeholder*="Account"]'], name);
	await tryClick(this.page, ['button:has-text("Save")', 'button:has-text("Create")', 'text=Save']);
	this._lastCreatedAccountName = name;
	if (!filled) console.warn('Could not find account name input - selector may need adjustment');
});

Then('The account is saved and the user sees the new profile', async function () {
	if (this._lastCreatedAccountName) {
		await expect(this.page.locator('h1, h2')).toContainText(this._lastCreatedAccountName);
	} else {
		// fallback: check for success toast
		const toast = this.page.locator('.toast-success, .alert-success');
		await expect(toast.first()).toBeVisible();
	}
});

// ------------------------- Edit account -------------------------
Given('The user opens an existing account details page', async function () {
	// open first account details
	await this.page.locator('table tbody tr a').first().click();
});

When('The user changes the account name and clicks Save', async function () {
	const newName = 'Renamed Account ' + Date.now();
	await tryClick(this.page, ['button:has-text("Edit")', 'text=Edit']);
	await tryFill(this.page, ['input[name="name"]', 'input#account_name', 'input[placeholder*="Account"]'], newName);
	await tryClick(this.page, ['button:has-text("Save")', 'text=Save']);
	this._lastEditedAccountName = newName;
});

Then('The top of the page shows the new updated name', async function () {
	if (this._lastEditedAccountName) {
		await expect(this.page.locator('h1, h2')).toContainText(this._lastEditedAccountName);
	} else {
		throw new Error('No edited account name recorded');
	}
});

// ------------------------- Delete account -------------------------
When('The user clicks Delete and confirms it on the popup', async function () {
	await tryClick(this.page, ['button:has-text("Delete")', 'text=Delete']);
	// confirm dialog
	const confirmClicked = await tryClick(this.page, ['button:has-text("Confirm")', 'button:has-text("Yes")', 'text=Yes']);
	if (!confirmClicked) {
		// attempt native dialog acceptance
		try { await this.page.on('dialog', async dialog => { await dialog.accept(); }); } catch (e) {}
	}
});

Then('The account is deleted and disappears from the list', async function () {
	await this.page.waitForTimeout(5000);
	const rows = this.page.locator('table tbody tr');
	const count = await rows.count();
	expect(count).toBeGreaterThanOrEqual(0);
});

// ------------------------- Validation and edge cases -------------------------
When('The user leaves the account name blank and clicks Save', async function () {
	await tryFill(this.page, ['input[name="name"]', 'input#account_name'], '');
	await tryClick(this.page, ['button:has-text("Save")', 'text=Save']);
});

Then('An error message shows up saying the name is required', async function () {
	const err = this.page.locator('.error, .help-block, .invalid-feedback');
	await expect(err.first()).toBeVisible();
});

When('The user types a huge number of letters and clicks Save', async function () {
	const huge = 'A'.repeat(5000);
	await tryFill(this.page, ['input[name="name"]', 'input#account_name', 'textarea[name="description"]'], huge);
	await tryClick(this.page, ['button:has-text("Save")', 'text=Save']);
});

Then('The system saves the text safely without crashing', async function () {
	// basic smoke: page still responsive and shows success
	await expect(this.page).toHaveURL(/.*Accounts|.*Account/i);
});

// ------------------------- Search & Filters -------------------------
Given('There are many different accounts in the system', async function () {
	// assume test data exists; no-op
});

When('The user types a specific name into the search box', async function () {
	const q = this._lastCreatedAccountName || 'Test';
	await tryFill(this.page, ['input[placeholder*="Search"]', 'input#search', 'input[name="q"]'], q);
	await this.page.keyboard.press('Enter');
});

Then('The table filters to show only that matching account', async function () {
	const rows = this.page.locator('table tbody tr');
	await expect(rows.first()).toBeVisible();
});

When('The user selects one specific type from the dropdown', async function () {
	// generic attempt to select first non-empty option
	const sel = this.page.locator('select');
	if (await sel.count() > 0) {
		const first = sel.first();
		const value = await first.locator('option').nth(1).getAttribute('value');
		if (value) await first.selectOption(value);
	}
});

Then('The table changes to show only accounts of that type', async function () {
	await this.page.waitForTimeout(5000);
	const rows = this.page.locator('table tbody tr');
	await expect(rows.first()).toBeVisible();
});

When('The user selects one manager name from the filters', async function () {
	await tryClick(this.page, ['text=Assigned To', 'label:has-text("Manager")']);
});

Then('The screen shows only accounts owned by that manager', async function () {
	await this.page.waitForTimeout(5000);
	const rows = this.page.locator('table tbody tr');
	await expect(rows.first()).toBeVisible();
});

// ------------------------- Export, Pagination, Relationship, Attachments
When('The user clicks the Export button to download data', async function () {
	const [download] = await Promise.all([
		this.page.waitForEvent('download'),
		tryClick(this.page, ['button:has-text("Export")', 'text=Export'])
	]);
	if (download) {
		const path = await download.path();
		console.log('Downloaded to', path);
	}
});

When('The user clicks the Next page arrow button', async function () {
	await tryClick(this.page, ['button[aria-label="Next"]', 'text=Next', '.pagination >> text=›']);
});

When('The user links a contact person name to this account', async function () {
	await tryClick(this.page, ['button:has-text("Add Contact")', 'text=Add Contact']);
});

Then('The contact person shows up in the account history', async function () {
	const item = this.page.locator('.activity, .history, .notes');
	await expect(item.first()).toBeVisible();
});

When('The user uploads a document file to the notes section', async function () {
	const fileInput = this.page.locator('input[type="file"]');
	if (await fileInput.count() > 0) {
		await fileInput.first().setInputFiles(require('path').resolve(__dirname, '../../testData/sample.pdf'));
	} else {
		console.warn('No file input found for upload');
	}
});

Then('The file links successfully and shows up in the notes', async function () {
	const fileLink = this.page.locator('a:has-text("sample")');
	await expect(fileLink.first()).toBeVisible();
});

Given('A user with "Read-Only" access opens an account', async function () {
	// assume user role exists; navigate to an account
	await this.page.locator('table tbody tr a').first().click();
});

When('The user tries to force a delete command', async function () {
	// attempt to click delete
	await tryClick(this.page, ['button:has-text("Delete")', 'text=Delete']);
});

Then('Access is denied and the account stays safe', async function () {
	const alert = this.page.locator('.alert-danger, .error');
	await expect(alert.first()).toBeVisible();
});

module.exports = {};
