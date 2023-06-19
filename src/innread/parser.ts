import * as cheerio from "cheerio";


function pharseMeta(data:any){
    return
}



export function pharse(data:any){
    const output = {
        links:{
            prevousChapter:'',
            nextChapter:'',
        },
        title:"",
        chapterNumber:"",
        chapterData:"",
    }
    const $ = cheerio.load(data)
    
    return $('*').text()
}