var mysql = require('mariadb/callback');

// pre-defined configuration info, change it or pass as argument from other side.
const default_config = {
    host: "localhost",
    user: "traffic",
    password: "12345",
    database: "traffic_log",
};

class DB_Driver {
    constructor() {
        this.con = null;
    }

    /**
     * Connect to Maria Server
     */
    connect(custom_config) {
        if (custom_config) {
            this.con = mysql.createConnection(custom_config);
        } else {
            this.con = mysql.createConnection(default_config);
        }

        this.con.connect((err) => {
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
    close() {
        if (this.con) {
            this.con.end((err) => {
                if (err) throw err;
                console.log("==> MariaDB Connection Ended!");
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
                return callback(result, error);
            });
        } else {
            return callback(null, "Error! No database connection yet!");
        }
    }
}

module.exports = {
    DB_Driver: DB_Driver,
};