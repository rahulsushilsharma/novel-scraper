import { readFile, writeFile} from "fs/promises";

let data_arr = [];
let data_arr_obj: any[] = [];


function giveMeArray(inp: { toString: () => string }) {
  return inp.toString().split("\n\n rahul sharma \n\n");
}

function clean(arr: any[]) {
  let s = new Set();
  let data: any[] = [];
  arr.forEach((element) => {
      if(s.has(element.title) == false){
        s.add(element.title)
        data.push(element)
      }
  });
  let op = '';
  data.forEach(element => {
      op += `${JSON.stringify(element)}\n\n rahul sharma \n\n`
  });
  return op
}

async function write(data: string | Uint8Array) {
    console.log("writing data");
    return await writeFile("data.txt", data);
}

readFile("data.txt")
  .then((data) => {
    data_arr = giveMeArray(data);
    data_arr.forEach((e) => {
      if (e != "") {
        var x = JSON.parse(e.trim());
        data_arr_obj.push(x);
      }
    });
    return data_arr_obj;
  })
  .then((data) => clean(data))
  .then((data) => write(data))
  .catch((e) => console.log(e));


