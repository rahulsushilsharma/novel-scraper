import { Builder, Browser, By } from "selenium-webdriver";

process.env.PATH = "../driver/chromedriver/chromedriver.exe";

let driver = await new Builder().forBrowser(Browser.CHROME).build();

/**
 * Navigates to the specified URL.
 * @param url - The URL to navigate to.
 */
async function gotoPage(url: string) {
  await driver.get(url);
}

/**
 * Retrieves the HTML of the current page.
 * @returns The HTML of the current page.
 */
async function getCurrentPageHtml() {
  await driver.findElement(By.css("body")).sendKeys("Keys.ESCAPE");
  const data = await driver.findElement(By.css("body"));
  const html = await data.getAttribute("innerHTML");
  return html;
}

/**
 * Clicks on the element identified by the given XPath.
 * @param xpath - The XPath of the element to click on.
 * @returns A boolean indicating whether the click was successful.
 */
async function clickOn(xpath: string) {
  try {
    await driver.findElement(By.css(xpath)).click();
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves the current URL.
 * @returns The current URL.
 */
async function getCurrentUrl() {
  return await driver.getCurrentUrl();
}

/**
 * Closes the WebDriver instance.
 */
function closeDriver() {
  driver.quit();
}

export { getCurrentPageHtml, gotoPage, closeDriver, clickOn, getCurrentUrl };

