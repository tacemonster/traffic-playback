let mysql = require("mysql");
let http = require("./easyRoutes")._http;

http._handler("/", function(req, res) {
  res.end("<html><body><p>Testing node response!</p></body></html>");
});

let server = http.createServer(http._router);

server.listen(8080);
