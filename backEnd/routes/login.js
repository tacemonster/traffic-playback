const express = require("express");
const Joi = require("joi");
const mySqlConnect = require("./connection");
const router = express.Router();

const database = {
	Username: '',
	Password: ''
};

router.post("/", (req, res) => {
  const { error } = validateLogIn();
  if (error) return res.status(400).send(error.details[0].message);
  
  database.Username = req.body.account.username;
  database.Password = req.body.account.password; 
	console.log(database.Username);
  res.send("success");

});

function validateLogIn(loginInfo) {
  const schema = {
    username: Joi.string().min(4).regex(/(''|[^'])*/).regex(/^[a-zA-Z0-9.-]+$/).required(),
    password: Joi.string().min(4).regex(/(''|[^'])*/).regex(/^[a-zA-Z0-9.-]+$/).required(),
  };

  return Joi.validate(loginInfo, schema);
}

module.exports = router;
