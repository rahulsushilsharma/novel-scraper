import {
  getLastUrl,
  saveHtml,
  saveNovelLinks,
  updateLastUrl,
} from "./database.js";
import {
  clickOn,
  closeDriver,
  getCurrentPageHtml,
  getCurrentUrl,
  gotoPage,
} from "../dependicies/selenium.js";
import { delay } from "../dependicies/utility.js";
import { parseNovelLinks } from "./parser.js";

async function main() {
  const nextButtonPath =
    "body > div.l-canvas.col_contside > div.l-main > div > div > div.l-content > div.digg_pagination > a.next_page";
  const defaultUrl =
    "https://www.novelupdates.com/novelslisting/?sort=2&order=1&status=1";

  const url = (await getLastUrl()) || defaultUrl;
  console.log(url);
  await gotoPage(url);

  let next = await getNovelLinks(nextButtonPath);

  while (next) {
    next = await getNovelLinks(nextButtonPath);
  }

  closeDriver();
}

async function getNovelLinks(nextButtonPath: string) {
  const link = await getCurrentUrl();
  await updateLastUrl(link);
  const html = await getCurrentPageHtml();
  const data = parseNovelLinks(html);
  await saveNovelLinks(link, data);
  await delay(3000 * Math.random());
  return await clickOn(nextButtonPath);
}

main();
