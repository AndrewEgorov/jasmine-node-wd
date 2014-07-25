//NECESSARY USINGS AND VARIABLES
var webdriver = require('selenium-webdriver');
var google = require('./GooglePage.js').page;
jasmine.getEnv().defaultTimeoutInterval = 30000;

var serverUrl = process.env.SERVER_URL || "http://localhost:4444/wd/hub";
var browserName = process.env.BROWSER_NAME || "chrome";
//END OF SECTION

webdriver.promise.controlFlow().on('uncaughtException', function (e) {
    console.log('Error occured during test execution: ', e);
});

describe('googling', function() {
    beforeAll(function() {
        driver = new webdriver.Builder()
            .usingServer(serverUrl)
            .withCapabilities({ browserName: browserName })
            .build();

        driver.manage().window().maximize();
    });

    beforeEach(function() {
        driver.get("http://google.com");
        gPage = google(driver);
        driver.sleep(1000);
    });

    afterAll(function() {
        driver.close();
    });

    it('should find selenium with ' + browserName + ' browser', function() {
	gPage.searchInput().value("selenium");
	expect(gPage.firstLink().text()).toBe("Selenium - Web Browser Automation");
    });
});
