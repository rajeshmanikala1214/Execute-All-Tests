describe("wdi5 Test", () => {
  it("should add item to cart", async () => {
    const list = await browser.asControl({
      selector: { id: "itemList" }
    });

    const items = await list.getItems();
    await items[0].press();
  });
});