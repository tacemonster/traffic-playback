const express = require("express");
const mySqlConnect = require("./connection");
const Joi = require('joi');
const router = express.Router();
const Axios = require ('axios');

const hosts = [
  { jobName: 'firstJob', host: "abc.com" },
  { jobName: 'secondJob', host: "def.com" },
  { jobName: 'thirdJob', host: "ghi.com" },
];

router.get("/", (req, res) => {
  mySqlConnect.query("SELECT * from raw", (error, results, fields) => {
    if (error) throw error;
    else res.send(JSON.stringify(results));
  });
});

router.get("/realtime", (req, res) => {
  let limit = 50;
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }
  mySqlConnect.query(
    `SELECT * from raw order by id DESC Limit ${limit}`,
    (error, results, fields) => {
      if (error) throw error;
      else res.send(JSON.stringify(results));
    }
  );
});

router.put("/:id", (req, res) => {
  const host = hosts.find((c) => c.id === parseInt(req.params.id));
  if (!host)
    return res.status(404).send("The domain  with the given ID was not found.");

  const { error } = validatePostJobs(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  host.host = req.body.name;
  res.send(host);
});

router.post("/run", (req, res) => {
  const { error } = validatePostJobs(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //mySqlConnect.query("INSERT INTO trafficDB.jobs (jobName, jobStart, jobStop)  VALUES (?, ?, ?) ", [req.body.jobName, req.body.startTime, req.body.endTime], (error, results, fields) => {
  //  if (error) throw error;
   // else res.send(`${req.body.jobName} is currently in progress`);
  //});
//res= await axios.get('/api/get/beerWithComments?name=' + parameter);

Axios.get('/home/ubuntu/traffic-playback/PlaybackPrototype.js', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
    res.send(response.status);
  })
  .catch(function (error) {
    console.log(error);
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


module.exports = router;
