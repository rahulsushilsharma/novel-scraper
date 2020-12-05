import * as Datastore from "nedb";

const database = new Datastore("./database/novels-list.db");

database.loadDatabase();

let i = 1;
// while (1) {
//   let rank = `${i}`;
//   database.find({ rank: rank }).exec((e, doc) => {
//     console.log(doc.length);
//   });
//   console.log(i);

//   i++;
// }

database.find({}).sort({ rank: 1 }).exec((e, doc) => {
    console.log(doc);
  });