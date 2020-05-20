const Joi = require("joi");
const mysql = require("mysql");
const play = require("./routes/play");
const home = require("./routes/home");
const mySqlConnect = require("./routes/connection");
const capture = require("./routes/capture");
const login = require("./routes/login");
const init = require("./routes/init");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.static('playBackScript'));
app.use(express.urlencoded({ extended: true }));
app.use("/", home);
app.use("/api/play", play);
app.use("/api/capture", capture);
app.use("/api/login", login);
app.use("/api/init", init);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
