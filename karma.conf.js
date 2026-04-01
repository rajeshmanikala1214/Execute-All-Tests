/**
 * karma.conf.js
 *
 * Uses the standard karma-webdriver-launcher (no custom factory).
 *
 * KEY INSIGHT: karma-webdriver-launcher uses the 'wd' library which speaks
 * JSON Wire Protocol (JWP). This is incompatible with Selenium 4.x (W3C only).
 *
 * SOLUTION: Use selenium/standalone-chrome:3.141.59 as the sidecar image.
 * Selenium 3.141.59 is the last Selenium 3 release and speaks JWP natively.
 * This is specified in the Jenkinsfile via the sidecarImage override.
 *
 * Piper injects these env vars automatically:
 *   PIPER_SELENIUM_HOSTNAME          = "karma"     (this container's network alias)
 *   PIPER_SELENIUM_WEBDRIVER_HOSTNAME = "selenium"  (sidecar's network alias)
 *   PIPER_SELENIUM_WEBDRIVER_PORT     = "4444"
 */
module.exports = function (config) {
    config.set({

        // karma-ui5 handles UI5 bootstrapping and test file discovery
        frameworks: ['ui5'],

        ui5: {
            url: 'https://ui5.sap.com',
            type: 'application',
            paths: {
                webapp: 'webapp'
            }
        },

        // Standard WebDriver launcher — reads env vars injected by piper
        customLaunchers: {
            ChromeSelenium: {
                base: 'WebDriver',
                config: {
                    hostname: process.env.PIPER_SELENIUM_WEBDRIVER_HOSTNAME || 'selenium',
                    port: parseInt(process.env.PIPER_SELENIUM_WEBDRIVER_PORT || '4444', 10)
                },
                browserName: 'chrome',
                name: 'Karma'
            }
        },

        browsers: ['ChromeSelenium'],

        // CRITICAL: hostname must match the docker network alias of this container.
        // Piper sets PIPER_SELENIUM_HOSTNAME=karma and the container gets
        // --network-alias karma. Selenium Chrome uses this to load http://karma:9876
        hostname: process.env.PIPER_SELENIUM_HOSTNAME || 'karma',

        port: 9876,
        listenAddress: '0.0.0.0',

        reporters: ['progress', 'junit'],

        junitReporter: {
            outputDir: 'reports',
            outputFile: 'TESTS-karma-opa5.xml',
            suite: 'OPA5',
            useBrowserName: false
        },

        singleRun: true,
        autoWatch: false,

        // Generous timeouts for OPA5 tests
        browserNoActivityTimeout: 120000,
        browserDisconnectTimeout: 30000,
        browserDisconnectTolerance: 2,
        captureTimeout: 120000,

        logLevel: config.LOG_INFO,
        colors: true
    });
};