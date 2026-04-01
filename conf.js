exports.config = {
    profile: "integration",
    // In CI the app is served by the node container, reachable on localhost from selenium's perspective
    // but when running inside the node container, selenium is reachable as 'selenium'
    baseUrl: process.env.TEST_SERVER_URL || "http://node:8080",

    specs: ["./webapp/test/e2e/*.spec.js"],

    capabilities: [{
        browserName: "chrome"
    }],

    // This is passed via runOptions in the Jenkinsfile
    // seleniumAddress: "http://selenium:4444/wd/hub"
};