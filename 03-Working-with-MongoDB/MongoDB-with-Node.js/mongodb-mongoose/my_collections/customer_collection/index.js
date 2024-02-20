import fs from "fs";

const jsonFilePath = "./sampleCustomerData.json";

// check if the file exist
let jsonData;

try {
  const jsonStringFile = fs.readFileSync(jsonFilePath);
  const jsonData = JSON.parse(jsonStringFile);
  console.log(jsonData);
} catch (e) {
  console.log(e);
}
