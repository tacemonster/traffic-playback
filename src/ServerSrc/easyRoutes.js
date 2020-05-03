var https = require("https");
var http = require("http");
var url = require("url");

//This JS obj literal stores all of our route information which consists of path to function mappings.
var routes = {};
//Handler logger should be assigned a callback that is invoked when a handler registration occurs. It should accept no arguments and
// its signature should be functionName().
var handlerLogger = null;
//This function is used to route requests to their corresponding callbacks. If a url->callback mapping does not exist, the DNE route should be called.
//and the event is logged.
https._router = function(req, res) {
  var parsed_path = url.parse(req.url).path;
  var handler = routes[parsed_path];

  if (
    handler !== undefined &&
    handler !== null &&
    typeof handler === "function"
  )
    handler(req, res);
  else {
    if (
      (handlerLogger !== null || handlerLogger !== undefined) &&
      typeof handlerLogger === "function"
    )
      handlerLogger();
  }
};

http._router = function(req, res) {
  var parsed_path = url.parse(req.url).path;
  var handler = routes[parsed_path];

  if (
    handler !== undefined &&
    handler !== null &&
    typeof handler === "function"
  )
    handler(req, res);
  else {
    if (
      (handlerLogger !== null || handlerLogger !== undefined) &&
      typeof handlerLogger === "function"
    )
      handlerLogger();

    res.writeHead(404);
    res.write("not found");
    res.end();
  }
};

//This function registers URLs to their corresponding handlers. Once a URL is registered to a function, it may not be assigned another function.
//The callback function should have the following arguments in the listed order: (req,res) which are of the type https.CLientRequest and https.ServerResponse.
// It is the duty to perform basic checks in the callback for methods, cookies, and etc.
https._handler = function(path, callback) {
  if (
    typeof path === "string" &&
    path !== undefined &&
    path !== null &&
    routes[path] === undefined
  ) {
    routes[path] = callback;
  }
};

http._handler = function(path, callback) {
  if (
    typeof path === "string" &&
    path !== undefined &&
    path !== null &&
    routes[path] === undefined
  ) {
    routes[path] = callback;
  }
};

https._handlerLogger = function(callback) {
  handlerLogger = callback;
};

http._handlerLogger = function(callback) {
  handlerLogger = callback;
};

//Exported https server with easy routing.
module.exports._https = https;
module.exports._http = http;
