/**
 * karma.conf.js
 *
 * ROOT CAUSE OF FAILURE:
 *   karma-webdriver-launcher uses the 'wd' npm library internally.
 *   'wd' speaks the old JSON Wire Protocol (JWP).
 *   selenium/standalone-chrome 4.x speaks W3C WebDriver.
 *   When 'wd' POSTs to /session, Selenium 4 returns a W3C response where
 *   sessionId is nested inside { value: { sessionId: "..." } }.
 *   'wd' looks at the top-level sessionId field → finds undefined → logs "Session ID: undefined"
 *   Then when 'wd' tries to navigate with GET /session/undefined/url it fails with
 *   "Unable to find session with ID: url" (Selenium interprets "undefined" as the session ID
 *    and "url" as the command).
 *
 * FIX STRATEGY:
 *   Use a PINNED older Selenium image that still has backwards-compatible JWP support
 *   in the Jenkinsfile sidecarImage (selenium/standalone-chrome:3.141.59 is the last
 *   Selenium 3 release and speaks JWP natively).
 *
 *   OR: Keep the current Selenium 4 sidecar and patch karma-webdriver-launcher by
 *   using a custom launcher that uses the 'selenium-webdriver' npm package (W3C-native)
 *   instead of 'wd'. See the karmaCustomWebDriverFactory below.
 *
 * THIS FILE uses the patched approach: a factory function that uses selenium-webdriver
 * (W3C-native) instead of the 'wd' library.
 */

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

/**
 * Custom WebDriver launcher factory using selenium-webdriver (W3C-compatible).
 * This replaces karma-webdriver-launcher's use of the 'wd' library.
 */
function CustomChromeSeleniumFactory(logger, baseBrowserDecorator) {
    const log = logger.create('CustomChromeSelenium');

    const hostname = process.env.PIPER_SELENIUM_WEBDRIVER_HOSTNAME || 'selenium';
    const port = parseInt(process.env.PIPER_SELENIUM_WEBDRIVER_PORT || '4444', 10);
    const seleniumUrl = `http://${hostname}:${port}`;

    let driver;

    this.name = 'CustomChromeSelenium';

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

            log.info('Chrome session created, navigating to Karma URL');
            await driver.get(karmaUrl);
            log.info('Navigation complete');
        } catch (err) {
            log.error('Failed to start Chrome via selenium-webdriver:', err.message);
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

        // Register our W3C-compatible custom launcher
        plugins: [
            'karma-ui5',
            'karma-junit-reporter',
            'karma-coverage',
            {
                'launcher:CustomChromeSelenium': ['factory', CustomChromeSeleniumFactory]
            }
        ],

        browsers: ['CustomChromeSelenium'],

        /**
         * Karma server hostname = docker network alias of THIS (karma) container.
         * The Selenium Chrome browser needs to reach http://karma:9876 to load tests.
         * Piper injects PIPER_SELENIUM_HOSTNAME=karma automatically.
         */
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