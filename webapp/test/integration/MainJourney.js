sap.ui.define([
  "sap/ui/test/opaQunit",
  "./pages/Main"
], function (opaTest) {
  "use strict";

  QUnit.module("OPA5 Test");

  opaTest("Should add item and submit", function (Given, When, Then) {
    Given.iStartMyApp();
    When.onTheMainPage.iPressOnItem();
    When.onTheMainPage.iPressSubmit();
    Then.onTheMainPage.iShouldSeeCartUpdated();
  });
});