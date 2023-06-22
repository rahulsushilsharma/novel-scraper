import * as cheerio from "cheerio";
import { cleanChapter } from "../dependicies/cleaner.js";

function pharseMeta(data: any) {
  return;
}
export interface pharseData {
  links: {
    prevousChapter: string;
    nextChapter: string;
  };
  title: string;
  chapterNumber: string;
  chapterData: string[];
}
export function pharse(url: string, data: any) {
  const output: pharseData = {
    links: {
      prevousChapter: "",
      nextChapter: "",
    },
    title: "",
    chapterNumber: "",
    chapterData: [""],
  };
  const $ = cheerio.load(data);
  $(".m-read .txt p").each((index, ele) =>
    output.chapterData.push($(ele).text())
  );
  output.chapterData = cleanChapter(output.chapterData);
  output.links.nextChapter =
    url +
      $("#main1 > div > div > div.top > ul > li:nth-child(4) > a").attr(
        "href"
      ) || "";
  output.links.prevousChapter =
    url +
      $("#main1 > div > div > div.top > ul > li:nth-child(1) > a").attr(
        "href"
      ) || "";
  output.title = $("#main1 > div > div > div.txt > h4").text() || "";
  return output;
}
