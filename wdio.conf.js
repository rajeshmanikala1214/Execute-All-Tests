exports.config = {
    runner: 'local',
    specs: [
        './test/wdio/**/*.test.js'
    ],
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

    // In the Docker network created by piper, the node container is reachable as 'node'
    hostname: 'selenium',
    port: 4444,
    path: '/',

    logLevel: 'info',
    // IMPORTANT: use 'node' hostname (the docker network alias of the main container)
    baseUrl: 'http://node:8080',

    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['ui5'],

    ui5: {
        url: 'http://node:8080',
        // Wait for UI5 bootstrap to complete before running tests
        waitForUI5Timeout: 30000
    },

    framework: 'mocha',
    reporters: [
        'spec',
        ['junit', {
            outputDir: './reports',
            outputFileFormat: function(options) {
                return `TESTS-wdi5-${options.cid}.xml`;
            }
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};