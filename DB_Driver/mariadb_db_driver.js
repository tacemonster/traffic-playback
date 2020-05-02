var mysql = require('mariadb/callback');

// pre-defined configuration info, change it or pass as argument from other side.
const default_config = {
    host: "localhost",
    user: "traffic",
    password: "12345",
    database: "traffic_log",
};

var connection;
// connect
function connect(custom_config) {
    if (custom_config) {
        connection = mysql.createConnection(custom_config);
    } else {
        connection = mysql.createConnection(default_config);
    }

    connection.connect((err) => {
        if (err) {
            throw err;
        } else {
            console.log("==> MariaDB Connected Successfully!");
        }
    });
}

/**
 * close MariaDB connection
 */
function close() {
    if (connection) {
        connection.end((err) => {
            if (err) throw err;
            console.log("==> MariaDB Connection Ended!");
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
 * @param {*} callback - callback function to handle query result, param (result, error)
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

module.exports = {
    connect,
    query,
    query_callback,
    close,
}