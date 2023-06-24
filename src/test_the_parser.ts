// import got, { Response } from "got";
// import { URL } from "url";
import { load } from "cheerio";
// import * as Datastore from "nedb";
// import { meta, release } from "./dependicies/definations";
// import { log } from "console";

// import fetch from "node-fetch";

// import { Builder, Browser, By, Key, until } from "selenium-webdriver";
// import { updateParsedLinks } from "./novelupdates-scraper/database.js";
// import { Options } from "selenium-webdriver/chrome.js";

// (async function example() {
//   process.env.PATH = '../driver/chromedriver/chromedriver.exe'
//   let driver = await new Builder().forBrowser(Browser.CHROME).build();
//   try {
//     const url = 'https://www.novelupdates.com/novelslisting/?sort=2&order=1&status=1'
//     await driver.get(url);
//     const data = await driver.findElement(By.css("html"))
//     const html = await data.getAttribute('innerHTML')
//     console.log(html)
//     // data.forEach(async ele=>console.log(await ele.getAttribute('innerHTML')))
//     // updateParsedLinks(url,1)

//   } finally {
//     await driver.quit();
//   }
// })();

// const novel_meta_data = new Datastore("./database/novels-meta-data-test.db");

// novel_meta_data.loadDatabase();

// async function getData(url: string | URL) {
//   let data = await fetch(url)
//   data = await data.json()
//   log(data)

//   return data
// }
// async function delay(ms: number) {
//   return await new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function parseData(url: string, data: Response<string>) {
//   // initial load of main novel page on novel updates
//   const $ = load(data?.body);

//   // getting the chepter meta data

// //   console.log(meta);

// }

// getData(
//   "https://www.novelupdates.com/series/a-demon-lords-tale-dungeons-monster-girls-and-heartwarming-bliss/"
// );

// async function getData() {
//   const data = await fetch("https://api.github.com/users/github");
//   if (data.ok) {
//     const data_ = await data.json();
//     console.log({
//       data_: data_,
//       status: data.status,
//       status_: data.statusText,
//     });
//   } else {
//     console.log(data.status, data.statusText);
//   }
// }

// getData();

import Datastore from "@seald-io/nedb";

const db = new Datastore({
  filename: "../database/novelupdates/Html.db",
});

await db.loadDatabaseAsync();

const data = await db.findAsync({});
const html_data = data[0].page;
const $ = load(html_data);

const novels = $(".search_main_box_nu").each((index, element) => {
  console.log(
    index,
    $(element).find('.search_title > a').text(),
    $(element).find('.search_title > a').attr('href')
      
  );
});
