var { Client } = require('pg');

const default_config = {
    user: 'postgres',
    host: 'localhost',
    database: 'your_database',
    password: 'postgres',
    port: 5432
};

var pg_client;

function connect(custom_config) {
    if (custom_config) {
        pg_client = new Client(custom_config);
    } else {
        // use default config listed from the beginning of this file
        pg_client = new Client(default_config);
    }
    pg_client.connect(err => {
        if (err)
            console.log('connection error', err.stack);
        else
            console.log('connected to postgres');
    })
}

// Promise returned
function query(query) {
    return new Promise((resolve, reject) => {
        if (pg_client) {
            pg_client.query(query, (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        } else {
            reject(new Error("Error! No database connection yet!"));
        }
    });
}

// callback returned
function query_callback(query, callback) {
    if (pg_client) {
        pg_client.query(query, (err, res) => {
            return callback(res, err);
        });
    } else {
        return callback(null, "Error! No database connection yet!");
    }
}

function close() {
    if (pg_client) {
        pg_client.close((err) => {
            if (err)
                console.log(err);
            else
                console.log('postgres client disconnected');
        })
    } else {
        console.log("Not connected yet");
    }
}

module.exports = {
    connect,
    query,
    query_callback,
    close
}