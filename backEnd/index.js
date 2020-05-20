const play = require("./routes/play");
const home = require("./routes/home");
const capture = require("./routes/capture");
const login = require("./routes/login");
const init = require("./routes/init");
const express = require("express");
const app = express();
const cors = require("cors");
const createjob = require("./routes/createjob");
const path = require("path");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/build")));
app.use(express.urlencoded({ extended: true }));
app.use("/", home);
app.use("/api/play", play);
app.use("/api/capture", capture);
app.use("/api/login", login);
app.use("/api/init", init);
app.use("/api/createjob", createjob);

const port = process.env.PORT || 7999;
app.listen(port, () => console.log(`Listening on port ${port}...`));
