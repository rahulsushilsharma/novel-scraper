const firebase = require("firebase");
import * as Datastore from "nedb";

//firebase deploy --only hosting:beta-lightnovel for beta site

const database = new Datastore("./database/lightnovelworld/novel-meta.db");
database.loadDatabase();

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

const firebaseConfig = {
  apiKey: "AIzaSyDBaa5FToKVA6Sick5kBK54bDMWVDrRXNc",
  authDomain: "novel-beta.firebaseapp.com",
  databaseURL: "https://novel-beta.firebaseio.com",
  projectId: "novel-beta",
  storageBucket: "novel-beta.appspot.com",
  messagingSenderId: "430751424298",
  appId: "1:430751424298:web:91e21b51ad31cfeec60853",
  measurementId: "G-7W7LFLCLQN",
};

var app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();

async function updateDatabase(data: any, d: any) {
  console.log(`uploading .......`);
  return await db
    .collection("novels")
    .doc(d)
    .set(data)
    .then(() => {
      console.log(`Document successfully written!`);
    })
    .catch((error: any) => {
      console.error("Error writing document: ", error);
    });
}

function re() {
  database.find({}).exec((err: any, array: any) => {
    var i,
      j,
      temparray,
      chunk = 25,
      d = "page-",
      k = 1;
    for (i = 0, j = array.length; i < j; i += chunk) {
      temparray = array.slice(i, i + chunk);
      let di = d + k;
      console.log(di);

      updateDatabase({ data: temparray }, di);
      // do whatever
      k++;
    }
  });
}

re();
