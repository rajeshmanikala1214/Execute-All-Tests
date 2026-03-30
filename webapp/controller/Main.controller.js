sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("app.controller.Main", {

    onAddToCart: function (oEvent) {
      const oItem = oEvent.getSource().getBindingContext().getObject();
      const oModel = this.getView().getModel();
      const aCart = oModel.getProperty("/cart");

      aCart.push(oItem);
      oModel.setProperty("/cart", aCart);
    },

    onSubmit: function () {
      const oModel = this.getView().getModel();
      alert("Items in cart: " + oModel.getProperty("/cart").length);
    }
  });
});