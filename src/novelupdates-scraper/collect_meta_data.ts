import got, { Response } from "got";
import { URL } from "url";
import { load } from "cheerio";
import { TimeoutError } from "got";
import * as Datastore from "nedb";

interface release {
  date?: string;
  group?: string;
  chapter?: string;
  name?: string;
  url?: string;
}

let NAME :string;
const novel_list = new Datastore("./database/novels-list.db");

novel_list.loadDatabase();

const database = new Datastore("./database/novels-meta.db");

database.loadDatabase();

async function getData(url: string | URL) {
  return await got(url, { timeout: 3000 })
    .then(async (data) => await parseData(url as string, data))
    .then(async () => await delay(10000 * Math.random()))
    .catch((e) => console.log(e));
}

async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseData(url: string, data: Response<string>) {
  const $ = load(data?.body);

  console.log($(".digg_pagination").find("a")[2].attribs.href.slice(6));

  let lastPage = parseInt(
    $(".digg_pagination").find("a")[2].attribs.href.slice(6)
  );
  await getChapterLinks(url, lastPage)
    .then((data) => {
      database.insert(data, (e, d) => {
        console.log("written to database");
      });
    })
    .catch((e) => {
      console.log("!!!ERROR IN GETCHAPTERLINKS!!!");
    });
}

async function getChapterLinks(url: string, lastPage: number) {
  let arr_of_url = [];

  url += "?pg=";

  for (let i = 1; i <= lastPage; i++) {
    arr_of_url.push(url + i);
  }

  return await geturls(arr_of_url);
}

async function geturls(arr_of_url: any) {
  let orignal_urls: release[] = [];
  let i = 1;

  for await (let url of arr_of_url) {
    await got(url, { timeout: 10000 })
      .then((data) => parseUrlOfChapters(data))
      .then((data) => {
        orignal_urls = orignal_urls.concat(data);
      })
      .then(async () => await delay(1000 * Math.random()))
      .then(() => {
        console.log("written", i++);
      })
      .catch((e) => {
        console.error(e);
      });
  }
  return orignal_urls;
}

function parseUrlOfChapters(data: any) {
  const $ = load(data?.body);

  let op: release[] = [];

  let temp: any[] = [];

  let table_row = $("#myTable").find("tr");

  let table_data = $(table_row).find("td");

  table_data.each((i, ele) => {
    temp.push($(ele).html()?.trim());
  });

  var i,
    j,
    temparray,
    chunk = 3;
  let real_arr = [];
  for (i = 0, j = temp.length; i < j; i += chunk) {
    temparray = temp.slice(i, i + chunk);
    real_arr.push(temparray);
  }

  real_arr.forEach((element) => {
    let data: release = {
      date: element[0],
      name: NAME,
      group: $(element[1]).text(),
      chapter: $(element[2])[0].attribs.title,
      url: $(element[2])[0].attribs.href.slice(2),
    };

    op.push(data);
  });
  return op;
}

novel_list.find({}).sort({ rank: 1 }).exec(async (err, doc) => {
 await run(doc)
});

async function run(data: any[] ) {
  let i = 1;
  for await (let url of data) {
    NAME = url.name;
    await getData(url.url)
      .then(() => {
        console.log("novel number ", i++);
      })
      .catch((e) => {
        console.error(e);
      });
  }
}

