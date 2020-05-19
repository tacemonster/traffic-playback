// NOTE: this prototype will probably end up being exported as a module down the line.
const http = require('http'); // Offers various http capabilities.
const https = require('https');
const mysql = require('mysql'); // DB driver.
const sorted = require('sorted-array-functions');
const fs = require ('fs');
let requests_cache = {};
let hooks = []; // Keeps track of all the hooks

let base_request_time = 0;
let base_local_time = 0;

//Connection settings like username, password, and etc.
const connection_arguments = {
    host:"localhost",
    user:"traffic",
    password:"12345",
    database:"trafficDB"
}

// Exporting the events and the register_hook function so plugins can use it
let methods = {
    hook_events: hook_events = {
        PRE_REQUEST: 'pre-request',
        REQUEST_CALLBACK: 'request callback',
        POST_REQUEST: 'post-request'
    },
    register_hook: function register_hook(priority, event_type, func ) {
        sorted.add(hooks, { value: priority, event_type: event_type, func: func }, (a, b) => { return a.value - b.value; })
    }
}
module.exports = methods

// This will bring in all of the plugins in the files referred to in the index.js file in the plugins directory
// When this occurs, all the register_hook functions in the plugin files will be executed
let plugins = require('./plugins')

// Loops through all pre-request hooks and executes the functions associated with them
// Exposes a read-only version of the options (information from the database), allows plugin developers to edit
// certain options (secure and request body), and req_options
function pre_request_hook(options, editable_options, req_options) {
    console.log('pre')
    for(let hook of hooks) {
        if(hook.event_type === hook_events.PRE_REQUEST) {
            hook.func(options, editable_options, req_options)
        }
    }
}

// Exposes the response variable and (should) allow users to add callback functions to be executed after requests terminate
function request_callback_hook(res) {
    console.log('callback')
    for(let hook of hooks) {
        if(hook.event_type === hook_events.REQUEST_CALLBACK) {
            hook.func(res)
        }
    }
}

function post_request_hook(req, options) {
    console.log('post')
    for(let hook of hooks) {
        if(hook.event_type === hook_events.POST_REQUEST) {
            hook.func(req, options)
        }
    }
}

// Command Line Args
const args = require('yargs')
    .scriptName("Playback")
    .usage('$0 <cmd> [args]')
    .command('jobs', 'get the list of jobs available to be played back', (yargs) => {},
        function(argv) {
            let connection = mysql.createConnection(connection_arguments);
            connection.query('SELECT * FROM jobs;', function (error, results, fields) {
                console.log(results);
            });
            connection.end();
        })
    .command('playback', 'plays back captured traffic', (yargs) => {
        yargs.options('job-id', {
            alias: 'i',
            desc: 'specifies which job is to be played back',
            type: 'number'
        });
        yargs.options('verbose', {
            alias: 'v',
            desc: 'specifies verbosity level',
            type: 'count'
        });
        yargs.options('playback-speed', {
            alias: 'p',
            desc: 'specifies the speed at which requests are played back',
            type: 'number'
        });
        yargs.options('hostname', {
            alias: 'host',
            desc: 'specifies where to send requests to',
            type: 'string'
        });
        yargs.options('backend-server', {
            alias: 'b',
            desc: 'NOT YET IMPLEMENTED - specifies which server will run the playback job',
            type: 'string'
        });
        yargs.options('config-file', {
            alias: 'c',
            desc: 'specifies a file containing json options',
            default: null,
            type: 'string'
        });
        yargs.options('json', {
            alias: 'j',
            desc: 'user-specified json string with options',
            default: null,
            type: 'string'
        });
        return yargs;
    })
    .help()
    .argv

if(args._.includes('playback')) {
    // Build object out of arguments
    let cmd_options = {};
    let default_options = {
        verbose: 0,
        playbackSpeed: 1,
        hostname: 'localhost'
    };

    if(args.configFile !== null) {
        config_file_data = fs.readFileSync(args.configFile, 'utf-8', function(err, jsonData){
            if (err) throw err;
        });

        let data = {};
        try {
            data = Object.assign(JSON.parse(config_file_data));
        } catch(err) {
            console.log('Error encountered parsing JSON data from config file');
            return;
        }

        cmd_options = Object.assign(cmd_options, data);
    }

    if(args.json !== null) {
        let data = {};
        try {
            data = JSON.parse(args.json);
        } catch(err) {
            console.log('Error encountered parsing JSON string from JSON argument');
            return;
        }
        cmd_options = Object.assign(cmd_options, data);
    }

    cmd_options = Object.assign(cmd_options, args);

    // Fill in default values, if they're not already specified
    for (let [key, value] of Object.entries(default_options)) {
        if(cmd_options[key] === undefined) {
            cmd_options[key] = value;
        }
    }

    // Validation
    if(cmd_options.jobId === undefined) {
        throw error('Job ID must be specified');
    }
    if (!Number.isInteger(cmd_options.jobId)) {
        throw error('Job ID must be an integer');
    }
    if(!(typeof(cmd_options.playbackSpeed) === 'number' && Number.isFinite(cmd_options.playbackSpeed))) {
        throw error('Playback speed must be a number');
    }

    //This function forgoes completing a task for ms_delay milliseconds. //For our purposes, it is used to space out requests.
    function delay_request (ms_delay,options,resolve,reject) {
        //The returned Promise will execute function resolve, which is dispatch_request defined right below, after ms_delay elapses.
        return new Promise(() => {setTimeout(()=> {resolve(options)},ms_delay)});
    }


    //This function dispatches a request
    function dispatch_request(options){
        //request options url path and etc
        console.log(Date.now())

        let req_headers = new Object();
        let header_array = options.header.split("\r\n");
        let cnt = 0;
        for (i = 0; i < header_array.length; i += 2)
        {
            req_headers[header_array[i]] = header_array[i+1];
        }

        let req_options = {"host":cmd_options.hostname, "setHost":false, "path":options.uri, "method":options.method, "headers":req_headers, "port":8080};
        let editable_options = {
            'secure': options.secure,
            'reqbody': options.reqbody,
            'send_request': true
        };
        pre_request_hook(options, editable_options, req_options);

        if(editable_options.send_request === true) {
            //Select the correct request class
            let webreq = editable_options['secure'] ? https : http
            let req = webreq.request(req_options, (res) => {
                // Code for testing
                // res.setEncoding("utf-8")
                // res.on('data', (data)=>{/*console.log(data)*/})
                // res.on('end', ()=>{console.log("Finished streaming data for request response.")})

                request_callback_hook(res);
            }); //Create the request

            if(editable_options['reqbody'] != "")
                req.write(options.reqbody);
                post_request_hook(req, options);
                req.end();
        }
    }

    // Attempt to create a connection using the arguments above.
    let connection = mysql.createConnection(connection_arguments)

    //Issue a static GET query for the prototype.
    connection.query('SELECT * FROM raw;', function (error, results, fields) {
        if (error)
            throw error;

        //All requests will have their times subtracted by the time of the first request.
        //This is so we can shift all times back to zero.
        console.log(results[0]);
        //Times from the database must be multiplied by 1000 to represent in milliseconds as opposed to seconds.milli
        base_request_time = results[0].utime * 1000;
        console.log("Base Time:");
        console.log("Job: " + base_request_time);
        for (let result in results)
        {
            //Using let variables for block scoping and to avoid hoisting shennanigans.
            let row_reference = results[result]; //This references a row which desribes a request
            //Calculate the time to sleep by obtaining the current request's delta from its capture point
            //Then subtracting a correction for a delta in local execution time.
            let sleep_time = ((results[result].utime * 1000) - base_request_time) - (Date.now() - ((base_local_time == 0) ? base_local_time = Date.now() : base_local_time));

            //This line dispatches a request after a timeout determined by sleep_time for a given row/request.
            console.log("delaying request " + result + "for " + sleep_time + "miliseconds.");
            delay_request(sleep_time,row_reference,dispatch_request,null);
        }
    });
    //Close the connection.
    connection.end();
}
