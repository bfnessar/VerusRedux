exports.config = {
    
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        // './test/specs/access_fields_as_enduser.js',
        // './test/specs/access_fields_as_ITIL.js',
        './test/specs/fields_exist_as_enduser_existingForm.js',
        // './test/specs/fields_exist_as_enduser_newForm.js',
        // './test/specs/fields_exist_as_ITIL_existingForm.js',
        // './test/specs/fields_exist_as_ITIL_newForm.js',
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    capabilities: [{
        browserName: 'firefox'
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevel: 'verbose',
    //
    // Enables colors for log output.
    coloredLogs: true,
    //
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './errorShots/',
    //
    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
    baseUrl: 'http://localhost',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 1000000,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Initialize the browser instance with a WebdriverIO plugin. The object should have the
    // plugin name as key and the desired plugin options as properties. Make sure you have
    // the plugin installed before running any tests. The following plugins are currently
    // available:
    // WebdriverCSS: https://github.com/webdriverio/webdrivercss
    // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
    // Browserevent: https://github.com/webdriverio/browserevent
    // plugins: {
    //     webdrivercss: {
    //         screenshotRoot: 'my-shots',
    //         failedComparisonsRoot: 'diffs',
    //         misMatchTolerance: 0.05,
    //         screenWidth: [320,480,640,1024]
    //     },
    //     webdriverrtc: {},
    //     browserevent: {}
    // },
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    // services: [],//
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    //
    // Test reporter for stdout.
    // The following are supported: dot (default), spec, and xunit
    // see also: http://webdriver.io/guide/testrunner/reporters.html
    // reporters: ['dot'],
    //
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    //      https://mochajs.org/#usage
    //      https://mochajs.org/#mocha-opts
    mochaOpts: {
        ui: 'bdd'
    },
    //
    // =====
    // Hooks
    // =====
    // WedriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    //
    // Gets executed once before all workers get launched.
    // onPrepare: function (config, capabilities) {
    // },
    //
    // Gets executed before test execution begins. At this point you can access all global
    // variables, such as `browser`. It is the perfect place to define custom commands.
    before: function (capabilities, specs) {
        // These require statements have to be called before every test script
        var chai = require('chai');
        global.expect = chai.expect;
        chai.Should();

        // Define utility functions
        browser.addCommand("login", function(username, password){
            /* Here are three blocks of code that ostensibly do the same thing, except they don't. */
            /*  1) I WANT this code to work, where I call pageObj's methods,
                but I can't interact with the elements that are returned by the pageObject's getters. */
            // pageObj.setInstanceUrl(instanceUrl).open();
            // pageObj.username_field.setValue(username);
            // pageObj.password_field.setValue(password);
            // pageObj.login_button.click();

            /*  2) THIS code works, but it disobeys the principle that the element-names
                should be enpacsulated within the page object. That is, we refer to '#user_name', etc.
                explicitly in this wdio.config file. The benefit of NOT doing this (and, instead, using the
                getter functions that I made) is that IF the DOM of the ServiceNow login page should ever change,
                we would only need to change the name of the element ONCE, within sn_interface.page.js. Instead,
                if it changes, we have to change the name of the element in BOTH the aforementioned page object file,
                and also here, because we have hardcoded the element's name.    */
            browser.setValue('#user_name', username);
            browser.setValue('#user_password', password);
            browser.click('#sysverb_login');

            /*  3) OR we can define a function, called: pageObj.login_as(username, password),
                that gets called by this addCommand. It seems like it should work,
                but it doesn't, and also it feels silly to nest these login functions. I defined that function anyway,
                and it's located in sn_interface.page.js. I don't think we're going to use it, though,
                because it fails in the same way that Option 1 fails.
            */
            // pageObj.loginAs(username, password);
        });

    },
    //
    // Hook that gets executed before the suite starts
    // beforeSuite: function (suite) {
    // },
    //
    // Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
    // beforeEach in Mocha)
    // beforeHook: function () {
    // },
    //
    // Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
    // afterEach in Mocha)
    // afterHook: function () {
    // },
    //
    // Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // beforeTest: function (test) {
    // },
    //
    // Runs before a WebdriverIO command gets executed.
    // beforeCommand: function (commandName, args) {
    // },
    //
    // Runs after a WebdriverIO command gets executed
    // afterCommand: function (commandName, args, result, error) {
    // },
    //
    // Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // afterTest: function (test) {
    // },
    //
    // Hook that gets executed after the suite has ended
    // afterSuite: function (suite) {
    // },
    //
    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    // after: function (capabilities, specs) {
    // },
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    // onComplete: function(exitCode) {
    // }
}
