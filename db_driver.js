var mysql = require('mysql');

const connection_information = {
    host: "localhost",
    user: "traffic",
    password: "12345",
    database: "traffic_log"
}

/**
 * a db driver class to handle MySQL connection, query, etc
 */
class DB_Driver {
    constructor() {
        this.con = null;
    }

    /**
     * Connect to MySQL Server, throw error if there is a connection error.
     */
    connect() {
        this.con = mysql.createConnection(connection_information);
        this.con.connect((err) => {
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
    close() {
        if (this.con) {
            this.con.end((err) => {
                if (err)
                    throw err;
                console.log("==> MySQL Connection Ended!");
            });   
        }
    }

    /**
     * function to run a custom query with Promise object returned
     * @param {String} query - query as String
     */
    query(query) {
        let mycon = this.con;
        return new Promise(function (resolve, reject) {
            if (mycon) {
                mycon.query(query, function (error, result, fields) {
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

    /**
     * function to run a custom query with callback function returned
     * @param {String} query - query as String
     * @param {*} callback - callback function to handle query result, param (result, error)
     */
    query_callback(query, callback) {
        if (this.con) {
            this.con.query(query, function (error, result, fields) {
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

    /**
     * Get everything from log table.
     */
    query_get_all() {
        return this.query("select * from log");
    }

    /**
     * escape data like Boolean, Date object, String, Arrays, underfine/null into
     * normal SQL query data to avoid SQL injection attack. use for user input.
     * @param {*} data - any data
     */
    escape_data(data) {
        return mysql.escape(data);
    }

    /**
     * escape integer into String, like 5 => '5'
     * @param {Number} int - integer value
     */
    escape_int(int) {
        return mysql.escapeId(int);
    }
}

/**
 * export this module
 * we can import and use this module by:
 *   var my_database = require('./db_driver').DB_Driver;    // import the module
 *   const database_driver = new my_database();   // instantiate the class
 *   database_driver.connect();     // connect to MySQL
 *   database_driver.query("select * from log").then().catch();   // run query
 *   database_driver.close();   // close connection at the end.
 */
module.exports = {
    DB_Driver: DB_Driver
}