const { test, expect } = require("@playwright/test");

test.describe("API: functional tests", async () => {
    test("API alive", async ({ request }) => {
        const req = await request.get("/api/advertisements/");
        expect(req.ok()).toBeTruthy();
    });

    test("Create new advertisement - required fields only", async ({ request }) => {
        const reqName = "newmin_name";
        const reqPrice = "50";

        let req = await request.post("/api/advertisements/", { data: { name: reqName, price: reqPrice } });
        expect(req.ok()).toBeTruthy();
        let reqJson = await req.json();
        expect(reqJson["name"]).toBe(reqName);
        expect(reqJson["price"]).toBe(reqPrice);
        expect(reqJson["_id"]).toBeTruthy();

        let doubleCheck = await request.get("/api/advertisements/");
        expect(doubleCheck.ok()).toBeTruthy();
        let doubleCheckJson = await doubleCheck.json();
        let thisReqItem = doubleCheckJson.find((item) => item._id === reqJson["_id"]);
        expect(thisReqItem).toBeTruthy();
        expect(thisReqItem["name"]).toBe(reqName);
        expect(thisReqItem["price"]).toBe(reqPrice);
        expect(thisReqItem["_id"]).toBe(reqJson["_id"]);
    });

    test("Create new advertisement - all fields", async ({ request }) => {
        const reqName = "newmax_name";
        const reqStreet = "newmax_street";
        const reqRooms = "newmax_rooms";
        const reqPrice = "50";
        const reqStatus = true;

        let req = await request.post("/api/advertisements/", {
            data: { name: reqName, street: reqStreet, rooms: reqRooms, price: reqPrice, status: reqStatus },
        });
        expect(req.ok()).toBeTruthy();
        let reqJson = await req.json();
        expect(reqJson["name"]).toBe(reqName);
        expect(reqJson["street"]).toBe(reqStreet);
        expect(reqJson["rooms"]).toBe(reqRooms);
        expect(reqJson["price"]).toBe(reqPrice);
        expect(reqJson["status"]).toBe(reqStatus);
        expect(reqJson["_id"]).toBeTruthy();

        let doubleCheck = await request.get("/api/advertisements/");
        expect(doubleCheck.ok()).toBeTruthy();
        let doubleCheckJson = await doubleCheck.json();
        let thisReqItem = doubleCheckJson.find((item) => item._id === reqJson["_id"]);
        expect(thisReqItem).toBeTruthy();
        expect(thisReqItem["name"]).toBe(reqName);
        expect(thisReqItem["street"]).toBe(reqStreet);
        expect(thisReqItem["rooms"]).toBe(reqRooms);
        expect(thisReqItem["price"]).toBe(reqPrice);
        expect(thisReqItem["status"]).toBe(reqStatus);
        expect(thisReqItem["_id"]).toBe(reqJson["_id"]);
    });

    test("Edit any existing advertisement - required fields only", async ({ request }) => {
        // Lets create new item in case of API are empty
        await request.post("/api/advertisements/", { data: { name: "edit_test", price: "999" } });

        const reqName = "editmin_name";
        const reqPrice = "3465";

        let req = await request.get("/api/advertisements/");
        expect(req.ok()).toBeTruthy();
        let reqJson = await req.json();
        // Take random item from API
        let testItem = reqJson[Math.floor(Math.random() * Object.keys(reqJson).length)];

        let editReq = await request.put("/api/advertisements/" + testItem["_id"], {
            data: { name: reqName, price: reqPrice },
        });
        expect(editReq.ok()).toBeTruthy();

        let doubleCheck = await request.get("/api/advertisements/");
        expect(doubleCheck.ok()).toBeTruthy();
        let doubleCheckJson = await doubleCheck.json();
        let thisReqItem = doubleCheckJson.find((item) => item._id === testItem["_id"]);
        expect(thisReqItem).toBeTruthy();
        expect(thisReqItem["name"]).toBe(reqName);
        expect(thisReqItem["price"]).toBe(reqPrice);
        expect(thisReqItem["_id"]).toBe(testItem["_id"]);
    });

    test("Edit any existing advertisement - all fields", async ({ request }) => {
        // Lets create new item in case of API are empty
        await request.post("/api/advertisements/", { data: { name: "edit_test", price: "123" } });

        const reqName = "editmax_name";
        const reqStreet = "editmax_street";
        const reqRooms = "editmax_rooms";
        const reqPrice = "777";
        const reqStatus = true;

        let req = await request.get("/api/advertisements/");
        expect(req.ok()).toBeTruthy();
        let reqJson = await req.json();
        // Take random item from API
        let testItem = reqJson[Math.floor(Math.random() * Object.keys(reqJson).length)];

        let editReq = await request.put("/api/advertisements/" + testItem["_id"], {
            data: { name: reqName, street: reqStreet, rooms: reqRooms, price: reqPrice, status: reqStatus },
        });
        expect(editReq.ok()).toBeTruthy();

        let doubleCheck = await request.get("/api/advertisements/");
        expect(doubleCheck.ok()).toBeTruthy();
        let doubleCheckJson = await doubleCheck.json();
        let thisReqItem = doubleCheckJson.find((item) => item._id === testItem["_id"]);
        expect(thisReqItem).toBeTruthy();
        expect(thisReqItem["name"]).toBe(reqName);
        expect(thisReqItem["street"]).toBe(reqStreet);
        expect(thisReqItem["rooms"]).toBe(reqRooms);
        expect(thisReqItem["price"]).toBe(reqPrice);
        expect(thisReqItem["status"]).toBe(reqStatus);
        expect(thisReqItem["_id"]).toBe(testItem["_id"]);
    });
});

test.describe("API: negative tests", async () => {
    test("Create new advertisement - without required fields", async ({ request }) => {
        const reqStreet = "Lemon";
        const reqRooms = "Banana";

        let req = await request.post("/api/advertisements/", { data: { street: reqStreet, rooms: reqRooms } });
        expect(req.status()).toBe(400);
    });
    test("Create new advertisement - all fields empty", async ({ request }) => {
        const reqName = "";
        const reqStreet = "";
        const reqRooms = "";
        const reqPrice = "";
        const reqStatus = "";

        let req = await request.post("/api/advertisements/", {
            data: { name: reqName, street: reqStreet, rooms: reqRooms, price: reqPrice, status: reqStatus },
        });
        expect(req.status()).not.toBe(200);
    });
    test("Create new advertisement - invalid type", async ({ request }) => {
        const reqName = "name";
        const reqPrice = "price";
        const reqStatus = "status";

        let req = await request.post("/api/advertisements/", {
            data: { name: reqName, price: reqPrice, status: reqStatus },
        });
        expect(req.status()).not.toBe(200);
    });
    test("Edit any existing advertisement - invalid type", async ({ request }) => {
        // Lets create new item in case of API are empty
        await request.post("/api/advertisements/", { data: { name: "edit_test", price: "123" } });

        const reqName = "name";
        const reqPrice = "price";
        const reqStatus = "status";

        let req = await request.get("/api/advertisements/");
        expect(req.ok()).toBeTruthy();
        let reqJson = await req.json();
        // Take random item from API
        let testItem = reqJson[Math.floor(Math.random() * Object.keys(reqJson).length)];

        let editReq = await request.put("/api/advertisements/" + testItem["_id"], {
            data: { name: reqName, price: reqPrice, status: reqStatus },
        });
        expect(editReq.status()).not.toBe(200);
    });
});
