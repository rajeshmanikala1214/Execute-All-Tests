exports.config = {
    runner: 'local',
    specs: [
        './test/wdio/**/*.test.js'
    ],
    maxInstances: 1, // only 1 Chrome at a time
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--headless',         // run headless in Docker
                '--no-sandbox',       // required for Docker
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        }
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // Use Selenium container hostname, not localhost
    hostname: 'selenium',       // match your sidecarName in pipeline
    port: 4444,
    path: '/wd/hub',

    services: [], // no local chromedriver, using remote Selenium
};