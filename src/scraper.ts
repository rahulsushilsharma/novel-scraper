import { URL } from "url";
import { load } from "cheerio";
import fetch from "node-fetch";
import { pharse, pharseData } from "./innread/parser.js";
import { delay } from "./dependicies/utility.js";

const baseUrl = "https://innread.com";

async function getDataHTML(url: string | URL) {
  const data = await fetch(url);
  return await data.text();
}

async function getDataJSON(url: string | URL) {
  const data = await fetch(url);
  return await data.json();
}

async function main() {
  const initialPath = "/novel/ending-maker/chapter-1.html";
  getAllChapters(initialPath);
}
main();

async function getAllChapters(initialPath: string) {
  let data: pharseData = {
    links: {
      prevousChapter: "",
      nextChapter: baseUrl+ initialPath,
    },
    title: "",
    chapterNumber: "",
    chapterData: [],
  };
  let prevData: pharseData = {
    links: {
      prevousChapter: "",
      nextChapter: "",
    },
    title: "",
    chapterNumber: "",
    chapterData: [],
  };
  data.title = "start";

  while (data.title !== prevData.title) {
    prevData.title = data.title;
    const html = await getDataHTML(data.links.nextChapter);
    data = pharse(baseUrl, html);
    await delay(3000 * Math.random());
    console.log(data);
  }
}
// function parseData(data: Response<string>) {
//   let op = {
//     title: "",
//     tags: [],
//     img: "",
//     short_disc: "",
//     type: "",
//     author: "",
//   };
//   let temp_tags: any = [];
//   const $ = load(data?.body);

//   op["img"] = $("img")[0].attribs?.src;
//   op["title"] = $(".seriestitlenu").text();
//   op["author"] = $("authtag").text();
//   op["type"] = $("showtype").find("a").text();
//   op["short_disc"] = $("editdescription").find("p").text();
//   $("seriesgenre")
//     .find("a")
//     .each((i, ele) => {
//       temp_tags.push($(ele).text());
//     });
//   op.tags = temp_tags;
//   return JSON.stringify(op);
// }
// function parseMetaData(data: Response<string>) {
//   let op: (string | undefined)[] = [];

//   const $ = load(data?.body);

//   $(".search_title")
//     .find("a")
//     .each((i, ele) => {
//       op.push($(ele).attr("href"));
//     });
//   return op;
// }
