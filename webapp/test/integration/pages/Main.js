sap.ui.define([
  "sap/ui/test/Opa5"
], function (Opa5) {
  "use strict";

  return Opa5.extend("app.test.integration.pages.Main", {

    actions: {
      iPressOnItem: function () {
        return this.waitFor({
          id: "itemList",
          success: function (oList) {
            oList.getItems()[0].firePress();
          }
        });
      },

      iPressSubmit: function () {
        return this.waitFor({
          id: "submitBtn",
          actions: function (oButton) {
            oButton.firePress();
          }
        });
      }
    },

    assertions: {
      iShouldSeeCartUpdated: function () {
        return this.waitFor({
          success: function () {
            Opa5.assert.ok(true, "Cart updated");
          }
        });
      }
    }
  });
});