var webdriver = require('selenium-webdriver');
var flow = webdriver.promise.controlFlow();

exports.page = function(driver) {
    return {
        searchInput: function() {
            return UIElement(driver, '#gbqfq');
        },
        searchButton: function() {
            return UIElement(driver, 'gbqfb');
        },
        firstLink: function() {
            return UIElement(driver, 'h3 > a');
        }
    };
};

function UIElement(driver, selector) {

    var elementOrPromise;

    if (typeof selector == "function") {
        elementOrPromise = selector();
    } else if (selector instanceof webdriver.WebElement) {
        elementOrPromise = selector;
    } else {
        elementOrPromise = driver.findElement(webdriver.By.css(selector));
    }

    function run(fn) {
        return flow.execute(function () {
            if (elementOrPromise instanceof webdriver.WebElement) {
                return fn(elementOrPromise);
            }
            return elementOrPromise.then(function (element) {
                elementOrPromise = element;
                return fn(element);
            }, function (err) {
                console.log(err);
            });
        });
    }

    return {
        click: function () {
            return run(function (element) {
                return element.click();
            });
        },
        find: function (childSelector, index) {
            if (arguments.length == 2) {
                return UIElement(driver, function () {
                    return run(function (element) {
                        return element.findElements(webdriver.By.css(childSelector)).then(function (elems) {
                            return elems[index];
                        });
                    });
                });
            }
            return UIElement(driver, function () {
                return run(function (element) {
                    return element.findElement(webdriver.By.css(childSelector));
                });
            });
        },
        waitUntilLoad: function () {
            return WaitUntilLoad();
        },
        findElements: function (childrensSelector) {
            return run(function (element) {
                return element.findElements(webdriver.By.css(childrensSelector)).then(function (elems) {
                    return elems.map(function (e) {
                        return UIElement(driver, function () {
                            return e;
                        });
                    });
                });
            });
        },
        text: function () {
            return run(function (element) {
                return element.getText();
            });
        },
        attr: function (name) {
            return run(function (element) {
                return element.getAttribute(name);
            });
        },
        value: function (text) {
            if (arguments.length == 0) {
                return run(function (element) {
                    return element.getAttribute('value');
                });
            }
            return run(function (element) {
                return element.clear().then(function () {
                    return element.sendKeys(text, webdriver.Key.ENTER).then(function () {
                        return driver.sleep(500);
                    });
                });
            });
        }
    };
}

function WaitUntilLoad() {
    return driver.findElement(webdriver.By.css('.srg')).then(function (elem) {
        return elem.isDisplayed().then(function () {
            return;
        });
    }, function (error) {
        console.log("Error occured during waiting for the page: " + error);
        WaitUntilLoad();
    });
}