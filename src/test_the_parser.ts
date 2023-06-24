// import got, { Response } from "got";
// import { URL } from "url";
// import { load } from "cheerio";
// import * as Datastore from "nedb";
// import { meta, release } from "./dependicies/definations";
// import { log } from "console";

import fetch from "node-fetch";

import { Builder, Browser, By, Key, until } from "selenium-webdriver";

(async function example() {
  process.env.PATH = '../driver/chromedriver/chromedriver.exe'
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get("https://www.novelupdates.com/");
    await driver.findElement(By.name("q")).sendKeys("webdriver", Key.RETURN);
    await driver.wait(until.titleIs("webdriver - Google Search"), 1000);
  } finally {
    // await driver.quit();
  }
})();

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

async function getData() {
  const data = await fetch("https://api.github.com/users/github");
  if (data.ok) {
    const data_ = await data.json();
    console.log({
      data_: data_,
      status: data.status,
      status_: data.statusText,
    });
  } else {
    console.log(data.status, data.statusText);
  }
}

getData();
