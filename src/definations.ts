export interface release {
  date?: string;
  group?: string;
  chapter?: string;
  name?: string;
  url?: string;
  is_scrapable?: boolean;
}
export interface meta {
  last_update?: string;
  names?: string[];
  route_name?: string;
  genre?: string[];
  img_url?: string;
  origin_language?: string;
  author?: string;
  artist?: string;
  rank?: number|null;
  description?: string;
  totel_chapters?: number|null;
  complete?: string;
}
export interface chapter {
  chapter: string ;
  title : string;
  orignal_chapter_number : string;
  computed_chapter_number : number;
  date : string;
  group : string;
  orignal_url : string;
}

