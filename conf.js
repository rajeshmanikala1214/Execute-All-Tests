/**
 * conf.js - UIVeri5 configuration
 *
 * seleniumAddress is NOT set here — it is passed via --seleniumAddress in runOptions
 * from the Jenkinsfile uiVeri5ExecuteTests step.
 * baseUrl is also passed via --baseUrl in runOptions.
 */
exports.config = {
    profile: 'integration',
    baseUrl: process.env.TEST_SERVER_URL || 'http://node:8080',
    specs: ['./webapp/test/e2e/*.spec.js'],
    capabilities: [{
        browserName: 'chrome'
    }]
};