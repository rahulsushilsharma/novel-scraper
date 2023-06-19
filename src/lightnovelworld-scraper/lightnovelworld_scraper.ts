import got, { Response } from "got";
import { URL } from "url";
import { load } from "cheerio";
import { appendFile } from "fs/promises";
import { TimeoutError } from "got";
import * as Datastore from "nedb";
import { setInterval } from "timers";

const database = new Datastore("./database/lightnovelworld/novels-list.db");
const database_meta = new Datastore("./database/lightnovelworld/novel-meta.db");
const database_chapter_start_links = new Datastore(
  "./database/lightnovelworld/novel-chapter-start-links.db"
);
database.loadDatabase();
database_meta.loadDatabase();
database_chapter_start_links.loadDatabase();

const mainUrl = "https://www.lightnovelworld.com/browse/all/popular/all/";

async function getData(url: string | URL) {
  return (
    got(url, { timeout: 3000 })
      .then((data) => parseData(data))
      .then((datas) => {
        database_meta.insert(datas, (err, doc) => {
          if (err) console.log(err);
          else console.log("written to meta db");
        });
      })
      .then(() => delay(3000 * Math.random()))
  );
}

async function getMetaData(url: string | URL) {
  return got(url, { timeout: 3000 });
}

async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

function parseData(data: Response<string>) {
  let op = {
    title: "",
    alternate_title: "",
    tags: [],
    img_url: "",
    short_disc: "",
    type: "",
    author: "",
    rank: "",
    chapters: "",
    status: "",
    update_info: "",
  };
  let temp_tags: any = [];
  const $ = load(data?.body);

  op["img_url"] = $(".fixed-img").find(".cover").find("img")[0].attribs.src;

  op["title"] = $(".main-head").find(".novel-title").text();

  op["alternate_title"] = $(".main-head").find("h2")?.text();

  op["author"] = $(".author").find("a").find("span").text();

  op["rank"] = $(".rank").find("strong").text();

  op["update_info"] = $(".updinfo").find("strong").text();

  $(".header-stats")
    .find("span")
    .each((i, ele) => {
      if (i == 0) op["chapters"] = $(ele).text();
      if (i == 3) op["status"] = $(ele).text();
    });

  $(".summary")
    .find(".content")
    .find("p")
    .each((i, ele) => {
      op["short_disc"] += `${$(ele).text()}`;
    });

  $(".categories")
    .find("ul")
    .find("li")
    .each((i, ele) => {
      temp_tags.push($(ele).text());
    });
  op.tags = temp_tags;

  let first_chapter = `https://www.lightnovelworld.com${
    $(".chapter-list").find("li").find("a")[0].attribs.href
  }`;

  database_chapter_start_links.insert(
    { url: first_chapter, name: op.title },
    (err, doc) => {
      if (err) console.log(err);
      else console.log("written to start links db", doc);
    }
  );

  return op;
}

function parseMetaData(data: Response<string>) {
  let op: (string | undefined)[] = [];

  const $ = load(data?.body);

  $(".novel-item")
    .find("a")
    .each((i, ele) => {
      let datas = "https://www.lightnovelworld.com" + $(ele).attr("href");
      database.insert({ url: datas }, (err, doc) => {
        if (err) console.log(err);
      });
    });
  return op;
}

// getMetaData(mainUrl)
//   .then((data) => parseMetaData(data))
//   .then(async (data) => {
//     for await (const iterator of data) {
//       await getData(iterator as string).catch(async (e) => {
//         if (e instanceof TimeoutError) {
//           console.log("timeout error retryin...");
//           await delay(5000).then(() => getData(iterator as string));
//         } else console.log(e);
//       });
//     }
//   })
//   .catch((e) => console.log(e));
// let urlarr: string[] = [];
// function run() {
//   for (let i = 1; i < 29; i++) {
//     urlarr.push(mainUrl + i);
//   }
// }

// run();
// let i = 1;
// (async function () {
//   for await (let url of urlarr) {
//     await getMetaData(url)
//       .then((data) => parseMetaData(data))
//       .then(async () => await delay(10000 * Math.random()))
//       .then(() => {
//         console.log("written",i++);
//       })
//       .catch((e) => {
//         console.error(e);
//       });
//   }
// })();
database
  .find({})
  // .limit(1)
  .exec((e, doc) => {
    let i = 1;
    run(doc, i);
  });

async function run(doc: any, i: number) {
  for await (let url of doc) {
    await delay(10000 * Math.random())
      .then(() => {
        console.log(url.url, i++);
      })
      .then(() => {
        getData(url?.url);
      });
  }
}
