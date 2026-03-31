describe("wdi5 Test", () => {

    it("should click first list item", async () => {
        const list = await browser.asControl({
            selector: { id: "itemList" }
        });

        const items = await list.getItems();
        await items[0].press();
    });

    it("should click submit button", async () => {
        const button = await browser.asControl({
            selector: { id: "submitBtn" }
        });

        await button.press();
    });

});