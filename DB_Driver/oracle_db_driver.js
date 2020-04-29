var myOracle = require('oracledb');

const default_config = {
    user: "oracle",
    password: "my_password",
    connectString: "",
    
};

myOracle.outFormat = myOracle.OUT_FORMAT_OBJECT;

var oracle_client;

async function connect(custom_config) {
    let config;
    if (oracle_client === undefined) {
        if (custom_config)
            config = custom_config;
        else
            config = default_config;
        
        try {
            oracle_client = await myOracle.getConnection(config);
            console.log('connected to Oracle database');
        } catch (err) {
            console.log('Error Message: ' + err);
        }
    }
}

function query(query) {
    return new Promise((resolve, reject) => {
        if (oracle_client) {
            oracle_client.execute(query)
                .then((res) => {
                    resolve(res.rows);
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject(new Error("Error! No database connection yet!"));
        }
    });
}

function query_callback(query, callback) {
    if (oracle_client) {
        oracle_client.execute(query)
            .then((res) => {
                return callback(res.rows, null);
            })
            .catch((err) => {
                return callback(null, err);
            });
    } else {
        return callback(null, "Error! No database connection yet!");
    }
}

function close() {
    if (oracle_client) {
        oracle_client.close()
            .then(console.log("Oracle driver disconnected"))
            .catch(err => console.log(err));
        oracle_client = undefined;
    }
}

module.exports = {
    connect,
    query,
    query_callback,
    close,
};