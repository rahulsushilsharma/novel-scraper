import { URL } from "url";
import { load } from "cheerio";
import fetch from "node-fetch";
import { pharse } from "./innread/parser.js";


async function getDataHTML(url: string | URL) {
  const data = await fetch(url);
  return await data.text();
}
async function getDataJSON(url: string | URL) {
  const data = await fetch(url);
  return await data.json();
}

async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(){
  const html = await getDataHTML('https://innread.com/')
  const data = pharse(html)
  console.log(data)
}
main()
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

