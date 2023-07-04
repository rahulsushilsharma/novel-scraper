import { Builder, Browser, By } from "selenium-webdriver";

process.env.PATH = "../driver/chromedriver/chromedriver.exe";
let driver = await new Builder().forBrowser(Browser.CHROME).build();

async function gotoPage(url: string) {
  await driver.get(url);
}

async function getCurrentPageHtml() {
  await driver.findElement(By.css("body")).sendKeys("Keys.ESCAPE");
  const data = await driver.findElement(By.css("body"));
  // data.sendKeys("Keys.ESCAPE");
  // await driver.executeScript('return window.stop')
  const html = await data.getAttribute("innerHTML");
  return html;
}

async function clickOn(xpath: string) {
  try {
    await driver.findElement(By.css(xpath)).click();
    return true;
  } catch {
    return false;
  }
}

async function getCurrentUrl() {
  return await driver.getCurrentUrl();
}
function closeDriver() {
  driver.quit();
}

export { getCurrentPageHtml, gotoPage, closeDriver, clickOn, getCurrentUrl };
