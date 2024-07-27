const fs = require("fs");

const express = require("express");

const dataBase = "koders.json";
const URLUsers = "/koders";
const fileJson = "koders.json";
const statusHTTP = {
  status204: [204, "no content found"],
  ststus201: [201, "added name"],
  status200: [200, "you have deleted from the database"],
};
const app = express();

const port = 8080;
function init() {
  const exists = fs.existsSync(dataBase);
  if (!exists) {
    fs.writeFileSync(dataBase, JSON.stringify({ names: [] }), "utf8");
  }
}

function getFileKoders() {
  const data = fs.readFileSync(fileJson, "utf8");
  const parseData = JSON.parse(data);
  return parseData;
}

function saveName(name) {
  fs.writeFileSync(fileJson, JSON.stringify(name), "utf8");
}

init();

app.get(URLUsers, (req, res) => {
  const listKoders = getFileKoders();

  if (listKoders.names <= 0) {
    res.status(statusHTTP.status204[0]).end();
    return;
  }
  res.status(200).json(listKoders.names);
});
app.post(`${URLUsers}/:name`, (req, res) => {
  const listKoders = getFileKoders();
  const nameKoder = req.params.name;
  listKoders.names.push(nameKoder);
  console.log(nameKoder);
  console.log(listKoders);
  saveName(listKoders);
  res
    .status(statusHTTP.ststus201[0])
    .end(`${statusHTTP.ststus201[1]}: ${nameKoder}`);
});
app.delete(`${URLUsers}/:name`, (req, res) => {
  let listKoders = getFileKoders();
  const nameKoder = req.params.name;
  const newArray = listKoders.names.filter(
    (koder) => koder.toLowerCase() !== nameKoder.toLowerCase()
  );

  listKoders.names = newArray;
  saveName(listKoders);
  res
    .status(statusHTTP.status200[0])
    .end(`${statusHTTP.status200[1]}: ${nameKoder}`);
});
app.delete(URLUsers, (req, res) => {
  let listKoders = getFileKoders();
  listKoders.names = [];
  saveName(listKoders);
  res.status(statusHTTP.status204[0]).end();
});

app.listen(port, () => {
  console.log(`server in http://localhost/${port}`);
});
