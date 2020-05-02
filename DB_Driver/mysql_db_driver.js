var mysql = require('mysql');

// pre-defined configuration info, change it or pass as argument from other side.
const default_configuration = {
    host: "localhost",
    user: "traffic",
    password: "12345",
    database: "traffic_log"
}

var connection;

/**
 * Connect to MySQL Server, throw error if there is a connection error.
 */
function connect(config) {
    if (config === undefined) {
        connection = mysql.createConnection(default_configuration);
    } else {
        connection = mysql.createConnection(config);
    }
    connection.connect((err) => {
        if (err) {
            throw err;
        } else {
            console.log("==> MySQL Traffic Database Connected Successfully!");
        }
    });
}

/**
 * close MySQL connection
 */
function close() {
    if (connection) {
        connection.end((err) => {
            if (err)
                throw err;
            console.log("==> MySQL Connection Ended!");
            connection = undefined;
        });   
    }
}

/**
 * function to run a custom query with Promise object returned
 * @param {String} query - query as String
 */
function query(query) {
    let mycon = connection;
    return new Promise(function (resolve, reject) {
        if (mycon) {
            mycon.query(query, function (error, result, fields) {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        } else {
            reject(new Error("Error! No database connection yet!"));
        }   
    }); 
}

/**
 * function to run a custom query with callback function returned
 * @param {String} query - query as String
 * @param {*} callback - callback function to handle query result, function (result, error) {}
 */
function query_callback(query, callback) {
    if (connection) {
        connection.query(query, function (error, result, fields) {
            return callback(result, error);
        });
    } else {
        return callback(null, "Error! No database connection yet!");
    }
}

/**
 * escape data like Boolean, Date object, String, Arrays, underfine/null into
 * normal SQL query data to avoid SQL injection attack. use for user input.
 * @param {*} data - any data
 */
function escape_data(data) {
    return mysql.escape(data);
}

/**
 * escape integer into String, like 5 => '5'
 * @param {Number} int - integer value
 */
function escape_int(int) {
    return mysql.escapeId(int);
}

// export all functions
module.exports = {
    connect,
    query,
    query_callback,
    close,
    escape_data,
    escape_int
};