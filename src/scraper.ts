import got, { Response } from "got";
import { URL } from "url";
import { load } from "cheerio";
import { readFile, writeFile, appendFile } from "fs/promises";
import { TimeoutError } from "got";

let i: string | number | Uint8Array;
let url: string | URL;
// let options;
const env = "env.txt";
const path = "./novel_data/i-am-the-monarch.txt";

async function getData(url: string | URL) {
  return got(url, { timeout: 3000 });
}

async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

function parseData(data: Response<string>, parms: string) {
  const $ = load(data?.body);
  writeData($(parms).text());
}

function writeData(data: string | Uint8Array) {
  appendFile(path, data)
    .then(() => writeFile(env, i.toString()))
    .then(() => appendFile(path, "\n\n!this is scraped by rahul sharma!\n\n"))
    .then(() => delay(Math.random() * 1000))
    .then(() => run())
    .catch((err) => {
      console.log("\n\n!!!!!!!!___ file write error ____!!!!!!!\n\n", err);
    });
}

function run() {
  readFile(env)
    .then((data) => {
      i = parseInt(data.toString());
      url = `https://kobatochan.com/i-am-the-monarch-chapter-${i}/`;
      console.log(i, url);
      i++;
      return getData(url);
    })
    .then((data) => parseData(data, ".entry-content"))
    .catch((e) => {
      if (e instanceof TimeoutError) {
        delay(2000).then(() => run());
      }
      console.log("\n\n!!!!!!!!___ error ____!!!!!!!\n\n", e);
    });
}

run();
