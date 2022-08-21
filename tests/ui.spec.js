const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const { MainPage } = require("../lib/pageobjects/main.page");

test("UI accessibility test", async ({ page }, testInfo) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    await testInfo.attach("accessibility-scan-results", {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toEqual([]);
});

test("Page main elements in place", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    expect(mainPage.appNameText).toBeVisible();
    expect(mainPage.newItemButton).toBeVisible();
    expect(mainPage.tableHeader.name).toBeVisible();
    expect(mainPage.tableHeader.street).toBeVisible();
    expect(mainPage.tableHeader.rooms).toBeVisible();
    expect(mainPage.tableHeader.price).toBeVisible();
    expect(mainPage.tableHeader.status).toBeVisible();
    await mainPage.newItemButton.click();
    expect(mainPage.editForm.name).toBeVisible();
    expect(mainPage.editForm.street).toBeVisible();
    expect(mainPage.editForm.rooms).toBeVisible();
    expect(mainPage.editForm.price).toBeVisible();
    expect(mainPage.editForm.status).toBeVisible();
    expect(mainPage.cancelBtn).toBeEnabled();
    expect(mainPage.saveBtn).toBeDisabled();
});

test.describe("UI: Create new advertisement", async () => {
    test("New element with required fields only", async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.goto();

        const reqName = "ui_name";
        const reqPrice = "555";

        await mainPage.newItemButton.click();
        await mainPage.editForm.name.fill(reqName);
        await mainPage.editForm.price.fill(reqPrice);
        await mainPage.saveBtn.click();
        await mainPage.savePopUp.waitFor({
            state: "visible",
        });
        let item = await mainPage.getLastTableItem();
        let itemTexts = await item.allTextContents();
        expect(itemTexts[0]).toContain(reqName);
        expect(itemTexts[0]).toContain(reqPrice);
    });
});
