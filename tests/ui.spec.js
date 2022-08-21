const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const { MainPage } = require("../lib/pageobjects/main.page");

test.beforeAll(async ({ request }) => {
    const req = await request.get("/api/advertisements/db/drop?confirm=y");
    expect(req.ok()).toBeTruthy();
});

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
    await expect(mainPage.appNameText).toBeVisible();
    await expect(mainPage.newItemButton).toBeVisible();
    await expect(mainPage.tableHeader.name).toBeVisible();
    await expect(mainPage.tableHeader.street).toBeVisible();
    await expect(mainPage.tableHeader.rooms).toBeVisible();
    await expect(mainPage.tableHeader.price).toBeVisible();
    await expect(mainPage.tableHeader.status).toBeVisible();
    await mainPage.newItemButton.click();
    await expect(mainPage.editForm.name).toBeVisible();
    await expect(mainPage.editForm.street).toBeVisible();
    await expect(mainPage.editForm.rooms).toBeVisible();
    await expect(mainPage.editForm.price).toBeVisible();
    await expect(mainPage.editForm.status).toBeVisible();
    await expect(mainPage.cancelBtn).toBeEnabled();
    await expect(mainPage.saveBtn).toBeDisabled();
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
        await mainPage.newItemButton.waitFor();
        let rows = mainPage.tableRows;
        let item = rows.filter({ hasText: "ui_name" }).filter({ hasText: "555" });
        let itemTexts = await item.allTextContents();
        expect(itemTexts[0]).toContain(reqName);
        expect(itemTexts[0]).toContain(reqPrice);
    });
    test("New element with all fields", async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.goto();

        const reqName = "ui_name";
        const reqStreet = "ui_street";
        const reqRooms = "393";
        const reqPrice = "7777";
        const reqStatus = "Active";

        await mainPage.newItemButton.click();
        await mainPage.editForm.name.fill(reqName);
        await mainPage.editForm.street.fill(reqStreet);
        await mainPage.editForm.rooms.fill(reqRooms);
        await mainPage.editForm.price.fill(reqPrice);
        await mainPage.editForm.status.check();
        await mainPage.saveBtn.click();
        await mainPage.savePopUp.waitFor({
            state: "visible",
        });
        await mainPage.newItemButton.waitFor();
        let rows = mainPage.tableRows;
        let item = rows.filter({ hasText: "ui_name" }).filter({ hasText: "ui_street" });
        let itemTexts = await item.allTextContents();
        expect(itemTexts[0]).toContain(reqName);
        expect(itemTexts[0]).toContain(reqStreet);
        expect(itemTexts[0]).toContain(reqRooms);
        expect(itemTexts[0]).toContain("7.777,00");
        expect(itemTexts[0]).toContain(reqStatus);
    });
});

test("Edit any existing advertisement", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();

    const reqName = "new_name";
    const reqPrice = "343";
    const editName = "edit_name";
    const editPrice = "901";

    await mainPage.newItemButton.click();
    await mainPage.editForm.name.fill(reqName);
    await mainPage.editForm.price.fill(reqPrice);
    await mainPage.saveBtn.click();
    await mainPage.savePopUp.waitFor({
        state: "visible",
    });
    await mainPage.newItemButton.waitFor();
    let rows = mainPage.tableRows;
    let item = rows.filter({ hasText: reqName }).filter({ hasText: reqPrice });
    let itemTexts = await item.allTextContents();
    expect(itemTexts[0]).toContain(reqName);
    expect(itemTexts[0]).toContain(reqPrice);

    await item.click();
    await mainPage.editForm.name.fill(editName);
    await mainPage.editForm.price.fill(editPrice);
    await mainPage.saveBtn.click();
    await mainPage.savePopUp.waitFor({
        state: "visible",
    });
    await mainPage.newItemButton.waitFor();
    let editRows = mainPage.tableRows;
    let editItem = editRows.filter({ hasText: editName }).filter({ hasText: editPrice });
    let editItemTexts = await editItem.allTextContents();
    expect(editItemTexts[0]).toContain(editName);
    expect(editItemTexts[0]).toContain(editPrice);
});

test.describe("UI: Input validators", async () => {
    test("Advertisement name", async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.goto();
        await mainPage.newItemButton.click();

        await mainPage.editForm.name.fill("111111111111111111111111111111111111111111111111111");
        await mainPage.editForm.street.click();
        await expect(page.locator('text="Max length reached"').first()).toBeVisible();
        await expect(mainPage.saveBtn).toBeDisabled();

        await mainPage.editForm.name.fill("");
        await mainPage.editForm.street.click();
        await expect(page.locator('text="This is required"').first()).toBeVisible();
        await expect(mainPage.saveBtn).toBeDisabled();
    });
    test("Price", async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.goto();
        await mainPage.newItemButton.click();

        await mainPage.editForm.price.fill("565,3411");
        await mainPage.editForm.street.click();
        await expect(page.locator('text="Invalid price(Valid currency in euros: 12,12)"').first()).toBeVisible();
        await expect(mainPage.saveBtn).toBeDisabled();

        await mainPage.editForm.price.fill("");
        await mainPage.editForm.street.click();
        await expect(page.locator('text="This is required"').first()).toBeVisible();
        await expect(mainPage.saveBtn).toBeDisabled();
    });
});
