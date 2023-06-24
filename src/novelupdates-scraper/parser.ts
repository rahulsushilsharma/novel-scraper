import { load } from "cheerio";

function parseNovelLinks(html_data: string) {
  const $ = load(html_data);
  const output: { rank: string; title: string; url: string | undefined }[] = [];
  $(".search_main_box_nu").each((index, element) => {
    output.push({
      rank: $(element).find(".search_title > .genre_rank").text(),
      title: $(element).find(".search_title > a").text(),
      url: $(element).find(".search_title > a").attr("href"),
    });
  });
  return output;
}

export { parseNovelLinks };
