var mssql = require("mssql");

// config for your database
const configuration = {
    user: 'sa',
    password: 'your_password',
    server: 'localhost',
    database: 'traffic'
};

var sql_request = null;

/**
 * connect to SQL Server
 */
connect = (configuration_info) => {
    var config;
    if (configuration_info === undefined) {
        config = configuration;
    } else {
        config = configuration_info;
    }

    mssql.connect(config, function (err) {
        if (err)
            throw err;
        sql_request = new mssql.Request();
        console.log("Connected to SQL Server.");
    })
}

/**
 * run custom sql server query with Promise return
 */
query = (query) => {
    return new Promise(function (resolve, reject) {
        if (sql_request) {
            sql_request.query(query, function (err, res) {
                if (err)
                    reject(err);
                resolve(res);
            });
        }
        else {
            reject(new Error("Error! No database connection yet!"));
        }
    }); 
}

/**
 * run custom sql server query with callback
 */
query_callback = (query, callback) => {
    if (sql_request) {
        sql_request.query(query, function (err, res) {
            return callback(res, err);
        });
    } else {
        return callback(null, "Error! No database connection yet!");
    }
}

/**
 * export functions, use by:
 *      var mssql = require('./sqlserver_db_driver.js');
 *      mssql.connect();
 *      mssql.query("select * from table").then(handle_result).catch(handle_error);
 *      mssql.query_callback("select * from table", function(res, err){handle});
 */
module.exports = {
    connect,
    query,
    query_callback
}