const express = require("express");
const mySqlConnect = require("./connection");
const Joi = require("joi");
const router = express.Router();

let getAllJobs = function(res) {
  let jobs = [];
  let responseJson = {};
  mySqlConnect.query("SELECT JobID FROM jobs ORDER BY JobID DESC", function(
    error,
    results,
    fields
  ) {
    if (!error) {
      for (let result in results) {
        jobs.push(results[result]["JobID"]);
      }

      responseJson.jobs = jobs;
      res.status(200).send(JSON.stringify(responseJson));
      res.end();
    } else res.status(400).end();
  });
};

router.get("/", (req, res) => {
  getAllJobs(res);
});

module.exports = router;
