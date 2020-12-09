import got, { Response } from "got";
import { URL } from "url";
import { load } from "cheerio";
import * as Datastore from "nedb";
import { meta, release } from "./definations";

const novel_meta_data = new Datastore("./database/novels-meta-data-test.db");

novel_meta_data.loadDatabase();

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
  // initial load of main novel page on novel updates
  const $ = load(data?.body);

  // getting the chepter meta data

  
//   console.log(meta);
  
}

getData(
  "https://www.novelupdates.com/series/a-demon-lords-tale-dungeons-monster-girls-and-heartwarming-bliss/"
);
