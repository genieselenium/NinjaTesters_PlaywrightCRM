const { expect } = require("@playwright/test");

class AccountsPage {
    constructor(page) {
        this.page = page;
        this.baseUrl = process.env.CRM_URL || "https://suite8demo.suiteondemand.com/#/login";

        this.usernameInputs = ["input#username", "input[name=\"username\"]", "input[placeholder*=\"user\"]"];
        this.passwordInputs = ["input#password", "input[name=\"password\"]", "input[placeholder*=\"pass\"]"];
        this.loginButtons = ["button#login-button", "button:has-text(\"Login\")", "text=Login"];
        this.accountsNavLinks = ["a:has-text(\"Accounts\")", "text=Accounts", "nav >> text=Accounts"];
        
        this.table = "table";
        this.tableRows = "table tbody tr";
        this.accountNameLinks = "table tbody tr a";
        this.detailsHeaders = "h1,h2,header,section:has-text(\"Account\")";
        
        this.newAccountButtons = ["button:has-text(\"New\")", "text=New Account", "a:has-text(\"New\")"];
        this.accountNameInputs = ["input[name=\"name\"]", "input#account_name", "input[placeholder*=\"Account\"]"];
        this.saveButtons = ["button:has-text(\"Save\")", "button:has-text(\"Create\")", "text=Save"];
        this.editButtons = ["button:has-text(\"Edit\")", "text=Edit"];
        this.deleteButtons = ["button:has-text(\"Delete\")", "text=Delete"];
        this.confirmButtons = ["button:has-text(\"Confirm\")", "button:has-text(\"Yes\")", "text=Yes"];
        
        this.errorMessages = [".error", ".help-block", ".invalid-feedback"];
        this.successAlerts = [".toast-success", ".alert-success"];
        this.typeDropdown = "select";
        this.managerFilters = ["text=Assigned To", "label:has-text(\"Manager\")"];
        this.exportButtons = ["button:has-text(\"Export\")", "text=Export"];
        this.nextPageButtons = ["button[aria-label=\"Next\"]", "text=Next", ".pagination >> text=›"];
        this.addContactButtons = ["button:has-text(\"Add Contact\")", "text=Add Contact"];
        this.historySections = [".activity", ".history", ".notes"];
        this.fileInputs = "input[type=\"file\"]";
    }

    async tryFill(selectors, value) {
        for (const s of selectors) {
            const el = this.page.locator(s);
            if (await el.count() > 0) {
                try { 
                    await el.first().fill(value); 
                    return true; 
                } catch (e) {}
            }
        }
        return false;
    }

    async tryClick(selectors) {
        for (const s of selectors) {
            const el = this.page.locator(s);
            if (await el.count() > 0) {
                try { 
                    await el.first().click(); 
                    return true; 
                } catch (e) {}
            }
        }
        return false;
    }

    async gotoLoginPage() {
        await this.page.goto(this.baseUrl);
    }

    async login(username, password) {
        await this.tryFill(this.usernameInputs, username);
        await this.tryFill(this.passwordInputs, password);
        await this.tryClick(this.loginButtons);
        await this.page.waitForTimeout(500);
    }

    async navigateToAccounts() {
        await this.tryClick(this.accountsNavLinks);
    }

    async verifyTableVisible() {
        const table = this.page.locator(this.table);
        await expect(table.first()).toBeVisible();
    }

    async verifyRowsExist() {
        const rows = this.page.locator(this.tableRows);
        await expect(rows.first()).toBeVisible();
    }

    async getRowCount() {
        return await this.page.locator(this.tableRows).count();
    }

    async clickFirstAccountLink() {
        const link = this.page.locator(this.accountNameLinks).first();
        await expect(link).toBeVisible();
        await link.click();
    }

    async verifyDetailsPageLoaded() {
        await expect(this.page).toHaveURL(/.*Accounts|.*Account/i);
        await expect(this.page).toHaveTitle(/Account|Details/i);
    }

    async openNewAccountForm() {
        const clicked = await this.tryClick(this.newAccountButtons);
        if (!clicked) console.warn("Could not find New button - selector may need adjustment");
        await this.page.waitForTimeout(500);
    }

    async createAccount(name) {
        const filled = await this.tryFill(this.accountNameInputs, name);
        if (!filled) console.warn("Could not find account name input - selector may need adjustment");
        await this.tryClick(this.saveButtons);
    }

    async verifyAccountNameInHeader(name) {
        await expect(this.page.locator("h1, h2")).toContainText(name);
    }

    async verifySuccessToast() {
        const toast = this.page.locator(this.successAlerts.join(", "));
        await expect(toast.first()).toBeVisible();
    }

    async updateAccountName(newName) {
        await this.tryClick(this.editButtons);
        await this.tryFill(this.accountNameInputs, newName);
        await this.tryClick(this.saveButtons);
    }

    async deleteAccount() {
        await this.tryClick(this.deleteButtons);
        const confirmClicked = await this.tryClick(this.confirmButtons);
        if (!confirmClicked) {
            try { 
                this.page.once("dialog", async dialog => { await dialog.accept(); }); 
            } catch (e) {}
        }
    }

    async fillBlankNameAndSave() {
        await this.tryFill(this.accountNameInputs, "");
        await this.tryClick(this.saveButtons);
    }

    async verifyNameRequiredError() {
        const err = this.page.locator(this.errorMessages.join(", "));
        await expect(err.first()).toBeVisible();
    }

    async saveHugeText(text) {
        await this.tryFill(this.accountNameInputs.concat("textarea[name=\"description\"]"), text);
        await this.tryClick(this.saveButtons);
    }

    async searchAccount(query) {
        await this.tryFill(["input[placeholder*=\"Search\"]", "input#search", "input[name=\"q\"]"], query);
        await this.page.keyboard.press("Enter");
    }

    async selectFirstDropdownOption() {
        const sel = this.page.locator(this.typeDropdown);
        if (await sel.count() > 0) {
            const first = sel.first();
            const value = await first.locator("option").nth(1).getAttribute("value");
            if (value) await first.selectOption(value);
        }
    }

    async filterByManager() {
        await this.tryClick(this.managerFilters);
    }

    async exportData() {
        const [download] = await Promise.all([
            this.page.waitForEvent("download"),
            this.tryClick(this.exportButtons)
        ]);
        return download;
    }

    async clickNextPage() {
        await this.tryClick(this.nextPageButtons);
    }

    async linkContact() {
        await this.tryClick(this.addContactButtons);
    }

    async verifyHistoryVisible() {
        const item = this.page.locator(this.historySections.join(", "));
        await expect(item.first()).toBeVisible();
    }

    async uploadFile(filePath) {
        const fileInput = this.page.locator(this.fileInputs);
        if (await fileInput.count() > 0) {
            await fileInput.first().setInputFiles(filePath);
        } else {
            console.warn("No file input found for upload");
        }
    }

    async verifyFileLinked(fileName) {
        const fileLink = this.page.locator(`a:has-text("${fileName}")`);
        await expect(fileLink.first()).toBeVisible();
    }
}

module.exports = { AccountsPage };
