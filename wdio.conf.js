exports.config = {
  runner: "local",

  specs: ["./test/wdio/*.js"],

  framework: "mocha",

  reporters: ["spec"],

  services: ["ui5"],

  ui5: {
    url: "http://localhost:8080"
  },

  capabilities: [{
  maxInstances: 1,
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
  }
}]
};