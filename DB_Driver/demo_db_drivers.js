const drivers = require('./');  // contain all database drivers
const config = {
    host: "localhost",
    user: "traffic",
    password: "12345",
    database: "traffic_log",
};

/*********** MySQL Demo **********/
let mysql = drivers.mysql_driver;  // MySQL driver
mysql.connect(config);   // connect
mysql.query("select * from log where id < 3").then((res) => console.log(res)).catch((err) => console.log(err));
mysql.query_callback('select * from log where id=5', function (result, error) { console.log(result); });
mysql.close();  // close connection.

/*********** MariaDB Demo: (Uncomment and change config and query to test) ********/
/*
let maria = drivers.mariadb_driver;  // MariaDB driver
maria.connect(config);
maria.query("select * from log where id < 3").then((res) => console.log(res)).catch((err) => console.log(err));
maria.query_callback('select * from log', function (result, error) {
    console.log(result);
    maria.close();  // must close connection within callback when no longer need.
});
*/

/*********** Postgres Demo (Uncomment and change config and query to test) *********/
// let postgres = drivers.postgres_driver;
// postgres.connect(config);
// postgres.query("select * from test").then((res) => console.log(res)).catch((err) => console.log(err));
// postgres.query_callback('select * from test2', function (result, error) {
//     console.log(result);
//     postgres.close();  // must close connection within callback when no longer need.
// });

/*********** SQL Server Demo (Uncomment and change config and query to test) *********/
/*
let sqlserver = drivers.sqlserver_driver;
sqlserver.connect(config);
sqlserver.query_callback('select * from table', function (result, error) {
    console.log(result);
});
*/

/*********** Oracle DB Demo (Uncomment and change config and query to test) *********/
/*
let oracle = drivers.oracle_driver;
oracle.connect(config);
oracle.query_callback('select * from table', function (result, error) {
    console.log(result);
    oracle.close();
});
*/