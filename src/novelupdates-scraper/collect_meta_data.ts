// import got, { Response } from "got";
// import { URL } from "url";
// import { load } from "cheerio";
// import * as Datastore from "nedb";
// import { meta, release } from "../dependicies/definations";

// let NAME: string;
// const novel_list = new Datastore("./database/novels-list.db");
// const novel_chapter_list = new Datastore("./database/novels-meta.db");
// const novel_meta_data = new Datastore("./database/novels-meta-data.db");

// novel_list.loadDatabase();
// novel_chapter_list.loadDatabase();
// novel_meta_data.loadDatabase();

// async function getData(url: string | URL) {
//   return await got(url, { timeout: 3000 })
//     .then(async (data) => await parseData(url as string, data))
//     .then(async () => await delay(10000 * Math.random()))
//     .catch((e) => console.log(e));
// }

// async function delay(ms: number) {
//   return await new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function parseData(url: string, data: Response<string>) {
//   // initial load of main novel page on novel updates
//   const $ = load(data?.body);

//   // getting the chepter meta data

//   let meta: meta = {};

//   let names: any[] = [];

//   names.push($(".seriestitlenu").text());

//   names = names.concat($("#editassociated").html()?.split("<br>"));

//   let img_url = $("img")[0].attribs?.src;

//   let route_name = $(".seriestitlenu")
//     .text()
//     .toLocaleLowerCase()
//     .replace(/,| |:/g, "-");

//   let author = $("#authtag").text();

//   let artist = $("#artiststag").text();

//   let origin_language = $("a.genre.lang").text();

//   let complete = $("#showtranslated").text().slice(1);

//   let last_update = $("#myTable").find("td").html()?.toString();

//   let description = $("#editdescription").find("p").text();

//   let rank = null;

//   let totel_chapters = null;

//   let genre: string[] = [];
//   $("#seriesgenre")
//     .find("a")
//     .each((i, ele) => {
//       genre.push($(ele).text());
//     });

//   meta = {
//     last_update: last_update,
//     names: names,
//     route_name: route_name,
//     genre: genre,
//     img_url: img_url,
//     origin_language: origin_language,
//     author: author,
//     artist: artist,
//     rank: rank,
//     description: description,
//     totel_chapters: totel_chapters,
//     complete: complete,
//   };

//   novel_meta_data.insert(meta, (e, doc) => {
//     console.log("***************meta written to database**************");
//   });

//   // start to get chapter links
//   console.log("\n*****************************************************");

//   console.log(
//     "number of pages to be scraped for chapter links:",
//     $(".digg_pagination").find("a")[2].attribs.href.slice(6)
//   );
//   console.log(
//     'Novel Name : ',names[0]
//   );
//   let lastPage = parseInt(
//     $(".digg_pagination").find("a")[2].attribs.href.slice(6)
//   );

//   await getChapterLinks(url, lastPage)
//     .then((data) => {
//       novel_chapter_list.insert({ chapter_links: data }, (e, d) => {
//         console.log(
//           "written to **********novel_chapter_list********* database"
//         );
//       });
//     })
//     .catch((e) => {
//       console.log("!!!ERROR IN GET CHAPTER LINKS!!!");
//     });

//   // end to get chapter links
// }

// async function getChapterLinks(url: string, lastPage: number) {
//   let arr_of_url: string[] = [];

//   url += "?pg=";

//   for (let i = 1; i <= lastPage; i++) {
//     arr_of_url.push(url + i);
//   }
//   let orignal_urls: release[] = [];
//   let i = 1;
//   let should_parse: boolean = true;
//   for await (let url of arr_of_url) {
//     if (should_parse) {
//       await got(url, { timeout: 10000 })
//         .then((data) => parseUrlOfChapters(data))
//         .then((data) => {
//           if (data[0].is_scrapable == false) {
//             should_parse = false;
//             console.log(
//               "\n!!!!!!! skiping beacouse novel is under paid wall !!!!!!!\n"
//             );
//             orignal_urls = orignal_urls.concat(data);
//           } else {
//             orignal_urls = orignal_urls.concat(data);
//           }
//         })
//         .then(() => {
//           console.log("scraping for chapter links. Page : ", i++);
//         })
//         .catch((e) => {
//           console.error(e);
//         });
//     }
//   }
//   return orignal_urls;
// }

// function parseUrlOfChapters(data: any) {
//   const $ = load(data?.body);

//   let op: release[] = [];

//   let temp: any[] = [];

//   let table_row = $("#myTable").find("tr");

//   let table_data = $(table_row).find("td");

//   table_data.each((i, ele) => {
//     temp.push($(ele).html()?.trim());
//   });

//   var i,
//     j,
//     temparray,
//     chunk = 3;
//   let real_arr = [];
//   for (i = 0, j = temp.length; i < j; i += chunk) {
//     temparray = temp.slice(i, i + chunk);
//     real_arr.push(temparray);
//   }

//   for (let i = 0; i < real_arr.length; i++) {
//     if ($(real_arr[i][1]).text() == "Wuxiaworld") {
//       let data: release = {
//         is_scrapable: false,
//       };
//       op.push(data);
//       break;
//     } else {
//       let data: release = {
//         date: real_arr[i][0],
//         name: NAME,
//         group: $(real_arr[i][1]).text(),
//         chapter: $(real_arr[i][2])[0].attribs.title,
//         url: "https://" + $(real_arr[i][2])[0].attribs.href.slice(2),
//         is_scrapable: true,
//       };

//       op.push(data);
//     }
//   }
//   return op;
// }

// novel_list
//   .find({})
//   .sort({ rank: 1 })
//   .exec(async (err, doc) => {
//     await run(doc).then(() => {
//       console.log("\n********************** done *************************\n");
//     });
//   });

// async function run(data: any[]) {
//   let i = 1;
//   for await (let url of data) {
//     NAME = url.name;
//     await getData(url.url)
//       .then(() => {
//         console.log("novel number ", i++);
//       })
//       .catch((e) => {
//         console.error(e);
//       });
//   }
// }

// // getData("https://www.novelupdates.com/series/overgeared/")