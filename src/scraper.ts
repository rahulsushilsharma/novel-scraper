import got, { Response } from "got";
import { URL } from "url";
import { load } from "cheerio";
import { appendFile } from "fs/promises";
import { TimeoutError } from "got";

async function getData(url: string | URL) {
  return got(url, { timeout: 3000 })
    .then((data) => parseData(data))
    .then((data) => write(data))
    .then(() => delay(3000 * Math.random()));
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
    tags: [],
    img: "",
    short_disc: "",
    type: "",
    author: "",
  };
  let temp_tags: any = [];
  const $ = load(data?.body);

  op["img"] = $("img")[0].attribs?.src;
  op["title"] = $(".seriestitlenu").text();
  op["author"] = $("authtag").text();
  op["type"] = $("showtype").find("a").text();
  op["short_disc"] = $("editdescription").find("p").text();
  $("seriesgenre")
    .find("a")
    .each((i, ele) => {
      temp_tags.push($(ele).text());
    });
  op.tags = temp_tags;
  return JSON.stringify(op);
}
function parseMetaData(data: Response<string>) {
  let op: (string | undefined)[] = [];

  const $ = load(data?.body);

  $(".search_title")
    .find("a")
    .each((i, ele) => {
      op.push($(ele).attr("href"));
    });
  return op;
}


async function write(data: any) {
  console.log("writing data");

  return await appendFile("data.txt", data).then(() =>
    appendFile("data.txt", "\n\n rahul sharma \n\n")
  );
}
getMetaData(
  "https://innread.com/"
)
  .then((data) => parseMetaData(data))
  .then(async (data) => {
    for await (const iterator of data) {
      await getData(iterator as string).catch(async (e) => {
        if (e instanceof TimeoutError) {
          console.log("timeout error retryin...");
          await delay(5000).then(() => getData(iterator as string));
        } else console.log(e);
      });
    }
  })
  .catch((e) => console.log(e));
