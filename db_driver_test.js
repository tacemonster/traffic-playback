var my_database = require('./db_driver').DB_Driver;
const database_driver = new my_database();

database_driver.hello();
database_driver.connect();

// run query with Promise object returned
database_driver.query("select * from log where id = 2")
    .then((result) => { console.log(result); })  // handle response
    .catch((err) => console.log(err));           // handle error

database_driver.query("select * from log where id = 3")
    .then(handleResponse)
    .catch(handleError);

// get all result from 'log' table
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

function handleError(e) {
    console.log(e);
}

database_driver.disconnect();