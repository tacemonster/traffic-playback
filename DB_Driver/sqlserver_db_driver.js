var mssql = require("mssql");

// config for your database
const default_configuration = {
    user: 'sa',
    password: 'your_password',
    server: 'localhost',
    database: 'traffic'
};

var sql_request;

/**
 * connect to SQL Server
 */
connect = (configuration) => {
    var config;
    if (configuration_info === undefined) {
        config = default_configuration;
    } else {
        config = configuration;
    }

    mssql.connect(config, function (err) {
        if (err)
            throw err;
        sql_request = new mssql.Request();
        console.log("==> Connected to SQL Server.");
    });
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

module.exports = {
    connect,
    query,
    query_callback
}