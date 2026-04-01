/**
 * karma.conf.js
 *
 * Used by piper's karmaExecuteTests step.
 *
 * How it works:
 * - Piper spins up TWO containers in a Docker network:
 *     1. Node container  → network alias: "karma"   (runs Karma server on port 9876)
 *     2. Selenium sidecar→ network alias: "selenium" (Chrome WebDriver on port 4444)
 *
 * - Piper injects these env vars automatically into the node container:
 *     PIPER_SELENIUM_HOSTNAME          = "karma"      (Karma server host, seen by Selenium)
 *     PIPER_SELENIUM_WEBDRIVER_HOSTNAME = "selenium"  (Selenium host, seen by Karma)
 *     PIPER_SELENIUM_WEBDRIVER_PORT     = "4444"
 *
 * - karma-webdriver-launcher tells Selenium: "open a browser and load http://karma:9876"
 * - karma-ui5 serves the UI5 framework resources and your app files
 */
module.exports = function (config) {
    config.set({

        // karma-ui5 handles UI5 bootstrapping, resource serving, and test discovery
        frameworks: ['ui5'],

        ui5: {
            // Use UI5 tooling (ui5.yaml must exist) to serve resources locally.
            // This avoids network calls to sapui5.hana.ondemand.com
            url: 'https://ui5.sap.com',
            type: 'application',
            // Paths to your OPA5 test pages (relative to webapp/)
            paths: {
                webapp: 'webapp'
            }
        },

        // Custom browser: connects to Selenium WebDriver remote
        // Uses env vars injected by piper so the same config works locally and in CI
        customLaunchers: {
            ChromeSelenium: {
                base: 'WebDriver',
                config: {
                    hostname: process.env.PIPER_SELENIUM_WEBDRIVER_HOSTNAME || 'selenium',
                    port: parseInt(process.env.PIPER_SELENIUM_WEBDRIVER_PORT || '4444', 10)
                },
                browserName: 'chrome',
                name: 'Chrome'
            }
        },

        browsers: ['ChromeSelenium'],

        // Karma server hostname — must match the docker network alias of the node container.
        // Selenium needs to reach Karma at this hostname to load the test page.
        // Piper sets PIPER_SELENIUM_HOSTNAME="karma" as the docker network alias.
        hostname: process.env.PIPER_SELENIUM_HOSTNAME || 'karma',

        port: 9876,
        listenAddress: '0.0.0.0',

        // JUnit reporter output for Jenkins testsPublishResults
        reporters: ['progress', 'junit'],

        junitReporter: {
            outputDir: 'reports',
            outputFile: 'TESTS-karma-opa5.xml',
            suite: 'OPA5',
            useBrowserName: false
        },

        // Coverage reporter (optional but good for SonarQube)
        // Uncomment if karma-coverage is installed
        // reporters: ['progress', 'junit', 'coverage'],
        // preprocessors: {
        //     'webapp/**/*.js': ['coverage']
        // },
        // coverageReporter: {
        //     dir: 'reports/coverage',
        //     subdir: '.',
        //     reporters: [
        //         { type: 'lcovonly', file: 'lcov.info' },
        //         { type: 'cobertura', file: 'cobertura-coverage.xml' }
        //     ]
        // },

        singleRun: true,
        autoWatch: false,

        // Increase timeouts for OPA5 — tests can take longer than unit tests
        browserNoActivityTimeout: 120000,
        browserDisconnectTimeout: 30000,
        browserDisconnectTolerance: 2,
        captureTimeout: 120000,

        logLevel: config.LOG_INFO,
        colors: true
    });
};