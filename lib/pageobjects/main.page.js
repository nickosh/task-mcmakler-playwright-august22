const { expect } = require("@playwright/test");

exports.MainPage = class MainPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.appNameText = page.locator('text="Advertisements"');
        this.newItemButton = page.locator('text="add_circle_outline"');
        this.tableHeader = {
            name: page.locator('text="Advertisement name"'),
            street: page.locator('text="Street"'),
            rooms: page.locator('text="Rooms"'),
            price: page.locator('text="Price"'),
            status: page.locator('text="Status"'),
        };
        this.tableRows = page.locator("table > tbody > tr");
        this.editForm = {
            name: page.locator('input[name="name"]'),
            street: page.locator('input[name="street"]'),
            rooms: page.locator('input[name="rooms"]'),
            price: page.locator('input[name="price"]'),
            status: page.locator('[aria-label="Status"]'),
        };
        this.okBtn = page.locator('button:has-text("ok")');
        this.saveBtn = page.locator('button:has-text("save")');
        this.cancelBtn = page.locator('button:has-text("cancel")');
        this.savePopUp = page.locator('text="Saved successfully"');
    }

    async goto() {
        await this.page.goto("/");
        await this.page.waitForLoadState();
        await this.appNameText.waitFor({
            state: "visible",
            timeout: 1.5 * 60 * 1000,
        });
    }

    async getLastTableItem() {
        let rows = this.tableRows;
        return rows.last();
    }
};
