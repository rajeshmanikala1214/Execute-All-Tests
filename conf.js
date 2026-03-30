exports.config = {
  profile: "integration",
  baseUrl: "http://localhost:8080",

  specs: ["./webapp/test/e2e/*.spec.js"],

  capabilities: [{
    browserName: "chrome"
  }]
};