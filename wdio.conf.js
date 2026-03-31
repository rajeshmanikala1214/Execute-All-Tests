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
                '--window-size=1920,1080' // Good practice for consistent screenshots
            ]
        }
    }],
    
    // Connection Settings
    hostname: 'selenium',
    port: 4444,
    path: '/', // Try '/' if '/wd/hub' causes 404 errors
    
    logLevel: 'info',
    baseUrl: 'http://localhost:8080', // Ensure this matches your UI5 serve port
    
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // Required for WDI5 features
    services: ['ui5'], 
    
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};