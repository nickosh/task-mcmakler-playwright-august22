const { test, expect } = require("@playwright/test");
const { MainPage } = require("../lib/pageobjects/main.page");

test.beforeAll(async ({ request }) => {
    const req = await request.get("/api/advertisements/db/drop?confirm=y");
    expect(req.ok()).toBeTruthy();
});

test("E2E: New element with all fields", async ({ page, request }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();

    const reqName = "e2e_create_name";
    const reqStreet = "e2e_create_street";
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
    let item = rows.filter({ hasText: reqName }).filter({ hasText: reqStreet });
    let itemTexts = await item.allTextContents();
    expect(itemTexts[0]).toContain(reqName);
    expect(itemTexts[0]).toContain(reqStreet);
    expect(itemTexts[0]).toContain(reqRooms);
    expect(itemTexts[0]).toContain("7.777,00");
    expect(itemTexts[0]).toContain(reqStatus);

    let apiCheck = await request.get("/api/advertisements/");
    expect(apiCheck.ok()).toBeTruthy();
    let apiCheckJson = await apiCheck.json();
    let thisReqItem = apiCheckJson.find((item) => item.name === reqName);
    expect(thisReqItem).toBeTruthy();
    expect(thisReqItem["name"]).toBe(reqName);
    expect(thisReqItem["street"]).toContain(reqStreet);
    expect(thisReqItem["rooms"].toString()).toContain(reqRooms);
    expect(thisReqItem["price"]).toContain(reqPrice);
    expect(thisReqItem["status"]).toBeTruthy();
});

test("E2E: Edit any existing advertisement", async ({ page, request }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();

    const reqName = "e2e_new_name";
    const reqPrice = "123";
    const editName = "e2e_edit_name";
    const editPrice = "456";

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

    let apiCheck = await request.get("/api/advertisements/");
    expect(apiCheck.ok()).toBeTruthy();
    let apiCheckJson = await apiCheck.json();
    let thisReqItem = apiCheckJson.find((item) => item.name === editName);
    expect(thisReqItem).toBeTruthy();
    expect(thisReqItem["name"]).toBe(editName);
    expect(thisReqItem["price"]).toContain(editPrice);
});

test("E2E: Websocket testing", async ({ page, request }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();

    const reqName = "e2e_websocket";
    const reqPrice = "890";

    let req = await request.post("/api/advertisements/", { data: { name: reqName, price: reqPrice } });
    expect(req.ok()).toBeTruthy();

    await mainPage.reloadPopUp.waitFor({
        state: "visible",
    });
    await mainPage.reloadBtn.click();
    await page.waitForLoadState();

    let table = mainPage.tableRows;
    let item = table.filter({ hasText: reqName }).filter({ hasText: reqPrice });
    await expect(item).toBeVisible();
});
