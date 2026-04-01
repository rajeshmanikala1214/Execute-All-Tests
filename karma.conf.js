/*const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

function CustomChromeSeleniumFactory(logger, baseBrowserDecorator) {
    const log = logger.create('CustomChromeSelenium');

    const hostname = process.env.PIPER_SELENIUM_WEBDRIVER_HOSTNAME || 'selenium';
    const port = parseInt(process.env.PIPER_SELENIUM_WEBDRIVER_PORT || '4444', 10);
    const seleniumUrl = `http://${hostname}:${port}`;

    let driver;

    this.name = 'CustomChromeSelenium';

    // ✅ REQUIRED: assign unique browser id
    this.id = 'custom-chrome-' + Math.random().toString(36).substring(2, 8);

    baseBrowserDecorator(this);

    this._start = async (karmaUrl) => {
        log.info(`Starting Chrome via selenium-webdriver at ${seleniumUrl}`);
        log.info(`Karma URL: ${karmaUrl}`);

        try {
            const options = new chrome.Options();
            options.addArguments(
                '--headless',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080'
            );

            driver = await new Builder()
                .usingServer(seleniumUrl)
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();

            log.info('Chrome session created');

            await driver.get(karmaUrl);

            log.info('Navigation complete');

            // ✅ Notify Karma browser is ready
            this._done();

        } catch (err) {
            log.error('Failed to start Chrome:', err);
            this._done('failure');
        }
    };

    this.on('kill', async (done) => {
        log.info('Killing Chrome session');

        try {
            if (driver) {
                await driver.quit();
            }
        } catch (e) {
            log.warn('Error quitting driver:', e.message);
        }

        done();
    });

    // ✅ REQUIRED: Proper shutdown handling
    this._onProcessExit = async (done) => {
        log.info('Process exit triggered');

        try {
            if (driver) {
                await driver.quit();
            }
        } catch (e) {
            log.warn('Error during process exit:', e.message);
        }

        done();
    };
}

CustomChromeSeleniumFactory.$inject = ['logger', 'baseBrowserDecorator'];

module.exports = function (config) {
    config.set({

        frameworks: ['ui5'],

        ui5: {
            url: 'https://ui5.sap.com',
            type: 'application',
            paths: {
                webapp: 'webapp'
            }
        },

        plugins: [
            'karma-ui5',
            'karma-junit-reporter',
            'karma-coverage',
            {
                'launcher:CustomChromeSelenium': ['factory', CustomChromeSeleniumFactory]
            }
        ],

        browsers: ['CustomChromeSelenium'],

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

        browserNoActivityTimeout: 120000,
        browserDisconnectTimeout: 30000,
        browserDisconnectTolerance: 2,
        captureTimeout: 120000,

        logLevel: config.LOG_INFO,
        colors: true
    });
};
*/
module.exports = function (config) {
    config.set({

        frameworks: ['ui5'],

        ui5: {
            url: 'https://ui5.sap.com',
            type: 'application',
            paths: {
                webapp: 'webapp'
            }
        },

        browsers: ['ChromeHeadless'],

        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--window-size=1920,1080'
                ]
            }
        },

        reporters: ['progress', 'junit'],

        junitReporter: {
            outputDir: 'reports',
            outputFile: 'TESTS-karma-opa5.xml',
            suite: 'OPA5',
            useBrowserName: false
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,

        autoWatch: false,
        singleRun: true,

        browserNoActivityTimeout: 120000,
        browserDisconnectTimeout: 30000,
        browserDisconnectTolerance: 2,
        captureTimeout: 120000,

        plugins: [
            'karma-ui5',
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-coverage'
        ]
    });
};
