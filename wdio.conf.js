/**
 * wdio.conf.js
 *
 * Used by WDI5 tests (npm run wdi5:ci).
 *
 * In the piper Docker network:
 *   - This node container has network alias "node" → app served at http://node:8080
 *   - Selenium sidecar has network alias "selenium" → WebDriver at http://selenium:4444
 */
exports.config = {
    runner: 'local',
    specs: ['./test/wdio/**/*.test.js'],
    maxInstances: 1,

    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--headless',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080'
            ]
        }
    }],

    // Connect to the Selenium sidecar container
    hostname: 'selenium',
    port: 4444,
    path: '/',

    logLevel: 'info',
    baseUrl: 'http://node:8080',

    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // wdi5 service initialises the UI5 bridge before tests run
    services: ['ui5'],
    ui5: {
        url: 'http://node:8080',
        waitForUI5Timeout: 30000
    },

    framework: 'mocha',
    reporters: [
        'spec',
        ['junit', {
            outputDir: './reports',
            outputFileFormat: function (options) {
                return `TESTS-wdi5-${options.cid}.xml`;
            }
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};