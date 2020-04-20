// For database driver testing only.

var my_database = require('./mysql_db_driver').DB_Driver;  // import db driver module
const database_driver = new my_database();  // instantiate class

database_driver.connect();  // connect to MySQL

// run query with Promise object returned
database_driver.query("select * from log where id = 2")
    .then((result) => { console.log(result); })  // handle response
    .catch((err) => console.log(err));           // handle error

// another way to handle response
database_driver.query("select * from log where id = 3")
    .then(handleResponse)
    .catch(handleError);

// as example, get all result from 'log' table
database_driver.query_get_all().then(handleResponse).catch(handleError);

// run query with callback function returned
database_driver.query_callback("select * from log where id=4", function (res, err) {
    if (err) {
        // handle error
        console.log(err);
    } else {
        // handle response
        console.log(res);
    }        
});

function handleResponse(res) {
    console.log(res);
}

function handleError(error) {
    console.log(error);
}

database_driver.close();