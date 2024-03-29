// import * as Datastore from "nedb";
// import * as Datastore from "nedb-promises";
// import Datastore = require("nedb");
import * as Datastore from "nedb";

import { release } from "../dependicies/definations";

let got:any
const novels_meta = new Datastore("./database-test/novels-meta-filtered.db");
const novels_list = new Datastore("./database/novels-list.db");
const filter = new Datastore("./database-test1/novels-meta.db");

async function loadDb() {
  var date1 = new Date().getTime();
  filter.loadDatabase();
  var date2 = new Date().getTime();
  var diff = date2 - date1;
  console.log("filter loaded in ", diff / 1000, "seconds");

  date1 = new Date().getTime();
  await novels_list.loadDatabase();
  date2 = new Date().getTime();
  diff = date2 - date1;
  console.log("novels_list loaded in ", diff / 1000, "seconds");

  date1 = new Date().getTime();
  await novels_meta.loadDatabase();
  date2 = new Date().getTime();
  diff = date2 - date1;
  console.log("novels_meta loaded in ", diff / 1000, "seconds");
}

async function filterData(fill: any) {
  await loadDb();

  let n_meta: any = await novels_meta.find({}).sort(fill)
  let n_list: any = await novels_list.find({}).sort(fill)

  return {
    n_meta: n_meta,
    n_list: n_list,
  };
}

async function fillArray() {
  let data = await filterData({ name: 1 });

  let i = 0;
  let new_data_arr: any[] = [];
  for (let n_lis of data.n_meta) {
    let search = { name: n_lis.name };

    let n_list:any = novels_list
    let new_data = {
      name: n_list.name,
      rank: n_list.rank,
      chapter_links: n_lis.chapter_links
    };

    new_data_arr.push(new_data);
  }
  return new_data_arr;
}

async function writeToDatabase() {
  let data = await fillArray();

  await filter.insert(data);
  console.log("inserted");
}

filter.loadDatabase()
async () => {
  let data = await filter.find({}).sort({ rank: 1 })
  console.log(data);
}

