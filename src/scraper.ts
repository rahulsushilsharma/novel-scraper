import * as puppeteer from 'puppeteer'

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.novelupdates.com/');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();