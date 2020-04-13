var mysql = require('mysql');

const connection_information = {
    host: "localhost",
    user: "traffic",
    password: "12345",
    database: "traffic_log"
}

// a db driver class to handle MySQL connection, query, etc
class DB_Driver {
    constructor() {
        this.con = null;
    }

    // Connect to MySQL Server, throw error if there is a connection error.
    connect() {
        this.con = mysql.createConnection(connection_information);
        this.con.connect((err) => {
            if (err) {
                throw err;
            } else {
                console.log("MySQL Traffic Database Connected Successfully!");
            }
        })
    }

    // close MySQL connection
    disconnect() {
        if (this.con) {
            this.con.end();
            console.log("MySQL Connection Ended!");
        }
    }

    hello() {
        console.log("Hello from database driver");
    }

    // function to run a custom query with Promise object returned
    query(q) {
        let mycon = this.con;
        return new Promise(function (resolve, reject) {
            if (mycon) {
                mycon.query(q, function (error, result, fields) {
                    if (error) {
                        reject(error);
                    }
                    // console.log(result);
                    // console.log(fields);
                    resolve(result);
                });
            } else {
                reject(new Error("Error! No database connection yet!"));
            }   
        }); 
    }

    // function to run a custom query with callback function returned
    query_callback(q, callback) {
        if (this.con) {
            this.con.query(q, function (error, result, fields) {
                // if (error) {
                //     throw error;
                // }
                // console.log(result);
                return callback(result, error);
            });
        } else {
            return callback(null, "Error! No database connection yet!");
        }
    }

    // to get all data.
    query_get_all() {
        return this.query("select * from log");
    }
}


/**
 * export this module
 * we can import and use this module by:
 *   var my_database = require('./db_driver').DB_Driver;    // import the module
 *   const database_driver = new my_database();   // instantiate the class
 *   database_driver.connect();     // connect to MySQL
 *   database_driver.query("select * from log")   // run query
 *   database_driver.disconnect();   // close connection at the end.
 */
module.exports = {
    DB_Driver: DB_Driver
}