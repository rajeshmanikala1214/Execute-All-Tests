module.exports = function (config) {
  config.set({
    frameworks: ["ui5"],
    ui5: {
      type: "application",
      paths: {
        webapp: "webapp"
      }
    },

    browsers: ["ChromeHeadless"],

    reporters: ["progress", "junit"],

    junitReporter: {
      outputDir: "reports",
      outputFile: "TESTS.xml",
      useBrowserName: false
    },

    singleRun: true
  });
};