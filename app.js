const fs = require("fs");

const express = require("express");

const port = 8080;
const dataBase = "koders.json";
const URLUsers = "/koders";

const statusHTTP = {
  status204: [204, "no content found"],
  ststus201: [201, "added name"],
  status200: [200, "you have deleted from the database"],
  status400: [400, "enter valid data"],
  status404: [404, "not found"],
};

function init() {
  const exists = fs.existsSync(dataBase);
  if (!exists) {
    fs.writeFileSync(dataBase, JSON.stringify({ names: [] }), "utf8");
  }
}

function getFileKoders() {
  const data = fs.readFileSync(dataBase, "utf8");
  const parseData = JSON.parse(data);
  return parseData;
}

function saveName(name) {
  fs.writeFileSync(dataBase, JSON.stringify(name), "utf8");
}

const app = express();
init();

app.get(URLUsers, (req, res) => {
  const listKoders = getFileKoders();

  if (!listKoders.names.length) {
    res.status(statusHTTP.status204[0]).end();
    return;
  }
  res.status(200).json(listKoders.names);
});
app.post(`${URLUsers}/:name`, (req, res) => {
  const listKoders = getFileKoders();
  const nameKoder = req.params.name;
  listKoders.names.push(nameKoder);

  if (!nameKoder.trim() || !isNaN(nameKoder)) {
    res.status(statusHTTP.status400[0]).end(statusHTTP.status400[1]);
    return;
  }
  saveName(listKoders);
  res
    .status(statusHTTP.ststus201[0])
    .end(`${statusHTTP.ststus201[1]}: ${nameKoder}`);
});
app.delete(`${URLUsers}/:name`, (req, res) => {
  let listKoders = getFileKoders();
  const nameKoder = req.params.name;

  if (!listKoders.names.includes(nameKoder)) {
    res
      .status(statusHTTP.status404[0])
      .send(`${nameKoder}: ${statusHTTP.status404[1]} in the database `);
    return;
  }
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
  if (!listKoders.names.length) {
    res.status(statusHTTP.status404[0]).send("the database is empty");
    return;
  }
  listKoders.names = [];
  res.status(statusHTTP.status204[0]).end();
  saveName(listKoders);
});

app.listen(port, () => {
  console.log(`server in http://localhost/${port}`);
});
