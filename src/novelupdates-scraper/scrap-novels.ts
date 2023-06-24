// import { URL } from "url";
// import { load } from "cheerio";
// import Datastore from "@seald-io/nedb";
// import { chapter, meta, release } from "../dependicies/definations";

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

// const database = new Datastore("./database-test1/novels-meta.db")
// const db :{tset:any}= {
//   tset: undefined
// }
// const db_path = "./database-novel-chapters/";

// async function delay(ms: number) {
//   return await new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function loadDb() {
//   var date1 = new Date().getTime();
//   db.tset = await database.loadDatabaseAsync();
//   var date2 = new Date().getTime();
//   var diff = date2 - date1;
//   console.log("database loaded in ", diff / 1000, "seconds");
// }

// async function getData(url: string | URL) {
//   let ram = Math.random();
//   console.log("creating a delay of ",ram * 5000, ' for anti bot detection and happy servers😊😊');
//   let response = null;
//   try {
//     response = await fetch(url);
//   } catch (e) {
//     console.log("error at getting data");
//     console.error(e);
//   }
//   await delay(5000 * ram);
//   return await response?.text();
// }

// async function parseData(
//   meta: any,
//   data: string,
//   computed_chapter_number: number
// ) {
//   const $ = load(data);
//   let chaprer: chapter = {
//     title: $("h1").text(),
//     computed_chapter_number: computed_chapter_number,
//     orignal_chapter_number: meta.chapter,
//     date: meta.date,
//     group: meta.group,
//     orignal_url: meta.url,
//     chapter: $("p").text(),
//   };
//   return chaprer;
// }

// async function query(queryObj: any) {
//   const data = await db.tset.findAsync({}).sort(queryObj);
//   return data
// }

// async function createDatabase(path: string, name: string) {
//   name = name.toLocaleLowerCase().replace(/,| |:/g, "-");

//   console.log("****************creating new database with name:", name);
//   let new_path = path + name + ".db";
//   let db = new Datastore(new_path);
//   db.loadDatabase();
//   return db;
// }

// async function run() {
//   await loadDb();
//   let queryDatas: any = await query({ rank: 1 });
//   for await (let queryData of queryDatas) {
//     console.log(
//       "****************Novel :",
//       queryData.name,
//       "Rank :",
//       queryData.rank
//     );
//     console.log(
//       "****************number of chapters :",
//       queryData.chapter_links.length
//     );
//     let db = await createDatabase(db_path, queryData.name);
//     console.log("****************created new DB");
//     let computed_chapter_number = queryData.chapter_links.length - 1;
//     for await (let link of queryData.chapter_links) {
//       try{
//         let response = await getData(link.url)||"";
//       let data = await parseData(link, response, computed_chapter_number);
//       console.log(
//         "****************writing to db chapter",
//         link.chapter,
//         computed_chapter_number
//       );

//       await db.insert(data);
//       }catch(e){
//         console.error(e);
//       }
//       computed_chapter_number--;
//     }
//   }
// }

// run();

async function main() {
  const nextButtonPath = "body > div.l-canvas.col_contside > div.l-main > div > div > div.l-content > div.digg_pagination > a.next_page";
  const defaultUrl =
    "https://www.novelupdates.com/novelslisting/?sort=2&order=1&status=1";

  const url = await getLastUrl()|| defaultUrl;
  console.log(url);
  await gotoPage(url);
  // const html = await getCurrentPageHtml();
  // const link = await getCurrentUrl();
  // let next = await clickOn(nextButtonPath);
  // const data = parseNovelLinks(html);
  // await saveNovelLinks(link, data);
  // await updateLastUrl(link);
  const link = await getCurrentUrl();
  await updateLastUrl(link);
  const html = await getCurrentPageHtml();
  const data = parseNovelLinks(html);
  await saveNovelLinks(link, data);
  let next = await clickOn(nextButtonPath);

  while (next) {
    const link = await getCurrentUrl();
    await updateLastUrl(link);
    const html = await getCurrentPageHtml();
    const data = parseNovelLinks(html);
    await saveNovelLinks(link, data);
    await delay(3000 * Math.random());
    next = await clickOn(nextButtonPath);
  }

  closeDriver();
}

main();
