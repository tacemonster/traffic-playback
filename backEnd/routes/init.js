const express = require("express");
const {spawn} = require('child_process');
const mySqlConnect = require("./connection");
const Joi = require('joi');
const router = express.Router();

let progress = {
  CompletedCaptureJobsUrls: {
    "www.nowayhome.com": ["Job#1", "Job#2"],
    "www.getaway.com": ["Job#3", "Job#4"],
    "www.almostover.com": ["Job#5", "Job#6"],
  },
  InProgressCaptureJobsUrls: {
    "www.almostover.com": ["Job#7", "Job#10"],
    "www.whatif.com": ["Job#8", "Job#9"],
    "www.anotherday.com": ["Job#11", "Job#12"],
  },
  CompletedPlayBackJobsUrls: {
    "www.nowayhome.com": ["Job#1", "Job#2"],
    "www.getaway.com": ["Job#3", "Job#4"],
  },
  InProgressPlayBackJobsUrls: {
    "www.almostover.com": ["Job#5", "Job#6"],
  },
};


router.get("/", (req, res) => {
    res.send(JSON.stringify(progress));
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
