describe("wdi5 Test", () => {
    it("should add item to cart", async () => {
        const button = await browser.asControl({
            selector: {
                id: "addButton"
            }
        });

        await button.press();
    });
});