const express = require("express");
const Joi = require("joi");
const mySqlConnect = require("./connection");
const router = express.Router();

function addSQLQuotes(string) {
  return "'" + string + "'";
}
function toSQLString(json) {
  //We'll need to do JSON validation for allowed values in this function.

  let retVal =
    "(" +
    addSQLQuotes(json.jobName) +
    "," +
    json.active +
    "," +
    json.jobStart +
    "," +
    json.jobStop +
    "," +
    addSQLQuotes(json.secure) +
    "," +
    addSQLQuotes(json.protocol) +
    "," +
    addSQLQuotes(json.host) +
    "," +
    addSQLQuotes(json.uri) +
    "," +
    addSQLQuotes(json.method) +
    "," +
    addSQLQuotes(json.sourceip) +
    ")";
  return retVal;
}

function createjob(req, res) {
  let json = req.body;
  let query =
    "INSERT INTO jobs (jobName,active,jobStart,jobStop,secure,protocol,host,uri,method,sourceip) VALUES" +
    toSQLString(json);

  let debug = "";
  mySqlConnect.query(query, (err, results, fields) => {
    if (err) {
      res.status(400).end();
    } else {
      res.status(200).end();
    }
  });
}

router.all("/", (req, res) => createjob(req, res));

module.exports = router;
