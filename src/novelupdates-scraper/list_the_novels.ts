// import got, { Response } from "got";
// import { URL } from "url";
// import { load } from "cheerio";
// import { TimeoutError } from "got";
// import * as Datastore from "nedb";

// interface op {
//   rank?: number;
//   url?: string;
//   name?: string;
// }
// const database = new Datastore("./database/novels-list.db");

// database.loadDatabase();

// const mainUrl =
//   "https://www.novelupdates.com/series-ranking/?rank=popular&pg=";

// async function getMetaData(url: string | URL) {
//   return got(url, { timeout: 3000 });
// }

// async function delay(ms: number) {
//   return await new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function parseMetaData(data: Response<string>) {

//   let arr: op[] = [];

//   const $ = load(data?.body);

//   $(".search_body_nu").each((i, ele) => {
   
//     arr.push({
//       rank: parseInt( $(ele).find(".search_title").find('.genre_rank').text().slice(1)),
//       url:  $(ele).find(".search_title").find('a')[0].attribs.href,
//       name:  $(ele).find(".search_title").find('a').text()
//     });
//   });

//   return arr;
// }

// let urlarr: string[] = [];
// function run() {
//   for (let i = 1; i < 337; i++) {
//     urlarr.push(mainUrl + i);
//   }
// }

// run();


// let i = 1;
// (async function () {
//   for await (let url of urlarr) {
//     await getMetaData(url)
//       .then((data) => parseMetaData(data))
//       .then((data) => database.insert(data))
//       .then(async () => await delay(1000 * Math.random()))
//       .then(() => {
//         console.log("written", i++);
//       })
//       .catch((e) => {
//         console.error(e);
//       });
//   }
// })();

