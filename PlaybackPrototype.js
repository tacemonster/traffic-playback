//NOTE: this prototype will probably end up being exported as a module down the line. 
var http = require('http') //Offers various http capabilities. 
var mysql = require('mysql') //DB driver. 


//This function forgoes completing a task for ms_delay milliseconds. //For our purposes, it is used to space out requests. 
function delay_request (ms_delay,options,resolve,reject) {
    //The returned Promise will execute function resolve, which is dispatch_request defined right below, after ms_delay elapses.
    return new Promise(() => {setTimeout(()=> {resolve(options)},ms_delay)}
);
  }


//This function dispatches a request 
function dispatch_request(options){
   
    var req_options = {"url":"http://localhost:80" +options.uri,"method":options.method}
    var req = http.request(req_options, (res) => {
        res.setEncoding("utf-8")
	res.on('data', (data)=>{console.log(data)})
	res.on('end', ()=>{console.log("Finished streaming data for request response.")})
	}) //Create the request
        req.end()
}

//Connection settings like username, password, and etc. 
var connection_arguments = {
    host:"localhost",
    user:"traffic",
    password:"12345",
    database:"traffic_log"}
    
// Attempt to create a connection using the arguments above. 
var connection = mysql.createConnection(connection_arguments)

//Issue a static GET query for the prototype. 
connection.query('SELECT * FROM log WHERE method="GET"', function (error, results, fields) {
    if (error)
        throw error
    
    //All requests will have their times subtracted by the time of the first request.
    //This is so we can shift all times back to zero.
    console.log(results[0])
    var base_request_time = results[0].utime
    console.log("BASE REQUEST TIME")
    console.log(base_request_time)
    for (var result in results)
    {
        //Using let variables for block scoping and to avoid hoisting shennanigans.
        let row_reference = results[result] //This references a row which desribes a request
        let sleep_time = results[result].utime - base_request_time //This references the time from zero to send the request from.
        //This line dispatches a request after a timeout determined by sleep_time for a given row/request.
        console.log("delaying request " + result + "for " + sleep_time + "miliseconds.")
        delay_request(sleep_time,row_reference,dispatch_request,null)
    }
  })
//Close the connection. 
connection.end()
