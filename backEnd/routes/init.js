const express = require("express");
const {spawn} = require('child_process');
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

router.get("/test", (req, res) => {
 
	// spawn new child process to call the python script
 const child = spawn('node', ['Playback.js']);
 // collect data from script
child.stdout.on('data', (data) => {
  console.log(`child stdout:\n${data}`);
});

child.stderr.on('data', (data) => {
  return res.send((`child stderr:\n${data}`));
});
 // in close event we are sure that stream from child process is closed
 child.on('close', (code, signal) => {
 console.log(`child process close all stdio ${signal} with code ${code}`);
 // send data to browser
//res.send(JSON.stringify("success")); 
 });
});

module.exports = router;
