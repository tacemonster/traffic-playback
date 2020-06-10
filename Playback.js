// NOTE: this prototype will probably end up being exported as a module down the line.
const http = require('http'); // Offers various http capabilities.
const https = require('https');
const mysql = require('mysql'); // DB driver.
const sorted = require('sorted-array-functions');
const fs = require ('fs');
const mysql_sync = require('sync-mysql');
const cli_progress = require('cli-progress');
const columnify = require('columnify');
require('dotenv').config()
let hooks = []; // Keeps track of all the hooks


//Connection settings like username, password, and etc.
const connection_arguments = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
}

/**********************************************************************************************************************/
/************************************************** UTILITY FUNCTIONS *************************************************/
/**********************************************************************************************************************/

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
    .command('capture-job-list', 'Get the list of jobs available to be played back.', (yargs) => {
        yargs.options('verbose', {
            alias: 'v',
            desc: 'Specifies verbosity level',
            type: 'count'
        });
        return yargs;
    })
    .command('capture-job-start', 'Start a capture job.', (yargs) => {
        yargs.options('job-name', {
            alias: 'n',
            desc: '(Required) Specifies what the new job will be named.',
            type: 'string'
        });
        yargs.options('active', {
            alias: 'a',
            desc: 'Specifies if a job is active (i.e. if it will start capturing traffic upon creation). [Default: true]',
            type: 'boolean'
        });
        yargs.options('job-start', {
            desc: 'When the job will start in UNIX epoch time.',
            type: 'number'
        });
        yargs.options('job-stop', {
            desc: 'When the job will stop in UNIX epoch time.',
            type: 'number'
        });
        yargs.options('secure', {
            alias: 's',
            desc: 'PCRE(PHP) formatted regex string. EX: #[0]# to only capture http, #[1]# to only capture https and #[01]# to capture both.',
            type: 'string'
        });
        yargs.options('protocol', {
            alias: 'p',
            desc: 'PCRE(PHP) formatted regex string. EX: #HTTP\/.*\..*#',
            type: 'string'
        });
        yargs.options('hostname', {
            alias: 'host',
            desc: 'PCRE(PHP) formatted regex string. EX: #.*\.host\.com#',
            type: 'string'
        });
        yargs.options('uri', {
            alias: 'p',
            desc: 'PCRE(PHP) formatted regex string. EX: #\/uri\/.*#',
            type: 'string'
        });
        yargs.options('method', {
            alias: 'p',
            desc: 'PCRE(PHP) formatted regex string. EX: #((GET)|(POST))#',
            type: 'string'
        });
        yargs.options('source-ip', {
            alias: 'p',
            desc: 'PCRE(PHP) formatted regex string. EX: #.*\..*\..*\..*#',
            type: 'string'
        });
        return yargs;
    })
    .command('capture-job-edit', 'Edit an existing capture job.', (yargs) => {
        yargs.options('job-id', {
            alias: 'i',
            desc: '(Required) Specify the job ID of the job you wish to edit.',
            type: 'number'
        });
        yargs.options('job-name', {
            alias: 'n',
            desc: 'Specifies what the job will be named.',
            type: 'string'
        });
        yargs.options('job-start', {
            desc: 'When the job will start in UNIX epoch time.',
            type: 'number'
        });
        yargs.options('job-stop', {
            desc: 'When the job will stop in UNIX epoch time.',
            type: 'number'
        });
        yargs.options('active', {
            alias: 'a',
            desc: 'This determines whether the capture job is currently running',
            boolean: true
        });
        yargs.options('secure', {
            alias: 's',
            desc: 'PCRE(PHP) formatted regex string. EX: #[0]# to only capture http, #[1]# to only capture https and #[01]# to capture both.',
            type: 'string'
        });
        yargs.options('protocol', {
            alias: 'p',
            desc: 'PCRE(PHP) formatted regex string. EX: #HTTP\/.*\..*#',
            type: 'string'
        });
        yargs.options('hostname', {
            alias: 'host',
            desc: 'PCRE(PHP) formatted regex string. EX: #.*\.host\.com#',
            type: 'string'
        });
        yargs.options('uri', {
            alias: 'u',
            desc: 'PCRE(PHP) formatted regex string. EX: #\/uri\/.*#',
            type: 'string'
        });
        yargs.options('method', {
            alias: 'm',
            desc: 'PCRE(PHP) formatted regex string. EX: #((GET)|(POST))#',
            type: 'string'
        });
        yargs.options('source-ip', {
            alias: 'si',
            desc: 'PCRE(PHP) formatted regex string. EX: #.*\..*\..*\..*#',
            type: 'string'
        });
        return yargs;
    })
    .command('playback', 'Plays back requests captured by a capture job.', (yargs) => {
        yargs.options('job-id', {
            alias: 'i',
            desc: '(Required) Specifies which job is to be played back.',
            type: 'number'
        });
        yargs.options('playback-speed', {
            alias: 'ps',
            desc: 'Specifies the speed at which requests are played back. [Default: 1]',
            type: 'number'
        });
        yargs.options('port', {
            alias: 'p',
            desc: 'Specifies which port to use for HTTP connections. [Default: 80]',
            type: 'number'
        });
        yargs.options('secure-port', {
            alias: 's',
            desc: 'Specifies which port to use for HTTPS connections. [Default: 443]',
            type: 'number'
        });
        yargs.options('request-buffer-time', {
            alias: 'r',
            desc: 'Specifies the size in milliseconds of the rolling request schedule window. [Default: 10000]',
            type: 'number'
        });
        yargs.options('target', {
            alias: 't',
            desc: 'Specifies where to send requests to (i.e. www.domain.com). [Default: localhost]',
            type: 'string'
        });
        yargs.options('skip-ssl-validity-check', {
            alias: ['skip-ssl', 'ssvc'],
            desc: 'Specifies whether or not to skip the ssl validity check [Default: true]',
            boolean: true
        });
        yargs.options('force-host-header', {
            alias: ['force-host', 'fh'],
            desc: 'Forces the request header\'s Host value to be set to the value specified by target [Default: false]',
            boolean: true
        });
        yargs.options('config-file', {
            alias: 'c',
            desc: 'Specifies a file containing json options.',
            type: 'string'
        });
        yargs.options('json', {
            alias: 'j',
            desc: 'User-specified json string with options.',
            type: 'string'
        });
        return yargs;
    })
    .help()
    .alias('h', 'help')
    .argv
let cmd_options = args;

/**********************************************************************************************************************/
/************************************************** UTILITY FUNCTIONS *************************************************/
/**********************************************************************************************************************/

Object.prototype.isEmpty = function() {
    for(let key in this) {
        if(this.hasOwnProperty(key))
            return false;
    }
    return true;
}

let fill_in_default_values = function(default_options, options) {
    // Fill in default values, if they're not already specified
    for (let [key, value] of Object.entries(default_options)) {
        if(options[key] === undefined) {
            options[key] = value;
        }
    }
}

// Clean inputs to avoid MySQL injections
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

    // Create an object containing only the changes made by the user
    let modified_options = {};
    for (let [key, value] of Object.entries(capture_job_row)) {
        if(options[key] !== undefined && options[key] !== capture_job_row[key]) {
            modified_options[key] = options[key];
        }
    }

    return modified_options;
}


/**********************************************************************************************************************/
/*************************************************** CAPTURE JOB LIST *************************************************/
/**********************************************************************************************************************/

if(args._.includes('capture-job-list')) {
    let default_options = {
        verbose: 0,
    };
    fill_in_default_values(default_options, cmd_options);

    let connection = mysql.createConnection(connection_arguments);
    connection.query('SELECT * FROM jobs;', function (error, results, fields) {
        if (error) throw error;

        if(results.length === 0) {
            console.log('There are no jobs to display');
        } else if(cmd_options.verbose === 0) {
            let fields = ['jobID', 'jobName'];
            console.log(columnify(results, {
                columns: fields,
                columnSplitter: ' | '
            }));
        } else if(cmd_options.verbose > 0) {
            let fields = Object.keys(results[0]);
            delete fields.isEmpty;
            console.log(columnify(results, {
                columns: fields,
                columnSplitter: ' | '
            }));
        }
    });
    connection.end();
}


/**********************************************************************************************************************/
/************************************************** CAPTURE JOB START *************************************************/
/**********************************************************************************************************************/

// Code for starting a capture job
if(args._.includes('capture-job-start')) {
    let default_options = {
        active: true,
        jobStart: null,
        jobStop: null,
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
    }
    scrub_sql_input(cmd_options);

    // SQL to create the job
    let connection = mysql.createConnection(connection_arguments);
    connection.query('INSERT INTO jobs (jobName, active, jobStart, jobStop, secure, protocol, host, uri, method, sourceip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [cmd_options.jobName, + cmd_options.active ? 1 : 0, cmd_options.jobStart, cmd_options.jobStop, cmd_options.secure, cmd_options.protocol,
            cmd_options.host, cmd_options.uri, cmd_options.method, cmd_options.sourceip], function (error, results, fields) {
            if(error) throw error;
            console.log('Insert operation complete');
    });
    connection.end();
}


/**********************************************************************************************************************/
/*************************************************** CAPTURE JOB EDIT *************************************************/
/**********************************************************************************************************************/

// Code for editing a capture job
if(args._.includes('capture-job-edit')) {
    // Validation
    if(cmd_options.jobId === undefined) {
        throw error('Job ID must be specified');
    }
    scrub_sql_input(cmd_options);

    let set_clause = build_set_clause(cmd_options);

    // SQL to create the job
    if(set_clause.isEmpty()) {
        console.log('No changes made - user specified options match the values already present in the database');
    } else {
    let connection = mysql.createConnection(connection_arguments);
        connection.query('UPDATE jobs SET ? WHERE jobID = ' + cmd_options.jobId + ';', set_clause, function (error, results, fields) {
            if(error) throw error;
            console.log('Update operation complete');
        });
        connection.end();
    }
}


/**********************************************************************************************************************/
/********************************************* PLAYBACK UTILITY FUNCTIONS *********************************************/
/**********************************************************************************************************************/

//This function forgoes completing a task for ms_delay milliseconds. //For our purposes, it is used to space out requests.
function delay_request (ms_delay,options,resolve,reject) {
    //The returned Promise will execute function resolve, which is dispatch_request defined right below, after ms_delay elapses.
    return new Promise(() => {setTimeout(()=> {resolve(options)},ms_delay)});
}

function delay_sql (ms_delay, param, func) {
    return new Promise(() => {setTimeout(()=> {func(param)}, ms_delay)});
}

/**********************************************************************************************************************/
/****************************************************** PLAYBACK  *****************************************************/
/**********************************************************************************************************************/

// Code for playback option
if(args._.includes('playback')) {
    // Build object out of arguments
    cmd_options = {};
    let default_options = {
        playbackSpeed: 1,
        target: 'localhost',
        port: 80,
        securePort: 443,
        requestBufferTime: 10000,
        skipSslValidityCheck: true,
        forceHostHeader: false,
        configFile: null,
        json: null
    };

    if(typeof args.configFile !== 'undefined' && args.configFile !== null) {
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

    if(typeof args.configFile !== 'undefined' && args.json !== null) {
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

    // Disable SSL if user has specified the command line option
    if(cmd_options.skipSslValidityCheck) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    //This function dispatches a request
    function dispatch_request(options) {
        let req_headers = new Object();
        let header_array = options.header.split("\r\n");
        for (i = 0; i < header_array.length - 1; i += 2)
        {
            req_headers[header_array[i]] = header_array[i + 1];
        }

        let req_options = {"hostname":cmd_options.target, "setHost":false, "path":options.uri, "headers":req_headers, "method":options.method, "port":8080};
        let editable_options = {
            'secure': options.secure,
            'reqbody': options.reqbody,
            'send_request': true
        };
        pre_request_hook(options, editable_options, req_options);

        // Calculate time left based off of the total time the job should take and the difference in time between
        // this request being sent and the previous request sent.
        let eta = Math.round(progress_bar.payload.aeta - ((options.utime - prev_utime) / cmd_options.playbackSpeed));
        let percent = Math.round((total_time - eta) / total_time * 100);
        percent = Number.isNaN(percent) ? 100 : percent;
        prev_utime = options.utime;

        progress_bar.increment(1, { aeta: eta, percent: (percent < 0 ? 0 : percent) });
        if(progress_bar.value >= count) {
            progress_bar.increment(0, { aeta: 0, percent: 100 })
            progress_bar.stop();
        }

        if(editable_options.send_request === true) {
            //Select the correct request class
            let webreq = editable_options['secure'] ? https : http;
            req_options.port = editable_options['secure'] ? cmd_options.securePort : cmd_options.port;

            // Overrides the 'Host' key in the request headers if the user has specified this option
            if(cmd_options.forceHostHeader) {
                req_options.headers.Host = cmd_options.target;
            }

            let req;
            try {
                req = webreq.request(req_options, (res) => {
                    request_callback_hook(res);
                }); //Create the request

            if(editable_options['reqbody'] != "")
                req.write(options.reqbody);
                post_request_hook(req, options);
                req.end();
            } catch(err) {
                console.log(err);
            }
        }
    }

    // Get the number of requests and the job duration time for use in a progress bar
    let sync_connection = new mysql_sync(connection_arguments);
    let count;
    let max_time;
    let min_time;
    let prev_utime;
    try {
        count = sync_connection.query('SELECT COUNT(*) FROM v_record where jobID = ' + cmd_options.jobId);
        max_time = sync_connection.query('SELECT MAX(utime) FROM v_record where jobID = ' + cmd_options.jobId);
        min_time = sync_connection.query('SELECT MIN(utime) FROM v_record where jobID = ' + cmd_options.jobId);
    } catch(err) {
        console.log(err)
    }
    count = count[0]["COUNT(*)"]
    min_time = min_time[0]["MIN(utime)"];
    let total_time = (max_time[0]["MAX(utime)"] - min_time) / cmd_options.playbackSpeed;

    const progress_bar = new cli_progress.SingleBar({
        format: 'CLI Progress | {bar} | ETA {aeta}s | {percent}% Complete | {value}/{total} Requests Sent | Duration {duration_formatted}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    if(count <= 0) {
        console.log('Playback ended -- There are no requests associated with jobId ' + cmd_options.jobId);
    } else {
        progress_bar.start(count, 0, { aeta: Math.round(total_time), percent: 0 });

        let scheduler = function(new_req_time) {
            if(new_req_time < (Date.now() + cmd_options.requestBufferTime)) {
                connection.resume();
            }
            else {
                delay_sql(cmd_options.requestBufferTime / 100, new_req_time, scheduler);
            }
        }

        // Attempt to create a connection using the arguments above.
        let connection = mysql.createConnection(connection_arguments);
        let query = connection.query('SELECT * FROM v_record where jobID = ' + cmd_options.jobId + ' ORDER BY utime ASC');

        // Variables needed for scheduling requests
        let base_request_time = 0;
        let base_local_time = 0;
        let newest_request_time = 0;

        query.on('error', function(err) {
        })
        .on('fields', function(fields) {
        })
        .on('result', function(row) {
            //Must be our first row.
            if(base_request_time == 0)
            {
                base_request_time = row.utime * 1000;
                prev_utime = row.utime;
            }

            let sleep_time = (row.utime * 1000) - base_request_time;
            sleep_time = sleep_time / cmd_options.playbackSpeed;
            sleep_time = sleep_time - (Date.now() - ((base_local_time == 0) ? base_local_time = Date.now() : base_local_time));

            newest_request_time = Date.now() + sleep_time;
            delay_request(sleep_time, row, dispatch_request, null);

            if(newest_request_time > (Date.now() + cmd_options.requestBufferTime)) {
                connection.pause();

                delay_sql(cmd_options.requestBufferTime / 100, newest_request_time, scheduler);
            }
        })
        .on('end', function() {
        });

        //Close the connection.
        connection.end();
    }
}
