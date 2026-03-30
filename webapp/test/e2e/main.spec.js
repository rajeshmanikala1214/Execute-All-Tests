describe("UIVeri5 Test", () => {
  it("should click item", async () => {
    const list = element(by.control({ id: "itemList" }));
    const items = await list.all(by.control({}));

    await items[0].click();
  });
});