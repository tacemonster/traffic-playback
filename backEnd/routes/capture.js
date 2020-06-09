const express = require("express");
const Joi = require("joi");
const mySqlConnect = require("./connection");
const router = express.Router();

//Track caputure job status
let jobStatus = {
  inprogress: [],
  completed: [],
};

//Pop an item in array
function pop(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

//Update capture job status
function updateStatus(job) {
  let d = Math.floor(new Date().getTime() / 1000);
  if ((job.jobStop && d > job.jobStop) || job.active === 0)
    jobStatus.completed.push(job.jobName);
  else jobStatus.inprogress.push(job.jobName);
}

/* Name: createJob
 * Description: Create a capture job
 * Input: jobName, active, jobStart, jobStop, secure, protocol, host, uri, method, sourceip
 * Output: status code 200 on success and 400 code on failure.
 */
router.post("/createJob", (req, res) => {
//    const { error } = validateCreateJob(req.body);
 //   if (error) return res.status(400).send(error.details[0].message);

  mySqlConnect.query(
    "INSERT INTO trafficDB.jobs (jobName, active, jobStart, jobStop, secure, protocol, host, uri, method, sourceip)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ",
    [
      req.body.jobName,
      req.body.active,
      req.body.jobStart,
      req.body.jobStop,
      req.body.secure,
      req.body.protocol,
      req.body.host,
      req.body.uri,
      req.body.method,
      req.body.sourceip,
    ],
    (error, results, fields) => {
      if (error) res.status(400).send();
      else res.status(200).send();
    }
  );
});

//Check capture jobs status
router.get("/status", (req, res) => {
  mySqlConnect.query(
    `SELECT * FROM trafficDB.jobs`,
    (error, results, fields) => {
      if (error) res.status(400).send();
      else if (results.length < 1)
        res.status(400).send(`No capture jobs found for ${req.params.jobName}`);
      jobStatus.inprogress = [];
      jobStatus.completed = [];
      results.map(updateStatus);
      return res.status(200).send(JSON.stringify(jobStatus));
    }
  );
});

/* Name: jobs
 * Description: list of capture jobs from database
 * Input: none
 * Output: status code 200 with json job object or status code 400 on failure
 */
router.get("/jobs", (req, res) => {
  mySqlConnect.query(
    `SELECT * FROM trafficDB.jobs`,
    (error, results, fields) => {
      if (error) res.status(400).send();
      else if (results.length < 1)
        res.status(400).send(`No capture jobs found for ${req.params.jobName}`);
      else res.status(200).send(JSON.stringify(results));
    }
  );
});

//Duplicate "/jobs" with POST for Berin
router.post("/jobs", (req, res) => {
  mySqlConnect.query(
    `SELECT * FROM trafficDB.jobs`,
    (error, results, fields) => {
      if (error) res.status(400).send();
      else if (results.length < 1)
        res.status(400).send(`No capture jobs found for ${req.params.jobName}`);
      else res.status(200).send(JSON.stringify(results));
    }
  );
});

/* Name: removeJob
   Description: Delete a capture job
   Input: Capture job name
   Output: 200 for success or 400 for failure
   */
router.post("/removeJob", (req, res) => {
  const { error } = validateJobName(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  mySqlConnect.query(
    "DELETE FROM  trafficDB.jobs WHERE jobName = ?",
    [req.body.jobName],
    (error, results, fields) => {
      if (error)
        res
          .status(400)
          .send(`Failed: ${req.body.jobName} has not been deleted!`);
      else res.status(200).send(`${req.body.jobName} has been deleted!`);
    }
  );
});


//Validate api/capture/createJob input
function validateCreateJob(jobName) {
  const schema = {
    jobName: Joi.string()
      .min(1)
      .max(50)
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/)
      .required(),

    jobStart: Joi.number().integer().min(0).max(99999999999999999),
    jobStop: Joi.number().integer().min(0).max(999999999999999999),
    secure: Joi.number().integer().min(0).max(1),
    protocol: Joi.string()
      .min(3)
      .max(10)
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/),
    host: Joi.string()
      .min(0)
      .max(50)
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/),
    uri: Joi.string()
      .min(0)
       .max(30),
    method: Joi.string()
      .min(3)
      .max(10)
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/),
    sourceip: Joi.number().integer().min(0).max(99999999999999999),
  };

  return Joi.validate(jobName, schema);
}

//Validate job name
function validateJobName(jobName) {
  const schema = {
    jobName: Joi.string()
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/)
      .required()
  };

  return Joi.validate(jobName, schema);
}

module.exports = router;
