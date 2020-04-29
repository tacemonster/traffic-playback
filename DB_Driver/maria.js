var maria = require("mariadb/callback");

const default_config = {
    host: "localhost",
    user: "your_user_name",
    password: "your_password",
};

var conn;

function connect(custom_config) {
    if (conn === undefined) {
        if (custom_config)
            conn = maria.createConnection(custom_config);
        else
            conn = maria.createConnection(default_config);
        conn.connect(err => {
            if (err) {
                console.log("not connected due to error: " + err);
            } else {
                console.log("connected ! connection id is " + conn.threadId);
            }
        });
    }
}

function query_callback(query, callback) {
    if (conn) {
        conn.query(query, (err, rows, meta) => {
            if (err)
                return callback(null, err);
            return callback(rows, null);
        });
    } else {
        return callback(null, "No connection yet!");
    }
}

function close() {
    if (conn) {
        conn.end()(err => {
            if (err)
                console.log(err);
            console.log("==> MariaDB Client Disconnected");
            conn = undefined;
        });
    }
}

module.exports = {
    connect,
    query_callback,
    close,
};
