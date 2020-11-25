import { writeFile } from "fs/promises";

writeFile("data.txt", "")
  .then(() => console.log("!!!file cleaned!!!"))
  .catch((e) => {
    console.log(e);
  });
