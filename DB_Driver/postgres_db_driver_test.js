var postgre_driver = require("./postgres_db_driver");

const config = {
    user: "traffic",
    password: "12345",
    host: "localhost",
    database: "traffic_log",
    port: 5432,
};

postgre_driver.connect(config);

postgre_driver.query("select * from test").then((res) => console.log(res)).catch((err) => console.log(err));

postgre_driver.query("select * from test2")
    .then((res) => {
        console.log(res);
        postgre_driver.close();  // must close connection within callback when everything is done.
    })
    .catch((err) => {
        console.log(err);
        postgre_driver.close();  // must close connection within callback when everything is done.
    });