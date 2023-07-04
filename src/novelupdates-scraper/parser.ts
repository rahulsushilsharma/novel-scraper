import { load } from "cheerio";
import { meta } from "../dependicies/definations";


/**
 * Get the novel links from the ranking page 
 * @param html_data 
 * @returns 
 */
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

function parseNovelPage(html_data: string, ranking: string, title: string) {
  const $ = load(html_data);
  const genre: meta['genre'] = []
  $('#seriesgenre a').each((index, ele) => {
    genre.push({
      name: $(ele).text(),
      disc: $(ele).attr('title') || '',
    })
  })
  const tags: meta['tags'] = []
  $('#showtags a').each((index, ele) => {
    genre.push({
      name: $(ele).text(),
      disc: $(ele).attr('title') || '',
    })
  })
  const output: meta = {
    type: $('#showtype > a').text(),
    origin_language: $('#showtype > span').text(),
    genre: genre,
    tags: tags,
    rating: $('.seriesother > .uvotes').text(),
    author: $('#showauthors').text(),
    artist: $('#showartists').text(),
    year: $('#edityear').text(),
    totel_chapters: $('#editstatus').text(),
    complete: $('#showtranslated').text(),
    description: $('#editdescription').text(),
    title: title,
    rank: ranking,
  }
  return output;
}

export { parseNovelLinks, parseNovelPage };
