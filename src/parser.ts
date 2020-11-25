import { readFile } from "fs/promises";
const firebase = require("firebase");

const firebase_ini = {
  apiKey: "AIzaSyDb5jb0y1tJ1V0cYD_uWtCTquGwo1z66m0",
  authDomain: "novel-d2056.firebaseapp.com",
  databaseURL: "https://novel-d2056.firebaseio.com",
  projectId: "novel-d2056",
  storageBucket: "novel-d2056.appspot.com",
  messagingSenderId: "256065318743",
  appId: "1:256065318743:web:789de33b04ed38d7359812",
  measurementId: "G-KVY70Q10W0",
};

var app = firebase.initializeApp(firebase_ini);
const db = app.firestore();
const rdb = app.database();

let data_arr = [];
let data_arr_obj: any[] = [];

readFile("data.txt")
  .then((data) => {
    data_arr = giveMeArray(data);
    data_arr.forEach((e) => {
      if (e != "") {
        var x = JSON.parse(e.trim());
        data_arr_obj.push(x);
      }
    });
    return;
  })
  .then(() => {
      data_arr_obj.forEach(async (e)=>{
          await updateDatabase(e);
      })
    })
  .catch((e) => console.log(e));

function giveMeArray(inp: { toString: () => string }) {
  return inp.toString().split("\n\n rahul sharma \n\n");
}



async function updateDatabase(data: {
  title: any;
  tags?: string[];
  img?: string;
  short_disc?: string;
  type?: string;
  author?: string;
}) {
  console.log(`uploading .......`);
//   return await db
//     .collection("novels")
//     .add(data)
//     .then(() => {
//       console.log(`Document successfully written!`);
//     })
//     .catch((error: any) => {
//       console.error("Error writing document: ", error);
//     });
  return await rdb
    .ref(data)
    .set(data)
    .then(() => {
      console.log(`Document successfully written!`);
    })
    .catch((error: any) => {
      console.error("Error writing document: ", error);
    });

}
