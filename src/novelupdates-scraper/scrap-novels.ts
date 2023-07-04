import {
  getLastUrl,
  getUnparsedData,
  saveHtml,
  saveNovelLinks,
  saveNovelMeta,
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
import { parseNovelLinks, parseNovelPage } from "./parser.js";

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


async function getNovelMeta() {
  let url = '';
  const unparsedNovels = await getUnparsedData();
  let currentPage = '';

  for (const data of unparsedNovels) {
    currentPage = data._id
    for (const novel of data.data) {
      // console.log(novel, data, unparsedNovels)
      await gotoPage(novel.url);
      const html = await getCurrentPageHtml();
      const parsedData = parseNovelPage(html, novel.rank, novel.title)
      // console.log( parsedData)

      const saved = await saveNovelMeta(novel.url, parsedData)
      console.log(saved)
      await delay(3000 * Math.random());

    }
  }

}

// main();
getNovelMeta()
