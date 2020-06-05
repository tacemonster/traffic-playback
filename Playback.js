// NOTE: this prototype will probably end up being exported as a module down the line.
const http = require('http'); // Offers various http capabilities.
const https = require('https');
const mysql = require('mysql'); // DB driver.
const sorted = require('sorted-array-functions');
const fs = require ('fs');
const mysql_sync = require('sync-mysql');
const cli_progress = require('cli-progress');
const console_table = require('console.table');
let requests_cache = {};
let hooks = []; // Keeps track of all the hooks

let base_request_time = 0;
let base_local_time = 0;
let newest_request_time = 0;

//Connection settings like username, password, and etc.
const connection_arguments = {
    host:"localhost",
    user:"traffic",
    password:"12345",
    database:"trafficDB"
}

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
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
    for(let hook of hooks) {
        if(hook.event_type === hook_events.PRE_REQUEST) {
            hook.func(options, editable_options, req_options)
        }
    }
}

// Exposes the response variable and (should) allow users to add callback functions to be executed after requests terminate
function request_callback_hook(res) {
    for(let hook of hooks) {
        if(hook.event_type === hook_events.REQUEST_CALLBACK) {
            hook.func(res)
        }
    }
}

function post_request_hook(req, options) {
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
    .command('capture-job-list', 'get the list of jobs available to be played back', (yargs) => {
        yargs.options('verbose', {
            alias: 'v',
            desc: 'specifies verbosity level',
            type: 'count'
        });
        return yargs;
    })
    // .command('capture-job-start', 'start a capture job', (yargs) => {
    //     yargs.options('verbose', {
    //         alias: 'v',
    //         desc: 'specifies verbosity level',
    //         type: 'count'
    //     });
    //     yargs.options('job-name', {
    //         alias: 'n',
    //         desc: 'specifies the name of the job',
    //         type: 'string'
    //     });
    //     yargs.options('job-start', {
    //         desc: 'when the job will start',
    //         type: 'number'
    //     });
    //     yargs.options('active', {
    //         alias: 'a',
    //         desc: 'This determines whether the capture job is currently running',
    //         type: 'boolean'
    //     });
    //     yargs.options('job-stop', {
    //         desc: 'when the job will stop',
    //         type: 'number'
    //     });
    //     yargs.options('secure', {
    //         alias: 's',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     yargs.options('protocol', {
    //         alias: 'p',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     yargs.options('hostname', {
    //         alias: 'host',
    //         desc: 'specifies which domain to capture requests from',
    //         type: 'string'
    //     });
    //     yargs.options('uri', {
    //         alias: 'p',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     yargs.options('method', {
    //         alias: 'p',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     yargs.options('source-ip', {
    //         alias: 'p',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     return yargs;
    // })
    // .command('capture-job-edit', 'stops a capture job by job', (yargs) => {
    //     yargs.options('verbose', {
    //         alias: 'v',
    //         desc: 'specifies verbosity level',
    //         type: 'count'
    //     });
    //     yargs.options('job-id', {
    //         alias: 'i',
    //         desc: 'specifies capture job-id to edit',
    //         type: 'number'
    //     });
    //     yargs.options('job-name', {
    //         alias: 'n',
    //         desc: 'specifies the name of the job',
    //         type: 'string'
    //     });
    //     yargs.options('job-start', {
    //         desc: 'when the job will start',
    //         type: 'number'
    //     });
    //     yargs.options('job-stop', {
    //         desc: 'when the job will stop',
    //         type: 'number'
    //     });
    //     yargs.options('active', {
    //         alias: 'a',
    //         desc: 'This determines whether the capture job is currently running',
    //         boolean: true
    //     });
    //     yargs.options('secure', {
    //         alias: 's',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     yargs.options('protocol', {
    //         alias: 'p',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     yargs.options('hostname', {
    //         alias: 'host',
    //         desc: 'specifies which domain to capture requests from',
    //         type: 'string'
    //     });
    //     yargs.options('uri', {
    //         alias: 'u',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     yargs.options('method', {
    //         alias: 'm',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     yargs.options('source-ip', {
    //         alias: 'si',
    //         desc: 'TODO',
    //         type: 'string'
    //     });
    //     return yargs;
    // })
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
            alias: 'ps',
            desc: 'specifies the speed at which requests are played back',
            type: 'number'
        });
        yargs.options('port', {
            alias: 'p',
            desc: 'specifies which port to use for http connections',
            type: 'number'
        });
        yargs.options('secure-port', {
            alias: 's',
            desc: 'specifies which port to use for SSL',
            type: 'number'
        });
        yargs.options('request-buffer-time', {
            alias: 'r',
            desc: 'specifies the size in milliseconds of the rolling request schedule window',
            type: 'number'
        });
        yargs.options('hostname', {
            alias: 'host',
            desc: 'specifies where to send requests to',
            type: 'string'
        });
        yargs.options('backend-server', {
            alias: 'b',
            desc: 'specifies which server will run the playback job',
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

Object.prototype.isEmpty = function() {
    for(let key in this) {
        if(this.hasOwnProperty(key))
            return false;
    }
    return true;
}

let fill_in_default_values = function(default_options, cmd_options) {
    // Fill in default values, if they're not already specified
    for (let [key, value] of Object.entries(default_options)) {
        if(cmd_options[key] === undefined) {
            cmd_options[key] = value;
        }
    }
}

let mysql_escape_string = function(str) {
    if (typeof str != 'string')
        return str;

    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

let scrub_sql_input = function(options) {
    for(let [key, value] of Object.entries(options)) {
        options[key] = mysql_escape_string(value);
    }
}

let build_set_clause = function(options) {
    let sync_connection = new mysql_sync(connection_arguments);
    let result;
    try {
        result = sync_connection.query('SELECT * FROM jobs WHERE jobId = ' + options.jobId);
    } catch(err) {
        throw 'Unable to get the information about the job with jobId ' + options.jobId;
    }

    // Get the information from the capture job in the database
    let capture_job_row = undefined;
    if(result.length === 1) {
        capture_job_row = result[0];
        capture_job_row.jobId = capture_job_row.jobID;
    } else {
        throw 'No row exists in the database with jobId ' + options.jobId;
    }

    // Fill in
    let modified_options = {};
    for (let [key, value] of Object.entries(capture_job_row)) {
        if(options[key] !== undefined && options[key] !== capture_job_row[key]) {
            modified_options[key] = options[key];
        }
    }

    let return_string = '';
    if(modified_options.isEmpty()) {
        throw 'The options specified are identical to the options in the database';
    } else {
        for(let [key, value] of Object.entries(modified_options)) {
            return_string = return_string + key + ' = ' + value + ', ';
        }
        return_string = return_string.substring(0, return_string.length - 2);
    }

    return return_string;
}

if(args._.includes('capture-job-list')) {
    let cmd_options = args;
    let default_options = {
        verbose: 0,
    };
    fill_in_default_values(default_options, cmd_options);

    let connection = mysql.createConnection(connection_arguments);
    connection.query('SELECT * FROM jobs;', function (error, results, fields) {
        if(cmd_options.verbose === 0) {
            // let abbrev_table = []
            for(let entry of results) {
                // abbrev_table.push({ jobId: entry.jobID, jobName: entry.jobName });
                console.log('jobID: ' + entry.jobID + ' jobName: ' + entry.jobName);
            }
            // console.log(abbrev_table)
        } else if(cmd_options.verbose > 0) {
            console.log(results);
        }
    });
    connection.end();
}

// Code for starting a capture job
if(args._.includes('capture-job-start')) {
    let cmd_options = args;
    let default_options = {
        verbose: 0,
        active: true,
        jobStart: Date.now(),
        jobStop: Date.now() + 6000,
        secure: null,
        protocol: null,
        host: null,
        uri: null,
        method: null,
        sourceip: null
    };

    fill_in_default_values(default_options, cmd_options);

    // Validation
    if(cmd_options.jobName === undefined) {
        throw error('Job Name must be specified');
    } if(cmd_options.active === undefined) {
        throw error('Active must be specified');
    } if(typeof cmd_options.active !== 'boolean') {
        throw error('Active must be a boolean');
    }
    scrub_sql_input(cmd_options);

    console.log('INSERT INTO jobs (jobName, active, jobStart, jobStop, secure, protocol, host, uri, method, sourceip) VALUES ('
    + cmd_options.jobName + ', ' + (cmd_options.active ? 1 : 0) + ', ' + cmd_options.jobStart + ', '
    + cmd_options.jobStop + ', ' + cmd_options.secure + ', ' + cmd_options.protocol + ', '
    + cmd_options.host + ', ' + cmd_options.uri + ', ' + cmd_options.method + ', '
    + cmd_options.sourceip + ');')

    // SQL to create the job
    let connection = mysql.createConnection(connection_arguments);
    connection.query('INSERT INTO jobs (jobName, active, jobStart, jobStop, secure, protocol, host, uri, method, sourceip) VALUES ('
        + cmd_options.jobName + ', ' + cmd_options.active ? 1 : 0 + ', ' + cmd_options.jobStart + ', '
        + cmd_options.jobStop + ', ' + cmd_options.secure + ', ' + cmd_options.protocol + ', '
        + cmd_options.host + ', ' + cmd_options.uri + ', ' + cmd_options.method + ', '
        + cmd_options.sourceip + ');', function (error, results, fields) {
            console.log('Insert operation complete');
    });
    connection.end();
}

// Code for editing a capture job
if(args._.includes('capture-job-edit')) {
    let cmd_options = args;
    let default_options = {
        verbose: 0
    };

    fill_in_default_values(default_options, cmd_options);

    // Validation
    if(cmd_options.jobId === undefined) {
        throw error('Job ID must be specified');
    } if(cmd_options.active !== undefined && typeof cmd_options.active !== 'boolean') {
        throw error('Active must be a boolean');
    }
    scrub_sql_input(cmd_options);

    let set_clause = build_set_clause(cmd_options);

    // SQL to create the job
    let connection = mysql.createConnection(connection_arguments);
    connection.query('UPDATE jobs SET ' + set_clause + ' WHERE jobID = ' + cmd_options.jobId + ';', function (error, results, fields) {
        console.log('Update operation complete');
    });
    connection.end();
}

// Code for playback option
if(args._.includes('playback')) {
    // Build object out of arguments
    let cmd_options = {};
    let default_options = {
        verbose: 0,
        playbackSpeed: 1,
        hostname: 'localhost',
        port: 8080,
        securePort: 8443,
        requestBufferTime: 10000
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

    fill_in_default_values(default_options, cmd_options);

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
    if (!Number.isInteger(cmd_options.port)) {
        throw error('Port must be an integer');
    }
    if (!Number.isInteger(cmd_options.securePort)) {
        throw error('Secure port must be an integer');
    }
    if (!Number.isInteger(cmd_options.requestBufferTime)) {
        throw error('Request buffer time must be an integer');
    }

    //This function forgoes completing a task for ms_delay milliseconds. //For our purposes, it is used to space out requests.
    function delay_request (ms_delay,options,resolve,reject) {
        //The returned Promise will execute function resolve, which is dispatch_request defined right below, after ms_delay elapses.
        return new Promise(() => {setTimeout(()=> {resolve(options)},ms_delay)});
    }

    function delay_sql (ms_delay, param, func) {
    	return new Promise(() => {setTimeout(()=> {func(param)}, ms_delay)});
    }

    //This function dispatches a request
    function dispatch_request(options){
        //request options url path and etc
        // console.log("Sending request. Time: " + Date.now())

        let req_headers = new Object();
        let header_array = options.header.split("\r\n");
        for (i = 0; i < header_array.length - 1; i += 2)
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
            let webreq = editable_options['secure'] ? https : http;
            req_options.port = editable_options['secure'] ? cmd_options.secure_port : cmd_options.port;
            req_options.headers.Host = cmd_options.hostname;
            let req;
            try {
                req = webreq.request(req_options, (res) => {
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
            } catch(err) {
                // console.log(err);
            }
        }
    }

    // Attempt to create a connection using the arguments above.
    let connection = mysql.createConnection(connection_arguments);

    // Get the number of requests and the job duration time for use in a progress bar
    let sync_connection = new mysql_sync(connection_arguments);
    let count;
    let max_time;
    let min_time;
    try {
        count = sync_connection.query('SELECT COUNT(*) FROM raw');
        max_time = sync_connection.query('SELECT MAX(utime) FROM raw');
        min_time = sync_connection.query('SELECT MIN(utime) FROM raw');
    } catch(err) {
        console.log(err)
    }
    count = count[0]["COUNT(*)"]
    min_time = min_time[0]["MIN(utime)"];
    let total_time = (max_time[0]["MAX(utime)"] - min_time) / cmd_options.playbackSpeed;

    const progress_bar = new cli_progress.SingleBar({
        format: 'CLI Progress |' + '{bar}' + '| {percentage}% | {value}/{total} Requests Scheduled' + '| Duration {duration}/' + Math.round(total_time),
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    progress_bar.start(count, 0, {});

	let query = connection.query('SELECT * FROM raw;');

	let scheduler = function(new_req_time) {
        if(new_req_time < (Date.now() + cmd_options.requestBufferTime)) {
            // console.log("resuming scheduling");
            connection.resume();
        }
        else {
            delay_sql(cmd_options.requestBufferTime/100, new_req_time, scheduler);
        }
    }

	query.on('error', function(err) {
	})
	.on('fields', function(fields) {
	})
	.on('result', function(row) {
		//Must be our first row.
		if(base_request_time == 0)
		{
	 		base_request_time = row.utime * 1000;
    	}

        let sleep_time = (row.utime * 1000) - base_request_time;
		sleep_time = sleep_time / cmd_options.playbackSpeed;
		sleep_time = sleep_time - (Date.now() - ((base_local_time == 0) ? base_local_time = Date.now() : base_local_time));

        //This line dispatches a request after a timeout determined by sleep_time for a given row/request.
        // console.log(Date.now() + " delaying request " + row + "for " + sleep_time + " milliseconds.");

        newest_request_time = Date.now() + sleep_time;
        delay_request(sleep_time, row, dispatch_request, null);

        progress_bar.increment();

        if(newest_request_time > (Date.now() + cmd_options.requestBufferTime)) {
        	// console.log("pausing scheduling");
        	connection.pause();

        	delay_sql(cmd_options.requestBufferTime/100, newest_request_time, scheduler);
        }
	})
	.on('end', function() {
	});

    //Close the connection.
    connection.end();
}
