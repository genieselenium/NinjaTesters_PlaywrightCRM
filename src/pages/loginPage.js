const { expect } = require("@playwright/test");

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.baseUrl = process.env.CRM_URL || "https://suite8demo.suiteondemand.com/#/login";

        // --- Selectors ---
        this.usernameInputs = ["input#username", "input[name=\"username\"]", "input[placeholder*=\"user\"]"];
        this.passwordInputs = ["input#password", "input[name=\"password\"]", "input[placeholder*=\"pass\"]"];
        this.loginButtons = ["button#login-button", "button:has-text(\"Login\")", "text=Login"];
        this.errorMessages = [".error", ".alert-danger", ".help-block", "text=Invalid credentials"];
    }

    // --- Helper Methods ---
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

    // --- Actions ---
    async navigate() {
        await this.page.goto(this.baseUrl);
    }

    async login(username, password) {
        await this.tryFill(this.usernameInputs, username);
        await this.tryFill(this.passwordInputs, password);
        await this.tryClick(this.loginButtons);
        // Soft wait to allow transitions to settle
        await this.page.waitForTimeout(500);
    }

    // --- Assertions ---
    async verifyLoginFailed() {
        const err = this.page.locator(this.errorMessages.join(", "));
        await expect(err.first()).toBeVisible();
    }

    async verifyOnDashboard() {
        await expect(this.page).toHaveURL(/.*dashboard|.*home/i);
    }
}

module.exports = { LoginPage };
