const express = require("express");
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

module.exports = router;
