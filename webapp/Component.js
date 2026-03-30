sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
  "use strict";

  return UIComponent.extend("app.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      const oData = {
        items: [
          { name: "Item 1" },
          { name: "Item 2" }
        ],
        cart: []
      };

      this.setModel(new JSONModel(oData));
    }
  });
});