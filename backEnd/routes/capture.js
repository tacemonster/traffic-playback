const express = require("express");
const Joi = require("joi");
const mySqlConnect = require("./connection");
const router = express.Router();

let headers = [];

router.post("/", (req, res) => {
  const { error } = validatePostJobs(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  mySqlConnect.query("INSERT INTO trafficDB.jobs (jobName, jobStart, jobStop)  VALUES (?, ?, ?) ", [req.body.jobName, req.body.startTime, req.body.endTime], (error, results, fields) => {
    if (error) throw error;
    else res.send(`${req.body.jobName} is currently in progress`);
  });
});

router.get("/jobs", (req, res) => {
  mySqlConnect.query(`SELECT * FROM trafficDB.jobs`, (error, results, fields) => {
    if (error) throw error;
    else if(results.length < 1) res.send(`No capture jobs found for ${req.params.jobName}`);    
    else res.send(JSON.stringify(results));
  });
});

router.get("/:jobName", (req, res) => {
  const { error } = validateJobName(req.params);
  if (error) return res.status(400).send(error.details[0].message);
  mySqlConnect.query("SELECT * FROM trafficDB.jobs WHERE jobName = ?", [req.params.jobName], (error, results, fields) => {
    if (error) throw error;
    else if(results.length < 1) res.send(`No capture jobs found for ${req.params.jobName}`);    
    else res.send(JSON.stringify(results));
  });
});

router.get("/:jobName/:startTime/:endTime", (req, res) => {
  const { error } = validatePostJobs(req.params);
  if (error) return res.status(400).send(error.details[0].message);
  mySqlConnect.query("SELECT * FROM trafficDB.jobs WHERE jobName = ?", [req.params.jobName], (error, results, fields) => {
    if (error) throw error;
    else if(results.length < 1) res.send(`No capture jobs found for ${req.params.jobName}`);    
    else res.send(JSON.stringify(results));
  });
});

router.put("/:jobName/:column/:replaceInfo", (req, res) => {
  const { error } = validateUpdateJob(req.params);
  if (error) return res.status(400).send(error.details[0].message);
	console.log(req.params.column);
  mySqlConnect.query("UPDATE trafficDB.jobs SET ? = ? WHERE jobName = ?", [req.params.column.replace(/"/g,""), req.params.replaceInfo, req.params.jobName], (error, results, fields) => {
    if (error) throw error;
    else if(results.length < 1) res.send(`Updated ${req.params.column} = ${req.params.replaceInfo} for ${req.params.jobName}`);    
    else res.send(JSON.stringify(results));
  });
});

router.delete("/:jobName", (req, res) => {
  const { error } = validateJobName(req.params);
  if (error) return res.status(400).send(error.details[0].message);
  mySqlConnect.query("DELETE FROM  trafficDB.jobs WHERE jobName = ?", [req.params.jobName], (error, results, fields) => {
    if (error) throw error;
    else res.send(`${req.body.jobName} has been deleted!`);
  });

});

function validatePostJobs(jobInfo) {
  const schema = {
    jobName: Joi.string().min(4).regex(/(''|[^'])*/).regex(/^[a-zA-Z0-9.-]+$/).required(),
    startTime: Joi.number().integer().min(0000).max(2359),
    endTime: Joi.number().integer().min(0001).max(2400)
  };

  return Joi.validate(jobInfo, schema);
}

function validateJobName(jobName) {
  const schema = {
    jobName: Joi.string().regex(/(''|[^'])*/).regex(/^[a-zA-Z0-9.-]+$/).required()
  };

  return Joi.validate(jobName, schema);
}

function validateUpdateJob(jobInfo){
  const schema = {
    jobName: Joi.string().regex(/(''|[^'])*/).regex(/^[a-zA-Z0-9.-]+$/).required(),
    column: Joi.string().regex(/(''|[^'])*/).regex(/^[a-zA-Z0-9.-]+$/).required(),
    replaceInfo: Joi.string().regex(/(''|[^'])*/).regex(/^[a-zA-Z0-9.-]+$/).required(),
  };

  return Joi.validate(jobInfo, schema);
}

module.exports = router;
