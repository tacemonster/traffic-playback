const express = require("express");
const mySqlConnect = require("./connection");
const Joi = require("joi");
const router = express.Router();
const Axios = require("axios");
const { spawn } = require("child_process");
const fs = require("fs");
const playbackScript = "../Playback.js";

//Playback status
let playbackStatus = {
  inprogress: [],
  completed: [],
  failed: [],
};

//Pop item from array
function pop(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

//Create options.json file for playback
function inputOptions(data) {
  fs.writeFile("../options.json", JSON.stringify(data), (err) => {
    // In case of a error throw err.
    if (err) return 0;
    else return 1;
  });
}

/* Name: /
 * Description: Display raw table, all capture traffics from database
 * Input: None
 * Output: Json object of all capture traffics
 */
router.get("/", (req, res) => {
  mySqlConnect.query("SELECT * from v_record", (error, results, fields) => {
    if (error) throw error;
    else res.send(JSON.stringify(results));
  });
});

/* Name: jobs-captured
 * Description: Display a list of capture traffic by jobID and jobName
 * Input: None
 * Output: Json list of capture traffics per jobID
 */
router.post("/jobs-captured", (req, res) => {
  let limit = "";
  let limitNum = 0;
  if (req.body.limit) {
    limit = `limit ?`;
    limitNum = parseInt(req.body.limit);
  }
  mySqlConnect.query(
    `SELECT DISTINCT jobs.jobID, jobs.jobName, records.utime, records.secure, protocols.protocolName, hosts.hostName, uris.uriName, methods.methodName, sourceips.sourceip, records.recordID FROM jobs INNER JOIN jobrel ON jobs.jobID = jobrel.jobID INNER JOIN records ON jobrel.recordID = records.recordID INNER JOIN protocols ON records.protocol = protocols.protocolID INNER JOIN hosts ON records.host = hosts.hostID INNER JOIN uris ON records.uri = uris.uriID INNER JOIN methods ON records.method = methods.methodID INNER JOIN sourceips ON records.sourceip = sourceips.sourceipID INNER JOIN headerrel ON records.recordID = headerrel.recordID INNER JOIN headers ON headerrel.headerID = headers.headerID ORDER BY records.utime DESC ${limit}`,
    [limitNum],
    (error, results, fields) => {
      if (error) throw error;
      else res.send(JSON.stringify(results));
    }
  );
});

/* Name: job
   Description: Get capture job traffics by job id
   Input: Job ID
   Output: Jason object
   */
router.post("/job", (req, res) => {
  
  const { error } = validateJobId(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let limit = "";
  let limitNum = 0;
  if (req.body.limit) {
    limit = `limit ?`;
    limitNum = parseInt(req.body.limit);
  }
  mySqlConnect.query(
    `SELECT DISTINCT jobs.jobID, jobs.jobName, records.utime, records.secure, protocols.protocolName, hosts.hostName, uris.uriName, methods.methodName, sourceips.sourceip, records.recordID FROM jobs INNER JOIN jobrel ON jobs.jobID = jobrel.jobID INNER JOIN records ON jobrel.recordID = records.recordID INNER JOIN protocols ON records.protocol = protocols.protocolID INNER JOIN hosts ON records.host = hosts.hostID INNER JOIN uris ON records.uri = uris.uriID INNER JOIN methods ON records.method = methods.methodID INNER JOIN sourceips ON records.sourceip = sourceips.sourceipID INNER JOIN headerrel ON records.recordID = headerrel.recordID INNER JOIN headers ON headerrel.headerID = headers.headerID WHERE jobs.jobID = ? ORDER BY records.utime DESC ${limit}`,
    [req.body.jobID, limitNum],
    (error, results, fields) => {
      if (error) throw error;
      else res.send(JSON.stringify(results));
    }
  );
});

/* Name: realtime
 * Description: Display capture traffics with specific limit number or with specific job ID.
 * Input: None
 * Output: Json object
 */
router.post("/realtime", (req, res) => {
  let limitSQL = "";
  let limit = 0;
  let idSQL = "";
  let id = 0;
  let args = [];
  if (req.body.jobID) {
    idSQL = "WHERE v_record.jobID = ?";
    id = parseInt(req.body.jobID);
    args.push(id);
  }
  if (req.body.limit) {
    limitSQL = "LIMIT ?";
    limit = parseInt(req.body.limit);
    args.push(limit);
  }
  mySqlConnect.query(
    `select v_record.*, jobs.jobName from v_record join jobs on jobs.jobID = v_record.jobID ${idSQL} order by v_record.id DESC ${limitSQL}`,
    args,
    (error, results, fields) => {
      if (error) throw error;
      else res.send(JSON.stringify(results));
    }
  );
});

/*Name: stats
 * Description: Statistics for UI
 * Input: None
 * Output: Json object
 */
router.post("/stats", (req, res) => {
  let id = 0;
  let args = [];
  if (req.body.jobID) {
    id = parseInt(req.body.jobID);
    args.push(id);
  } else {
    res.status(400).send('No jobID provided');
  }
  mySqlConnect.query(
    `select jobID, uri, utime from v_record where jobID = ?`,
    args,
    (error, results, fields) => {
      if (error) throw error;
      else res.send(JSON.stringify(results));
    }
  );
});

/* Name: run
   Description: Execute a playback job
   Input: jobId, verbose, playbackSpeed, port, securePort, requestBufferTime, hostname, backendServer, playbackName
   Output: Status code 200 for job accepted and status code 400 for job rejected due to errors
   */
router.post("/run", (req, res) => {
  const { error } = validateRunJob(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let status = inputOptions(req.body);
  if (status === 0) return res.status(400).send();
  const spawnChild = spawn("node", [
    playbackScript,
    "playback",
    "--config-file",
    "../options.json",
  ]);

  playbackStatus.inprogress.push(req.body.playbackName );

  spawnChild.stderr.on("data", (data) => {
    pop(playbackStatus.inprogress, req.body.playbackName);
    playbackStatus.failed.push(req.body.playbackName);
     console.error(`stderr: ${data}`);
    return;
  });

  spawnChild.on("exit", (code, signal) => {
    what = code;
    console.log(`child process exited ${signal}  with code ${code}`);
    if (code === 0 && signal === null) {
      pop(playbackStatus.inprogress, req.body.playbackName);
      playbackStatus.completed.push(req.body.playbackName);
      console.log(playbackStatus);
    }
  });
  res.status(200).send("success");
   console.log(playbackStatus);
});

//Get all playback jobs status
router.post("/status", (req, res) => {
  if (playbackStatus) return res.status(200).send(playbackStatus);
  else return res.status(400).send("empty");
});

//validate job id
function validateJobId(jobId) {
  const schema = {
    jobId: Joi.number().integer().min(0).max(999999999999),
  };

  return Joi.validate(jobId, schema);
}

//validate job limit
function validateJobLimit(jobLimit) {
  const schema = {
    limit: Joi.number().integer().min(0).max(99999),
  };

  return Joi.validate(jobLimit, schema);
}

//validate api/play/run input
function validateRunJob(jobName) {
  const schema = {
    jobId: Joi.number().integer().min(0).max(9999999),
    verbose: Joi.number().integer().min(0).max(999),
    playbackSpeed: Joi.number().integer().min(0).max(999999),
    port: Joi.number().integer().min(0).max(999999),
    securePort: Joi.number().integer().min(0).max(999999),
    requestBufferTime: Joi.number().integer().min(0).max(999999),
    hostname: Joi.string()
      .min(0)
      .max(100)
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/),
    backendServer: Joi.string()
      .min(0)
      .max(50)
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/),
    playbackName: Joi.string()
      .min(0)
      .max(50)
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/)
  };

  return Joi.validate(jobName, schema);
}

//Validate job name
function validateJobName(jobName) {
  const schema = {
    jobName: Joi.string()
      .regex(/(''|[^'])*/)
      .regex(/^[a-zA-Z0-9.-]+$/)
      .required(),
  };

  return Joi.validate(jobName, schema);
}

module.exports = router;
